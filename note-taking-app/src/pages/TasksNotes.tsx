
// import { Box ,Button, Stack,Typography,Tabs,Tab,IconButton, TextField,CircularProgress  } from "@mui/material";
// import React,{ useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { KeyboardArrowDown } from "@mui/icons-material";
// import {Search , SwapVertOutlined} from "@mui/icons-material";
// import { TaskLayout } from "../components/notelayout/TaskLayout";
// import type {Note} from "../types/Note";
// import { useGetNotesQuery } from "../services/noteApi";
// import { TaskNotesStatus } from "../components/status-page/TaskNotesStatus";


// export const TasksNotes = () => {
//    const navigate = useNavigate();


//    const [searchOpen, setSearchOpen] = useState<boolean>(false);
//   const [searchText, setSearchText] = useState<string>("");
//        const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
     
   
//      const { data: notes = [], isLoading, isError } = useGetNotesQuery();

//      const filteredNotes = React.useMemo<Note[]>(() => {
//              if (!Array.isArray(notes)) return [];
         
//              return notes.filter((note: Note) => {
//                if (searchText.trim() !== "") {
//                  const titleText = (note.title || "").toLowerCase();
//                  const searchTarget = searchText.toLowerCase();
//                  if (!titleText.includes(searchTarget)) return false;
//                }
       
//                return true;
//              })
//               .sort((a, b) => {
//                const titleA = (a.title || "").toLowerCase();
//                const titleB = (b.title || "").toLowerCase();
         
//                return sortOrder === "asc"
//                  ? titleA.localeCompare(titleB)
//                  : titleB.localeCompare(titleA);
//              });
         
//            }, [ notes,  searchText,sortOrder]);


  
//       const [currentTab, setCurrentTab] = useState<number>(0);

//        if (isLoading) {
//           return (
//             <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
//               <CircularProgress />
//             </Box>
//           );
//         }
      
//         if (isError) {
//           return (
//             <Typography color="error" sx={{ textAlign: 'center', mt: 5 }}>
//               Unable to load projects.
//             </Typography>
//           );
//         }

//   return (
//   <Box>
//     <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' ,bgcolor:"background.default"}}>
      
//       {/* Header Section */}
//       <Box sx={{ mb: 1 }}>
//         <Typography variant="h3" sx={{ fontWeight: 500, color: 'text.primary', mb: 1, fontSize: '18px' }}>
//           Tasks Tracker
//         </Typography>
//         <Typography variant="body1" sx={{ color: 'text.primary', fontSize: '16px' }}>
//           Stay organized with tasks, your way.
//         </Typography>
//       </Box>

//       {/* Navigation Toolbar */}
//       <Stack direction="row"  sx={{justifyContent:"space-between",alignItems:"center", mt: 3, mb: 2, borderBottom: '1px solid #ededed', pb: 0.5 }}>
//         <Tabs 
//           value={currentTab} 
//           onChange={(_, newValue) => setCurrentTab(newValue)}
//           sx={{
//             minHeight: 'auto',
//             '& .MuiTabs-indicator': { bgcolor:"background.default", height: '2px' },
//             '& .MuiTab-root': { 
//               textTransform: 'none', 
//               fontWeight: 500, 
//               fontSize: '0.9rem', 
//               minWidth: 'auto', 
//               padding: '6px 12px',
//               color: '#6b6a65',
//               '&.Mui-selected': { color: 'text.primary' }
//             }
//           }}
//         >
//           <Tab label="All Tasks" />
//           <Tab label="By Status"  />
//         </Tabs>

//         {/* Right side controls */}
//         <Stack direction="row" spacing={1} sx={{alignItems:"center",}}>
          
//            <IconButton size="small" onClick={() =>
//                               setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
//                             }
//                            sx={{ color: sortOrder === 'desc' ? '#973aa8' : 'text.primary', 
//                                           bgcolor: sortOrder === 'desc' ? 'background.default' : 'transparent',
//                                           borderRadius: '4px',
//                                           transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
//                                           '& .MuiSvgIcon-root': {
//                                             transition: 'transform 0.3s ease',
//                                             transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)', 
//                                           },
//                                           '&:hover': {
//                                             bgcolor: sortOrder === 'desc' ? 'background.default' : 'transparent'
//                                           }}}><SwapVertOutlined fontSize="small" /></IconButton>
//           {/* <IconButton size="small" sx={{ color: '#6b6a65' }} onClick={() => setSearchOpen((prev) => !prev)}>
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
//                   backgroundColor: '#ffffff',
//                   borderRadius: '4px',
//                 },
//                 '& .MuiOutlinedInput-input': {
//                   py: 0.5,
//                   px: 1,
//                 },
//               }}
//             />
//           )}
//            */}
//              <IconButton size="small" sx={{ color: 'text.primary', mr: searchOpen ? 1 : 0, borderRadius: '4px'}} onClick={() => setSearchOpen((prev) => !prev)}>
//                              <Search fontSize="small" />
//                            </IconButton>
//                            {searchOpen && (
//                              <TextField
//                                size="small"
//                                autoFocus
//                                placeholder="Search text"
//                                value={searchText}
//                                onChange={(event) => setSearchText(event.target.value)}
//                                sx={{
//                                  width: 180,
//                                  '& .MuiOutlinedInput-root': {
//                                    height: 30,
//                                    fontSize: '12px',
//                                    bgcolor:'background.default',
//                                    borderRadius: '4px',
//                                  },
//                                  '& .MuiOutlinedInput-input': {
//                                    py: 0.5,
//                                    px: 1,
//                                  },
//                                }}
//                              />
//                            )}
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
//               '&:hover': { backgroundColor: '#973aa8', color: "#ffffff" }
//             }}
//            onClick={() => navigate("/note-form/create")} 
//           >
//             New
            
