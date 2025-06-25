import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import CarDetailPage from './pages/CarDetailPage';
import LoginPage from './pages/LoginPage';
import AddCarPage from './pages/AddCarPage';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/car/:id" element={<CarDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/add-car" element={<AddCarPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;