"""
SthreeCare - Demo Authentication Service
Owner: Person B
"""

FIXED_DEMO_OTP = "123456"

def verify_demo_otp(phone: str, otp: str) -> bool:
    # Demo simulated fixed OTP check
    return otp == FIXED_DEMO_OTP

def generate_anonymous_ref(phone: str) -> str:
    import hashlib
    # Deterministic anonymous ref for demo phone, salted
    h = hashlib.sha256(f"sthree_salt_{phone}".encode()).hexdigest()[:12]
    return f"anon_{h}"
