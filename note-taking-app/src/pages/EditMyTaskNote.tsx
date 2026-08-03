

// import React, { useEffect, useMemo, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import {
//   Alert,
//   Box,
//   Button,
//   CircularProgress,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Paper,
//   Select,
//   Stack,
//   TextField,
//   Typography,
// } from '@mui/material';
// import type { SelectChangeEvent } from '@mui/material';
// import { useGetProjectsQuery } from '../services/projectApi';
// import { useGetUsersQuery } from '../services/authApi';
// import { useGetCategoriesQuery } from '../services/categoryApi'; // 👈 Category API
// import { useGetTaskQuery, useUpdateTaskMutation } from '../services/taskApi';
// import type { Task } from '../types/Project';

// const STATUS_OPTIONS: Task['status'][] = ['Todo', 'In Progress', 'Complete', 'Not Started'];
// const PRIORITY_OPTIONS: Task['priority'][] = ['Low', 'Medium', 'High'];

// type FormState = {
//   title: string;
//   description: string;
//   projectId: string;
//   categoryId: string; // 👈 categoryId ထည့်
//   assignee: string;
//   status: Task['status'];
//   priority: Task['priority'];
//   dueDate: string;
// };

// export const EditMyTaskNote: React.FC = () => {
//   const { id = '' } = useParams<{ id: string }>();
//   const navigate = useNavigate();
  
//   const { data: task, isLoading: taskLoading, isError: taskError } = useGetTaskQuery(id, {
//     skip: !id,
//   });
//   const { data: projects = [], isLoading: projectsLoading } = useGetProjectsQuery();
//   const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
//   const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery(); // 👈 Categories
//   const [updateTask, { isLoading: isSaving, error: updateError }] = useUpdateTaskMutation();
  
//   const [form, setForm] = useState<FormState>({
//     title: '',
//     description: '',
//     projectId: '',
//     categoryId: '', // 👈 default empty
//     assignee: '',
//     status: 'Todo',
//     priority: 'Medium',
//     dueDate: '',
//   });

//   useEffect(() => {
//     if (!task) return;
//     const projectId = typeof task.project === 'string' ? task.project : task.project?._id;
//     const categoryId = typeof task.category === 'object' && task.category !== null
//       ? task.category._id
//       : '';
    
//     setForm({
//       title: task.title || '',
//       description: task.description || '',
//       projectId: projectId || '',
//       categoryId: categoryId || '',
//       assignee: typeof task.assignee === 'string' ? task.assignee : task.assignee?.username || '',
//       status: task.status,
//       priority: task.priority,
//       dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
//     });
//   }, [task]);

//   const assigneeOptions = useMemo(() => {
//     const project = projects.find((item) => item._id === form.projectId);
//     if (!project) return [];
//     const identifiers = [...(project.members || []), ...(project.owners || [])];

//     return identifiers.reduce<typeof users>((options, member) => {
//       const value = member.trim().toLowerCase();
//       const user = users.find(
//         (candidate) => candidate._id.toLowerCase() === value || candidate.email.toLowerCase() === value,
//       );
//       if (user && !options.some((option) => option._id === user._id)) options.push(user);
//       return options;
//     }, []);
//   }, [form.projectId, projects, users]);

//   const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = event.target;
//     setForm((previous) => ({ ...previous, [name]: value }));
//   };

//   const handleSelectChange = (event: SelectChangeEvent<string>) => {
//     const { name, value } = event.target;
//     setForm((previous) => ({ ...previous, [name]: value }));
//   };

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     if (!id || form.title.trim().length < 3) return;

//     try {
//       await updateTask({
//         id,
//         body: {
//           title: form.title.trim(),
//           description: form.description.trim(),
//           categoryId: form.categoryId || undefined, 
//           assignee: form.assignee || 'Unassigned',
//           status: form.status,
//           priority: form.priority,
//           dueDate: form.dueDate || undefined,
//         },
//       }).unwrap();
//       navigate('/my-tasks');
//     } catch {
//       // Error handled below
//     }
//   };

//   if (taskLoading || projectsLoading || usersLoading || categoriesLoading) {
//     return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>;
//   }

//   if (taskError || !task) {
//     return <Alert severity="error" sx={{ mt: 4 }}>Unable to load this task.</Alert>;
//   }

//   return (
//     <Box sx={{ maxWidth: 640, mx: 'auto', width: '100%', py: 1 }}>
//       <Paper component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
//         <Typography variant="h5" gutterBottom>Edit task</Typography>
//         <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//           Update the task details and project member assignee.
//         </Typography>

