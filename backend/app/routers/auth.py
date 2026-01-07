from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.user import UserCreate, UserLogin, UserResponse, OTPRequest, OTPVerify
from ..schemas.token import Token
from ..models.user import User as UserModel
from ..core.security import verify_password, create_access_token, get_password_hash
from datetime import timedelta

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/login", response_model=Token)
async def login_for_access_token(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.email == user_in.email).first()
    
    if not user or not verify_password(user_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is admin
    if user.role != 'admin':
        raise HTTPException(status_code=403, detail="Not authorized as admin")

    access_token = create_access_token(subject=user.id, role=user.role)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/otp/send")
async def send_otp(otp_in: OTPRequest):
    # SIMULATED OTP LOGIC
    print(f"------------ MOCK SMS ----------")
    print(f"To: {otp_in.phone_number}")
    print(f"Code: 123456")
    print(f"--------------------------------")
    return {"message": "OTP sent successfully"}

@router.post("/otp/verify", response_model=Token)
async def verify_otp(otp_in: OTPVerify, db: Session = Depends(get_db)):
    # 1. Verify Code (Hardcoded for Simulation)
    if otp_in.otp != "123456":
         raise HTTPException(status_code=400, detail="Invalid OTP")

    # 2. Check if user exists
    user = db.query(UserModel).filter(UserModel.phone == otp_in.phone_number).first()

    # 3. Auto-Register if new
    if not user:
        user = UserModel(
            phone=otp_in.phone_number,
            name="Retail Customer", # Default name, can update later
            role="customer"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # 4. Generate Token
    access_token = create_access_token(subject=user.id, role=user.role)
    return {"access_token": access_token, "token_type": "bearer"}
