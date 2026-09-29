import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["backend"] == "healthy"
    assert "hindsight" in data

def test_services_endpoint():
    response = client.get("/api/services")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 10

def test_incidents_endpoint():
    response = client.get("/api/incidents")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(i["incident_id"] == "INC-2051" for i in data)

def test_investigate_hero_incident():
    response = client.post("/api/incidents/INC-2051/investigate")
    assert response.status_code == 200
    data = response.json()
    assert data["incident_id"] == "INC-2051"
    assert "payment-service" in data["suspected_change"]["service"]
    assert len(data["similar_incidents"]) >= 1
    assert data["similar_incidents"][0]["incident_id"] == "INC-1042"
    assert data["confidence"] >= 90.0

def test_recall_endpoint():
    response = client.post("/api/incidents/INC-2051/recall")
    assert response.status_code == 200
    data = response.json()
    assert data["total_matches"] >= 1
    assert data["similar_incidents"][0]["incident_id"] == "INC-1042"

def test_deployments_endpoint():
    response = client.get("/api/deployments")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 5

def test_patterns_endpoint():
    response = client.get("/api/patterns")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 4

def test_dashboard_endpoint():
    response = client.get("/api/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "metrics" in data
    assert "active_incidents_list" in data
