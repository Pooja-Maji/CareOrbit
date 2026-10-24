import json
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Facility(Base):
    __tablename__ = "facilities"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False) # phc, chc, district_hospital, diagnostic_lab, teleconsult
    _services = Column("services", Text, default="[]")
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    availability = Column(String, default="Mon-Sat 9:00 AM - 4:00 PM (Simulated)")
    phone = Column(String, nullable=True)
    address = Column(String, nullable=False)
    distanceKm = Column(Float, nullable=True, default=0.0)

    @property
    def services(self):
        try:
            return json.loads(self._services)
        except Exception:
            return []

    @services.setter
    def services(self, val):
        self._services = json.dumps(val)


class Volunteer(Base):
    __tablename__ = "volunteers"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    _languages = Column("languages", Text, default="[]")
    verified = Column(Boolean, default=True)
    hours = Column(Float, default=0.0)
    badge = Column(String, default="Verified Health Navigator")
    phone = Column(String, nullable=True)

    @property
    def languages(self):
        try:
            return json.loads(self._languages)
        except Exception:
            return []

    @languages.setter
    def languages(self, val):
        self._languages = json.dumps(val)


class SupportTask(Base):
    __tablename__ = "support_tasks"

    id = Column(String, primary_key=True, index=True)
    type = Column(String, nullable=False) # booking, navigation, language, accompaniment
    status = Column(String, default="requested") # requested, matched, in_progress, verified
    anonymous_ref = Column(String, nullable=False, index=True) # Zero health knowledge identifier
    volunteer_id = Column(String, ForeignKey("volunteers.id"), nullable=True)
    hours = Column(Float, default=1.5)
    notes = Column(Text, nullable=True)
    preferred_language = Column(String, default="Kannada")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    volunteer = relationship("Volunteer")


class CreditLedger(Base):
    __tablename__ = "credit_ledger"

    id = Column(String, primary_key=True, index=True)
    volunteer_id = Column(String, ForeignKey("volunteers.id"), nullable=True)
    anonymous_ref = Column(String, nullable=True, index=True)
    delta = Column(Float, nullable=False) # +1.5, -1.0
    kind = Column(String, nullable=False) # earned, redeemed, sponsored
    task_id = Column(String, nullable=True)
    description = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
