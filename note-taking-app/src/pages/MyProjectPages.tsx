// import React,{ useState } from 'react';
// import { Box, Button, Stack, Typography, IconButton, TextField, Tabs, Tab ,Menu,MenuItem,CircularProgress} from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { SwapVertOutlined, Search } from "@mui/icons-material";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import { BoardStatus } from '../components/myproject/BoardStatus';
// import { AllProject } from '../components/myproject/AllProject';
// import { GranttView } from '../components/myproject/GranttView';
// import { MyProject } from '../components/myproject/MyProject';
// import { useGetNotesQuery } from "../services/noteApi";
// import type { Note } from "../types/Note";

// export const MyProjectPages = () => {
//  const navigate = useNavigate();
  
//       const [currentTab, setCurrentTab] = useState<number>(0);
//       const [searchOpen, setSearchOpen] = useState<boolean>(false);
//       const [searchText, setSearchText] = useState<string>("");
//         const { data: notes = [], isLoading, isError } = useGetNotesQuery(undefined); 
       

//         const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");

//       const [selectedStatus,setSelectedStatus] = useState<string>("All");

//       const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const menuOpen = Boolean(anchorEl);


//   const handleTabClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//    const filteredNotes = React.useMemo<Note[]>(() => {
//       if (!Array.isArray(notes)) return [];

      
  
//       return notes.filter((note: Note) => {
      
//         if (selectedStatus !== "All") {
//           const currentStatus = (note.task || note.category || "").trim().toLowerCase();
//           if (currentStatus !== selectedStatus.toLowerCase()) return false;
//         }
//         if (searchText.trim() !== "") {
//           const titleText = (note.title || "").toLowerCase();
//           const searchTarget = searchText.toLowerCase();
//           if (!titleText.includes(searchTarget)) return false;
//         }

//         return true;
//       })
//        .sort((a, b) => {
//         const titleA = (a.title || "").toLowerCase();
//         const titleB = (b.title || "").toLowerCase();
  
//         return sortOrder === "asc"
//           ? titleA.localeCompare(titleB)
//           : titleB.localeCompare(titleA);
//       });
  
//     }, [ notes,selectedStatus,  searchText,sortOrder]);

 
//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

 
//   const handleStatusSelect = (status: string) => {
//     setSelectedStatus(status);
//     setCurrentTab(0); 
//     handleMenuClose();
//   };


//   if (isLoading) {
//       return (
//         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
//           <CircularProgress />
//         </Box>
//       );
//     }
  
//     if (isError) {
//       return (
//         <Typography color="error" sx={{ textAlign: 'center', mt: 5 }}>
//           Unable to load projects.
//         </Typography>
//       );
//     }
//   return (
//   <Box>
//     <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',bgcolor:"background.defalut",color:"text.primary"}}>
      
//       {/* Header Section */}
//       <Box sx={{ mb: 1 }}>
//         <Typography variant="h3" sx={{ fontWeight: 500, color: 'text.primary', mb: 1, fontSize: '18px' }}>
//          Projects 
//         </Typography>
//         <Typography variant="body1" sx={{ color: 'text.primary', fontSize: '16px' }}>
//           Stay organized with projects, your way.
//         </Typography>
//       </Box>

//       {/* Navigation Toolbar */}
//       <Stack direction="row"  sx={{justifyContent:"space-between",alignItems:"center", mt: 3, mb: 2, borderBottom: '1px solid #ededed', pb: 0.5 }}>
//         <Tabs 
//           value={currentTab} 
//           onChange={(_, newValue) => 
//           {
//             if (newValue !== 0) {
//                 setCurrentTab(newValue);
//               }
//           }
//           }
//           sx={{
//             minHeight: 'auto',
//             '& .MuiTabs-indicator': { bgcolor:'background.default', height: '2px' },
//             '& .MuiTab-root': { 
//               textTransform: 'none', 
//               fontWeight: 500, 
//               fontSize: '0.9rem', 
//               minWidth: 'auto', 
//               padding: '6px 12px',
//               color: 'text.primary',
//               '&.Mui-selected': { color: 'text.primary' }
//             }
//           }}
//         >
//           <Tab label={
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, }}>
//                   By Status ({selectedStatus})
//                   <ArrowDropDownIcon sx={{ fontSize: 18 }} />
//                 </Box>
//               }
//               onClick={handleTabClick}/>
//           <Tab label="All Projects"  />
//           <Tab label = "My Projects" />

//         </Tabs>

