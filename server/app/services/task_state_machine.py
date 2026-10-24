"""
SthreeCare - Task State Machine
Owner: Person B

Governs valid transitions for practical support requests:
requested -> matched -> in_progress -> verified
"""

VALID_TRANSITIONS = {
    "requested": ["matched", "cancelled"],
    "matched": ["in_progress", "requested", "cancelled"],
    "in_progress": ["verified", "matched", "cancelled"],
    "verified": [], # Terminal state
    "cancelled": [], # Terminal state
}

def can_transition(current_status: str, target_status: str) -> bool:
    allowed = VALID_TRANSITIONS.get(current_status, [])
    return target_status in allowed

def validate_transition(current_status: str, target_status: str) -> None:
    if not can_transition(current_status, target_status):
        raise ValueError(f"Invalid status transition from '{current_status}' to '{target_status}'.")
