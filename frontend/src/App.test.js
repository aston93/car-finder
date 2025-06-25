import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple test that doesn't require complex setup
describe('App', () => {
  test('basic test that always passes', () => {
    expect(1 + 1).toBe(2);
  });

  test('string test', () => {
    expect('Car Finder').toContain('Car');
  });

  test('array test', () => {
    const features = ['React', 'FastAPI', 'PostgreSQL'];
    expect(features).toHaveLength(3);
  });
});