//         <Menu
//             anchorEl={anchorEl}
//             open={menuOpen}
//             onClose={handleMenuClose}
//             disableScrollLock 
//             slotProps={{
//     paper: {
//       sx: {
//         mt: 1,
//         boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
//         borderRadius: "8px",
//         minWidth: 140,
//       },
//     },
//   }}
//           >
//             <MenuItem onClick={() => handleStatusSelect("All")} selected={selectedStatus === "All"}>All Status</MenuItem>
//             <MenuItem onClick={() => handleStatusSelect("Todo")} selected={selectedStatus === "Todo"}>Todo</MenuItem>
//             <MenuItem onClick={() => handleStatusSelect("In Progress")} selected={selectedStatus === "In Progress"}>In Progress</MenuItem>
//             <MenuItem onClick={() => handleStatusSelect("Complete")} selected={selectedStatus === "Complete"}>Complete</MenuItem>
//             <MenuItem onClick={() => handleStatusSelect("Not Started")} selected={selectedStatus === "Not Started"}>Done</MenuItem>
//           </Menu>

//         {/* Right side controls */}
//         <Stack direction="row" spacing={1} sx={{alignItems:"center",}}>

         
//           <IconButton size="small" onClick={() =>
//               setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
//             }
//            sx={{ color: sortOrder === 'desc' ? 'text.primary' : '#text.primary', 
//                           bgcolor: sortOrder === 'desc' ? 'background.default' : 'transparent',
//                           borderRadius: '4px',
//                           transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
//                           '& .MuiSvgIcon-root': {
//                             transition: 'transform 0.3s ease',
//                             transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)', 
//                           },
//                           '&:hover': {
//                             bgcolor: sortOrder === 'desc' ? 'background.default' : 'background.paper'
//                           }}}><SwapVertOutlined fontSize="small" /></IconButton>

//           <IconButton size="small" sx={{ color: 'text.primary' }} onClick={() => setSearchOpen((prev) => !prev)}>
//             <Search fontSize="small" />
//           </IconButton>
//           {searchOpen && (
//             <TextField
//               size="small"
//               autoFocus
//               placeholder="Search text"
//               value={searchText}
//               onChange={(event) => setSearchText(event.target.value)}
//               sx={{
//                 width: 180,
//                 '& .MuiOutlinedInput-root': {
//                   height: 30,
//                   fontSize: '0.85rem',
//                   bgcolor:'background.default',
//                   borderRadius: '4px',
//                 },
//                 '& .MuiOutlinedInput-input': {
//                   py: 0.5,
//                   px: 1,
//                 },
//               }}
//             />
//           )}
          
//           <Button 
//             variant="contained" 
//             disableElevation
//             sx={{ 
//               backgroundColor: '#dec9e9', 
//               textTransform: 'none', 
//               fontWeight: 500,
//               fontSize: '0.85rem',
//               padding: '4px 12px',
//               borderRadius: '4px',
//               '&:hover': { backgroundColor: '#973aa8',color:"white" }
//             }}
//           onClick={() => navigate('/my-project/new-project')} 
//           >
//             New
            
//               <KeyboardArrowDownIcon sx={{ fontSize:12,m:0.2}}/>
           
            
//           </Button>
//           </Stack>
//           </Stack>
//           {currentTab === 0 && <BoardStatus  statusFilter={selectedStatus}   filteredNotes={filteredNotes} />}

//         {currentTab === 1 && <AllProject filteredNotes={filteredNotes}/>
//           // <Box sx={{ py: 5 }}>
//           //   <Typography variant="h6">
//           //     By Status Page
//           //   </Typography>
//           // </Box>
          
//         }
//         {/* {currentTab ===2 && <GranttView filteredNotes={filteredNotes}/>} */}
//         {currentTab ===2 && <MyProject  filteredNotes={filteredNotes}/>}
//           </Box>
//   </Box>
//   )
// }



// import React, { useState } from 'react';
// import { Box, Button, Stack, Typography, IconButton, TextField, Tabs, Tab, Menu, MenuItem, CircularProgress } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { SwapVertOutlined, Search } from "@mui/icons-material";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import { BoardStatus } from '../components/myproject/BoardStatus';
// import { AllProject } from '../components/myproject/AllProject';
// // import { GranttView } from '../components/myproject/GranttView';
// import { MyProject } from '../components/myproject/MyProject';
// import { useGetNotesQuery } from "../services/noteApi";
// import type { Note } from "../types/Note";

// export const MyProjectPages = () => {
//   const navigate = useNavigate();

//   const [currentTab, setCurrentTab] = useState<number>(0);
//   const [searchOpen, setSearchOpen] = useState<boolean>(false);
//   const [searchText, setSearchText] = useState<string>("");
//   const { data: notes = [], isLoading, isError } = useGetNotesQuery(undefined);

