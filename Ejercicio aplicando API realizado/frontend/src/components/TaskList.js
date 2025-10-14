import React from 'react';

const TaskList = ({ tasks, loading, onEdit, onDelete, onToggle, pagination, onPageChange }) => {
  
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2 text-muted">Cargando tareas...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-tasks fa-3x text-muted mb-3"></i>
        <h5 className="text-muted">No tienes tareas</h5>
        <p className="text-muted">Crea tu primera tarea para comenzar</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderPagination = () => {
    if (pagination.total_pages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.current_page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.total_pages, startPage + maxVisiblePages - 1);

    // Ajustar startPage si estamos cerca del final
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Botón anterior
    pages.push(
      <li key="prev" className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
        <button
          className="page-link"
          onClick={() => onPageChange(pagination.current_page - 1)}
          disabled={pagination.current_page === 1}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
      </li>
    );

    // Primera página si no está visible
    if (startPage > 1) {
      pages.push(
        <li key={1} className="page-item">
          <button className="page-link" onClick={() => onPageChange(1)}>1</button>
        </li>
      );
      if (startPage > 2) {
        pages.push(
          <li key="ellipsis1" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
    }

    // Páginas visibles
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i} className={`page-item ${i === pagination.current_page ? 'active' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(i)}>
            {i}
          </button>
        </li>
      );
    }

    // Última página si no está visible
    if (endPage < pagination.total_pages) {
      if (endPage < pagination.total_pages - 1) {
        pages.push(
          <li key="ellipsis2" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
      pages.push(
        <li key={pagination.total_pages} className="page-item">
          <button className="page-link" onClick={() => onPageChange(pagination.total_pages)}>
            {pagination.total_pages}
          </button>
        </li>
      );
    }

    // Botón siguiente
    pages.push(
      <li key="next" className={`page-item ${pagination.current_page === pagination.total_pages ? 'disabled' : ''}`}>
        <button
          className="page-link"
          onClick={() => onPageChange(pagination.current_page + 1)}
          disabled={pagination.current_page === pagination.total_pages}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </li>
    );

    return (
      <nav>
        <ul className="pagination justify-content-center mb-0">
          {pages}
        </ul>
      </nav>
    );
  };

  return (
    <div>
      {/* Lista de tareas */}
      <div className="row">
        {tasks.map((task) => (
          <div key={task.id} className="col-md-6 col-lg-4 mb-3">
            <div className={`card h-100 ${task.completed ? 'border-success' : 'border-warning'}`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className={`card-title mb-0 ${task.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                    {task.title}
                  </h6>
                  <div className="d-flex gap-1">
                    <button
                      className={`btn btn-sm ${task.completed ? 'btn-outline-warning' : 'btn-outline-success'}`}
                      onClick={() => onToggle(task.id)}
                      title={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
                    >
                      <i className={`fas ${task.completed ? 'fa-undo' : 'fa-check'}`}></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onEdit(task)}
                      title="Editar tarea"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(task.id)}
                      title="Eliminar tarea"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                {task.description && (
                  <p className={`card-text small ${task.completed ? 'text-muted' : ''}`}>
                    {task.description.length > 100 
                      ? task.description.substring(0, 100) + '...' 
                      : task.description
                    }
                  </p>
                )}

                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span className={`badge ${task.completed ? 'bg-success' : 'bg-warning text-dark'}`}>
                    <i className={`fas ${task.completed ? 'fa-check-circle' : 'fa-clock'} me-1`}></i>
                    {task.completed ? 'Completada' : 'Pendiente'}
                  </span>
                  <small className="text-muted">
                    <i className="fas fa-calendar me-1"></i>
                    {formatDate(task.createdAt)}
                  </small>
                </div>

                {task.updatedAt !== task.createdAt && (
                  <small className="text-muted d-block mt-1">
                    <i className="fas fa-edit me-1"></i>
                    Actualizada: {formatDate(task.updatedAt)}
                  </small>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Información de paginación y controles */}
      {pagination.total_pages > 0 && (
        <div className="mt-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <small className="text-muted">
                Mostrando {((pagination.current_page - 1) * pagination.per_page) + 1} - {Math.min(pagination.current_page * pagination.per_page, pagination.total_items)} de {pagination.total_items} tareas
              </small>
            </div>
            <div className="col-md-6">
              {renderPagination()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;