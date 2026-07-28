// // src/pages/NewNotePage.tsx
// import React, { useState } from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   Alert,
//   CircularProgress,
//   Divider,
//   Stack,
// } from '@mui/material';
// import type { SelectChangeEvent } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { useCreateNoteMutation } from '../services/noteApi';

// // Status & Priority Options (status ကို 'task' field နဲ့ သိမ်းမယ်)
// const STATUS_OPTIONS = ['Todo', 'In Progress', 'Complete', 'Not Started'] as const;
// const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'] as const;

// type StatusType = typeof STATUS_OPTIONS[number];
// type PriorityType = typeof PRIORITY_OPTIONS[number];

// export const NewNotePage: React.FC = () => {
//   const navigate = useNavigate();

//   // ---- Create Note Mutation ----
//   const [createNote, { isLoading: isCreating, error: createError }] =
//     useCreateNoteMutation();

//   // ---- Form State ----
//   const [form, setForm] = useState<{
//     title: string;
//     description: string;
//     category: string;
//     status: StatusType;
//     priority: PriorityType;
//     assignee: string;
//     startDate: string;
//     endDate: string;
//   }>({
//     title: '',
//     description: '',
//     category: '',
//     status: 'Todo',
//     priority: 'Medium',
//     assignee: '',
//     startDate: '',
//     endDate: '',
//   });

//   // ---- Validation Errors ----
//   const [fieldErrors, setFieldErrors] = useState<{
//     title?: string;
//   }>({});

//   // ---- Handlers ----
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//     if (name === 'title') {
//       setFieldErrors((prev) => ({ ...prev, title: undefined }));
//     }
//   };

//   const handleSelectChange = (e: SelectChangeEvent<string>) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name as string]: value }));
//   };

