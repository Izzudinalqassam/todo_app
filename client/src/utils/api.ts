import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoData {
  title: string;
  due_date?: string;
}

export interface UpdateTodoData {
  title?: string;
  completed?: boolean;
  due_date?: string;
}

export const todoApi = {
  // Get all todos
  getTodos: () => api.get<Todo[]>('/todos').then(res => res.data),
  
  // Create a new todo
  createTodo: (data: CreateTodoData) => 
    api.post<Todo>('/todos', data).then(res => res.data),
  
  // Update a todo
  updateTodo: (id: number, data: UpdateTodoData) =>
    api.put<Todo>(`/todos/${id}`, data).then(res => res.data),
  
  // Delete a todo
  deleteTodo: (id: number) => 
    api.delete(`/todos/${id}`).then(res => res.data),
};
