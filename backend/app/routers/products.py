from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from ..database import get_db
from ..models.product import Product as ProductModel
from ..schemas.product import ProductCreate, ProductUpdate, ProductResponse
from ..core.dependencies import require_admin, get_current_user, get_current_user_optional

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

@router.get("/catalog/public", response_model=List[ProductResponse])
def read_products_public(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Public Catalog: Strictly returns ONLY active products."""
    products = db.query(ProductModel).filter(ProductModel.status == "active").offset(skip).limit(limit).all()
    return products

@router.get("/manage/admin", response_model=List[ProductResponse], dependencies=[Depends(require_admin)])
def read_products_admin(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Admin Management: Returns all products regardless of status."""
    products = db.query(ProductModel).offset(skip).limit(limit).all()
    return products

@router.get("/detail/{product_id}", response_model=ProductResponse)
def read_product(product_id: UUID, db: Session = Depends(get_db), current_user = Depends(get_current_user_optional)):
    """Individual Product Detail."""
    query = db.query(ProductModel).filter(ProductModel.id == product_id)
    if not current_user or current_user.role != "admin":
        query = query.filter(ProductModel.status == "active")
    product = query.first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found or inactive")
    return product

@router.post("/", response_model=ProductResponse, dependencies=[Depends(require_admin)])
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    existing = db.query(ProductModel).filter(ProductModel.sku == product.sku).first()
    if existing:
        raise HTTPException(status_code=400, detail="Product with this SKU already exists")
    product.status = product.status.strip().lower()
    if product.status not in ["active", "inactive"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    db_product = ProductModel(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.put("/{product_id}", response_model=ProductResponse, dependencies=[Depends(require_admin)])
def update_product(product_id: UUID, product_update: ProductUpdate, db: Session = Depends(get_db)):
    db_product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    update_data = product_update.model_dump(exclude_unset=True)
    if "status" in update_data:
        status = update_data["status"].strip().lower()
        if status not in ["active", "inactive"]:
            raise HTTPException(status_code=400, detail="Invalid status")
        update_data["status"] = status
    for key, value in update_data.items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.patch("/{product_id}/status", response_model=ProductResponse, dependencies=[Depends(require_admin)])
def toggle_product_status(product_id: UUID, status: str, db: Session = Depends(get_db)):
    status = status.strip().lower()
    if status not in ["active", "inactive"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    db_product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db_product.status = status
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/{product_id}", dependencies=[Depends(require_admin)])
def delete_product(product_id: UUID, db: Session = Depends(get_db)):
    db_product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted successfully"}