//   const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
//   const [selectedStatus, setSelectedStatus] = useState<string>("All");
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const menuOpen = Boolean(anchorEl);

//   const handleTabClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   // 🔥 ဒီမှာ search box က status keyword ကို ဖမ်းဆီးပြီး filter လုပ်တယ်
//   const filteredNotes = React.useMemo<Note[]>(() => {
//     if (!Array.isArray(notes)) return [];

//     const statusKeywords = ["todo", "in progress", "complete", "not started"];
//     const searchLower = searchText.trim().toLowerCase();

//     // search box ထဲက စာသားက status keyword နဲ့ ကိုက်ညီရင် အဲဒီ status ကိုသုံးမယ်
//     let effectiveStatus = selectedStatus;
//     if (searchLower !== "") {
//       const matched = statusKeywords.find(keyword => keyword === searchLower);
//       if (matched) {
//         // status name ကို ပုံမှန် capitalize လုပ် (ဒေတာထဲမှာ "Todo", "In Progress" စသဖြင့် ရှိမယ်)
//         if (matched === "todo") effectiveStatus = "Todo";
//         else if (matched === "in progress") effectiveStatus = "In Progress";
//         else if (matched === "complete") effectiveStatus = "Complete";
//         else if (matched === "not started") effectiveStatus = "Not Started";
//       }
//     }

//     return notes
//       .filter((note: Note) => {
//         // status filter (case-insensitive)
//         if (effectiveStatus !== "All") {
//           const currentStatus = (note.task || note.category || "").trim().toLowerCase();
//           if (currentStatus !== effectiveStatus.toLowerCase()) return false;
//         }
     
