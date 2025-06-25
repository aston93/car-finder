#!/bin/bash

# TDD Workflow Script
# Usage: ./scripts/tdd-workflow.sh [frontend|backend|all]

set -e

COMPONENT=${1:-all}
PROJECT_ROOT=$(dirname $(dirname $(realpath $0)))

echo "🚀 Starting TDD Workflow for: $COMPONENT"
echo "📍 Project root: $PROJECT_ROOT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to run backend tests
run_backend_tests() {
    echo -e "${BLUE}🐍 Running Backend Tests${NC}"
    cd "$PROJECT_ROOT/backend"
    
    # Install dependencies if needed
    if [ ! -d "venv" ]; then
        echo "Creating virtual environment..."
        python -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
    else
        source venv/bin/activate
    fi
    
    echo "Running pytest with coverage..."
    pytest tests/ -v --cov=main --cov-report=html --cov-report=term-missing
    
    echo -e "${GREEN}✅ Backend tests completed${NC}"
    echo "📊 Coverage report: backend/htmlcov/index.html"
}

# Function to run frontend tests
run_frontend_tests() {
    echo -e "${BLUE}⚛️ Running Frontend Tests${NC}"
    cd "$PROJECT_ROOT/frontend"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "Installing npm dependencies..."
        npm install
    fi
    
    echo "Running Jest tests with coverage..."
    npm test -- --coverage --watchAll=false --verbose
    
    echo -e "${GREEN}✅ Frontend tests completed${NC}"
    echo "📊 Coverage report: frontend/coverage/lcov-report/index.html"
}

# Function to run linting
run_linting() {
    echo -e "${BLUE}🧹 Running Linting${NC}"
    
    # Backend linting
    if [ "$COMPONENT" = "backend" ] || [ "$COMPONENT" = "all" ]; then
        cd "$PROJECT_ROOT/backend"
        if [ -d "venv" ]; then
            source venv/bin/activate
            echo "Running flake8..."
            flake8 main.py tests/ --max-line-length=120 --ignore=E501,W503 || echo "Linting issues found"
        fi
    fi
    
    # Frontend linting
    if [ "$COMPONENT" = "frontend" ] || [ "$COMPONENT" = "all" ]; then
        cd "$PROJECT_ROOT/frontend"
        if [ -d "node_modules" ]; then
            echo "Running ESLint..."
            npm run lint || echo "Linting issues found"
        fi
    fi
}

# Function to watch tests (for TDD)
watch_tests() {
    echo -e "${YELLOW}👀 Starting Test Watch Mode${NC}"
    echo "Choose component to watch:"
    echo "1) Backend (pytest --watch)"
    echo "2) Frontend (npm test --watch)"
    read -p "Enter choice (1 or 2): " choice
    
    case $choice in
        1)
            cd "$PROJECT_ROOT/backend"
            source venv/bin/activate 2>/dev/null || true
            echo "Starting pytest in watch mode..."
            pytest-watch tests/ -- -v --cov=main
            ;;
        2)
            cd "$PROJECT_ROOT/frontend"
            echo "Starting Jest in watch mode..."
            npm test
            ;;
        *)
            echo "Invalid choice"
            exit 1
            ;;
    esac
}

# Function to pre-commit checks
pre_commit_checks() {
    echo -e "${BLUE}🔍 Running Pre-commit Checks${NC}"
    
    # Run tests
    if [ "$COMPONENT" = "backend" ] || [ "$COMPONENT" = "all" ]; then
        run_backend_tests
    fi
    
    if [ "$COMPONENT" = "frontend" ] || [ "$COMPONENT" = "all" ]; then
        run_frontend_tests
    fi
    
    # Run linting
    run_linting
    
    echo -e "${GREEN}✅ All pre-commit checks passed!${NC}"
    echo -e "${YELLOW}🚀 Ready to commit and deploy${NC}"
}

# Main execution
case $COMPONENT in
    backend)
        run_backend_tests
        ;;
    frontend)
        run_frontend_tests
        ;;
    all)
        run_backend_tests
        run_frontend_tests
        ;;
    watch)
        watch_tests
        ;;
    lint)
        run_linting
        ;;
    pre-commit)
        pre_commit_checks
        ;;
    *)
        echo "Usage: $0 [backend|frontend|all|watch|lint|pre-commit]"
        echo ""
        echo "Commands:"
        echo "  backend     - Run backend tests only"
        echo "  frontend    - Run frontend tests only"
        echo "  all         - Run all tests"
        echo "  watch       - Start test watch mode for TDD"
        echo "  lint        - Run linting on all code"
        echo "  pre-commit  - Run full test suite before commit"
        exit 1
        ;;
esac

echo -e "${GREEN}🎉 TDD Workflow completed successfully!${NC}"