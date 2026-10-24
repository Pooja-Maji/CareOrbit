import pytest
from app.services.task_state_machine import can_transition, validate_transition

def test_task_state_transitions():
    # Valid forward transitions
    assert can_transition("requested", "matched") is True
    assert can_transition("matched", "in_progress") is True
    assert can_transition("in_progress", "verified") is True

    # Invalid backwards transition from verified
    assert can_transition("verified", "requested") is False
    assert can_transition("verified", "in_progress") is False

    with pytest.raises(ValueError):
        validate_transition("verified", "requested")