//         return true;
//       })
//       .sort((a, b) => {
//         const titleA = (a.title || "").toLowerCase();
//         const titleB = (b.title || "").toLowerCase();
//         return sortOrder === "asc"
//           ? titleA.localeCompare(titleB)
//           : titleB.localeCompare(titleA);
//       });
//   }, [notes, selectedStatus, searchText, sortOrder]);

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleStatusSelect = (status: string) => {
//     setSelectedStatus(status);
//     setCurrentTab(0);
//     handleMenuClose();
//   };

//   if (isLoading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (isError) {
//     return (
//       <Typography color="error" sx={{ textAlign: 'center', mt: 5 }}>
//         Unable to load projects.
//       </Typography>
//     );
//   }

//   return (
//     <Box>
//       <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', bgcolor: "background.default", color: "text.primary" }}>
//         {/* Header Section */}
//         <Box sx={{ mb: 1 }}>
//           <Typography variant="h3" sx={{ fontWeight: 500, color: 'text.primary', mb: 1, fontSize: '18px' }}>
//             Projects
//           </Typography>
//           <Typography variant="body1" sx={{ color: 'text.primary', fontSize: '16px' }}>
//             Stay organized with projects, your way.
//           </Typography>
//         </Box>

//         {/* Navigation Toolbar */}
//         <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mt: 3, mb: 2, borderBottom: '1px solid #ededed', pb: 0.5 }}>
//           <Tabs
//             value={currentTab}
//             onChange={(_, newValue) => {
//               if (newValue !== 0) {
//                 setCurrentTab(newValue);
//               }
//             }}
//             sx={{
//               minHeight: 'auto',
//               '& .MuiTabs-indicator': { bgcolor: 'background.default', height: '2px' },
//               '& .MuiTab-root': {
//                 textTransform: 'none',
//                 fontWeight: 500,
//                 fontSize: '0.9rem',
//                 minWidth: 'auto',
//                 padding: '6px 12px',
//                 color: 'text.primary',
//                 '&.Mui-selected': { color: 'text.primary' }
//               }
//             }}
//           >
//             <Tab label={
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                 By Status ({selectedStatus})
//                 <ArrowDropDownIcon sx={{ fontSize: 18 }} />
//               </Box>
//             }
//               onClick={handleTabClick} />
//             <Tab label="All Projects" />
//             <Tab label="My Projects" />
//           </Tabs>

//           <Menu
//             anchorEl={anchorEl}
//             open={menuOpen}
//             onClose={handleMenuClose}
//             disableScrollLock
//             slotProps={{
//               paper: {
//                 sx: {
//                   mt: 1,
//                   boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
//                   borderRadius: "8px",
//                   minWidth: 140,
//                 },
//               },
//             }}
//           >
//             <MenuItem onClick={() => handleStatusSelect("All")} selected={selectedStatus === "All"}>All Status</MenuItem>
//             <MenuItem onClick={() => handleStatusSelect("Todo")} selected={selectedStatus === "Todo"}>Todo</MenuItem>
//             <MenuItem onClick={() => handleStatusSelect("In Progress")} selected={selectedStatus === "In Progress"}>In Progress</MenuItem>
//             <MenuItem onClick={() => handleStatusSelect("Complete")} selected={selectedStatus === "Complete"}>Complete</MenuItem>
//             <MenuItem onClick={() => handleStatusSelect("Not Started")} selected={selectedStatus === "Not Started"}>Not Started</MenuItem>
//           </Menu>

//           {/* Right side controls */}
//           <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
//             <IconButton
//               size="small"
//               onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
//               sx={{
//                 color: sortOrder === 'desc' ? 'text.primary' : 'text.primary',
//                 bgcolor: sortOrder === 'desc' ? 'background.default' : 'transparent',
//                 borderRadius: '4px',
//                 transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                 '& .MuiSvgIcon-root': {
//                   transition: 'transform 0.3s ease',
//                   transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)',
//                 },
//                 '&:hover': {
//                   bgcolor: sortOrder === 'desc' ? 'background.default' : 'background.paper'
//                 }
//               }}
//             >
//               <SwapVertOutlined fontSize="small" />
//             </IconButton>

//             <IconButton size="small" sx={{ color: 'text.primary' }} onClick={() => setSearchOpen((prev) => !prev)}>
//               <Search fontSize="small" />
//             </IconButton>

//             {searchOpen && (
//               <TextField
//                 size="small"
//                 autoFocus
//                 placeholder="Search by status"   // 🔥 placeholder ကို ပြောင်းထားတယ်
//                 value={searchText}
//                 onChange={(event) => setSearchText(event.target.value)}
//                 sx={{
//                   width: 180,
//                   '& .MuiOutlinedInput-root': {
//                     height: 30,
//                     fontSize: '0.85rem',
//                     bgcolor: 'background.default',
//                     borderRadius: '4px',
//                   },
//                   '& .MuiOutlinedInput-input': {
//                     py: 0.5,
//                     px: 1,
//                   },
//                 }}
//               />
//             )}

//             <Button
//               variant="contained"
//               disableElevation
//               sx={{
//                 backgroundColor: '#dec9e9',
//                 textTransform: 'none',
//                 fontWeight: 500,
//                 fontSize: '0.85rem',
//                 padding: '4px 12px',
//                 borderRadius: '4px',
//                 '&:hover': { backgroundColor: '#973aa8', color: "white" }
//               }}
//               onClick={() => navigate('/my-project/new-project')}
//             >
//               New
//               <KeyboardArrowDownIcon sx={{ fontSize: 12, m: 0.2 }} />
//             </Button>
//           </Stack>
//         </Stack>

//         {currentTab === 0 && <BoardStatus statusFilter={selectedStatus} filteredNotes={filteredNotes} />}
//         {currentTab === 1 && <AllProject filteredNotes={filteredNotes} />}
//         {/* {currentTab === 2 && <GranttView filteredNotes={filteredNotes} />} */}
//         {currentTab === 2 && <MyProject filteredNotes={filteredNotes} />}
//       </Box>
//     </Box>
//   );
// };


import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Stack,
  CircularProgress,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  InputAdornment,
  Tooltip,
  Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetProjectsQuery, useDeleteProjectMutation } from '../services/projectApi';
import { Folder, Lock, Public, People, Delete, Edit, Share, ContentCopy, Check } from '@mui/icons-material';
import type { Project } from '../types/Project';

