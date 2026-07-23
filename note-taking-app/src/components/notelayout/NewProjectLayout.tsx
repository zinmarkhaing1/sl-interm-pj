// import React,{useState} from 'react';
// import {useNavigate} from "react-router-dom";
// import { useCreateNoteMutation } from "../../services/noteApi";
// import {Box, MenuItem,Paper,Button,Grid, Typography,TextField, Stack, colors } from "@mui/material";

// import EventNoteIcon from "@mui/icons-material/EventNote";
// import DateRangeIcon from "@mui/icons-material/DateRange";
// import TaskIcon from "@mui/icons-material/Task";
// import WorkIcon from "@mui/icons-material/Work";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
// import SchoolIcon from "@mui/icons-material/School";




// import DateTimePicker from "react-datetime-picker";
// import "react-datetime-picker/dist/DateTimePicker.css";
// import "react-calendar/dist/Calendar.css";

// type DateTimeValue = Date | null;

// export const NewProjectLayout = () => {
//      const [note, setNote] = useState({
//         title: "",
//         description: "",
//         category: "",
//         priority: "",
//         assignee: "",
//         task:"",
//         startDate: "",
//         endDate: "",
//       });
    
//       const [startDate, setStartDate] = useState<DateTimeValue>(new Date());
//       const [endDate, setEndDate] = useState<DateTimeValue>(new Date());
//       const [taskError, setTaskError] = useState(false);
//       const [categoryError, setCategoryError] = useState(false);
//   const [titleError, setTitleError] = useState(false);

//       const [createNote, { isLoading }] = useCreateNoteMutation();
//       const navigate = useNavigate();
     
    
//       const formatDate = (date: Date | null) => {
//         if (!date) return "";
//         const pad = (num: number) => String(num).padStart(2, "0");
//         return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
//       };

//       const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setNote({ ...note, [e.target.name]: e.target.value });
//         if (e.target.name === "title") setTitleError(false);
//       };
    

//       const handleTaskChange = (e: React.ChangeEvent<{ value: unknown }>) => {
//       setNote({ ...note, task: e.target.value as string });
//       setTaskError(false);
//     };
    
//       const handleSubmit = async () => {

//         if (!note.title.trim()) {
//       setTitleError(true);
//       return;
//     }
//         if (!note.task){
//           setTaskError(true);
//         //   alert("Please select a Task Action!");
//           return;
//         }
//         if(!note.category){
//           setCategoryError(true);
//           return;
//         }
//         try {
//           const newNote = {
//             title: note.title,
//             category: note.category,
//             priority: note.priority,
//             assignee: note.assignee,
//             content: note.description, 
//             task: note.task, 
//             startDate: formatDate(startDate), 
//             endDate:formatDate(endDate),
//           };
//           console.log("Submitting Payload Data:", newNote);
//           await createNote(newNote).unwrap();
    
//           navigate("/note-form");
//         } catch (err: any) {
//           console.log(err);
//         }
//       };
      
//       const handleClear = () => {
//         setNote({
//           title: "",
//           description: "",
//           category: "",
//           priority: "",
//           assignee: "",
//           task:"",
//           startDate: "",
//           endDate: "",
//         });
//         setStartDate(new Date());
//         setEndDate(new Date());
//         setTaskError(false);
//         setTitleError(false);
//         setCategoryError(false);
//         // navigate("/note-form")
//         navigate(-1);
//           // onClick={() => navigate(-1)} 
//       };


//       const modernField = {
//   "& .MuiOutlinedInput-root": {
//     borderRadius: "14px",
//     bgcolor:"background.default",
//     transition: ".2s",

//     "& fieldset": {
//       borderColor: "#ececec",
//     },

//     "&:hover fieldset": {
//       borderColor: "#d5b8ea",
//     },

//     "&.Mui-focused fieldset": {
//       borderColor: "#973aa8",
//       borderWidth: "1px",
//     },
//   },

//   "& .MuiInputLabel-root": {
//     color: "text.primary",
//   },

//   "& .MuiInputLabel-root.Mui-focused": {
//     color: "#973aa8",
//   },
// };
    
      
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         minHeight:{xs:"auto",sm:"100vh"},
//         width: "100%",
//         bgcolor:"background.default" 
        
