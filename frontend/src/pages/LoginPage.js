import React, { useState } from 'react';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
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
      // TODO: Implement authentication API calls
      console.log(isLogin ? 'Logowanie:' : 'Rejestracja:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage(isLogin ? 'Zalogowano pomyślnie!' : 'Konto zostało utworzone!');
      
      // Clear form
      setFormData({ email: '', password: '', name: '' });
      
    } catch (error) {
      setMessage('Wystąpił błąd. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Logowanie przez Google');
    setMessage('Logowanie przez Google - funkcja w trakcie implementacji');
  };

  return (
    <div className="container">
      <div style={{ 
        maxWidth: '400px', 
        margin: '2rem auto',
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {isLogin ? 'Zaloguj się' : 'Utwórz konto'}
        </h1>

        {message && (
          <div className={message.includes('błąd') ? 'error' : 'success'}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label htmlFor="name">Imię i nazwisko</label>
              <input
                type="text"
                id="name"
                name="name"
                required={!isLogin}
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Jan Kowalski"
              />
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="jan@example.com"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password">Hasło</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              minLength="6"
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            {loading ? 'Przetwarzanie...' : (isLogin ? 'Zaloguj się' : 'Utwórz konto')}
          </button>
        </form>

        <div style={{ textAlign: 'center', margin: '1rem 0' }}>
          <span style={{ color: '#666' }}>lub</span>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="btn-secondary"
          style={{ width: '100%', marginBottom: '1rem' }}
        >
          🔍 Zaloguj się przez Google
        </button>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#007bff',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            {isLogin ? 'Nie masz konta? Zarejestruj się' : 'Masz już konto? Zaloguj się'}
          </button>
        </div>

        {isLogin && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button
              type="button"
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#007bff',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Zapomniałeś hasła?
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;