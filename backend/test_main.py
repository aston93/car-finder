import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Car Finder API"
    assert data["version"] == "1.0.1"
    assert data["status"] == "healthy"

def test_health_check():
    """Test the health endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["version"] == "1.0.1"
    assert "timestamp" in data

def test_get_cars():
    """Test getting cars list"""
    response = client.get("/cars")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_get_nonexistent_car():
    """Test getting a car that doesn't exist"""
    response = client.get("/cars/99999")
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Car not found"

def test_create_car():
    """Test creating a new car"""
    car_data = {
        "brand": "Test Brand",
        "model": "Test Model",
        "year": 2023,
        "mileage_km": 10000,
        "engine_cm3": 2000,
        "car_status": "odpala i jezdzi",
        "location_status": "na miejscu",
        "price": 50000.0
    }
    response = client.post("/cars", json=car_data)
    assert response.status_code == 200
    data = response.json()
    assert data["brand"] == "Test Brand"
    assert data["model"] == "Test Model"
    assert data["photos"] == []

def test_upload_photo_nonexistent_car():
    """Test uploading photo to nonexistent car"""
    files = {"file": ("test.jpg", b"fake image data", "image/jpeg")}
    response = client.post("/cars/99999/photos", files=files)
    assert response.status_code == 404
    assert response.json()["detail"] == "Car not found"

def test_upload_non_image_file():
    """Test uploading non-image file"""
    files = {"file": ("test.txt", b"not an image", "text/plain")}
    response = client.post("/cars/1/photos", files=files)
    # This should fail with validation error
    assert response.status_code in [400, 404]  # 404 if car doesn't exist, 400 if validation fails