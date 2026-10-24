"""
SthreeCare - Facilities Router
Owner: Person B
"""

from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.deps import get_db
from app.models import Facility
from app.schemas import FacilityOut

router = APIRouter(prefix="/facilities", tags=["Facilities Directory"])

@router.get("", response_model=List[FacilityOut])
def list_facilities(
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    service: Optional[str] = None,
    type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Facility)

    if type and type != "all":
        query = query.filter(Facility.type == type)

    facilities = query.all()

    result = []
    for f in facilities:
        # Filter by service keyword if provided
        if service:
            s_lower = service.lower()
            if not any(s_lower in s.lower() for s in f.services):
                continue

        result.append(
            FacilityOut(
                id=f.id,
                name=f.name,
                type=f.type,
                services=f.services,
                lat=f.lat,
                lng=f.lng,
                availability=f.availability,
                phone=f.phone,
                address=f.address,
                distanceKm=f.distanceKm,
            )
        )

    return result
