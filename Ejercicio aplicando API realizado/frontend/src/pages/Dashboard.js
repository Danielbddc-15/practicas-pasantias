import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tasksAPI, handleAPIError } from '../services/api';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    completed: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    per_page: 10
  });

  const { user, logout } = useAuth();

  // Cargar tareas
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.completed !== '') params.completed = filters.completed;
      params.page = filters.page;
      params.limit = filters.limit;

      const response = await tasksAPI.getTasks(params);
      setTasks(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setError(handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

  // Cargar tareas al montar el componente y cuando cambien los filtros
  useEffect(() => {
    loadTasks();
  }, [filters]);

  // Crear tarea
  const handleCreateTask = async (taskData) => {
    try {
      await tasksAPI.createTask(taskData);
      setShowForm(false);
      await loadTasks(); // Recargar tareas
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  // Actualizar tarea
  const handleUpdateTask = async (taskId, taskData) => {
    try {
      await tasksAPI.updateTask(taskId, taskData);
      setEditingTask(null);
      setShowForm(false);
      await loadTasks(); // Recargar tareas
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  // Eliminar tarea
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        await tasksAPI.deleteTask(taskId);
        await loadTasks(); // Recargar tareas
      } catch (error) {
        console.error('Error deleting task:', error);
        setError(handleAPIError(error));
      }
    }
  };

  // Alternar estado de tarea
  const handleToggleTask = async (taskId) => {
    try {
      await tasksAPI.toggleTask(taskId);
      await loadTasks(); // Recargar tareas
    } catch (error) {
      console.error('Error toggling task:', error);
      setError(handleAPIError(error));
    }
  };

  // Manejar cambios de filtros
  const handleFilterChange = (newFilters) => {
    setFilters({
      ...filters,
      ...newFilters,
      page: 1 // Resetear a la primera página cuando cambian los filtros
    });
  };

  // Manejar cambio de página
  const handlePageChange = (newPage) => {
    setFilters({
      ...filters,
      page: newPage
    });
  };

  // Abrir formulario para editar
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // Cerrar formulario
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center py-3 border-bottom flex-wrap gap-2">
            <div>
              <h1 className="h3 mb-0">
                <i className="fas fa-tachometer-alt me-2 text-primary"></i>
                Dashboard
              </h1>
              <p className="text-muted mb-0">
                Bienvenido, <strong>{user?.username}</strong>
                <span className="d-md-none ms-2 badge bg-secondary">{user?.role}</span>
              </p>
            </div>
            
            {/* Versión para pantallas grandes */}
            <div className="d-none d-md-flex gap-2 align-items-center">
              <button
                className="btn btn-success"
                onClick={() => setShowForm(true)}
              >
                <i className="fas fa-plus me-2"></i>
                Nueva Tarea
              </button>
              
              {/* Información del usuario */}
              <div className="d-flex align-items-center gap-2 text-muted">
                <i className="fas fa-user"></i>
                <span>{user?.username}</span>
                <span className="badge bg-secondary">{user?.role}</span>
              </div>
              
              {/* Botón de cerrar sesión */}
              <button
                className="btn btn-outline-danger"
                onClick={logout}
                title="Cerrar Sesión"
              >
                <i className="fas fa-sign-out-alt me-2"></i>
                Salir
              </button>
            </div>
            
            {/* Versión para pantallas pequeñas */}
            <div className="d-md-none d-flex gap-1">
              <button
                className="btn btn-success btn-sm"
                onClick={() => setShowForm(true)}
                title="Nueva Tarea"
              >
                <i className="fas fa-plus"></i>
              </button>
              
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={logout}
                title="Cerrar Sesión"
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="card-title">Total de Tareas</h5>
                  <h2 className="mb-0">{pagination.total_items}</h2>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-tasks fa-2x opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="card-title">Completadas</h5>
                  <h2 className="mb-0">{completedTasks.length}</h2>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-check-circle fa-2x opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="card-title">Pendientes</h5>
                  <h2 className="mb-0">{pendingTasks.length}</h2>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-clock fa-2x opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y Lista de Tareas */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-list me-2"></i>
                Mis Tareas
              </h5>
            </div>
            <div className="card-body">
              {/* Controles de filtros */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar tareas..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange({ search: e.target.value })}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={filters.completed}
                    onChange={(e) => handleFilterChange({ completed: e.target.value })}
                  >
                    <option value="">Todas las tareas</option>
                    <option value="false">Pendientes</option>
                    <option value="true">Completadas</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={filters.limit}
                    onChange={(e) => handleFilterChange({ limit: parseInt(e.target.value) })}
                  >
                    <option value="5">5 por página</option>
                    <option value="10">10 por página</option>
                    <option value="20">20 por página</option>
                    <option value="50">50 por página</option>
                  </select>
                </div>
              </div>

              {/* Mostrar errores */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              {/* Lista de tareas */}
              <TaskList
                tasks={tasks}
                loading={loading}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onToggle={handleToggleTask}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal del formulario */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Dashboard;