//         {updateError && <Alert severity="error" sx={{ mb: 2 }}>Failed to update task. Please try again.</Alert>}

//         <Stack spacing={2.5}>
//           <TextField required fullWidth label="Task title" name="title" value={form.title} onChange={handleTextChange} />
//           <TextField fullWidth multiline rows={3} label="Description" name="description" value={form.description} onChange={handleTextChange} />

//           <TextField fullWidth label="Project" value={projects.find((project) => project._id === form.projectId)?.name || 'Unknown project'} disabled />

//           {/* 👇 Category Dropdown (NEW) */}
//           <FormControl fullWidth>
//             <InputLabel id="edit-category-label">Category (Optional)</InputLabel>
//             <Select
//               labelId="edit-category-label"
//               label="Category (Optional)"
//               name="categoryId"
//               value={form.categoryId}
//               onChange={handleSelectChange}
//             >
//               <MenuItem value="">None</MenuItem>
//               {categories.map((cat) => (
//                 <MenuItem key={cat._id} value={cat._id}>
//                   {cat.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <FormControl fullWidth disabled={!assigneeOptions.length}>
//             <InputLabel id="edit-assignee-label">Assignee</InputLabel>
//             <Select labelId="edit-assignee-label" label="Assignee" name="assignee" value={form.assignee} onChange={handleSelectChange}>
//               <MenuItem value="">Unassigned</MenuItem>
//               {assigneeOptions.map((user) => <MenuItem key={user._id} value={user.username}>{user.username}</MenuItem>)}
//             </Select>
//           </FormControl>

//           <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
//             <FormControl fullWidth>
//               <InputLabel id="edit-status-label">Status</InputLabel>
//               <Select labelId="edit-status-label" label="Status" name="status" value={form.status} onChange={handleSelectChange}>
//                 {STATUS_OPTIONS.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
//               </Select>
//             </FormControl>
//             <FormControl fullWidth>
//               <InputLabel id="edit-priority-label">Priority</InputLabel>
//               <Select labelId="edit-priority-label" label="Priority" name="priority" value={form.priority} onChange={handleSelectChange}>
//                 {PRIORITY_OPTIONS.map((priority) => <MenuItem key={priority} value={priority}>{priority}</MenuItem>)}
//               </Select>
//             </FormControl>
//           </Stack>

//           <TextField fullWidth type="date" label="Due date" name="dueDate" value={form.dueDate} onChange={handleTextChange} slotProps={{ inputLabel: { shrink: true } }} />

//           <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
//             <Button color="inherit" onClick={() => navigate('/my-tasks')} disabled={isSaving}>Cancel</Button>
//             <Button type="submit" variant="contained" disabled={isSaving || form.title.trim().length < 3}>
//               {isSaving ? 'Saving...' : 'Save changes'}
//             </Button>
//           </Box>
//         </Stack>
//       </Paper>
//     </Box>
//   );
// };

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useGetProjectsQuery } from '../services/projectApi';
import { useGetUsersQuery } from '../services/authApi';
import { useGetCategoriesQuery } from '../services/categoryApi';
import { useGetTaskQuery, useUpdateTaskMutation } from '../services/taskApi';
import type { Task } from '../types/Project';

const STATUS_OPTIONS: Task['status'][] = ['Todo', 'In Progress', 'Complete', 'Not Started'];
const PRIORITY_OPTIONS: Task['priority'][] = ['Low', 'Medium', 'High'];

type FormState = {
  title: string;
  description: string;
  projectId: string;
  categoryId: string;
  assignee: string;
  status: Task['status'];
  priority: Task['priority'];
  dueDate: string;
};

