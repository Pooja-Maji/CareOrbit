/**
 * SthreeCare - Backend API Generated Contract
 * Generated from FastAPI openapi.json schema definition
 * Owner: Person B
 * 
 * STRICT PRIVACY RULE: Contains NO health, medical, or symptom fields.
 */

export type FacilityType = 'phc' | 'chc' | 'district_hospital' | 'diagnostic_lab' | 'teleconsult';

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  services: string[];
  lat: number;
  lng: number;
  availability: string;
  phone?: string;
  address: string;
  distanceKm?: number;
}

export interface Volunteer {
  id: string;
  name: string;
  languages: string[];
  verified: boolean;
  hours: number;
  badge?: string;
  phone?: string;
}

export type SupportTaskType = 'booking' | 'navigation' | 'language' | 'accompaniment';
export type SupportTaskStatus = 'requested' | 'matched' | 'in_progress' | 'verified';

export interface SupportTask {
  id: string;
  type: SupportTaskType;
  status: SupportTaskStatus;
  anonymousRef: string;
  volunteerId?: string | null;
  volunteer?: Volunteer | null;
  hours: number;
  notes?: string;
  preferredLanguage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTaskCreate {
  type: SupportTaskType;
  anonymousRef: string;
  preferredLanguage?: string;
  notes?: string;
  hours?: number;
}

export interface SupportTaskStatusUpdate {
  status: SupportTaskStatus;
}

export type CreditKind = 'earned' | 'redeemed' | 'sponsored';

export interface CreditLedgerEntry {
  id: string;
  volunteerId?: string | null;
  anonymousRef?: string | null;
  delta: number; // in hours, e.g. +1.5, -1.0
  kind: CreditKind;
  taskId?: string | null;
  description: string;
  timestamp: string;
}

export interface CreditSummary {
  anonymousRef: string;
  balanceHours: number;
  earnedHours: number;
  redeemedHours: number;
  sponsoredHoursAvailable: number;
  entries: CreditLedgerEntry[];
}

export interface CreditRedeemRequest {
  anonymousRef: string;
  hours: number;
  purpose: string;
}

export interface DemoOtpRequest {
  phone: string;
}

export interface DemoOtpVerifyRequest {
  phone: string;
  otp: string;
}

export interface DemoAuthResponse {
  success: boolean;
  message: string;
  token: string;
  anonymousRef: string;
  phoneNumber: string;
}
