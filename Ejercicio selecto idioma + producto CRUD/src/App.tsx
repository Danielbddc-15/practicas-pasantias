import React from 'react';
import { AuthProvider, useAuth } from './shared/AuthContext';
import { LanguageProvider, useLanguage } from './shared/LanguageContext';
import Login from './tarea2-login/Login';
import LanguageSelector from './tarea1-selector-idioma/LanguageSelector';
import ProductList from './tarea1-selector-idioma/ProductList';
import './App.css';

const MainApp: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner">⏳</div>
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="main-app">
      <header className="app-header">
        <div className="header-content">
          <h1>🏪 Sistema de Productos Integrado</h1>
          <div className="header-controls">
            <LanguageSelector />
            <div className="user-info">
              <span>👤 {t('welcomeBack')}, {user.username}!</span>
              <button onClick={logout} className="logout-btn">
                🚪 {t('logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <ProductList />
      </main>

      <footer className="app-footer">
        <p>
          <strong>Sistema Integrado:</strong> Selector de idioma + Lista y gestión completa de productos con CRUD unificado | 
          Login con autenticación | Persistencia por usuario con fotos obligatorias
        </p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <MainApp />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
