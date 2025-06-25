# Test-Driven Development (TDD) Guide

## Overview

This project follows Test-Driven Development (TDD) principles. All new features must be developed using the TDD workflow.

## TDD Workflow

### 1. **Red Phase** - Write Failing Test
```bash
# Start test watch mode
./scripts/tdd-workflow.sh watch

# Choose backend or frontend and write your test
# Test should fail initially (Red)
```

### 2. **Green Phase** - Make Test Pass
```bash
# Write minimal code to make the test pass
# Run tests to verify (Green)
npm test  # Frontend
pytest    # Backend
```

### 3. **Refactor Phase** - Improve Code
```bash
# Refactor code while keeping tests green
# Run full test suite to ensure no regressions
./scripts/tdd-workflow.sh all
```

## Testing Structure

### Backend Tests
```
backend/
├── conftest.py           # Test configuration and fixtures
├── factories.py          # Test data factories
├── pytest.ini           # Pytest configuration
├── test_main.py         # Legacy tests (to be migrated)
└── tests/
    ├── __init__.py
    ├── test_car_crud.py     # Car CRUD operation tests
    ├── test_photo_upload.py # Photo upload/delete tests
    └── test_api_endpoints.py # General API tests
```

### Frontend Tests
```
frontend/src/
├── setupTests.js           # Test setup and MSW configuration
├── mocks/
│   ├── handlers.js         # MSW request handlers
│   └── server.js          # MSW server setup
└── components/__tests__/
    ├── CarCard.test.js     # CarCard component tests
    ├── CarDetailPage.test.js # Car detail page tests
    └── HomePage.test.js    # Homepage tests
```

## Testing Commands

### Quick Commands
```bash
# Run all tests
./scripts/tdd-workflow.sh all

# Run specific component tests
./scripts/tdd-workflow.sh backend
./scripts/tdd-workflow.sh frontend

# Watch mode for TDD
./scripts/tdd-workflow.sh watch

# Pre-commit checks
./scripts/tdd-workflow.sh pre-commit

# Linting only
./scripts/tdd-workflow.sh lint
```

### Manual Commands

#### Backend
```bash
cd backend
source venv/bin/activate

# Run all tests with coverage
pytest

# Run specific test file
pytest tests/test_car_crud.py

# Run tests with watch mode
pytest-watch

# Run tests with specific markers
pytest -m "not slow"
pytest -m "integration"
```

#### Frontend
```bash
cd frontend

# Run all tests with coverage
npm test -- --coverage --watchAll=false

# Watch mode
npm test

# Run specific test file
npm test -- CarCard.test.js

# Update snapshots
npm test -- --updateSnapshot
```

## Coverage Requirements

- **Backend**: Minimum 80% code coverage
- **Frontend**: Minimum 80% code coverage
- **Critical paths**: 100% coverage required

### Viewing Coverage Reports
- Backend: `backend/htmlcov/index.html`
- Frontend: `frontend/coverage/lcov-report/index.html`

## Test Writing Guidelines

### Backend Test Structure
```python
class TestFeatureName:
    """Test class for specific feature."""
    
    def test_success_case(self, client, test_db):
        """Test successful operation."""
        # Arrange
        data = {"field": "value"}
        
        # Act
        response = client.post("/endpoint", json=data)
        
        # Assert
        assert response.status_code == 200
        assert response.json()["field"] == "value"
    
    def test_error_case(self, client):
        """Test error handling."""
        # Test error scenarios
        pass
```

### Frontend Test Structure
```javascript
describe('ComponentName', () => {
  describe('Feature Group', () => {
    test('should behavior when condition', () => {
      // Arrange
      render(<Component prop="value" />);
      
      // Act
      fireEvent.click(screen.getByText('Button'));
      
      // Assert
      expect(screen.getByText('Result')).toBeInTheDocument();
    });
  });
});
```

## Test Data Management

### Backend
- Use `factories.py` for creating test data
- Use `conftest.py` for shared fixtures
- Each test gets fresh database via `test_db` fixture

```python
def test_car_creation(client, test_db):
    car = ToyotaCamryFactory()
    test_db.add(car)
    test_db.commit()
    # Test logic
```

### Frontend
- Use MSW (Mock Service Worker) for API mocking
- Mock data in `src/mocks/handlers.js`
- Customize responses per test as needed

```javascript
// Override API response for specific test
server.use(
  rest.get('/api/cars', (req, res, ctx) => {
    return res(ctx.status(500));
  })
);
```

## CI/CD Integration

### GitHub Actions
The CI/CD pipeline runs:
1. **Frontend tests** with coverage reporting
2. **Backend tests** with coverage reporting
3. **Linting** for code quality
4. **Build verification**
5. **Deployment** (only if all tests pass)

### Coverage Artifacts
- Coverage reports are uploaded as GitHub artifacts
- View them in the Actions tab after each run

## Development Workflow

### Adding New Features
1. **Start with tests** - Write failing tests first
2. **Implement feature** - Write minimal code to pass tests
3. **Refactor** - Improve code while maintaining green tests
4. **Commit** - Only commit when all tests pass

### Before Committing
```bash
# Run pre-commit checks
./scripts/tdd-workflow.sh pre-commit

# Should show:
# ✅ Backend tests passed
# ✅ Frontend tests passed  
# ✅ Linting passed
# ✅ Ready to commit and deploy
```

### Local Testing Environment
```bash
# Start local testing environment
./test-local.sh

# Provides:
# - Local PostgreSQL database
# - Backend at http://localhost:8001
# - Frontend at http://localhost:3001
# - Full integration testing
```

## Best Practices

### Test Naming
- **Backend**: `test_<action>_<condition>_<expected_result>`
- **Frontend**: `should <expected_result> when <condition>`

### Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Test both success and failure cases
- Test edge cases and error conditions

### Mocking
- Mock external dependencies (APIs, storage, etc.)
- Don't mock the code you're testing
- Use factories for consistent test data

### Performance
- Keep tests fast (< 100ms per test)
- Use in-memory databases for unit tests
- Parallel test execution where possible

## Common Patterns

### Testing API Endpoints
```python
def test_endpoint_success(client, sample_data):
    response = client.post("/endpoint", json=sample_data)
    assert response.status_code == 200
    
def test_endpoint_validation(client):
    response = client.post("/endpoint", json={})
    assert response.status_code == 422
```

### Testing React Components
```javascript
test('renders correctly', () => {
  render(<Component />);
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});

test('handles user interaction', async () => {
  render(<Component />);
  fireEvent.click(screen.getByRole('button'));
  await waitFor(() => {
    expect(screen.getByText('Result')).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Common Issues
1. **Tests timing out**: Increase timeout or check for infinite loops
2. **Flaky tests**: Usually caused by async operations or timing issues
3. **Coverage too low**: Add tests for uncovered branches
4. **Mock not working**: Check mock setup and reset between tests

### Debug Commands
```bash
# Run single test with verbose output
pytest tests/test_file.py::test_function -v -s

# Run with debugger
pytest --pdb

# Frontend debug mode
npm test -- --verbose --no-coverage
```

## Migration from Existing Code

### Backend Migration
- ✅ `test_main.py` - Basic tests (keep for compatibility)
- ✅ New comprehensive test suite in `tests/` directory
- 🔄 Gradually migrate old tests to new structure

### Frontend Migration
- ✅ Enhanced `CarCard.test.js`
- ✅ New comprehensive component tests
- 🔄 Add tests for remaining components

## Next Steps

1. **Complete component test coverage**
2. **Add integration tests**
3. **Set up E2E tests**
4. **Performance testing**
5. **Visual regression testing**