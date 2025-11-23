from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, models, database, auth_utils

router = APIRouter(
    prefix="/income",
    tags=["income"],
)

@router.post("/", response_model=schemas.IncomeResponse)
def create_income(income: schemas.IncomeCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth_utils.get_current_user)):
    db_income = models.Income(**income.model_dump(), owner_id=current_user.id)
    db.add(db_income)
    db.commit()
    db.refresh(db_income)
    return db_income

@router.get("/", response_model=List[schemas.IncomeResponse])
def read_income(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth_utils.get_current_user)):
    income = db.query(models.Income).filter(models.Income.owner_id == current_user.id).offset(skip).limit(limit).all()
    return income

@router.delete("/{income_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_income(income_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth_utils.get_current_user)):
    income = db.query(models.Income).filter(models.Income.id == income_id, models.Income.owner_id == current_user.id).first()
    if income is None:
        raise HTTPException(status_code=404, detail="Income not found")
    db.delete(income)
    db.commit()
