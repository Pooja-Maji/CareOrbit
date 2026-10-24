"""
SthreeCare - Volunteer Matching Service
Owner: Person B
"""

from typing import Optional
from sqlalchemy.orm import Session
from app.models import Volunteer

def find_best_volunteer(db: Session, preferred_language: Optional[str] = None) -> Optional[Volunteer]:
    volunteers = db.query(Volunteer).filter(Volunteer.verified == True).all()
    if not volunteers:
        return None

    if preferred_language:
        # Match by language
        matched = [v for v in volunteers if preferred_language.lower() in [l.lower() for l in v.languages]]
        if matched:
            # Sort by least hours allocated to distribute mutual-aid fairly
            return sorted(matched, key=lambda v: v.hours)[0]

    return sorted(volunteers, key=lambda v: v.hours)[0]
