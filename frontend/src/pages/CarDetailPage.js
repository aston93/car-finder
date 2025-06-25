import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCarById } from '../services/api';

function CarDetailPage() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCarDetails();
  }, [id]);

  const loadCarDetails = async () => {
    try {
      const data = await getCarById(id);
      setCar(data);
    } catch (error) {
      console.error('Błąd ładowania szczegółów:', error);
      setError('Nie udało się załadować szczegółów samochodu');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return <div className="container loading">Ładowanie szczegółów samochodu...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container">
        <div className="error">Nie znaleziono samochodu</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ margin: '2rem 0' }}>
        <button 
          onClick={() => window.history.back()} 
          className="btn-secondary"
          style={{ marginBottom: '2rem' }}
        >
          ← Powrót
        </button>

        <div style={{ 
          background: 'white', 
          borderRadius: '8px', 
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {/* Car Header */}
          <div style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#2c3e50' }}>
              {car.year} {car.make} {car.model}
            </h1>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c' }}>
              {formatPrice(car.price)}
            </div>
          </div>

          {/* Car Image */}
          <div style={{ 
            width: '100%', 
            height: '400px', 
            backgroundColor: '#f0f0f0',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem',
            color: '#666'
          }}>
            {car.image_url ? (
              <img 
                src={car.image_url} 
                alt={`${car.make} ${car.model}`}
                style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px' }}
              />
            ) : (
              <span style={{ fontSize: '1.2rem' }}>
                Zdjęcie {car.make} {car.model}
              </span>
            )}
          </div>

          {/* Car Details Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div>
              <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Podstawowe informacje</h3>
              <div style={{ lineHeight: '2' }}>
                <p><strong>Marka:</strong> {car.make}</p>
                <p><strong>Model:</strong> {car.model}</p>
                <p><strong>Rok produkcji:</strong> {car.year}</p>
                <p><strong>Przebieg:</strong> {car.mileage?.toLocaleString('pl-PL')} km</p>
              </div>
            </div>

            <div>
              <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Silnik i napęd</h3>
              <div style={{ lineHeight: '2' }}>
                <p><strong>Paliwo:</strong> {car.fuel_type}</p>
                <p><strong>Skrzynia biegów:</strong> {car.transmission}</p>
                {car.engine_size && <p><strong>Pojemność silnika:</strong> {car.engine_size}L</p>}
                {car.power && <p><strong>Moc:</strong> {car.power} KM</p>}
              </div>
            </div>

            <div>
              <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Inne informacje</h3>
              <div style={{ lineHeight: '2' }}>
                {car.color && <p><strong>Kolor:</strong> {car.color}</p>}
                {car.doors && <p><strong>Liczba drzwi:</strong> {car.doors}</p>}
                {car.location && <p><strong>Lokalizacja:</strong> {car.location}</p>}
                {car.created_at && (
                  <p><strong>Data dodania:</strong> {new Date(car.created_at).toLocaleDateString('pl-PL')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {car.description && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Opis</h3>
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '1.5rem', 
                borderRadius: '8px',
                lineHeight: '1.6'
              }}>
                {car.description}
              </div>
            </div>
          )}

          {/* Contact Section */}
          <div style={{ 
            backgroundColor: '#e8f4f8', 
            padding: '2rem', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Kontakt ze sprzedawcą</h3>
            {car.seller_name && <p><strong>Sprzedawca:</strong> {car.seller_name}</p>}
            {car.seller_phone && <p><strong>Telefon:</strong> {car.seller_phone}</p>}
            {car.seller_email && <p><strong>Email:</strong> {car.seller_email}</p>}
            
            <div style={{ marginTop: '1.5rem' }}>
              {car.seller_phone && (
                <a 
                  href={`tel:${car.seller_phone}`}
                  className="btn-primary"
                  style={{ marginRight: '1rem', textDecoration: 'none' }}
                >
                  📞 Zadzwoń
                </a>
              )}
              {car.seller_email && (
                <a 
                  href={`mailto:${car.seller_email}?subject=Pytanie o ${car.make} ${car.model}`}
                  className="btn-secondary"
                  style={{ textDecoration: 'none' }}
                >
                  ✉️ Napisz email
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarDetailPage;