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


// import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Chip, Avatar, Stack, CircularProgress, IconButton, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetProjectsQuery, useDeleteProjectMutation, useUpdateProjectMutation, } from '../services/projectApi';
import { Folder, Lock, Public, People, Delete, Edit } from '@mui/icons-material';

export const MyProjectPages = () => {
  const navigate = useNavigate();
  const { data: projects, isLoading, isError } = useGetProjectsQuery();
  const [deleteProject] = useDeleteProjectMutation();

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  if (isError) return <Alert severity="error" sx={{ mt: 5 }}>Failed to load projects</Alert>;

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteProject(id).unwrap();
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" >My Projects</Typography>
        <Button variant="contained" onClick={() => navigate('/my-project/new-project')} sx={{ textTransform: 'none', borderRadius: 2 }}>
          + New Project
        </Button>
      </Box>

      <Grid container spacing={3}>
        {projects?.map((project) => (
          <Grid  size={{xs:12,md:4}} key={project._id}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.1)' } }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Folder color="primary" />
                  <Typography variant="h6" noWrap>{project.name}</Typography>
                  <Chip size="small" icon={project.isPrivate ? <Lock fontSize="small" /> : <Public fontSize="small" />} label={project.isPrivate ? 'Private' : 'Public'} variant="outlined" />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 40, overflow: 'hidden' }}>
                  {project.description || 'No description'}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                  <People fontSize="small" color="action" />
                  <Typography variant="caption">Members: {project.members?.length || 0}</Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                  Owner: {project.ownerEmail || 'Unknown'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                  {project.members?.slice(0, 3).map((m, i) => <Avatar key={i} sx={{ width: 24, height: 24, fontSize: 10 }}>{m[0]}</Avatar>)}
                  {(project.members?.length || 0) > 3 && <Avatar sx={{ width: 24, height: 24, fontSize: 10 }}>+{project.members!.length - 3}</Avatar>}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" variant="contained" sx={{ textTransform: 'none', flex: 1 }} onClick={() => navigate(`/my-tasks?project=${project._id}`)}>
                    View Tasks
                  </Button>
                  <IconButton size="small" onClick={() => navigate(`/my-project/edit-project/${project._id}`)}><Edit fontSize="small" /></IconButton> 
                  {/* `/my-project/edit/${project._id}` */}
                  <IconButton size="small" color="error" onClick={() => handleDelete(project._id, project.name)}><Delete fontSize="small" /></IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
