import React, { useState } from 'react';

function AddCarPage() {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    fuel_type: '',
    transmission: '',
    engine_size: '',
    power: '',
    color: '',
    doors: '',
    location: '',
    description: '',
    seller_name: '',
    seller_phone: '',
    seller_email: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // TODO: Implement API call to create car listing
      console.log('Dodawanie samochodu:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('Ogłoszenie zostało dodane pomyślnie!');
      
      // Clear form
      setFormData({
        make: '',
        model: '',
        year: '',
        price: '',
        mileage: '',
        fuel_type: '',
        transmission: '',
        engine_size: '',
        power: '',
        color: '',
        doors: '',
        location: '',
        description: '',
        seller_name: '',
        seller_phone: '',
        seller_email: ''
      });
      
    } catch (error) {
      setMessage('Wystąpił błąd podczas dodawania ogłoszenia. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ margin: '2rem 0' }}>
        <h1>Dodaj ogłoszenie samochodowe</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Wypełnij formularz, aby dodać swoje ogłoszenie sprzedaży samochodu.
        </p>

        {message && (
          <div className={message.includes('błąd') ? 'error' : 'success'}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ 
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {/* Basic Car Information */}
          <h3 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>Podstawowe informacje</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="make">Marka *</label>
              <select
                id="make"
                name="make"
                required
                value={formData.make}
                onChange={handleInputChange}
              >
                <option value="">Wybierz markę</option>
                <option value="Audi">Audi</option>
                <option value="BMW">BMW</option>
                <option value="Ford">Ford</option>
                <option value="Honda">Honda</option>
                <option value="Mercedes">Mercedes</option>
                <option value="Toyota">Toyota</option>
                <option value="Volkswagen">Volkswagen</option>
                <option value="Volvo">Volvo</option>
                <option value="Inna">Inna</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="model">Model *</label>
              <input
                type="text"
                id="model"
                name="model"
                required
                value={formData.model}
                onChange={handleInputChange}
                placeholder="np. Golf, Passat, Corolla"
              />
            </div>

            <div className="form-group">
              <label htmlFor="year">Rok produkcji *</label>
              <input
                type="number"
                id="year"
                name="year"
                required
                min="1990"
                max="2025"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="2020"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Cena (PLN) *</label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="50000"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mileage">Przebieg (km) *</label>
              <input
                type="number"
                id="mileage"
                name="mileage"
                required
                min="0"
                value={formData.mileage}
                onChange={handleInputChange}
                placeholder="100000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fuel_type">Rodzaj paliwa *</label>
              <select
                id="fuel_type"
                name="fuel_type"
                required
                value={formData.fuel_type}
                onChange={handleInputChange}
              >
                <option value="">Wybierz paliwo</option>
                <option value="Benzyna">Benzyna</option>
                <option value="Diesel">Diesel</option>
                <option value="Elektryczny">Elektryczny</option>
                <option value="Hybryda">Hybryda</option>
                <option value="LPG">LPG</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="transmission">Skrzynia biegów *</label>
              <select
                id="transmission"
                name="transmission"
                required
                value={formData.transmission}
                onChange={handleInputChange}
              >
                <option value="">Wybierz skrzynię</option>
                <option value="Manualna">Manualna</option>
                <option value="Automatyczna">Automatyczna</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location">Lokalizacja *</label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Warszawa, Kraków, itp."
              />
            </div>
          </div>

          {/* Additional Details */}
          <h3 style={{ margin: '2rem 0 1.5rem 0', color: '#2c3e50' }}>Dodatkowe szczegóły</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="engine_size">Pojemność silnika (L)</label>
              <input
                type="number"
                id="engine_size"
                name="engine_size"
                step="0.1"
                min="0"
                max="10"
                value={formData.engine_size}
                onChange={handleInputChange}
                placeholder="2.0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="power">Moc (KM)</label>
              <input
                type="number"
                id="power"
                name="power"
                min="0"
                value={formData.power}
                onChange={handleInputChange}
                placeholder="150"
              />
            </div>

            <div className="form-group">
              <label htmlFor="color">Kolor</label>
              <input
                type="text"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                placeholder="Czarny, Biały, Czerwony"
              />
            </div>

            <div className="form-group">
              <label htmlFor="doors">Liczba drzwi</label>
              <select
                id="doors"
                name="doors"
                value={formData.doors}
                onChange={handleInputChange}
              >
                <option value="">Wybierz</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-group" style={{ margin: '1.5rem 0' }}>
            <label htmlFor="description">Opis samochodu</label>
            <textarea
              id="description"
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Opisz stan techniczny, wyposażenie, historię samochodu..."
              style={{ 
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Seller Information */}
          <h3 style={{ margin: '2rem 0 1.5rem 0', color: '#2c3e50' }}>Dane kontaktowe</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="seller_name">Imię i nazwisko *</label>
              <input
                type="text"
                id="seller_name"
                name="seller_name"
                required
                value={formData.seller_name}
                onChange={handleInputChange}
                placeholder="Jan Kowalski"
              />
            </div>

            <div className="form-group">
              <label htmlFor="seller_phone">Telefon *</label>
              <input
                type="tel"
                id="seller_phone"
                name="seller_phone"
                required
                value={formData.seller_phone}
                onChange={handleInputChange}
                placeholder="+48 123 456 789"
              />
            </div>

            <div className="form-group">
              <label htmlFor="seller_email">Email *</label>
              <input
                type="email"
                id="seller_email"
                name="seller_email"
                required
                value={formData.seller_email}
                onChange={handleInputChange}
                placeholder="jan@example.com"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
              style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
            >
              {loading ? 'Dodawanie...' : '🚗 Dodaj ogłoszenie'}
            </button>
          </div>

          <p style={{ 
            textAlign: 'center', 
            marginTop: '1rem', 
            fontSize: '0.9rem', 
            color: '#666' 
          }}>
            * - pola wymagane
          </p>
        </form>
      </div>
    </div>
  );
}

export default AddCarPage;