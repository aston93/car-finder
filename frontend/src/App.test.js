import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock the api service
jest.mock('./services/api', () => ({
  getCars: jest.fn(() => Promise.resolve([])),
  getCar: jest.fn(() => Promise.resolve({}))
}));

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Car Finder/i)).toBeInTheDocument();
  });

  test('renders navigation elements', () => {
    render(<App />);
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Search/i)).toBeInTheDocument();
  });
});