import React from 'react';
import { useNavigate } from 'react-router-dom';

function CarCard({ car }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/car/${car.id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="car-card" onClick={handleClick}>
      <div className="car-image">
        {car.image_url ? (
          <img src={car.image_url} alt={`${car.make} ${car.model}`} />
        ) : (
          <span>Zdjęcie {car.make} {car.model}</span>
        )}
      </div>
      <div className="car-info">
        <h3 className="car-title">{car.year} {car.make} {car.model}</h3>
        <div className="car-price">{formatPrice(car.price)}</div>
        <div className="car-details">
          <p><strong>Przebieg:</strong> {car.mileage?.toLocaleString('pl-PL')} km</p>
          <p><strong>Paliwo:</strong> {car.fuel_type}</p>
          <p><strong>Skrzynia:</strong> {car.transmission}</p>
          {car.location && <p><strong>Lokalizacja:</strong> {car.location}</p>}
        </div>
      </div>
    </div>
  );
}

export default CarCard;