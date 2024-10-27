from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# Test for a simple GET endpoint
def test_read_root():
    response = client.get("/api/events")
    assert response.status_code == 200


# Test for a 404 error when an item is not found
def test_read_nonexistent_item():
    response = client.get("/api/events/item/1")
    assert response.status_code == 404
    assert response.json() == {"detail": "Not Found"}