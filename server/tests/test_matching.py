from sqlalchemy.orm import Session
from app.models import Volunteer
from app.services.matching import find_best_volunteer

def test_volunteer_matching(db_session: Session):
    v1 = Volunteer(id="v1", name="Volunteer A", verified=True, hours=10.0)
    v1.languages = ["Kannada", "English"]

    v2 = Volunteer(id="v2", name="Volunteer B", verified=True, hours=5.0)
    v2.languages = ["Hindi", "English"]

    db_session.add_all([v1, v2])
    db_session.commit()

    # Match by Kannada -> should match v1
    matched = find_best_volunteer(db_session, preferred_language="Kannada")
    assert matched is not None
    assert matched.id == "v1"

    # Match by English -> both speak English, should choose v2 because fewer hours (5.0 < 10.0)
    matched_eng = find_best_volunteer(db_session, preferred_language="English")
    assert matched_eng is not None
    assert matched_eng.id == "v2"
