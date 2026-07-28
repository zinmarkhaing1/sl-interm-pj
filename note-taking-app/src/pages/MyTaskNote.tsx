

// // import * as React from 'react';
// // import { Box, Button, Stack, Typography, IconButton, TextField, Menu, MenuItem, CircularProgress, } from "@mui/material";
// // import { useNavigate, useLocation } from "react-router-dom";
// // import { Search, SwapVertOutlined } from '@mui/icons-material';
// // import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// // import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
// // import TaskAltIcon from '@mui/icons-material/TaskAlt';
// // import CheckIcon from '@mui/icons-material/Check';
// // import { useGetNotesQuery } from "../services/noteApi";
// // import type { Note } from "../types/Note"; 
// // import { TaskNotesStatus } from '../components/status-page/TaskNotesStatus';
// // import { AssigneeTaskNotes } from '../components/status-page/AssigneeTaskNotes';
// // import { SharedTaskPage } from '../components/status-page/SharedTaskPage';

// // export const MyTaskNote = () => {
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  
// //   const [searchOpen, setSearchOpen] = React.useState<boolean>(false);
// //   const [searchText, setSearchText] = React.useState<string>("");

// //   const getInitialView = () => {
// //     if (location.search.includes("view=shared")) return "shared" as const;
// //     if (localStorage.getItem("sharedNotesRequested") === "true") return "shared" as const;
// //     return "all" as const;
// //   };

// //   const [activeView, setActiveView] = React.useState<"all" | "assignee" | "shared">(getInitialView());

// //   React.useEffect(() => {
// //     if (location.search.includes("view=shared")) {
// //       setActiveView("shared");
// //       localStorage.setItem("sharedNotesRequested", "true");
// //     }
// //   }, [location.search]);

// //   // Filter states
// //   const [selectedStatus, setSelectedStatus] = React.useState<string>("All");
// //   const [selectedAssignee, setSelectedAssignee] = React.useState<string>("All");


// //   const { data: notes = [], isLoading, isError } = useGetNotesQuery(undefined); 

// //   // Dropdown States
// //   const [statusAnchor, setStatusAnchor] = React.useState<null | HTMLElement>(null);
// //   const [assigneeAnchor, setAssigneeAnchor] = React.useState<null | HTMLElement>(null);

// //   const uniqueAssignees = React.useMemo(() => {
// //     if (!Array.isArray(notes)) return ["All"];
// //     const assignees = notes
// //       .map((note: Note) => note.assignee?.trim())
// //       .filter((name): name is string => !!name);
// //     return ["All", ...Array.from(new Set(assignees))];
// //   }, [notes]);

// //   const uniqueStatuses = React.useMemo(() => {
// //     if (!Array.isArray(notes)) return ["All"];
// //     const statuses = notes
// //       .map((note: Note) => (note.task || note.category || "").trim())
// //       .filter((status): status is string => !!status);
// //     return ["All", ...Array.from(new Set(statuses))];
// //   }, [notes]);

// //   const filteredNotes = React.useMemo(() => {
// //     if (!Array.isArray(notes)) return [];

// //     return notes.filter((note: Note) => {

// //      if (activeView !== "assignee" && selectedStatus !== "All") {
// //         const currentStatus = (note.task || note.category || "").trim().toLowerCase();
// //         if (currentStatus !== selectedStatus.toLowerCase()) return false;
// //       }

// //       if (selectedAssignee !== "All") {
// //         const currentAssignee = (note.assignee || "").trim().toLowerCase();
// //         if (currentAssignee !== selectedAssignee.toLowerCase()) return false;
// //       }

// //       if (searchText && !note.title?.toLowerCase().includes(searchText.toLowerCase())) {
// //         return false;
// //       }

// //       return true;
// //     })
// //     .sort((a, b) => {
// //       const titleA = (a.title || "").toLowerCase();
// //       const titleB = (b.title || "").toLowerCase();

// //       return sortOrder === "asc"
// //         ? titleA.localeCompare(titleB)
// //         : titleB.localeCompare(titleA);
// //     });
// //   }, [notes, selectedStatus, selectedAssignee, searchText, sortOrder]);

// //   if (isLoading) {
// //     return (
// //       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
// //         <CircularProgress />
// //       </Box>
// //     );
// //   }

// //   if (isError) {
// //     return (
// //       <Typography color="error" sx={{ textAlign: "center", mt: 5 }}>
// //         Unable to load projects
// //       </Typography>
// //     );
// //   }

// //   return (
// //     <Box sx={{ width: "100%", minHeight: "100vh", bgcolor:"background.default", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
// //       <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 54px' }}>
        
// //         {/* Title Section */}
// //         <Typography variant="h6" sx={{ fontSize:"16px", color: 'text.primary', mb: 3, letterSpacing: '-0.5px' }}>
// //           My Tasks
// //         </Typography>

// //         {/* Toolbar Controls */}
// //         <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", borderBottom: '1px solid #ededed', pb: 1, mb: 2 }}>
// //           <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
// //             <Button
// //               startIcon={<TaskAltIcon sx={{ fontSize: '16px' }} />}
// //               onClick={() => 
// //                 setActiveView("all")
// //              }
// //               sx={{
// //                 textTransform: 'none',
// //                 color: '#37352f',
// //                 fontSize: '14px',
// //                 bgcolor: '#f1f1ef',
// //                 borderRadius: '6px',
// //                 px: 1.5,
// //                 py: 0.5,
// //                 '&:hover': { bgcolor: '#e3e2e0' }
// //               }}
// //             >
// //               My Tasks
// //             </Button>
// //           </Stack>

// //           {/* Right Toolbar Actions */}
// //           <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
// //             <IconButton size="small" onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
// //               sx={{ color: sortOrder === 'desc' ? '#973aa8' : 'text.primary', 
// //                 bgcolor: sortOrder === 'desc' ? 'background.default' : 'transparent',
// //                 borderRadius: '4px',
// //                 transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
// //                 '& .MuiSvgIcon-root': {
// //                   transition: 'transform 0.3s ease',
// //                   transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)', 
// //                 },
// //                 '&:hover': {
// //                   bgcolor: sortOrder === 'desc' ? '#e3f2fd' : '#f1f1ef'
// //                 }}}>
// //               <SwapVertOutlined fontSize="small" />
// //             </IconButton>
            
// //             <IconButton size="small" sx={{ color: 'text.primary', mr: searchOpen ? 1 : 0, borderRadius: '4px' }} onClick={() => setSearchOpen((prev) => !prev)}>
// //               <Search fontSize="small" />
// //             </IconButton>

// //             {searchOpen && (
// //               <TextField
// //                 size="small"
// //                 autoFocus
// //                 placeholder="Search tasks..."
// //                 value={searchText}
// //                 onChange={(e) => setSearchText(e.target.value)}
// //                 sx={{
// //                   width: 160,
// //                   mr: 1,
// //                   '& .MuiOutlinedInput-root': {
// //                     height: 28,
// //                     fontSize: '13px',
// //                     borderRadius: '4px',
// //                     '& fieldset': { borderColor: '#ededed' },
// //                     '&:hover fieldset': { borderColor: '#dfdfdf' },
// //                     '&.Mui-focused fieldset': { borderColor: '#973aa8', borderWidth: '1px' },
// //                   },
// //                   '& .MuiOutlinedInput-input': { py: 0.5, px: 1 }
// //                 }}
// //               />
// //             )}

          

// //             <Button 
// //               variant="contained" 
// //               disableElevation
// //               onClick={() => navigate("/note-form/create")} 
// //               sx={{ 
// //                 backgroundColor: '#dec9e9', 
// //                 textTransform: 'none', 
// //                 fontWeight: 500,
// //                 fontSize: '13px',
// //                 padding: '4px 12px',
// //                 borderRadius: '4px',
// //                 '&:hover': { backgroundColor: '#973aa8', color: "#ffffff" },
// //                 transition: '0.15s'
// //               }}
// //             >
// //               New task
// //             </Button>
// //           </Stack>
// //         </Stack>

// //         {/* Inline Sub-Filters */}
// //         <Stack direction="row" spacing={1.5} sx={{ mb: 4, alignItems: "center" }}>
          
// //           {/* Dynamic Status Dropdown Menu */}
// //           <Button
// //             endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14 }} />}
// //             onClick={(e) => setStatusAnchor(e.currentTarget)}
// //             sx={{ textTransform: 'none', color: selectedStatus !== 'All' ? '#973aa8' : 'text.primary', fontWeight: selectedStatus !== 'All' ? 600 : 400, fontSize: '14px', p: 0, '&:hover': { bgcolor: 'transparent' } }}
// //           >
// //             Status: {selectedStatus}
// //           </Button>
// //           <Menu anchorEl={statusAnchor} open={Boolean(statusAnchor)} onClose={() => setStatusAnchor(null)}>
// //             {uniqueStatuses.map((status) => (
// //               <MenuItem
// //                 key={status}
// //                 onClick={() => {
// //                   setSelectedStatus(status); 
// //                   setStatusAnchor(null);
// //                   setActiveView("all");
// //                 }}
// //                 sx={{ display: "flex", justifyContent: "space-between", gap: 2, fontSize: '14px' }}
// //               >
// //                 {status} {selectedStatus.toLowerCase() === status.toLowerCase() && <CheckIcon sx={{ fontSize: 14, color: '#973aa8' }} />}
// //               </MenuItem>
// //             ))}
// //           </Menu>

// //           <Button
// //             endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14 }} />}
// //             onClick={(e) => setAssigneeAnchor(e.currentTarget)}
// //             sx={{ textTransform: 'none', color: selectedAssignee !== 'All' ? '#973aa8' : 'text.primary', fontWeight: selectedAssignee !== 'All' ? 600 : 400, fontSize: '14px', p: 0, '&:hover': { bgcolor: 'transparent' } }}
// //           >
// //             Assignee: {selectedAssignee}
// //           </Button>
// //           <Menu anchorEl={assigneeAnchor} open={Boolean(assigneeAnchor)} onClose={() => setAssigneeAnchor(null)}>
// //             {uniqueAssignees.map((name) => (
// //               <MenuItem 
// //                 key={name} 
// //                 onClick={() => {
// //                   setSelectedAssignee(name); 
// //                   setAssigneeAnchor(null);
// //                   setActiveView("assignee");
// //                 }}
// //                 sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, fontSize: '14px' }}
// //               >
// //                 {name} {selectedAssignee.toLowerCase() === name.toLowerCase() && <CheckIcon sx={{ fontSize: 14, color: '#973aa8' }} />}
// //               </MenuItem>
// //             ))}
// //           </Menu>
         
