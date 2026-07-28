

// import React, { useState } from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Switch,
//   FormControlLabel,
//   InputAdornment,
//   IconButton,
//   Chip,
//   Divider,
//   Alert,
//   CircularProgress,
//   Stack,
// } from '@mui/material';
// import {
//   // GitHub as GitHubIcon,
//   Lock as LockIcon,
//   Public as PublicIcon,
//   Clear as ClearIcon,
//   People as PeopleIcon,
//   SupervisorAccount as OwnerIcon,
//   Folder as FolderIcon
// } from '@mui/icons-material';
// // import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
// import { useNavigate } from 'react-router-dom';
// import { useCreateProjectMutation } from '../../services/projectApi';

// export const NewProjectLayout = () => {
//   const navigate = useNavigate();
//   const [createProject, { isLoading, error }] = useCreateProjectMutation();

//   let currentUserEmail = 'You (signed-in account)';
//   try {
//     const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
//     if (storedUser?.email) currentUserEmail = storedUser.email;
//   } catch {
//     // keep fallback label
//   }

//   // Form state
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     isPrivate: true,
//     members: '',
//   });

//   // Field-level errors
//   const [fieldErrors, setFieldErrors] = useState<{ name?: string }>({});

//   // Handlers
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, checked, type } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//     // Clear error on change
//     if (name === 'name') {
//       setFieldErrors((prev) => ({ ...prev, name: undefined }));
//     }
//   };

//   const handleClearField = (field: keyof typeof formData) => {
//     setFormData((prev) => ({ ...prev, [field]: '' }));
//   };

//   const validate = (): boolean => {
//     const errors: { name?: string } = {};
//     if (!formData.name.trim()) {
//       errors.name = 'Project name is required';
//     } else if (formData.name.length < 3) {
//       errors.name = 'Project name must be at least 3 characters';
//     } else if (formData.name.length > 100) {
//       errors.name = 'Project name must be less than 100 characters';
//     } else if (!/^[a-zA-Z0-9\-_.]+$/.test(formData.name)) {
//       errors.name = 'Only letters, numbers, hyphens, underscores, and dots are allowed';
//     }
//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;

//     // Backend assigns the authenticated user as the single owner
//     const payload = {
//       name: formData.name.trim(),
//       description: formData.description.trim(),
//       isPrivate: formData.isPrivate,
//       members: formData.members.split(',').map((s) => s.trim()).filter(Boolean),
//     };

//     try {
//       await createProject(payload).unwrap();
//       navigate('/my-project');
//     } catch (err) {
//       console.error('Creation failed', err);
//     }
//   };

//   // Preview URL
//   const repoUrl = `https://github.com/your-org/${formData.name || 'project-name'}`;

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
//         {/* Header */}
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
//           <FolderIcon color="primary" sx={{ fontSize: 28 }} />
//           <Typography variant="h5" >
//             Create a new project
//           </Typography>
//         </Box>
//         <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//           Set up a workspace for notes, tasks, and collaborators.
//         </Typography>

//         <form onSubmit={handleSubmit}>
//           <Stack spacing={2.5}>
//           {/* Project Name */}
//           <TextField
//             required
//             label="Project name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             error={!!fieldErrors.name}
//             helperText={fieldErrors.name || 'A unique name for your project.'}
//             placeholder="my-awesome-project"
//             slotProps={{
//               input: {
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <PeopleIcon color="action" />
//                   </InputAdornment>
//                 ),
//                 endAdornment: formData.name ? (
//                   <InputAdornment position="end">
//                     <IconButton size="small" onClick={() => handleClearField('name')}>
//                       <ClearIcon fontSize="small" />
//                     </IconButton>
//                   </InputAdornment>
//                 ) : undefined,
//               },
//             }}
//           />

//           {/* URL Preview */}
//           {formData.name && !fieldErrors.name && (
//             <Box
//               sx={{
//                 p: 1.5,
//                 bgcolor: 'secondary.main',
//                 borderRadius: 2,
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: 1,
//               }}
//             >
//               <Typography variant="body2" color="primary" sx={{ wordBreak: 'break-all' }}>
//                 {repoUrl}
//               </Typography>
//             </Box>
//           )}

