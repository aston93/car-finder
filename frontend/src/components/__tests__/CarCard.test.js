import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import CarCard from '../CarCard';

const mockCar = {
  id: 1,
  brand: 'Toyota',
  model: 'Camry',
  series: 'Hybrid',
  year: 2023,
  mileage_km: 15000,
  engine_cm3: 2500,
  car_status: 'odpala i jezdzi',
  location_status: 'na miejscu',
  price: 95000,
  photos: []
};

describe('CarCard Component', () => {
  test('renders car information correctly', () => {
    render(
      <MemoryRouter>
        <CarCard car={mockCar} />
      </MemoryRouter>
    );

    expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('95,000 PLN')).toBeInTheDocument();
    expect(screen.getByText('15,000 km')).toBeInTheDocument();
  });

  test('renders with missing series', () => {
    const carWithoutSeries = { ...mockCar, series: null };
    render(
      <MemoryRouter>
        <CarCard car={carWithoutSeries} />
      </MemoryRouter>
    );

    expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
  });

  test('has correct link to car detail page', () => {
    render(
      <MemoryRouter>
        <CarCard car={mockCar} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/car/1');
  });
});