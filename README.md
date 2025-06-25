# Car Finder Platform

A modern car marketplace platform built with React frontend and Python FastAPI backend, deployed on Google Cloud Platform.

## 🚀 Live Demo

- **Frontend**: http://34.34.95.85
- **Backend API**: http://34.12.88.58:8000

## 🏗️ Architecture

- **Frontend**: React SPA with responsive design
- **Backend**: Python FastAPI with PostgreSQL database
- **Infrastructure**: Google Kubernetes Engine (GKE)
- **Storage**: Google Cloud Storage for car photos
- **Database**: PostgreSQL on Cloud SQL

## ✨ Features

- Browse latest cars with pagination
- Detailed car pages with specifications
- Photo upload and management system
- Contact seller functionality
- Share car listings
- CRUD operations for car listings
- RESTful API with automatic documentation

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router for navigation
- CSS3 with responsive design
- Fetch API for backend communication

### Backend
- Python 3.11
- FastAPI with automatic OpenAPI docs
- SQLAlchemy ORM
- PostgreSQL database
- Google Cloud Storage integration
- Pydantic for data validation

### Infrastructure
- Google Kubernetes Engine (GKE)
- Google Cloud SQL (PostgreSQL)
- Google Cloud Storage
- LoadBalancer services
- ConfigMaps and Secrets management

## 📁 Project Structure

```
car-finder/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   └── styles/         # CSS stylesheets
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Python FastAPI backend
│   ├── main.py             # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile
├── k8s/                    # Kubernetes manifests
│   ├── frontend/           # Frontend deployment configs
│   └── backend/            # Backend deployment configs
├── infrastructure/         # Terraform infrastructure code
│   ├── modules/            # Reusable Terraform modules
│   └── environments/       # Environment-specific configs
└── .github/                # GitHub Actions workflows
```

## 🚀 API Endpoints

### Cars
- `GET /cars` - Get latest cars (limit=9 default)
- `GET /cars/{id}` - Get car details
- `POST /cars` - Add new car
- `PUT /cars/{id}` - Update car
- `DELETE /cars/{id}` - Delete car

### Photos
- `POST /cars/{id}/photos` - Upload car photo
- `DELETE /cars/{id}/photos/{index}` - Delete car photo

## 🗄️ Database Schema

### Cars Table
```sql
- id (Primary Key)
- brand (String)
- model (String)
- series (String, Optional)
- year (Integer)
- mileage_km (Integer)
- mileage_miles (Integer, Auto-calculated)
- engine_cm3 (Integer)
- car_status (String: "stacjonarny", "odpala", "odpala i jezdzi")
- location_status (String: "na miejscu", "w drodze")
- price (Float)
- photos (JSON Array of URLs)
- created_at (Timestamp)
```

## 🔧 Development

### Prerequisites
- Node.js 16+
- Python 3.11+
- Google Cloud CLI
- kubectl
- Docker (for local development)

### Local Development
1. Clone the repository
2. Install frontend dependencies: `cd frontend && npm install`
3. Install backend dependencies: `cd backend && pip install -r requirements.txt`
4. Configure environment variables
5. Run frontend: `npm start`
6. Run backend: `uvicorn main:app --reload`

### Environment Variables
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `GOOGLE_APPLICATION_CREDENTIALS` - Path to service account key

## 🚀 Deployment

The application is deployed on Google Kubernetes Engine with:
- LoadBalancer services for external access
- ConfigMaps for application code
- Secrets for sensitive data
- Resource limits for cost optimization

### Manual Deployment
```bash
# Connect to GKE cluster
gcloud container clusters get-credentials dev-gke-cluster --zone=europe-west4-a --project=car-finder-dev

# Deploy frontend
kubectl apply -f k8s/frontend/

# Deploy backend
kubectl apply -f k8s/backend/
```

## 🔄 CI/CD with GitHub Actions

GitHub Actions workflows are configured for:
- Automated testing
- Building Docker images
- Deploying to GKE
- Running security scans

## 💰 Cost Optimization

- Preemptible GKE nodes
- Resource limits on containers
- Efficient image sizes
- Automatic scaling based on demand

## 🛡️ Security

- Service account-based authentication
- Secrets management in Kubernetes
- HTTPS ready configuration
- Input validation and sanitization

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.