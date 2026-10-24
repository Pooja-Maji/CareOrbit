def test_health_route(client):
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["zeroHealthDataGuaranteed"] is True

def test_auth_demo_routes(client):
    otp_res = client.post("/auth/demo/otp", json={"phone": "9876543210"})
    assert otp_res.status_code == 200
    assert otp_res.json()["success"] is True

    verify_res = client.post("/auth/demo/verify", json={"phone": "9876543210", "otp": "123456"})
    assert verify_res.status_code == 200
    data = verify_res.json()
    assert data["success"] is True
    assert "token" in data
    assert data["anonymousRef"].startswith("anon_")

def test_facilities_route(client):
    res = client.get("/facilities")
    assert res.status_code == 200
    assert isinstance(res.json(), list)

def test_support_and_credits_routes(client):
    req_res = client.post("/support-requests", json={
        "type": "navigation",
        "anonymousRef": "anon_route_test",
        "preferredLanguage": "Kannada",
        "notes": "Appointment check-in support",
        "hours": 1.5
    })
    assert req_res.status_code == 200
    task_data = req_res.json()
    assert task_data["anonymousRef"] == "anon_route_test"
    task_id = task_data["id"]

    # Status update
    patch_res = client.patch(f"/support-requests/{task_id}/status", json={"status": "in_progress"})
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "in_progress"

    # Credits check
    cred_res = client.get("/credits/anon_route_test")
    assert cred_res.status_code == 200
    assert "balanceHours" in cred_res.json()
