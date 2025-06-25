# Car Finder Platform - Development Session

## Project Overview
Car marketplace platform built on Google Cloud Platform with React frontend and Python FastAPI backend.

## Architecture
- **Frontend**: React SPA at http://34.34.95.85 (GKE LoadBalancer)
- **Backend**: Python FastAPI at http://34.12.88.58:8000 (GKE LoadBalancer)  
- **Database**: PostgreSQL on Cloud SQL (carfinder database)
- **Infrastructure**: Google Kubernetes Engine (GKE) in car-finder-dev project
- **Storage**: Cloud Storage bucket car-finder-dev-photos (created, ready for photos)

## Current Status
✅ **Working Features:**
- Homepage with latest 9 cars from database
- Car detail pages with URL routing (http://34.34.95.85/#car/{id})
- CRUD API for cars with all required fields
- Database with 4 cars (Toyota, BMW, VW, Mercedes)
- Contact seller and share link functionality

⏸️ **In Progress:**
- Photo upload system (infrastructure ready, needs database migration)

## API Endpoints
**Base URL**: http://34.12.88.58:8000
- `GET /cars` - Get latest cars (limit=9 default)
- `GET /cars/{id}` - Get car details
- `POST /cars` - Add new car
- `PUT /cars/{id}` - Update car
- `DELETE /cars/{id}` - Delete car

## Car Schema
```json
{
  "brand": "string",
  "model": "string", 
  "series": "string (optional)",
  "year": "integer",
  "mileage_km": "integer",
  "engine_cm3": "integer", 
  "car_status": "stacjonarny|odpala|odpala i jezdzi",
  "location_status": "na miejscu|w drodze",
  "price": "float"
}
```

## Database Details
- **Instance**: dev-postgres-bbf5771d (europe-west4)
- **Database**: carfinder
- **User**: carfinder_user
- **Host**: 10.25.0.3:5432
- **Tables**: cars (with id, created_at, mileage_miles auto-generated)

## Infrastructure Commands
```bash
# Connect to GKE cluster
gcloud container clusters get-credentials dev-gke-cluster --zone=europe-west4-a --project=car-finder-dev

# Check services
kubectl get services
kubectl get pods

# Add new car
curl -X POST "http://34.12.88.58:8000/cars" \
  -H "Content-Type: application/json" \
  -d '{"brand":"Toyota","model":"Camry","year":2023,"mileage_km":15000,"engine_cm3":2500,"car_status":"odpala i jezdzi","location_status":"na miejscu","price":95000}'
```

## Key File Locations
- Frontend: `/mnt/c/Users/danie/Documents/code/app/k8s/frontend/`
- Backend: `/mnt/c/Users/danie/Documents/code/app/k8s/backend/`
- Infrastructure: `/mnt/c/Users/danie/Documents/code/app/infrastructure/`

## Next Session Tasks
1. Fix photo upload database migration (add photos JSON column)
2. Re-enable photo upload endpoints
3. Test complete photo upload workflow
4. Consider adding image resizing/optimization

## Development Environment
- **Project**: car-finder-dev
- **Region**: europe-west4
- **Cluster**: dev-gke-cluster (3 preemptible nodes)
- **Frontend IP**: 34.34.95.85
- **Backend IP**: 34.12.88.58

## Budget & Resources
- Budget: €30/month per environment
- Current usage: Running on minimal resources to stay within budget
- Cluster: Sometimes at capacity (scale down if needed)