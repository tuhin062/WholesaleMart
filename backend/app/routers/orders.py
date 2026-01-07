from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload, selectinload
from typing import List
from uuid import UUID
from ..database import get_db
from ..models.order import Order, OrderItem
from ..models.product import Product
from ..models.user import User as UserModel
from ..schemas.order import OrderCreate, OrderResponse, OrderItemResponse, ItemCancelRequest
from ..core.dependencies import get_current_user, require_admin

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)

def calculate_order_totals(order: Order):
    """
    Calculates fulfilled and refundable totals based on item statuses.
    This ensures refund logic is always derived and future-proof.
    """
    total_fulfilled = 0.0
    total_original = 0.0
    
    for item in order.items:
        item_total = item.price * item.quantity
        total_original += item_total
        if item.status != "cancelled":
            total_fulfilled += item_total
            
    return total_original, total_fulfilled, max(0.0, total_original - total_fulfilled)

@router.post("/", response_model=OrderResponse)
def create_order(order_data: OrderCreate, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    """Create a new order with atomic stock deduction and price snapshotting."""
    total_price = 0.0
    db_items = []
    
    # 1. Validate and Deduct Stock (with pessimistic locking)
    for item in order_data.items:
        product = db.query(Product).filter(Product.id == item.product_id).with_for_update().first()
        
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        
        if product.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")
        
        # Deduct stock
        product.stock -= item.quantity
        
        # Calculate price based on current product price (snapshot at order time)
        item_total = product.price * item.quantity
        total_price += item_total
        
        # Create Order Item Model
        db_item = OrderItem(
            product_id=product.id,
            quantity=item.quantity,
            price=product.price
        )
        db_items.append(db_item)

    # 2. Create Order
    new_order = Order(
        user_id=current_user.id,
        total=total_price,
        status="pending"
    )
    db.add(new_order)
    db.flush()

    # 3. Link Items to Order
    for db_item in db_items:
        db_item.order_id = new_order.id
        db.add(db_item)
    
    db.commit()
    db.refresh(new_order)
    
    # Inject derived fields for response
    _, new_order.total_fulfilled, new_order.total_refundable = calculate_order_totals(new_order)
    
    return new_order


@router.get("/", response_model=List[OrderResponse])
def read_orders(db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    """
    Fetch orders with role-based filtering.
    Admin: sees ALL orders in the system.
    Customer: sees ONLY their own orders.
    """
    query = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.product), 
        joinedload(Order.user)
    )

    if current_user.role == "admin":
        # ADMIN: Fetch ALL orders without any user filter
        orders = query.order_by(Order.created_at.desc()).all()
    else:
        # CUSTOMER: Filter by user_id
        orders = query.filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()

    # Dynamic property injection for Pydantic response
    for order in orders:
        _, order.total_fulfilled, order.total_refundable = calculate_order_totals(order)
    
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
def read_order(order_id: UUID, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    """Fetch single order detail with calculated totals."""
    order = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.product),
        joinedload(Order.user)
    ).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if current_user.role != "admin" and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this order")

    _, order.total_fulfilled, order.total_refundable = calculate_order_totals(order)
    return order

@router.put("/{order_id}/status", response_model=OrderResponse)
def update_order_status(order_id: UUID, status: str, db: Session = Depends(get_db), current_user: UserModel = Depends(require_admin)):
    """
    Update order status with strict state machine enforcement.
    Also cascades status changes to items when moving to shipped/delivered.
    """
    order = db.query(Order).options(joinedload(Order.items)).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Terminal State Check
    if order.status in ["delivered", "cancelled"]:
        raise HTTPException(status_code=400, detail=f"Cannot modify order in terminal state: {order.status}")

    # State Machine Validation
    valid_transitions = {
        "pending": ["processing", "cancelled"],
        "processing": ["partially_shipped", "shipped", "cancelled"],
        "partially_shipped": ["shipped", "cancelled"],
        "shipped": ["delivered"]
    }

    if status not in valid_transitions.get(order.status, []):
        raise HTTPException(
            status_code=400, 
            detail=f"Illegal transition from {order.status} to {status}. Allowed: {valid_transitions.get(order.status, [])}"
        )

    # Delegate to cancel endpoint for full cancellation
    if status == "cancelled":
        return cancel_order(order_id, db, current_user)

    order.status = status

    # Item Status Synchronization (addresses GAP 1 from audit)
    # Side-effect: When order moves to shipped or delivered, items must follow
    if status == "shipped":
        for item in order.items:
            # Only transition 'active' items to 'shipped'. Cancelled items remain cancelled.
            if item.status == "active":
                item.status = "shipped"
    elif status == "delivered":
        for item in order.items:
            # Transition 'shipped' items to 'delivered'
            if item.status == "shipped":
                item.status = "delivered"

    db.commit()
    db.refresh(order)
    _, order.total_fulfilled, order.total_refundable = calculate_order_totals(order)
    return order

@router.post("/{order_id}/cancel", response_model=OrderResponse)
def cancel_order(order_id: UUID, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    """
    Scenario A: Full Order Cancellation
    - Restocks ALL non-cancelled items
    - Customers can only cancel if 'pending'
    - Admins can cancel anytime before terminal state
    """
    order = db.query(Order).options(selectinload(Order.items).selectinload(OrderItem.product)).filter(Order.id == order_id).with_for_update().first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Permission & State Logic
    if current_user.role != "admin":
        if order.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
        if order.status != "pending":
            raise HTTPException(status_code=400, detail="Customers can only cancel pending orders")
    
    if order.status in ["delivered", "cancelled"]:
        raise HTTPException(status_code=400, detail="Order is already in a terminal state")

    # RESTOCK Logic for Full Cancellation
    for item in order.items:
        if item.status != "cancelled":
            item.product.stock += item.quantity
            item.status = "cancelled"
            
    order.status = "cancelled"
    db.commit()
    db.refresh(order)
    _, order.total_fulfilled, order.total_refundable = calculate_order_totals(order)
    return order


@router.post("/{order_id}/items/cancel", response_model=OrderResponse, dependencies=[Depends(require_admin)])
def cancel_order_items(order_id: UUID, cancel_data: ItemCancelRequest, db: Session = Depends(get_db)):
    """
    Scenario B: Partial Cancellation (Warehouse Damage)
    - Cancels specific items permanently
    - DOES NOT restock items (marked as loss)
    - Updates order status to 'partially_shipped' if not already deeper in flow
    """
    order = db.query(Order).options(selectinload(Order.items)).filter(Order.id == order_id).with_for_update().first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    if order.status in ["shipped", "delivered", "cancelled"]:
        raise HTTPException(status_code=400, detail=f"Cannot cancel items for order in state: {order.status}")

    cancel_ids = [item.order_item_id for item in cancel_data.items]
    found_any = False
    for item in order.items:
        if item.id in cancel_ids:
            # Immutability Guard: Only allow cancelling 'active' items
            if item.status != "active":
                raise HTTPException(
                    status_code=400, 
                    detail=f"Item {item.id} is in status '{item.status}' and cannot be cancelled"
                )
            
            item.status = "cancelled"
            found_any = True
            
    if not found_any:
        raise HTTPException(status_code=400, detail="No active items found with provided IDs")

    # Update order level status if transitioning from processing
    if order.status == "processing":
        order.status = "partially_shipped"

    db.commit()
    db.refresh(order)
    _, order.total_fulfilled, order.total_refundable = calculate_order_totals(order)
    return order
