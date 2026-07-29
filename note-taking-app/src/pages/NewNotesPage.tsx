
import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Divider,
  Stack,
  FormHelperText,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetTaskQuery, useGetTasksQuery } from '../services/taskApi';
import { useCreateNoteMutation, useGetNotesQuery } from '../services/noteApi';

// Status & Priority Options (same as tasks)
const STATUS_OPTIONS = ['Todo', 'In Progress', 'Complete', 'Not Started'] as const;
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'] as const;
const DEFAULT_CATEGORIES = ['Family & Friends', 'Fitness & Health', 'Study', 'My Note', 'Company Note', 'General'];

type StatusType = typeof STATUS_OPTIONS[number];
type PriorityType = typeof PRIORITY_OPTIONS[number];

export const NewNotePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const taskContext = location.state as {
    taskId?: string;
    taskTitle?: string;
    assignee?: string;
  } | null;
  const taskLocked = Boolean(taskContext?.taskId);

  // ---- Fetch existing tasks (to link note to a task) ----
  const {
    data: tasks,
    isError: tasksError,
  } = useGetTasksQuery({}); 
  const { data: existingNotes = [] } = useGetNotesQuery();

  // Create Note Mutation 
  const [createNote, { isLoading: isCreating, error: createError }] =
    useCreateNoteMutation();

  //  Form State (includes taskId for linking) 
  const [form, setForm] = useState<{
    title: string;
    description: string;
    category: string;
    status: StatusType;
    priority: PriorityType;
    assignee: string;
    startDate: string;
    endDate: string;
    taskId: string; 
  }>({
    title: '',
    description: '',
    category: '',
    status: 'Todo',
    priority: 'Medium',
    assignee: '',
    startDate: '',
    endDate: '',
    taskId: taskContext?.taskId || '',
  });

  useEffect(() => {
    if (!taskContext?.taskId) return;
    setForm((previous) => ({
      ...previous,
      taskId: taskContext.taskId || previous.taskId,
      assignee: taskContext.assignee || previous.assignee,
    }));
  }, [taskContext?.taskId, taskContext?.taskTitle, taskContext?.assignee]);

  const selectedTaskId = form.taskId;
  const { data: selectedTask } = useGetTaskQuery(selectedTaskId, { skip: !selectedTaskId });

  const getTaskAssignee = (task: NonNullable<typeof tasks>[number] | undefined) => {
    if (!task?.assignee) return '';
    return typeof task.assignee === 'string' ? task.assignee : task.assignee.username;
  };

  useEffect(() => {
    if (!selectedTask || selectedTask._id !== form.taskId) return;
    setForm((previous) => ({
      ...previous,
      assignee: getTaskAssignee(selectedTask),
    }));
  }, [selectedTask, form.taskId]);

  //  Validation Errors 
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string;
  }>({});

  const categoryOptions = useMemo(() => {
    return Array.from(new Set([
      ...DEFAULT_CATEGORIES,
      ...existingNotes.map((note) => note.category).filter((category): category is string => Boolean(category?.trim())),
    ])).sort((a, b) => a.localeCompare(b));
  }, [existingNotes]);

  // Handlers 
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'title') {
      setFieldErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name as string]: value }));
  };

  const validate = (): boolean => {
    const errors: { title?: string } = {};
    if (!form.title.trim()) {
      errors.title = 'Note title is required';
    } else if (form.title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // Build payload – only include taskId if selected
      const linkedTask = selectedTask || (tasks || []).find((task) => task._id === form.taskId);
      const linkedAssignee = getTaskAssignee(linkedTask) || taskContext?.assignee || '';
      const payload: any = {
        title: form.title.trim(),
        content: form.description.trim() || ' ',
        description: form.description.trim(),
        category: form.category.trim() || 'General',
        priority: form.priority,
        task: form.status,
        assignee: form.taskId ? linkedAssignee || 'Unassigned' : form.assignee.trim() || 'Unassigned',
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      };
      if (form.taskId) {
        payload.taskId = form.taskId; 
        payload.taskTitle = linkedTask?.title || taskContext?.taskTitle || form.title.trim();
      }

      await createNote(payload).unwrap();
      navigate('/note-form'); // back to note list
    } catch (err) {
      console.error('Note creation failed', err);
    }
  };

  // ---- Helper: Extract error message ----
  const getErrorMessage = (): string => {
    if (!createError) return '';
    if ('data' in createError && createError.data) {
      const data = createError.data as Record<string, any>;
      return data?.error || data?.message || 'Something went wrong';
    }
    if ('message' in createError && createError.message) {
      return createError.message;
    }
    return 'Something went wrong. Please try again.';
  };

  // ---- Loading / Error states ----
  return (
    <Box sx={{ maxWidth: 640, mx: 'auto', width: '100%', py: 1 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 4 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Create new note
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Write a note for the selected task.
        </Typography>

        {tasksError && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Existing tasks could not be loaded, but you can still create a note without linking a task.
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            {taskLocked && (
              <TextField
                fullWidth
                label="Linked task title"
                value={selectedTask?.title || taskContext?.taskTitle || ''}
                disabled
                helperText="This note is linked to the task opened from Task Details."
              />
            )}

            
              <TextField
                required
                label="Note title"
              name="title"
              value={form.title}
              onChange={handleChange}
              error={!!fieldErrors.title}
              helperText={fieldErrors.title || 'A short, descriptive title.'}
                placeholder="Meeting notes"
              />

      
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              multiline
              rows={3}
              placeholder="Write your notes here..."
            />

          
            <FormControl fullWidth required>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                label="Category"
                name="category"
                value={form.category}
                onChange={handleSelectChange}
              >
                {categoryOptions.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
              <FormHelperText>Select a category for this note.</FormHelperText>
            </FormControl>

            
            <TextField
              label={form.taskId ? "Task assignee" : "Assignee"}
              name="assignee"
              value={form.assignee}
              onChange={handleChange}
              placeholder="Username or email"
              helperText={form.taskId ? "Taken from the selected task" : "Who is responsible for this note?"}
              disabled={Boolean(form.taskId)}
            />

   
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={form.status}
                  label="Status"
                  onChange={handleSelectChange}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  name="priority"
                  value={form.priority}
                  label="Priority"
                  onChange={handleSelectChange}
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            {/* ---- Start & End Dates ---- */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Start date"
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
              />
              <TextField
                label="End date"
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
              />
            </Stack>

            {/* ---- Server Error ---- */}
            {createError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {getErrorMessage()}
              </Alert>
            )}

            <Divider />

            {/* ---- Buttons ---- */}
            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
              <Button
                color="inherit"
                onClick={() => navigate('/note-form')}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isCreating || !form.title.trim()}
                startIcon={isCreating ? <CircularProgress size={18} color="inherit" /> : null}
                sx={{ px: 3 }}
              >
                {isCreating ? 'Creating...' : 'Create note'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};
