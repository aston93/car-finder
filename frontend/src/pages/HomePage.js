import React, { useState, useEffect } from 'react';
import CarCard from '../components/CarCard';
import { searchCars } from '../services/api';

function HomePage() {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchForm, setSearchForm] = useState({
    make: '',
    model: '',
    priceMin: '',
    priceMax: '',
    yearMin: '',
    yearMax: ''
  });

  useEffect(() => {
    loadFeaturedCars();
  }, []);

  const loadFeaturedCars = async () => {
    try {
      const data = await searchCars({ limit: 6 });
      setFeaturedCars(data);
    } catch (error) {
      console.error('Błąd ładowania samochodów:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to search page with filters
    const params = new URLSearchParams();
    Object.entries(searchForm).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Znajdź swój idealny samochód</h1>
          <p>
            Przeglądaj tysiące ogłoszeń samochodowych i znajdź najlepsze oferty 
            od zaufanych sprzedawców w całej Polsce.
          </p>

          {/* Search Form */}
          <form className="search-form" onSubmit={handleSearch}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="make">Marka</label>
                <select
                  id="make"
                  name="make"
                  value={searchForm.make}
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
                  value={searchForm.model}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="priceMin">Cena od (PLN)</label>
                <input
                  type="number"
                  id="priceMin"
                  name="priceMin"
                  placeholder="0"
                  value={searchForm.priceMin}
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
                  value={searchForm.priceMax}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="yearMin">Rok od</label>
                <input
                  type="number"
                  id="yearMin"
                  name="yearMin"
                  placeholder="2000"
                  min="1990"
                  max="2025"
                  value={searchForm.yearMin}
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
                  value={searchForm.yearMax}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>&nbsp;</label>
                <button type="submit" className="btn-primary">
                  🔍 Szukaj samochodów
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="container">
        <h2 style={{ textAlign: 'center', margin: '3rem 0 2rem 0', fontSize: '2rem' }}>
          Polecane oferty
        </h2>

        {loading ? (
          <div className="loading">Ładowanie samochodów...</div>
        ) : featuredCars.length > 0 ? (
          <div className="cars-grid">
            {featuredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <p>Brak dostępnych ofert. Wkrótce dodamy nowe samochody!</p>
          </div>
        )}

        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <a href="/search" className="btn-secondary">
            Zobacz wszystkie oferty
          </a>
        </div>
      </section>
    </div>
  );
}

export default HomePage;