
import { Box ,Button, Stack,Typography,Tabs,Tab,IconButton, TextField  } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilterList,Sort, AutoAwesome,Search,KeyboardArrowDown } from "@mui/icons-material";

import { TaskLayout } from "../components/notelayout/TaskLayout";
import { NoteStatusPage } from "../components/status-page/NoteStatusPage";


export const TasksNotes = () => {
   const navigate = useNavigate();
  
      const [currentTab, setCurrentTab] = useState<number>(0);
      const [searchOpen, setSearchOpen] = useState<boolean>(false);
      const [searchText, setSearchText] = useState<string>("");
  return (
  <Box>
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' ,backgroundColor:"#f4f6f8",}}>
      
      {/* Header Section */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="h3" sx={{ fontWeight: 500, color: '#2F004F', mb: 1, fontSize: '18px' }}>
          Tasks Tracker
        </Typography>
        <Typography variant="body1" sx={{ color: '#2F004F', fontSize: '16px' }}>
          Stay organized with tasks, your way.
        </Typography>
      </Box>

      {/* Navigation Toolbar */}
      <Stack direction="row"  sx={{justifyContent:"space-between",alignItems:"center", mt: 3, mb: 2, borderBottom: '1px solid #ededed', pb: 0.5 }}>
        <Tabs 
          value={currentTab} 
          onChange={(_, newValue) => setCurrentTab(newValue)}
          sx={{
            minHeight: 'auto',
            '& .MuiTabs-indicator': { backgroundColor: '#37352f', height: '2px' },
            '& .MuiTab-root': { 
              textTransform: 'none', 
              fontWeight: 500, 
              fontSize: '0.9rem', 
              minWidth: 'auto', 
              padding: '6px 12px',
              color: '#6b6a65',
              '&.Mui-selected': { color: '#37352f' }
            }
          }}
        >
          <Tab label="All Tasks" />
          <Tab label="By Status"  />
        </Tabs>

        {/* Right side controls */}
        <Stack direction="row" spacing={1} sx={{alignItems:"center",}}>
          <IconButton size="small" sx={{ color: '#6b6a65' }}><FilterList fontSize="small" /></IconButton>
          <IconButton size="small" sx={{ color: '#6b6a65' }}><Sort fontSize="small" /></IconButton>
          <IconButton size="small" sx={{ color: '#6b6a65' }}><AutoAwesome fontSize="small" /></IconButton>
          <IconButton size="small" sx={{ color: '#6b6a65' }} onClick={() => setSearchOpen((prev) => !prev)}>
            <Search fontSize="small" />
          </IconButton>
          {searchOpen && (
            <TextField
              size="small"
              autoFocus
              placeholder="Search text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              sx={{
                width: 180,
                '& .MuiOutlinedInput-root': {
                  height: 30,
                  fontSize: '0.85rem',
                  backgroundColor: '#ffffff',
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
              backgroundColor: '#dec99', 
              textTransform: 'none', 
              fontWeight: 500,
              fontSize: '0.85rem',
              padding: '4px 12px',
              borderRadius: '4px',
              '&:hover': { backgroundColor: '#973aa8',color:"#ffc2d1" }
            }}
           onClick={() => navigate("/note-form/create")} 
          >
            New
            
              <KeyboardArrowDown sx={{ fontSize:12,m:0.2}}/>
           
            
          </Button>
          </Stack>
          </Stack>
          {currentTab === 0 && <TaskLayout />}

        {currentTab === 1 && (
          // <Box sx={{ py: 5 }}>
          //   <Typography variant="h6">
          //     By Status Page
          //   </Typography>
          // </Box>
          <NoteStatusPage/>
        )}
          </Box>
  </Box>
  )
}



// import  { useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Box, 
//   Typography, 
//   Button, 

//   Grid, 
//   Paper, 
//   IconButton,
//   Stack
// } from '@mui/material';
// import { 
//   Add as AddIcon, 
//   ChevronLeft, 
//   ChevronRight, 
//   CalendarToday,
 
// } from '@mui/icons-material';
// // import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import { 
//   format, 
//   addMonths, 
//   subMonths, 
//   startOfMonth, 
//   endOfMonth, 
//   startOfWeek, 
//   endOfWeek, 
//   eachDayOfInterval, 
//   isSameMonth, 
//   isSameDay 
// } from 'date-fns';


// interface Task {
//   id: string;
//   title: string;
//   date: string; // "YYYY-MM-DD" format
// }
// export const TasksNotes = () => {

//      const navigate = useNavigate();

//     const [currentTab, setCurrentTab] = useState<number>(0);
  

//   const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

 
//   const [tasks, setTasks] = useState<Task[]>([
//     { id: '1', title: 'New task', date: format(new Date(), 'yyyy-MM-dd') },
//     { id: '2', title: 'Project presentation', date: format(addMonths(new Date(), 1), 'yyyy-MM-05') }
//   ]);

//   const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  
//   const calendarDays = useMemo(() => {
//     const monthStart = startOfMonth(currentMonth);
//     const monthEnd = endOfMonth(monthStart);
//     const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday မှစတင်
//     const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

//     return eachDayOfInterval({ start: startDate, end: endDate });
//   }, [currentMonth]);

  
//   const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
//   const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
//   const handleToday = () => setCurrentMonth(new Date());

//   return (
//     <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' ,backgroundColor:"#f4f6f8",}}>
      
//       {/* Header Section */}
      

//       {/* Calendar Controller Month Year (Dynamic Header) */}
//       <Stack direction="row"sx={{ justifyContent:"space-between",alignItems:"center",mb: 2, px: 0.5 }}>
       
//         <Typography sx={{ fontWeight: 600, color: '#37352f', fontSize: '0.95rem' }}>
//           {format(currentMonth, 'MMMM yyyy')}
//         </Typography>
        
//         <Stack direction="row" spacing={0.5} sx={{alignItems:"center"}}>
//           <Button 
//             variant="outlined" 
//             startIcon={<CalendarToday sx={{ width: 14, height: 14 }} />}
//             sx={{ 
//               textTransform: 'none', 
//               color: '#37352f', 
//               borderColor: '#e0e0e0',
//               fontSize: '0.85rem',
//               padding: '2px 8px',
//               borderRadius: '4px',
//               '&:hover': { borderColor: '#37352f', backgroundColor: 'transparent' }
//             }}
//           >
//             Manage in Calendar
//           </Button>
          
         
//           <IconButton size="small" onClick={handlePrevMonth} sx={{ border: '1px solid #e0e0e0', borderRadius: '4px', p: '5px' }}>
//             <ChevronLeft fontSize="small" />
//           </IconButton>
          
        
//           <Button 
//             variant="text" 
//             onClick={handleToday}
//             sx={{ textTransform: 'none', color: '#37352f', minWidth: 'auto', fontSize: '0.85rem', px: 1 }}
//           >
//             Today
//           </Button>

       
//           <IconButton size="small" onClick={handleNextMonth} sx={{ border: '1px solid #e0e0e0', borderRadius: '4px', p: '5px' }}>
//             <ChevronRight fontSize="small" />
//           </IconButton>
//         </Stack>
//       </Stack>

//       {/* Calendar Grid Sheet */}
//       <Box sx={{ borderTop: '1px solid #e0e0e0', borderLeft: '1px solid #e0e0e0' }}>
//         {/* Days of Week Row */}
//         <Grid sx={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)'}}>
//           {daysOfWeek.map((day) => (
//             <Grid  key={day} sx={{ borderRight: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0', py: 0.5, px: 1 }}>
//               <Typography align="right" sx={{ fontSize: '0.75rem', color: '#6b6a65', fontWeight: 500 }}>
//                 {day}
//               </Typography>
//             </Grid>
//           ))}
//         </Grid>

//         {/* Days Cells (Dynamic Generation) */}
//         <Grid sx={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)'}}>
//           {calendarDays.map((day, index) => {
           
//             const dayTasks = tasks.filter(task => task.date === format(day, 'yyyy-MM-dd'));
//             const isCurrentM = isSameMonth(day, currentMonth);
//             const isToday = isSameDay(day, new Date());

//             return (
//               <Grid 
//                 key={index} 
//                 sx={{ 
//                   borderRight: '1px solid #e0e0e0', 
//                   borderBottom: '1px solid #e0e0e0', 
//                   minHeight: '110px',
//                   p: 1,
//                   position: 'relative',
//                   backgroundColor: isToday ? '#fbfbfa' : 'transparent', 
//                   '&:hover .add-task-btn': { opacity: 1 }
//                 }}
//               >
//                 {/* Day Number Header */}
//                 <Stack direction="row" sx={{ justifyContent:"space-between",alignItems:"center",mb: 0.5 }}>
//                   <IconButton 
//                     className="add-task-btn"
//                     size="small" 
//                     sx={{ 
//                       opacity: 0, 
//                       transition: 'opacity 0.2s', 
//                       p: '2px', 
//                       border: '1px solid #e0e0e0', 
//                       borderRadius: '4px' 
//                     }}
//                   >
//                     <AddIcon
//                     onClick={() => navigate("/note-form/create")} 
//                     sx={{ width: 14, height: 14, color: '#6b6a65' }} />
//                   </IconButton>
                  
//                   <Typography 
//                     sx={{ 
//                       fontSize: '0.8rem', 
//                       color: isCurrentM ? (isToday ? '#2383e2' : '#37352f') : '#bfbfae', 
//                       fontWeight: isToday ? 700 : 500 
//                     }}
//                   >
                    
//                     {format(day, 'd') === '1' ? format(day, 'MMM d') : format(day, 'd')}
//                   </Typography>
//                 </Stack>

//                 {/* Tasks List */}
//                 <Stack spacing={0.5} sx={{ mt: 1 }}>
//                   {dayTasks.map((task) => (
//                     <Paper
//                       key={task.id}
//                       elevation={0}
//                       sx={{
//                         padding: '2px 8px',
//                         fontSize: '0.85rem',
//                         color: '#37352f',
//                         backgroundColor: '#f7f7f5',
//                         border: '1px solid #edece9',
//                         borderRadius: '4px',
//                         cursor: 'pointer',
//                         whiteSpace: 'nowrap',
//                         overflow: 'hidden',
//                         textOverflow: 'ellipsis',
//                         '&:hover': { backgroundColor: '#efeee9' }
//                       }}
//                     >
//                       {task.title}
//                     </Paper>
//                   ))}
//                 </Stack>
//               </Grid>
//             );
//           })}
//         </Grid>
//       </Box>
//     </Box>
//   );

// }

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Box, 
//   Typography, 
//   Button,
//   IconButton,
//   Tabs, 
//   Tab, 
//   Stack
// } from '@mui/material';

// import { FilterList,Sort,AutoAwesome,Search,KeyboardArrowDown } from '@mui/icons-material';



// export const TasksNotes = () => {
//   const navigate = useNavigate();

//   // Tab State: All Tasks = 0, By Status = 1
//   const [currentTab, setCurrentTab] = useState<number>(0);
//   // const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

//   return (
//     <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', backgroundColor: "#f4f6f8" }}>
      
//       {/* Header Section */}
//       <Box sx={{ mb: 1 }}>
//         <Typography variant="h3" sx={{ fontWeight: 700, color: '#37352f', mb: 1, fontSize: '2.25rem' }}>
//           Tasks Tracker
//         </Typography>
//         <Typography variant="body1" sx={{ color: '#6b6a65', fontSize: '0.95rem' }}>
//           Stay organized with tasks, your way.
//         </Typography>
//       </Box>

//       {/* Navigation Toolbar */}
//       <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mt: 3, mb: 2, borderBottom: '1px solid #ededed', pb: 0.5 }}>
//         <Tabs 
//           value={currentTab} 
//           onChange={(_, newValue) => {
//             setCurrentTab(newValue);
//             if (newValue === 0) {
//               navigate("/tasks-note/task-layout"); 
//             } else if (newValue === 1) {
//               navigate("/tasks-note/note-status"); 
//             }
//           }}
//           sx={{
//             minHeight: 'auto',
//             '& .MuiTabs-indicator': { backgroundColor: '#37352f', height: '2px' },
//             '& .MuiTab-root': { 
//               textTransform: 'none', 
//               fontWeight: 500, 
//               fontSize: '0.9rem', 
//               minWidth: 'auto', 
//               padding: '6px 12px',
//               color: '#6b6a65',
//               '&.Mui-selected': { color: '#37352f' }
//             }
//           }}
//         >
//           <Tab label="All Tasks" />
//           <Tab label="By Status" />
//         </Tabs>

//         {/* Right side control button */}
//         <Stack direction="row" spacing={1} sx={{alignItems:"center",}}>
//           <IconButton size="small" sx={{ color: '#6b6a65' }}><FilterList fontSize="small" /></IconButton>
//           <IconButton size="small" sx={{ color: '#6b6a65' }}><Sort fontSize="small" /></IconButton>
//          <IconButton size="small" sx={{ color: '#6b6a65' }}><AutoAwesome fontSize="small" /></IconButton>
//           <IconButton size="small" sx={{ color: '#6b6a65' }}><Search fontSize="small" /></IconButton>
          
//           <Button 
//             variant="contained" 
//             disableElevation
//             sx={{ 
//               backgroundColor: '#2383e2', 
//                textTransform: 'none', 
//               fontWeight: 500,
//                fontSize: '0.85rem',
//               padding: '4px 12px',
//               borderRadius: '4px',
//               '&:hover': { backgroundColor: '#1a6cb8' }
//              }}
//            onClick={() => navigate("/note-form/create")} 
//           >
//              New
            
//               <KeyboardArrowDown sx={{ fontSize:12,m:0.2}}/>
           
            
//           </Button>
          
//        </Stack>
  


      
//     </Stack>
//     </Box>
//   );
// };


