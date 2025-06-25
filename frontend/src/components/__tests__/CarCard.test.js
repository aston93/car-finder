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
  brand: 'Toyota',
  model: 'Camry',
  series: 'Hybrid',
  year: 2023,
  price: 95000,
  mileage_km: 15000,
  mileage_miles: 9320,
  engine_cm3: 2500,
  car_status: 'odpala i jezdzi',
  location_status: 'na miejscu',
  photos: ['https://example.com/photo1.jpg'],
  created_at: '2023-06-01T10:00:00Z'
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
    test('renders car brand and model correctly', () => {
      renderCarCard();
      
      expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
    });

    test('renders car series when available', () => {
      renderCarCard();
      
      expect(screen.getByText(/Hybrid/)).toBeInTheDocument();
    });

    test('handles missing series gracefully', () => {
      const carWithoutSeries = { ...mockCar, series: null };
      renderCarCard(carWithoutSeries);
      
      expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
      expect(screen.queryByText(/Hybrid/)).not.toBeInTheDocument();
    });

    test('renders year correctly', () => {
      renderCarCard();
      
      expect(screen.getByText('2023')).toBeInTheDocument();
    });

    test('renders price in correct format', () => {
      renderCarCard();
      
      expect(screen.getByText(/95,000/)).toBeInTheDocument();
    });

    test('renders mileage in kilometers', () => {
      renderCarCard();
      
      expect(screen.getByText(/15,000 km/)).toBeInTheDocument();
    });
  });

  describe('Photo Display', () => {
    test('displays first car photo when available', () => {
      renderCarCard();
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', 'https://example.com/photo1.jpg');
      expect(image).toHaveAttribute('alt', expect.stringContaining('Toyota Camry'));
    });

    test('displays placeholder when no photos available', () => {
      const carWithoutPhotos = { ...mockCar, photos: [] };
      renderCarCard(carWithoutPhotos);
      
      expect(screen.getByText(/no photo/i)).toBeInTheDocument();
    });
  });

  describe('Status Indicators', () => {
    test('displays car status correctly', () => {
      renderCarCard();
      
      expect(screen.getByText(/odpala i jezdzi/)).toBeInTheDocument();
    });

    test('displays location status correctly', () => {
      renderCarCard();
      
      expect(screen.getByText(/na miejscu/)).toBeInTheDocument();
    });
  });

  describe('Price Formatting', () => {
    test('formats large prices with commas', () => {
      const expensiveCar = { ...mockCar, price: 1500000 };
      renderCarCard(expensiveCar);
      
      expect(screen.getByText(/1,500,000/)).toBeInTheDocument();
    });

    test('handles decimal prices correctly', () => {
      const carWithDecimal = { ...mockCar, price: 95000.50 };
      renderCarCard(carWithDecimal);
      
      expect(screen.getByText(/95,000/)).toBeInTheDocument();
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