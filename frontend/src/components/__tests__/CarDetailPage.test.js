/**
 * Tests for CarDetailPage component - TDD approach
 */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { rest } from 'msw';
import { server } from '../../mocks/server';
import CarDetailPage from '../../pages/CarDetailPage';

// Mock react-router-dom useParams
const mockNavigate = jest.fn();
const mockParams = { id: '1' };

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}));

const renderCarDetailPage = () => {
  return render(
    <BrowserRouter>
      <CarDetailPage />
    </BrowserRouter>
  );
};

describe('CarDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    test('shows loading message while fetching car data', () => {
      // Mock slow API response
      server.use(
        rest.get('http://localhost:8000/cars/1', (req, res, ctx) => {
          return res(ctx.delay(1000), ctx.status(200), ctx.json({}));
        })
      );

      renderCarDetailPage();
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('Car Data Display', () => {
    test('displays car information correctly', async () => {
      renderCarDetailPage();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
      });

      // Check all car details are displayed
      expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
      expect(screen.getByText(/2023/)).toBeInTheDocument();
      expect(screen.getByText(/15,000 km/)).toBeInTheDocument();
      expect(screen.getByText(/9,320 miles/)).toBeInTheDocument();
      expect(screen.getByText(/2500 cm³/)).toBeInTheDocument();
      expect(screen.getByText(/95,000/)).toBeInTheDocument();
      expect(screen.getByText(/odpala i jezdzi/)).toBeInTheDocument();
      expect(screen.getByText(/na miejscu/)).toBeInTheDocument();
    });

    test('displays car series when available', async () => {
      renderCarDetailPage();

      await waitFor(() => {
        expect(screen.getByText(/Hybrid/)).toBeInTheDocument();
      });
    });

    test('handles missing car series gracefully', async () => {
      // Mock car without series
      server.use(
        rest.get('http://localhost:8000/cars/1', (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              id: 1,
              brand: 'Toyota',
              model: 'Camry',
              series: null,
              year: 2023,
              mileage_km: 15000,
              mileage_miles: 9320,
              engine_cm3: 2500,
              car_status: 'odpala i jezdzi',
              location_status: 'na miejscu',
              price: 95000.0,
              photos: [],
            })
          );
        })
      );

      renderCarDetailPage();

      await waitFor(() => {
        expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
      });

      // Should not show series
      expect(screen.queryByText(/Hybrid/)).not.toBeInTheDocument();
    });
  });

  describe('Photo Display', () => {
    test('displays car photos when available', async () => {
      renderCarDetailPage();

      await waitFor(() => {
        const photos = screen.getAllByRole('img');
        expect(photos).toHaveLength(1);
        expect(photos[0]).toHaveAttribute('src', 'https://example.com/photo1.jpg');
      });
    });

    test('shows no photos message when car has no photos', async () => {
      // Mock car without photos
      server.use(
        rest.get('http://localhost:8000/cars/1', (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              id: 1,
              brand: 'Toyota',
              model: 'Camry',
              photos: [],
              year: 2023,
              mileage_km: 15000,
              mileage_miles: 9320,
              engine_cm3: 2500,
              car_status: 'odpala i jezdzi',
              location_status: 'na miejscu',
              price: 95000.0,
            })
          );
        })
      );

      renderCarDetailPage();

      await waitFor(() => {
        expect(screen.getByText(/no photos/i)).toBeInTheDocument();
      });
    });
  });

  describe('Contact Seller Feature', () => {
    test('shows contact seller button', async () => {
      renderCarDetailPage();

      await waitFor(() => {
        expect(screen.getByText(/contact seller/i)).toBeInTheDocument();
      });
    });

    test('clicking contact seller button triggers action', async () => {
      renderCarDetailPage();

      await waitFor(() => {
        const contactButton = screen.getByText(/contact seller/i);
        fireEvent.click(contactButton);
        // Add assertion for contact action (e.g., opening email client)
      });
    });
  });

  describe('Share Feature', () => {
    test('shows share button', async () => {
      renderCarDetailPage();

      await waitFor(() => {
        expect(screen.getByText(/share/i)).toBeInTheDocument();
      });
    });

    test('clicking share button copies URL to clipboard', async () => {
      // Mock clipboard API
      Object.assign(navigator, {
        clipboard: {
          writeText: jest.fn(),
        },
      });

      renderCarDetailPage();

      await waitFor(() => {
        const shareButton = screen.getByText(/share/i);
        fireEvent.click(shareButton);
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
          expect.stringContaining('/car/1')
        );
      });
    });
  });

  describe('Error Handling', () => {
    test('displays error message when car not found', async () => {
      // Mock 404 response
      server.use(
        rest.get('http://localhost:8000/cars/1', (req, res, ctx) => {
          return res(
            ctx.status(404),
            ctx.json({ detail: 'Car not found' })
          );
        })
      );

      renderCarDetailPage();

      await waitFor(() => {
        expect(screen.getByText(/car not found/i)).toBeInTheDocument();
      });
    });

    test('displays error message when API is unavailable', async () => {
      // Mock network error
      server.use(
        rest.get('http://localhost:8000/cars/1', (req, res, ctx) => {
          return res.networkError('Failed to connect');
        })
      );

      renderCarDetailPage();

      await waitFor(() => {
        expect(screen.getByText(/error loading/i)).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    test('has back to search button', async () => {
      renderCarDetailPage();

      await waitFor(() => {
        expect(screen.getByText(/back to search/i)).toBeInTheDocument();
      });
    });

    test('clicking back button navigates to search page', async () => {
      renderCarDetailPage();

      await waitFor(() => {
        const backButton = screen.getByText(/back to search/i);
        fireEvent.click(backButton);
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });

  describe('URL Parameters', () => {
    test('fetches correct car based on URL parameter', async () => {
      // Change mock params
      mockParams.id = '2';

      renderCarDetailPage();

      await waitFor(() => {
        // Should fetch car with ID 2
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
      });
    });

    test('handles invalid car ID parameter', async () => {
      mockParams.id = 'invalid';

      server.use(
        rest.get('http://localhost:8000/cars/invalid', (req, res, ctx) => {
          return res(
            ctx.status(422),
            ctx.json({ detail: 'Invalid car ID' })
          );
        })
      );

      renderCarDetailPage();

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });
  });
});