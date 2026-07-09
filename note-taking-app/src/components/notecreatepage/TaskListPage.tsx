// // import React, { useState } from 'react';
// // import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Checkbox, TextField, Button } from '@mui/material';
// // import type { Note } from '../../types/Note';


// // interface TaskItem {
// //   id: number;
// //   text: string;
// //   completed: boolean;
// // }


// // export function TaskListPage() {
 
// //   const [tasks, setTasks] = useState<TaskItem[]>([]);
// //   const [input, setInput] = useState<string>('');


// //   const [note, setNote] = useState<Note>({
// //     _id: "note_todo_01",
// //     title: "My Task List",
// //     notetypes: "tasklist",
// //     content: JSON.stringify([]) 
// //   });


// //   const handleToggle = (id: number): void => {
// //     const updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
// //     setTasks(updatedTasks);
    
  
// //     setNote(prev => ({
// //       ...prev,
// //       content: JSON.stringify(updatedTasks)
// //     }));
// //   };

// //   const addTask = (): void => {
// //     if (!input.trim()) return;
    
// //     const newTasks: TaskItem[] = [...tasks, { id: Date.now(), text: input, completed: false }];
// //     setTasks(newTasks);
// //     setInput('');


// //     setNote(prev => ({
// //       ...prev,
// //       content: JSON.stringify(newTasks)
// //     }));
// //   };

// //   return (
// //     <Box sx={{ width:"100%", maxWidth: 600, }}>
// //       <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
// //         <TextField 
// //           size="small" 
// //           fullWidth 
// //           value={input} 
// //           onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)} 
// //           placeholder="Note Content" 
// //         />
// //         <Button variant="contained" onClick={addTask}>Add</Button>
// //       </Box>

// //       <List>
// //         {tasks.map((task) => (
// //           <ListItem key={task.id} disablePadding>
// //             <ListItemButton onClick={() => handleToggle(task.id)} dense>
// //               <ListItemIcon>
// //                 <Checkbox edge="start" checked={task.completed} />
// //               </ListItemIcon>
// //               <ListItemText 
// //                 primary={task.text} 
// //                 style={{ 
// //                   textDecoration: task.completed ? 'line-through' : 'none', 
// //                   color: task.completed ? 'gray' : 'black' 
// //                 }} 
// //               />
// //             </ListItemButton>
// //           </ListItem>
// //         ))}
// //       </List>
// //     </Box>
// //   );
// // }
// import React, { useState } from 'react';
// import { Box, Checkbox, TextField, IconButton } from '@mui/material';
// import { DeleteOutlined } from '@mui/icons-material';
// import OpenWithIcon from '@mui/icons-material/OpenWith';
// import CheckIcon from '@mui/icons-material/Check';

// interface TaskItemProps {
//   description: string;
//   setText: (value: string) => void;
// }

// export function TaskListPage({ description, setText }: TaskItemProps) {
  
//   const tasks = React.useMemo(() => {
//     try {
//       return description ? JSON.parse(description) : [];
//     } catch (e) {
//       return [];
//     }
//   }, [description]);

//   const [input, setInput] = useState<string>('');

  
//   const updateTasks = (updatedList: any[]) => {
//     setText(JSON.stringify(updatedList));
//   };

//   const handleToggle = (id: number): void => {
//     const updated = tasks.map((t: any) => t.id === id ? { ...t, completed: !t.completed } : t);
//     updateTasks(updated);
//   };

//   const handleDelete = (id: number): void => {
//     const updated = tasks.filter((t: any) => t.id !== id);
//     updateTasks(updated);
//   };

//   const addTask = (): void => {
//     if (!input.trim()) return;
//     const updated = [...tasks, { id: Date.now(), text: input, completed: false }];
//     updateTasks(updated);
//     setInput('');
//   };

//   return (
//     <Box 
//       sx={{ 
//         border: '1px solid #e0e0e0', 
//         borderRadius: '8px', 
//         p: 3, 
//         width: "100%", 
//         maxWidth: 600,
//         backgroundColor: '#fff',
//         boxShadow: '0px 1px 3px rgba(0,0,0,0.05)'
//       }}
//     >
//       {/* Task List Items */}
//       {tasks.map((task: any) => (
//         <Box 
//           key={task.id} 
//           sx={{ 
//             display: 'flex', 
//             alignItems: 'center', 
//             justifyContent: 'space-between',
//             mb: 2
//           }}
//         >
//           <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mr: 2 }}>
//             <Checkbox 
//               checked={task.completed} 
//               onChange={() => handleToggle(task.id)}
//               sx={{ p: 0, mr: 2 }}
//             />
//             <TextField
//               variant="standard"
//               value={task.text}
//               fullWidth
//               // InputProps={{
//               //   disableUnderline: true,
//               //   style: {
//               //     textDecoration: task.completed ? 'line-through' : 'none',
//               //     color: task.completed ? '#9e9e9e' : '#212121',
//               //     fontSize: '1rem'
//               //   }
//               // }}
//               slotProps={{
//                 input:{
//                   disableUnderline: true,
                
