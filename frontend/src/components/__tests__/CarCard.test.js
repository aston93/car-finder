/**
 * Tests for CarCard component - TDD approach
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import CarCard from '../CarCard';

const mockCar = {
  id: 1,
  make: 'Toyota',
  model: 'Camry',
  year: 2023,
  price: 95000,
  mileage: 15000,
  fuel_type: 'Hybrid',
  transmission: 'Automatyczna',
  location: 'Warszawa',
  image_url: 'https://example.com/photo1.jpg'
};

const renderCarCard = (car = mockCar, props = {}) => {
  return render(
    <BrowserRouter>
      <CarCard car={car} {...props} />
    </BrowserRouter>
  );
};

describe('CarCard', () => {
  describe('Basic Information Display', () => {
    test('renders car make and model correctly', () => {
      renderCarCard();
      
      expect(screen.getByText('2023 Toyota Camry')).toBeInTheDocument();
    });

    test('renders fuel type when available', () => {
      renderCarCard();
      
      expect(screen.getByText(/Hybrid/)).toBeInTheDocument();
    });

    test('handles missing fuel type gracefully', () => {
      const carWithoutFuelType = { ...mockCar, fuel_type: null };
      renderCarCard(carWithoutFuelType);
      
      expect(screen.getByText('2023 Toyota Camry')).toBeInTheDocument();
      expect(screen.queryByText(/Hybrid/)).not.toBeInTheDocument();
    });

    test('renders year correctly', () => {
      renderCarCard();
      
      expect(screen.getByText(/2023/)).toBeInTheDocument();
    });

    test('renders price in correct format', () => {
      renderCarCard();
      
      expect(screen.getByText(/95 000/)).toBeInTheDocument();
      expect(screen.getByText(/zł/)).toBeInTheDocument();
    });

    test('renders mileage in kilometers', () => {
      renderCarCard();
      
      expect(screen.getByText(/15 000 km/)).toBeInTheDocument();
    });
  });

  describe('Photo Display', () => {
    test('displays car photo when available', () => {
      renderCarCard();
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', 'https://example.com/photo1.jpg');
      expect(image).toHaveAttribute('alt', 'Toyota Camry');
    });

    test('displays placeholder when no photo available', () => {
      const carWithoutPhoto = { ...mockCar, image_url: null };
      renderCarCard(carWithoutPhoto);
      
      expect(screen.getByText(/Zdjęcie Toyota Camry/)).toBeInTheDocument();
    });
  });

  describe('Car Details', () => {
    test('displays transmission correctly', () => {
      renderCarCard();
      
      expect(screen.getByText(/Automatyczna/)).toBeInTheDocument();
    });

    test('displays location when available', () => {
      renderCarCard();
      
      expect(screen.getByText(/Warszawa/)).toBeInTheDocument();
    });
  });

  describe('Price Formatting', () => {
    test('formats large prices with spaces', () => {
      const expensiveCar = { ...mockCar, price: 1500000 };
      renderCarCard(expensiveCar);
      
      expect(screen.getByText(/1 500 000/)).toBeInTheDocument();
    });

    test('handles decimal prices correctly', () => {
      const carWithDecimal = { ...mockCar, price: 95000.50 };
      renderCarCard(carWithDecimal);
      
      expect(screen.getByText(/95 001/)).toBeInTheDocument(); // PLN formatting rounds up
    });
  });

  describe('Edge Cases', () => {
    test('handles undefined car data gracefully', () => {
      expect(() => renderCarCard(undefined)).not.toThrow();
    });

    test('handles missing required fields', () => {
      const incompleteCar = { id: 1, brand: 'Toyota' };
      expect(() => renderCarCard(incompleteCar)).not.toThrow();
    });
  });
});