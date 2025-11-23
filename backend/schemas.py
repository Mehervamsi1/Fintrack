from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Expense Schemas
class ExpenseBase(BaseModel):
    amount: float
    category: str
    item: str
    date: datetime
    payment_method: str
    place_of_purchase: str
    notes: Optional[str] = None
    receipt_url: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseResponse(ExpenseBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

# Income Schemas
class IncomeBase(BaseModel):
    amount: float
    source: str
    type: str
    date: datetime
    invoice_url: Optional[str] = None

class IncomeCreate(IncomeBase):
    pass

class IncomeResponse(IncomeBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

# Investment Schemas
class InvestmentBase(BaseModel):
    name: str
    symbol: str
    type: str
    quantity: float
    purchase_price: float
    purchase_date: datetime

class InvestmentCreate(InvestmentBase):
    pass

class InvestmentResponse(InvestmentBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

# Asset Schemas
class AssetBase(BaseModel):
    name: str
    value: float
    type: str

class AssetCreate(AssetBase):
    pass

class AssetResponse(AssetBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

# Goal Schemas
class GoalBase(BaseModel):
    name: str
    target_amount: float
    current_amount: float = 0.0
    target_date: datetime

class GoalCreate(GoalBase):
    pass

class GoalResponse(GoalBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True