//                 style:{
//                   textDecoration: task.completed ? 'line-through' : 'none',
//                   color: task.completed ? '#9e9e9e' : '#212121',
//                   fontSize: '14px'
//                 }
//               }
//               }}
//               onChange={(e) => {
//                 const updated = tasks.map((t: any) => t.id === task.id ? { ...t, text: e.target.value } : t);
//                 updateTasks(updated);
//               }}
//             />
//           </Box>
          
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <IconButton size="small" onClick={() => handleDelete(task.id)}>
//               <DeleteOutlined sx={{ color: '#5f6368', fontSize: 20 }} />
//             </IconButton>
//             <IconButton size="small" sx={{ cursor: 'grab' }}>
//               <OpenWithIcon sx={{ color: '#5f6368', fontSize: 20 }} />
//             </IconButton>
//           </Box>
//         </Box>
//       ))}

//       {/* New Task Input Row */}
//       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mr: 2 }}>
//           <Checkbox disabled sx={{ p: 0, mr: 2, opacity: 0.5 }} />
//           <TextField
//             variant="standard"
//             fullWidth
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder=""
//             onKeyDown={(e) => {
//               if (e.key === 'Enter') addTask();
//             }}
//           />
//         </Box>
//         <IconButton size="small" onClick={addTask}>
//           <CheckIcon sx={{ color: '#5f6368', fontSize: 20 }} />
//         </IconButton>
//       </Box>
//     </Box>
//   );
// }

// import React, { useState } from 'react';
// import { Box, Checkbox, TextField, IconButton } from '@mui/material';
// // import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import { DeleteOutlined } from '@mui/icons-material';
// import OpenWithIcon from '@mui/icons-material/OpenWith';
// import CheckIcon from '@mui/icons-material/Check';

// interface TaskItemProps {
//   description: string;
//   setText: (value: string) => void;
// }

// export function TaskListPage({ description, setText }: TaskItemProps) {

//   const tasks = React.useMemo(() => {
//     try {
//       return description ? JSON.parse(description) : [];
//     } catch (e) {
//       return [];
//     }
//   }, [description]);


//   const [input, setInput] = useState<string>('');

//   const updateTasks = (updatedList: any[]) => {
//     setText(JSON.stringify(updatedList));
//   };

 
//   const handleToggle = (id: number): void => {
//     const updated = tasks.map((t: any) => t.id === id ? { ...t, completed: !t.completed } : t);
//     updateTasks(updated);
//   };


//   const handleDelete = (id: number): void => {
//     const updated = tasks.filter((t: any) => t.id !== id);
//     updateTasks(updated);
//   };


//   const handleTextChange = (id: number, newText: string): void => {
//     const updated = tasks.map((t: any) => t.id === id ? { ...t, text: newText } : t);
//     updateTasks(updated);
//   };

 
//   const addTask = (): void => {
//     if (!input.trim()) return; 
  
    
//     const updated = [...tasks, { id: Date.now(), text: input, completed: false }];
//     updateTasks(updated);
//     setInput(''); 
//   }
//   return (
//     <Box 
//       sx={{ 
//         border: '1px solid #e0e0e0', 
//         borderRadius: '8px', 
//         p: 3, 
//         width: "100%", 
//         maxWidth: 600,
//         // backgroundColor: '#fff',
//         bgcolor:'background.default',
//         boxShadow: '0px 1px 3px rgba(0,0,0,0.05)'
//       }}
//     >
  
//       {tasks.map((task: any) => (
//         <Box 
//           key={task.id} 
//           sx={{ 
//             display: 'flex', 
//             alignItems: 'center', 
//             justifyContent: 'space-between',
//             mb: 2
//           }}
//         >
//           <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mr: 2 }}>
//             <Checkbox 
//               checked={task.completed} 
//               onChange={() => handleToggle(task.id)}
//               sx={{ p: 0, mr: 2 }}
//             />
//             <TextField
//               variant="standard"
//               value={task.text}
//               fullWidth
//               // InputProps={{
//               //   disableUnderline: true,
//               //   style: {
//               //     textDecoration: task.completed ? 'line-through' : 'none',
//               //     color: task.completed ? '#9e9e9e' : '#212121',
//               //     fontSize: '1rem'
//               //   }
//               // }}
//               slotProps={{
//                 input : {
//                   disableUnderline:true,
//                   style:{
//                     textDecoration: task.completed ? 'line-through' : 'none',
//                   color: task.completed ? '#403d39' : '#212121',
//                   fontSize: '14px'
//                   }
//                 }
//               }}
//               onChange={(e) => handleTextChange(task.id, e.target.value)}
//             />
//           </Box>
          
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <IconButton size="small" onClick={() => handleDelete(task.id)}>
//               <DeleteOutlined sx={{ color: 'text.primary', fontSize: 20 }} />
//             </IconButton>
          
