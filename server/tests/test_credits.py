from sqlalchemy.orm import Session
from app.services.credits import get_ledger_summary, record_redemption, reward_volunteer
from app.models import Volunteer

def test_credit_ledger_and_balance(db_session: Session):
    ref = "anon_test_user_99"

    # Initially empty, balance is 0, sponsored pool is 10
    summary = get_ledger_summary(db_session, ref)
    assert summary["balanceHours"] == 0.0
    assert summary["sponsoredHoursAvailable"] == 10.0

    # User redeems 1.5 hours
    record_redemption(db_session, ref, 1.5, "Transport assistance")
    summary_after = get_ledger_summary(db_session, ref)
    assert summary_after["redeemedHours"] == 1.5

def test_volunteer_reward(db_session: Session):
    vol = Volunteer(id="v_reward", name="Test Volunteer", verified=True, hours=0.0)
    db_session.add(vol)
    db_session.commit()

    reward_volunteer(db_session, "v_reward", 2.0, "req_123")
    db_session.refresh(vol)
    assert vol.hours == 2.0
