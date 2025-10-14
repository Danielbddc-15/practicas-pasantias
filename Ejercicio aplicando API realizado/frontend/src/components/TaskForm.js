import React, { useState, useEffect } from 'react';
import { handleAPIError } from '../services/api';

const TaskForm = ({ task, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    completed: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Llenar el formulario si se está editando
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        completed: task.completed || false
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.title.trim()) {
      setError('El título es requerido');
      return;
    }

    setIsSubmitting(true);

    try {
      if (task) {
        await onSubmit(task.id, formData);
      } else {
        await onSubmit(formData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(handleAPIError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal fade show d-block" 
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={handleBackdropClick}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className={`fas ${task ? 'fa-edit' : 'fa-plus'} me-2`}></i>
              {task ? 'Editar Tarea' : 'Nueva Tarea'}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              disabled={isSubmitting}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Mostrar errores */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  <i className="fas fa-heading me-2"></i>
                  Título <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  placeholder="Título de la tarea..."
                  disabled={isSubmitting}
                />
                <div className="form-text">
                  {formData.title.length}/100 caracteres
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  <i className="fas fa-align-left me-2"></i>
                  Descripción
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={500}
                  placeholder="Descripción de la tarea (opcional)..."
                  disabled={isSubmitting}
                ></textarea>
                <div className="form-text">
                  {formData.description.length}/500 caracteres
                </div>
              </div>

              {task && (
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="completed"
                      name="completed"
                      checked={formData.completed}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    <label className="form-check-label" htmlFor="completed">
                      <i className="fas fa-check-circle me-2"></i>
                      Marcar como completada
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                <i className="fas fa-times me-2"></i>
                Cancelar
              </button>
              <button 
                type="submit" 
                className={`btn ${task ? 'btn-primary' : 'btn-success'}`}
                disabled={isSubmitting || !formData.title.trim()}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    {task ? 'Actualizando...' : 'Creando...'}
                  </>
                ) : (
                  <>
                    <i className={`fas ${task ? 'fa-save' : 'fa-plus'} me-2`}></i>
                    {task ? 'Actualizar' : 'Crear'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;