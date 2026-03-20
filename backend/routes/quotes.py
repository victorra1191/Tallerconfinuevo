from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import models
from database import get_db

router = APIRouter(prefix="/quotes", tags=["quotes"])

@router.post("/")
def create_quote(quote: models.QuoteCreate, db: Session = Depends(get_db)):
    try:
        new_quote = models.Quote(**quote.dict())
        db.add(new_quote)
        db.commit()
        db.refresh(new_quote)
        return {"status": "success", "id": new_quote.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
