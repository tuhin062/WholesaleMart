from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime

# Shared properties
class UserBase(BaseModel):
    name: str

# Properties to receive via API on creation
class UserCreate(UserBase):
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    password: Optional[str] = None
    role: str # 'admin' | 'customer'

# Properties to receive via API on Login (Admin)
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Properties for OTP (Customer)
class OTPRequest(BaseModel):
    phone_number: str

class OTPVerify(BaseModel):
    phone_number: str
    otp: str

# Properties to return to client
class UserResponse(UserBase):
    id: UUID
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    role: str
    created_at: datetime
    
    class Config:
        from_attributes = True