export const EditMyTaskNote: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: task, isLoading: taskLoading, isError: taskError } = useGetTaskQuery(id, {
    skip: !id,
  });
  const { data: projects = [], isLoading: projectsLoading } = useGetProjectsQuery();
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  

  const { 
    data: categories = [], 
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategoriesQuery({ projectId: undefined });

  const [updateTask, { isLoading: isSaving, error: updateError }] = useUpdateTaskMutation();
  
  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    projectId: '',
    categoryId: '',
    assignee: '',
    status: 'Todo',
    priority: 'Medium',
    dueDate: '',
  });

  useEffect(() => {
    if (!task) return;
    const projectId = typeof task.project === 'string' ? task.project : task.project?._id;
    const categoryId = typeof task.category === 'object' && task.category !== null
      ? task.category._id
      : '';
    
    setForm({
      title: task.title || '',
      description: task.description || '',
      projectId: projectId || '',
      categoryId: categoryId || '',
      assignee: typeof task.assignee === 'string' ? task.assignee : task.assignee?.username || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
    });
  }, [task]);

  const assigneeOptions = useMemo(() => {
    const project = projects.find((item) => item._id === form.projectId);
    if (!project) return [];
    const identifiers = [...(project.members || []), ...(project.owners || [])];

    return identifiers.reduce<typeof users>((options, member) => {
      const value = member.trim().toLowerCase();
      const user = users.find(
        (candidate) => candidate._id.toLowerCase() === value || candidate.email.toLowerCase() === value,
      );
      if (user && !options.some((option) => option._id === user._id)) options.push(user);
      return options;
    }, []);
  }, [form.projectId, projects, users]);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!id || form.title.trim().length < 3) return;

    try {
      await updateTask({
        id,
        body: {
          title: form.title.trim(),
          description: form.description.trim(),
          categoryId: form.categoryId || undefined,
          assignee: form.assignee || 'Unassigned',
          status: form.status,
          priority: form.priority,
          dueDate: form.dueDate || undefined,
        },
      }).unwrap();
      navigate('/my-tasks');
    } catch {
      // Error handled below
    }
  };

  // ---- Loading States ----
  if (taskLoading || projectsLoading || usersLoading || categoriesLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>;
  }

  if (taskError || !task) {
    return <Alert severity="error" sx={{ mt: 4 }}>Unable to load this task.</Alert>;
  }

  if (categoriesError) {
    console.error('Category loading error:', categoriesError);
  }

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto', width: '100%', py: 1 }}>
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h5" gutterBottom>Edit task</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Update the task details and project member assignee.
        </Typography>

        {updateError && <Alert severity="error" sx={{ mb: 2 }}>Failed to update task. Please try again.</Alert>}

        <Stack spacing={2.5}>
          <TextField required fullWidth label="Task title" name="title" value={form.title} onChange={handleTextChange} />
          <TextField fullWidth multiline rows={3} label="Description" name="description" value={form.description} onChange={handleTextChange} />

          <TextField fullWidth label="Project" value={projects.find((project) => project._id === form.projectId)?.name || 'Unknown project'}  />

        
          <FormControl fullWidth>
            <InputLabel id="edit-category-label">Category (Optional)</InputLabel>
            <Select
              labelId="edit-category-label"
              label="Category (Optional)"
              name="categoryId"
              value={form.categoryId}
              onChange={handleSelectChange}
              disabled={categoriesLoading}
            >
              <MenuItem value="">None</MenuItem>
              {categories && categories.length > 0 ? (
                categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No categories available</MenuItem>
              )}
            </Select>
            <FormHelperText>
              {categories.length === 0 && !categoriesLoading 
                ? 'No categories found. Create one first.' 
                : 'Assign a category to this task (optional)'}
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth disabled={!assigneeOptions.length}>
            <InputLabel id="edit-assignee-label">Assignee</InputLabel>
            <Select labelId="edit-assignee-label" label="Assignee" name="assignee" value={form.assignee} onChange={handleSelectChange}>
              <MenuItem value="">Unassigned</MenuItem>
              {assigneeOptions.map((user) => <MenuItem key={user._id} value={user.username}>{user.username}</MenuItem>)}
            </Select>
          </FormControl>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="edit-status-label">Status</InputLabel>
              <Select labelId="edit-status-label" label="Status" name="status" value={form.status} onChange={handleSelectChange}>
                {STATUS_OPTIONS.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="edit-priority-label">Priority</InputLabel>
              <Select labelId="edit-priority-label" label="Priority" name="priority" value={form.priority} onChange={handleSelectChange}>
                {PRIORITY_OPTIONS.map((priority) => <MenuItem key={priority} value={priority}>{priority}</MenuItem>)}
              </Select>
            </FormControl>
          </Stack>

          <TextField fullWidth type="date" label="Due date" name="dueDate" value={form.dueDate} onChange={handleTextChange} slotProps={{ inputLabel: { shrink: true } }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
            <Button color="inherit" onClick={() => navigate('/my-tasks')} disabled={isSaving}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isSaving || form.title.trim().length < 3}>
              {isSaving ? 'Saving...' : 'Save changes'}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};