import React, { useEffect, useState } from 'react';
import { Checkbox, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { Todo } from '../../utils/api';

interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  onEdit: (todo: Todo) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggleComplete,
  onDelete,
  onEdit,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  
  // This effect runs only on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Don't render anything on the server
  if (!isMounted) {
    return null;
  }
  
  // Handle null/undefined todos
  if (!todos || todos.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
        No todos yet. Add one to get started!
      </Typography>
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {todos.map((todo) => {
        const labelId = `checkbox-list-label-${todo.id}`;
        const dueDate = new Date(todo.due_date);
        const isOverdue = !todo.completed && dueDate < new Date();

        return (
          <ListItem
            key={todo.id}
            secondaryAction={
              <>
                <IconButton 
                  edge="end" 
                  aria-label="edit" 
                  onClick={() => onEdit(todo)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  edge="end" 
                  aria-label="delete" 
                  onClick={() => onDelete(todo.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            }
            disablePadding
            divider
          >
            <ListItemButton 
              role={undefined} 
              onClick={() => onToggleComplete(todo.id, !todo.completed)}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={todo.completed}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText 
                id={labelId}
                primary={
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed ? 'text.disabled' : 'text.primary',
                    }}
                  >
                    {todo.title}
                  </Typography>
                }
                secondary={
                  <Typography 
                    variant="caption" 
                    color={isOverdue ? 'error' : 'text.secondary'}
                    sx={{
                      textDecoration: todo.completed ? 'line-through' : 'none',
                    }}
                  >
                    Due: {format(new Date(todo.due_date), 'MMM d, yyyy h:mm a')}
                    {isOverdue && ' (Overdue)'}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};
