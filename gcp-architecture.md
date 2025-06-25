# Car Offers Platform - GCP Architecture Design

## 1. High-Level Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              INTERNET USERS                                      │
└─────────────────────┬───────────────────────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────────────────────┐
│                        CLOUD CDN (Global)                                       │
└─────────────────────┬───────────────────────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────────────────────┐
│                     LOAD BALANCER (HTTPS)                                       │
│                   (Global External LB)                                          │
└─────────────────────┬───────────────────────────────────────────────────────────┘
                      │
    ┌─────────────────▼─────────────────┐
    │           FRONTEND              │
    │        (GKE Cluster)            │
    │     React.js (Static Site)      │
    │      Nginx Container            │
    └─────────────┬───────────────────┘
                  │ API Calls
    ┌─────────────▼─────────────────┐
    │           BACKEND             │
    │        (GKE Cluster)          │
    │      Python FastAPI           │
    │    (Horizontal Pod Auto)      │
    └─────┬───────────┬─────────────┘
          │           │
          │           │
┌─────────▼───┐   ┌───▼─────────────────────┐
│   DATABASE  │   │    FILE STORAGE         │
│             │   │                         │
│ Cloud SQL   │   │   Cloud Storage         │
│ PostgreSQL  │   │   (Images & Assets)     │
│             │   │                         │
└─────────────┘   └─────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                            SUPPORTING SERVICES                                  │
├─────────────────┬─────────────────┬─────────────────┬─────────────────────────┤
│  Identity &     │   Monitoring    │   CI/CD         │   Infrastructure        │
│  Access Mgmt    │   & Logging     │                 │                         │
│                 │                 │                 │                         │
│ • Cloud IAM     │ • Cloud Logging │ • Cloud Build   │ • Terraform             │
│ • Firebase Auth │ • Cloud Monitor │ • GitHub Actions│ • Secret Manager        │
│ • Google OAuth  │ • Error Report  │ • Artifact Reg  │ • VPC Networks          │
└─────────────────┴─────────────────┴─────────────────┴─────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                        ENVIRONMENT SEPARATION                                   │
├─────────────────────────────────┬───────────────────────────────────────────────┤
│              DEV                │                PROD                           │
│                                 │                                               │
│ • GKE Cluster (dev-cluster)     │ • GKE Cluster (prod-cluster)                 │
│ • Cloud SQL (dev-db)            │ • Cloud SQL (prod-db)                        │
│ • Storage Bucket (dev-images)   │ • Storage Bucket (prod-images)               │
│ • Separate VPC Network          │ • Separate VPC Network                       │
│ • Separate Service Accounts     │ • Separate Service Accounts                  │
└─────────────────────────────────┴───────────────────────────────────────────────┘
```

## 2. Component-by-Component Explanation

### **Cloud CDN & Global Load Balancer**
The entry point for all users, providing global content delivery and SSL termination. Cloud CDN caches static assets (images, CSS, JS) at edge locations across Europe and beyond. The Global External Load Balancer handles HTTPS traffic, terminates SSL certificates, and routes requests to the appropriate backend services. This ensures sub-2-second page loads by serving cached content from locations closest to users.

### **Frontend Layer (GKE)**
A containerized React.js application served by Nginx containers running in Google Kubernetes Engine. The frontend handles the user interface for browsing car offers, authentication flows, and admin panels. It communicates with the backend via REST APIs. The static build artifacts are also uploaded to Cloud Storage and served via CDN for optimal performance.

### **Backend API Layer (GKE)**
Python FastAPI application running in GKE containers with Horizontal Pod Autoscaling. This handles all business logic including offer management, user authentication, image uploads, search/filtering, and admin operations. The API is stateless and scales automatically based on CPU and memory usage. It integrates with Firebase Auth for Google OAuth authentication.

### **Database Layer (Cloud SQL)**
PostgreSQL database running on Cloud SQL with automated backups, high availability, and read replicas for performance. Stores all structured data including user profiles, car offers, favorites, and metadata. The database uses connection pooling and is configured with appropriate sizing for the expected 500 daily visits.

### **File Storage (Cloud Storage)**
Stores all uploaded car images and static assets. Images are automatically optimized and served through Cloud CDN. The buckets have lifecycle policies to manage costs and versioning enabled for data protection. Images are organized by offer ID and include multiple sizes for responsive design.

### **Identity & Access Management**
Firebase Authentication integrated with Google OAuth provides seamless login with Gmail accounts. Cloud IAM manages service-to-service authentication and authorization. Service accounts are used for secure communication between components with least-privilege access principles.

### **Monitoring & Observability**
Cloud Logging collects all application and infrastructure logs. Cloud Monitoring provides metrics, alerting, and dashboards for system health. Error Reporting automatically captures and aggregates application errors. This ensures proactive issue detection and meets the 99.9% uptime SLA requirement.

## 3. Technology Choices & Justifications

### **GKE (Google Kubernetes Engine)**
**Chosen for:** Container orchestration, auto-scaling, and simplified deployment management.
**Alternative:** Cloud Run would be simpler and cheaper for this workload size, automatically scaling to zero when not in use. However, GKE provides more control over networking and resource allocation, which may be beneficial as the platform grows.

### **Cloud SQL PostgreSQL**
**Chosen for:** ACID compliance, complex queries for search/filtering, and strong consistency.
**Alternative:** Firestore would be simpler to manage and potentially cheaper at small scale, but PostgreSQL provides better querying capabilities for car offer searches and filters.

### **FastAPI (Python)**
**Chosen for:** High performance, automatic API documentation, and strong typing support.
**Alternative:** Flask would be simpler but lacks built-in features. Django would provide more out-of-the-box functionality but has higher overhead.

### **React.js Frontend**
**Chosen for:** Rich user interface, large ecosystem, and good performance.
**Alternative:** Vue.js or plain HTML/JS would be simpler and lighter, but React provides better component reusability and developer experience.

### **Firebase Authentication**
**Chosen for:** Seamless Google OAuth integration and managed authentication service.
**Alternative:** Cloud Identity-Aware Proxy would be simpler but less flexible for custom authentication flows.

### **Terraform**
**Chosen for:** Infrastructure as Code, version control, and environment consistency.
**Alternative:** Google Cloud Deployment Manager would be simpler but Terraform provides better multi-cloud portability and larger community.

## 4. CI/CD Pipeline Design

### **Repository Structure**
```
car-offers-platform/
├── frontend/          # React.js application
├── backend/           # Python FastAPI application  
├── infrastructure/    # Terraform configurations
├── .github/workflows/ # GitHub Actions workflows
└── k8s/              # Kubernetes manifests
```

### **Environment Separation Strategy**
- **DEV Environment:** Triggered on pushes to `develop` branch
- **PROD Environment:** Triggered on pushes to `main` branch
- **Feature Branches:** Run tests only, no deployment

### **GitHub Actions Workflow**

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Backend Tests
        run: |
          cd backend
          python -m pytest
      - name: Run Frontend Tests  
        run: |
          cd frontend
          npm test

  build-and-deploy-dev:
    if: github.ref == 'refs/heads/develop'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to DEV
        run: |
          # Build and push Docker images
          # Apply Terraform for DEV
          # Deploy to GKE DEV cluster

  build-and-deploy-prod:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to PROD
        run: |
          # Build and push Docker images
          # Apply Terraform for PROD
          # Deploy to GKE PROD cluster
```

