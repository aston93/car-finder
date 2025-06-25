#!/bin/bash

# Local testing script for TDD workflow
set -e

echo "🧪 Starting local testing environment..."

# Function to cleanup on exit
cleanup() {
    echo "🧹 Cleaning up..."
    docker-compose -f docker-compose.test.yml down
}
trap cleanup EXIT

# Start test environment
echo "📦 Starting test containers..."
docker-compose -f docker-compose.test.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Run backend tests
echo "🐍 Running backend tests..."
docker-compose -f docker-compose.test.yml exec -T backend-test pytest -v --cov=main --cov-report=html

# Run frontend tests
echo "⚛️ Running frontend tests..."
docker-compose -f docker-compose.test.yml exec -T frontend-test npm test -- --coverage --watchAll=false

# Integration tests (optional)
echo "🔗 Running integration tests..."
curl -f http://localhost:8001/health || echo "⚠️ Backend health check failed"
curl -f http://localhost:3001 || echo "⚠️ Frontend health check failed"

echo "✅ All tests completed!"
echo "📊 Coverage reports:"
echo "   Backend: backend/htmlcov/index.html"
echo "   Frontend: frontend/coverage/lcov-report/index.html"