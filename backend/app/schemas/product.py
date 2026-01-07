from pydantic import BaseModel, ConfigDict
from typing import Optional
from uuid import UUID
from datetime import datetime

class ProductBase(BaseModel):
    sku: str
    name: str
    description: Optional[str] = None
    price: float
    stock: int
    status: str = "active" # active, inactive
    category: str

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    status: Optional[str] = None
    category: Optional[str] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class ProductResponse(ProductBase):
    id: UUID
    created_at: datetime