//       }}
//     >
//       {/* Notion Modern Card Layout */}
//       <Paper
//         elevation={0}
//         sx={{
//           width: "100%",
//           maxWidth: 960,
//           height:"auto",
//           p:3,
//           // p:1.5,
//           // px:2,
//           // py:1.5,
//           borderRadius: "20px",
//           bgcolor: "background.default",
//           color:"text.primary",
//           border: "1px solid #eef1f6",
//           boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.02)", 
//         }}
//       >
//         {/* Header Section */}
//         <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2}}>
//           <Box
//     sx={{
//         width:44,
//         height:44,
//         borderRadius:"14px",
//         bgcolor:"background.default",
//         display:"flex",
//         alignItems:"center",
//         justifyContent:"center"
//     }}
// >
//     <EventNoteIcon
//         sx={{
//             color:"#973aa8",
//             fontSize:24
//         }}
//     />
// </Box>
//           <Box>
//             <Typography variant="h6" sx={{ fontSize:"16px", color: "text.primary", letterSpacing: "-0.5px" }}>
//               Project Note Details
//             </Typography>
//             <Typography variant="body2" sx={{ color: "text.primary", mt: 0.2 }}>
//               Enter organized project note details.
//             </Typography>
//           </Box>
//         </Stack>

//         {/* Form Fields Grid */}
//         <Grid  container spacing={3}>
          
//           {/* Note Title */}
//           <Grid size={{ xs: 10, sm: 6 }}>
//             <Stack spacing={2.5}>
//             <TextField
//               label="Note Title"
//               name="title"
//               fullWidth
//               required
//               placeholder="Enter project note title..."
//               value={note.title}
//               onChange={handleChange}
//               error={titleError}
//               helperText={titleError ? "Title is required" : ""}
//               sx={modernField}
//             />
//             <TextField
//               label="Description / Content"
//               name="description"
//               multiline
//               rows={4}
//               fullWidth
//               placeholder="Write your notes or project scope details here..."
//               value={note.description}
//               onChange={handleChange}
//               sx={modernField}
//             />
//             </Stack>
//           </Grid>

//           {/* Category */}
//           <Grid size={{ xs: 12, sm: 6 }}>
//             <Stack spacing={2.2}>
//             <TextField
//              select
//               label="Category"
//               name="category"
//               fullWidth
//              required
//               value={note.category}
//               error={categoryError}
//               helperText={categoryError ? "Please select a category":""}
//               onChange={handleChange}
//               sx={modernField}
//             >
//                 <MenuItem value="My Note">
//                   <TaskIcon sx={{ color: "#dec9e9",mr:1 }} />
//                   My Note
//                 </MenuItem>
//                 <MenuItem value="Company Note">
//                   <WorkIcon sx={{ color: "#dec9e9", mr:1 }} />
//                   Company Note
//                 </MenuItem>
//                 <MenuItem value="Study">
//                   <SchoolIcon sx={{ color: "#dec9e9",mr:1 }} />
//                   Study
//                 </MenuItem>
//                 <MenuItem value="Family & Friends">
//                   <FavoriteIcon sx={{ color: "#dec9e9" , mr:1 }} />
//                   Family & Friends
//                 </MenuItem>
//                 <MenuItem value="Fitness & Health">
//                   <FitnessCenterIcon sx={{ color: "#dec9e9" ,mr:1}} />
//                   Fitness & Health
//                 </MenuItem>
//             </TextField>
       

//           {/* Status Dropdown (task) */}
//           <Grid container spacing={2}>
//           <Grid size={{ xs:6 }}>

//             <TextField
//               select
//               label="Status / Action"
//               name="task"
//               fullWidth
//               required
//               value={note.task}
//               onChange={handleTaskChange}
//               error={taskError}
//               helperText={taskError ? "Please select a status action" : ""}
//               sx={modernField}
//             >
//               <MenuItem value="Todo">Todo</MenuItem>
//               <MenuItem value="In Progress">In Progress</MenuItem>
//               <MenuItem value="Complete">Complete</MenuItem>
//               <MenuItem value="Done">Done</MenuItem>
//             </TextField>
//           </Grid>

//           {/* Priority Dropdown */}
//           <Grid size={{ xs:6}}>
            
//             <TextField
//               select
//               label="Priority"
//               name="priority"
//               fullWidth
//               required
//               value={note.priority}
//               onChange={handleChange}
//               sx={modernField}
//             >
//               <MenuItem value="Low">Low</MenuItem>
//               <MenuItem value="Medium">Medium</MenuItem>
//               <MenuItem value="High">High</MenuItem>
//             </TextField>
//           </Grid>
//           </Grid>

//           {/* Assignee */}
       
            
//             <TextField
//               label="Assignee"
//               name="assignee"
//               required
//               fullWidth
//               placeholder="Name or Email"
//               value={note.assignee}
//               onChange={handleChange}
//               sx={modernField}
              
