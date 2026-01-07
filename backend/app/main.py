# Copilot: Analyze the entire backend project structure.
# Explain how data flows from API routes to database models.
# Identify where auth, orders, products, and inventory logic live.
# Do NOT modify code yet.


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .models import user, product, order
from .routers import auth, products, orders, dashboard
import sys
print(f"DEBUG: Loading auth from {auth.__file__}")
print(f"DEBUG: sys.path: {sys.path}")

# Create Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="WholesaleMart API")

# CORS (Allow Frontend to talk to Backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(dashboard.router)

@app.get("/")
def read_root():
    return {"message": "WholesaleMart Backend is Running"}
