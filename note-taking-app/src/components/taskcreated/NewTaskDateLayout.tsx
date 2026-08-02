import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  IconButton,
  Grid,
  Chip,
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { useCreateTaskMutation } from '../../services/taskApi';
import { useGetProjectsQuery } from '../../services/projectApi';
import { useGetUsersQuery } from '../../services/authApi';
import { useGetCategoriesQuery } from '../../services/categoryApi';
import type { SelectChangeEvent } from '@mui/material';
import type { Task } from '../../types/Project';

const statusColors: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  Todo: 'default',
  'In Progress': 'warning',
  Complete: 'success',
  'Not Started': 'info',
};

export const NewTaskDateLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const prefillDueDate = location.state?.prefillDueDate || '';

  const { data: projects = [], isLoading: projectsLoading } = useGetProjectsQuery();
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();
  const [createTask, { isLoading: isCreating, isError: createError }] = useCreateTaskMutation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    categoryId: '',
    assignee: '',
    dueDate: prefillDueDate,
    status: 'Todo',
    priority: 'Medium',
  });

  const [errors, setErrors] = useState<{ title?: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedProject = useMemo(() => {
    return projects.find((p: any) => p._id === formData.projectId);
  }, [projects, formData.projectId]);

  const memberOptions: string[] = useMemo(() => {
    if (!selectedProject || !selectedProject.members || !users.length) return [];
    return selectedProject.members
      .map((member: any) => {
        if (typeof member === 'string') {
          let user = users.find((u) => u._id.toLowerCase() === member.toLowerCase());
          if (user) return user.username;
          user = users.find((u) => u.email.toLowerCase() === member.toLowerCase());
          if (user) return user.username;
          return '';
        }
        if (typeof member === 'object' && member !== null) {
          const email = typeof member.email === 'string' ? member.email : '';
          const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
          return user?.username || (typeof member.username === 'string' ? member.username : '');
        }
        return null;
      })
      .filter(Boolean);
  }, [selectedProject, users]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, assignee: '' }));
  }, [formData.projectId]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const projectParam = params.get('project');
    if (projectParam && projects.length > 0) {
      const exists = projects.some((p: any) => p._id === projectParam);
      if (exists) {
        setFormData((prev) => ({ ...prev, projectId: projectParam }));
      }
    }
  }, [projects, location.search]);

  useEffect(() => {
    if (prefillDueDate) {
      setFormData((prev) => ({ ...prev, dueDate: prefillDueDate }));
    }
  }, [prefillDueDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name === 'title' && errors.title) setErrors({});
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!formData.title.trim()) {
      setErrors({ title: 'Task name is required' });
      return;
    }

    if (!formData.projectId) {
      setSubmitError('Please select a project before creating a task.');
      return;
    }

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        projectId: formData.projectId,
        categoryId: formData.categoryId || undefined,
        assignee: formData.assignee || undefined,
        dueDate: formData.dueDate || undefined,
        status: formData.status as Task['status'],
        priority: formData.priority as Task['priority'],
      };

      await createTask(payload).unwrap();
      navigate('/my-tasks');
    } catch (err: any) {
      setSubmitError(err.data?.message || 'Failed to create task');
    }
  };

  if (projectsLoading || usersLoading || categoriesLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: 'auto',
        p: 4,
        minHeight: '100vh',
      }}
    >
      <Stack direction="row" spacing={1} sx={{ mb: 3, alignItems: 'center' }}>
        <IconButton onClick={() => navigate('/my-tasks')}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px' }}>
          Create New Task
        </Typography>
        {prefillDueDate && (
          <Chip
            label={`📅 Due: ${new Date(prefillDueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}`}
            size="small"
            sx={{ ml: 2, bgcolor: 'background.default' }}
          />
        )}
      </Stack>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          border: '1px solid #f0f0f0',
        }}
      >
        {submitError && (
          <Alert severity="error" sx={{ mb: 1}} onClose={() => setSubmitError(null)}>
            {submitError}
          </Alert>
        )}
        {createError && (
          <Alert severity="error" sx={{ mb: 1 }}>
            Failed to create task. Please try again.
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              required
              fullWidth
              label="Task Name"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              placeholder="Enter task name..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': { borderColor: '#973aa8' },
                  '&.Mui-focused fieldset': { borderColor: '#973aa8' },
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={2}
              placeholder="Add a description (optional)..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': { borderColor: '#973aa8' },
                  '&.Mui-focused fieldset': { borderColor: '#973aa8' },
                },
              }}
            />
          </Grid>

          {/* Project */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="project-label">Project</InputLabel>
              <Select
                labelId="project-label"
                label="Project"
                name="projectId"
                value={formData.projectId}
                onChange={handleSelectChange}
                sx={{ borderRadius: 2 }}
              >
                {projects.map((project: any) => (
                  <MenuItem key={project._id} value={project._id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Category (NEW) */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="category-label">Category (Optional)</InputLabel>
              <Select
                labelId="category-label"
                label="Category (Optional)"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleSelectChange}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">None</MenuItem>
                {categories.map((cat: any) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Assignee */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl
              fullWidth
              variant="outlined"
              disabled={!formData.projectId || !memberOptions.length}
            >
              <InputLabel id="assignee-label">
                {formData.projectId ? 'Assignee' : 'Select a project first'}
              </InputLabel>
              <Select
                labelId="assignee-label"
                label={formData.projectId ? 'Assignee' : 'Select a project first'}
                name="assignee"
                value={formData.assignee}
                onChange={handleSelectChange}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">
                  <em>Unassigned</em>
                </MenuItem>
                {memberOptions.map((username: string) => (
                  <MenuItem key={username} value={username}>
                    {username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Due Date */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Due Date"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': { borderColor: '#973aa8' },
                  '&.Mui-focused fieldset': { borderColor: '#973aa8' },
                },
              }}
            />
          </Grid>

          {/* Status */}
          {/* <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleSelectChange}
                sx={{ borderRadius: 2 }}
              >
                {['Todo', 'In Progress', 'Complete', 'Not Started'].map((status) => (
                  <MenuItem key={status} value={status}>
                    <Chip
                      label={status}
                      color={statusColors[status] || 'default'}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid> */}

          {/* Priority */}
          {/* <Grid size={{ xs: 12 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleSelectChange}
                sx={{ borderRadius: 2 }}
              >
                {['Low', 'Medium', 'High'].map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    <Chip
                      label={priority}
                      size="small"
                      variant={priority === 'High' ? 'filled' : 'outlined'}
                      color={priority === 'High' ? 'error' : 'default'}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid> */}

          {/* Status - Left side */}
<Grid size={{ xs: 12, md: 6 }}>
  <FormControl fullWidth variant="outlined">
    <InputLabel id="status-label">Status</InputLabel>
    <Select
      labelId="status-label"
      label="Status"
      name="status"
      value={formData.status}
      onChange={handleSelectChange}
      sx={{ borderRadius: 2 }}
    >
      {['Todo', 'In Progress', 'Complete', 'Not Started'].map((status) => (
        <MenuItem key={status} value={status}>
          <Chip
            label={status}
            color={statusColors[status] || 'default'}
            size="small"
            sx={{ fontWeight: 500 }}
          />
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>

{/* Priority - Right side (same row) */}
<Grid size={{ xs: 12, md: 6 }}>
  <FormControl fullWidth variant="outlined">
    <InputLabel id="priority-label">Priority</InputLabel>
    <Select
      labelId="priority-label"
      label="Priority"
      name="priority"
      value={formData.priority}
      onChange={handleSelectChange}
      sx={{ borderRadius: 2 }}
    >
      {['Low', 'Medium', 'High'].map((priority) => (
        <MenuItem key={priority} value={priority}>
          <Chip
            label={priority}
            size="small"
            variant={priority === 'High' ? 'filled' : 'outlined'}
            color={priority === 'High' ? 'error' : 'default'}
          />
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>
        </Grid>

        <Stack
          direction="row"
          spacing={2}
          sx={{
            mt: 4,
            pt: 2,
            borderTop: '1px solid #e0e0e0',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate('/my-tasks')}
            disabled={isCreating}
            sx={{ textTransform: 'none', px: 4 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isCreating || !formData.projectId}
            startIcon={isCreating ? <CircularProgress size={20} color="inherit" /> : <Save />}
            sx={{
              textTransform: 'none',
              bgcolor: '#973aa8',
              '&:hover': { bgcolor: '#7e3a8a' },
              px: 4,
            }}
          >
            {isCreating ? 'Creating...' : 'Create Task'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};