//             />
               
          
//  </Stack>
//           </Grid>
//          {/* date format  */}
//          <Grid container spacing={2} sx={{gap:3,display:'flex',justifyContent:'space-between'}}>
       
   
//             <Box>
//               <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1, color: "text.primary", fontWeight: 600, pl: 0.5 ,fontSize:13}}>
//                 <DateRangeIcon sx={{ fontSize: 15, color: "text.secondary" }} /> Start Date & Time
//               </Typography>
//               <Box className="custom-picker-wrapper" sx={{ width: "100%",color:"text.primary" }}>
//                 <DateTimePicker
//                   onChange={(val) => setStartDate(val as DateTimeValue)}
//                   value={startDate}
//                   format="y-MM-dd h:mm a"
//                   clearIcon={null}
//                   required
                
//                 />
//               </Box>
//             </Box>
       
     

//           {/* End Date & Time */}

//             <Box>
//               <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1, color: "text.primary", fontWeight: 600, pl: 0.5 ,fontSize:13}}>
//                 <DateRangeIcon sx={{ fontSize: 15, color: "text.primary" }} /> End Date & Time
//               </Typography>
//               <Box className="custom-picker-wrapper" sx={{ width: "100%",color:"text.primary" }}>
//                 <DateTimePicker
//                   onChange={(val) => setEndDate(val as DateTimeValue)}
//                   value={endDate}
//                   format="y-MM-dd h:mm a"
//                   clearIcon={null}
//                   required
//                 />
//               </Box>
//             </Box>


//             </Grid>
           

//           {/* Action Buttons */}
//           <Grid size={{ xs: 12 }} sx={{ mt: 2}}>
//             <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "center",alignItems:"center" }}>
//               <Button
//                 variant="text"
//                 onClick={handleClear}
//                 sx={{
//                   borderRadius: "10px",
//                   px: 4,
//                   py: 1.3,
//                   textTransform: "none",
//                   fontSize: "15px",
//                   color: "text.primary",
//                   fontWeight: 600,
//                   "&:hover": { bgcolor: "#dec9e9" ,color:"#121212"}
//                 }}
//               >
//                 Clear Form
//               </Button>
//               <Button
//                 variant="contained"
//                 disableElevation
//                 onClick={handleSubmit}
//                 disabled={isLoading}
//                 sx={{
//                   borderRadius: "10px",
//                   px: 5,
//                   py: 1.3,
//                   textTransform: "none",
//                   fontSize: "15px",
//                   bgcolor: "#dec9e9", // Modern Royal Indigo Color
//                   color: "#121212",
//                   fontWeight: 600,
//                   "&:hover": { bgcolor: "#973aa8",color:"#ffff" },
//                 }}
//               >
//                 {isLoading ? "Saving..." : "Save Note"}
//               </Button>
//             </Stack>
//           </Grid>

//         </Grid>
//       </Paper>
//     </Box>
//   )
// }

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
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Lock as LockIcon,
  Public as PublicIcon,
  Clear as ClearIcon,
  People as PeopleIcon,
  SupervisorAccount as OwnerIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCreateProjectMutation } from '../../services/projectApi';

export const NewProjectLayout = () => {
  const navigate = useNavigate();
  const [createProject, { isLoading, error }] = useCreateProjectMutation();

  let currentUserEmail = 'You (signed-in account)';
  try {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser?.email) currentUserEmail = storedUser.email;
  } catch {
    // keep fallback label
  }

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: true,
    members: '',
  });

  // Field-level errors
  const [fieldErrors, setFieldErrors] = useState<{ name?: string }>({});

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error on change
    if (name === 'name') {
      setFieldErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleClearField = (field: keyof typeof formData) => {
    setFormData((prev) => ({ ...prev, [field]: '' }));
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

    // Backend assigns the authenticated user as the single owner
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      isPrivate: formData.isPrivate,
      members: formData.members.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      await createProject(payload).unwrap();
      navigate('/my-project');
    } catch (err) {
      console.error('Creation failed', err);
    }
  };

  // Preview URL
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
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <GitHubIcon color="primary" sx={{ fontSize: 28 }} />
          <Typography variant="h5" fontWeight={700}>
            Create a new project
          </Typography>
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

          {/* URL Preview */}
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

          {/* Members + read-only owner */}
          <Stack spacing={2}>
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
            <TextField
              label="Members (comma separated)"
              name="members"
              value={formData.members}
              onChange={handleChange}
              placeholder="teammate@email.com"
              helperText="Optional: invite members by email"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PeopleIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Stack>

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
              onClick={() => navigate('/my-project')}
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
