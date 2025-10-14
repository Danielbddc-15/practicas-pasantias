const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { taskModel } = require('../models/database');
const { authenticateToken, requireOwnershipOrAdmin, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Validaciones para tareas
const taskValidation = [
  body('title')
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ min: 3, max: 100 })
    .withMessage('El título debe tener entre 3 y 100 caracteres'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres'),
  
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('El estado completado debe ser verdadero o falso')
];

const idValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo')
];

// GET /api/tasks - Obtener todas las tareas del usuario autenticado
router.get('/', authenticateToken, (req, res) => {
  try {
    const { page = 1, limit = 10, completed, search } = req.query;
    
    let userTasks = taskModel.getByUser(req.user.id);

    // Filtrar por estado completado si se especifica
    if (completed !== undefined) {
      const isCompleted = completed === 'true';
      userTasks = userTasks.filter(task => task.completed === isCompleted);
    }

    // Filtrar por búsqueda en título o descripción
    if (search) {
      const searchLower = search.toLowerCase();
      userTasks = userTasks.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower))
      );
    }

    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTasks = userTasks.slice(startIndex, endIndex);

    res.json({
      message: 'Tareas obtenidas exitosamente',
      data: paginatedTasks,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total_items: userTasks.length,
        total_pages: Math.ceil(userTasks.length / limit)
      },
      filters: {
        completed: completed !== undefined ? completed === 'true' : null,
        search: search || null
      }
    });

  } catch (error) {
    console.error('Error obteniendo tareas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las tareas'
    });
  }
});

// GET /api/tasks/all - Obtener todas las tareas (solo admin)
router.get('/all', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { page = 1, limit = 10, userId, completed } = req.query;
    
    let allTasks = taskModel.getAll();

    // Filtrar por usuario específico si se especifica
    if (userId) {
      allTasks = allTasks.filter(task => task.userId === parseInt(userId));
    }

    // Filtrar por estado completado si se especifica
    if (completed !== undefined) {
      const isCompleted = completed === 'true';
      allTasks = allTasks.filter(task => task.completed === isCompleted);
    }

    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTasks = allTasks.slice(startIndex, endIndex);

    res.json({
      message: 'Todas las tareas obtenidas exitosamente',
      data: paginatedTasks,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total_items: allTasks.length,
        total_pages: Math.ceil(allTasks.length / limit)
      }
    });

  } catch (error) {
    console.error('Error obteniendo todas las tareas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las tareas'
    });
  }
});

// GET /api/tasks/:id - Obtener una tarea específica
router.get('/:id', authenticateToken, idValidation, (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'ID inválido',
        details: errors.array()
      });
    }

    const task = taskModel.getById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        error: 'Tarea no encontrada',
        message: 'La tarea especificada no existe'
      });
    }

    // Verificar que el usuario puede acceder a esta tarea
    if (req.user.role !== 'admin' && task.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Permisos insuficientes',
        message: 'No tiene permisos para acceder a esta tarea'
      });
    }

    res.json({
      message: 'Tarea obtenida exitosamente',
      data: task
    });

  } catch (error) {
    console.error('Error obteniendo tarea:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo obtener la tarea'
    });
  }
});

// POST /api/tasks - Crear nueva tarea
router.post('/', authenticateToken, taskValidation, (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'Los datos proporcionados no son válidos',
        details: errors.array()
      });
    }

    const { title, description, completed = false } = req.body;

    const newTask = taskModel.create({
      title,
      description,
      completed,
      userId: req.user.id
    });

    res.status(201).json({
      message: 'Tarea creada exitosamente',
      data: newTask
    });

  } catch (error) {
    console.error('Error creando tarea:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo crear la tarea'
    });
  }
});

// PUT /api/tasks/:id - Actualizar tarea completa
router.put('/:id', authenticateToken, [...idValidation, ...taskValidation], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: errors.array()
      });
    }

    const task = taskModel.getById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        error: 'Tarea no encontrada',
        message: 'La tarea especificada no existe'
      });
    }

    // Verificar permisos
    if (req.user.role !== 'admin' && task.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Permisos insuficientes',
        message: 'No tiene permisos para modificar esta tarea'
      });
    }

    const { title, description, completed } = req.body;
    
    const updatedTask = taskModel.update(req.params.id, {
      title,
      description,
      completed
    });

    res.json({
      message: 'Tarea actualizada exitosamente',
      data: updatedTask
    });

  } catch (error) {
    console.error('Error actualizando tarea:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar la tarea'
    });
  }
});

// PATCH /api/tasks/:id - Actualización parcial de tarea
router.patch('/:id', authenticateToken, idValidation, [
  body('title')
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage('El título debe tener entre 3 y 100 caracteres'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres'),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('El estado completado debe ser verdadero o falso')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: errors.array()
      });
    }

    const task = taskModel.getById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        error: 'Tarea no encontrada',
        message: 'La tarea especificada no existe'
      });
    }

    // Verificar permisos
    if (req.user.role !== 'admin' && task.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Permisos insuficientes',
        message: 'No tiene permisos para modificar esta tarea'
      });
    }

    // Solo actualizar campos proporcionados
    const updates = {};
    const { title, description, completed } = req.body;
    
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (completed !== undefined) updates.completed = completed;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: 'Sin actualizaciones',
        message: 'Debe proporcionar al menos un campo para actualizar'
      });
    }

    const updatedTask = taskModel.update(req.params.id, updates);

    res.json({
      message: 'Tarea actualizada parcialmente',
      data: updatedTask
    });

  } catch (error) {
    console.error('Error actualizando tarea parcialmente:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar la tarea'
    });
  }
});

// DELETE /api/tasks/:id - Eliminar tarea
router.delete('/:id', authenticateToken, idValidation, (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'ID inválido',
        details: errors.array()
      });
    }

    const task = taskModel.getById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        error: 'Tarea no encontrada',
        message: 'La tarea especificada no existe'
      });
    }

    // Verificar permisos
    if (req.user.role !== 'admin' && task.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Permisos insuficientes',
        message: 'No tiene permisos para eliminar esta tarea'
      });
    }

    const deletedTask = taskModel.delete(req.params.id);

    res.json({
      message: 'Tarea eliminada exitosamente',
      data: deletedTask
    });

  } catch (error) {
    console.error('Error eliminando tarea:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo eliminar la tarea'
    });
  }
});

// POST /api/tasks/:id/toggle - Alternar estado completado de la tarea
router.post('/:id/toggle', authenticateToken, idValidation, (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'ID inválido',
        details: errors.array()
      });
    }

    const task = taskModel.getById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        error: 'Tarea no encontrada',
        message: 'La tarea especificada no existe'
      });
    }

    // Verificar permisos
    if (req.user.role !== 'admin' && task.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Permisos insuficientes',
        message: 'No tiene permisos para modificar esta tarea'
      });
    }

    const updatedTask = taskModel.update(req.params.id, {
      completed: !task.completed
    });

    res.json({
      message: `Tarea marcada como ${updatedTask.completed ? 'completada' : 'pendiente'}`,
      data: updatedTask
    });

  } catch (error) {
    console.error('Error alternando estado de tarea:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar el estado de la tarea'
    });
  }
});

module.exports = router;