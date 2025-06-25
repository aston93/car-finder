"""Tests for Car CRUD operations - TDD approach."""
import pytest
from fastapi import status
from factories import CarFactory, ToyotaCamryFactory, LuxuryCarFactory


class TestCarCreation:
    """Test car creation endpoint - POST /cars."""
    
    def test_create_car_success(self, client, sample_car_data):
        """Test successful car creation."""
        response = client.post("/cars", json=sample_car_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify all input fields are preserved
        assert data["brand"] == sample_car_data["brand"]
        assert data["model"] == sample_car_data["model"]
        assert data["series"] == sample_car_data["series"]
        assert data["year"] == sample_car_data["year"]
        assert data["mileage_km"] == sample_car_data["mileage_km"]
        assert data["engine_cm3"] == sample_car_data["engine_cm3"]
        assert data["car_status"] == sample_car_data["car_status"]
        assert data["location_status"] == sample_car_data["location_status"]
        assert data["price"] == sample_car_data["price"]
        
        # Verify calculated fields
        assert data["id"] is not None
        assert data["mileage_miles"] == int(sample_car_data["mileage_km"] * 0.621371)
        assert data["photos"] == []
        assert "created_at" in data
    
    def test_create_car_without_series(self, client, sample_car_data):
        """Test car creation without optional series field."""
        del sample_car_data["series"]
        response = client.post("/cars", json=sample_car_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["series"] is None
    
    def test_create_car_missing_required_fields(self, client):
        """Test car creation with missing required fields."""
        incomplete_data = {"brand": "Toyota", "model": "Camry"}
        response = client.post("/cars", json=incomplete_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_create_car_invalid_year(self, client, sample_car_data):
        """Test car creation with invalid year."""
        sample_car_data["year"] = "invalid_year"
        response = client.post("/cars", json=sample_car_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_create_car_negative_price(self, client, sample_car_data):
        """Test car creation with negative price."""
        sample_car_data["price"] = -1000.0
        response = client.post("/cars", json=sample_car_data)
        
        # Should still create (no validation rule), but test documents behavior
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["price"] == -1000.0


class TestCarRetrieval:
    """Test car retrieval endpoints - GET /cars and GET /cars/{id}."""
    
    def test_get_empty_cars_list(self, client):
        """Test getting cars when database is empty."""
        response = client.get("/cars")
        
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == []
    
    def test_get_cars_list_with_data(self, client, test_db):
        """Test getting cars list with existing data."""
        # Create test cars using factory
        car1 = ToyotaCamryFactory()
        car2 = LuxuryCarFactory()
        
        test_db.add(car1)
        test_db.add(car2)
        test_db.commit()
        
        response = client.get("/cars")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 2
        
        # Check structure of returned data
        for car in data:
            assert "id" in car
            assert "brand" in car
            assert "model" in car
            assert "mileage_miles" in car
            assert "photos" in car
    
    def test_get_single_car_success(self, client, test_db):
        """Test getting a single car by ID."""
        car = ToyotaCamryFactory()
        test_db.add(car)
        test_db.commit()
        test_db.refresh(car)
        
        response = client.get(f"/cars/{car.id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == car.id
        assert data["brand"] == car.brand
        assert data["model"] == car.model
    
    def test_get_single_car_not_found(self, client):
        """Test getting a car that doesn't exist."""
        response = client.get("/cars/99999")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "Car not found" in response.json()["detail"]


class TestCarUpdate:
    """Test car update endpoint - PUT /cars/{id}."""
    
    def test_update_car_success(self, client, test_db, sample_car_data):
        """Test successful car update."""
        # Create initial car
        car = ToyotaCamryFactory()
        test_db.add(car)
        test_db.commit()
        test_db.refresh(car)
        
        # Update data
        updated_data = sample_car_data.copy()
        updated_data["brand"] = "Updated Brand"
        updated_data["price"] = 120000.0
        
        response = client.put(f"/cars/{car.id}", json=updated_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["brand"] == "Updated Brand"
        assert data["price"] == 120000.0
        assert data["mileage_miles"] == int(updated_data["mileage_km"] * 0.621371)
    
    def test_update_car_not_found(self, client, sample_car_data):
        """Test updating a car that doesn't exist."""
        response = client.put("/cars/99999", json=sample_car_data)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_update_car_partial_data(self, client, test_db):
        """Test updating car with missing fields."""
        car = ToyotaCamryFactory()
        test_db.add(car)
        test_db.commit()
        test_db.refresh(car)
        
        partial_data = {"brand": "New Brand"}
        response = client.put(f"/cars/{car.id}", json=partial_data)
        
        # Should fail validation
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestCarDeletion:
    """Test car deletion endpoint - DELETE /cars/{id}."""
    
    def test_delete_car_success(self, client, test_db):
        """Test successful car deletion."""
        car = ToyotaCamryFactory()
        test_db.add(car)
        test_db.commit()
        test_db.refresh(car)
        
        response = client.delete(f"/cars/{car.id}")
        
        assert response.status_code == status.HTTP_200_OK
        assert "deleted successfully" in response.json()["message"]
        
        # Verify car is actually deleted
        get_response = client.get(f"/cars/{car.id}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_delete_car_not_found(self, client):
        """Test deleting a car that doesn't exist."""
        response = client.delete("/cars/99999")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND