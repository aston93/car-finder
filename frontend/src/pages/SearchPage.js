import React, { useState, useEffect } from 'react';
import CarCard from '../components/CarCard';
import { searchCars } from '../services/api';

function SearchPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    priceMin: '',
    priceMax: '',
    yearMin: '',
    yearMax: '',
    fuelType: '',
    transmission: ''
  });

  useEffect(() => {
    const handleInitialSearch = async (searchFilters) => {
      setLoading(true);
      try {
        const data = await searchCars(searchFilters);
        setCars(data);
      } catch (error) {
        console.error('Błąd wyszukiwania:', error);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    // Load URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const initialFilters = { ...filters };
    
    urlParams.forEach((value, key) => {
      if (key in initialFilters) {
        initialFilters[key] = value;
      }
    });
    
    setFilters(initialFilters);
    handleInitialSearch(initialFilters);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (searchFilters = filters) => {
    setLoading(true);
    try {
      const data = await searchCars(searchFilters);
      setCars(data);
    } catch (error) {
      console.error('Błąd wyszukiwania:', error);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const clearFilters = () => {
    const clearedFilters = {
      make: '',
      model: '',
      priceMin: '',
      priceMax: '',
      yearMin: '',
      yearMax: '',
      fuelType: '',
      transmission: ''
    };
    setFilters(clearedFilters);
    handleSearch(clearedFilters);
  };

  return (
    <div className="container">
      <h1 style={{ margin: '2rem 0' }}>Wyszukiwanie samochodów</h1>

      {/* Filters */}
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="make">Marka</label>
            <select
              id="make"
              name="make"
              value={filters.make}
              onChange={handleInputChange}
            >
              <option value="">Wszystkie marki</option>
              <option value="Audi">Audi</option>
              <option value="BMW">BMW</option>
              <option value="Ford">Ford</option>
              <option value="Honda">Honda</option>
              <option value="Mercedes">Mercedes</option>
              <option value="Toyota">Toyota</option>
              <option value="Volkswagen">Volkswagen</option>
              <option value="Volvo">Volvo</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="model">Model</label>
            <input
              type="text"
              id="model"
              name="model"
              placeholder="np. Golf, Passat"
              value={filters.model}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fuelType">Paliwo</label>
            <select
              id="fuelType"
              name="fuelType"
              value={filters.fuelType}
              onChange={handleInputChange}
            >
              <option value="">Wszystkie</option>
              <option value="Benzyna">Benzyna</option>
              <option value="Diesel">Diesel</option>
              <option value="Elektryczny">Elektryczny</option>
              <option value="Hybryda">Hybryda</option>
              <option value="LPG">LPG</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="transmission">Skrzynia biegów</label>
            <select
              id="transmission"
              name="transmission"
              value={filters.transmission}
              onChange={handleInputChange}
            >
              <option value="">Wszystkie</option>
              <option value="Manualna">Manualna</option>
              <option value="Automatyczna">Automatyczna</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priceMin">Cena od (PLN)</label>
            <input
              type="number"
              id="priceMin"
              name="priceMin"
              placeholder="0"
              value={filters.priceMin}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="priceMax">Cena do (PLN)</label>
            <input
              type="number"
              id="priceMax"
              name="priceMax"
              placeholder="1000000"
              value={filters.priceMax}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="yearMin">Rok od</label>
            <input
              type="number"
              id="yearMin"
              name="yearMin"
              placeholder="2000"
              min="1990"
              max="2025"
              value={filters.yearMin}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="yearMax">Rok do</label>
            <input
              type="number"
              id="yearMax"
              name="yearMax"
              placeholder="2025"
              min="1990"
              max="2025"
              value={filters.yearMax}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Szukanie...' : '🔍 Szukaj'}
            </button>
          </div>
          <div className="form-group">
            <button type="button" className="btn-secondary" onClick={clearFilters}>
              🗑️ Wyczyść filtry
            </button>
          </div>
        </div>
      </form>

      {/* Results */}
      <div style={{ margin: '2rem 0' }}>
        <h2>Wyniki wyszukiwania ({cars.length})</h2>
      </div>

      {loading ? (
        <div className="loading">Wyszukiwanie samochodów...</div>
      ) : cars.length > 0 ? (
        <div className="cars-grid">
          {cars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <h3>Brak wyników</h3>
          <p>Nie znaleziono samochodów spełniających podane kryteria.</p>
          <p>Spróbuj zmienić filtry wyszukiwania.</p>
        </div>
      )}
    </div>
  );
}

export default SearchPage;