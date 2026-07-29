import React, { useState ,useMemo} from 'react';
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
import { useGetUsersQuery } from '../../services/authApi';

// Status & Priority Options
const STATUS_OPTIONS = ['Todo', 'In Progress', 'Complete', 'Not Started'] as const;
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'] as const;

type StatusType = typeof STATUS_OPTIONS[number];
type PriorityType = typeof PRIORITY_OPTIONS[number];

export const NewTaskLayout: React.FC = () => {
  const navigate = useNavigate();

  // ---- Projects ----
  const {
    data: projects = [],
    isLoading: projectsLoading,
    isError: projectsError,
  } = useGetProjectsQuery();


  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  // Create Task
  const [createTask, { isLoading: isCreating, error: createError }] =
    useCreateTaskMutation();
    

  //  Form State 
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

  const assigneeOptions = useMemo(() => {
    if (!form.projectId || !projects.length || !users.length) return [];

    const selectedProject = projects.find((p) => p._id === form.projectId);
    if (!selectedProject) return [];

    const memberIdentifiers = [
      ...(selectedProject.members || []),
      ...(selectedProject.owners || []),
    ];

    return memberIdentifiers.reduce<typeof users>((options, member) => {
      const identifier = member.trim().toLowerCase();
      const user = users.find(
        (candidate) =>
          candidate._id.toLowerCase() === identifier ||
          candidate.email.toLowerCase() === identifier,
      );

      if (user && !options.some((option) => option._id === user._id)) {
        options.push(user);
      }
      return options;
    }, []);
  }, [form.projectId, projects, users]);



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

  // const handleSelectChange = (e: SelectChangeEvent<string>) => {
  //   const { name, value } = e.target;
  //   console.log('Selected:', name, value);
  //   setForm((prev) => ({ ...prev, [name as string]: value }));
  //   if (name === 'projectId') {
  //     setFieldErrors((prev) => ({ ...prev, projectId: undefined }));
  //   }
  // };

   const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name as string]: value,
      ...(name === 'projectId' && { assignee: '' }), // project ပြောင်းရင် assignee ကိုရှင်း
    }));
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

  //  Submit 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createTask({
        title: form.title.trim(),
        description: form.description.trim(),
        projectId: form.projectId,
        assignee: form.assignee || undefined,
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

  //  Error 
  if (projectsError) {
    return (
      <Alert severity="error" sx={{ mt: 5 }}>
        Failed to load projects. Please refresh or try again later.
      </Alert>
    );
  }

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
          Create new task
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Add a new task to one of your projects.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
          {/* Project Selection */}
          <FormControl
            fullWidth
            required
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
            required
            label="Task title"
            name="title"
            value={form.title}
            onChange={handleChange}
            error={!!fieldErrors.title}
            helperText={
              fieldErrors.title || 'A short, descriptive title for the task.'
            }
            placeholder="Design landing page"
          />

          {/* Description */}
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            multiline
            rows={3}
            placeholder="Provide more details about this task..."
          />

          {/* Assignee */}
          {/* <TextField
            label="Assignee"
            name="assignee"
            value={form.assignee}
            onChange={handleChange}
            placeholder="Username or email"
            helperText="Who is responsible for this task?"
          /> */}

           <FormControl
              fullWidth
              disabled={!form.projectId || usersLoading || assigneeOptions.length === 0}
            >
              <InputLabel id="assignee-label">Assignee</InputLabel>
              <Select
                labelId="assignee-label"
                name="assignee"
                value={form.assignee}
                label="Assignee"
                onChange={handleSelectChange}
              >
                <MenuItem value="">Unassigned</MenuItem>
                {assigneeOptions.map((user) => (
                  <MenuItem key={user._id} value={user.username}>
                    {user.username} {user.email && `(${user.email})`}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {!form.projectId
                  ? 'Please select a project first'
                  : assigneeOptions.length === 0
                  ? 'No members in this project'
                  : 'Select a team member from this project'}
              </FormHelperText>
            </FormControl>


          {/* Status & Priority */}
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

          {/* Due Date */}
          <TextField
            label="Due date"
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          {/* Server Error */}
          {createError && (
            <Alert severity="error">
              {getErrorMessage()}
            </Alert>
          )}

          <Divider />

          {/* Buttons */}
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
            <Button
              color="inherit"
              onClick={() => navigate('/my-tasks')}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isCreating || !form.title.trim() || !form.projectId}
              startIcon={isCreating ? <CircularProgress size={18} color="inherit" /> : null}
              sx={{ px: 3 }}
            >
              {isCreating ? 'Creating...' : 'Create task'}
            </Button>
          </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};
