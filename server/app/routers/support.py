"""
SthreeCare - Support Requests Router
Owner: Person B

Zero Health Data Policy:
Accepts task type (booking, navigation, language), anonymousRef,
and logistics notes only.
"""

import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.deps import get_db
from app.models import SupportTask
from app.schemas import SupportTaskCreate, SupportTaskStatusUpdate, SupportTaskOut, VolunteerOut
from app.services.matching import find_best_volunteer
from app.services.task_state_machine import validate_transition
from app.services.credits import reward_volunteer

router = APIRouter(prefix="/support-requests", tags=["Volunteer Practical Support"])

@router.post("", response_model=SupportTaskOut)
def create_support_request(body: SupportTaskCreate, db: Session = Depends(get_db)):
    # 1. Match a verified volunteer
    volunteer = find_best_volunteer(db, preferred_language=body.preferredLanguage)
    task_id = f"req_{uuid.uuid4().hex[:8]}"

    task = SupportTask(
        id=task_id,
        type=body.type,
        status="matched" if volunteer else "requested",
        anonymous_ref=body.anonymousRef,
        volunteer_id=volunteer.id if volunteer else None,
        hours=body.hours or 1.5,
        notes=body.notes or "Non-medical appointment assistance",
        preferred_language=body.preferredLanguage or "Kannada",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    vol_out = None
    if task.volunteer:
        vol_out = VolunteerOut(
            id=task.volunteer.id,
            name=task.volunteer.name,
            languages=task.volunteer.languages,
            verified=task.volunteer.verified,
            hours=task.volunteer.hours,
            badge=task.volunteer.badge,
            phone=task.volunteer.phone,
        )

    return SupportTaskOut(
        id=task.id,
        type=task.type,
        status=task.status,
        anonymousRef=task.anonymous_ref,
        volunteerId=task.volunteer_id,
        volunteer=vol_out,
        hours=task.hours,
        notes=task.notes,
        preferredLanguage=task.preferred_language,
        createdAt=task.created_at,
        updatedAt=task.updated_at,
    )

@router.get("/{task_id}", response_model=SupportTaskOut)
def get_support_request(task_id: str, db: Session = Depends(get_db)):
    task = db.query(SupportTask).filter(SupportTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Support task not found")

    vol_out = None
    if task.volunteer:
        vol_out = VolunteerOut(
            id=task.volunteer.id,
            name=task.volunteer.name,
            languages=task.volunteer.languages,
            verified=task.volunteer.verified,
            hours=task.volunteer.hours,
            badge=task.volunteer.badge,
            phone=task.volunteer.phone,
        )

    return SupportTaskOut(
        id=task.id,
        type=task.type,
        status=task.status,
        anonymousRef=task.anonymous_ref,
        volunteerId=task.volunteer_id,
        volunteer=vol_out,
        hours=task.hours,
        notes=task.notes,
        preferredLanguage=task.preferred_language,
        createdAt=task.created_at,
        updatedAt=task.updated_at,
    )

@router.patch("/{task_id}/status", response_model=SupportTaskOut)
def update_task_status(
    task_id: str,
    body: SupportTaskStatusUpdate,
    db: Session = Depends(get_db)
):
    task = db.query(SupportTask).filter(SupportTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Support task not found")

    try:
        validate_transition(task.status, body.status)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    task.status = body.status
    task.updated_at = datetime.utcnow()

    # If verified, credit volunteer with mutual-aid hours
    if body.status == "verified" and task.volunteer_id:
        reward_volunteer(db, task.volunteer_id, task.hours, task.id)

    db.commit()
    db.refresh(task)

    vol_out = None
    if task.volunteer:
        vol_out = VolunteerOut(
            id=task.volunteer.id,
            name=task.volunteer.name,
            languages=task.volunteer.languages,
            verified=task.volunteer.verified,
            hours=task.volunteer.hours,
            badge=task.volunteer.badge,
            phone=task.volunteer.phone,
        )

    return SupportTaskOut(
        id=task.id,
        type=task.type,
        status=task.status,
        anonymousRef=task.anonymous_ref,
        volunteerId=task.volunteer_id,
        volunteer=vol_out,
        hours=task.hours,
        notes=task.notes,
        preferredLanguage=task.preferred_language,
        createdAt=task.created_at,
        updatedAt=task.updated_at,
    )
