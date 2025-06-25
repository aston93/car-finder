import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          🚗 Car Finder
        </Link>
        <nav className="nav">
          <Link to="/">Strona główna</Link>
          <Link to="/search">Szukaj</Link>
          <Link to="/add-car">Dodaj ogłoszenie</Link>
          <Link to="/login">Zaloguj się</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;