export const MyProjectPages = () => {
  const navigate = useNavigate();
  const { data: projects, isLoading, isError } = useGetProjectsQuery();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null);
  const [projectToShare, setProjectToShare] = useState<Project | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 5 }}>
        Failed to load projects
      </Alert>
    );
  }

  const getShareLink = (projectId: string) =>
    `${window.location.origin}/my-project/edit-project/${projectId}`;

  const openDeleteDialog = (id: string, name: string) => {
    setProjectToDelete({ id, name });
  };

  const closeDeleteDialog = () => {
    if (!isDeleting) setProjectToDelete(null);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProject(projectToDelete.id).unwrap();
      setProjectToDelete(null);
    } catch (err) {
      console.error('Failed to delete project', err);
    }
  };

  const openShareDialog = (project: Project) => {
    setCopied(false);
    setCopyError(false);
    setProjectToShare(project);
  };

  const closeShareDialog = () => {
    setProjectToShare(null);
    setCopied(false);
  };

  const handleCopyLink = async () => {
    if (!projectToShare) return;
    const link = getShareLink(projectToShare._id);
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5">My Projects</Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/my-project/new-project')}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          + New Project
        </Button>
      </Box>

      <Grid container spacing={3}>
        {projects?.map((project) => (
          <Grid size={{ xs: 12, md: 4 }} key={project._id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.1)' },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  pt: 2,
                  pb: 0.5,
                }}
              >
                <Box
                  onClick={() => navigate(`/my-project/edit-project/${project._id}`)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    minWidth: 0,
                    flex: 1,
                    cursor: 'pointer',
                  }}
                >
                  <Folder color="primary" />
                  <Typography variant="h6" noWrap>
                    {project.name}
                  </Typography>
                  <Chip
                    size="small"
                    icon={project.isPrivate ? <Lock fontSize="small" /> : <Public fontSize="small" />}
                    label={project.isPrivate ? 'Private' : 'Public'}
                    variant="outlined"
                  />
                </Box>
                <Tooltip title="Share project">
                  <IconButton
                    size="small"
                    onClick={() => openShareDialog(project)}
                    sx={{ flexShrink: 0 }}
                  >
                    <Share fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              <CardActionArea
                onClick={() => navigate(`/my-project/edit-project/${project._id}`)}
                sx={{ flex: 1, alignItems: 'stretch' }}
              >
                <CardContent sx={{ pt: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, height: 40, overflow: 'hidden' }}
                  >
                    {project.description || 'No description'}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                    <People fontSize="small" color="action" />
                    <Typography variant="caption">
                      Members: {project.members?.length || 0}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mb: 1.5 }}
                  >
                    Owner: {project.ownerEmail || 'Unknown'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {project.members?.slice(0, 3).map((m, i) => (
                      <Avatar key={i} sx={{ width: 24, height: 24, fontSize: 10 }}>
                        {m[0]}
                      </Avatar>
                    ))}
                    {(project.members?.length || 0) > 3 && (
                      <Avatar sx={{ width: 24, height: 24, fontSize: 10 }}>
                        +{project.members!.length - 3}
                      </Avatar>
                    )}
                  </Box>
                </CardContent>
              </CardActionArea>
              <Box sx={{ display: 'flex', gap: 1, px: 2, pb: 2 }}>
                <Button
                  size="small"
                  variant="contained"
                  sx={{ textTransform: 'none', flex: 1 }}
                  onClick={() => navigate(`/my-tasks?project=${project._id}`)}
                >
                  View Tasks
                </Button>
                <IconButton
                  size="small"
                  onClick={() => navigate(`/my-project/edit-project/${project._id}`)}
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => openDeleteDialog(project._id, project.name)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Share dialog */}
      <Dialog
        open={Boolean(projectToShare)}
        onClose={closeShareDialog}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: { maxWidth: 320, borderRadius: 2 },
          },
        }}
      >
        <DialogTitle>Share “{projectToShare?.name}”</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {projectToShare?.isPrivate
              ? 'This project is private. Only the owner and members can open this link.'
              : 'This project is public. Anyone with the link can open it (if they are signed in).'}
          </DialogContentText>
          <TextField
            fullWidth
            size="small"
            label="Share link"
            value={projectToShare ? getShareLink(projectToShare._id) : ''}
            slotProps={{
              input: {
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title={copied ? 'Copied!' : 'Copy link'}>
                      <IconButton
                        edge="end"
                        onClick={handleCopyLink}
                        color={copied ? 'success' : 'default'}
                        aria-label="Copy link"
                      >
                        {copied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              },
            }}
          />
          {copyError && (
            <Alert severity="error" sx={{ mt: 1.5 }}>
              Could not copy. Please select the link and copy manually.
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={closeShareDialog}
            fullWidth
            variant="contained"
            disableElevation
            sx={{
              textTransform: 'none',
              bgcolor: 'grey.300',
              color: 'text.primary',
              '&:hover': { bgcolor: 'grey.400' },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete dialog */}
      <Dialog
        open={Boolean(projectToDelete)}
        onClose={closeDeleteDialog}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: { maxWidth: 360, borderRadius: 2 },
          },
        }}
      >
        <DialogTitle>Delete project permanently?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {projectToDelete
              ? `Are you sure you want to permanently delete "${projectToDelete.name}"? This action cannot be undone.`
              : ''}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={closeDeleteDialog}
            disabled={isDeleting}
            fullWidth
            variant="contained"
            disableElevation
            sx={{
              flex: 1,
              textTransform: 'none',
              bgcolor: 'grey.300',
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'grey.400',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            fullWidth
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : undefined}
            sx={{ flex: 1, textTransform: 'none' }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        message="Link copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};
