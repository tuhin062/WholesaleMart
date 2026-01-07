from .database import SessionLocal, engine, Base
from .models import user, product, order # Import all models to ensure they are registered
from .core.security import get_password_hash

def seed_admin():
    # Create Tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    # Check if admin already exists
    existing = db.query(user.User).filter(user.User.email == "admin@wholesalemart.com").first()
    if not existing:
        print("Creating Admin User...")
        admin = user.User(
            name="Super Admin",
            email="admin@wholesalemart.com",
            password_hash=get_password_hash("admin123"),
            role="admin"
        )
        db.add(admin)
        db.commit()
        print("Admin user created: admin@wholesalemart.com / admin123")
    else:
        print("Admin user already exists.")
    db.close()

if __name__ == "__main__":
    seed_admin()
