import axios from 'axios';

// API base URL - will be set based on environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions

// Car-related API calls
export const searchCars = async (filters = {}) => {
  try {
    const response = await api.get('/cars', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error searching cars:', error);
    // Return mock data for development
    return getMockCars(filters);
  }
};

export const getCarById = async (id) => {
  try {
    const response = await api.get(`/cars/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting car by ID:', error);
    // Return mock data for development
    return getMockCarById(id);
  }
};

export const createCar = async (carData) => {
  try {
    const response = await api.post('/cars', carData);
    return response.data;
  } catch (error) {
    console.error('Error creating car:', error);
    throw new Error('Nie udało się dodać ogłoszenia');
  }
};

export const updateCar = async (id, carData) => {
  try {
    const response = await api.put(`/cars/${id}`, carData);
    return response.data;
  } catch (error) {
    console.error('Error updating car:', error);
    throw new Error('Nie udało się zaktualizować ogłoszenia');
  }
};

export const deleteCar = async (id) => {
  try {
    await api.delete(`/cars/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting car:', error);
    throw new Error('Nie udało się usunąć ogłoszenia');
  }
};

// Authentication API calls
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { token, user };
  } catch (error) {
    console.error('Error logging in:', error);
    throw new Error('Nieprawidłowy email lub hasło');
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    const { token, user } = response.data;
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { token, user };
  } catch (error) {
    console.error('Error registering:', error);
    throw new Error('Nie udało się utworzyć konta');
  }
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.href = '/';
};

// Mock data for development (when backend is not available)
const getMockCars = (filters = {}) => {
  const mockCars = [
    {
      id: 1,
      make: 'Toyota',
      model: 'Corolla',
      year: 2020,
      price: 75000,
      mileage: 45000,
      fuel_type: 'Benzyna',
      transmission: 'Manualna',
      location: 'Warszawa',
      color: 'Srebrny',
      doors: 5,
      created_at: '2025-01-15T10:00:00Z',
      seller_name: 'Jan Kowalski',
      seller_phone: '+48 123 456 789',
      seller_email: 'jan@example.com'
    },
    {
      id: 2,
      make: 'BMW',
      model: '3 Series',
      year: 2019,
      price: 120000,
      mileage: 60000,
      fuel_type: 'Diesel',
      transmission: 'Automatyczna',
      location: 'Kraków',
      color: 'Czarny',
      doors: 4,
      created_at: '2025-01-14T15:30:00Z',
      seller_name: 'Anna Nowak',
      seller_phone: '+48 987 654 321',
      seller_email: 'anna@example.com'
    },
    {
      id: 3,
      make: 'Volkswagen',
      model: 'Golf',
      year: 2021,
      price: 85000,
      mileage: 25000,
      fuel_type: 'Benzyna',
      transmission: 'Manualna',
      location: 'Gdańsk',
      color: 'Biały',
      doors: 5,
      created_at: '2025-01-13T09:15:00Z',
      seller_name: 'Piotr Wiśniewski',
      seller_phone: '+48 555 666 777',
      seller_email: 'piotr@example.com'
    },
    {
      id: 4,
      make: 'Audi',
      model: 'A4',
      year: 2018,
      price: 95000,
      mileage: 80000,
      fuel_type: 'Diesel',
      transmission: 'Automatyczna',
      location: 'Wrocław',
      color: 'Niebieski',
      doors: 4,
      created_at: '2025-01-12T14:20:00Z',
      seller_name: 'Maria Kowalczyk',
      seller_phone: '+48 111 222 333',
      seller_email: 'maria@example.com'
    },
    {
      id: 5,
      make: 'Honda',
      model: 'Civic',
      year: 2022,
      price: 90000,
      mileage: 15000,
      fuel_type: 'Hybryda',
      transmission: 'Automatyczna',
      location: 'Poznań',
      color: 'Czerwony',
      doors: 5,
      created_at: '2025-01-11T11:45:00Z',
      seller_name: 'Tomasz Zieliński',
      seller_phone: '+48 444 555 666',
      seller_email: 'tomasz@example.com'
    },
    {
      id: 6,
      make: 'Ford',
      model: 'Focus',
      year: 2017,
      price: 55000,
      mileage: 95000,
      fuel_type: 'Benzyna',
      transmission: 'Manualna',
      location: 'Łódź',
      color: 'Szary',
      doors: 5,
      created_at: '2025-01-10T16:30:00Z',
      seller_name: 'Katarzyna Lewandowska',
      seller_phone: '+48 777 888 999',
      seller_email: 'katarzyna@example.com'
    }
  ];

  // Apply filters
  let filteredCars = mockCars;

  if (filters.make) {
    filteredCars = filteredCars.filter(car => 
      car.make.toLowerCase().includes(filters.make.toLowerCase())
    );
  }

  if (filters.model) {
    filteredCars = filteredCars.filter(car => 
      car.model.toLowerCase().includes(filters.model.toLowerCase())
    );
  }

  if (filters.priceMin) {
    filteredCars = filteredCars.filter(car => car.price >= parseInt(filters.priceMin));
  }

  if (filters.priceMax) {
    filteredCars = filteredCars.filter(car => car.price <= parseInt(filters.priceMax));
  }

  if (filters.yearMin) {
    filteredCars = filteredCars.filter(car => car.year >= parseInt(filters.yearMin));
  }

  if (filters.yearMax) {
    filteredCars = filteredCars.filter(car => car.year <= parseInt(filters.yearMax));
  }

  if (filters.fuelType) {
    filteredCars = filteredCars.filter(car => car.fuel_type === filters.fuelType);
  }

  if (filters.transmission) {
    filteredCars = filteredCars.filter(car => car.transmission === filters.transmission);
  }

  // Apply limit
  if (filters.limit) {
    filteredCars = filteredCars.slice(0, parseInt(filters.limit));
  }

  return filteredCars;
};

const getMockCarById = (id) => {
  const cars = getMockCars();
  const car = cars.find(c => c.id === parseInt(id));
  
  if (car) {
    return {
      ...car,
      description: `Sprzedam ${car.make} ${car.model} z ${car.year} roku. Samochód w bardzo dobrym stanie technicznym, regularnie serwisowany. Pierwszy właściciel, książka serwisowa. Auto nie było rozbijane, bez wypadków. Opony w dobrym stanie. Klimatyzacja sprawna. Wszystkie systemy działają bez zarzutu.`
    };
  }
  
  return null;
};

export default api;