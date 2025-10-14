const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { userModel } = require('../models/database');
const { generateToken, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validaciones para registro
const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('El nombre de usuario debe tener entre 3 y 20 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),
  
  body('email')
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número')
];

// Validaciones para login
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
];

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', registerValidation, async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'Los datos proporcionados no son válidos',
        details: errors.array()
      });
    }

    const { username, email, password, role = 'user' } = req.body;

    // Verificar si el usuario ya existe
    const existingUserByEmail = userModel.getByEmail(email);
    if (existingUserByEmail) {
      return res.status(409).json({
        error: 'Usuario existente',
        message: 'Ya existe un usuario con este email'
      });
    }

    const existingUserByUsername = userModel.getByUsername(username);
    if (existingUserByUsername) {
      return res.status(409).json({
        error: 'Usuario existente',
        message: 'Ya existe un usuario con este nombre de usuario'
      });
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear nuevo usuario
    const newUser = userModel.create({
      username,
      email,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'user' // Solo permitir admin si se especifica
    });

    // Generar token
    const token = generateToken(newUser);

    // Respuesta sin incluir la contraseña
    const { password: _, ...userResponse } = newUser;

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo registrar el usuario'
    });
  }
});

// POST /api/auth/login - Iniciar sesión
router.post('/login', loginValidation, async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'Los datos proporcionados no son válidos',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Buscar usuario por email
    const user = userModel.getByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Generar token
    const token = generateToken(user);

    // Respuesta sin incluir la contraseña
    const { password: _, ...userResponse } = user;

    res.json({
      message: 'Inicio de sesión exitoso',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo procesar el inicio de sesión'
    });
  }
});

// GET /api/auth/profile - Obtener perfil del usuario autenticado
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const user = userModel.getById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'El usuario ya no existe'
      });
    }

    const { password, ...userProfile } = user;
    
    res.json({
      message: 'Perfil obtenido exitosamente',
      user: userProfile
    });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el perfil del usuario'
    });
  }
});

// PUT /api/auth/profile - Actualizar perfil del usuario autenticado
router.put('/profile', authenticateToken, [
  body('username')
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage('El nombre de usuario debe tener entre 3 y 20 caracteres'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: errors.array()
      });
    }

    const { username, email } = req.body;
    const updates = {};

    if (username) updates.username = username;
    if (email) updates.email = email;

    const updatedUser = userModel.update(req.user.id, updates);
    const { password, ...userResponse } = updatedUser;

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: userResponse
    });

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar el perfil'
    });
  }
});

// POST /api/auth/logout - Cerrar sesión (informativo, el frontend debe eliminar el token)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    message: 'Sesión cerrada exitosamente',
    note: 'Elimine el token del almacenamiento local del cliente'
  });
});

module.exports = router;