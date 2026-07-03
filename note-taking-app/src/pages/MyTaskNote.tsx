// import * as React from 'react';
// import { Box, Button, Stack, Typography, IconButton, TextField, Menu, MenuItem, CircularProgress } from "@mui/material";
// import { useNavigate, } from "react-router-dom";
// import { FilterList, Sort, AutoAwesome, Search, Tune } from "@mui/icons-material";
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import TaskAltIcon from '@mui/icons-material/TaskAlt';
// import CheckIcon from '@mui/icons-material/Check'
// import { useGetNotesQuery } from "../services/noteApi";
// import type {Note} from "../types/Note";

// export const MyTaskNote = () => {
//   const navigate = useNavigate();
  
//   const [searchOpen, setSearchOpen] = React.useState<boolean>(false);
//   const [searchText, setSearchText] = React.useState<string>("");
  
  

//   //filter states
//   const[selectedStatus, setSelectedStatus] = React.useState<string>("All");
//   const[selectedAssignee, setSelectedAssignee] = React.useState<string>("All");

//   const queryParams = React.useMemo(() => {
//     const p: { status?: string; assignee?: string } = {};
//     if (selectedStatus && selectedStatus !== 'All') p.status = selectedStatus;
//     if (selectedAssignee && selectedAssignee !== 'All') p.assignee = selectedAssignee;
//     return Object.keys(p).length ? p : undefined;
//   }, [selectedStatus, selectedAssignee]);

//   const { data: notes = [], isLoading, isError } = useGetNotesQuery(queryParams);

//   if(isLoading){
//     return (
//       <Box sx={{display:'flex', justifyContent:'center',mt:5}}>
//         <CircularProgress/>
//         </Box>
//     );
//   }
//   if(isError){
//     return(
//       <Typography color="error" sx={{textAlign:"center",mt:5}}>
//         Unable to load projects</Typography>
//     )
//   }

  

//   // Dropdown States
//   const [statusAnchor, setStatusAnchor] = React.useState<null | HTMLElement>(null);
//   const [assigneeAnchor, setAssigneeAnchor] = React.useState<null | HTMLElement>(null);

  

//   //assingee list

//   const uniqueAssignees = React.useMemo(() => {
//     if(!Array.isArray(notes)) return [];

//     const assignees = notes.map((note:Note) => note.assignee).filter((name):name is string => !!name);
//     return ["All",...Array.from(new Set(assignees))];
//   },[notes]);

//   //filtered status and assignee

//   const filteredNotes = React.useMemo(() => {
//     if(!Array.isArray(notes)) return [];

//     return notes.filter((note:Note)=>{
     

//       if(searchText && !note.title?.toLowerCase().includes(searchText.toLowerCase())) return false;

//       return true;
//     });
//   },[notes,searchText]);

//   // status summary with assignee breakdown


  

//   return (
//     <Box sx={{ width: "100%", minHeight: "100vh", backgroundColor: "#ffffff", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
//       <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 54px' }}>
        
//         {/* Title Section */}
//         <Typography variant="h3" sx={{ fontWeight: 700, color: '#37352f', fontSize: '40px', mb: 3, letterSpacing: '-0.5px' }}>
//           My Tasks
//         </Typography>

//         {/* Toolbar Controls (Filter, Sort, Search, New Task) */}
//         <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", borderBottom: '1px solid #ededed', pb: 1, mb: 2 }}>
          
//           {/* Left View Tab */}
//           <Stack direction="row" spacing={1} sx={{alignItems:"center"}}>
//             <Button
//               startIcon={<TaskAltIcon sx={{ fontSize: '16px' }} />}
//               sx={{
//                 textTransform: 'none',
//                 color: '#37352f',
//                 fontWeight: 600,
//                 fontSize: '14px',
//                 bgcolor: '#f1f1ef',
//                 borderRadius: '6px',
//                 px: 1.5,
//                 py: 0.5,
//                 '&:hover': { bgcolor: '#e3e2e0' }
//               }}
//             >
//               My Tasks
//             </Button>
//           </Stack>

//           {/* Right Toolbar Actions */}
//           <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
//             <IconButton size="small" sx={{ color: '#7c7b77', borderRadius: '4px' }}><FilterList fontSize="small" /></IconButton>
//             <IconButton size="small" sx={{ color: '#7c7b77', borderRadius: '4px' }}><Sort fontSize="small" /></IconButton>
//             <IconButton size="small" sx={{ color: '#7c7b77', borderRadius: '4px' }}><AutoAwesome fontSize="small" /></IconButton>
            
