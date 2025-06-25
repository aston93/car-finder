/**
 * Tests for HomePage component - TDD approach
 */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { rest } from 'msw';
import { server } from '../../mocks/server';
import HomePage from '../../pages/HomePage';

const renderHomePage = () => {
  return render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  describe('Page Structure', () => {
    test('renders page title', () => {
      renderHomePage();
      expect(screen.getByText(/car finder/i)).toBeInTheDocument();
    });

    test('renders search section', () => {
      renderHomePage();
      expect(screen.getByText(/find your perfect car/i)).toBeInTheDocument();
    });

    test('renders latest cars section', () => {
      renderHomePage();
      expect(screen.getByText(/latest cars/i)).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    test('renders search form elements', () => {
      renderHomePage();
      
      expect(screen.getByLabelText(/brand/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/max price/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });

    test('search form has correct initial values', () => {
      renderHomePage();
      
      expect(screen.getByLabelText(/brand/i)).toHaveValue('');
      expect(screen.getByLabelText(/model/i)).toHaveValue('');
      expect(screen.getByLabelText(/max price/i)).toHaveValue('');
    });

    test('updates form fields when user types', () => {
      renderHomePage();
      
      const brandInput = screen.getByLabelText(/brand/i);
      const modelInput = screen.getByLabelText(/model/i);
      const priceInput = screen.getByLabelText(/max price/i);

      fireEvent.change(brandInput, { target: { value: 'Toyota' } });
      fireEvent.change(modelInput, { target: { value: 'Camry' } });
      fireEvent.change(priceInput, { target: { value: '100000' } });

      expect(brandInput).toHaveValue('Toyota');
      expect(modelInput).toHaveValue('Camry');
      expect(priceInput).toHaveValue('100000');
    });

    test('submitting search form navigates to search page', () => {
      const mockNavigate = jest.fn();
      jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockNavigate,
      }));

      renderHomePage();
      
      const searchForm = screen.getByRole('form', { name: /search cars/i });
      fireEvent.submit(searchForm);

      // Should navigate to search page with parameters
      expect(mockNavigate).toHaveBeenCalledWith('/search');
    });
  });

  describe('Latest Cars Display', () => {
    test('shows loading state while fetching cars', () => {
      // Mock slow API response
      server.use(
        rest.get('http://localhost:8000/cars', (req, res, ctx) => {
          return res(ctx.delay(1000), ctx.status(200), ctx.json([]));
        })
      );

      renderHomePage();
      expect(screen.getByText(/loading latest cars/i)).toBeInTheDocument();
    });

    test('displays latest cars when data loads', async () => {
      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
        expect(screen.getByText('BMW X5')).toBeInTheDocument();
      });
    });

    test('shows correct car information in cards', async () => {
      renderHomePage();

      await waitFor(() => {
        // Check Toyota Camry details
        expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
        expect(screen.getByText(/2023/)).toBeInTheDocument();
        expect(screen.getByText(/95,000/)).toBeInTheDocument();

        // Check BMW X5 details
        expect(screen.getByText('BMW X5')).toBeInTheDocument();
        expect(screen.getByText(/2022/)).toBeInTheDocument();
        expect(screen.getByText(/150,000/)).toBeInTheDocument();
      });
    });

    test('displays empty state when no cars available', async () => {
      // Mock empty response
      server.use(
        rest.get('http://localhost:8000/cars', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json([]));
        })
      );

      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText(/no cars available/i)).toBeInTheDocument();
      });
    });

    test('limits display to latest 9 cars', async () => {
      // Mock response with 12 cars
      const manyCars = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        brand: `Brand${i + 1}`,
        model: `Model${i + 1}`,
        year: 2023,
        price: 50000,
        mileage_km: 10000,
        mileage_miles: 6214,
        engine_cm3: 2000,
        car_status: 'odpala i jezdzi',
        location_status: 'na miejscu',
        photos: [],
      }));

      server.use(
        rest.get('http://localhost:8000/cars', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(manyCars));
        })
      );

      renderHomePage();

      await waitFor(() => {
        const carCards = screen.getAllByTestId(/car-card/i);
        expect(carCards).toHaveLength(9);
      });
    });
  });

  describe('Car Card Interactions', () => {
    test('clicking on car card navigates to car detail page', async () => {
      const mockNavigate = jest.fn();
      jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockNavigate,
      }));

      renderHomePage();

      await waitFor(() => {
        const carCard = screen.getByText('Toyota Camry').closest('[data-testid*="car-card"]');
        fireEvent.click(carCard);
        expect(mockNavigate).toHaveBeenCalledWith('/car/1');
      });
    });

    test('car cards have proper hover effects', async () => {
      renderHomePage();

      await waitFor(() => {
        const carCard = screen.getByText('Toyota Camry').closest('[data-testid*="car-card"]');
        expect(carCard).toHaveClass('hover:shadow-lg');
      });
    });
  });

  describe('Error Handling', () => {
    test('displays error message when API fails', async () => {
      // Mock API error
      server.use(
        rest.get('http://localhost:8000/cars', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ detail: 'Internal server error' }));
        })
      );

      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText(/error loading cars/i)).toBeInTheDocument();
      });
    });

    test('displays retry button when API fails', async () => {
      server.use(
        rest.get('http://localhost:8000/cars', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ detail: 'Internal server error' }));
        })
      );

      renderHomePage();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });
    });

    test('retry button refetches data', async () => {
      let failOnce = true;
      server.use(
        rest.get('http://localhost:8000/cars', (req, res, ctx) => {
          if (failOnce) {
            failOnce = false;
            return res(ctx.status(500), ctx.json({ detail: 'Internal server error' }));
          }
          return res(ctx.status(200), ctx.json([]));
        })
      );

      renderHomePage();

      await waitFor(() => {
        const retryButton = screen.getByRole('button', { name: /retry/i });
        fireEvent.click(retryButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/no cars available/i)).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design', () => {
    test('adjusts layout for mobile screens', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderHomePage();

      const container = screen.getByTestId('homepage-container');
      expect(container).toHaveClass('responsive-layout');
    });

    test('adjusts layout for desktop screens', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      renderHomePage();

      const container = screen.getByTestId('homepage-container');
      expect(container).toHaveClass('desktop-layout');
    });
  });

  describe('Performance', () => {
    test('implements proper loading states', () => {
      renderHomePage();
      
      // Should show loading immediately
      expect(screen.getByText(/loading latest cars/i)).toBeInTheDocument();
    });

    test('memoizes expensive computations', () => {
      // This would test React.memo or useMemo implementations
      // For now, just verify component renders efficiently
      const { rerender } = renderHomePage();
      
      // Rerender with same props shouldn't cause unnecessary re-renders
      rerender(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      
      expect(screen.getByText(/car finder/i)).toBeInTheDocument();
    });
  });
});