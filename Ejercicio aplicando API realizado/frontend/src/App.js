import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Ruta por defecto - redirige al dashboard si está autenticado, sino al login */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rutas protegidas */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Ruta para páginas no encontradas */}
            <Route 
              path="*" 
              element={
                <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
                  <div className="text-center">
                    <div className="card">
                      <div className="card-body p-5">
                        <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                        <h4 className="card-title">Página No Encontrada</h4>
                        <p className="card-text text-muted">
                          La página que buscas no existe.
                        </p>
                        <a href="/dashboard" className="btn btn-primary">
                          <i className="fas fa-home me-2"></i>
                          Ir al Dashboard
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
