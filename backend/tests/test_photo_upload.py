"""Tests for photo upload/delete functionality - TDD approach."""
import pytest
from fastapi import status
from unittest.mock import Mock, patch
from factories import CarWithPhotosFactory, ToyotaCamryFactory
import io


class TestPhotoUpload:
    """Test photo upload endpoint - POST /cars/{id}/photos."""
    
    def test_upload_photo_success(self, client, test_db, mock_storage_client):
        """Test successful photo upload."""
        # Create a car to upload photo to
        car = ToyotaCamryFactory()
        test_db.add(car)
        test_db.commit()
        test_db.refresh(car)
        
        # Mock file upload
        file_content = b"fake image content"
        files = {"file": ("test.jpg", io.BytesIO(file_content), "image/jpeg")}
        
        response = client.post(f"/cars/{car.id}/photos", files=files)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "photo uploaded successfully" in data["message"].lower()
        assert "photo_url" in data
        assert data["photo_url"] == mock_storage_client['blob'].public_url
        
        # Verify photo was added to car
        car_response = client.get(f"/cars/{car.id}")
        car_data = car_response.json()
        assert len(car_data["photos"]) == 1
        assert car_data["photos"][0] == data["photo_url"]
    
    def test_upload_photo_car_not_found(self, client, mock_storage_client):
        """Test uploading photo to non-existent car."""
        file_content = b"fake image content"
        files = {"file": ("test.jpg", io.BytesIO(file_content), "image/jpeg")}
        
        response = client.post("/cars/99999/photos", files=files)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "Car not found" in response.json()["detail"]
    
    def test_upload_non_image_file(self, client, test_db, mock_storage_client):
        """Test uploading non-image file."""
        car = ToyotaCamryFactory()
        test_db.add(car)
        test_db.commit()
        test_db.refresh(car)
        
        # Try to upload a text file
        file_content = b"This is not an image"
        files = {"file": ("test.txt", io.BytesIO(file_content), "text/plain")}
        
        response = client.post(f"/cars/{car.id}/photos", files=files)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "must be an image" in response.json()["detail"]
    
    def test_upload_multiple_photos(self, client, test_db, mock_storage_client):
        """Test uploading multiple photos to same car."""
        car = ToyotaCamryFactory()
        test_db.add(car)
        test_db.commit()
        test_db.refresh(car)
        
        # Upload first photo
        file1 = {"file": ("test1.jpg", io.BytesIO(b"image1"), "image/jpeg")}
        response1 = client.post(f"/cars/{car.id}/photos", files=file1)
        assert response1.status_code == status.HTTP_200_OK
        
        # Upload second photo
        file2 = {"file": ("test2.jpg", io.BytesIO(b"image2"), "image/jpeg")}
        response2 = client.post(f"/cars/{car.id}/photos", files=file2)
        assert response2.status_code == status.HTTP_200_OK
        
        # Verify both photos are stored
        car_response = client.get(f"/cars/{car.id}")
        car_data = car_response.json()
        assert len(car_data["photos"]) == 2
    
    @patch('main.bucket', None)
    def test_upload_photo_storage_unavailable(self, client, test_db):
        """Test photo upload when cloud storage is unavailable."""
        car = ToyotaCamryFactory()
        test_db.add(car)
        test_db.commit()
        test_db.refresh(car)
        
        file_content = b"fake image content"
        files = {"file": ("test.jpg", io.BytesIO(file_content), "image/jpeg")}
        
        response = client.post(f"/cars/{car.id}/photos", files=files)
        
        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        assert "Failed to upload photo" in response.json()["detail"]


class TestPhotoDelete:
    """Test photo deletion endpoint - DELETE /cars/{id}/photos/{photo_index}."""
    
    def test_delete_photo_success(self, client, test_db, mock_storage_client):
        """Test successful photo deletion."""
        # Create a car with photos
        car = CarWithPhotosFactory()
        test_db.add(car)
        test_db.commit()
        test_db.refresh(car)
        
        initial_photo_count = len(car.photos)
        photo_to_delete_index = 0
        
        response = client.delete(f"/cars/{car.id}/photos/{photo_to_delete_index}")
        
        assert response.status_code == status.HTTP_200_OK
        assert "photo deleted successfully" in response.json()["message"].lower()
        
        # Verify photo was removed from car
        car_response = client.get(f"/cars/{car.id}")
        car_data = car_response.json()
        assert len(car_data["photos"]) == initial_photo_count - 1
        
        # Verify cloud storage delete was called
        mock_storage_client['blob'].delete.assert_called_once()
    
    def test_delete_photo_car_not_found(self, client, mock_storage_client):
        """Test deleting photo from non-existent car."""
        response = client.delete("/cars/99999/photos/0")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "Car not found" in response.json()["detail"]
    
    def test_delete_photo_invalid_index(self, client, test_db, mock_storage_client):
        """Test deleting photo with invalid index."""
        car = ToyotaCamryFactory()  # Car with no photos
        test_db.add(car)
        test_db.commit()
        test_db.refresh(car)
        
        response = client.delete(f"/cars/{car.id}/photos/0")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "Photo not found" in response.json()["detail"]
    
    def test_delete_photo_negative_index(self, client, test_db, mock_storage_client):
        """Test deleting photo with negative index."""
        car = CarWithPhotosFactory()
        test_db.add(car)
        test_db.commit()
        test_db.refresh(car)
        
        response = client.delete(f"/cars/{car.id}/photos/-1")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "Photo not found" in response.json()["detail"]
    
    def test_delete_photo_out_of_range_index(self, client, test_db, mock_storage_client):
        """Test deleting photo with out-of-range index."""
        car = CarWithPhotosFactory()
        test_db.add(car)
        test_db.commit()
        test_db.refresh(car)
        
        # Try to delete photo at index beyond array length
        invalid_index = len(car.photos) + 5
        response = client.delete(f"/cars/{car.id}/photos/{invalid_index}")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "Photo not found" in response.json()["detail"]
    
    def test_delete_middle_photo(self, client, test_db, mock_storage_client):
        """Test deleting a photo from the middle of the list."""
        # Create car with 3 photos
        car = CarWithPhotosFactory()
        car.photos = [
            "https://storage.googleapis.com/test-bucket/photo1.jpg",
            "https://storage.googleapis.com/test-bucket/photo2.jpg",
            "https://storage.googleapis.com/test-bucket/photo3.jpg"
        ]
        test_db.add(car)
        test_db.commit()
        test_db.refresh(car)
        
        # Delete middle photo (index 1)
        response = client.delete(f"/cars/{car.id}/photos/1")
        
        assert response.status_code == status.HTTP_200_OK
        
        # Verify correct photo was removed and order maintained
        car_response = client.get(f"/cars/{car.id}")
        car_data = car_response.json()
        assert len(car_data["photos"]) == 2
        assert car_data["photos"][0] == "https://storage.googleapis.com/test-bucket/photo1.jpg"
        assert car_data["photos"][1] == "https://storage.googleapis.com/test-bucket/photo3.jpg"