
import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { useGetProjectsQuery } from '../../services/projectApi';
import { useCreateTaskMutation } from '../../services/taskApi';

// Status & Priority Options
const STATUS_OPTIONS = ['Todo', 'In Progress', 'Complete', 'Not Started'] as const;
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'] as const;

type StatusType = typeof STATUS_OPTIONS[number];
type PriorityType = typeof PRIORITY_OPTIONS[number];

export const NewTaskLayout: React.FC = () => {
  const navigate = useNavigate();

  // ---- Projects ----
  const {
    data: projects,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useGetProjectsQuery();

  // ---- Create Task ----
  const [createTask, { isLoading: isCreating, error: createError }] =
    useCreateTaskMutation();

  // ---- Form State ----
  const [form, setForm] = useState<{
    title: string;
    description: string;
    projectId: string;
    assignee: string;
    status: StatusType;
    priority: PriorityType;
    dueDate: string;
  }>({
    title: '',
    description: '',
    projectId: '',
    assignee: '',
    status: 'Todo',
    priority: 'Medium',
    dueDate: '',
  });

  // ---- Validation Errors ----
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string;
    projectId?: string;
  }>({});

  // ---- Handlers ----
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'title' || name === 'projectId') {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name as string]: value }));
    if (name === 'projectId') {
      setFieldErrors((prev) => ({ ...prev, projectId: undefined }));
    }
  };

  const validate = (): boolean => {
    const errors: { title?: string; projectId?: string } = {};
    if (!form.title.trim()) {
      errors.title = 'Task title is required';
    } else if (form.title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }
    if (!form.projectId) {
      errors.projectId = 'Please select a project';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ---- Submit ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createTask({
        title: form.title.trim(),
        description: form.description.trim(),
        projectId: form.projectId,
        assignee: form.assignee.trim() || 'Unassigned',
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate || undefined,
      }).unwrap();
      navigate('/my-tasks');
    } catch (err) {
      // Error handled by createError
      console.error('Task creation failed', err);
    }
  };

  // ---- Helper: Extract error message from RTK Query error ----
  const getErrorMessage = (): string => {
    if (!createError) return '';
    // FetchBaseQueryError
    if ('data' in createError && createError.data) {
      const data = createError.data as Record<string, any>;
      return data?.error || data?.message || 'Something went wrong';
    }
    // SerializedError
    if ('message' in createError && createError.message) {
      return createError.message;
    }
    return 'Something went wrong. Please try again.';
  };

  // ---- Loading ----
  if (projectsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  // ---- Error ----
  if (projectsError) {
    return (
      <Alert severity="error" sx={{ mt: 5 }}>
        Failed to load projects. Please refresh or try again later.
      </Alert>
    );
  }

  // ---- Render ----
  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Create New Task
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Add a new task to one of your projects.
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Project Selection */}
          <FormControl
            fullWidth
            required
            sx={{ mb: 2 }}
            error={!!fieldErrors.projectId}
          >
            <InputLabel id="project-select-label">Project</InputLabel>
            <Select
              labelId="project-select-label"
              name="projectId"
              value={form.projectId}
              label="Project"
              onChange={handleSelectChange}
            >
              {projects?.map((project) => (
                <MenuItem key={project._id} value={project._id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
            {fieldErrors.projectId && (
              <FormHelperText>{fieldErrors.projectId}</FormHelperText>
            )}
          </FormControl>

          {/* Task Title */}
          <TextField
            fullWidth
            required
            label="Task Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            error={!!fieldErrors.title}
            helperText={
              fieldErrors.title || 'A short, descriptive title for the task.'
            }
            placeholder="Design landing page"
            sx={{ mb: 2 }}
          />

          {/* Description */}
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            multiline
            rows={3}
            placeholder="Provide more details about this task..."
            sx={{ mb: 2 }}
          />

          {/* Assignee */}
          <TextField
            fullWidth
            label="Assignee"
            name="assignee"
            value={form.assignee}
            onChange={handleChange}
            placeholder="Username or email (e.g., john.doe)"
            helperText="Who is responsible for this task?"
            sx={{ mb: 2 }}
          />

          {/* Status & Priority */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
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

          {/* Due Date */}
          <TextField
            fullWidth
            label="Due Date"
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            // InputLabelProps={{ shrink: true }}
            slotProps={{
              inputLabel:{
               shrink:true
              }
            }}
            sx={{ mb: 3 }}
          />

          {/* Server Error */}
          {createError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {getErrorMessage()}
            </Alert>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/my-tasks')}
              disabled={isCreating}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isCreating || !form.title.trim() || !form.projectId}
              startIcon={isCreating ? <CircularProgress size={20} /> : null}
              sx={{ px: 4, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              {isCreating ? 'Creating...' : 'Create Task'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};