//             <IconButton size="small" sx={{ color: '#7c7b77', mr: searchOpen ? 1 : 0, borderRadius: '4px' }} onClick={() => setSearchOpen((prev) => !prev)}>
//               <Search fontSize="small" />
//             </IconButton>

//             {searchOpen && (
//               <TextField
//                 size="small"
//                 autoFocus
//                 placeholder="Search tasks..."
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 sx={{
//                   width: 160,
//                   mr: 1,
//                   '& .MuiOutlinedInput-root': {
//                     height: 28,
//                     fontSize: '13px',
//                     borderRadius: '4px',
//                     '& fieldset': { borderColor: '#ededed' },
//                     '&:hover fieldset': { borderColor: '#dfdfdf' },
//                     '&.Mui-focused fieldset': { borderColor: '#2383e2', borderWidth: '1px' },
//                   },
//                   '& .MuiOutlinedInput-input': { py: 0.5, px: 1 }
//                 }}
//               />
//             )}

//             <IconButton size="small" sx={{ color: '#7c7b77', borderRadius: '4px' }}><Tune fontSize="small" /></IconButton>

           
//             <Button 
//               variant="contained" 
//               disableElevation
//               onClick={() => navigate("/note-form/create")} 
//               sx={{ 
//                 backgroundColor: '#dec9e9', 
//                 textTransform: 'none', 
//                 fontWeight: 500,
//                 fontSize: '13px',
//                 padding: '4px 12px',
//                 borderRadius: '4px',
//                 '&:hover': { backgroundColor: '#973aa8',color:"#ffe5ec" },
//                 transition: '0.15s'
//               }}
//             >
//               New task
//             </Button>
//           </Stack>
//         </Stack>

       

//         {/* Inline Sub-Filters (Status, Assignee, + Filter) */}
//         <Stack direction="row" spacing={1.5} sx={{ mb: 4, alignItems: "center" }}>
          
//           {/* Status Dropdown */}
//           <Button
//             endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14 }} />}
//             onClick={(e) => setStatusAnchor(e.currentTarget)}
//             sx={{ textTransform: 'none', color: selectedStatus !== 'All' ? '#2383e2' : '#7c7b77',fontWeight: selectedStatus !== 'All' ? 600 : 400, fontSize: '14px', p: 0, '&:hover': { bgcolor: 'transparent' } }}
//           >
//             Status:{selectedStatus}
//           </Button>
//           <Menu anchorEl={statusAnchor} open={Boolean(statusAnchor)} onClose={() => setStatusAnchor(null)}>
//             {["All","Todo","In Progress","Completed","Done"].map((status) => (
//               <MenuItem
//                 key={status}
//                 onClick={() => {
//                   setSelectedStatus(status);
//                   setSelectedAssignee("All");
//                   setStatusAnchor(null);
//                 }}
//                 sx={{display:"flex",justifyContent:"space-between",gap:2,fonySize:'14px'}}
//               >
//                 {status} {selectedStatus === status && <CheckIcon sx={{fontSize:14,color:'#2383e2'}}/>}
//               </MenuItem>
//             ))}
//             {/* <MenuItem onClick={() => setStatusAnchor(null)}>To Do</MenuItem>
//             <MenuItem onClick={() => setStatusAnchor(null)}>Not Started</MenuItem>
//             <MenuItem onClick={() => setStatusAnchor(null)}>In Progress</MenuItem>
//             <MenuItem onClick={() => setStatusAnchor(null)}>Done</MenuItem> */}
//           </Menu>

//           {/* Assignee Dropdown */}
//           <Button
//             endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14 }} />}
//             // onClick={(e) => setAnchorEl(e.currentTarget)} // to open Assignee menu 
//             onClick={(e) => setAssigneeAnchor(e.currentTarget)}
//             sx={{ textTransform: 'none', color: selectedAssignee !== 'All' ? '#2383e2' : '#7c7b77',fontWeight: selectedAssignee !== 'All' ? 600 : 400, fontSize: '14px', p: 0, '&:hover': { bgcolor: 'transparent' } }}
//           >
//             Assignee:{selectedAssignee}
//           </Button>
//           <Menu anchorEl ={assigneeAnchor} open={Boolean(assigneeAnchor)} onClose={() => setAssigneeAnchor(null)}>
//             {uniqueAssignees.map((name) => (
//               <MenuItem key={name} onClick={() => {setSelectedAssignee(name);setAssigneeAnchor(null);}}
//                 sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, fontSize: '14px' }}>
//                 {name} {selectedAssignee === name && <CheckIcon sx={{fontSize:14,color:'#2383e2'}}/>}
//               </MenuItem>
//             ))}
//           </Menu>

//           {(selectedStatus !== "All" || selectedAssignee !== "All") && (
//             <Typography 
//               onClick={() => { setSelectedStatus("All"); setSelectedAssignee("All"); }}
//               sx={{ fontSize: '13px', color: '#2383e2', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
//             >
//               Clear filters
//             </Typography>
//           )}

//           {/* Add Filter Text */}
//           <Typography 
//             sx={{ fontSize: '14px', color: '#ccced1', cursor: 'pointer', '&:hover': { color: '#7c7b77' } }}
//             onClick={() => navigate("/note-form/create")}
//           >
//             + Filter
//           </Typography>
//         </Stack>

//         </Box>
//         </Box>

       
       
//   );
// };

// import * as React from 'react';
// import { Box, Button, Stack, Typography, IconButton, TextField, Menu, MenuItem, CircularProgress } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { FilterList, Sort, AutoAwesome, Search, Tune } from "@mui/icons-material";
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import TaskAltIcon from '@mui/icons-material/TaskAlt';
// import CheckIcon from '@mui/icons-material/Check';
// import { useGetNotesQuery } from "../services/noteApi";
// import type { Note } from "../types/Note";

// export const MyTaskNote = () => {
//   const navigate = useNavigate();
  
//   const [searchOpen, setSearchOpen] = React.useState<boolean>(false);
//   const [searchText, setSearchText] = React.useState<string>("");

//   // Filter states
//   const [selectedStatus, setSelectedStatus] = React.useState<string>("All");
//   const [selectedAssignee, setSelectedAssignee] = React.useState<string>("All");


//   const queryParams = React.useMemo(() => {
//     const p: { status?: string; assignee?: string } = {};
//     if (selectedStatus && selectedStatus !== 'All') p.status = selectedStatus;
//     if (selectedAssignee && selectedAssignee !== 'All') p.assignee = selectedAssignee;
//     return Object.keys(p).length ? p : undefined;
//   }, [selectedStatus, selectedAssignee]);

//   const { data: notes = [], isLoading, isError } = useGetNotesQuery(undefined); 

//   // Dropdown States
//   const [statusAnchor, setStatusAnchor] = React.useState<null | HTMLElement>(null);
//   const [assigneeAnchor, setAssigneeAnchor] = React.useState<null | HTMLElement>(null);


//   const uniqueAssignees = React.useMemo(() => {
//     if (!Array.isArray(notes)) return ["All"];
//     const assignees = notes.map((note: Note) => note.assignee).filter((name): name is string => !!name);
//     return ["All", ...Array.from(new Set(assignees))];
//   }, [notes]);

//   const filteredNotes = React.useMemo(() => {
//     if (!Array.isArray(notes)) return [];

//     return notes.filter((note: Note) => {
     
//       if (selectedStatus !== "All") {
       
//         const currentStatus = note.category || note.task; 
//         if (currentStatus?.toLowerCase() !== selectedStatus.toLowerCase()) return false;
//       }

//       // Assignee Filter
//       if (selectedAssignee !== "All") {
//         if (note.assignee?.toLowerCase() !== selectedAssignee.toLowerCase()) return false;
//       }

//       // Search Text Filter
//       if (searchText && !note.title?.toLowerCase().includes(searchText.toLowerCase())) {
//         return false;
//       }

//       return true;
//     });
//   }, [notes, selectedStatus, selectedAssignee, searchText]);

//   if (isLoading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (isError) {
//     return (
//       <Typography color="error" sx={{ textAlign: "center", mt: 5 }}>
//         Unable to load projects
//       </Typography>
//     );
//   }

//   return (
//     <Box sx={{ width: "100%", minHeight: "100vh", backgroundColor: "#ffffff", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
//       <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 54px' }}>
        
//         {/* Title Section */}
//         <Typography variant="h3" sx={{ fontWeight: 700, color: '#37352f', fontSize: '40px', mb: 3, letterSpacing: '-0.5px' }}>
//           My Tasks
//         </Typography>

//         {/* Toolbar Controls */}
//         <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", borderBottom: '1px solid #ededed', pb: 1, mb: 2 }}>
          
//           {/* Left View Tab */}
//           <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
//             <Button
//               startIcon={<TaskAltIcon sx={{ fontSize: '16px' }} />}
//               sx={{
//                 textTransform: 'none',
//                 color: '#37352f',
//                 fontWeight: 600,
//                 fontSize: '14px',
//                 bgcolor: '#f1f1ef',
//                 borderRadius: '6px',
//                 px: 1.5,
//                 py: 0.5,
//                 '&:hover': { bgcolor: '#e3e2e0' }
//               }}
//             >
//               My Tasks
//             </Button>
//           </Stack>

//           {/* Right Toolbar Actions */}
//           <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
//             <IconButton size="small" sx={{ color: '#7c7b77', borderRadius: '4px' }}><FilterList fontSize="small" /></IconButton>
//             <IconButton size="small" sx={{ color: '#7c7b77', borderRadius: '4px' }}><Sort fontSize="small" /></IconButton>
//             <IconButton size="small" sx={{ color: '#7c7b77', borderRadius: '4px' }}><AutoAwesome fontSize="small" /></IconButton>
            
//             <IconButton size="small" sx={{ color: '#7c7b77', mr: searchOpen ? 1 : 0, borderRadius: '4px' }} onClick={() => setSearchOpen((prev) => !prev)}>
//               <Search fontSize="small" />
//             </IconButton>

//             {searchOpen && (
//               <TextField
//                 size="small"
//                 autoFocus
//                 placeholder="Search tasks..."
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 sx={{
//                   width: 160,
//                   mr: 1,
//                   '& .MuiOutlinedInput-root': {
//                     height: 28,
//                     fontSize: '13px',
//                     borderRadius: '4px',
//                     '& fieldset': { borderColor: '#ededed' },
//                     '&:hover fieldset': { borderColor: '#dfdfdf' },
//                     '&.Mui-focused fieldset': { borderColor: '#2383e2', borderWidth: '1px' },
//                   },
//                   '& .MuiOutlinedInput-input': { py: 0.5, px: 1 }
//                 }}
//               />
//             )}

//             <IconButton size="small" sx={{ color: '#7c7b77', borderRadius: '4px' }}><Tune fontSize="small" /></IconButton>

//             <Button 
//               variant="contained" 
//               disableElevation
//               onClick={() => navigate("/note-form/create")} 
//               sx={{ 
//                 backgroundColor: '#dec9e9', 
//                 textTransform: 'none', 
//                 fontWeight: 500,
//                 fontSize: '13px',
//                 padding: '4px 12px',
//                 borderRadius: '4px',
//                 '&:hover': { backgroundColor: '#973aa8', color: "#ffe5ec" },
//                 transition: '0.15s'
//               }}
//             >
//               New task
//             </Button>
//           </Stack>
//         </Stack>

//         {/* Inline Sub-Filters */}
//         <Stack direction="row" spacing={1.5} sx={{ mb: 4, alignItems: "center" }}>
          
//           {/* Status Dropdown */}
//           <Button
//             endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14 }} />}
//             onClick={(e) => setStatusAnchor(e.currentTarget)}
//             sx={{ textTransform: 'none', color: selectedStatus !== 'All' ? '#2383e2' : '#7c7b77', fontWeight: selectedStatus !== 'All' ? 600 : 400, fontSize: '14px', p: 0, '&:hover': { bgcolor: 'transparent' } }}
//           >
//             Status: {selectedStatus}
//           </Button>
//           <Menu anchorEl={statusAnchor} open={Boolean(statusAnchor)} onClose={() => setStatusAnchor(null)}>
//             {["All", "Todo", "In Progress", "Completed", "Done"].map((status) => (
//               <MenuItem
//                 key={status}
//                 onClick={() => {
//                   setSelectedStatus(status); // Status ရွေးလိုက်တာနဲ့ state ပြောင်းမယ်
//                   setStatusAnchor(null);
//                 }}
//                 sx={{ display: "flex", justifyContent: "space-between", gap: 2, fontSize: '14px' }}
//               >
//                 {status} {selectedStatus === status && <CheckIcon sx={{ fontSize: 14, color: '#2383e2' }} />}
//               </MenuItem>
//             ))}
//           </Menu>

//           {/* Assignee Dropdown */}
//           <Button
//             endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14 }} />}
//             onClick={(e) => setAssigneeAnchor(e.currentTarget)}
//             sx={{ textTransform: 'none', color: selectedAssignee !== 'All' ? '#2383e2' : '#7c7b77', fontWeight: selectedAssignee !== 'All' ? 600 : 400, fontSize: '14px', p: 0, '&:hover': { bgcolor: 'transparent' } }}
//           >
//             Assignee: {selectedAssignee}
//           </Button>
//           <Menu anchorEl={assigneeAnchor} open={Boolean(assigneeAnchor)} onClose={() => setAssigneeAnchor(null)}>
//             {uniqueAssignees.map((name) => (
//               <MenuItem 
//                 key={name} 
//                 onClick={() => {
//                   setSelectedAssignee(name); // Assignee ရွေးလိုက်တာနဲ့ state ပြောင်းမယ်
//                   setAssigneeAnchor(null);
//                 }}
//                 sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, fontSize: '14px' }}
//               >
//                 {name} {selectedAssignee === name && <CheckIcon sx={{ fontSize: 14, color: '#2383e2' }} />}
//               </MenuItem>
//             ))}
//           </Menu>

//           {(selectedStatus !== "All" || selectedAssignee !== "All") && (
//             <Typography 
//               onClick={() => { setSelectedStatus("All"); setSelectedAssignee("All"); }}
//               sx={{ fontSize: '13px', color: '#2383e2', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
//             >
//               Clear filters
//             </Typography>
//           )}

//           <Typography 
//             sx={{ fontSize: '14px', color: '#ccced1', cursor: 'pointer', '&:hover': { color: '#7c7b77' } }}
//             onClick={() => navigate("/note-form/create")}
//           >
//             + Filter
//           </Typography>
//         </Stack>

      
//         <Box sx={{ mt: 2 }}>
//           {filteredNotes.length === 0 ? (
//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pt: 6, pb: 6 }}>
//               <Typography sx={{ color: '#9b9a97', fontSize: '14px' }}>
//                 No matching tasks found.
//               </Typography>
//             </Box>
//           ) : (
//             <Stack spacing={1.5}>
//               {filteredNotes.map((note: Note) => (
//                 <Box 
//                   key={note._id || note.id} 
//                   sx={{ 
//                     p: 2.5, 
//                     border: '1px solid #ededed', 
//                     borderRadius: '8px', 
//                     cursor: 'pointer',
//                     transition: '0.2s',
//                     '&:hover': { bgcolor: '#f7f7f5', borderColor: '#dfdfdf', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)' } 
//                   }}
//                   onClick={() => navigate(`/note-form/edit/${note._id || note.id}`)} 
//                 >
//                   <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#37352f', mb: 0.5 }}>
//                     {note.title || 'Untitled'}
//                   </Typography>
//                   <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
//                     <Typography variant="caption" sx={{ color: '#6b6a65', bgcolor: '#f1f1ef', px: 1, py: 0.2, borderRadius: '4px' }}>
//                       Assignee: {note.assignee || 'Unassigned'}
//                     </Typography>
//                     <Typography variant="caption" sx={{ color: '#6b6a65', bgcolor: '#eef6ff', px: 1, py: 0.2, borderRadius: '4px' }}>
//                       Status: {note.category|| note.task || 'Todo'}
//                     </Typography>
//                   </Stack>
//                 </Box>
//               ))}
//             </Stack>
//           )}
//         </Box>

//       </Box>
//     </Box>
//   );
// };


import * as React from 'react';
import { Box, Button, Stack, Typography, IconButton, TextField, Menu, MenuItem, CircularProgress, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import { FilterList, Sort, AutoAwesome, Search, Tune } from "@mui/icons-material";
import { Search,Tune ,SwapVertOutlined} from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CheckIcon from '@mui/icons-material/Check';
import { useGetNotesQuery } from "../services/noteApi";
import type { Note } from "../types/Note";

export const MyTaskNote = () => {
  const navigate = useNavigate();

  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  
  const [searchOpen, setSearchOpen] = React.useState<boolean>(false);
  const [searchText, setSearchText] = React.useState<string>("");

  // Filter states
  const [selectedStatus, setSelectedStatus] = React.useState<string>("All");
  const [selectedAssignee, setSelectedAssignee] = React.useState<string>("All");
  const [showSharedList, setShowSharedList] = React.useState<boolean>(false);
  const [collaborators, setCollaborators] = React.useState<Array<{ _id?: string; invitedEmail: string; status?: string; role?: string }>>([]);
  const [collabLoading, setCollabLoading] = React.useState<boolean>(false);

  
  const { data: notes = [], isLoading, isError } = useGetNotesQuery(undefined); 

  // Dropdown States
  const [statusAnchor, setStatusAnchor] = React.useState<null | HTMLElement>(null);
  const [assigneeAnchor, setAssigneeAnchor] = React.useState<null | HTMLElement>(null);


  const uniqueAssignees = React.useMemo(() => {
    if (!Array.isArray(notes)) return ["All"];
    const assignees = notes
      .map((note: Note) => note.assignee?.trim())
      .filter((name): name is string => !!name);
    return ["All", ...Array.from(new Set(assignees))];
  }, [notes]);

  
  const uniqueStatuses = React.useMemo(() => {
    if (!Array.isArray(notes)) return ["All"];
    const statuses = notes
      .map((note: Note) => (note.task || note.category || "").trim())
      .filter((status): status is string => !!status);
    return ["All", ...Array.from(new Set(statuses))];
  }, [notes]);


  const filteredNotes = React.useMemo(() => {
    if (!Array.isArray(notes)) return [];

    return notes.filter((note: Note) => {
    
      if (selectedStatus !== "All") {
        const currentStatus = (note.task || note.category || "").trim().toLowerCase();
        if (currentStatus !== selectedStatus.toLowerCase()) return false;
      }

     
      if (selectedAssignee !== "All") {
        const currentAssignee = (note.assignee || "").trim().toLowerCase();
        if (currentAssignee !== selectedAssignee.toLowerCase()) return false;
      }


      if (searchText && !note.title?.toLowerCase().includes(searchText.toLowerCase())) {
        return false;
      }

      return true;
    })
     .sort((a, b) => {
      const titleA = (a.title || "").toLowerCase();
      const titleB = (b.title || "").toLowerCase();

      return sortOrder === "asc"
        ? titleA.localeCompare(titleB)
        : titleB.localeCompare(titleA);
    });

  }, [notes, selectedStatus, selectedAssignee, searchText,sortOrder]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 5 }}>
        Unable to load projects
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", backgroundColor: "#ffffff", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 54px' }}>
        
        {/* Title Section */}
        <Typography variant="h6" sx={{ fontSize:"16px", color: '#37352f', mb: 3, letterSpacing: '-0.5px' }}>
          My Tasks
        </Typography>

        {/* Toolbar Controls */}
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", borderBottom: '1px solid #ededed', pb: 1, mb: 2 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Button
              startIcon={<TaskAltIcon sx={{ fontSize: '16px' }} />}
              sx={{
                textTransform: 'none',
                color: '#37352f',
                fontSize: '14px',
                bgcolor: '#f1f1ef',
                borderRadius: '6px',
                px: 1.5,
                py: 0.5,
                '&:hover': { bgcolor: '#e3e2e0' }
              }}
            >
              My Tasks
            </Button>
          </Stack>

          {/* Right Toolbar Actions */}
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            {/* <IconButton size="small" sx={{ color: '#7c7b77', borderRadius: '4px' }}><FilterList fontSize="small" /></IconButton>
            <IconButton size="small" sx={{ color: '#7c7b77', borderRadius: '4px' }}><Sort fontSize="small" /></IconButton>
            <IconButton size="small" sx={{ color: '#7c7b77', borderRadius: '4px' }}><AutoAwesome fontSize="small" /></IconButton> */}
            <IconButton size="small" onClick={() =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
  }
 sx={{ color: sortOrder === 'desc' ? '#2383e2' : '#7c7b77', 
                bgcolor: sortOrder === 'desc' ? '#edf6ff' : 'transparent',
                borderRadius: '4px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                '& .MuiSvgIcon-root': {
                  transition: 'transform 0.3s ease',
                  transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)', 
                },
                '&:hover': {
                  bgcolor: sortOrder === 'desc' ? '#e3f2fd' : '#f1f1ef'
                }}}><SwapVertOutlined fontSize="small" /></IconButton>

            
            <IconButton size="small" sx={{ color: '#7c7b77', mr: searchOpen ? 1 : 0, borderRadius: '4px' }} onClick={() => setSearchOpen((prev) => !prev)}>
              <Search fontSize="small" />
            </IconButton>

            {searchOpen && (
              <TextField
                size="small"
                autoFocus
                placeholder="Search tasks..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                sx={{
                  width: 160,
                  mr: 1,
                  '& .MuiOutlinedInput-root': {
                    height: 28,
                    fontSize: '13px',
                    borderRadius: '4px',
                    '& fieldset': { borderColor: '#ededed' },
                    '&:hover fieldset': { borderColor: '#dfdfdf' },
                    '&.Mui-focused fieldset': { borderColor: '#2383e2', borderWidth: '1px' },
                  },
                  '& .MuiOutlinedInput-input': { py: 0.5, px: 1 }
                }}
              />
            )}

            <IconButton size="small" sx={{ color: '#7c7b77', borderRadius: '4px' }}><Tune fontSize="small" /></IconButton>

            <Button 
              variant="contained" 
              disableElevation
              onClick={() => navigate("/note-form/create")} 
              sx={{ 
                backgroundColor: '#dec9e9', 
                textTransform: 'none', 
                fontWeight: 500,
                fontSize: '13px',
                padding: '4px 12px',
                borderRadius: '4px',
                '&:hover': { backgroundColor: '#973aa8', color: "#ffffff" },
                transition: '0.15s'
              }}
            >
              New task
            </Button>
          </Stack>
        </Stack>

        {/* Inline Sub-Filters */}
        <Stack direction="row" spacing={1.5} sx={{ mb: 4, alignItems: "center" }}>
          
          {/* Dynamic Status Dropdown Menu */}
          <Button
            endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14 }} />}
            onClick={(e) => setStatusAnchor(e.currentTarget)}
            sx={{ textTransform: 'none', color: selectedStatus !== 'All' ? '#2383e2' : '#7c7b77', fontWeight: selectedStatus !== 'All' ? 600 : 400, fontSize: '14px', p: 0, '&:hover': { bgcolor: 'transparent' } }}
          >
            Status: {selectedStatus}
          </Button>
          <Menu anchorEl={statusAnchor} open={Boolean(statusAnchor)} onClose={() => setStatusAnchor(null)}>
            {uniqueStatuses.map((status) => (
              <MenuItem
                key={status}
                onClick={() => {
                  setSelectedStatus(status); 
                  setStatusAnchor(null);
                }}
                sx={{ display: "flex", justifyContent: "space-between", gap: 2, fontSize: '14px' }}
              >
                {status} {selectedStatus.toLowerCase() === status.toLowerCase() && <CheckIcon sx={{ fontSize: 14, color: '#2383e2' }} />}
              </MenuItem>
            ))}
          </Menu>

          {/* Dynamic Assignee Dropdown Menu */}
          <Button
            endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14 }} />}
            onClick={(e) => setAssigneeAnchor(e.currentTarget)}
            sx={{ textTransform: 'none', color: selectedAssignee !== 'All' ? '#2383e2' : '#7c7b77', fontWeight: selectedAssignee !== 'All' ? 600 : 400, fontSize: '14px', p: 0, '&:hover': { bgcolor: 'transparent' } }}
          >
            Assignee: {selectedAssignee}
          </Button>
          <Menu anchorEl={assigneeAnchor} open={Boolean(assigneeAnchor)} onClose={() => setAssigneeAnchor(null)}>
            {uniqueAssignees.map((name) => (
              <MenuItem 
                key={name} 
                onClick={() => {
                  setSelectedAssignee(name); 
                  setAssigneeAnchor(null);
                }}
                sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, fontSize: '14px' }}
              >
                {name} {selectedAssignee.toLowerCase() === name.toLowerCase() && <CheckIcon sx={{ fontSize: 14, color: '#2383e2' }} />}
              </MenuItem>
            ))}
          </Menu>

          {(selectedStatus !== "All" || selectedAssignee !== "All") && (
            <Typography 
              onClick={() => { setSelectedStatus("All"); setSelectedAssignee("All"); }}
              sx={{ fontSize: '13px', color: '#2383e2', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              Clear filters
            </Typography>
          )}

          <Button
          
            sx={{
            textTransform: "none",
            color: "#585755",
            bgcolor: "f4f6f8",
            gap: 0.5,
            px: 1,
            mr: 2,
            borderRadius:2,
            border:"none",
            "&:hover": {
              bgcolor: "#e6e4e4",
              
            },}}
            onClick={async () => {
              // toggle and fetch collaborators when opening
              const next = !showSharedList;
              setShowSharedList(next);
              if (next && collaborators.length === 0) {
                setCollabLoading(true);
                try {
                  const token = localStorage.getItem("token");
                  if (!token) throw new Error("Not authenticated");
                  const res = await fetch("http://localhost:5000/api/share/collaborators", {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  if (res.ok) {
                    const data = await res.json().catch(() => ({}));
                    const invites: any[] = data.collaborators || [];

                    // Try to enrich with user profile when userId is present
                    const enriched = await Promise.all(invites.map(async (inv) => {
                      try {
                        if (inv.userId) {
                          const r = await fetch(`http://localhost:5000/api/auth/${inv.userId}`, {
                            headers: { Authorization: `Bearer ${token}` },
                          });
                          if (r.ok) {
                            const u = await r.json().catch(() => (null));
                            if (u && (u.firstName || u.lastName)) {
                              return { ...inv, fullName: `${u.firstName || ""}${u.lastName ? ` ${u.lastName}` : ""}`.trim() };
                            }
                          }
                        }
                      } catch (e) {
                        // ignore
                      }

                      // fallback: derive name from email
                      const email = inv.invitedEmail || "";
                      const username = email.includes('@') ? email.split('@')[0] : email;
                      const pretty = username.split(/[._\-]/).map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
                      return { ...inv, fullName: pretty };
                    }));

                    setCollaborators(enriched);
                  } else {
                    setCollaborators([]);
                  }
                } catch (err) {
                  setCollaborators([]);
                } finally {
                  setCollabLoading(false);
                }
              }
            }}
          >
            <PeopleOutlinedIcon/>
            Shared
          </Button>
          
          {/* Collaborators cards shown inline below the Shared button when toggled */}
          {showSharedList && (
            <Box sx={{ mt: 2, mb: 2 }}>
              {collabLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={20} />
                </Box>
              ) : collaborators.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No collaborators yet.</Typography>
              ) : (
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                  {collaborators.map((c) => {
                    const email = c.invitedEmail || '';
                    const displayName = (c as any).fullName || (email.includes('@') ? email.split('@')[0] : email);
                    const initial = (displayName && displayName.charAt(0)) ? displayName.charAt(0).toUpperCase() : '';
                    return (
                      <Box key={c._id || email} sx={{ p: 1, border: '1px solid #eee', borderRadius: 2, minWidth: 200, display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: '#e8f3ff', color: '#1a6cb3' }}>{initial}</Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{displayName}</Typography>
                          <Typography variant="caption" color="text.secondary">{email}</Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </Box>
          )}
        </Stack>

        {/* Task List Display Section */}
        <Box sx={{ mt: 2 }}>
          {filteredNotes.length === 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pt: 6, pb: 6 }}>
              <Typography sx={{ color: '#9b9a97', fontSize: '14px' }}>
                No matching tasks found.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {filteredNotes.map((note: Note) => (
                <Box 
                  key={note._id || note.id} 
                  sx={{ 
                    p: 2.5, 
                    border: '1px solid #ededed', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    transition: '0.2s',
                    '&:hover': { bgcolor: '#f7f7f5', borderColor: '#dfdfdf', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)' } 
                  }}
                  // onClick={() => navigate(`/note-form/edit/${note._id || note.id}`)}
                  onClick={() => navigate(`/note-form/detail/${note._id || note.id}`) } 
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#37352f', mb: 0.5 }}>
                    {note.title || 'Untitled'}
                  </Typography>
                  <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#6b6a65', bgcolor: '#f1f1ef', px: 1, py: 0.2, borderRadius: '4px' }}>
                      Assignee: {note.assignee || 'Unassigned'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6b6a65', bgcolor: '#eef6ff', px: 1, py: 0.2, borderRadius: '4px' }}>
                      Status: {note.task || note.category || 'Todo'}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Box>

      </Box>
    </Box>
  );
};