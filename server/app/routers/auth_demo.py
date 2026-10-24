"""
SthreeCare - Auth Demo Router
Owner: Person B
"""

from fastapi import APIRouter, HTTPException
from app.schemas import DemoOtpRequest, DemoOtpVerifyRequest, DemoAuthResponse
from app.services.otp_demo import verify_demo_otp, generate_anonymous_ref

router = APIRouter(prefix="/auth/demo", tags=["Authentication (Simulated Demo)"])

@router.post("/otp")
def request_otp(body: DemoOtpRequest):
    return {
        "success": True,
        "message": "Demo OTP 123456 generated for testing. Health records remain 100% on-device.",
        "testOtp": "123456"
    }

@router.post("/verify", response_model=DemoAuthResponse)
def verify_otp(body: DemoOtpVerifyRequest):
    if not verify_demo_otp(body.phone, body.otp):
        raise HTTPException(status_code=400, detail="Invalid OTP code. Please enter demo code '123456'.")

    anon_ref = generate_anonymous_ref(body.phone)
    return DemoAuthResponse(
        success=True,
        message="Demo session verified successfully.",
        token=f"demo-jwt-{anon_ref}",
        anonymousRef=anon_ref,
        phoneNumber=body.phone,
    )
