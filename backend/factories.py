"""Test data factories for creating test objects."""
import factory
from factory import fuzzy
from datetime import datetime
from main import Car


class CarFactory(factory.Factory):
    """Factory for creating Car test objects."""
    
    class Meta:
        model = Car
    
    # Basic car info
    brand = factory.Faker('random_element', elements=['Toyota', 'BMW', 'Mercedes', 'Audi', 'Volkswagen'])
    model = factory.Faker('random_element', elements=['Camry', 'X5', 'E-Class', 'A4', 'Golf'])
    series = factory.Faker('random_element', elements=['Sport', 'Luxury', 'Hybrid', 'Base', None])
    
    # Technical specs
    year = fuzzy.FuzzyInteger(2015, 2024)
    mileage_km = fuzzy.FuzzyInteger(1000, 200000)
    mileage_miles = factory.LazyAttribute(lambda obj: int(obj.mileage_km * 0.621371))
    engine_cm3 = fuzzy.FuzzyInteger(1000, 5000)
    
    # Status fields
    car_status = factory.Faker('random_element', elements=['stacjonarny', 'odpala', 'odpala i jezdzi'])
    location_status = factory.Faker('random_element', elements=['na miejscu', 'w drodze'])
    
    # Financial
    price = fuzzy.FuzzyFloat(10000.0, 500000.0)
    
    # Metadata
    photos = factory.LazyFunction(lambda: [])
    created_at = factory.LazyFunction(datetime.utcnow)


# Pre-configured car factories for specific test scenarios
class ToyotaCamryFactory(CarFactory):
    """Factory for Toyota Camry cars."""
    brand = "Toyota"
    model = "Camry"
    year = 2023
    mileage_km = 15000
    engine_cm3 = 2500
    car_status = "odpala i jezdzi"
    location_status = "na miejscu"
    price = 95000.0


class HighMileageCarFactory(CarFactory):
    """Factory for high-mileage cars."""
    mileage_km = fuzzy.FuzzyInteger(150000, 300000)
    car_status = "odpala"
    price = fuzzy.FuzzyFloat(5000.0, 25000.0)


class LuxuryCarFactory(CarFactory):
    """Factory for luxury cars."""
    brand = factory.Faker('random_element', elements=['BMW', 'Mercedes', 'Audi'])
    model = factory.Faker('random_element', elements=['X5', 'E-Class', 'A8'])
    series = "Luxury"
    year = fuzzy.FuzzyInteger(2020, 2024)
    mileage_km = fuzzy.FuzzyInteger(1000, 50000)
    engine_cm3 = fuzzy.FuzzyInteger(3000, 6000)
    car_status = "odpala i jezdzi"
    location_status = "na miejscu"
    price = fuzzy.FuzzyFloat(100000.0, 500000.0)


class CarWithPhotosFactory(CarFactory):
    """Factory for cars with photos."""
    photos = factory.LazyFunction(lambda: [
        "https://storage.googleapis.com/test-bucket/car_1_photo1.jpg",
        "https://storage.googleapis.com/test-bucket/car_1_photo2.jpg"
    ])