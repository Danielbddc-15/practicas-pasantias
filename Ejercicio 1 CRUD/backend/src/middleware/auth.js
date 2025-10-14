const jwt = require('jsonwebtoken');
const { userModel } = require('../models/database');

// Clave secreta para JWT (en producción debe estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'mi-clave-secreta-super-segura-2024';

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Token de acceso requerido',
      message: 'Debe proporcionar un token de autorización válido'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        error: 'Token inválido',
        message: 'El token proporcionado no es válido o ha expirado'
      });
    }

    // Verificar si el usuario existe
    const user = userModel.getById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'El usuario asociado al token no existe'
      });
    }

    // Agregar información del usuario al request
    req.user = {
      id: decoded.userId,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  });
};

// Middleware para verificar roles específicos
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Acceso no autorizado',
        message: 'Debe estar autenticado para acceder a este recurso'
      });
    }

    if (req.user.role !== requiredRole && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Permisos insuficientes',
        message: `Se requiere rol de ${requiredRole} para acceder a este recurso`
      });
    }

    next();
  };
};

// Middleware para verificar si el usuario es admin
const requireAdmin = requireRole('admin');

// Middleware para verificar si el usuario puede acceder al recurso (propietario o admin)
const requireOwnershipOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Acceso no autorizado',
      message: 'Debe estar autenticado para acceder a este recurso'
    });
  }

  const resourceUserId = req.params.userId || req.body.userId || req.query.userId;
  
  if (req.user.role === 'admin' || req.user.id === parseInt(resourceUserId)) {
    next();
  } else {
    return res.status(403).json({
      error: 'Permisos insuficientes',
      message: 'Solo puede acceder a sus propios recursos'
    });
  }
};

// Función para generar token
const generateToken = (user) => {
  const payload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h' // Token expira en 24 horas
  });
};

// Función para verificar token (sin middleware)
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireOwnershipOrAdmin,
  generateToken,
  verifyToken,
  JWT_SECRET
};