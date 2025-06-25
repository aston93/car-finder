import { rest } from 'msw';

const API_BASE = 'http://localhost:8000';

// Sample car data for testing
const sampleCars = [
  {
    id: 1,
    brand: 'Toyota',
    model: 'Camry',
    series: 'Hybrid',
    year: 2023,
    mileage_km: 15000,
    mileage_miles: 9320,
    engine_cm3: 2500,
    car_status: 'odpala i jezdzi',
    location_status: 'na miejscu',
    price: 95000.0,
    photos: ['https://example.com/photo1.jpg'],
    created_at: '2023-06-01T10:00:00Z'
  },
  {
    id: 2,
    brand: 'BMW',
    model: 'X5',
    series: 'Sport',
    year: 2022,
    mileage_km: 25000,
    mileage_miles: 15534,
    engine_cm3: 3000,
    car_status: 'odpala i jezdzi',
    location_status: 'na miejscu',
    price: 150000.0,
    photos: [],
    created_at: '2023-06-02T10:00:00Z'
  }
];

export const handlers = [
  // Get all cars
  rest.get(`${API_BASE}/cars`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(sampleCars));
  }),

  // Get single car
  rest.get(`${API_BASE}/cars/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const car = sampleCars.find(car => car.id === parseInt(id));
    
    if (!car) {
      return res(
        ctx.status(404),
        ctx.json({ detail: 'Car not found' })
      );
    }
    
    return res(ctx.status(200), ctx.json(car));
  }),

  // Create car
  rest.post(`${API_BASE}/cars`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 3,
        ...req.body,
        mileage_miles: Math.round(req.body.mileage_km * 0.621371),
        photos: [],
        created_at: '2023-06-03T10:00:00Z'
      })
    );
  }),

  // Update car
  rest.put(`${API_BASE}/cars/:id`, (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.status(200),
      ctx.json({
        id: parseInt(id),
        ...req.body,
        mileage_miles: Math.round(req.body.mileage_km * 0.621371),
        photos: [],
        created_at: '2023-06-01T10:00:00Z'
      })
    );
  }),

  // Delete car
  rest.delete(`${API_BASE}/cars/:id`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ message: 'Car deleted successfully' })
    );
  }),

  // Upload photo
  rest.post(`${API_BASE}/cars/:id/photos`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Photo uploaded successfully',
        photo_url: 'https://example.com/new-photo.jpg'
      })
    );
  }),

  // Delete photo
  rest.delete(`${API_BASE}/cars/:id/photos/:photoIndex`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ message: 'Photo deleted successfully' })
    );
  }),

  // Health endpoint
  rest.get(`${API_BASE}/health`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 'ok',
        version: '1.0.1',
        timestamp: new Date().toISOString()
      })
    );
  })
];