//   const validate = (): boolean => {
//     const errors: { title?: string } = {};
//     if (!form.title.trim()) {
//       errors.title = 'Note title is required';
//     } else if (form.title.length < 3) {
//       errors.title = 'Title must be at least 3 characters';
//     }
//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // ---- Submit ----
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       await createNote({
//         title: form.title.trim(),
//         description: form.description.trim(),
//         category: form.category.trim() || undefined,
//         task: form.status, // 👈 'task' field ထဲမှာ status ကို သိမ်းမယ် (filter အတွက်)
//         priority: form.priority,
//         assignee: form.assignee.trim() || 'Unassigned',
//         startDate: form.startDate || undefined,
//         endDate: form.endDate || undefined,
//       }).unwrap();

      
//       navigate('/note-form');
//     } catch (err) {
//       console.error('Note creation failed', err);
//     }
//   };

//   // ---- Helper: Extract error message ----
//   const getErrorMessage = (): string => {
//     if (!createError) return '';
//     if ('data' in createError && createError.data) {
//       const data = createError.data as Record<string, any>;
//       return data?.error || data?.message || 'Something went wrong';
//     }
//     if ('message' in createError && createError.message) {
//       return createError.message;
//     }
//     return 'Something went wrong. Please try again.';
//   };

//   return (
//     <Box sx={{ maxWidth: 640, mx: 'auto', width: '100%', py: 1 }}>
//       <Paper
//         elevation={0}
//         sx={{
//           p: { xs: 2.5, sm: 4 },
//           borderRadius: 3,
//           border: '1px solid',
//           borderColor: 'divider',
//           bgcolor: 'background.paper',
//         }}
//       >
//         <Typography variant="h5" gutterBottom>
//           Create new note
//         </Typography>
//         <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//           Add a new note with status, priority, and dates.
//         </Typography>

//         <form onSubmit={handleSubmit}>
//           <Stack spacing={2.5}>
//             {/* Note Title */}
//             <TextField
//               required
//               label="Note title"
//               name="title"
//               value={form.title}
//               onChange={handleChange}
//               error={!!fieldErrors.title}
//               helperText={fieldErrors.title || 'A short, descriptive title.'}
//               placeholder="Meeting notes"
//             />

//             {/* Description */}
//             <TextField
//               label="Description"
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//               multiline
//               rows={3}
//               placeholder="Write your notes here..."
//             />

//             {/* Category */}
//             <TextField
//               label="Category"
//               name="category"
//               value={form.category}
//               onChange={handleChange}
//               placeholder="e.g., Work, Personal, Ideas"
//               helperText="Optional category for organizing notes."
//             />

//             {/* Assignee */}
//             <TextField
//               label="Assignee"
//               name="assignee"
//               value={form.assignee}
//               onChange={handleChange}
//               placeholder="Username or email"
//               helperText="Who is responsible for this note?"
//             />

//             {/* Status & Priority */}
//             <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
//               <FormControl fullWidth>
//                 <InputLabel id="status-label">Status</InputLabel>
//                 <Select
//                   labelId="status-label"
//                   name="status"
//                   value={form.status}
//                   label="Status"
//                   onChange={handleSelectChange}
//                 >
//                   {STATUS_OPTIONS.map((s) => (
//                     <MenuItem key={s} value={s}>
//                       {s}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>

//               <FormControl fullWidth>
//                 <InputLabel id="priority-label">Priority</InputLabel>
//                 <Select
//                   labelId="priority-label"
//                   name="priority"
//                   value={form.priority}
//                   label="Priority"
//                   onChange={handleSelectChange}
//                 >
//                   {PRIORITY_OPTIONS.map((p) => (
//                     <MenuItem key={p} value={p}>
//                       {p}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Stack>

//             {/* Start & End Dates */}
//             <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
//               <TextField
//                 label="Start date"
//                 type="date"
//                 name="startDate"
//                 value={form.startDate}
//                 onChange={handleChange}
//                 slotProps={{ inputLabel: { shrink: true } }}
//                 fullWidth
//               />
//               <TextField
//                 label="End date"
//                 type="date"
//                 name="endDate"
//                 value={form.endDate}
//                 onChange={handleChange}
//                 slotProps={{ inputLabel: { shrink: true } }}
//                 fullWidth
//               />
//             </Stack>

//             {/* Server Error */}
//             {createError && (
//               <Alert severity="error" sx={{ mt: 1 }}>
//                 {getErrorMessage()}
//               </Alert>
//             )}

//             <Divider />

//             {/* Buttons */}
//             <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
//               <Button
//                 color="inherit"
//                 onClick={() => navigate('/note-form')}
//                 disabled={isCreating}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 disabled={isCreating || !form.title.trim()}
//                 startIcon={isCreating ? <CircularProgress size={18} color="inherit" /> : null}
//                 sx={{ px: 3 }}
//               >
//                 {isCreating ? 'Creating...' : 'Create note'}
//               </Button>
//             </Box>
//           </Stack>
//         </form>
//       </Paper>
//     </Box>
//   );
// };

// // export default NewNotePage;

// src/pages/NewNotePage.tsx

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
import { useGetTasksQuery } from '../services/taskApi';
import { useCreateNoteMutation } from '../services/noteApi';

// Status & Priority Options (same as tasks)
const STATUS_OPTIONS = ['Todo', 'In Progress', 'Complete', 'Not Started'] as const;
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'] as const;

type StatusType = typeof STATUS_OPTIONS[number];
type PriorityType = typeof PRIORITY_OPTIONS[number];

export const NewNotePage: React.FC = () => {
  const navigate = useNavigate();

  // ---- Fetch existing tasks (to link note to a task) ----
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksQuery({}); // ✅ Pass empty object – required by endpoint

  // ---- Create Note Mutation ----
  const [createNote, { isLoading: isCreating, error: createError }] =
    useCreateNoteMutation();

  // ---- Form State (includes taskId for linking) ----
  const [form, setForm] = useState<{
    title: string;
    description: string;
    category: string;
    status: StatusType;
    priority: PriorityType;
    assignee: string;
    startDate: string;
    endDate: string;
    taskId: string; // selected task ID (optional)
  }>({
    title: '',
    description: '',
    category: '',
    status: 'Todo',
    priority: 'Medium',
    assignee: '',
    startDate: '',
    endDate: '',
    taskId: '',
  });

  // ---- Validation Errors ----
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string;
  }>({});

  // ---- Handlers ----
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

  // ---- Submit ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // Build payload – only include taskId if selected
      const payload: any = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim() || undefined,
        task: form.status, // 👈 status stored in `task` field (matches filter logic)
        priority: form.priority,
        assignee: form.assignee.trim() || 'Unassigned',
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      };
      if (form.taskId) {
        payload.taskId = form.taskId; // 👈 send taskId if linked
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
  if (tasksLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (tasksError) {
    return (
      <Alert severity="error" sx={{ mt: 5 }}>
        Failed to load tasks. Please refresh or try again later.
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
          Create new note
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Add a new note and optionally link it to an existing task.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            {/* ---- Task Selection (Optional) ---- */}
            <FormControl fullWidth>
              <InputLabel id="task-select-label">Link to Task (Optional)</InputLabel>
              <Select
                labelId="task-select-label"
                name="taskId"
                value={form.taskId}
                label="Link to Task (Optional)"
                onChange={handleSelectChange}
              >
                <MenuItem value="">None</MenuItem>
                {tasks?.map((task) => (
                  <MenuItem key={task._id} value={task._id}>
                    {task.title}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                Select a task to associate this note with.
              </FormHelperText>
            </FormControl>

            {/* ---- Note Title ---- */}
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

            {/* ---- Description ---- */}
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              multiline
              rows={3}
              placeholder="Write your notes here..."
            />

            {/* ---- Category ---- */}
            <TextField
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g., Work, Personal, Ideas"
              helperText="Optional category for organizing notes."
            />

            {/* ---- Assignee ---- */}
            <TextField
              label="Assignee"
              name="assignee"
              value={form.assignee}
              onChange={handleChange}
              placeholder="Username or email"
              helperText="Who is responsible for this note?"
            />

            {/* ---- Status & Priority ---- */}
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
