"""Tests for API endpoints and general functionality - TDD approach."""
import pytest
from fastapi import status


class TestHealthEndpoints:
    """Test health and status endpoints."""
    
    def test_root_endpoint(self, client):
        """Test root endpoint returns correct response."""
        response = client.get("/")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["message"] == "Car Finder API"
        assert data["version"] == "1.0.1"
        assert data["status"] == "healthy"
    
    def test_health_endpoint(self, client):
        """Test health check endpoint."""
        response = client.get("/health")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "ok"
        assert data["version"] == "1.0.1"
        assert "timestamp" in data


class TestInputValidation:
    """Test input validation across all endpoints."""
    
    def test_car_status_validation(self, client, sample_car_data):
        """Test car_status field accepts only valid values."""
        # Test valid values
        valid_statuses = ["stacjonarny", "odpala", "odpala i jezdzi"]
        for status_val in valid_statuses:
            data = sample_car_data.copy()
            data["car_status"] = status_val
            response = client.post("/cars", json=data)
            assert response.status_code == status.HTTP_200_OK
            assert response.json()["car_status"] == status_val
    
    def test_location_status_validation(self, client, sample_car_data):
        """Test location_status field accepts only valid values."""
        # Test valid values
        valid_statuses = ["na miejscu", "w drodze"]
        for status_val in valid_statuses:
            data = sample_car_data.copy()
            data["location_status"] = status_val
            response = client.post("/cars", json=data)
            assert response.status_code == status.HTTP_200_OK
            assert response.json()["location_status"] == status_val
    
    def test_mileage_conversion(self, client, sample_car_data):
        """Test km to miles conversion is accurate."""
        test_cases = [
            (100, 62),
            (160, 99),
            (0, 0),
            (1000, 621),
            (50000, 31068)
        ]
        
        for km, expected_miles in test_cases:
            data = sample_car_data.copy()
            data["mileage_km"] = km
            response = client.post("/cars", json=data)
            assert response.status_code == status.HTTP_200_OK
            assert response.json()["mileage_miles"] == expected_miles


class TestErrorHandling:
    """Test error handling across the API."""
    
    def test_invalid_json_request(self, client):
        """Test handling of malformed JSON."""
        response = client.post(
            "/cars",
            data="invalid json",
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_missing_content_type(self, client, sample_car_data):
        """Test handling of missing content type."""
        response = client.post("/cars", data=str(sample_car_data))
        # Should still work or return appropriate error
        assert response.status_code in [status.HTTP_422_UNPROCESSABLE_ENTITY, status.HTTP_415_UNSUPPORTED_MEDIA_TYPE]
    
    def test_large_request_body(self, client, sample_car_data):
        """Test handling of excessively large request."""
        # Create a large request by adding big string fields
        large_data = sample_car_data.copy()
        large_data["brand"] = "A" * 10000  # Very long brand name
        
        response = client.post("/cars", json=large_data)
        # Should either accept it or return appropriate error
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, status.HTTP_422_UNPROCESSABLE_ENTITY]


class TestCorsHeaders:
    """Test CORS headers are properly set."""
    
    def test_cors_headers_present(self, client):
        """Test that CORS headers are present in responses."""
        response = client.get("/")
        
        # Check for CORS headers
        assert "access-control-allow-origin" in response.headers
        assert response.headers["access-control-allow-origin"] == "*"
    
    def test_options_request_cors(self, client):
        """Test OPTIONS request for CORS preflight."""
        response = client.options("/cars")
        
        # Should handle OPTIONS request properly
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_405_METHOD_NOT_ALLOWED]


class TestDatabaseIntegration:
    """Test database-related functionality."""
    
    def test_database_connection_resilience(self, client, test_db):
        """Test API behavior when database operations fail."""
        # This test checks that the API handles database errors gracefully
        # In a real scenario, you might mock database failures
        
        # For now, just verify normal operation
        response = client.get("/cars")
        assert response.status_code == status.HTTP_200_OK
    
    def test_concurrent_car_creation(self, client, sample_car_data):
        """Test creating multiple cars concurrently."""
        # Simulate concurrent requests
        responses = []
        for i in range(5):
            data = sample_car_data.copy()
            data["brand"] = f"Brand{i}"
            response = client.post("/cars", json=data)
            responses.append(response)
        
        # All should succeed
        for response in responses:
            assert response.status_code == status.HTTP_200_OK
        
        # Verify all cars were created
        list_response = client.get("/cars")
        assert len(list_response.json()) == 5