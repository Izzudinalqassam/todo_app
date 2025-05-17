import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField,
  Typography 
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface TodoFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; dueDate: Date | null }) => void;
  initialValues?: { title: string; dueDate: Date | null };
  isSubmitting?: boolean;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues = { title: '', dueDate: null },
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState(initialValues.title);
  const [dueDate, setDueDate] = useState<Date | null>(initialValues.dueDate);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    setError('');
    onSubmit({ title: title.trim(), dueDate });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add New Todo</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Title"
              type="text"
              fullWidth
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!error}
              helperText={error}
            />
          </Box>
          <Box sx={{ mt: 3, mb: 1 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Due Date (optional)"
                value={dueDate}
                onChange={(newValue) => setDueDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Leave empty to set due date to tomorrow
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