//               <KeyboardArrowDown sx={{ fontSize:12,m:0.2}}/>
           
            
//           </Button>
//           </Stack>
//           </Stack>
//           {currentTab === 0 && (
//   <TaskLayout  />
// )}

//        {currentTab === 1 && (
//   <TaskNotesStatus  filteredNotes={filteredNotes} />
// )}
//           </Box>
//   </Box>
//   )
// }

import { Box, Button, Stack, Typography, Tabs, Tab, IconButton, TextField, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyboardArrowDown } from "@mui/icons-material";
import { Search, SwapVertOutlined } from "@mui/icons-material";
import { TaskLayout } from "../components/notelayout/TaskLayout";
import type { Note } from "../types/Note";
import { useGetNotesQuery } from "../services/noteApi";
// import { TaskNotesStatus } from "../components/status-page/TaskNotesStatus";

export const TasksNotes = () => {
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  const { data: notes = [], isLoading, isError, refetch } = useGetNotesQuery();

 
  const filteredNotes = React.useMemo<Note[]>(() => {
    if (!Array.isArray(notes)) return [];

    const statusKeywords = ["todo", "in progress", "complete", "not started"];
    const searchLower = searchText.trim().toLowerCase();

    
    let effectiveStatus: string | null = null;
    if (searchLower !== "") {
      const matched = statusKeywords.find(keyword => keyword === searchLower);
      if (matched) {
        if (matched === "todo") effectiveStatus = "Todo";
        else if (matched === "in progress") effectiveStatus = "In Progress";
        else if (matched === "complete") effectiveStatus = "Complete";
        else if (matched === "not started") effectiveStatus = "Not Started";
      }
    }

    return notes
      .filter((note: Note) => {
        // status filter (case-insensitive)
        if (effectiveStatus !== null) {
          const currentStatus = (note.task || note.category || "").trim().toLowerCase();
          if (currentStatus !== effectiveStatus.toLowerCase()) return false;
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
  }, [notes, searchText, sortOrder]);

  const [currentTab, setCurrentTab] = useState<number>(0);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" sx={{ textAlign: 'center', mt: 5 }}>
        Unable to load projects.
      </Typography>
    );
  }

  return (
    <Box>
      <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
        {/* Header Section */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="h3" sx={{ fontWeight: 500, color: 'text.primary', mb: 1, fontSize: '18px' }}>
            Tasks Tracker
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.primary', fontSize: '16px' }}>
            Stay organized with tasks, your way.
          </Typography>
        </Box>

        {/* Navigation Toolbar */}
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mt: 3, mb: 2, borderBottom: '1px solid #ededed', pb: 0.5 }}>
          <Tabs
            value={currentTab}
            onChange={(_, newValue) => setCurrentTab(newValue)}
            sx={{
              minHeight: 'auto',
              '& .MuiTabs-indicator': { bgcolor: "background.default", height: '2px' },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.9rem',
                minWidth: 'auto',
                padding: '6px 12px',
                color: '#6b6a65',
                '&.Mui-selected': { color: 'text.primary' }
              }
            }}
          >
            <Tab label="Create Tasks" />
            {/* <Tab label="By Status" /> */}
          </Tabs>

          {/* Right side controls */}
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
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
                  bgcolor: sortOrder === 'desc' ? 'background.default' : 'transparent'
                }
              }}
            >
              <SwapVertOutlined fontSize="small" />
            </IconButton>

            <IconButton size="small" sx={{ color: 'text.primary', mr: searchOpen ? 1 : 0, borderRadius: '4px' }} onClick={() => setSearchOpen((prev) => !prev)}>
              <Search fontSize="small" />
            </IconButton>
            {searchOpen && (
              <TextField
                size="small"
                autoFocus
                placeholder="Search by status"   
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                sx={{
                  width: 180,
                  '& .MuiOutlinedInput-root': {
                    height: 30,
                    fontSize: '12px',
                    bgcolor: 'background.default',
                    borderRadius: '4px',
                  },
                  '& .MuiOutlinedInput-input': {
                    py: 0.5,
                    px: 1,
                  },
                }}
              />
            )}

            <Button
              variant="contained"
              disableElevation
              sx={{
                backgroundColor: '#973aa8',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.85rem',
                padding: '4px 12px',
                borderRadius: '4px',
                '&:hover': { backgroundColor: '#54295c', color: "#ffffff" }
              }}
              onClick={() => navigate("/my-tasks/task-create-note")}
            >
              New
              <KeyboardArrowDown sx={{ fontSize: 12, m: 0.2 }} />
            </Button>
          </Stack>
        </Stack>

        {currentTab === 0 && <TaskLayout />}
        {/* {currentTab === 1 && (
          <TaskNotesStatus
            filteredNotes={filteredNotes}
            onUpdateSuccess={refetch}   
          />
        )} */}
      </Box>
    </Box>
  );
};
