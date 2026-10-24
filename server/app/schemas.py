from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class SchemaBase(BaseModel):
    model_config = ConfigDict(extra="forbid")

class FacilityBase(SchemaBase):
    id: str
    name: str
    type: str
    services: List[str]
    lat: float
    lng: float
    availability: str
    phone: Optional[str] = None
    address: str
    distanceKm: Optional[float] = 0.0

class FacilityOut(FacilityBase):
    pass

class VolunteerBase(SchemaBase):
    id: str
    name: str
    languages: List[str]
    verified: bool
    hours: float
    badge: Optional[str] = None
    phone: Optional[str] = None

class VolunteerOut(VolunteerBase):
    pass

class SupportTaskCreate(SchemaBase):
    type: str
    anonymousRef: str
    preferredLanguage: Optional[str] = "Kannada"
    notes: Optional[str] = None
    hours: Optional[float] = 1.5

class SupportTaskStatusUpdate(SchemaBase):
    status: str

class SupportTaskOut(SchemaBase):
    id: str
    type: str
    status: str
    anonymousRef: str
    volunteerId: Optional[str] = None
    volunteer: Optional[VolunteerOut] = None
    hours: float
    notes: Optional[str] = None
    preferredLanguage: Optional[str] = "Kannada"
    createdAt: datetime
    updatedAt: datetime

class CreditLedgerEntryOut(SchemaBase):
    id: str
    volunteerId: Optional[str] = None
    anonymousRef: Optional[str] = None
    delta: float
    kind: str
    taskId: Optional[str] = None
    description: str
    timestamp: datetime

class CreditSummary(SchemaBase):
    anonymousRef: str
    balanceHours: float
    earnedHours: float
    redeemedHours: float
    sponsoredHoursAvailable: float
    entries: List[CreditLedgerEntryOut]

class CreditRedeemRequest(SchemaBase):
    anonymousRef: str
    hours: float
    purpose: str

class DemoOtpRequest(SchemaBase):
    phone: str

class DemoOtpVerifyRequest(SchemaBase):
    phone: str
    otp: str

class DemoAuthResponse(SchemaBase):
    success: bool
    message: str
    token: str
    anonymousRef: str
    phoneNumber: str
