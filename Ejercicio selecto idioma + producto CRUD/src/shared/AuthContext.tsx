import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos para el usuario
export interface User {
  id: string;
  username: string;
  email: string;
  token: string;
}

// Interfaz para el contexto de autenticación
interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay un usuario logueado al cargar la aplicación
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Función de login (simula una llamada al servidor)
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simular llamada al servidor
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validación simple (en un proyecto real esto sería una API)
    if (username === 'admin' && password === '123456') {
      const userData: User = {
        id: '1',
        username: username,
        email: `${username}@example.com`,
        token: `token-${Date.now()}`
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    } else if (username === 'usuario' && password === 'password') {
      const userData: User = {
        id: '2',
        username: username,
        email: `${username}@example.com`,
        token: `token-${Date.now()}`
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  // Función de logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem(`products_${user?.id}`);
    localStorage.removeItem(`photos_${user?.id}`);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};