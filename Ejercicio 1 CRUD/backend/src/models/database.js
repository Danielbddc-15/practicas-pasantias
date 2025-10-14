// Simulación de base de datos en memoria
let users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'admin'
  },
  {
    id: 2,
    username: 'user',
    email: 'user@example.com', 
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'user'
  }
];

let tasks = [
  {
    id: 1,
    title: 'Tarea de ejemplo',
    description: 'Esta es una tarea de ejemplo para probar el CRUD',
    completed: false,
    userId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let nextUserId = 3;
let nextTaskId = 2;

// Funciones para usuarios
const userModel = {
  getAll: () => users,
  
  getById: (id) => users.find(user => user.id === parseInt(id)),
  
  getByEmail: (email) => users.find(user => user.email === email),
  
  getByUsername: (username) => users.find(user => user.username === username),
  
  create: (userData) => {
    const user = {
      id: nextUserId++,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.push(user);
    return user;
  },
  
  update: (id, userData) => {
    const index = users.findIndex(user => user.id === parseInt(id));
    if (index !== -1) {
      users[index] = {
        ...users[index],
        ...userData,
        updatedAt: new Date().toISOString()
      };
      return users[index];
    }
    return null;
  },
  
  delete: (id) => {
    const index = users.findIndex(user => user.id === parseInt(id));
    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
    return null;
  }
};

// Funciones para tareas
const taskModel = {
  getAll: () => tasks,
  
  getByUser: (userId) => tasks.filter(task => task.userId === parseInt(userId)),
  
  getById: (id) => tasks.find(task => task.id === parseInt(id)),
  
  create: (taskData) => {
    const task = {
      id: nextTaskId++,
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tasks.push(task);
    return task;
  },
  
  update: (id, taskData) => {
    const index = tasks.findIndex(task => task.id === parseInt(id));
    if (index !== -1) {
      tasks[index] = {
        ...tasks[index],
        ...taskData,
        updatedAt: new Date().toISOString()
      };
      return tasks[index];
    }
    return null;
  },
  
  delete: (id) => {
    const index = tasks.findIndex(task => task.id === parseInt(id));
    if (index !== -1) {
      return tasks.splice(index, 1)[0];
    }
    return null;
  }
};

module.exports = {
  userModel,
  taskModel
};