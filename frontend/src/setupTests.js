// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';

// Mock service worker setup
import { server } from './mocks/server';

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());

// Mock window.location
delete window.location;
window.location = { assign: jest.fn(), hash: '' };

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to ignore specific console output
  // log: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};