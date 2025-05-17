'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  CssBaseline, 
  ThemeProvider, 
  Typography, 
  createTheme,
  CircularProgress,
  Alert,
  Paper,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Components
import { TodoList } from '../components/TodoList/TodoList';
import { TodoForm } from '../components/TodoForm/TodoForm';
import { useTodos } from '../hooks/useTodos';

// Create a client for React Query
const queryClient = new QueryClient();

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f5f5f5',
        },
      },
    },
  },
});

// Main TodoApp component
function TodoApp() {
  const [isMounted, setIsMounted] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<null | any>(null);
  
  // This effect runs only on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const {
    todos = [],
    isLoading,
    isError,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTodos();
  
  // Don't render anything on the server
  if (!isMounted) {
    return null;
  }

  const handleCreateTodo = async (data: { title: string; dueDate: Date | null }) => {
    try {
      await createTodo({
        title: data.title,
        due_date: data.dueDate?.toISOString(),
      });
      setIsFormOpen(false);
    } catch (err) {
      console.error('Failed to create todo:', err);
    }
  };

  const handleUpdateTodo = async (id: number, data: { title?: string; dueDate?: Date | null }) => {
    try {
      await updateTodo({
        id,
        data: {
          title: data.title,
          due_date: data.dueDate?.toISOString(),
        },
      });
      setEditingTodo(null);
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodo(id);
      } catch (err) {
        console.error('Failed to delete todo:', err);
      }
    }
  };

  const handleEditTodo = (todo: any) => {
    setEditingTodo({
      ...todo,
      dueDate: todo.due_date ? new Date(todo.due_date) : null,
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Todo App
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              My Todos
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setIsFormOpen(true)}
            >
              Add Todo
            </Button>
          </Box>


          {isError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error?.message || 'Failed to load todos'}
            </Alert>
          )}

          <Paper elevation={3} sx={{ p: 3 }}>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TodoList
                todos={todos}
                onToggleComplete={(id, completed) => toggleTodo(id, completed)}
                onDelete={handleDeleteTodo}
                onEdit={handleEditTodo}
              />
            )}
          </Paper>


          <TodoForm
            open={isFormOpen || !!editingTodo}
            onClose={() => {
              setIsFormOpen(false);
              setEditingTodo(null);
            }}
            onSubmit={async (data) => {
              if (editingTodo) {
                await handleUpdateTodo(editingTodo.id, data);
              } else {
                await handleCreateTodo(data);
              }
            }}
            initialValues={editingTodo || { title: '', dueDate: null }}
            isSubmitting={isCreating || isUpdating}
          />
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

// Wrapper component to provide React Query context
export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoApp />
    </QueryClientProvider>
  );
}
