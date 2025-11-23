from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, models, database, auth_utils

router = APIRouter(
    prefix="/investments",
    tags=["investments"],
)

@router.post("/", response_model=schemas.InvestmentResponse)
def create_investment(investment: schemas.InvestmentCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth_utils.get_current_user)):
    db_investment = models.Investment(**investment.model_dump(), owner_id=current_user.id)
    db.add(db_investment)
    db.commit()
    db.refresh(db_investment)
    return db_investment

@router.get("/", response_model=List[schemas.InvestmentResponse])
def read_investments(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth_utils.get_current_user)):
    investments = db.query(models.Investment).filter(models.Investment.owner_id == current_user.id).offset(skip).limit(limit).all()
    return investments

@router.delete("/{investment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_investment(investment_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth_utils.get_current_user)):
    investment = db.query(models.Investment).filter(models.Investment.id == investment_id, models.Investment.owner_id == current_user.id).first()
    if investment is None:
        raise HTTPException(status_code=404, detail="Investment not found")
    db.delete(investment)
    db.commit()
