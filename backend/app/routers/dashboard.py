from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any
from ..database import get_db
from ..models.order import Order, OrderItem
from ..models.product import Product
from ..models.user import User
from ..core.dependencies import require_admin
from datetime import datetime, timedelta

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    # 1. Total Revenue (Excluding cancelled orders)
    total_revenue = db.query(func.sum(Order.total)).filter(Order.status != "cancelled").scalar() or 0.0

    # 2. Pending Orders Count
    pending_orders_count = db.query(func.count(Order.id)).filter(Order.status == "pending").scalar() or 0

    # 3. Active Products Count
    active_products_count = db.query(func.count(Product.id)).filter(Product.status == "active").scalar() or 0

    # 4. Total Customers
    total_customers = db.query(func.count(User.id)).filter(User.role == "customer").scalar() or 0

    # 5. Low Stock Alert (Stock < 10)
    low_stock_products = db.query(Product).filter(Product.stock < 10, Product.status == "active").all()
    low_stock_count = len(low_stock_products)

    # 6. Recent Orders (Last 5)
    recent_orders = db.query(Order).order_by(Order.created_at.desc()).limit(5).all()
    
    # 7. Revenue Trend (Last 7 days) - Simple calculation
    revenue_trend = []
    for i in range(6, -1, -1):
        date = (datetime.now() - timedelta(days=i)).date()
        daily_revenue = db.query(func.sum(Order.total)).filter(
            func.date(Order.created_at) == date,
            Order.status != "cancelled"
        ).scalar() or 0.0
        revenue_trend.append({
            "date": date.strftime("%b %d"),
            "revenue": daily_revenue
        })

    return {
        "kpis": {
            "totalRevenue": total_revenue,
            "pendingOrders": pending_orders_count,
            "activeProducts": active_products_count,
            "totalCustomers": total_customers,
            "lowStockCount": low_stock_count
        },
        "recentOrders": [
            {
                "id": str(o.id),
                "readableId": o.readable_id,
                "customer": o.customer_phone or "App User",
                "total": o.total,
                "status": o.status,
                "createdAt": o.created_at
            } for o in recent_orders
        ],
        "lowStockItems": [
            {
                "id": str(p.id),
                "name": p.name,
                "stock": p.stock,
                "price": p.price
            } for p in low_stock_products
        ],
        "revenueTrend": revenue_trend
    }
