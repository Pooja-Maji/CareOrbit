def test_reject_health_fields_middleware(client):
    # Attempt to smuggle medical/bleeding fields into support request
    forbidden_payload = {
        "type": "navigation",
        "anonymousRef": "anon_test_user",
        "pbac": 140, # FORBIDDEN
    }

    res = client.post("/support-requests", json=forbidden_payload)
    # Must be intercepted and rejected with 422
    assert res.status_code == 422
    data = res.json()
    assert "Privacy Violation" in data.get("error", "") or "forbidden" in str(data).lower()
