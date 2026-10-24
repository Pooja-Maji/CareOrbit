"""
SthreeCare - Credits Router
Owner: Person B

Governs Time Bank hours balance and redemptions.
Credits NEVER gate urgent medical treatment.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.deps import get_db
from app.schemas import CreditSummary, CreditRedeemRequest
from app.services.credits import get_ledger_summary, record_redemption

router = APIRouter(prefix="/credits", tags=["Healthcare Time Bank Credits"])

@router.get("/{anonymous_ref}", response_model=CreditSummary)
def get_credits(anonymous_ref: str, db: Session = Depends(get_db)):
    summary = get_ledger_summary(db, anonymous_ref)
    return CreditSummary(**summary)

@router.post("/redeem")
def redeem(body: CreditRedeemRequest, db: Session = Depends(get_db)):
    summary = get_ledger_summary(db, body.anonymousRef)
    available = summary["balanceHours"] + summary["sponsoredHoursAvailable"]
    if body.hours > available:
        raise HTTPException(
            status_code=400,
            detail=f"Requested {body.hours} hours, but only {available} hours available across personal balance and sponsored pool."
        )

    record_redemption(db, body.anonymousRef, body.hours, body.purpose)
    new_summary = get_ledger_summary(db, body.anonymousRef)

    return {
        "success": True,
        "message": f"Successfully allocated {body.hours} Time Bank hour(s).",
        "balanceHours": new_summary["balanceHours"],
    }
