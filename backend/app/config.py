"""
Configuration settings for WholesaleMart backend
Loads environment variables and provides application settings
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application configuration settings"""
    
    # Database configuration
    DATABASE_URL: str = "postgresql://postgres:root@localhost:5432/wholesalemart"
    
    # JWT Authentication settings
    SECRET_KEY: str = "wholesalemart-secret-2025"  # Shorter for bcrypt compatibility
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # CORS settings - allow React frontend
    CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create global settings instance
settings = Settings()
