

import { useState, useEffect, useRef } from 'react';
import { Box, Checkbox, TextField, IconButton } from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';

interface TaskItem {
  id: number;
  text: string;
  completed: boolean;
}

interface TaskItemProps {
  description: string;
  setText: (value: string) => void;
}

export function TaskListPage({ description, setText }: TaskItemProps) {
 
  const [localTasks, setLocalTasks] = useState<TaskItem[]>([]);
  const [input, setInput] = useState<string>('');

  
  const isUpdatingFromProp = useRef(false);
  const isInitialMount = useRef(true);


  useEffect(() => {
    if (description) {
      try {
        const parsed = JSON.parse(description);
        if (Array.isArray(parsed) && JSON.stringify(parsed) !== JSON.stringify(localTasks)) {
          isUpdatingFromProp.current = true;
          setLocalTasks(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }
    isInitialMount.current = false;
  }, [description]);

  
  useEffect(() => {
    if (isUpdatingFromProp.current) {
      isUpdatingFromProp.current = false;
      return; 
    }
    
    if (!isInitialMount.current) {
      setText(JSON.stringify(localTasks));
    }
  }, [localTasks, setText]);

  // Toggle Checkbox
  const handleToggle = (id: number): void => {
    setLocalTasks(prev => prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Delete Task
  const handleDelete = (id: number): void => {
    setLocalTasks(prev => prev.filter((t) => t.id !== id));
  };

  
  const handleTextChange = (id: number, newText: string): void => {
    setLocalTasks(prev => prev.map((t) => t.id === id ? { ...t, text: newText } : t));
  };


  const addTask = (): void => {
    if (!input.trim()) return; 
    setLocalTasks(prev => [...prev, { id: Date.now(), text: input, completed: false }]);
    setInput(''); 
  };

  return (
    <Box 
      sx={{ 
        border: '1px solid #e0e0e0', 
        borderRadius: '8px', 
        p: 3, 
        width: "100%", 
        maxWidth: 600,
        bgcolor: 'background.default',
        boxShadow: '0px 1px 3px rgba(0,0,0,0.05)'
      }}
    >
  
      {localTasks.map((task) => (
        <Box 
          key={task.id} 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mr: 2 }}>
            <Checkbox 
              checked={task.completed} 
              onChange={() => handleToggle(task.id)}
              sx={{ p: 0, mr: 2 }}
            />
            <TextField
              variant="standard"
              value={task.text}
              fullWidth
              slotProps={{
                input: {
                  disableUnderline: true,
                  style: {
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? '#403d39' : '#212121',
                    fontSize: '14px'
                  }
                }
              }}
              onChange={(e) => handleTextChange(task.id, e.target.value)}
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" onClick={() => handleDelete(task.id)}>
              <DeleteOutlined sx={{ color: 'text.primary', fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>
      ))}

      {/* Add New Task Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mr: 2 }}>
          <Checkbox disabled sx={{ p: 0, mr: 2, opacity: 0.3 }} />
          <TextField
            variant="standard"
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add new text here..."
            slotProps={{
              input: {
                disableUnderline: true
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addTask(); 
            }}
          />
        </Box>
        <IconButton size="small" onClick={addTask}>
          <CheckIcon sx={{ color: 'text.primary', fontSize: 20 }} />
        </IconButton>
      </Box>
    </Box>
  );
}