### **Deployment Strategy**
- **Rolling Updates:** Gradual pod replacement for zero-downtime deployments
- **Rollback Capability:** Kubernetes rollback to previous deployment version
- **Health Checks:** Liveness and readiness probes ensure service availability

### **Secret Management**
- **Google Secret Manager:** Stores database credentials, API keys, and certificates
- **Kubernetes Secrets:** Injected into pods at runtime
- **Environment Separation:** Separate secrets for DEV and PROD environments

## 5. Cost Estimation

### **Month 1 (MVP Launch)**
| Service | DEV | PROD | Total (EUR) |
|---------|-----|------|-------------|
| **GKE Clusters** | €45 | €75 | €120 |
| *- 2 nodes (e2-medium)* | | | |
| **Cloud SQL** | €25 | €45 | €70 |
| *- db-f1-micro (DEV), db-g1-small (PROD)* | | | |
| **Cloud Storage** | €5 | €15 | €20 |
| *- 50GB images + CDN* | | | |
| **Load Balancer** | €10 | €18 | €28 |
| **Cloud CDN** | €3 | €8 | €11 |
| **Monitoring & Logging** | €5 | €10 | €15 |
| **Networking** | €5 | €8 | €13 |
| **Firebase Auth** | €0 | €0 | €0 |
| **Secret Manager** | €1 | €1 | €2 |
| **Artifact Registry** | €2 | €3 | €5 |
| **SUBTOTAL** | €101 | €183 | **€284** |