// //                 {/* Shared Button */}
// // <Button
// //   onClick={() => setActiveView(activeView === "shared" ? "all" : "shared")} 
// //   sx={{
// //     textTransform: "none",
// //     color: activeView === "shared" ? "#973aa8" : "text.primary",
// //     bgcolor: activeView === "shared" ? "background.default" : "transparent",
// //     gap: 0.5,
// //     px: 1,
// //     mr: 2,
// //     borderRadius: 2,
// //     border: "none",
// //     "&:hover": { bgcolor: "background.default" },
// //   }}
// // >
// //   <PeopleOutlinedIcon />
// //   Shared
// // </Button>

// //           {(selectedStatus !== "All" || selectedAssignee !== "All" || activeView === "shared") && (
// //             <Typography 
// //               onClick={() => { setSelectedStatus("All"); 
// //                 setSelectedAssignee("All");
// //                 setActiveView("all")
// //                }}
// //               sx={{ fontSize: '13px', color: 'text.primary', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
// //             >
// //               Clear filters
// //             </Typography>
// //           )}

  
// //           {/* {showSharedList && (
// //             <Box sx={{ mt: 2, mb: 2 }}>
// //               {collabLoading ? (
// //                 <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
// //                   <CircularProgress size={20} />
// //                 </Box>
// //               ) : collaborators.length === 0 ? (
// //                 <Typography variant="body2" color="text.secondary">No collaborators yet.</Typography>
// //               ) : (
// //                 <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
// //                   {collaborators.map((c) => {
// //                     const email = c.invitedEmail || '';
// //                     const displayName = (c as any).fullName || (email.includes('@') ? email.split('@')[0] : email);
// //                     const initial = (displayName && displayName.charAt(0)) ? displayName.charAt(0).toUpperCase() : '';
// //                     return (
// //                       <Box key={c._id || email} sx={{ p: 1, border: '1px solid #eee', borderRadius: 2, minWidth: 200, display: 'flex', gap: 1, alignItems: 'center' }}>
// //                         <Card>
// //                            <Avatar sx={{ width: 36, height: 36, bgcolor: '#e8f3ff', color: '#1a6cb3' }}>{initial}</Avatar>
// //                         <Box>
// //                           <Typography variant="body2" sx={{ fontWeight: 600 }}>{displayName}</Typography>
// //                           <Typography variant="caption" color="text.secondary">{email}</Typography>
// //                         </Box>
// //                         </Card>
                       
// //                       </Box>
// //                     );
// //                   })}
// //                 </Stack>
// //               )}
// //             </Box>
// //           )} */}
// //         </Stack>

// //      <Box sx={{ mt: 2 }}>
// //           {activeView === "all" && (
// //             <TaskNotesStatus filteredNotes={filteredNotes} />
// //           )}

// //           {activeView === "assignee" && (
// //             <AssigneeTaskNotes 
// //               selectedAssignee={selectedAssignee} 
// //               setSelectedAssignee={setSelectedAssignee} 
// //               uniqueAssignees={uniqueAssignees} 
// //               filteredNotes={filteredNotes}
// //             />
// //           )}

// //           {activeView === "shared" && (
// //             <SharedTaskPage/>
// //           )}
// //         </Box>
// //           </Box>

// //       </Box>
  
// //   );
// // };

// import * as React from 'react';
// import { Box, Button, Stack, Typography, IconButton, TextField, Menu, MenuItem, CircularProgress } from "@mui/material";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Search, SwapVertOutlined } from '@mui/icons-material';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
// import TaskAltIcon from '@mui/icons-material/TaskAlt';
// import CheckIcon from '@mui/icons-material/Check';
// import { useGetNotesQuery } from "../services/noteApi";
// import type { Note } from "../types/Note";
// import { TaskNotesStatus } from '../components/status-page/TaskNotesStatus';
// import { AssigneeTaskNotes } from '../components/status-page/AssigneeTaskNotes';
// import { SharedTaskPage } from '../components/status-page/SharedTaskPage';

// export const MyTaskNote = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
//   const [searchOpen, setSearchOpen] = React.useState<boolean>(false);
//   const [searchText, setSearchText] = React.useState<string>("");

//   const getInitialView = () => {
//     if (location.search.includes("view=shared")) return "shared" as const;
//     if (localStorage.getItem("sharedNotesRequested") === "true") return "shared" as const;
//     return "all" as const;
//   };

//   const [activeView, setActiveView] = React.useState<"all" | "assignee" | "shared">(getInitialView());

//   React.useEffect(() => {
//     if (location.search.includes("view=shared")) {
//       setActiveView("shared");
//       localStorage.setItem("sharedNotesRequested", "true");
//     }
//   }, [location.search]);

//   // Filter states
//   const [selectedStatus, setSelectedStatus] = React.useState<string>("All");
//   const [selectedAssignee, setSelectedAssignee] = React.useState<string>("All");

//   const { data: notes = [], isLoading, isError } = useGetNotesQuery(undefined);

//   // Dropdown States
//   const [statusAnchor, setStatusAnchor] = React.useState<null | HTMLElement>(null);
//   const [assigneeAnchor, setAssigneeAnchor] = React.useState<null | HTMLElement>(null);

//   const uniqueAssignees = React.useMemo(() => {
//     if (!Array.isArray(notes)) return ["All"];
//     const assignees = notes
//       .map((note: Note) => note.assignee?.trim())
//       .filter((name): name is string => !!name);
//     return ["All", ...Array.from(new Set(assignees))];
//   }, [notes]);

//   const uniqueStatuses = React.useMemo(() => {
//     if (!Array.isArray(notes)) return ["All"];
//     const statuses = notes
//       .map((note: Note) => (note.task || note.category || "").trim())
//       .filter((status): status is string => !!status);
//     return ["All", ...Array.from(new Set(statuses))];
//   }, [notes]);

//   // 🔥 ဒီမှာ search bar က status နဲ့ assignee နှစ်မျိုးလုံးကို ဖမ်းဆီးပြီး filter လုပ်တယ်
//   const filteredNotes = React.useMemo(() => {
//     if (!Array.isArray(notes)) return [];

//     const statusKeywords = ["todo", "in progress", "complete", "not started"];
//     const searchLower = searchText.trim().toLowerCase();

//     // searchText က status keyword ဖြစ်ရင် status filter ကိုသုံးမယ်၊ မဟုတ်ရင် assignee filter သုံးမယ်
//     let statusFilter: string | null = null;
//     let assigneeFilter: string | null = null;

//     if (searchLower !== "") {
//       const matchedStatus = statusKeywords.find(keyword => keyword === searchLower);
//       if (matchedStatus) {
//         // status keyword နဲ့ ကိုက်ညီရင် အဲဒီ status ကို filter လုပ်
//         if (matchedStatus === "todo") statusFilter = "Todo";
//         else if (matchedStatus === "in progress") statusFilter = "In Progress";
//         else if (matchedStatus === "complete") statusFilter = "Complete";
//         else if (matchedStatus === "not started") statusFilter = "Not Started";
//       } else {
//         // status keyword မဟုတ်ရင် assignee name နဲ့ filter လုပ် (partial match)
//         assigneeFilter = searchLower;
//       }
//     }

//     return notes
//       .filter((note: Note) => {
//         // ၁။ status filter (dropdown က ရွေးထားတဲ့ status နဲ့ searchText က status နှစ်မျိုးလုံးကို စစ်)
//         // activeView က "assignee" ဆိုရင် status filter ကို မသုံးဘူး (ဒါမှမဟုတ် သုံးချင်ရင် သုံးလို့ရ)
//         // ဒါပေမယ့် သူ့ရဲ့ လက်ရှိ logic က activeView !== "assignee" ဆိုမှ status filter သုံးထားတယ်
//         // ဒါကို ထိန်းထားမယ်
//         if (activeView !== "assignee") {
//           // dropdown က status filter
//           if (selectedStatus !== "All") {
//             const currentStatus = (note.task || note.category || "").trim().toLowerCase();
//             if (currentStatus !== selectedStatus.toLowerCase()) return false;
//           }
//           // searchText က status keyword နဲ့ filter
//           if (statusFilter !== null) {
//             const currentStatus = (note.task || note.category || "").trim().toLowerCase();
//             if (currentStatus !== statusFilter.toLowerCase()) return false;
//           }
//         }

//         // ၂။ assignee filter (dropdown က ရွေးထားတဲ့ assignee နဲ့ searchText က assignee)
//         if (selectedAssignee !== "All") {
//           const currentAssignee = (note.assignee || "").trim().toLowerCase();
//           if (currentAssignee !== selectedAssignee.toLowerCase()) return false;
//         }
//         if (assigneeFilter !== null) {
//           const currentAssignee = (note.assignee || "").trim().toLowerCase();
//           if (!currentAssignee.includes(assigneeFilter)) return false;
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
//   }, [notes, selectedStatus, selectedAssignee, searchText, sortOrder, activeView]);

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
//     <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "background.default", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
//       <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 54px' }}>
//         {/* Title Section */}
//         <Typography variant="h6" sx={{ fontSize: "16px", color: 'text.primary', mb: 3, letterSpacing: '-0.5px' }}>
//           My Tasks
//         </Typography>

//         {/* Toolbar Controls */}
//         <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", borderBottom: '1px solid #ededed', pb: 1, mb: 2 }}>
//           <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
//             <Button
//               startIcon={<TaskAltIcon sx={{ fontSize: '16px' }} />}
//               onClick={() => setActiveView("all")}
//               sx={{
//                 textTransform: 'none',
//                 color: '#37352f',
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
//             <IconButton
//               size="small"
//               onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
//               sx={{
//                 color: sortOrder === 'desc' ? '#973aa8' : 'text.primary',
//                 bgcolor: sortOrder === 'desc' ? 'background.default' : 'transparent',
//                 borderRadius: '4px',
//                 transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                 '& .MuiSvgIcon-root': {
//                   transition: 'transform 0.3s ease',
//                   transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)',
//                 },
//                 '&:hover': {
//                   bgcolor: sortOrder === 'desc' ? '#e3f2fd' : '#f1f1ef'
//                 }
//               }}
//             >
//               <SwapVertOutlined fontSize="small" />
//             </IconButton>

//             <IconButton
//               size="small"
//               sx={{ color: 'text.primary', mr: searchOpen ? 1 : 0, borderRadius: '4px' }}
//               onClick={() => setSearchOpen((prev) => !prev)}
//             >
//               <Search fontSize="small" />
//             </IconButton>

