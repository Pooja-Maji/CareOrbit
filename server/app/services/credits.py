"""
SthreeCare - Time Bank Credits Service
Owner: Person B
"""

import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app.models import CreditLedger, Volunteer

COMMUNITY_SPONSORED_BUFFER = 10.0

def get_ledger_summary(db: Session, anonymous_ref: str):
    entries = db.query(CreditLedger).filter(CreditLedger.anonymous_ref == anonymous_ref).all()
    
    earned = sum(e.delta for e in entries if e.kind == "earned")
    redeemed = sum(abs(e.delta) for e in entries if e.kind == "redeemed")
    sponsored = sum(e.delta for e in entries if e.kind == "sponsored")
    
    balance = earned + sponsored - redeemed

    return {
        "anonymousRef": anonymous_ref,
        "balanceHours": max(0.0, balance),
        "earnedHours": earned,
        "redeemedHours": redeemed,
        "sponsoredHoursAvailable": COMMUNITY_SPONSORED_BUFFER,
        "entries": [
            {
                "id": e.id,
                "volunteerId": e.volunteer_id,
                "anonymousRef": e.anonymous_ref,
                "delta": e.delta,
                "kind": e.kind,
                "taskId": e.task_id,
                "description": e.description,
                "timestamp": e.timestamp,
            }
            for e in sorted(entries, key=lambda x: x.timestamp, reverse=True)
        ],
    }

def record_redemption(db: Session, anonymous_ref: str, hours: float, purpose: str):
    entry = CreditLedger(
        id=f"cred_{uuid.uuid4().hex[:8]}",
        anonymous_ref=anonymous_ref,
        delta=-abs(hours),
        kind="redeemed",
        description=purpose,
        timestamp=datetime.utcnow(),
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

def reward_volunteer(db: Session, volunteer_id: str, hours: float, task_id: str):
    volunteer = db.query(Volunteer).filter(Volunteer.id == volunteer_id).first()
    if volunteer:
        volunteer.hours += hours
    
    entry = CreditLedger(
        id=f"cred_{uuid.uuid4().hex[:8]}",
        volunteer_id=volunteer_id,
        delta=hours,
        kind="earned",
        task_id=task_id,
        description=f"Completed verified volunteer accompaniment task #{task_id}",
        timestamp=datetime.utcnow(),
    )
    db.add(entry)
    db.commit()
    return entry