### **Steady State (Month 6+)**
| Service | DEV | PROD | Total (EUR) |
|---------|-----|------|-------------|
| **GKE Clusters** | €45 | €120 | €165 |
| *- Auto-scaled 2-4 nodes* | | | |
| **Cloud SQL** | €25 | €65 | €90 |
| *- With read replica* | | | |
| **Cloud Storage** | €8 | €35 | €43 |
| *- 200GB images + increased CDN* | | | |
| **Load Balancer** | €10 | €22 | €32 |
| **Cloud CDN** | €5 | €18 | €23 |
| **Monitoring & Logging** | €8 | €15 | €23 |
| **Networking** | €8 | €12 | €20 |
| **Other Services** | €8 | €8 | €16 |
| **SUBTOTAL** | €117 | €295 | **€412** |

### **Cost Optimization Notes**
- **Preemptible GKE nodes** could reduce costs by 60-70%
- **Cloud Run** alternative could reduce costs to ~€150/month total
- **Committed use discounts** available for 1-3 year terms (20-57% savings)
- **Resource quotas** and **budget alerts** recommended

## 6. Next Steps & Open Items

### **Immediate Next Steps (Week 1-2)**
1. **GCP Project Setup**
   - Create separate projects for DEV and PROD
   - Enable required APIs (GKE, Cloud SQL, Storage, etc.)
   - Set up billing accounts and budget alerts

2. **Terraform Infrastructure**
   - Write Terraform modules for VPC, GKE, Cloud SQL
   - Create environment-specific configurations
   - Set up remote state management

3. **GitHub Repository Setup**
   - Initialize repository with proper structure
   - Configure GitHub Actions workflows
   - Set up branch protection rules

### **Development Phase (Week 3-8)**
4. **Backend API Development**
   - Implement FastAPI application structure
   - Set up database models and migrations
   - Integrate Firebase Authentication
   - Implement core endpoints (offers, users, search)

5. **Frontend Development**
   - Create React.js application
   - Implement responsive design
   - Integrate with backend APIs
   - Add Google OAuth login flow

6. **DevOps & Deployment**
   - Create Docker images and Kubernetes manifests
   - Set up monitoring and logging
   - Configure SSL certificates and domain
   - Implement backup and disaster recovery

### **Open Items & Decisions Needed**
- **Offer Expiration Policy:** Recommend 90-day auto-expiration with renewal option
- **Image Optimization:** Implement automatic resizing and WebP conversion
- **Search Performance:** Consider adding Elasticsearch for advanced search (future enhancement)
- **Caching Strategy:** Implement Redis for session and query caching
- **Email Notifications:** Integrate with SendGrid or similar service
- **Domain & SSL:** Register domain and configure Cloud DNS
- **GDPR Compliance:** Although not required initially, consider data retention policies
- **Performance Testing:** Load testing strategy for peak traffic scenarios
- **Backup Strategy:** Automated database backups and cross-region replication
- **Security Audit:** Penetration testing and security review before production launch

### **Future Enhancements (Post-MVP)**
- Multi-region deployment for better global performance
- Advanced search with Elasticsearch
- Real-time notifications using Cloud Pub/Sub
- Mobile application development
- Integration with external car valuation APIs
- Advanced analytics and reporting dashboard

---

## Architecture Summary

This GCP-based architecture provides a scalable, cost-effective solution for your car offers platform that meets all specified requirements:

✅ **Handles 500 daily visits** with room for growth  
✅ **Sub-2 second page loads** via CDN and optimized architecture  
✅ **99.9% uptime SLA** through redundancy and monitoring  
✅ **Google OAuth integration** with Firebase Auth  
✅ **Complete DEV/PROD separation** via isolated environments  
✅ **Cost-optimized** starting at ~€284/month  
✅ **Polish language support** in frontend  
✅ **Image handling** up to 5MB with automatic optimization  

The architecture balances simplicity and scalability, allowing you to start small and grow efficiently as your user base expands. The use of managed services reduces operational overhead while maintaining flexibility for future enhancements.