//           </Box>
//         </Box>
//       ))}

    
//       <Box sx={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between' }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mr: 2 }}>
//           <Checkbox disabled sx={{ p: 0, mr: 2, opacity: 0.3 }} />
//           <TextField
//             variant="standard"
//             fullWidth
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Add new text here..."
//             // InputProps={{
//             //   disableUnderline: true,
//             // }}
//             slotProps={{
//               input : {
//                 disableUnderline:true
//               }
//             }}
//             onKeyDown={(e) => {
//               if (e.key === 'Enter') addTask(); 
//             }}
//           />
//         </Box>
//         <IconButton size="small" onClick={addTask}>
//           <CheckIcon sx={{ color: 'text.primary', fontSize: 20 }} />
//         </IconButton>
//       </Box>
//     </Box>
//   );

// }

import React, { useState, useEffect, useRef } from 'react';
import { Box, Checkbox, TextField, IconButton } from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';

interface TaskItem {
  id: number;
  text: string;
  completed: boolean;
}

interface TaskItemProps {
  description: string;
  setText: (value: string) => void;
}

export function TaskListPage({ description, setText }: TaskItemProps) {
  // Local State သုံးပြီး Tasks တွေကို ထိန်းသိမ်းခြင်း (TextField ရိုက်ရတာ ချောမွေ့စေရန်)
  const [localTasks, setLocalTasks] = useState<TaskItem[]>([]);
  const [input, setInput] = useState<string>('');

  // Infinite Loop တားဆီးရန် အချက်ပြစနစ် (Refs)
  const isUpdatingFromProp = useRef(false);
  const isInitialMount = useRef(true);

  // Parent Prop ကနေ description ဝင်လာရင် Local State နဲ့ Sync လုပ်ပေးခြင်း
  useEffect(() => {
    if (description) {
      try {
        const parsed = JSON.parse(description);
        if (Array.isArray(parsed) && JSON.stringify(parsed) !== JSON.stringify(localTasks)) {
          isUpdatingFromProp.current = true;
          setLocalTasks(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }
    isInitialMount.current = false;
  }, [description]);

  // Local State ပြောင်းလဲမှုကို Parent ဆီ စနစ်တကျ ပြန်ပို့ပေးခြင်း
  useEffect(() => {
    if (isUpdatingFromProp.current) {
      isUpdatingFromProp.current = false;
      return; // Prop ကြောင့် State ပြောင်းတာဆိုရင် Parent ဆီ ပြန်မပို့ဘူး (Loop ပိတ်ခြင်း)
    }
    
    if (!isInitialMount.current) {
      setText(JSON.stringify(localTasks));
    }
  }, [localTasks, setText]);

  // Toggle Checkbox
  const handleToggle = (id: number): void => {
    setLocalTasks(prev => prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Delete Task
  const handleDelete = (id: number): void => {
    setLocalTasks(prev => prev.filter((t) => t.id !== id));
  };

  // Handle Text Change (Local State ကိုပဲ အရင်ပြင်လို့ ရိုက်ရတာ မထစ်တော့ပါ)
  const handleTextChange = (id: number, newText: string): void => {
    setLocalTasks(prev => prev.map((t) => t.id === id ? { ...t, text: newText } : t));
  };

  // Add Task
  const addTask = (): void => {
    if (!input.trim()) return; 
    setLocalTasks(prev => [...prev, { id: Date.now(), text: input, completed: false }]);
    setInput(''); 
  };

  return (
    <Box 
      sx={{ 
        border: '1px solid #e0e0e0', 
        borderRadius: '8px', 
        p: 3, 
        width: "100%", 
        maxWidth: 600,
        bgcolor: 'background.default',
        boxShadow: '0px 1px 3px rgba(0,0,0,0.05)'
      }}
    >
  
      {localTasks.map((task) => (
        <Box 
          key={task.id} 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mr: 2 }}>
            <Checkbox 
              checked={task.completed} 
              onChange={() => handleToggle(task.id)}
              sx={{ p: 0, mr: 2 }}
            />
            <TextField
              variant="standard"
              value={task.text}
              fullWidth
              slotProps={{
                input: {
                  disableUnderline: true,
                  style: {
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? '#403d39' : '#212121',
                    fontSize: '14px'
                  }
                }
              }}
              onChange={(e) => handleTextChange(task.id, e.target.value)}
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" onClick={() => handleDelete(task.id)}>
              <DeleteOutlined sx={{ color: 'text.primary', fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>
      ))}

      {/* Add New Task Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mr: 2 }}>
          <Checkbox disabled sx={{ p: 0, mr: 2, opacity: 0.3 }} />
          <TextField
            variant="standard"
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add new text here..."
            slotProps={{
              input: {
                disableUnderline: true
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addTask(); 
            }}
          />
        </Box>
        <IconButton size="small" onClick={addTask}>
          <CheckIcon sx={{ color: 'text.primary', fontSize: 20 }} />
        </IconButton>
      </Box>
    </Box>
  );
}