"""Test configuration and fixtures for backend tests."""
import pytest
import asyncio
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import tempfile
import os
from unittest.mock import Mock, patch

from main import app, get_db, Base


# Test database setup
@pytest.fixture(scope="function")
def test_db():
    """Create a fresh test database for each test."""
    # Use in-memory SQLite for fast tests
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    
    yield TestingSessionLocal()
    
    # Cleanup
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(test_db):
    """Create a test client with database dependency override."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(scope="function")
def mock_storage_client():
    """Mock Google Cloud Storage client."""
    with patch('main.storage_client') as mock_client:
        mock_bucket = Mock()
        mock_blob = Mock()
        
        # Configure mock blob behavior
        mock_blob.public_url = "https://storage.googleapis.com/test-bucket/test-file.jpg"
        mock_blob.exists.return_value = True
        
        # Configure mock bucket behavior
        mock_bucket.blob.return_value = mock_blob
        
        # Configure mock client behavior
        mock_client.bucket.return_value = mock_bucket
        
        yield {
            'client': mock_client,
            'bucket': mock_bucket,
            'blob': mock_blob
        }


@pytest.fixture(scope="function")
def sample_car_data():
    """Sample car data for testing."""
    return {
        "brand": "Toyota",
        "model": "Camry",
        "series": "Hybrid",
        "year": 2023,
        "mileage_km": 15000,
        "engine_cm3": 2500,
        "car_status": "odpala i jezdzi",
        "location_status": "na miejscu",
        "price": 95000.0
    }


@pytest.fixture(scope="function")
def sample_image_file():
    """Create a sample image file for upload testing."""
    # Create a temporary image file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp_file:
        # Write minimal JPEG header
        tmp_file.write(b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xff\xdb')
        tmp_file.flush()
        
        yield tmp_file.name
    
    # Cleanup
    if os.path.exists(tmp_file.name):
        os.unlink(tmp_file.name)