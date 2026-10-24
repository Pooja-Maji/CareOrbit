"""
SthreeCare - Backend Application Entry Point
Owner: Person B
"""

import json
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models import Facility, Volunteer, CreditLedger
from app.middleware.reject_health_fields import RejectHealthFieldsMiddleware
from app.routers import auth_demo, facilities, support, credits

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SthreeCare Healthcare Navigator API",
    description="Backend services for facilities lookup, volunteer matching, and Time Bank mutual-aid credits. Contains zero clinical or health tracking data.",
    version="1.0.0",
)

# Reject any health data payloads at the middleware level
app.add_middleware(RejectHealthFieldsMiddleware)

# Cross-Origin Resource Sharing
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth_demo.router)
app.include_router(facilities.router)
app.include_router(support.router)
app.include_router(credits.router)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SthreeCare API",
        "zeroHealthDataGuaranteed": True,
    }

@app.on_event("startup")
def seed_initial_data():
    db = SessionLocal()
    try:
        # Check if facilities exist
        if db.query(Facility).count() == 0:
            seed_file = Path(__file__).parent.parent / "seed" / "facilities.json"
            if seed_file.exists():
                with open(seed_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for item in data:
                        fac = Facility(
                            id=item["id"],
                            name=item["name"],
                            type=item["type"],
                            lat=item["lat"],
                            lng=item["lng"],
                            availability=item.get("availability", "Simulated"),
                            phone=item.get("phone"),
                            address=item.get("address", ""),
                            distanceKm=item.get("distanceKm", 0.0),
                        )
                        fac.services = item.get("services", [])
                        db.add(fac)
                db.commit()

        # Check if volunteers exist
        if db.query(Volunteer).count() == 0:
            vol_file = Path(__file__).parent.parent / "seed" / "volunteers.json"
            if vol_file.exists():
                with open(vol_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for item in data:
                        vol = Volunteer(
                            id=item["id"],
                            name=item["name"],
                            verified=item.get("verified", True),
                            hours=item.get("hours", 0.0),
                            badge=item.get("badge", "Verified Volunteer"),
                            phone=item.get("phone"),
                        )
                        vol.languages = item.get("languages", [])
                        db.add(vol)
                db.commit()

        # Seed welcome credit grant for demo ref
        if db.query(CreditLedger).count() == 0:
            grant = CreditLedger(
                id="cred_initial_grant",
                anonymous_ref="anon_demo_4321",
                delta=3.0,
                kind="sponsored",
                description="Community Welcome Mutual-Aid Grant (recHERsion Healthcare Initiative)",
            )
            db.add(grant)
            db.commit()
    finally:
        db.close()