//           {/* Description */}
//           <TextField
//             label="Description"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             multiline
//             rows={3}
//             placeholder="A brief description of your project..."
//           />

//           {/* Public / Private Toggle */}
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
//             <FormControlLabel
//               control={
//                 <Switch
//                   checked={formData.isPrivate}
//                   onChange={handleChange}
//                   name="isPrivate"
//                   color="primary"
//                 />
//               }
//               label={
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   {formData.isPrivate ? (
//                     <>
//                       <LockIcon fontSize="small" />
//                       <Typography variant="body2">Private</Typography>
//                     </>
//                   ) : (
//                     <>
//                       <PublicIcon fontSize="small" />
//                       <Typography variant="body2">Public</Typography>
//                     </>
//                   )}
//                 </Box>
//               }
//             />
//             <Chip
//               label={formData.isPrivate ? 'Only members can see' : 'Anyone can see'}
//               size="small"
//               variant="outlined"
//               color={formData.isPrivate ? 'warning' : 'success'}
//             />
//           </Box>

//           <Divider />

//           {/* Members + read-only owner */}
//           <Stack spacing={2}>
//             <TextField
//               label="Owner"
//               value={currentUserEmail}
//               disabled
//               helperText="Each project has one owner — you, as the creator"
//               slotProps={{
//                 input: {
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <OwnerIcon color="action" />
//                     </InputAdornment>
//                   ),
//                 },
//               }}
//             />
//             <TextField
//               label="Members (comma separated)"
//               name="members"
//               value={formData.members}
//               onChange={handleChange}
//               placeholder="teammate@email.com"
//               helperText="Optional: invite members by email"
//               slotProps={{
//                 input: {
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <PeopleIcon color="action" />
//                     </InputAdornment>
//                   ),
//                 },
//               }}
//             />
//           </Stack>

//           {/* Error Display */}
//           {error && (
//             <Alert severity="error">
//               {(error as any)?.data?.error || 'Something went wrong. Please try again.'}
//             </Alert>
//           )}

//           <Divider />
//           <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
//             <Button
//               color="inherit"
//               onClick={() => navigate(-1)}
//               disabled={isLoading}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               variant="contained"
//               disabled={isLoading || !formData.name.trim()}
//               startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : null}
//               sx={{ px: 3 }}
//             >
//               {isLoading ? 'Creating...' : 'Create project'}
//             </Button>
//           </Box>
//           </Stack>
//         </form>
//       </Paper>
//     </Box>
//   );
// };

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Stack,
  Autocomplete,
  Avatar,
} from '@mui/material';
import {
  Lock as LockIcon,
  Public as PublicIcon,
  Clear as ClearIcon,
  People as PeopleIcon,
  SupervisorAccount as OwnerIcon,
  Folder as FolderIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCreateProjectMutation } from '../../services/projectApi';
import { useGetUsersQuery } from '../../services/authApi';

export const NewProjectLayout = () => {
  const navigate = useNavigate();
  const [createProject, { isLoading, error }] = useCreateProjectMutation();
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();

  let currentUserEmail = 'You (signed-in account)';
  try {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser?.email) currentUserEmail = storedUser.email;
  } catch {
    // keep fallback label
  }

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: true,
    members: [] as string[],
  });

  const [fieldErrors, setFieldErrors] = useState<{ name?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (name === 'name') {
      setFieldErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleClearField = (field: keyof typeof formData) => {
    setFormData((prev) => ({ ...prev, [field]: '' }));
  };

  const handleMembersChange = (_: React.SyntheticEvent, newValue: typeof users) => {
    setFormData((prev) => ({
      ...prev,
      members: newValue.map((user) => user._id),
    }));
  };

  const validate = (): boolean => {
    const errors: { name?: string } = {};
    if (!formData.name.trim()) {
      errors.name = 'Project name is required';
    } else if (formData.name.length < 3) {
      errors.name = 'Project name must be at least 3 characters';
    } else if (formData.name.length > 100) {
      errors.name = 'Project name must be less than 100 characters';
    } else if (!/^[a-zA-Z0-9\-_.]+$/.test(formData.name)) {
      errors.name = 'Only letters, numbers, hyphens, underscores, and dots are allowed';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      isPrivate: formData.isPrivate,
      members: formData.members,
    };

    try {
      await createProject(payload).unwrap();
      navigate('/my-project');
    } catch (err) {
      console.error('Creation failed', err);
    }
  };

  const repoUrl = `https://github.com/your-org/${formData.name || 'project-name'}`;

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <FolderIcon color="primary" sx={{ fontSize: 28 }} />
          <Typography variant="h5">Create a new project</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Set up a workspace for notes, tasks, and collaborators.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            {/* Project Name */}
            <TextField
              required
              label="Project name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!fieldErrors.name}
              helperText={fieldErrors.name || 'A unique name for your project.'}
              placeholder="my-awesome-project"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PeopleIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: formData.name ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => handleClearField('name')}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : undefined,
                },
              }}
            />

            {formData.name && !fieldErrors.name && (
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: 'secondary.main',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography variant="body2" color="primary" sx={{ wordBreak: 'break-all' }}>
                  {repoUrl}
                </Typography>
              </Box>
            )}

            {/* Description */}
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              placeholder="A brief description of your project..."
            />

            {/* Public / Private Toggle */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPrivate}
                    onChange={handleChange}
                    name="isPrivate"
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {formData.isPrivate ? (
                      <>
                        <LockIcon fontSize="small" />
                        <Typography variant="body2">Private</Typography>
                      </>
                    ) : (
                      <>
                        <PublicIcon fontSize="small" />
                        <Typography variant="body2">Public</Typography>
                      </>
                    )}
                  </Box>
                }
              />
              <Chip
                label={formData.isPrivate ? 'Only members can see' : 'Anyone can see'}
                size="small"
                variant="outlined"
                color={formData.isPrivate ? 'warning' : 'success'}
              />
            </Box>

            <Divider />

            {/* Owner (read-only) */}
            <TextField
              label="Owner"
              value={currentUserEmail}
              disabled
              helperText="Each project has one owner — you, as the creator"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <OwnerIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* Members - Autocomplete */}
            <Autocomplete
              multiple
              id="members-autocomplete"
              options={users}
              loading={usersLoading}
              getOptionLabel={(option) => option.username || option.email || ''}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              value={users.filter((u) => formData.members.includes(u._id))}
              onChange={handleMembersChange}
    renderInput={(params) => {
  
  const inputProps = (params as any).slotProps?.input || params.InputProps as any;

  return (
    <TextField
      {...params}
      label="Members"
      placeholder="Select team members"
      helperText="Choose users who can access this project"
      slotProps={{
        input: {
          ...inputProps,
          startAdornment: (
            <>
              <InputAdornment position="start">
                <PeopleIcon color="action" />
              </InputAdornment>
              {inputProps?.startAdornment}
            </>
          ),
        },
      }}
    />
  );
}}
               
              renderOption={(props, option) => (
                <li {...props}>
                  <Stack direction="row" spacing={1} sx={{alignItems:'center',}}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                      {option.username?.[0]?.toUpperCase() || '?'}
                    </Avatar>
                    <Typography variant="body2">{option.username}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.email}
                    </Typography>
                  </Stack>
                </li>
              )}
              slotProps={{
                chip:{
                   size: 'small',
                }
               
              }}
              sx={{ width: '100%' }}
            />

            {/* Error Display */}
            {error && (
              <Alert severity="error">
                {(error as any)?.data?.error || 'Something went wrong. Please try again.'}
              </Alert>
            )}

            <Divider />
            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
              <Button
                color="inherit"
                onClick={() => navigate(-1)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading || !formData.name.trim()}
                startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : null}
                sx={{ px: 3 }}
              >
                {isLoading ? 'Creating...' : 'Create project'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};