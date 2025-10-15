import React, { useState } from 'react';
import { useAuth } from '../shared/AuthContext';
import { useLanguage } from '../shared/LanguageContext';
import './Login.css';

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError(t('fillAllFields'));
      return;
    }

    const success = await login(username, password);
    if (!success) {
      setError(t('loginError'));
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">🔐 {t('login')}</h1>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">{t('username')}</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('username')}
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t('password')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('password')}
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? t('loading') : t('loginButton')}
          </button>
        </form>
        
        <div className="login-demo">
          <p>Demo credentials:</p>
          <p><strong>admin</strong> / <strong>123456</strong></p>
          <p><strong>usuario</strong> / <strong>password</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Login;