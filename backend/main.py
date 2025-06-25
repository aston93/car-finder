from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
import os
import json
from google.cloud import storage

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cars.db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Car model (SQLAlchemy)
class Car(Base):
    __tablename__ = "cars"
    
    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String, nullable=False)
    model = Column(String, nullable=False) 
    series = Column(String, nullable=True)
    year = Column(Integer, nullable=False)
    mileage_km = Column(Integer, nullable=False)
    mileage_miles = Column(Integer, nullable=False)
    engine_cm3 = Column(Integer, nullable=False)
    car_status = Column(String, nullable=False)  # stacjonarny / odpala / odpala i jezdzi
    location_status = Column(String, nullable=False)  # na miejscu / w drodze
    price = Column(Float, nullable=False)
    photos = Column(JSON, nullable=True, default=lambda: [])
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic models
class CarBase(BaseModel):
    brand: str
    model: str
    series: Optional[str] = None
    year: int
    mileage_km: int
    engine_cm3: int
    car_status: str
    location_status: str
    price: float

class CarCreate(CarBase):
    pass

class CarResponse(CarBase):
    id: int
    mileage_miles: int
    photos: Optional[List[str]] = []
    created_at: datetime
    
    class Config:
        from_attributes = True

# Create tables
Base.metadata.create_all(bind=engine)

# Cloud Storage setup
BUCKET_NAME = "car-finder-dev-photos"
storage_client = storage.Client()
bucket = storage_client.bucket(BUCKET_NAME)

# FastAPI app
app = FastAPI(title="Car Finder API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Helper function to convert km to miles
def km_to_miles(km: int) -> int:
    return int(km * 0.621371)

# API Endpoints
@app.get("/")
def read_root():
    return {"message": "Car Finder API", "version": "1.0.0"}

@app.get("/cars", response_model=List[CarResponse])
def get_cars(db: Session = Depends(get_db)):
    cars = db.query(Car).all()
    return cars

@app.get("/cars/{car_id}", response_model=CarResponse)
def get_car(car_id: int, db: Session = Depends(get_db)):
    car = db.query(Car).filter(Car.id == car_id).first()
    if car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    return car

@app.post("/cars", response_model=CarResponse)
def create_car(car: CarCreate, db: Session = Depends(get_db)):
    # Calculate miles from km
    mileage_miles = km_to_miles(car.mileage_km)
    
    db_car = Car(
        brand=car.brand,
        model=car.model,
        series=car.series,
        year=car.year,
        mileage_km=car.mileage_km,
        mileage_miles=mileage_miles,
        engine_cm3=car.engine_cm3,
        car_status=car.car_status,
        location_status=car.location_status,
        price=car.price,
        photos=[]
    )
    
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    return db_car

@app.put("/cars/{car_id}", response_model=CarResponse)
def update_car(car_id: int, car: CarCreate, db: Session = Depends(get_db)):
    db_car = db.query(Car).filter(Car.id == car_id).first()
    if db_car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    
    # Update fields
    db_car.brand = car.brand
    db_car.model = car.model
    db_car.series = car.series
    db_car.year = car.year
    db_car.mileage_km = car.mileage_km
    db_car.mileage_miles = km_to_miles(car.mileage_km)
    db_car.engine_cm3 = car.engine_cm3
    db_car.car_status = car.car_status
    db_car.location_status = car.location_status
    db_car.price = car.price
    
    db.commit()
    db.refresh(db_car)
    return db_car

@app.post("/cars/{car_id}/photos")
async def upload_car_photo(car_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Check if car exists
    db_car = db.query(Car).filter(Car.id == car_id).first()
    if db_car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Generate unique filename
    import uuid
    file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
    unique_filename = f"car_{car_id}_{uuid.uuid4()}.{file_extension}"
    
    try:
        # Upload to Cloud Storage
        blob = bucket.blob(unique_filename)
        contents = await file.read()
        blob.upload_from_string(contents, content_type=file.content_type)
        blob.make_public()
        
        # Get public URL
        photo_url = blob.public_url
        
        # Update car photos in database
        if db_car.photos is None:
            db_car.photos = []
        db_car.photos = db_car.photos + [photo_url]
        
        db.commit()
        db.refresh(db_car)
        
        return {"message": "Photo uploaded successfully", "photo_url": photo_url}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload photo: {str(e)}")

@app.delete("/cars/{car_id}/photos/{photo_index}")
def delete_car_photo(car_id: int, photo_index: int, db: Session = Depends(get_db)):
    # Check if car exists
    db_car = db.query(Car).filter(Car.id == car_id).first()
    if db_car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    
    # Check if photo exists
    if not db_car.photos or photo_index >= len(db_car.photos) or photo_index < 0:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    try:
        # Extract filename from URL and delete from Cloud Storage
        photo_url = db_car.photos[photo_index]
        filename = photo_url.split('/')[-1]
        blob = bucket.blob(filename)
        if blob.exists():
            blob.delete()
        
        # Remove from database
        photos_list = list(db_car.photos)
        photos_list.pop(photo_index)
        db_car.photos = photos_list
        
        db.commit()
        
        return {"message": "Photo deleted successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete photo: {str(e)}")

@app.delete("/cars/{car_id}")
def delete_car(car_id: int, db: Session = Depends(get_db)):
    db_car = db.query(Car).filter(Car.id == car_id).first()
    if db_car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    
    db.delete(db_car)
    db.commit()
    return {"message": "Car deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)