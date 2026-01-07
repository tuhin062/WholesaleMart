from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from ..database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    readable_id = Column(Integer, unique=True, autoincrement=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    total = Column(Float, default=0.0)
    # Order-level status captures the overall progression of the shipment
    status = Column(String, default="pending") 
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User")
    items = relationship("OrderItem", back_populates="order")

    @property
    def customer_phone(self):
        return self.user.phone if self.user else None

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, default=1)
    price = Column(Float, nullable=False)
    
    # Values: active, cancelled, shipped, delivered
    status = Column(String, default="active", server_default="active")

    order = relationship("Order", back_populates="items")
    product = relationship("Product")

    @property
    def product_name(self):
        return self.product.name if self.product else "Unknown Product"
