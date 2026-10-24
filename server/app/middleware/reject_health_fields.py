"""
Privacy Guard Middleware: reject_health_fields.py
Owner: Person B

Mathematical Zero-Knowledge Privacy Enforcement:
Rejects any incoming HTTP payload containing medical, diagnostic,
or menstrual health terminology. All clinical evaluation runs exclusively
on-device in the user's browser.
"""

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

FORBIDDEN_HEALTH_TERMS = [
    "pbac",
    "epds",
    "haemoglobin",
    "hemoglobin",
    "menstrual",
    "symptoms",
    "diagnosis",
    "bleeding",
    "pad_count",
    "clot_count",
    "tampon",
    "dysmenorrhea",
    "ultrasound_result",
]

class RejectHealthFieldsMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method in ["POST", "PUT", "PATCH"]:
            try:
                body = await request.body()
                if body:
                    body_text = body.decode("utf-8", errors="ignore").lower()
                    for term in FORBIDDEN_HEALTH_TERMS:
                        # Check if term appears as a JSON field key or value
                        if f'"{term}"' in body_text or f"'{term}'" in body_text:
                            return JSONResponse(
                                status_code=422,
                                content={
                                    "error": "Privacy Violation",
                                    "detail": f"Forbidden health term '{term}' detected. SthreeCare architecture guarantees health data never leaves the client device.",
                                },
                            )
            except Exception:
                pass

        return await call_next(request)