//             {searchOpen && (
//               <TextField
//                 size="small"
//                 autoFocus
//                 placeholder="Search by status or assignee..."  // 🔥 placeholder ကိုလည်း ပြောင်းထားတယ်
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 sx={{
//                   width: 200,  // နည်းနည်းကျယ်အောင် ချိန်ထားတယ်
//                   mr: 1,
//                   '& .MuiOutlinedInput-root': {
//                     height: 28,
//                     fontSize: '13px',
//                     borderRadius: '4px',
//                     '& fieldset': { borderColor: '#ededed' },
//                     '&:hover fieldset': { borderColor: '#dfdfdf' },
//                     '&.Mui-focused fieldset': { borderColor: '#973aa8', borderWidth: '1px' },
//                   },
//                   '& .MuiOutlinedInput-input': { py: 0.5, px: 1 }
//                 }}
//               />
//             )}

//             <Button
//               variant="contained"
//               disableElevation
//               onClick={() => navigate("/my-tasks/task-create-note")}
//               sx={{
//                 backgroundColor: '#dec9e9',
//                 textTransform: 'none',
//                 fontWeight: 500,
//                 fontSize: '13px',
//                 padding: '4px 12px',
//                 borderRadius: '4px',
//                 '&:hover': { backgroundColor: '#973aa8', color: "#ffffff" },
//                 transition: '0.15s'
//               }}
//             >
//               New task
//             </Button>
//           </Stack>
//         </Stack>

//         {/* Inline Sub-Filters */}
//         <Stack direction="row" spacing={1.5} sx={{ mb: 4, alignItems: "center" }}>
//           {/* Dynamic Status Dropdown */}
//           <Button
//             endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14 }} />}
//             onClick={(e) => setStatusAnchor(e.currentTarget)}
//             sx={{
//               textTransform: 'none',
//               color: selectedStatus !== 'All' ? '#973aa8' : 'text.primary',
//               fontWeight: selectedStatus !== 'All' ? 600 : 400,
//               fontSize: '14px',
//               p: 0,
//               '&:hover': { bgcolor: 'transparent' }
//             }}
//           >
//             Status: {selectedStatus}
//           </Button>
//           <Menu
//             anchorEl={statusAnchor}
//             open={Boolean(statusAnchor)}
//             onClose={() => setStatusAnchor(null)}
//           >
//             {uniqueStatuses.map((status) => (
//               <MenuItem
//                 key={status}
//                 onClick={() => {
//                   setSelectedStatus(status);
//                   setStatusAnchor(null);
//                   setActiveView("all");
//                 }}
//                 sx={{ display: "flex", justifyContent: "space-between", gap: 2, fontSize: '14px' }}
//               >
//                 {status}
//                 {selectedStatus.toLowerCase() === status.toLowerCase() && (
//                   <CheckIcon sx={{ fontSize: 14, color: '#973aa8' }} />
//                 )}
//               </MenuItem>
//             ))}
//           </Menu>

//           {/* Assignee Dropdown */}
//           <Button
//             endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14 }} />}
//             onClick={(e) => setAssigneeAnchor(e.currentTarget)}
//             sx={{
//               textTransform: 'none',
//               color: selectedAssignee !== 'All' ? '#973aa8' : 'text.primary',
//               fontWeight: selectedAssignee !== 'All' ? 600 : 400,
//               fontSize: '14px',
//               p: 0,
//               '&:hover': { bgcolor: 'transparent' }
//             }}
//           >
//             Assignee: {selectedAssignee}
//           </Button>
//           <Menu
//             anchorEl={assigneeAnchor}
//             open={Boolean(assigneeAnchor)}
//             onClose={() => setAssigneeAnchor(null)}
//           >
//             {uniqueAssignees.map((name) => (
//               <MenuItem
//                 key={name}
//                 onClick={() => {
//                   setSelectedAssignee(name);
//                   setAssigneeAnchor(null);
//                   setActiveView("assignee");
//                 }}
//                 sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, fontSize: '14px' }}
//               >
//                 {name}
//                 {selectedAssignee.toLowerCase() === name.toLowerCase() && (
//                   <CheckIcon sx={{ fontSize: 14, color: '#973aa8' }} />
//                 )}
//               </MenuItem>
//             ))}
//           </Menu>

//           {/* Shared Button */}
//           <Button
//             onClick={() => setActiveView(activeView === "shared" ? "all" : "shared")}
//             sx={{
//               textTransform: "none",
//               color: activeView === "shared" ? "#973aa8" : "text.primary",
//               bgcolor: activeView === "shared" ? "background.default" : "transparent",
//               gap: 0.5,
//               px: 1,
//               mr: 2,
//               borderRadius: 2,
//               border: "none",
//               "&:hover": { bgcolor: "background.default" },
//             }}
//           >
//             <PeopleOutlinedIcon />
//             Shared
//           </Button>

//           {(selectedStatus !== "All" || selectedAssignee !== "All" || activeView === "shared") && (
//             <Typography
//               onClick={() => {
//                 setSelectedStatus("All");
//                 setSelectedAssignee("All");
//                 setActiveView("all");
//                 setSearchText("");   // 🔥 searchText ကိုလည်း ရှင်းပေးတယ်
//               }}
//               sx={{
//                 fontSize: '13px',
//                 color: 'text.primary',
//                 cursor: 'pointer',
//                 '&:hover': { textDecoration: 'underline' }
//               }}
//             >
//               Clear filters
//             </Typography>
//           )}
//         </Stack>

//         <Box sx={{ mt: 2 }}>
//           {activeView === "all" && (
//             <TaskNotesStatus filteredNotes={filteredNotes} />
//           )}

//           {activeView === "assignee" && (
//             <AssigneeTaskNotes
//               selectedAssignee={selectedAssignee}
//               setSelectedAssignee={setSelectedAssignee}
//               uniqueAssignees={uniqueAssignees}
//               filteredNotes={filteredNotes}
//             />
//           )}

//           {activeView === "shared" && (
//             <SharedTaskPage />
//           )}
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// import * as React from 'react';
// import {
//   Box,
//   Button,
//   Stack,
//   Typography,
//   IconButton,
//   TextField,
//   Menu,
//   MenuItem,
//   CircularProgress,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Avatar,
// } from "@mui/material";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   Search,
//   SwapVertOutlined,
//   KeyboardArrowDown,
//   PeopleOutlined,
//   TaskAlt,
//   Check,
// } from '@mui/icons-material';
// import { useGetTasksQuery } from '../services/taskApi';
// import type { Task } from '../types/Project';

// // Helper for status colors
// const statusColors: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
//   'Todo': 'default',
//   'In Progress': 'warning',
//   'Complete': 'success',
//   'Not Started': 'info',
// };

// export const MyTaskNote = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Get project filter from URL query
//   const projectIdParam = new URLSearchParams(location.search).get('project') || undefined;

//   const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
//   const [searchText, setSearchText] = React.useState<string>("");
//   const [searchOpen, setSearchOpen] = React.useState<boolean>(false);

//   // Filter states
//   const [selectedStatus, setSelectedStatus] = React.useState<string>("All");
//   const [selectedAssignee, setSelectedAssignee] = React.useState<string>("All");

//   // Dropdown anchors
//   const [statusAnchor, setStatusAnchor] = React.useState<null | HTMLElement>(null);
//   const [assigneeAnchor, setAssigneeAnchor] = React.useState<null | HTMLElement>(null);

//   // Fetch tasks with optional project filter
//   const {
//     data: tasks = [],
//     isLoading,
//     isError,
//   } = useGetTasksQuery({ projectId: projectIdParam });

//   // Compute unique statuses and assignees from tasks
//   const uniqueStatuses = React.useMemo(() => {
//     const statuses = tasks.map((t: Task) => t.status);
//     return ['All', ...Array.from(new Set(statuses))];
//   }, [tasks]);

//   const uniqueAssignees = React.useMemo(() => {
//     const assignees = tasks.map((t: Task) => t.assignee).filter(Boolean);
//     return ['All', ...Array.from(new Set(assignees))];
//   }, [tasks]);

//   // Filter and sort tasks
//   // const filteredTasks = React.useMemo(() => {
//   //   let result = tasks;

//   //   // Search: match title, project name, or assignee
//   //   if (searchText.trim()) {
//   //     const lower = searchText.toLowerCase();
//   //     result = result.filter((t: Task) =>
//   //       t.title.toLowerCase().includes(lower) ||
//   //       (typeof t.project === 'object' && t.project.name.toLowerCase().includes(lower)) ||
//   //       t.assignee.toLowerCase().includes(lower)
//   //     );
//   //   }

//   //   // Status filter
//   //   if (selectedStatus !== 'All') {
//   //     result = result.filter((t: Task) => t.status === selectedStatus);
//   //   }

//   //   // Assignee filter
//   //   if (selectedAssignee !== 'All') {
//   //     result = result.filter((t: Task) => t.assignee === selectedAssignee);
//   //   }

//   //   // Sort by title
//   //   result = result.sort((a, b) =>
//   //     sortOrder === 'asc'
//   //       ? a.title.localeCompare(b.title)
//   //       : b.title.localeCompare(a.title)
//   //   );

//   //   return result;
//   // }, [tasks, searchText, selectedStatus, selectedAssignee, sortOrder]);

//   const filteredTasks = React.useMemo(() => {
//   let result = tasks;

//   // Search: match title, project name, or assignee
//   if (searchText.trim()) {
//     const lower = searchText.toLowerCase();
//     result = result.filter((t: Task) =>
//       t.title.toLowerCase().includes(lower) ||
//       (typeof t.project === 'object' && t.project.name.toLowerCase().includes(lower)) ||
//       t.assignee.toLowerCase().includes(lower)
//     );
//   }

//   // Status filter
//   if (selectedStatus !== 'All') {
//     result = result.filter((t: Task) => t.status === selectedStatus);
//   }

//   // Assignee filter
//   if (selectedAssignee !== 'All') {
//     result = result.filter((t: Task) => t.assignee === selectedAssignee);
//   }

//   // ✅ FIX: Create a copy before sorting to avoid mutating read-only data
//   return [...result].sort((a, b) =>
//     sortOrder === 'asc'
//       ? a.title.localeCompare(b.title)
//       : b.title.localeCompare(a.title)
//   );
// }, [tasks, searchText, selectedStatus, selectedAssignee, sortOrder]);

//   const clearFilters = () => {
//     setSearchText('');
//     setSelectedStatus('All');
//     setSelectedAssignee('All');
//   };

//   const isFiltered =
//     selectedStatus !== 'All' || selectedAssignee !== 'All' || searchText !== '';

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
//         Unable to load tasks. Please try again later.
//       </Typography>
//     );
//   }

//   return (
//     <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "background.default", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
//       <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 54px' }}>

//         {/* Title */}
//         <Typography variant="h6" sx={{ fontSize: "16px", color: 'text.primary', mb: 3, letterSpacing: '-0.5px' }}>
//           My Tasks {projectIdParam && '(Filtered by Project)'}
//         </Typography>

//         {/* Toolbar */}
//         <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", borderBottom: '1px solid #ededed', pb: 1, mb: 2 }}>
//           <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
//             <Button
//               startIcon={<TaskAlt sx={{ fontSize: '16px' }} />}
//               sx={{
//                 textTransform: 'none',
//                 color: '#37352f',
//                 fontSize: '14px',
//                 bgcolor: '#f1f1ef',
//                 borderRadius: '6px',
//                 px: 1.5,
//                 py: 0.5,
//                 '&:hover': { bgcolor: '#e3e2e0' }
//               }}
//             >
//               Tasks
//             </Button>
//             {projectIdParam && (
//               <Chip
//                 label="Filtered by Project"
//                 size="small"
//                 onDelete={() => navigate('/my-tasks')}
//               />
//             )}
//           </Stack>

//           <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
//             {/* Sort */}
//             <IconButton
//               size="small"
//               onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
//               sx={{
//                 color: sortOrder === 'desc' ? '#973aa8' : 'text.primary',
//                 bgcolor: sortOrder === 'desc' ? 'background.default' : 'transparent',
//                 borderRadius: '4px',
//                 transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                 '& .MuiSvgIcon-root': {
//                   transition: 'transform 0.3s ease',
//                   transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)',
//                 },
//                 '&:hover': {
//                   bgcolor: sortOrder === 'desc' ? '#e3f2fd' : '#f1f1ef'
//                 }
//               }}
//             >
//               <SwapVertOutlined fontSize="small" />
//             </IconButton>

//             {/* Search toggle */}
//             <IconButton
//               size="small"
//               sx={{ color: 'text.primary', mr: searchOpen ? 1 : 0, borderRadius: '4px' }}
//               onClick={() => setSearchOpen((prev) => !prev)}
//             >
//               <Search fontSize="small" />
//             </IconButton>

//             {searchOpen && (
//               <TextField
//                 size="small"
//                 autoFocus
//                 placeholder="Search tasks, projects, assignees..."
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 sx={{
//                   width: 220,
//                   mr: 1,
//                   '& .MuiOutlinedInput-root': {
//                     height: 28,
//                     fontSize: '13px',
//                     borderRadius: '4px',
//                     '& fieldset': { borderColor: '#ededed' },
//                     '&:hover fieldset': { borderColor: '#dfdfdf' },
//                     '&.Mui-focused fieldset': { borderColor: '#973aa8', borderWidth: '1px' },
//                   },
//                   '& .MuiOutlinedInput-input': { py: 0.5, px: 1 }
//                 }}
//               />
//             )}

//             {/* New Task button */}
//             <Button
//               variant="contained"
//               disableElevation
//               onClick={() => navigate("/my-tasks/task-create-note")}
//               sx={{
//                 backgroundColor: '#dec9e9',
//                 textTransform: 'none',
//                 fontWeight: 500,
//                 fontSize: '13px',
//                 padding: '4px 12px',
//                 borderRadius: '4px',
//                 '&:hover': { backgroundColor: '#973aa8', color: "#ffffff" },
//                 transition: '0.15s'
//               }}
//             >
//               New task
//             </Button>
//           </Stack>
//         </Stack>

//         {/* Filter dropdowns */}
//         <Stack direction="row" spacing={1.5} sx={{ mb: 4, alignItems: "center", flexWrap: 'wrap' }}>
//           {/* Status filter */}
//           <Button
//             endIcon={<KeyboardArrowDown sx={{ fontSize: 14 }} />}
//             onClick={(e) => setStatusAnchor(e.currentTarget)}
//             sx={{
//               textTransform: 'none',
//               color: selectedStatus !== 'All' ? '#973aa8' : 'text.primary',
//               fontWeight: selectedStatus !== 'All' ? 600 : 400,
//               fontSize: '14px',
//               p: 0,
//               '&:hover': { bgcolor: 'transparent' }
//             }}
//           >
//             Status: {selectedStatus}
//           </Button>
//           <Menu
//             anchorEl={statusAnchor}
//             open={Boolean(statusAnchor)}
//             onClose={() => setStatusAnchor(null)}
//           >
//             {uniqueStatuses.map((status) => (
//               <MenuItem
//                 key={status}
//                 onClick={() => {
//                   setSelectedStatus(status);
//                   setStatusAnchor(null);
//                 }}
//                 sx={{ display: "flex", justifyContent: "space-between", gap: 2, fontSize: '14px' }}
//               >
//                 {status}
//                 {selectedStatus === status && <Check sx={{ fontSize: 14, color: '#973aa8' }} />}
//               </MenuItem>
//             ))}
//           </Menu>

//           {/* Assignee filter */}
//           <Button
//             endIcon={<KeyboardArrowDown sx={{ fontSize: 14 }} />}
//             onClick={(e) => setAssigneeAnchor(e.currentTarget)}
//             sx={{
//               textTransform: 'none',
//               color: selectedAssignee !== 'All' ? '#973aa8' : 'text.primary',
//               fontWeight: selectedAssignee !== 'All' ? 600 : 400,
//               fontSize: '14px',
//               p: 0,
//               '&:hover': { bgcolor: 'transparent' }
//             }}
//           >
//             Assignee: {selectedAssignee}
//           </Button>
//           <Menu
//             anchorEl={assigneeAnchor}
//             open={Boolean(assigneeAnchor)}
//             onClose={() => setAssigneeAnchor(null)}
//           >
//             {uniqueAssignees.map((name) => (
//               <MenuItem
//                 key={name}
//                 onClick={() => {
//                   setSelectedAssignee(name);
//                   setAssigneeAnchor(null);
//                 }}
//                 sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, fontSize: '14px' }}
//               >
//                 {name}
//                 {selectedAssignee === name && <Check sx={{ fontSize: 14, color: '#973aa8' }} />}
//               </MenuItem>
//             ))}
//           </Menu>

//           {isFiltered && (
//             <Typography
//               onClick={clearFilters}
//               sx={{
//                 fontSize: '13px',
//                 color: 'text.primary',
//                 cursor: 'pointer',
//                 '&:hover': { textDecoration: 'underline' }
//               }}
//             >
//               Clear filters
//             </Typography>
//           )}
//         </Stack>

//         {/* Task Table */}
//         <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
//           <Table>
//             <TableHead sx={{ bgcolor: '#fafafa' }}>
//               <TableRow>
//                 <TableCell sx={{ fontWeight: 600 }}>Task Name</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Project</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Assignee</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredTasks.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={6} sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
//                     No tasks found.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredTasks.map((task: Task) => {
//                   const project = typeof task.project === 'object' ? task.project : null;
//                   return (
//                     <TableRow key={task._id} hover>
//                       <TableCell>
//                         <Typography >{task.title}</Typography>
//                         {task.description && (
//                           <Typography variant="caption" sx={{color:'text.secondary', display:'block'}}>
//                             {task.description}
//                           </Typography>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <Chip label={project?.name || 'N/A'} size="small" variant="outlined" />
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           avatar={<Avatar sx={{ width: 20, height: 20, fontSize: 10 }}>{task.assignee?.[0] || '?'}</Avatar>}
//                           label={task.assignee || 'Unassigned'}
//                           size="small"
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           label={task.status}
//                           color={statusColors[task.status] || 'default'}
//                           size="small"
//                           sx={{ fontWeight: 500 }}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           label={task.priority}
//                           size="small"
//                           variant={task.priority === 'High' ? 'filled' : 'outlined'}
//                           color={task.priority === 'High' ? 'error' : 'default'}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     </Box>
//   );
// };


// import * as React from 'react';
// import {
//   Box,
//   Button,
//   Stack,
//   Typography,
//   IconButton,
//   TextField,
//   Menu,
//   MenuItem,
//   CircularProgress,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Avatar,
// } from "@mui/material";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   Search,
//   SwapVertOutlined,
//   KeyboardArrowDown,
//   TaskAlt,
//   Check,
// } from '@mui/icons-material';
// import { useGetTasksQuery } from '../services/taskApi';
// import { useGetProjectsQuery } from '../services/projectApi';
// import type { Task } from '../types/Project';

// // Helper for status colors
// const statusColors: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
//   'Todo': 'default',
//   'In Progress': 'warning',
//   'Complete': 'success',
//   'Not Started': 'info',
// };

// export const MyTaskNote = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const projectIdParam = new URLSearchParams(location.search).get('project') || undefined;

//   // 🔥 Projects data for project name
//   const { data: projects } = useGetProjectsQuery();

//   const projectName = React.useMemo(() => {
//     if (!projects || !projectIdParam) return null;
//     const project = projects.find((p) => p._id === projectIdParam);
//     return project?.name || 'Unknown Project';
//   }, [projects, projectIdParam]);

//   // Filter states
//   const [selectedStatus, setSelectedStatus] = React.useState<string>("All");
//   const [selectedAssignee, setSelectedAssignee] = React.useState<string>("All");
//   const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
//   const [searchText, setSearchText] = React.useState<string>("");
//   const [searchOpen, setSearchOpen] = React.useState<boolean>(false);

//   // Dropdown anchors
//   const [statusAnchor, setStatusAnchor] = React.useState<null | HTMLElement>(null);
//   const [assigneeAnchor, setAssigneeAnchor] = React.useState<null | HTLElement>(null);

//   // Fetch tasks
//   const {
//     data: tasks = [],
//     isLoading,
//     isError,
//   } = useGetTasksQuery({ projectId: projectIdParam });

//   // Compute unique statuses and assignees from tasks (for dropdowns)
//   const uniqueStatuses = React.useMemo(() => {
//     const statuses = tasks.map((t: Task) => t.status);
//     return ['All', ...Array.from(new Set(statuses))];
//   }, [tasks]);

//   const uniqueAssignees = React.useMemo(() => {
//     const assignees = tasks.map((t: Task) => t.assignee).filter(Boolean);
//     return ['All', ...Array.from(new Set(assignees))];
//   }, [tasks]);

//   // Filter and sort tasks
//   const filteredTasks = React.useMemo(() => {
//     let result = tasks;

//     // ၁။ Search
//     if (searchText.trim()) {
//       const lower = searchText.toLowerCase();
//       result = result.filter((t: Task) =>
//         t.title.toLowerCase().includes(lower) ||
//         (typeof t.project === 'object' && t.project.name.toLowerCase().includes(lower)) ||
//         t.assignee.toLowerCase().includes(lower)
//       );
//     }

//     // ၂။ Status filter
//     if (selectedStatus !== 'All') {
//       result = result.filter((t: Task) => t.status === selectedStatus);
//     }

//     // ၃။ Assignee filter
//     if (selectedAssignee !== 'All') {
//       result = result.filter((t: Task) => t.assignee === selectedAssignee);
//     }

//     // ၄။ Sort by title (copy before sort)
//     return [...result].sort((a, b) =>
//       sortOrder === 'asc'
//         ? a.title.localeCompare(b.title)
//         : b.title.localeCompare(a.title)
//     );
//   }, [tasks, searchText, selectedStatus, selectedAssignee, sortOrder]);

//   const clearFilters = () => {
//     setSearchText('');
//     setSelectedStatus('All');
//     setSelectedAssignee('All');
//   };

//   const isFiltered =
//     selectedStatus !== 'All' ||
//     selectedAssignee !== 'All' ||
//     searchText !== '';

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
//         Unable to load tasks. Please try again later.
//       </Typography>
//     );
//   }

//   return (
//     <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "background.default" }}>
//       <Box sx={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 54px' }}>

//         {/* Title */}
//         <Typography variant="h6" sx={{ fontSize: "16px", color: 'text.primary', mb: 3 }}>
//           My Tasks
//         </Typography>

//         {/* Toolbar */}
//         <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", borderBottom: '1px solid #ededed', pb: 1, mb: 2 }}>
//           <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
//             <Button
//               startIcon={<TaskAlt sx={{ fontSize: '16px' }} />}
//               sx={{
//                 textTransform: 'none',
//                 color: '#37352f',
//                 fontSize: '14px',
//                 bgcolor: '#f1f1ef',
//                 borderRadius: '6px',
//                 px: 1.5,
//                 py: 0.5,
//                 '&:hover': { bgcolor: '#e3e2e0' }
//               }}
//             >
//               Tasks
//             </Button>
//             {projectIdParam && (
//               <Chip
//                 label={`Filtered by: ${projectName || 'Loading...'}`}
//                 size="small"
//                 onDelete={() => navigate('/my-tasks')}
//                 sx={{ fontWeight: 500 }}
//               />
//             )}
//           </Stack>

//           <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
//             <IconButton
//               size="small"
//               onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
//               sx={{
//                 color: sortOrder === 'desc' ? '#973aa8' : 'text.primary',
//                 bgcolor: sortOrder === 'desc' ? 'background.default' : 'transparent',
//                 borderRadius: '4px',
//                 transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                 '& .MuiSvgIcon-root': {
//                   transition: 'transform 0.3s ease',
//                   transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)',
//                 },
//                 '&:hover': {
//                   bgcolor: sortOrder === 'desc' ? '#e3f2fd' : '#f1f1ef'
//                 }
//               }}
//             >
//               <SwapVertOutlined fontSize="small" />
//             </IconButton>

//             <IconButton
//               size="small"
//               sx={{ color: 'text.primary', mr: searchOpen ? 1 : 0, borderRadius: '4px' }}
//               onClick={() => setSearchOpen((prev) => !prev)}
//             >
//               <Search fontSize="small" />
//             </IconButton>

//             {searchOpen && (
//               <TextField
//                 size="small"
//                 autoFocus
//                 placeholder="Search tasks, projects, assignees..."
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 sx={{
//                   width: 220,
//                   mr: 1,
//                   '& .MuiOutlinedInput-root': {
//                     height: 28,
//                     fontSize: '13px',
//                     borderRadius: '4px',
//                     '& fieldset': { borderColor: '#ededed' },
//                     '&:hover fieldset': { borderColor: '#dfdfdf' },
//                     '&.Mui-focused fieldset': { borderColor: '#973aa8', borderWidth: '1px' },
//                   },
//                   '& .MuiOutlinedInput-input': { py: 0.5, px: 1 }
//                 }}
//               />
//             )}

//             <Button
//               variant="contained"
//               disableElevation
//               onClick={() => navigate("/my-tasks/new")}
//               sx={{
//                 backgroundColor: '#dec9e9',
//                 textTransform: 'none',
//                 fontWeight: 500,
//                 fontSize: '13px',
//                 padding: '4px 12px',
//                 borderRadius: '4px',
//                 '&:hover': { backgroundColor: '#973aa8', color: "#ffffff" },
//                 transition: '0.15s'
//               }}
//             >
//               New task
//             </Button>
//           </Stack>
//         </Stack>

//         {/* 🔥 Filter Row: Status | Assignee (No List Dropdown) */}
//         <Stack direction="row" spacing={2} sx={{ mb: 4, alignItems: "center", flexWrap: 'wrap' }}>
//           {/* Status Dropdown */}
//           <Button
//             endIcon={<KeyboardArrowDown sx={{ fontSize: 14 }} />}
//             onClick={(e) => setStatusAnchor(e.currentTarget)}
//             sx={{
//               textTransform: 'none',
//               color: selectedStatus !== 'All' ? '#973aa8' : 'text.primary',
//               fontWeight: selectedStatus !== 'All' ? 600 : 400,
//               fontSize: '14px',
//               p: 0,
//               '&:hover': { bgcolor: 'transparent' }
//             }}
//           >
//             Status: {selectedStatus}
//           </Button>
//           <Menu anchorEl={statusAnchor} open={Boolean(statusAnchor)} onClose={() => setStatusAnchor(null)}>
//             {uniqueStatuses.map((status) => (
//               <MenuItem key={status} onClick={() => { setSelectedStatus(status); setStatusAnchor(null); }}>
//                 {status} {selectedStatus === status && <Check sx={{ fontSize: 14, color: '#973aa8', ml: 1 }} />}
//               </MenuItem>
//             ))}
//           </Menu>

//           {/* Assignee Dropdown */}
//           <Button
//             endIcon={<KeyboardArrowDown sx={{ fontSize: 14 }} />}
//             onClick={(e) => setAssigneeAnchor(e.currentTarget)}
//             sx={{
//               textTransform: 'none',
//               color: selectedAssignee !== 'All' ? '#973aa8' : 'text.primary',
//               fontWeight: selectedAssignee !== 'All' ? 600 : 400,
//               fontSize: '14px',
//               p: 0,
//               '&:hover': { bgcolor: 'transparent' }
//             }}
//           >
//             Assignee: {selectedAssignee}
//           </Button>
//           <Menu anchorEl={assigneeAnchor} open={Boolean(assigneeAnchor)} onClose={() => setAssigneeAnchor(null)}>
//             {uniqueAssignees.map((name) => (
//               <MenuItem key={name} onClick={() => { setSelectedAssignee(name); setAssigneeAnchor(null); }}>
//                 {name} {selectedAssignee === name && <Check sx={{ fontSize: 14, color: '#973aa8', ml: 1 }} />}
//               </MenuItem>
//             ))}
//           </Menu>

//           {isFiltered && (
//             <Typography
//               onClick={clearFilters}
//               sx={{ fontSize: '13px', color: 'text.primary', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
//             >
//               Clear filters
//             </Typography>
//           )}
//         </Stack>

//         {/* ===== TABLE VIEW ===== */}
//         <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
//           <Table>
//             <TableHead sx={{ bgcolor: '#fafafa' }}>
//               <TableRow>
//                 <TableCell sx={{ fontWeight: 600 }}>Task Name</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Project</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Assignee</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredTasks.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={6} sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
//                     No tasks found.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredTasks.map((task: Task) => {
//                   const project = typeof task.project === 'object' ? task.project : null;
//                   return (
//                     <TableRow key={task._id} hover>
//                       <TableCell>
//                         <Typography>{task.title}</Typography>
//                         {task.description && (
//                           <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
//                             {task.description}
//                           </Typography>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <Chip label={project?.name || 'N/A'} size="small" variant="outlined" />
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           avatar={<Avatar sx={{ width: 20, height: 20, fontSize: 10 }}>{task.assignee?.[0] || '?'}</Avatar>}
//                           label={task.assignee || 'Unassigned'}
//                           size="small"
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           label={task.status}
//                           color={statusColors[task.status] || 'default'}
//                           size="small"
//                           sx={{ fontWeight: 500 }}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           label={task.priority}
//                           size="small"
//                           variant={task.priority === 'High' ? 'filled' : 'outlined'}
//                           color={task.priority === 'High' ? 'error' : 'default'}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     </Box>
//   );
// };

// import * as React from 'react';
// import {
//   Box,
//   Button,
//   Stack,
//   Typography,
//   IconButton,
//   TextField,
//   Menu,
//   MenuItem,
//   CircularProgress,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Avatar,
//   Card,
//   CardContent,
// } from "@mui/material";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   Search,
//   SwapVertOutlined,
//   KeyboardArrowDown,
//   TaskAlt,
//   Check,
//   CalendarMonth,
//   AssignmentIndOutlined,
// } from '@mui/icons-material';
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import type { DropResult } from "@hello-pangea/dnd";
// import { useGetTasksQuery, useUpdateTaskMutation } from '../services/taskApi';
// import { useGetProjectsQuery } from '../services/projectApi';
// import type { Task } from '../types/Project';

// // ==================== Helper ====================
// const statusColors: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
//   'Todo': 'default',
//   'In Progress': 'warning',
//   'Complete': 'success',
//   'Not Started': 'info',
// };

// // ==================== View Components ====================

// // ---------- Table View ----------
// const TaskTableView = ({ tasks }: { tasks: Task[] }) => {
//   return (
//     <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
//       <Table>
//         <TableHead sx={{ bgcolor: '#fafafa' }}>
//           <TableRow>
//             <TableCell sx={{ fontWeight: 600 }}>Task Name</TableCell>
//             <TableCell sx={{ fontWeight: 600 }}>Project</TableCell>
//             <TableCell sx={{ fontWeight: 600 }}>Assignee</TableCell>
//             <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
//             <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
//             <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {tasks.length === 0 ? (
//             <TableRow>
//               <TableCell colSpan={6} sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
//                 No tasks found.
//               </TableCell>
//             </TableRow>
//           ) : (
//             tasks.map((task) => {
//               const project = typeof task.project === 'object' ? task.project : null;
//               return (
//                 <TableRow key={task._id} hover>
//                   <TableCell>
//                     <Typography>{task.title}</Typography>
//                     {task.description && (
//                       <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
//                         {task.description}
//                       </Typography>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <Chip label={project?.name || 'N/A'} size="small" variant="outlined" />
//                   </TableCell>
//                   <TableCell>
//                     <Chip
//                       avatar={<Avatar sx={{ width: 20, height: 20, fontSize: 10 }}>{task.assignee?.[0] || '?'}</Avatar>}
//                       label={task.assignee || 'Unassigned'}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Chip
//                       label={task.status}
//                       color={statusColors[task.status] || 'default'}
//                       size="small"
//                       sx={{ fontWeight: 500 }}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Chip
//                       label={task.priority}
//                       size="small"
//                       variant={task.priority === 'High' ? 'filled' : 'outlined'}
//                       color={task.priority === 'High' ? 'error' : 'default'}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
//                   </TableCell>
//                 </TableRow>
//               );
//             })
//           )}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// // ---------- Status Board View ----------
// const StatusBoardView = ({ tasks, onUpdate }: { tasks: Task[]; onUpdate: (id: string, status: string) => Promise<void> }) => {
//   const navigate = useNavigate();
//   const COLUMNS = [
//     { id: 'Todo', label: 'Todo', color: '#a3c4f3' },
//     { id: 'In Progress', label: 'In Progress', color: '#ffadad' },
//     { id: 'Complete', label: 'Complete', color: '#a3b18a' },
//     { id: 'Not Started', label: 'Not Started', color: '#588157' },
//   ];

//   const [localTasks, setLocalTasks] = React.useState<Task[]>(tasks);

//   React.useEffect(() => {
//     setLocalTasks(tasks);
//   }, [tasks]);

//   const handleDragEnd = async (result: DropResult) => {
//     const { source, destination, draggableId } = result;
//     if (!destination) return;
//     if (source.droppableId === destination.droppableId && source.index === destination.index) return;

//     const movedTask = localTasks.find((t) => t._id === draggableId);
//     if (!movedTask) return;

//     // Optimistic update
//     const updatedTasks = Array.from(localTasks);
//     const sourceTasks = updatedTasks.filter((t) => t.status === source.droppableId);
//     const targetTask = sourceTasks[source.index];
//     const srcIdx = updatedTasks.indexOf(targetTask);
//     if (srcIdx !== -1) updatedTasks.splice(srcIdx, 1);

//     const updatedMoved = { ...targetTask, status: destination.droppableId as Task['status'] };

//     const destTasks = updatedTasks.filter((t) => t.status === destination.droppableId);
//     let destIdx = updatedTasks.length;
//     if (destination.index < destTasks.length) {
//       const next = destTasks[destination.index];
//       destIdx = updatedTasks.indexOf(next);
//     } else if (destTasks.length > 0) {
//       const last = destTasks[destTasks.length - 1];
//       destIdx = updatedTasks.indexOf(last) + 1;
//     }
//     updatedTasks.splice(destIdx, 0, updatedMoved);
//     setLocalTasks(updatedTasks);

//     // Backend update
//     try {
//       await onUpdate(targetTask._id, destination.droppableId);
//     } catch (err) {
//       console.error('Failed to update status:', err);
//       setLocalTasks(tasks);
//     }
//   };

//   return (
//     <DragDropContext onDragEnd={handleDragEnd}>
//       <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2, alignItems: 'start' }}>
//         {COLUMNS.map((col) => {
//           const colTasks = localTasks.filter((t) => t.status === col.id);
//           return (
//             <Box key={col.id}>
//               <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, pl: 1, textTransform: 'uppercase', color: col.color }}>
//                 {col.label} ({colTasks.length})
//               </Typography>
//               <Droppable droppableId={col.id}>
//                 {(provided) => (
//                   <Paper {...provided.droppableProps} ref={provided.innerRef} elevation={0} sx={{ p: 1.5, bgcolor: '#f5f5f5', minHeight: '200px', borderRadius: 2, border: `1px solid ${col.color}` }}>
//                     <Stack spacing={2}>
//                       {colTasks.map((task, index) => (
//                         <Draggable key={task._id} draggableId={task._id} index={index}>
//                           {(provided) => (
//                             <Card
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                               sx={{ boxShadow: '0px 2px 4px rgba(0,0,0,0.05)', borderRadius: 2, borderLeft: `5px solid ${col.color}`, cursor: 'pointer', '&:hover': { boxShadow: '0px 4px 8px rgba(0,0,0,0.1)' } }}
//                               onClick={() => navigate(`/task-detail/${task._id}`)}
//                             >
//                               <CardContent sx={{ p: 2 }}>
//                                 <Typography variant="subtitle1" >{task.title}</Typography>
//                                 {task.description && (
//                                   <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mt: 0.5 }}>
//                                     {task.description}
//                                   </Typography>
//                                 )}
//                                 <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
//                                   {task.priority && <Chip label={task.priority} size="small" variant="outlined" color={task.priority === 'High' ? 'error' : 'default'} />}
//                                   {task.assignee && <Chip avatar={<Avatar sx={{ width: 16, height: 16, fontSize: 10 }}>{task.assignee[0]}</Avatar>} label={task.assignee} size="small" />}
//                                 </Stack>
//                                 {task.dueDate && (
//                                   <Stack direction="row" sx={{ mt: 1, alignItems: 'center', color: 'text.secondary' }}>
//                                     <CalendarMonth sx={{ fontSize: 16, mr: 0.5 }} />
//                                     <Typography variant="caption">{new Date(task.dueDate).toLocaleDateString()}</Typography>
//                                   </Stack>
//                                 )}
//                               </CardContent>
//                             </Card>
//                           )}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}
//                     </Stack>
//                   </Paper>
//                 )}
//               </Droppable>
//             </Box>
//           );
//         })}
//       </Box>
//     </DragDropContext>
//   );
// };

// // ---------- Assignee Board View ----------
// const AssigneeBoardView = ({ tasks, onUpdate }: { tasks: Task[]; onUpdate: (id: string, assignee: string) => Promise<void> }) => {
//   const navigate = useNavigate();
//   const uniqueAssignees = React.useMemo(() => {
//     const list = tasks.map((t) => t.assignee).filter(Boolean);
//     return Array.from(new Set(list));
//   }, [tasks]);

//   const [localTasks, setLocalTasks] = React.useState<Task[]>(tasks);

//   React.useEffect(() => {
//     setLocalTasks(tasks);
//   }, [tasks]);

//   const handleDragEnd = async (result: DropResult) => {
//     const { source, destination, draggableId } = result;
//     if (!destination) return;
//     if (source.droppableId === destination.droppableId && source.index === destination.index) return;

//     const movedTask = localTasks.find((t) => t._id === draggableId);
//     if (!movedTask) return;

//     // Optimistic
//     const updatedTasks = Array.from(localTasks);
//     const sourceTasks = updatedTasks.filter((t) => t.assignee === source.droppableId);
//     const targetTask = sourceTasks[source.index];
//     const srcIdx = updatedTasks.indexOf(targetTask);
//     if (srcIdx !== -1) updatedTasks.splice(srcIdx, 1);

//     const updatedMoved = { ...targetTask, assignee: destination.droppableId };

//     const destTasks = updatedTasks.filter((t) => t.assignee === destination.droppableId);
//     let destIdx = updatedTasks.length;
//     if (destination.index < destTasks.length) {
//       const next = destTasks[destination.index];
//       destIdx = updatedTasks.indexOf(next);
//     } else if (destTasks.length > 0) {
//       const last = destTasks[destTasks.length - 1];
//       destIdx = updatedTasks.indexOf(last) + 1;
//     }
//     updatedTasks.splice(destIdx, 0, updatedMoved);
//     setLocalTasks(updatedTasks);

//     try {
//       await onUpdate(targetTask._id, destination.droppableId);
//     } catch (err) {
//       console.error('Failed to update assignee:', err);
//       setLocalTasks(tasks);
//     }
//   };

//   return (
//     <DragDropContext onDragEnd={handleDragEnd}>
//       <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: `repeat(${Math.min(uniqueAssignees.length, 4)}, 1fr)` }, gap: 2, alignItems: 'start' }}>
//         {uniqueAssignees.map((assignee) => {
//           const colTasks = localTasks.filter((t) => t.assignee === assignee);
//           return (
//             <Box key={assignee}>
//               <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, pl: 1, textTransform: 'uppercase', color: '#973aa8', display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                 <AssignmentIndOutlined sx={{ fontSize: 16 }} />
//                 {assignee} ({colTasks.length})
//               </Typography>
//               <Droppable droppableId={assignee}>
//                 {(provided) => (
//                   <Paper {...provided.droppableProps} ref={provided.innerRef} elevation={0} sx={{ p: 1.5, bgcolor: '#f5f5f5', minHeight: '200px', borderRadius: 2, border: '1px solid #dfdfdf' }}>
//                     <Stack spacing={2}>
//                       {colTasks.map((task, index) => (
//                         <Draggable key={task._id} draggableId={task._id} index={index}>
//                           {(provided) => (
//                             <Card
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                               sx={{ boxShadow: '0px 2px 4px rgba(0,0,0,0.05)', borderRadius: 2, borderLeft: '5px solid #973aa8', cursor: 'pointer', '&:hover': { boxShadow: '0px 4px 8px rgba(0,0,0,0.1)' } }}
//                               onClick={() => navigate(`/task-detail/${task._id}`)}
//                             >
//                               <CardContent sx={{ p: 2 }}>
//                                 <Typography variant="subtitle1" >{task.title}</Typography>
//                                 {task.description && (
//                                   <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mt: 0.5 }}>
//                                     {task.description}
//                                   </Typography>
//                                 )}
//                                 <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
//                                   {task.priority && <Chip label={task.priority} size="small" variant="outlined" color={task.priority === 'High' ? 'error' : 'default'} />}
//                                   <Chip label={task.status} size="small" color={statusColors[task.status] || 'default'} />
//                                 </Stack>
//                                 {task.dueDate && (
//                                   <Stack direction="row" sx={{ mt: 1, alignItems: 'center', color: 'text.secondary' }}>
//                                     <CalendarMonth sx={{ fontSize: 16, mr: 0.5 }} />
//                                     <Typography variant="caption">{new Date(task.dueDate).toLocaleDateString()}</Typography>
//                                   </Stack>
//                                 )}
//                               </CardContent>
//                             </Card>
//                           )}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}
//                     </Stack>
//                   </Paper>
//                 )}
//               </Droppable>
//             </Box>
//           );
//         })}
//       </Box>
//     </DragDropContext>
//   );
// };

// // ==================== Main Component ====================
// export const MyTaskNote = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const projectIdParam = new URLSearchParams(location.search).get('project') || undefined;

//   // View mode
//   const [viewMode, setViewMode] = React.useState<'list' | 'status' | 'assignee'>('list');

//   // Filters
//   const [selectedStatus, setSelectedStatus] = React.useState<string>("All");
//   const [selectedAssignee, setSelectedAssignee] = React.useState<string>("All");
//   const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
//   const [searchText, setSearchText] = React.useState<string>("");
//   const [searchOpen, setSearchOpen] = React.useState<boolean>(false);

//   // Dropdown anchors
//   const [statusAnchor, setStatusAnchor] = React.useState<null | HTMLElement>(null);
//   const [assigneeAnchor, setAssigneeAnchor] = React.useState<null | HTMLElement>(null);

//   // Get project name
//   const { data: projects } = useGetProjectsQuery();
//   const projectName = React.useMemo(() => {
//     if (!projects || !projectIdParam) return null;
//     const project = projects.find((p) => p._id === projectIdParam);
//     return project?.name || 'Unknown Project';
//   }, [projects, projectIdParam]);

//   // Fetch tasks
//   const { data: tasks = [], isLoading, isError, refetch } = useGetTasksQuery({ projectId: projectIdParam });
//   const [updateTask] = useUpdateTaskMutation();

//   // Unique filter values
//   const uniqueStatuses = React.useMemo(() => {
//     const statuses = tasks.map((t: Task) => t.status);
//     return ['All', ...Array.from(new Set(statuses))];
//   }, [tasks]);

//   const uniqueAssignees = React.useMemo(() => {
//     const assignees = tasks.map((t: Task) => t.assignee).filter(Boolean);
//     return ['All', ...Array.from(new Set(assignees))];
//   }, [tasks]);

//   // Filter and sort tasks
//   const filteredTasks = React.useMemo(() => {
//     let result = tasks;

//     if (searchText.trim()) {
//       const lower = searchText.toLowerCase();
//       result = result.filter((t: Task) =>
//         t.title.toLowerCase().includes(lower) ||
//         (typeof t.project === 'object' && t.project.name.toLowerCase().includes(lower)) ||
//         t.assignee.toLowerCase().includes(lower)
//       );
//     }

//     if (selectedStatus !== 'All') {
//       result = result.filter((t: Task) => t.status === selectedStatus);
//     }

//     if (selectedAssignee !== 'All') {
//       result = result.filter((t: Task) => t.assignee === selectedAssignee);
//     }

//     return [...result].sort((a, b) =>
//       sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
//     );
//   }, [tasks, searchText, selectedStatus, selectedAssignee, sortOrder]);

//   const clearFilters = () => {
//     setSearchText('');
//     setSelectedStatus('All');
//     setSelectedAssignee('All');
//   };

//   const isFiltered = selectedStatus !== 'All' || selectedAssignee !== 'All' || searchText !== '';

//   // Drag & Drop update handler
//   const handleUpdate = async (id: string, field: string, value: string) => {
//     await updateTask({ id, body: { [field]: value } }).unwrap();
//     refetch();
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
//       <Typography color="error" sx={{ textAlign: "center", mt: 5 }}>
//         Unable to load tasks. Please try again later.
//       </Typography>
//     );
//   }

//   return (
//     <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "background.default" }}>
//       <Box sx={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 54px' }}>

//         {/* Title */}
//         <Typography variant="h6" sx={{ fontSize: "16px", color: 'text.primary', mb: 3 }}>
//           My Tasks
//         </Typography>

//         {/* Toolbar */}
//         <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", borderBottom: '1px solid #ededed', pb: 1, mb: 2 }}>
//           <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
//             <Button
//               startIcon={<TaskAlt sx={{ fontSize: '16px' }} />}
//               sx={{
//                 textTransform: 'none',
//                 color: '#37352f',
//                 fontSize: '14px',
//                 bgcolor: '#f1f1ef',
//                 borderRadius: '6px',
//                 px: 1.5,
//                 py: 0.5,
//                 '&:hover': { bgcolor: '#e3e2e0' }
//               }}
//             >
//               Tasks
//             </Button>
//             {projectIdParam && (
//               <Chip
//                 label={`Filtered by: ${projectName || 'Loading...'}`}
//                 size="small"
//                 onDelete={() => navigate('/my-tasks')}
//                 sx={{ fontWeight: 500 }}
//               />
//             )}
//           </Stack>

//           <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
//             <IconButton
//               size="small"
//               onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
//               sx={{
//                 color: sortOrder === 'desc' ? '#973aa8' : 'text.primary',
//                 bgcolor: sortOrder === 'desc' ? 'background.default' : 'transparent',
//                 borderRadius: '4px',
//                 transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                 '& .MuiSvgIcon-root': {
//                   transition: 'transform 0.3s ease',
//                   transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)',
//                 },
//                 '&:hover': {
//                   bgcolor: sortOrder === 'desc' ? '#e3f2fd' : '#f1f1ef'
//                 }
//               }}
//             >
//               <SwapVertOutlined fontSize="small" />
//             </IconButton>

//             <IconButton
//               size="small"
//               sx={{ color: 'text.primary', mr: searchOpen ? 1 : 0, borderRadius: '4px' }}
//               onClick={() => setSearchOpen((prev) => !prev)}
//             >
//               <Search fontSize="small" />
//             </IconButton>

//             {searchOpen && (
//               <TextField
//                 size="small"
//                 autoFocus
//                 placeholder="Search tasks, projects, assignees..."
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 sx={{
//                   width: 220,
//                   mr: 1,
//                   '& .MuiOutlinedInput-root': {
//                     height: 28,
//                     fontSize: '13px',
//                     borderRadius: '4px',
//                     '& fieldset': { borderColor: '#ededed' },
//                     '&:hover fieldset': { borderColor: '#dfdfdf' },
//                     '&.Mui-focused fieldset': { borderColor: '#973aa8', borderWidth: '1px' },
//                   },
//                   '& .MuiOutlinedInput-input': { py: 0.5, px: 1 }
//                 }}
//               />
//             )}

//             <Button
//               variant="contained"
//               disableElevation
//               onClick={() => navigate("/my-tasks/new")}
//               sx={{
//                 backgroundColor: '#dec9e9',
//                 textTransform: 'none',
//                 fontWeight: 500,
//                 fontSize: '13px',
//                 padding: '4px 12px',
//                 borderRadius: '4px',
//                 '&:hover': { backgroundColor: '#973aa8', color: "#ffffff" },
//                 transition: '0.15s'
//               }}
//             >
//               New task
//             </Button>
//           </Stack>
//         </Stack>

//         {/* 🔥 View Mode Buttons: List | Status | Assignee */}
//         <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
//           <Button
//             variant={viewMode === 'list' ? 'contained' : 'outlined'}
//             onClick={() => setViewMode('list')}
//             sx={{ textTransform: 'none', borderRadius: 2 }}
//           >
//             List
//           </Button>
//           <Button
//             variant={viewMode === 'status' ? 'contained' : 'outlined'}
//             onClick={() => setViewMode('status')}
//             sx={{ textTransform: 'none', borderRadius: 2 }}
//           >
//             Status
//           </Button>
//           <Button
//             variant={viewMode === 'assignee' ? 'contained' : 'outlined'}
//             onClick={() => setViewMode('assignee')}
//             sx={{ textTransform: 'none', borderRadius: 2 }}
//           >
//             Assignee
//           </Button>
//         </Stack>

//         {/* 🔥 Filter Row: Status & Assignee Dropdowns */}
//         <Stack direction="row" spacing={2} sx={{ mb: 4, alignItems: "center", flexWrap: 'wrap' }}>
//           <Button
//             endIcon={<KeyboardArrowDown sx={{ fontSize: 14 }} />}
//             onClick={(e) => setStatusAnchor(e.currentTarget)}
//             sx={{
//               textTransform: 'none',
//               color: selectedStatus !== 'All' ? '#973aa8' : 'text.primary',
//               fontWeight: selectedStatus !== 'All' ? 600 : 400,
//               fontSize: '14px',
//               p: 0,
//               '&:hover': { bgcolor: 'transparent' }
//             }}
//           >
//             Status: {selectedStatus}
//           </Button>
//           <Menu anchorEl={statusAnchor} open={Boolean(statusAnchor)} onClose={() => setStatusAnchor(null)}>
//             {uniqueStatuses.map((status) => (
//               <MenuItem key={status} onClick={() => { setSelectedStatus(status); setStatusAnchor(null); }}>
//                 {status} {selectedStatus === status && <Check sx={{ fontSize: 14, color: '#973aa8', ml: 1 }} />}
//               </MenuItem>
//             ))}
//           </Menu>

//           <Button
//             endIcon={<KeyboardArrowDown sx={{ fontSize: 14 }} />}
//             onClick={(e) => setAssigneeAnchor(e.currentTarget)}
//             sx={{
//               textTransform: 'none',
//               color: selectedAssignee !== 'All' ? '#973aa8' : 'text.primary',
//               fontWeight: selectedAssignee !== 'All' ? 600 : 400,
//               fontSize: '14px',
//               p: 0,
//               '&:hover': { bgcolor: 'transparent' }
//             }}
//           >
//             Assignee: {selectedAssignee}
//           </Button>
//           <Menu anchorEl={assigneeAnchor} open={Boolean(assigneeAnchor)} onClose={() => setAssigneeAnchor(null)}>
//             {uniqueAssignees.map((name) => (
//               <MenuItem key={name} onClick={() => { setSelectedAssignee(name); setAssigneeAnchor(null); }}>
//                 {name} {selectedAssignee === name && <Check sx={{ fontSize: 14, color: '#973aa8', ml: 1 }} />}
//               </MenuItem>
//             ))}
//           </Menu>

//           {isFiltered && (
//             <Typography
//               onClick={clearFilters}
//               sx={{ fontSize: '13px', color: 'text.primary', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
//             >
//               Clear filters
//             </Typography>
//           )}
//         </Stack>

//         {/* ===== Render View Based on Mode ===== */}
//         {viewMode === 'list' && <TaskTableView tasks={filteredTasks} />}
//         {viewMode === 'status' && (
//           <StatusBoardView
//             tasks={filteredTasks}
//             onUpdate={(id, status) => handleUpdate(id, 'status', status)}
//           />
//         )}
//         {viewMode === 'assignee' && (
//           <AssigneeBoardView
//             tasks={filteredTasks}
//             onUpdate={(id, assignee) => handleUpdate(id, 'assignee', assignee)}
//           />
//         )}
//       </Box>
//     </Box>
//   );
// };


import * as React from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
  TextField,
  Menu,
  MenuItem,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  SwapVertOutlined,
  KeyboardArrowDown,
  TaskAlt,
  Check,
} from '@mui/icons-material';
import { useGetTasksQuery } from '../services/taskApi';
import { useGetProjectsQuery } from '../services/projectApi';
import type { Task } from '../types/Project';

// Helper for status colors
const statusColors: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  'Todo': 'default',
  'In Progress': 'warning',
  'Complete': 'success',
  'Not Started': 'info',
};

export const MyTaskNote = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const projectIdParam = new URLSearchParams(location.search).get('project') || undefined;

  
  const { data: projects } = useGetProjectsQuery();

  const projectName = React.useMemo(() => {
    if (!projects || !projectIdParam) return null;
    const project = projects.find((p) => p._id === projectIdParam);
    return project?.name || 'Unknown Project';
  }, [projects, projectIdParam]);

  const getAssigneeDisplay = (assignee: Task['assignee']) => {
  if (!assignee) return 'Unassigned';
  if (typeof assignee === 'object' && 'username' in assignee) {
    return assignee.username;
  }
  return assignee; // fallback to string ID
};

// const getAssigneeInitial = (assignee: Task['assignee']) => {
//   if (!assignee) return '?';
//   if (typeof assignee === 'object' && 'username' in assignee) {
//     return assignee.username.charAt(0).toUpperCase();
//   }
//   return assignee.charAt(0).toUpperCase();
// };

const getAssigneeInitial = (assignee: Task['assignee']) => {
  const display = getAssigneeDisplay(assignee);
  return display !== 'Unassigned' ? display.charAt(0).toUpperCase() : '?';
};

  // Filter states
  const [selectedStatus, setSelectedStatus] = React.useState<string>("All");
  const [selectedAssignee, setSelectedAssignee] = React.useState<string>("All");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  const [searchText, setSearchText] = React.useState<string>("");
  const [searchOpen, setSearchOpen] = React.useState<boolean>(false);

  // Dropdown anchors
  const [statusAnchor, setStatusAnchor] = React.useState<null | HTMLElement>(null);
  const [assigneeAnchor, setAssigneeAnchor] = React.useState<null | HTMLElement>(null);

  // Fetch tasks
  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useGetTasksQuery({ projectId: projectIdParam });

  // Compute unique statuses and assignees from tasks (for dropdowns)
  const uniqueStatuses = React.useMemo(() => {
    const statuses = tasks.map((t: Task) => t.status);
    return ['All', ...Array.from(new Set(statuses))];
  }, [tasks]);

  // const uniqueAssignees = React.useMemo(() => {
  //   const assignees = tasks.map((t: Task) => t.assignee).filter(Boolean);
  //   return ['All', ...Array.from(new Set(assignees))];
  // }, [tasks]);

  const uniqueAssignees = React.useMemo(() => {
  const assignees = tasks.map((t: Task) => {
    if (!t.assignee) return null;
    if (typeof t.assignee === 'object' && 'username' in t.assignee) {
      return t.assignee.username;
    }
    return t.assignee; // string ID
  }).filter(Boolean);
  return ['All', ...Array.from(new Set(assignees))];
}, [tasks]);

  // Filter and sort tasks
  const filteredTasks = React.useMemo(() => {
    let result = tasks;

    // ၁။ Search
    if (searchText.trim()) {
      const lower = searchText.toLowerCase();
      result = result.filter((t: Task) =>
        t.title.toLowerCase().includes(lower) ||
        (typeof t.project === 'object' && t.project.name.toLowerCase().includes(lower)) ||
        getAssigneeDisplay(t.assignee).toLowerCase().includes(lower)
      );
    }

 
    if (selectedStatus !== 'All') {
      result = result.filter((t: Task) => t.status === selectedStatus);
    }


    if (selectedAssignee !== 'All') {
  result = result.filter((t: Task) => {
    const display = getAssigneeDisplay(t.assignee);
        return display === selectedAssignee;
  //   const assigneeVal = t.assignee;
  //   if (!assigneeVal) return false;
  //   if (typeof assigneeVal === 'object' && 'username' in assigneeVal) {
  //     return assigneeVal.username === selectedAssignee;
  //   }
  //   return assigneeVal === selectedAssignee;
  });
}

    // ၄။ Sort by title (copy before sort)
    return [...result].sort((a, b) =>
      sortOrder === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );
  }, [tasks, searchText, selectedStatus, selectedAssignee, sortOrder]);

  const clearFilters = () => {
    setSearchText('');
    setSelectedStatus('All');
    setSelectedAssignee('All');
  };

  const isFiltered =
    selectedStatus !== 'All' ||
    selectedAssignee !== 'All' ||
    searchText !== '';

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
        Unable to load tasks. Please try again later.
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "background.default" }}>
      <Box sx={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 54px' }}>

        {/* Title */}
        <Typography variant="h6" sx={{ fontSize: "16px", color: 'text.primary', mb: 3 }}>
          My Tasks
        </Typography>

        {/* Toolbar */}
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", borderBottom: '1px solid #ededed', pb: 1, mb: 2 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Button
              startIcon={<TaskAlt sx={{ fontSize: '16px' }} />}
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
              Tasks
            </Button>
            {projectIdParam && (
              <Chip
                label={`Filtered by: ${projectName || 'Loading...'}`}
                size="small"
                onDelete={() => navigate('/my-tasks')}
                sx={{ fontWeight: 500 }}
              />
            )}
          </Stack>

          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            {/* Sort */}
            <IconButton
              size="small"
              onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
              sx={{
                color: sortOrder === 'desc' ? '#973aa8' : 'text.primary',
                bgcolor: sortOrder === 'desc' ? 'background.default' : 'transparent',
                borderRadius: '4px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '& .MuiSvgIcon-root': {
                  transition: 'transform 0.3s ease',
                  transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)',
                },
                '&:hover': {
                  bgcolor: sortOrder === 'desc' ? '#e3f2fd' : '#f1f1ef'
                }
              }}
            >
              <SwapVertOutlined fontSize="small" />
            </IconButton>

            {/* Search toggle */}
            <IconButton
              size="small"
              sx={{ color: 'text.primary', mr: searchOpen ? 1 : 0, borderRadius: '4px' }}
              onClick={() => setSearchOpen((prev) => !prev)}
            >
              <Search fontSize="small" />
            </IconButton>

            {searchOpen && (
              <TextField
                size="small"
                autoFocus
                placeholder="Search tasks, projects, assignees..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                sx={{
                  width: 220,
                  mr: 1,
                  '& .MuiOutlinedInput-root': {
                    height: 28,
                    fontSize: '13px',
                    borderRadius: '4px',
                    '& fieldset': { borderColor: '#ededed' },
                    '&:hover fieldset': { borderColor: '#dfdfdf' },
                    '&.Mui-focused fieldset': { borderColor: '#973aa8', borderWidth: '1px' },
                  },
                  '& .MuiOutlinedInput-input': { py: 0.5, px: 1 }
                }}
              />
            )}

            {/* New Task button */}
            <Button
              variant="contained"
              disableElevation
              onClick={() => navigate("/my-tasks/task-create-note")}
              sx={{
                backgroundColor: '#973aa8',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '13px',
                padding: '4px 12px',
                borderRadius: '4px',
                '&:hover': { backgroundColor: '#7e3a8a' },
                transition: '0.15s',
                color:'#ffffff'
              }}
            >
              New task
            </Button>
          </Stack>
        </Stack>

        {/* 🔥 Filter Row: List (static) | Status: All (dropdown) | Assignee: All (dropdown) */}
        <Stack direction="row" spacing={2} sx={{ mb: 4, alignItems: "center", flexWrap: 'wrap' }}>
          {/* Static List Label */}
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              fontSize: '14px',
              color: 'text.primary',
              mr: 1,
            }}
          >
            List
          </Typography>

          {/* Status Dropdown */}
          <Button
            endIcon={<KeyboardArrowDown sx={{ fontSize: 14 }} />}
            onClick={(e) => setStatusAnchor(e.currentTarget)}
            sx={{
              textTransform: 'none',
              color: selectedStatus !== 'All' ? '#973aa8' : 'text.primary',
              fontWeight: selectedStatus !== 'All' ? 600 : 400,
              fontSize: '14px',
              p: 0,
              '&:hover': { bgcolor: 'transparent' }
            }}
          >
            Status: {selectedStatus}
          </Button>
          <Menu anchorEl={statusAnchor} open={Boolean(statusAnchor)} onClose={() => setStatusAnchor(null)}>
            {uniqueStatuses.map((status) => (
              <MenuItem key={status} onClick={() => { setSelectedStatus(status); setStatusAnchor(null); }}>
                {status} {selectedStatus === status && <Check sx={{ fontSize: 14, color: '#973aa8', ml: 1 }} />}
              </MenuItem>
            ))}
          </Menu>

          {/* Assignee Dropdown */}
          <Button
            endIcon={<KeyboardArrowDown sx={{ fontSize: 14 }} />}
            onClick={(e) => setAssigneeAnchor(e.currentTarget)}
            sx={{
              textTransform: 'none',
              color: selectedAssignee !== 'All' ? '#973aa8' : 'text.primary',
              fontWeight: selectedAssignee !== 'All' ? 600 : 400,
              fontSize: '14px',
              p: 0,
              '&:hover': { bgcolor: 'transparent' }
            }}
          >
            Assignee: {selectedAssignee}
          </Button>
          <Menu anchorEl={assigneeAnchor} open={Boolean(assigneeAnchor)} onClose={() => setAssigneeAnchor(null)}>
            {uniqueAssignees.map((name) => (
              <MenuItem key={name} onClick={() => { setSelectedAssignee(name); setAssigneeAnchor(null); }}>
                {name} {selectedAssignee === name && <Check sx={{ fontSize: 14, color: '#973aa8', ml: 1 }} />}
              </MenuItem>
            ))}
          </Menu>

          {isFiltered && (
            <Typography
              onClick={clearFilters}
              sx={{ fontSize: '13px', color: 'text.primary', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              Clear filters
            </Typography>
          )}
        </Stack>

        {/* ===== TABLE VIEW (List) ===== */}
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#fafafa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Task Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Project</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Assignee</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                    No tasks found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task: Task) => {
                  const project = typeof task.project === 'object' ? task.project : null;
                  return (
                    <TableRow key={task._id} hover onClick={() =>   navigate(`/my-tasks/task-detail/${task._id}`)}>
                      <TableCell>
                        <Typography>{task.title}</Typography>
                        {task.description && (
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                            {task.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip label={project?.name || 'N/A'} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          avatar={<Avatar sx={{ width: 20, height: 20, fontSize: 10 }}>{getAssigneeInitial(task.assignee)}</Avatar>}
                    label={ getAssigneeDisplay(task.assignee)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={task.status}
                          color={statusColors[task.status] || 'default'}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={task.priority}
                          size="small"
                          variant={task.priority === 'High' ? 'filled' : 'outlined'}
                          color={task.priority === 'High' ? 'error' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};