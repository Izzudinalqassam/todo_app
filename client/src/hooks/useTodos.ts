import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { todoApi, Todo, CreateTodoData, UpdateTodoData } from '../utils/api';

export const useTodos = () => {
  const queryClient = useQueryClient();
  
  // Get all todos
  const { 
    data: todos, 
    isLoading, 
    isError, 
    error 
  } = useQuery<Todo[], Error>({
    queryKey: ['todos'],
    queryFn: async () => {
      try {
        const data = await todoApi.getTodos();
        return data || [];
      } catch (err) {
        console.error('Error fetching todos:', err);
        return [];
      }
    },
    initialData: () => [],
  });
  
  // Ensure we always return an array, even if data is undefined
  const safeTodos = todos || [];

  // Create a new todo
  const createMutation = useMutation<Todo, Error, CreateTodoData>({
    mutationFn: (data) => todoApi.createTodo(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  // Update a todo
  const updateMutation = useMutation<Todo, Error, { id: number; data: UpdateTodoData }>({
    mutationFn: ({ id, data }) => todoApi.updateTodo(id, data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  // Delete a todo
  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: (id) => todoApi.deleteTodo(id),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  // Toggle todo completion status
  const toggleTodo = (id: number, completed: boolean) => {
    updateMutation.mutate({ id, data: { completed } });
  };

  return {
    todos: safeTodos,
    isLoading,
    isError,
    error,
    createTodo: createMutation.mutateAsync,
    updateTodo: updateMutation.mutateAsync,
    deleteTodo: deleteMutation.mutate,
    toggleTodo,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
