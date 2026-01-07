from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class OrderItemCreate(BaseModel):
    product_id: UUID
    quantity: int


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]

class ItemCancel(BaseModel):
    order_item_id: UUID
    reason: Optional[str] = "damaged"

class ItemCancelRequest(BaseModel):
    items: List[ItemCancel]

class OrderItemResponse(BaseModel):
    id: UUID
    product_id: UUID
    quantity: int
    price: float
    product_name: str
    status: str = "active"

    model_config = ConfigDict(from_attributes=True)


class OrderResponse(BaseModel):
    id: UUID
    readable_id: Optional[int] = None
    user_id: UUID
    customer_phone: Optional[str] = None
    total: float  # total_original
    status: str
    created_at: datetime
    items: List[OrderItemResponse]
    
    # Calculated Fields (Refund-Ready)
    total_fulfilled: float
    total_refundable: float

    model_config = ConfigDict(from_attributes=True)
