// // import { Box, Button, Stack, TextField,styled } from '@mui/material'
// // import React from 'react';
// // import { NoteAddOutlined,FileUploadOutlined ,ShareOutlined} from '@mui/icons-material';


// //  const VisuallyHiddenInput = styled('input')({
// //   clip: 'rect(0 0 0 0)',
// //   clipPath: 'inset(50%)',
// //   height: 1,
// //   overflow: 'hidden',
// //   position: 'absolute',
// //   bottom: 0,
// //   left: 0,
// //   whiteSpace: 'nowrap',
// //   width: 1,
// // });
// // export const NoteCreateForm = () => {
// //     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// //     const files = event.target.files;
// //     if (files) {
// //       console.log("Uploaded files:", Array.from(files));
// //     }
// //   };

   
// //   return (
// //     <Box sx={{display:'flex',width:"100%",minWidth:"100%", height:"100%"}}>
// //         <Box>
// //             <Stack >
// //               <TextField variant='outlined' label="Note Title" sx={{color:"#973aa8"}}/>
                
// //             </Stack>
// //             <Stack spacing={2} direction="row">
// //                     <Button 
// //                     startIcon={<NoteAddOutlined/>}
// //                     sx={{
// //             textTransform: "none",
// //             color: "black",
// //             fontSize: "18px",
// //             fontWeight: "500",
// //             borderRadius: 3,
// //             px: 1.5,
// //             whiteSpace: 'nowrap',
// //             "& .MuiButton-startIcon": { color: "#973aa8" },
// //             "&:hover": { bgcolor: "#f5f5f5" },
// //           }}>
// //                         New Note 
// //                     </Button>
// //                     <Button 
// //                     tabIndex={-1}
// //                     role={undefined}
// //                     size='small'
// //                     startIcon={<FileUploadOutlined/>}
// //                 sx={{
// //             textTransform: "none",
// //             color: "black",
// //             fontSize: "18px",
// //             fontWeight: "500",
// //             borderRadius: 3,
// //             px: 1.5,
// //             whiteSpace: 'nowrap',
// //             "& .MuiButton-startIcon": { color: "#973aa8" },
// //             "&:hover": { bgcolor: "#f5f5f5" },
// //           }}
// //           >
// //                         Import Pdf 
                       
// //                   <VisuallyHiddenInput
// //         type="file"
// //               accept="application/pdf" // Optional: limits file picker to PDFs
// //               onChange={handleFileChange}
// //               multiple
// //       />
// //                     </Button>
// //                     <Button startIcon={<ShareOutlined/>}
// //                     sx={{
// //             textTransform: "none",
// //             color: "black",
// //             fontSize: "18px",
// //             fontWeight: "500",
// //             borderRadius: 3,
// //             px: 1.5,
// //             whiteSpace: 'nowrap',
// //             "& .MuiButton-startIcon": { color: "#973aa8" },
// //             "&:hover": { bgcolor: "#f5f5f5" },
// //           }}>
// //                         Share
// //                     </Button>
// //                 </Stack>
// //         </Box>
        
// //     </Box>
// //   )
// // }

// // import { Box, Button, Stack, TextField, styled,Menu,MenuItem } from '@mui/material';
// // import React, { useRef ,useState} from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { NoteAddOutlined,FileUploadOutlined, ShareOutlined ,DescriptionOutlined,ArticleOutlined,FormatListBulletedOutlined,BookmarkBorderOutlined,BorderColorOutlined ,TableChartOutlined,ChatBubbleOutlineOutlined} from '@mui/icons-material';
// // import { PlainTextNotePage } from '../notecreatepage/PlainTextNotePage';
// // import { RichTextNotePage } from '../notecreatepage/RichTextNotePage';
// // import { TaskListPage } from '../notecreatepage/TaskListPage';
// // import { WhiteboardPage } from '../notecreatepage/WhiteboardPage';
// // import { BookMarkPage } from '../notecreatepage/BookMarkPage';
// // import { SpreadsheetPage } from '../notecreatepage/SpreadsheetPage';
// // import { GroupChatPage } from '../notecreatepage/GroupChatPage';
// // import { MarkdownPage } from '../notecreatepage/MarkdownPage';

// // import { useCreateNoteMutation } from '../../services/noteApi';

// // // Standard hidden style, kept entirely independent
// // const VisuallyHiddenInput = styled('input')({
// //   display: 'none', // Simple and absolute definition
// // });

// // export const NoteCreateForm = () => {
 
// //   const fileInputRef = useRef<HTMLInputElement>(null);
// //   const navigate = useNavigate();
// //    const [createNote, { isLoading }] = useCreateNoteMutation();

// //   const [noteTitle, setNoteTitle] = useState<string>('');
// //   const [noteDescription, setNoteDescription] = useState<string>('');
// //   const [activePage,setActivePage] = useState<HTMLButtonElement | null >(null);

// //   const openMenu = Boolean(anchorEl);

// //   const handleButtonClick = () => {
// //     if (fileInputRef.current) {
// //       fileInputRef.current.click();
// //     }
// //   };

  


// //   const handleShareViaEmail = () => {
// //     // handleShareMenuClose();
// //     const subject = encodeURIComponent(noteTitle || "My Shared Note");
// //    const body = encodeURIComponent(`Check out my note: ${noteTitle}\n\n${noteDescription}`);
// //     window.location.href = `mailto:?subject=${subject}&body=${body}`;
// //   };


// //   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// //     const files = event.target.files;
// //     if (files && files.length > 0) {
// //       console.log("Uploaded files:", Array.from(files));
// //     }
// //   };

// //     const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
// //     const openMenu = Boolean(anchorEl);

// //     const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
// //     setAnchorEl(event.currentTarget);
// //   };
// //   const handleMenuClose = () => {
// //     setAnchorEl(null);
// //   };

// //   // const handleMenuClick = (route: string) => {
// //   //   handleMenuClose();
// //   //   navigate(route);
// //   // };
// //   const handleMenuClick = (pageType: string) => {
// //     setActivePage(pageType);
// //     handleMenuClose();
// //   };

// //   const handleSaveNote = async () => {
// //     if (!noteTitle.trim()) {
// //       alert("Please enter a note title!");
// //       return;
// //     }
// //     try {
// //       const payload = {
// //         title: noteTitle,
// //         content: noteDescription, 
// //         category: activePage,     
// //         priority: "Medium",
// //         task: "Todo",
// //         startDate: new Date().toISOString(),
// //         endDate: new Date().toISOString(),
// //       };

// //       console.log("Submitting Payload:", payload);
// //       await createNote(payload).unwrap();
// //       navigate("/note-form"); 
// //     } catch (err) {
// //       console.error("Failed to save note:", err);
// //     }
// //   };

// // //      const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
// // //     setAnchorEl(event.currentTarget);
// // //   };
// // //    <Button
// // //           aria-describedby={shareId}
// // //           onClick={handleShareClick}
// // //           sx={{
// // //             border: "1px solid #d0d0d0",
// // //             textTransform: "none",
// // //             color: "#37352f",
// // //             bgcolor: "f4f6f8",
// // //             gap: 0.5,
// // //             px: 1,
// // //             mr: 2,
// // //             borderRadius:2,
// // //             "&:hover": {
// // //               bgcolor: "#e6e4e4",
              
// // //             },
// // //           }}
          
// // //         >
// // //           <SendIcon sx={{ fontSize: 12 }} />
// // //           Share
// // //           <KeyboardArrowDownIcon sx={{ fontSize: 12}} />
// // //         </Button>


// // const renderActivePage = () => {
// //     switch (activePage) {
// //       case '/note-create-form/plain-text': 
// //         return <PlainTextNotePage description={noteDescription} setText={setNoteDescription} />;
// //       case '/note-create-form/rich-text': 
// //         return <RichTextNotePage description={noteDescription} setText={setNoteDescription} />;
// //       case '/note-create-form/mark-down': return <MarkdownPage description={noteDescription} setText={setNoteDescription}/>;
// //       case '/note-create-form/task-list': return <TaskListPage description={noteDescription} setText={setNoteDescription} />;
// //       case '/note-create-form/book-mark': return <BookMarkPage description={noteDescription} setText={setNoteDescription}/>;
// //       case '/note-create-form/white-board': return <WhiteboardPage description={noteDescription} setText={setNoteDescription}/>;
// //       case '/note-create-form/spread-sheet': return <SpreadsheetPage description={noteDescription} setText={setNoteDescription}/>;
// //       case '/note-create-form/group-chat': return <GroupChatPage description={noteDescription} setText={setNoteDescription}/>;
// //       default: 
// //         return <PlainTextNotePage description={noteDescription} setText={setNoteDescription} />;
// //     }
// //   };
  

// //   return (
// //     <Box sx={{ display: 'flex', flexDirection: 'column', width: "100%", minWidth: "100%", p: 2,bgcolor:"background.default", color:"text.primary" }}>
// //       <Box>
// //         <Stack sx={{ mb: 2 }}>
// //           <TextField variant='outlined' label="Note Title" sx={{ color: "#973aa8" }} />
// //         </Stack>
        
// //         <Stack spacing={2} direction="row" >
// //           <Button
// //           startIcon={<NoteAddOutlined/>}
// //           onClick={handleMenuOpen}
// //             sx={{
// //               textTransform: "none",
// //               color: "text.primary",
// //               fontSize: "14px",
// //               fontWeight: "500",
// //               borderRadius: 3,
// //               px: 1.5,
// //               whiteSpace: 'nowrap',
// //               "& .MuiButton-startIcon": { color: "#973aa8" },
// //               "&:hover": { bgcolor: "#f5f5f5" },
// //             }}
// //           >
// //             New Note
// //           </Button>
// //           <Menu
// //           id="new-note-menu"
// //           anchorEl={anchorEl}
// //           open={openMenu}
// //           onClose={handleMenuClose}
// //         //   MenuListProps={{ 'aria-labelledby': 'new-note-button' }}
// //         slotProps={{
// //             list:{'aria-labelledby': 'new-note-button'},
// //             paper:{
// //                 sx: {
// //                     boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
// //               border: '1px solid #e0e0e0',
// //               borderRadius: '8px',
// //               minWidth: '180px',
// //               mt: 0.5,
// //               "& .MuiMenuItem-root": {
// //                 fontSize: '14px',
// //                 color: '#973aa8',
// //                 fontWeight: '500',
// //                 py: 1,
// //                 gap:1.5,
// //                 "&:hover": { bgcolor: "#f5f9ff" }
// //                 },
// //             }
// //         }
// //         }}
       
// //         >
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/plain-text')}>
// //               <DescriptionOutlined fontSize="small"/> Plain Text Note
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/rich-text')}>
// //               <ArticleOutlined fontSize="small"/> Rich Text Note
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/mark-down')}>
// //               <DescriptionOutlined fontSize="small"/> Markdown
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/task-list')}>
// //               <FormatListBulletedOutlined fontSize="small"/> Task List
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/book-mark')}>
// //               <BookmarkBorderOutlined fontSize="small"/> Bookmark
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/white-board')}>
// //               <BorderColorOutlined fontSize="small"/> Whiteboard
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/spread-sheet')}>
// //               <TableChartOutlined fontSize="small"/> Spreadsheet
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/group-chat')}>
// //               <ChatBubbleOutlineOutlined fontSize="small"/> Group Chat
// //             </MenuItem>
// //         </Menu>
       
// //           <Button
// //             onClick={handleButtonClick}
// //             size='small'
// //             startIcon={<FileUploadOutlined />}
// //             sx={{
// //               textTransform: "none",
// //               color: "text.primary",
// //               fontSize: "14px",
// //               fontWeight: "500",
// //               borderRadius: 3,
// //               px: 1.5,
// //               whiteSpace: 'nowrap',
// //               "& .MuiButton-startIcon": { color: "#973aa8" },
// //               "&:hover": { bgcolor: "#f5f5f5" },
// //             }}
// //           >
// //             Import Pdf
// //           </Button>

// //           <Button
// //           onClick={()=> handleShareViaEmail}
// //             con={<ShareOutlined />}
// //             sx={{
// //               textTransform: "none",
// //               color: "text.primary",
// //               fontSize: "14px",
// //               fontWeight: "500",
// //               borderRadius: 3,
// //               px: 1.5,
// //               whiteSpace: 'nowrap',
// //               "& .MuiButton-startIcon": { color: "#973aa8" },
// //               "&:hover": { bgcolor: "#f5f5f5" },
// //             }}
// //           >
// //             Share
// //           </Button>
// //         </Stack>

       

      
// //         <VisuallyHiddenInput
// //           type="file"
// //           ref={fileInputRef}
// //           accept="application/pdf"
// //           onChange={handleFileChange}
// //           multiple
// //         />

// //         <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 3, width: '100%' }}>
// //         {renderActivePage()}
// //       </Box>

// //        <Button
// //             variant="contained"
// //             onClick={handleSaveNote}
// //             disabled={isLoading}
// //             sx={{
// //               textTransform: "none",
// //               bgcolor: "#973aa8",
// //               borderRadius: 3,
// //               px: 3,
// //               "&:hover": { bgcolor: "#7b2c8a" }
// //             }}
// //           >
// //             {isLoading ? "Saving..." : "Save Note"}
// //           </Button>
// //       </Box>
// //     </Box>
// //   );
// // };

// // import { Box, Button, Stack, TextField, styled, Menu, MenuItem, Typography, Grid, IconButton } from '@mui/material';
// // import React, { useRef, useState } from 'react';
// // import { 
// //   NoteAddOutlined, FileUploadOutlined, ShareOutlined, DescriptionOutlined, 
// //   ArticleOutlined, FormatListBulletedOutlined, BookmarkBorderOutlined, 
// //   BorderColorOutlined, TableChartOutlined, ChatBubbleOutlineOutlined,
// //   FolderOpenOutlined, DeleteOutlineOutlined, SettingsOutlined, MoreVertOutlined,
// //   SwapVertOutlined
// // } from '@mui/icons-material';
// // import { PlainTextNotePage } from '../notecreatepage/PlainTextNotePage';
// // import { RichTextNotePage } from '../notecreatepage/RichTextNotePage';
// // import { TaskListPage } from '../notecreatepage/TaskListPage';
// // import { WhiteboardPage } from '../notecreatepage/WhiteboardPage';
// // import { BookMarkPage } from '../notecreatepage/BookMarkPage';
// // import { SpreadsheetPage } from '../notecreatepage/SpreadsheetPage';
// // import { GroupChatPage } from '../notecreatepage/GroupChatPage';
// // import { MarkdownPage } from '../notecreatepage/MarkdownPage';

// // import { useCreateNoteMutation } from '../../services/noteApi';

// // const VisuallyHiddenInput = styled('input')({
// //   display: 'none', 
// // });

// // // Note Item အတွက် Interface
// // interface LocalNoteFile {
// //   id: string;
// //   title: string;
// //   description: string;
// //   type: string;
// //   createdAt: string;
// // }

// // export const NoteCreateForm = () => {
// //   const fileInputRef = useRef<HTMLInputElement>(null);
// //   const [createNote] = useCreateNoteMutation();

// //   const [noteTitle, setNoteTitle] = useState<string>('');
// //   const [noteDescription, setNoteDescription] = useState<string>('');
// //   const [activePage, setActivePage] = useState<string>('/note-create-form/plain-text');
// //   const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

// //   const [savedFiles, setSavedFiles] = useState<LocalNoteFile[]>([
// //     { id: '1', title: 'Sheet 07/06/2026 06:', description: '', type: 'Sheet', createdAt: '07/06/2026' },
// //     { id: '2', title: 'Board 07/06/2026 06:', description: '', type: 'Board', createdAt: '07/06/2026' },
// //     { id: '3', title: 'Bookmark 07/06/2026', description: '', type: 'Bookmark', createdAt: '07/06/2026' },
// //     { id: '4', title: 'mark', description: '', type: 'Note', createdAt: '07/06/2026' },
// //   ]);

// //   const openMenu = Boolean(anchorEl);

// //   const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
// //     setAnchorEl(event.currentTarget);
// //   };
// //   const handleMenuClose = () => {
// //     setAnchorEl(null);
// //   };

// //   const handleMenuClick = (pageType: string) => {
// //     setActivePage(pageType);
// //     handleMenuClose();
// //   };

 
// //   const getFileIcon = (type: string) => {
// //     switch (type) {
// //       case '/note-create-form/spread-sheet': return <TableChartOutlined sx={{ color: '#2e7d32', fontSize: 20 }} />;
// //       case '/note-create-form/white-board': return <BorderColorOutlined sx={{ color: '#0288d1', fontSize: 20 }} />;
// //       case '/note-create-form/book-mark': return <BookmarkBorderOutlined sx={{ color: '#ed6c02', fontSize: 20 }} />;
// //       case '/note-create-form/task-list': return <FormatListBulletedOutlined sx={{ color: '#7b1fa2', fontSize: 20 }} />;
// //       default: return <ArticleOutlined sx={{ color: '#555', fontSize: 20 }} />;
// //     }
// //   };

// //   const handleSaveNote = async () => {
// //     if (!noteTitle.trim()) {
// //       alert("Please enter a note title!");
// //       return;
// //     }
// //     let pageLabel = 'Note';
// //     if (activePage.includes('spread-sheet')) pageLabel = 'Sheet';
// //     if (activePage.includes('white-board')) pageLabel = 'Board';
// //     if (activePage.includes('task-list')) pageLabel = 'Task';
// //     if (activePage.includes('book-mark')) pageLabel = 'Bookmark';

// //     const newFile: LocalNoteFile = {
// //       id: Date.now().toString(),
// //       title: `${noteTitle}`,
// //       description: noteDescription,
// //       type: activePage,
// //       createdAt: new Date().toLocaleDateString('en-GB')
// //     };

// //     // ဒေတာအသစ်ကို List ထဲ တိုက်ရိုက်ပေါင်းထည့်ပြီး UI ချက်ချင်းပြရန်
// //     setSavedFiles(prev => [newFile, ...prev]);

// //     // Backend API သို့လည်း Background ကနေ တပြိုင်နက်လှမ်းပို့သိမ်းမည်
// //     try {
// //       const payload = {
// //         title: noteTitle,
// //         content: noteDescription,
// //         category: activePage,
// //         priority: "Medium",
// //         task: "Todo",
// //         startDate: new Date().toISOString(),
// //         endDate: new Date().toISOString(),
// //       };
// //       await createNote(payload).unwrap();
// //     } catch (err) {
// //       console.error("API Save Failed:", err);
// //     }

// //     // Input များကို ရှင်းလင်းပေးခြင်း
// //     setNoteTitle('');
// //     setNoteDescription('');
// //   };

// //   const renderActivePage = () => {
// //     switch (activePage) {
// //       case '/note-create-form/plain-text': return <PlainTextNotePage description={noteDescription} setText={setNoteDescription} />;
// //       case '/note-create-form/rich-text': return <RichTextNotePage description={noteDescription} setText={setNoteDescription} />;
// //       case '/note-create-form/mark-down': return <MarkdownPage description={noteDescription} setText={setNoteDescription}/>;
// //       case '/note-create-form/task-list': return <TaskListPage description={noteDescription} setText={setNoteDescription} />;
// //       case '/note-create-form/book-mark': return <BookMarkPage description={noteDescription} setText={setNoteDescription}/>;
// //       case '/note-create-form/white-board': return <WhiteboardPage description={noteDescription} setText={setNoteDescription}/>;
// //       case '/note-create-form/spread-sheet': return <SpreadsheetPage description={noteDescription} setText={setNoteDescription}/>;
// //       case '/note-create-form/group-chat': return <GroupChatPage description={noteDescription} setText={setNoteDescription}/>;
// //       default: return <PlainTextNotePage description={noteDescription} setText={setNoteDescription} />;
// //     }
// //   };

// //   return (
// //     <Box sx={{ display: 'flex', flexDirection: 'column', width: "100%", p: 2, bgcolor:"background.default", color:"text.primary" }}>
// //       <Box>
// //         <Stack sx={{ mb: 2 }}>
// //           <TextField 
// //             variant='outlined' 
// //             label="Note Title" 
// //             value={noteTitle} 
// //             onChange={(e) => setNoteTitle(e.target.value)}
// //           />
// //         </Stack>
        
// //         <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
// //           <Button startIcon={<NoteAddOutlined/>} onClick={handleMenuOpen} sx={{ textTransform: "none", color: "text.primary", fontSize: "14px", "& .MuiButton-startIcon": { color: "#973aa8" } }}>
// //             New Note
// //           </Button>
// //           <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/plain-text')}><DescriptionOutlined fontSize="small"/> Plain Text Note</MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/rich-text')}><ArticleOutlined fontSize="small"/> Rich Text Note</MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/mark-down')}><DescriptionOutlined fontSize="small"/> Markdown</MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/task-list')}><FormatListBulletedOutlined fontSize="small"/> Task List</MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/book-mark')}><BookmarkBorderOutlined fontSize="small"/> Bookmark</MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/white-board')}><BorderColorOutlined fontSize="small"/> Whiteboard</MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/spread-sheet')}><TableChartOutlined fontSize="small"/> Spreadsheet</MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/group-chat')}><ChatBubbleOutlineOutlined fontSize="small"/> Group Chat</MenuItem>
// //           </Menu>
          
// //           <Button size='small' startIcon={<FileUploadOutlined />} sx={{ textTransform: "none", color: "text.primary", "& .MuiButton-startIcon": { color: "#973aa8" } }}>
// //             Import Pdf
// //           </Button>

// //           <Button startIcon={<ShareOutlined />} sx={{ textTransform: "none", color: "text.primary", "& .MuiButton-startIcon": { color: "#973aa8" } }}>
// //             Share
// //           </Button>
// //         </Stack>

// //         <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 3, width: '100%' }}>
// //           {renderActivePage()}
// //         </Box>

// //         <Button
// //           variant="contained"
// //           onClick={handleSaveNote}
// //           sx={{ textTransform: "none", bgcolor: "#973aa8", borderRadius: 3, px: 3, mt: 2, mb: 4, "&:hover": { bgcolor: "#7b2c8a" } }}
// //         >
// //           Save Note
// //         </Button>

// //         {/* --- Screenshot (381).png အတိုင်း ပုံဖော်ထားသော Folders နှင့် Note Files Layout ဇုန် --- */}
// //         <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 3 }}>
          
// //           {/* Sorting Header Bar */}
// //           <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
// //             <Button startIcon={<SwapVertOutlined sx={{ fontSize: 16 }} />} sx={{ textTransform: 'none', color: '#1565c0', fontWeight: 'bold', fontSize: '13px' }}>
// //               Sort by Title
// //             </Button>
// //             <Button startIcon={<SwapVertOutlined sx={{ fontSize: 16 }} />} sx={{ textTransform: 'none', color: '#1565c0', fontWeight: 'bold', fontSize: '13px' }}>
// //               Sort by Updated
// //             </Button>
// //           </Stack>

// //           <Grid container spacing={4}>

// //             <Grid size={{xs:12,md:3.5}}>
// //               <Stack spacing={2}>
// //                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
// //                   <FolderOpenOutlined sx={{ color: '#d4a373' }} />
// //                   <Typography sx={{ color: '#1565c0', fontWeight: 500, fontSize: '14px' }}>All Notes</Typography>
// //                 </Box>
// //                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
// //                   <FolderOpenOutlined sx={{ color: '#d4a373' }} />
// //                   <Typography sx={{ color: '#1565c0', fontWeight: 500, fontSize: '14px' }}>Inbox</Typography>
// //                 </Box>
// //                 <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', maxWidth: '200px' }}>
// //                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
// //                     <FolderOpenOutlined sx={{ color: '#d4a373' }} />
// //                     <Typography sx={{ color: '#1565c0', fontWeight: 500, fontSize: '14px' }}>card collection</Typography>
// //                   </Box>
// //                   <IconButton size="small"><MoreVertOutlined sx={{ fontSize: 16, color: '#1565c0' }} /></IconButton>
// //                 </Box>
// //                 <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', maxWidth: '200px' }}>
// //                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
// //                     <DeleteOutlineOutlined sx={{ color: '#777' }} />
// //                     <Typography sx={{ color: '#1565c0', fontWeight: 500, fontSize: '14px' }}>Recycle Bin</Typography>
// //                   </Box>
// //                   <IconButton size="small"><MoreVertOutlined sx={{ fontSize: 16, color: '#1565c0' }} /></IconButton>
// //                 </Box>
// //                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
// //                   <SettingsOutlined sx={{ color: '#777' }} />
// //                   <Typography sx={{ color: '#1565c0', fontWeight: 500, fontSize: '14px' }}>Manage Collections</Typography>
// //                 </Box>
// //               </Stack>
// //             </Grid>


// //             <Grid size={{xs:12,md:8.5}}>
// //               <Grid container spacing={2}>
// //                 {savedFiles.map((file) => (
// //                   <Grid size={{xs:12,sm:6,lg:4}} key={file.id}>
// //                     <Box 
// //                       sx={{ 
// //                         display: 'flex', 
// //                         alignItems: 'center', 
// //                         justifyContent: 'space-between',
// //                         p: 1, 
// //                         borderRadius: '4px',
// //                         '&:hover': { bgcolor: '#f5f5f5' }
// //                       }}
// //                     >
// //                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
// //                         {getFileIcon(file.type)}
// //                         <Typography 
// //                           noWrap 
// //                           sx={{ 
// //                             fontSize: '14px', 
// //                             color: '#1565c0', 
// //                             fontWeight: 500,
// //                             cursor: 'pointer'
// //                           }}
// //                         >
// //                           {file.title}
// //                         </Typography>
// //                       </Box>
// //                       <IconButton size="small">
// //                         <MoreVertOutlined sx={{ fontSize: 16, color: '#1565c0' }} />
// //                       </IconButton>
// //                     </Box>
// //                   </Grid>
// //                 ))}
// //               </Grid>
// //             </Grid>

// //           </Grid>
// //         </Box>

// //       </Box>
// //     </Box>
// //   );
// // };
// ////////////////////////////////


// // import { Box, Button, Stack, TextField, styled, Menu, MenuItem, Typography, Grid, IconButton, Popover } from '@mui/material';
// // import React, { useRef, useState } from 'react';
// // import { 
// //   NoteAddOutlined, FileUploadOutlined, ShareOutlined, DescriptionOutlined, 
// //   ArticleOutlined, FormatListBulletedOutlined, BookmarkBorderOutlined, 
// //   BorderColorOutlined, TableChartOutlined, ChatBubbleOutlineOutlined,
// //   FolderOpenOutlined, DeleteOutlineOutlined, SettingsOutlined, MoreVertOutlined,
// //   SwapVertOutlined
// // } from '@mui/icons-material';
// // import { PlainTextNotePage } from '../notecreatepage/PlainTextNotePage';
// // import { RichTextNotePage } from '../notecreatepage/RichTextNotePage';
// // import { TaskListPage } from '../notecreatepage/TaskListPage';
// // import { WhiteboardPage } from '../notecreatepage/WhiteboardPage';
// // import { BookMarkPage } from '../notecreatepage/BookMarkPage';
// // import { SpreadsheetPage } from '../notecreatepage/SpreadsheetPage';
// // import { GroupChatPage } from '../notecreatepage/GroupChatPage';
// // import { MarkdownPage } from '../notecreatepage/MarkdownPage';

// // import { useCreateNoteMutation } from '../../services/noteApi';


// // const VisuallyHiddenInput = styled('input')({
// //   display: 'none', 
// // });

// // interface LocalNoteFile {
// //   id: string;
// //   title: string;
// //   description: string;
// //   type: string;
// //   timestamp: number;
// // }

// // export const NoteCreateForm = () => {
// //   const fileInputRef = useRef<HTMLInputElement>(null);
// //   const [createNote] = useCreateNoteMutation();

// //   const [noteTitle, setNoteTitle] = useState<string>('');
// //   const [noteDescription, setNoteDescription] = useState<string>('');
// //   const [activePage, setActivePage] = useState<string>('/note-create-form/plain-text');
// //   const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

 
// //   const [titleSortOrder, setTitleSortOrder] = useState<'asc' | 'desc' | null>(null);
// //   const [updateSortOrder, setUpdateSortOrder] = useState<'asc' | 'desc' | null>(null);

  
// //   const [savedFiles, setSavedFiles] = useState<LocalNoteFile[]>([]);


// //   const [deleteAnchorEl, setDeleteAnchorEl] = useState<HTMLDivElement | null>(null);
// //   const openDeletePopover = Boolean(deleteAnchorEl);

// //   const openMenu = Boolean(anchorEl);

// //   const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
// //     setAnchorEl(event.currentTarget);
// //   };
// //   const handleMenuClose = () => {
// //     setAnchorEl(null);
// //   };

// //   const handleMenuClick = (pageType: string) => {
// //     setActivePage(pageType);
// //     handleMenuClose();
// //   };

 
// //   const handleButtonClick = () => {
// //     if (fileInputRef.current) {
// //       fileInputRef.current.click();
// //     }
// //   };

// //   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// //     const files = event.target.files;
// //     if (files && files.length > 0) {
// //       console.log("Selected PDF Files:", Array.from(files));
// //       setNoteTitle(files[0].name.replace(".pdf", ""));
// //     }
// //   };


// //   const getFileIcon = (type: string) => {
// //     switch (type) {
// //       case '/note-create-form/spread-sheet': return <TableChartOutlined sx={{ color: '#2e7d32', fontSize: 18 }} />;
// //       case '/note-create-form/white-board': return <BorderColorOutlined sx={{ color: '#0288d1', fontSize: 18 }} />;
// //       case '/note-create-form/book-mark': return <BookmarkBorderOutlined sx={{ color: '#ed6c02', fontSize: 18 }} />;
// //       case '/note-create-form/task-list': return <FormatListBulletedOutlined sx={{ color: '#7b1fa2', fontSize: 18 }} />;
// //       default: return <ArticleOutlined sx={{ color: '#555', fontSize: 18 }} />;
// //     }
// //   };


// //   const handleDeleteClick = (event: React.MouseEvent<HTMLDivElement>) => {
// //     setDeleteAnchorEl(event.currentTarget);
// //   };

// //   const handleDeleteClose = () => {
// //     setDeleteAnchorEl(null);
// //   };

// //   const handleDeleteConfirm = () => {
// //     setSavedFiles([]); 
// //     setDeleteAnchorEl(null);
// //   };


// //   const handleSortByTitle = () => {
// //     const nextOrder = titleSortOrder === 'asc' ? 'desc' : 'asc';
// //     setTitleSortOrder(nextOrder);
// //     setUpdateSortOrder(null);

// //     const sorted = [...savedFiles].sort((a, b) => {
// //       return nextOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
// //     });
// //     setSavedFiles(sorted);
// //   };

// //   const handleSortByUpdated = () => {
// //     const nextOrder = updateSortOrder === 'asc' ? 'desc' : 'asc';
// //     setUpdateSortOrder(nextOrder);
// //     setTitleSortOrder(null);

// //     const sorted = [...savedFiles].sort((a, b) => {
// //       return nextOrder === 'asc' ? a.timestamp - b.timestamp : b.timestamp - a.timestamp;
// //     });
// //     setSavedFiles(sorted);
// //   };


// //   const handleSaveNote = async () => {
// //     if (!noteTitle.trim()) {
// //       alert("Please enter a note title!");
// //       return;
// //     }

// //     const newFile: LocalNoteFile = {
// //       id: Date.now().toString(),
// //       title: noteTitle,
// //       description: noteDescription,
// //       type: activePage,
// //       timestamp: Date.now()
// //     };

// //     setSavedFiles(prev => [newFile, ...prev]);

// //     try {
// //       const payload = {
// //         title: noteTitle,
// //         content: noteDescription,
// //         category: activePage,
// //         priority: "Medium",
// //         task: "Todo",
// //         startDate: new Date().toISOString(),
// //         endDate: new Date().toISOString(),
// //       };
// //       await createNote(payload).unwrap();
// //     } catch (err) {
// //       console.error("API Save Failed:", err);
// //     }

// //     setNoteTitle('');
// //     setNoteDescription('');
// //   };

// //   const renderFolderFiles = () => (
// //     <Stack spacing={1} sx={{ pl: 4, mt: 1, mb: 1, maxHeight: '200px', overflowY: 'auto' }}>
// //       {savedFiles.map((file) => (
// //         <Box key={file.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.2 }}>
// //           {getFileIcon(file.type)}
// //           <Typography noWrap sx={{ fontSize: '13px', color: '#1565c0', cursor: 'pointer', maxWidth: '150px' }}>
// //             {file.title}
// //           </Typography>
// //         </Box>
// //       ))}
// //     </Stack>
// //   );

// //   const renderActivePage = () => {
// //     switch (activePage) {
// //       case '/note-create-form/plain-text': return <PlainTextNotePage description={noteDescription} setText={setNoteDescription} />;
// //       case '/note-create-form/rich-text': return <RichTextNotePage description={noteDescription} setText={setNoteDescription} />;
// //       case '/note-create-form/mark-down': return <MarkdownPage description={noteDescription} setText={setNoteDescription}/>;
// //       case '/note-create-form/task-list': return <TaskListPage description={noteDescription} setText={setNoteDescription} />;
// //       case '/note-create-form/book-mark': return <BookMarkPage description={noteDescription} setText={setNoteDescription}/>;
// //       case '/note-create-form/white-board': return <WhiteboardPage description={noteDescription} setText={setNoteDescription}/>;
// //       case '/note-create-form/spread-sheet': return <SpreadsheetPage description={noteDescription} setText={setNoteDescription} />;
// //       case '/note-create-form/group-chat': return <GroupChatPage description={noteDescription} setText={setNoteDescription} />;
// //       default: return <PlainTextNotePage description={noteDescription} setText={setNoteDescription} />;
// //     }
// //   };

// //   return (
// //     <Box sx={{ display: 'flex', flexDirection: 'column', width: "100%", p: 2, bgcolor:"background.default", color:"text.primary" }}>
// //       <Box>
// //         <Stack sx={{ mb: 2 }}>
// //           <TextField 
// //             variant='outlined' 
// //             label="Note Title" 
// //             value={noteTitle} 
// //             onChange={(e) => setNoteTitle(e.target.value)}
// //           />
// //         </Stack>
        
// //         <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
// //           <Button 
// //             id="new-note-button"
// //             startIcon={<NoteAddOutlined/>} 
// //             onClick={handleMenuOpen} 
// //             sx={{ textTransform: "none", color: "text.primary", fontSize: "14px", "& .MuiButton-startIcon": { color: "#973aa8" } }}
// //           >
// //             New Note
// //           </Button>

         
// //           <Menu
// //             id="new-note-menu"
// //             anchorEl={anchorEl}
// //             open={openMenu}
// //             onClose={handleMenuClose}
// //             slotProps={{
// //               list: { 'aria-labelledby': 'new-note-button' },
// //               paper: {
// //                 sx: {
// //                   boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
// //                   border: '1px solid #e0e0e0',
// //                   borderRadius: '8px',
// //                   minWidth: '180px',
// //                   mt: 0.5,
// //                   "& .MuiMenuItem-root": {
// //                     fontSize: '14px',
// //                     color: '#973aa8',
// //                     fontWeight: '500',
// //                     py: 1,
// //                     gap: 1.5,
// //                     "&:hover": { bgcolor: "#f5f9ff" }
// //                   },
// //                 }
// //               }
// //             }}
// //           >
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/plain-text')}>
// //               <DescriptionOutlined fontSize="small"/> Plain Text Note
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/rich-text')}>
// //               <ArticleOutlined fontSize="small"/> Rich Text Note
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/mark-down')}>
// //               <DescriptionOutlined fontSize="small"/> Markdown
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/task-list')}>
// //               <FormatListBulletedOutlined fontSize="small"/> Task List
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/book-mark')}>
// //               <BookmarkBorderOutlined fontSize="small"/> Bookmark
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/white-board')}>
// //               <BorderColorOutlined fontSize="small"/> Whiteboard
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/spread-sheet')}>
// //               <TableChartOutlined fontSize="small"/> Spreadsheet
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/group-chat')}>
// //               <ChatBubbleOutlineOutlined fontSize="small"/> Group Chat
// //             </MenuItem>
// //           </Menu>
          
// //           <Button onClick={handleButtonClick} size='small' startIcon={<FileUploadOutlined />} sx={{ textTransform: "none", color: "text.primary", "& .MuiButton-startIcon": { color: "#973aa8" } }}>
// //             Import Pdf
// //           </Button>

// //           <Button startIcon={<ShareOutlined />} sx={{ textTransform: "none", color: "text.primary", "& .MuiButton-startIcon": { color: "#973aa8" } }}>
// //             Share
// //           </Button>
// //         </Stack>

// //         <VisuallyHiddenInput
// //           type="file"
// //           ref={fileInputRef}
// //           accept="application/pdf"
// //           onChange={handleFileChange}
// //         />

// //         <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 3, width: '100%' }}>
// //           {renderActivePage()}
// //         </Box>

// //         <Button
// //           variant="contained"
// //           onClick={handleSaveNote}
// //           sx={{ textTransform: "none", bgcolor: "#973aa8", borderRadius: 3, px: 3, mt: 2, mb: 4, "&:hover": { bgcolor: "#7b2c8a" } }}
// //         >
// //           Save Note
// //         </Button>

// //         {/* --- Folders နဲ့ Note Files Layout --- */}
// //         <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 3 }}>
          
// //           <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
// //             <Button onClick={handleSortByTitle} startIcon={<SwapVertOutlined sx={{ fontSize: 16 }} />} sx={{ textTransform: 'none', color: '#1565c0', fontWeight: 'bold', fontSize: '13px' }}>
// //               Sort by Title {titleSortOrder ? `(${titleSortOrder.toUpperCase()})` : ''}
// //             </Button>
// //             <Button onClick={handleSortByUpdated} startIcon={<SwapVertOutlined sx={{ fontSize: 16 }} />} sx={{ textTransform: 'none', color: '#1565c0', fontWeight: 'bold', fontSize: '13px' }}>
// //               Sort by Updated {updateSortOrder ? `(${updateSortOrder.toUpperCase()})` : ''}
// //             </Button>
// //           </Stack>

// //           <Grid container spacing={4}>
      
// //             <Grid size={{xs:12,md:3.5}}>
// //               <Stack spacing={1.5}>
                
                
// //                 <Box>
// //                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
// //                     <FolderOpenOutlined sx={{ color: '#d4a373' }} />
// //                     <Typography sx={{ color: '#1565c0', fontWeight: 500, fontSize: '14px' }}>All Notes</Typography>
// //                   </Box>
// //                   {savedFiles.length > 0 && renderFolderFiles()}
// //                 </Box>

        
// //                 <Box>
// //                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
// //                     <FolderOpenOutlined sx={{ color: '#d4a373' }} />
// //                     <Typography sx={{ color: '#1565c0', fontWeight: 500, fontSize: '14px' }}>Inbox</Typography>
// //                   </Box>
// //                   {savedFiles.length > 0 && renderFolderFiles()}
// //                 </Box>

// //                 <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', maxWidth: '200px' }}>
// //                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
// //                     <FolderOpenOutlined sx={{ color: '#d4a373' }} />
// //                     <Typography sx={{ color: '#1565c0', fontWeight: 500, fontSize: '14px' }}>card collection</Typography>
// //                   </Box>
// //                   <IconButton size="small"><MoreVertOutlined sx={{ fontSize: 16, color: '#1565c0' }} /></IconButton>
// //                 </Box>
                
       
// //                 <Box 
// //                   onClick={handleDeleteClick} 
// //                   sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', maxWidth: '200px' }}
// //                 >
// //                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
// //                     <DeleteOutlineOutlined sx={{ color: '#ff3d00' }} />
// //                     <Typography sx={{ color: '#ff3d00', fontWeight: 500, fontSize: '14px' }}>Recycle Bin</Typography>
// //                   </Box>
// //                   <IconButton size="small"><MoreVertOutlined sx={{ fontSize: 16, color: '#ff3d00' }} /></IconButton>
// //                 </Box>

              
// //                 <Popover
// //                   open={openDeletePopover}
// //                   anchorEl={deleteAnchorEl}
// //                   onClose={handleDeleteClose}
// //                   anchorOrigin={{
// //                     vertical: 'center',
// //                     horizontal: 'right', 
// //                   }}
// //                   transformOrigin={{
// //                     vertical: 'center',
// //                     horizontal: 'left',
// //                   }}
// //                   slotProps={{
// //                     paper: {
// //                       sx: {
// //                         p: 2,
// //                         boxShadow: '0px 4px 16px rgba(0,0,0,0.12)',
// //                         border: '1px solid #e0e0e0',
// //                         borderRadius: '8px',
// //                         ml: 1 
// //                       }
// //                     }
// //                   }}
// //                 >
// //                   <Typography sx={{ fontSize: '13px', fontWeight: 500, mb: 1.5, color: 'text.primary' }}>
// //                     Delete all saved files?
// //                   </Typography>
// //                   <Stack direction="row" spacing={1} sx={{justifyContent:'flex-end'}}>
// //                     <Button 
// //                       size="small" 
// //                       onClick={handleDeleteClose}
// //                       sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '12px' }}
// //                     >
// //                       Cancel
// //                     </Button>
// //                     <Button 
// //                       size="small" 
// //                       variant="contained" 
// //                       onClick={handleDeleteConfirm}
// //                       sx={{ textTransform: 'none', bgcolor: '#ff3d00', fontSize: '12px', '&:hover': { bgcolor: '#e03500' } }}
// //                     >
// //                       Confirm
// //                     </Button>
// //                   </Stack>
// //                 </Popover>

// //                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
// //                   <SettingsOutlined sx={{ color: '#777' }} />
// //                   <Typography sx={{ color: '#1565c0', fontWeight: 500, fontSize: '14px' }}>Manage Collections</Typography>
// //                 </Box>
// //               </Stack>
// //             </Grid>

      
// //             <Grid  size={{xs:12,md:8.5}}>
// //               <Grid container spacing={2}>
// //                 {savedFiles.map((file) => (
// //                   <Grid  size={{xs:12,sm:6,md:4}} key={file.id}>
// //                     <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderRadius: '4px', '&:hover': { bgcolor: '#f5f5f5' } }}>
// //                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
// //                         {getFileIcon(file.type)}
// //                         <Typography noWrap sx={{ fontSize: '14px', color: '#1565c0', fontWeight: 500, cursor: 'pointer' }}>
// //                           {file.title}
// //                         </Typography>
// //                       </Box>
// //                       <IconButton size="small">
// //                         <MoreVertOutlined sx={{ fontSize: 16, color: '#1565c0' }} />
// //                       </IconButton>
// //                     </Box>
// //                   </Grid>
// //                 ))}
// //               </Grid>
// //             </Grid>

// //           </Grid>
// //         </Box>

// //       </Box>
// //     </Box>
// //   );
// // };


// // import { Box, Button, Stack, TextField, styled, Menu, MenuItem, Typography, Grid, IconButton, Popover } from '@mui/material';
// // import React, { useRef, useState } from 'react';
// // import { 
// //   NoteAddOutlined, FileUploadOutlined, ShareOutlined, DescriptionOutlined, 
// //   ArticleOutlined, FormatListBulletedOutlined, BookmarkBorderOutlined, 
// //   BorderColorOutlined, TableChartOutlined, ChatBubbleOutlineOutlined,
// //   FolderOpenOutlined, DeleteOutlineOutlined, SettingsOutlined, MoreVertOutlined,
// //   SwapVertOutlined
// // } from '@mui/icons-material';
// // import { PlainTextNotePage } from '../notecreatepage/PlainTextNotePage';
// // import { RichTextNotePage } from '../notecreatepage/RichTextNotePage';
// // import { TaskListPage } from '../notecreatepage/TaskListPage';
// // import { WhiteboardPage } from '../notecreatepage/WhiteboardPage';
// // import { BookMarkPage } from '../notecreatepage/BookMarkPage';
// // import { SpreadsheetPage } from '../notecreatepage/SpreadsheetPage';
// // import { GroupChatPage } from '../notecreatepage/GroupChatPage';
// // import { MarkdownPage } from '../notecreatepage/MarkdownPage';

// // import { useCreateNoteMutation } from '../../services/noteApi';


// // const VisuallyHiddenInput = styled('input')({
// //   display: 'none', 
// // });

// // interface LocalNoteFile {
// //   id: string;
// //   title: string;
// //   description: string;

// // }

// // export const NoteCreateForm = () => {
// //   const fileInputRef = useRef<HTMLInputElement>(null);
// //   const [createNote] = useCreateNoteMutation();

// //   const [noteTitle, setNoteTitle] = useState<string>('');
// //   const [noteDescription, setNoteDescription] = useState<string>('');
// //   const [activePage, setActivePage] = useState<string>('/note-create-form/plain-text');
// //   const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

// //   const [titleSortOrder, setTitleSortOrder] = useState<'asc' | 'desc' | null>(null);
// //   const [updateSortOrder, setUpdateSortOrder] = useState<'asc' | 'desc' | null>(null);


// //   const [savedFiles, setSavedFiles] = useState<LocalNoteFile[]>([]);

// //   const [deleteAnchorEl, setDeleteAnchorEl] = useState<HTMLDivElement | null>(null);
// //   const openDeletePopover = Boolean(deleteAnchorEl);

// //   const openMenu = Boolean(anchorEl);

// //   const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
// //     setAnchorEl(event.currentTarget);
// //   };
// //   const handleMenuClose = () => {
// //     setAnchorEl(null);
// //   };

// //   const handleMenuClick = (pageType: string) => {
// //     setActivePage(pageType);
// //     handleMenuClose();
// //   };

// //   const handleButtonClick = () => {
// //     if (fileInputRef.current) {
// //       fileInputRef.current.click();
// //     }
// //   };

// //   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// //     const files = event.target.files;
// //     if (files && files.length > 0) {
// //       console.log("Selected PDF Files:", Array.from(files));
// //       setNoteTitle(files[0].name.replace(".pdf", ""));
// //     }
// //   };

// //   const getFileIcon = (type: string) => {
// //     switch (type) {
// //       case '/note-create-form/spread-sheet': return <TableChartOutlined sx={{ color: '#2e7d32', fontSize: 18 }} />;
// //       case '/note-create-form/white-board': return <BorderColorOutlined sx={{ color: '#0288d1', fontSize: 18 }} />;
// //       case '/note-create-form/book-mark': return <BookmarkBorderOutlined sx={{ color: '#ed6c02', fontSize: 18 }} />;
// //       case '/note-create-form/task-list': return <FormatListBulletedOutlined sx={{ color: '#7b1fa2', fontSize: 18 }} />;
// //       default: return <ArticleOutlined sx={{ color: '#555', fontSize: 18 }} />;
// //     }
// //   };

// //   const handleDeleteClick = (event: React.MouseEvent<HTMLDivElement>) => {
// //     setDeleteAnchorEl(event.currentTarget);
// //   };

// //   const handleDeleteClose = () => {
// //     setDeleteAnchorEl(null);
// //   };

// //   const handleDeleteConfirm = () => {
// //     setSavedFiles([]); 
// //     setDeleteAnchorEl(null);
// //   };

// //   const handleSortByTitle = () => {
// //     const nextOrder = titleSortOrder === 'asc' ? 'desc' : 'asc';
// //     setTitleSortOrder(nextOrder);
// //     setUpdateSortOrder(null);

// //     const sorted = [...savedFiles].sort((a, b) => {
// //       return nextOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
// //     });
// //     setSavedFiles(sorted);
// //   };

// //   const handleSortByUpdated = () => {
// //     const nextOrder = updateSortOrder === 'asc' ? 'desc' : 'asc';
// //     setUpdateSortOrder(nextOrder);
// //     setTitleSortOrder(null);

// //     // const sorted = [...savedFiles].sort((a, b) => {
// //     //   return nextOrder === 'asc' ? ;
// //     // });
// //     // setSavedFiles(sorted);
// //   };

 
// //   const handleOpenFile = (file: LocalNoteFile) => {
// //     setNoteTitle(file.title);
// //     setNoteDescription(file.description);
 
// //   };

// //   // note store place
// //   const handleSaveNote = async () => {
// //     if (!noteTitle.trim()) {
// //       alert("Please enter a note title!");
// //       return;
// //     }

// //     const newFile: LocalNoteFile = {
// //       id: Date.now().toString(),
// //       title: noteTitle,
// //       description: noteDescription,
     
  
// //     };

// //     setSavedFiles(prev => [newFile, ...prev]);

   
// //     try {
// //       const payload = {
// //         title: noteTitle,
// //         content: noteDescription,
        
// //       };
// //       await createNote(payload).unwrap();
// //     } catch (err) {
// //       console.error("API Save Failed:", err);
// //     }

   
// //   };

 
// //   const renderFolderFiles = () => (
// //     <Stack spacing={1} sx={{ pl: 4, mt: 1, mb: 1, maxHeight: '200px', overflowY: 'auto' }}>
// //       {savedFiles.map((file) => (
// //         <Box key={file.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.2 }}>
// //           {getFileIcon(file.description)}
// //           <Typography 
// //             noWrap 
// //             onClick={() => handleOpenFile(file)} 
// //             sx={{ fontSize: '13px', color: '#1565c0', cursor: 'pointer', maxWidth: '150px' }}
// //           >
// //             {file.title}
// //           </Typography>
// //         </Box>
// //       ))}
// //     </Stack>
// //   );

// //   const renderActivePage = () => {
// //     switch (activePage) {
// //       case '/note-create-form/plain-text': return <PlainTextNotePage description={noteDescription} setText={setNoteDescription} />;
// //       case '/note-create-form/rich-text': return <RichTextNotePage description={noteDescription} setText={setNoteDescription} />;
// //       case '/note-create-form/mark-down': return <MarkdownPage description={noteDescription} setText={setNoteDescription}/>;
// //       case '/note-create-form/task-list': return <TaskListPage description={noteDescription} setText={setNoteDescription} />;
// //       case '/note-create-form/book-mark': return <BookMarkPage description={noteDescription} setText={setNoteDescription}/>; // 👈 ဤနေရာတွင် Component မှန်ကန်အောင် ပြင်ထားပါသည်
// //       case '/note-create-form/white-board': return <WhiteboardPage description={noteDescription} setText={setNoteDescription}/>;
// //       case '/note-create-form/spread-sheet': return <SpreadsheetPage description={noteDescription} setText={setNoteDescription} />;
// //       case '/note-create-form/group-chat': return <GroupChatPage description={noteDescription} setText={setNoteDescription} />;
// //       default: return <PlainTextNotePage description={noteDescription} setText={setNoteDescription} />;
// //     }
// //   };

// //   return (
// //     <Box sx={{ display: 'flex', flexDirection: 'column', width: "100%", p: 2, bgcolor:"background.default", color:"text.primary" }}>
// //       <Box>
// //         {/* --- Note Create Form ဇုန် --- */}
// //         <Stack sx={{ mb: 2 }}>
// //           <TextField 
// //             variant='outlined' 
// //             label="Note Title" 
// //             value={noteTitle} 
// //             onChange={(e) => setNoteTitle(e.target.value)}
// //           />
// //         </Stack>
        
// //         <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
// //           <Button 
// //             id="new-note-button"
// //             startIcon={<NoteAddOutlined/>} 
// //             onClick={handleMenuOpen} 
// //             sx={{ textTransform: "none", color: "text.primary", fontSize: "14px", "& .MuiButton-startIcon": { color: "#973aa8" } }}
// //           >
// //             New Note
// //           </Button>

// //           <Menu
// //             id="new-note-menu"
// //             anchorEl={anchorEl}
// //             open={openMenu}
// //             onClose={handleMenuClose}
// //             slotProps={{
// //               list: { 'aria-labelledby': 'new-note-button' },
// //               paper: {
// //                 sx: {
// //                   boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
// //                   border: '1px solid #e0e0e0',
// //                   borderRadius: '8px',
// //                   minWidth: '180px',
// //                   mt: 0.5,
// //                   "& .MuiMenuItem-root": {
// //                     fontSize: '14px',
// //                     color: '#973aa8',
// //                     fontWeight: '500',
// //                     py: 1,
// //                     gap: 1.5,
// //                     "&:hover": { bgcolor: "#f5f9ff" }
// //                   },
// //                 }
// //               }
// //             }}
// //           >
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/plain-text')}>
// //               <DescriptionOutlined fontSize="small"/> Plain Text Note
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/rich-text')}>
// //               <ArticleOutlined fontSize="small"/> Rich Text Note
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/mark-down')}>
// //               <DescriptionOutlined fontSize="small"/> Markdown
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/task-list')}>
// //               <FormatListBulletedOutlined fontSize="small"/> Task List
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/book-mark')}>
// //               <BookmarkBorderOutlined fontSize="small"/> Bookmark
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/white-board')}>
// //               <BorderColorOutlined fontSize="small"/> Whiteboard
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/spread-sheet')}>
// //               <TableChartOutlined fontSize="small"/> Spreadsheet
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/group-chat')}>
// //               <ChatBubbleOutlineOutlined fontSize="small"/> Group Chat
// //             </MenuItem>
// //           </Menu>
          
// //           <Button onClick={handleButtonClick} size='small' startIcon={<FileUploadOutlined />} sx={{ textTransform: "none", color: "text.primary", "& .MuiButton-startIcon": { color: "#973aa8" } }}>
// //             Import Pdf
// //           </Button>

// //           <Button startIcon={<ShareOutlined />} sx={{ textTransform: "none", color: "text.primary", "& .MuiButton-startIcon": { color: "#973aa8" } }}>
// //             Share
// //           </Button>
// //         </Stack>

// //         <VisuallyHiddenInput
// //           type="file"
// //           ref={fileInputRef}
// //           accept="application/pdf"
// //           onChange={handleFileChange}
// //         />

// //         <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 3, width: '100%' }}>
// //           {renderActivePage()}
// //         </Box>

// //         <Button
// //           variant="contained"
// //           onClick={handleSaveNote}
// //           sx={{ textTransform: "none", bgcolor: "#973aa8", borderRadius: 3, px: 3, mt: 2, mb: 4, "&:hover": { bgcolor: "#7b2c8a" } }}
// //         >
// //           Save Note
// //         </Button>

// //         {/* --- Folders နဲ့ သိမ်းဆည်းထားသော ဖိုင်များပြသသည့် ဇုန် --- */}
// //         <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 3 }}>
          
// //           <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
// //             <Button onClick={handleSortByTitle} startIcon={<SwapVertOutlined sx={{ fontSize: 16 }} />} sx={{ textTransform: 'none', color: '#1565c0', fontWeight: 'bold', fontSize: '13px' }}>
// //               Sort by Title {titleSortOrder ? `(${titleSortOrder.toUpperCase()})` : ''}
// //             </Button>
// //             <Button onClick={handleSortByUpdated} startIcon={<SwapVertOutlined sx={{ fontSize: 16 }} />} sx={{ textTransform: 'none', color: '#1565c0', fontWeight: 'bold', fontSize: '13px' }}>
// //               Sort by Updated {updateSortOrder ? `(${updateSortOrder.toUpperCase()})` : ''}
// //             </Button>
// //           </Stack>

// //           <Grid container spacing={4}>
            
// //             {/* ဘယ်ဘက်ခြမ်း Folder List */}
// //             <Grid size={{xs:12,md:3.5}}>
// //               <Stack spacing={1.5}>
                
// //                 {/* 📂 All Notes Folder အောက်တွင် သိမ်းထားသောဖိုင်များ ပေါ်မည် */}
// //                 <Box>
// //                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
// //                     <FolderOpenOutlined sx={{ color: '#d4a373' }} />
// //                     <Typography sx={{ color: '#1565c0', fontWeight: 500, fontSize: '14px' }}>All Notes</Typography>
// //                   </Box>
// //                   {savedFiles.length > 0 && renderFolderFiles()}
// //                 </Box>

// //                 {/* 📂 Inbox Folder အောက်တွင် သိမ်းထားသောဖိုင်များ ပေါ်မည် */}
// //                 <Box>
// //                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
// //                     <FolderOpenOutlined sx={{ color: '#d4a373' }} />
// //                     <Typography sx={{ color: '#1565c0', fontWeight: 500, fontSize: '14px' }}>Inbox</Typography>
// //                   </Box>
// //                   {savedFiles.length > 0 && renderFolderFiles()}
// //                 </Box>

// //                 <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '200px' }}>
// //                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
// //                     <FolderOpenOutlined sx={{ color: '#d4a373' }} />
// //                     <Typography sx={{ color: '#1565c0', fontWeight: 500, fontSize: '14px' }}>card collection</Typography>
// //                   </Box>
// //                   <IconButton size="small"><MoreVertOutlined sx={{ fontSize: 16, color: '#1565c0' }} /></IconButton>
// //                 </Box>
                
// //                 <Box 
// //                   onClick={handleDeleteClick} 
// //                   sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', maxWidth: '200px' }}
// //                 >
// //                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
// //                     <DeleteOutlineOutlined sx={{ color: '#ff3d00' }} />
// //                     <Typography sx={{ color: '#ff3d00', fontWeight: 500, fontSize: '14px' }}>Recycle Bin</Typography>
// //                   </Box>
// //                   <IconButton size="small"><MoreVertOutlined sx={{ fontSize: 16, color: '#ff3d00' }} /></IconButton>
// //                 </Box>

// //                 <Popover
// //                   open={openDeletePopover}
// //                   anchorEl={deleteAnchorEl}
// //                   onClose={handleDeleteClose}
// //                   anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
// //                   transformOrigin={{ vertical: 'center', horizontal: 'left' }}
// //                   slotProps={{
// //                     paper: { sx: { p: 2, boxShadow: '0px 4px 16px rgba(0,0,0,0.12)', border: '1px solid #e0e0e0', borderRadius: '8px', ml: 1 } }
// //                   }}
// //                 >
// //                   <Typography sx={{ fontSize: '13px', fontWeight: 500, mb: 1.5, color: 'text.primary' }}>
// //                     Delete all saved files?
// //                   </Typography>
// //                   <Stack direction="row" spacing={1} sx={{justifyContent:'flex-end'}}>
// //                     <Button size="small" onClick={handleDeleteClose} sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '12px' }}>
// //                       Cancel
// //                     </Button>
// //                     <Button size="small" variant="contained" onClick={handleDeleteConfirm} sx={{ textTransform: 'none', bgcolor: '#ff3d00', fontSize: '12px', '&:hover': { bgcolor: '#e03500' } }}>
// //                       Confirm
// //                     </Button>
// //                   </Stack>
// //                 </Popover>

// //                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
// //                   <SettingsOutlined sx={{ color: '#777' }} />
// //                   <Typography sx={{ color: '#1565c0', fontWeight: 500, fontSize: '14px' }}>Manage Collections</Typography>
// //                 </Box>
// //               </Stack>
// //             </Grid>

// //             {/* ညာဘက်ခြမ်း File List Grid */}
// //             <Grid size={{xs:12,md:8.5}}>
// //               <Grid container spacing={2}>
// //                 {savedFiles.map((file) => (
// //                   <Grid size={{xs:12,sm:6,md:4}} key={file.id}>
// //                     <Box 
// //                       onClick={() => handleOpenFile(file)}
// //                       sx={{ 
// //                         display: 'flex', 
// //                         alignItems: 'center', 
// //                         justifyContent: 'space-between', 
// //                         p: 1, 
// //                         borderRadius: '4px', 
// //                         cursor: 'pointer', 
// //                         '&:hover': { bgcolor: '#f5f5f5' } 
// //                       }}
// //                     >
// //                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
// //                         {getFileIcon(file.description)}
// //                         <Typography noWrap sx={{ fontSize: '14px', color: '#1565c0', fontWeight: 500 }}>
// //                           {file.title}
// //                         </Typography>
// //                       </Box>
// //                       <IconButton size="small" onClick={(e) => e.stopPropagation()}>
// //                         <MoreVertOutlined sx={{ fontSize: 16, color: '#1565c0' }} />
// //                       </IconButton>
// //                     </Box>
// //                   </Grid>
// //                 ))}
// //               </Grid>
// //             </Grid>

// //           </Grid>
// //         </Box>

// //       </Box>
// //     </Box>
// //   );
// // };


// // import { Box, Button, Stack, TextField, styled, Menu, MenuItem, Typography, Grid, IconButton, Popover } from '@mui/material';
// // import React, { useRef, useState, useEffect } from 'react';
// // import { 
// //   NoteAddOutlined, FileUploadOutlined, ShareOutlined, DescriptionOutlined, 
// //   ArticleOutlined, FormatListBulletedOutlined, BookmarkBorderOutlined, 
// //   BorderColorOutlined, TableChartOutlined, ChatBubbleOutlineOutlined,
// //   FolderOpenOutlined, DeleteOutlineOutlined, SettingsOutlined, MoreVertOutlined,
// //   SwapVertOutlined
// // } from '@mui/icons-material';
// // import { PlainTextNotePage } from '../notecreatepage/PlainTextNotePage';
// // import { RichTextNotePage } from '../notecreatepage/RichTextNotePage';
// // import { TaskListPage } from '../notecreatepage/TaskListPage';
// // import { WhiteboardPage } from '../notecreatepage/WhiteboardPage';
// // import { BookMarkPage } from '../notecreatepage/BookMarkPage';
// // import { SpreadsheetPage } from '../notecreatepage/SpreadsheetPage';
// // import { GroupChatPage } from '../notecreatepage/GroupChatPage';
// // import { MarkdownPage } from '../notecreatepage/MarkdownPage';


// // const VisuallyHiddenInput = styled('input')({
// //   display: 'none', 
// // });

// // interface LocalNoteFile {
// //   id: string;
// //   title: string;
// //   description: string; 
// //   type: string;        
// //   updatedAt: number;   
// // }

// // export const NoteCreateForm = () => {
// //   const fileInputRef = useRef<HTMLInputElement>(null);

// //   const [noteTitle, setNoteTitle] = useState<string>('');
// //   const [noteDescription, setNoteDescription] = useState<string>('');
// //   const [activePage, setActivePage] = useState<string>('/note-create-form/plain-text');
// //   const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

// //   const [titleSortOrder, setTitleSortOrder] = useState<'asc' | 'desc' | null>(null);
// //   const [updateSortOrder, setUpdateSortOrder] = useState<'asc' | 'desc' | null>(null);

  
// //   const [savedFiles, setSavedFiles] = useState<LocalNoteFile[]>(() => {
// //     const localData = localStorage.getItem('local_saved_notes');
// //     return localData ? JSON.parse(localData) : [];
// //   });

// //   const [singleDeleteAnchorEl, setSingleDeleteAnchorEl] =  useState<HTMLElement | null>(null);
// //   const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
// //   const openSingleDeletePopover = Boolean(singleDeleteAnchorEl);

// //   const [deleteAnchorEl, setDeleteAnchorEl] = useState<HTMLDivElement | null>(null);
// //   const openDeletePopover = Boolean(deleteAnchorEl);
// //   const openMenu = Boolean(anchorEl);

  

  

 
// //   useEffect(() => {
// //     localStorage.setItem('local_saved_notes', JSON.stringify(savedFiles));
// //   }, [savedFiles]);

// //   const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
// //     setAnchorEl(event.currentTarget);
// //   };
// //   const handleMenuClose = () => {
// //     setAnchorEl(null);
// //   };

// //   const handleMenuClick = (pageType: string) => {
// //     setActivePage(pageType);
// //     setNoteTitle('');
// //     setNoteDescription('');
// //     handleMenuClose();
// //   };

// //   const handleButtonClick = () => {
// //     if (fileInputRef.current) {
// //       fileInputRef.current.click();
// //     }
// //   };

// //   // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// //   //   const files = event.target.files;
// //   //   if (files && files.length > 0) {
// //   //     setNoteDescription(files[0].name.replace(".pdf", ""));
// //   //   }
// //   // };

// //   const [pdfFile, setPdfFile] = useState<File | null>(null);

// // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// //   const files = event.target.files;

// //   if (files && files.length > 0) {
// //     const file = files[0];

// //     setPdfFile(file); 
// //     setNoteDescription(file.name.replace(".pdf", ""));
// //   }
// // };
  

// //   const getFileIcon = (type: string) => {
// //     switch (type) {
// //       case '/note-create-form/spread-sheet': return <TableChartOutlined sx={{ color: '#2e7d32', fontSize: 18 }} />;
// //       case '/note-create-form/white-board': return <BorderColorOutlined sx={{ color: '#0288d1', fontSize: 18 }} />;
// //       case '/note-create-form/book-mark': return <BookmarkBorderOutlined sx={{ color: '#ed6c02', fontSize: 18 }} />;
// //       case '/note-create-form/task-list': return <FormatListBulletedOutlined sx={{ color: '#7b1fa2', fontSize: 18 }} />;
// //       case '/note-create-form/rich-text': return <ArticleOutlined sx={{ color: '#973aa8', fontSize: 18 }} />;
// //       case '/note-create-form/mark-down': return <DescriptionOutlined sx={{ color: '#009688', fontSize: 18 }} />;
// //       default: return <DescriptionOutlined sx={{ color: '#555', fontSize: 18 }} />;
// //     }
// //   };

// //   const handleDeleteClick = (event: React.MouseEvent<HTMLDivElement>) => {
// //     setDeleteAnchorEl(event.currentTarget);
// //   };

// //   const handleDeleteClose = () => {
// //     setDeleteAnchorEl(null);
// //   };


// //   const handleDeleteConfirm = () => {
// //     setSavedFiles([]); 
// //     setDeleteAnchorEl(null);
// //   };


// //   // const handleSingleDelete = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
// //   //   e.stopPropagation(); // Card Click event 
// //   //   // setSavedFiles(prev => prev.filter(file => file.id !== id));
// //   //   setSingleDeleteAnchorEl("e.currentTarget");
// //   //   setSelectedDeleteId(id);
// //   // };
// //   const handleSingleDelete = (
// //   id: string,
// //   e: React.MouseEvent<HTMLDivElement>
// // ) => {
// //   e.stopPropagation();

// //   setSingleDeleteAnchorEl(e.currentTarget);
// //   setSelectedDeleteId(id);
// // };

// //   const handleSingleDeleteClose = (e?: React.MouseEvent) => {
// //     if (e) e.stopPropagation();
// //     setSingleDeleteAnchorEl(null);
// //     setSelectedDeleteId(null);
// //   };

// //   //
// //   const handleSingleDeleteConfirm = (e: React.MouseEvent) => {
// //     e.stopPropagation();
// //     if (selectedDeleteId) {
// //       setSavedFiles(prev => prev.filter(file => file.id !== selectedDeleteId));
// //     }
// //     handleSingleDeleteClose();
// //   };

// //   const handleSortByTitle = () => {
// //     const nextOrder = titleSortOrder === 'asc' ? 'desc' : 'asc';
// //     setTitleSortOrder(nextOrder);
// //     setUpdateSortOrder(null);

// //     const sorted = [...savedFiles].sort((a, b) => {
// //       return nextOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
// //     });
// //     setSavedFiles(sorted);
// //   };

// //   const handleSortByUpdated = () => {
// //     const nextOrder = updateSortOrder === 'asc' ? 'desc' : 'asc';
// //     setUpdateSortOrder(nextOrder);
// //     setTitleSortOrder(null);

// //     const sorted = [...savedFiles].sort((a, b) => {
// //       return nextOrder === 'asc' ? a.updatedAt - b.updatedAt : b.updatedAt - a.updatedAt;
// //     });
// //     setSavedFiles(sorted);
// //   };


// //   const handleOpenFile = (file: LocalNoteFile) => {
// //     setActivePage(file.type);
// //     setNoteTitle(file.title);
// //     setNoteDescription(file.description);
// //   };

 
// //   const handleSaveNote = () => {
// //     if (!noteTitle.trim()) {
// //       alert("Please enter a note title!");
// //       return;
// //     }
// // //if note file name same 
// //     const existingFileIndex = savedFiles.findIndex(f => f.title === noteTitle && f.type === activePage);

// //     if (existingFileIndex >= 0) {
// //       const updatedFiles = [...savedFiles];
// //       updatedFiles[existingFileIndex] = {
// //         ...updatedFiles[existingFileIndex],
// //         description: noteDescription,
// //         updatedAt: Date.now()
// //       };
// //       setSavedFiles(updatedFiles);
// //       alert("Note updated successfully!");
// //     } else {
      
// //       const newFile: LocalNoteFile = {
// //         id: Date.now().toString(),
// //         title: noteTitle,
// //         description: noteDescription,
// //         type: activePage, 
// //         updatedAt: Date.now()
// //       };
// //       setSavedFiles(prev => [newFile, ...prev]);
// //       // alert("Note saved successfully!");
// //     }
// //   };

// //   //show files in folders
// //   const renderFolderFiles = () => (
// //     <Stack spacing={1} sx={{ pl: 4, mt: 1, mb: 1, maxHeight: '200px', overflowY: 'auto' }}>
// //       {savedFiles.map((file) => (
// //         <Box key={file.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.2 }}>
// //           {getFileIcon(file.type)}
// //           <Typography 
// //             noWrap 
// //             onClick={() => handleOpenFile(file)} 
// //             sx={{ fontSize: '13px', color: 'text.primary', cursor: 'pointer', maxWidth: '150px' }}
// //           >
// //             {file.title}
// //           </Typography>
// //         </Box>
// //       ))}
// //     </Stack>
// //   );

// //   const renderActivePage = () => {
// //     switch (activePage) {
// //       case '/note-create-form/plain-text': return <PlainTextNotePage description={noteDescription} setText={setNoteDescription} />;
// //       case '/note-create-form/rich-text': return <RichTextNotePage description={noteDescription} setText={setNoteDescription} />;
// //       case '/note-create-form/mark-down': return <MarkdownPage description={noteDescription} setText={setNoteDescription}/>;
// //       case '/note-create-form/task-list': return <TaskListPage description={noteDescription} setText={setNoteDescription} />;
// //       case '/note-create-form/book-mark': return <BookMarkPage description={noteDescription} setText={setNoteDescription}/>; 
// //       case '/note-create-form/white-board': return <WhiteboardPage description={noteDescription} setText={setNoteDescription}/>;
// //       case '/note-create-form/spread-sheet': return <SpreadsheetPage description={noteDescription} setText={setNoteDescription} />;
// //       case '/note-create-form/group-chat': return <GroupChatPage description={noteDescription} setText={setNoteDescription} />;
// //       default: return <PlainTextNotePage description={noteDescription} setText={setNoteDescription} />;
// //     }
// //   };

// //   return (
// //     <Box sx={{ display: 'flex', flexDirection: 'column', width: "100%", p: 2, bgcolor:"background.default", color:"text.primary" }}>
// //       <Box>
// //         <Stack sx={{ mb: 2 }}>
// //           <TextField 
// //             variant='outlined' 
// //             label="Note Title" 
// //             value={noteTitle} 
// //             onChange={(e) => setNoteTitle(e.target.value)}
// //           />
// //         </Stack>
        
// //         <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
// //           <Button 
// //             id="new-note-button"
// //             startIcon={<NoteAddOutlined/>} 
// //             onClick={handleMenuOpen} 
// //             sx={{ textTransform: "none", color: "text.primary", fontSize: "14px", "& .MuiButton-startIcon": { color: "#973aa8" } }}
// //           >
// //             New Note
// //           </Button>

// //           <Menu
// //             id="new-note-menu"
// //             anchorEl={anchorEl}
// //             open={openMenu}
// //             onClose={handleMenuClose}
// //             slotProps={{
// //               list: { 'aria-labelledby': 'new-note-button' },
// //               paper: {
// //                 sx: {
// //                   boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
// //                   border: '1px solid #e0e0e0',
// //                   borderRadius: '8px',
// //                   minWidth: '180px',
// //                   mt: 0.5,
// //                   "& .MuiMenuItem-root": {
// //                     fontSize: '14px',
// //                     color: '#973aa8',
// //                     fontWeight: '500',
// //                     py: 1,
// //                     gap: 1.5,
// //                     "& :hover": { bgcolor: "#f5f9ff" }
// //                   },
// //                 }
// //               }
// //             }}
// //           >
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/plain-text')}>
// //               <DescriptionOutlined fontSize="small"/> Plain Text Note
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/rich-text')}>
// //               <ArticleOutlined fontSize="small"/> Rich Text Note
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/mark-down')}>
// //               <DescriptionOutlined fontSize="small"/> Markdown
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/task-list')}>
// //               <FormatListBulletedOutlined fontSize="small"/> Task List
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/book-mark')}>
// //               <BookmarkBorderOutlined fontSize="small"/> Bookmark
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/white-board')}>
// //               <BorderColorOutlined fontSize="small"/> Whiteboard
// //             </MenuItem>
// //             <MenuItem onClick={() => handleMenuClick('/note-create-form/spread-sheet')}>
// //               <TableChartOutlined fontSize="small"/> Spreadsheet
// //             </MenuItem>
// //             {/* <MenuItem onClick={() => handleMenuClick('/note-create-form/group-chat')}>
// //               <ChatBubbleOutlineOutlined fontSize="small"/> Group Chat
// //             </MenuItem> */}
// //           </Menu>
          
// //           {/* <Button onClick={handleButtonClick} size='small' startIcon={<FileUploadOutlined />} sx={{ textTransform: "none", color: "text.primary", "& .MuiButton-startIcon": { color: "#973aa8" } }}>
// //             Import Pdf
// //           </Button> */}
// //           <input
// //   type="file"
// //   accept="application/pdf"
// //   hidden
// //   id="pdf-upload"
// //   onChange={handleFileChange}
// // />

// // <label htmlFor="pdf-upload">
// //   <Button
// //     component="span"
// //     size="small"
// //     startIcon={<FileUploadOutlined />}
// //     sx={{
// //       textTransform: "none",
// //       color: "text.primary",
// //       "& .MuiButton-startIcon": {
// //         color: "#973aa8"
// //       }
// //     }}
// //   >
// //     Import Pdf
// //   </Button>
// // </label>

// //           <Button startIcon={<ShareOutlined />} sx={{ textTransform: "none", color: "text.primary", "& .MuiButton-startIcon": { color: "#973aa8" } }}>
// //             Share
// //           </Button>
// //         </Stack>

// //         <VisuallyHiddenInput
// //           type="file"
// //           ref={fileInputRef}
// //           accept="application/pdf"
// //           onChange={handleFileChange}
// //         />

// //         <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 3, width: '100%' }}>
// //           {renderActivePage()}
// //         </Box>

// //         <Button
// //         type='button'
// //           variant="contained"
// //           onClick={handleSaveNote}
// //           sx={{ textTransform: "none", bgcolor: "#973aa8", borderRadius: 3, px: 3, mt: 2, mb: 4, "&:hover": { bgcolor: "#7b2c8a" } }}
// //         >
// //           Save Note
// //         </Button>

// //         <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 3 ,color:'text.primary'}}>
// //           <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
// //             <Button onClick={handleSortByTitle} startIcon={<SwapVertOutlined sx={{ fontSize: 16 }} />} sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 'bold', fontSize: '12px' }}>
// //               Sort by Title {titleSortOrder ? `(${titleSortOrder.toUpperCase()})` : ''}
// //             </Button>
// //             <Button onClick={handleSortByUpdated} startIcon={<SwapVertOutlined sx={{ fontSize: 16 }} />} sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 'bold', fontSize: '12px' }}>
// //               Sort by Updated {updateSortOrder ? `(${updateSortOrder.toUpperCase()})` : ''}
// //             </Button>
// //           </Stack>

// //           <Grid container spacing={4}>
            
// //             <Grid size={{xs:12,md:3.5}}>
// //               <Stack spacing={1.5}>
// //                 <Box>
// //                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
// //                     <FolderOpenOutlined sx={{ color: '#d4a373' }} />
// //                     <Typography sx={{ color: 'text.primary', fontWeight: 500, fontSize: '14px' }}>All Notes</Typography>
// //                   </Box>
// //                   {savedFiles.length > 0 && renderFolderFiles()}
// //                 </Box>

// //                 {/* <Box>
// //                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
// //                     <FolderOpenOutlined sx={{ color: '#d4a373' }} />
// //                     <Typography sx={{ color: '#1565c0', fontWeight: 500, fontSize: '14px' }}>Inbox</Typography>
// //                   </Box>
// //                   {savedFiles.length > 0 && renderFolderFiles()}
// //                 </Box> */}

// //                 {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '200px' }}>
// //                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
// //                     <FolderOpenOutlined sx={{ color: '#d4a373' }} />
// //                     <Typography sx={{ color: '#1565c0', fontWeight: 500, fontSize: '14px' }}>card collection</Typography>
// //                   </Box>
// //                   <IconButton size="small"><MoreVertOutlined sx={{ fontSize: 16, color: '#1565c0' }} /></IconButton>
// //                 </Box> */}
                
// //                 <Box 
// //                   onClick={handleDeleteClick} 
// //                   sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', maxWidth: '200px' }}
// //                 >
// //                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
// //                     <DeleteOutlineOutlined sx={{ color: '#ff3d00' }} />
// //                     <Typography sx={{ color: 'text.primary', fontWeight: 500, fontSize: '14px' }}>Recycle Bin</Typography>
// //                   </Box>
// //                   <IconButton size="small"><MoreVertOutlined sx={{ fontSize: 16, color: '#ff3d00' }} /></IconButton>
// //                 </Box>

// //                 <Popover
// //                   open={openDeletePopover}
// //                   anchorEl={deleteAnchorEl}
// //                   onClose={handleDeleteClose}
// //                   anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
// //                   transformOrigin={{ vertical: 'center', horizontal: 'left' }}
// //                   slotProps={{
// //                     paper: { sx: { p: 2, boxShadow: '0px 4px 16px rgba(0,0,0,0.12)', border: '1px solid #e0e0e0', borderRadius: '8px', ml: 1 } }
// //                   }}
// //                 >
// //                   <Typography sx={{ fontSize: '13px', fontWeight: 500, mb: 1.5, color: 'text.primary' }}>
// //                     Delete all saved files?
// //                   </Typography>
// //                   <Stack direction="row" spacing={1} sx={{justifyContent:'flex-end'}}>
// //                     <Button size="small" onClick={handleDeleteClose} sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '12px' }}>
// //                       Cancel
// //                     </Button>
// //                     <Button size="small" variant="contained" onClick={handleDeleteConfirm} sx={{ textTransform: 'none', bgcolor: '#ff3d00', fontSize: '12px', '&:hover': { bgcolor: '#e03500' } }}>
// //                       Confirm
// //                     </Button>
// //                   </Stack>
// //                 </Popover>

// //                 {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
// //                   <SettingsOutlined sx={{ color: '#777' }} />
// //                   <Typography sx={{ color: '#1565c0', fontWeight: 500, fontSize: '14px' }}>Manage Collections</Typography>
// //                 </Box> */}
// //               </Stack>
// //             </Grid>

// //             <Grid size={{xs:12,md:8.5}}>
// //               <Grid container spacing={2}>
// //                 {savedFiles.map((file) => (
// //                   <Grid size={{xs:12,sm:6,md:4}} key={file.id}>
// //                     <Box 
// //                       onClick={() => handleOpenFile(file)}
// //                       sx={{ 
// //                         display: 'flex', 
// //                         alignItems: 'center', 
// //                         justifyContent: 'space-between', 
// //                         p: 1, 
// //                         borderRadius: '4px', 
// //                         cursor: 'pointer', 
// //                         border: activePage === file.type && noteTitle === file.title ? '1px solid #973aa8' : '1px solid #eee',
// //                         '&:hover': { bgcolor: '#f5f5f5' } 
// //                       }}
// //                     >
// //                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
// //                         {getFileIcon(file.type)}
// //                         <Typography noWrap sx={{ fontSize: '14px', color: 'text.primary', fontWeight: 500 }}>
// //                           {file.title}
// //                         </Typography>
// //                       </Box>
                  
// //                       <IconButton size="small" onClick={(e) =>handleSingleDelete(file.id,e)}>
// //                         <DeleteOutlineOutlined sx={{ fontSize: 16, color: '#ff3d00' }} />
// //                       </IconButton>
                
// //                          <Popover
// //                   open={openSingleDeletePopover}
// //                   anchorEl={singleDeleteAnchorEl}
// //                   onClose={(e:any)=>handleSingleDeleteClose(e)}
// //                   anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
// //                   transformOrigin={{ vertical: 'center', horizontal: 'left' }}
// //                   onClick={(e) => e.stopPropagation()}
// //                   slotProps={{
// //                     paper: { sx: { p: 2, boxShadow: '0px 4px 16px rgba(0,0,0,0.12)', border: '1px solid #e0e0e0', borderRadius: '8px', ml: 1 } }
// //                   }}
// //                 >
// //                   <Typography sx={{ fontSize: '13px', fontWeight: 500, mb: 1.5, color: 'text.primary' }}>
// //                     Delete saved files?
// //                   </Typography>
// //                   <Stack direction="row" spacing={1} sx={{justifyContent:'flex-end'}}>
// //                     <Button size="small" onClick={handleSingleDeleteClose} sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '12px' }}>
// //                       Cancel
// //                     </Button>
// //                     <Button size="small" variant="contained" onClick={handleSingleDeleteConfirm} sx={{ textTransform: 'none', bgcolor: '#ff3d00', fontSize: '12px', '&:hover': { bgcolor: '#e03500' } }}>
// //                       Confirm
// //                     </Button>
// //                   </Stack>
// //                 </Popover>
// //                     </Box>
// //                   </Grid>
// //                 ))}
// //               </Grid>
// //             </Grid>
// //           </Grid>
// //         </Box>
// //       </Box>
// //     </Box>
// //   );
// // };

// import { Box, Button, Stack, TextField, styled, Menu, MenuItem, Typography, Grid, IconButton, Popover } from '@mui/material';
// import React, { useRef, useState, useEffect } from 'react';
// import { 
//   NoteAddOutlined, FileUploadOutlined, ShareOutlined, DescriptionOutlined, 
//   ArticleOutlined, FormatListBulletedOutlined, BookmarkBorderOutlined, 
//   BorderColorOutlined, TableChartOutlined, ChatBubbleOutlineOutlined,
//   FolderOpenOutlined, DeleteOutlineOutlined, SettingsOutlined, MoreVertOutlined,
//   SwapVertOutlined, PictureAsPdfOutlined
// } from '@mui/icons-material';
// import { PlainTextNotePage } from '../notecreatepage/PlainTextNotePage';
// import { RichTextNotePage } from '../notecreatepage/RichTextNotePage';
// import { TaskListPage } from '../notecreatepage/TaskListPage';
// import { WhiteboardPage } from '../notecreatepage/WhiteboardPage';
// import { BookMarkPage } from '../notecreatepage/BookMarkPage';
// import { SpreadsheetPage } from '../notecreatepage/SpreadsheetPage';
// import { GroupChatPage } from '../notecreatepage/GroupChatPage';
// import { MarkdownPage } from '../notecreatepage/MarkdownPage';
// import {ShareNotePage} from '../sharepages/ShareNotePage';
// const VisuallyHiddenInput = styled('input')({
//   display: 'none', 
// });

// interface LocalNoteFile {
//   id: string;
//   title: string;
//   description: string; 
//   type: string;        
//   updatedAt: number;   
//   pdfUrl?: string; 
// }

// interface CollaboratorItem {
//   _id?: string;
//   invitedEmail: string;
//   status: string;
//   role: string;
//   pageUrl?: string;
//   source?: string;
// }

// interface UserProfile {
//   firstName?: string;
//   lastName?: string;
//   email?: string;
//   photo?: string;
// }



// export const NoteCreateForm = () => {
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [noteTitle, setNoteTitle] = useState<string>('');
//   const [noteDescription, setNoteDescription] = useState<string>('');
//   const [activePage, setActivePage] = useState<string>('/note-create-form/plain-text');
//   const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

//   const [titleSortOrder, setTitleSortOrder] = useState<'asc' | 'desc' | null>(null);
//   const [updateSortOrder, setUpdateSortOrder] = useState<'asc' | 'desc' | null>(null);

//   const [savedFiles, setSavedFiles] = useState<LocalNoteFile[]>(() => {
//     const localData = localStorage.getItem('local_saved_notes');
//     return localData ? JSON.parse(localData) : [];
//   });


//   const [singleDeleteAnchorEl, setSingleDeleteAnchorEl] = useState<HTMLButtonElement | null>(null);
//   const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
//   const openSingleDeletePopover = Boolean(singleDeleteAnchorEl);

//   const [deleteAnchorEl, setDeleteAnchorEl] = useState<HTMLDivElement | null>(null);
//   const openDeletePopover = Boolean(deleteAnchorEl);
//   const openMenu = Boolean(anchorEl);

//   // Selected PDF State tracker
//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);

//   //search text
//    const [searchOpen, setSearchOpen] = useState<boolean>(false);
//   const [searchText, setSearchText] = useState<string>('');

//   // for share 

//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [collaborators, setCollaborators] = useState<CollaboratorItem[]>([]);
//   const [shareAnchorEl, setShareAnchorEl] = useState<HTMLButtonElement | null>(null);
//   const [permissionMenuAnchorEl, setPermissionMenuAnchorEl] = useState<HTMLElement | null>(null);
//   const [activeCollaboratorId, setActiveCollaboratorId] = useState<string | null>(null);
//   const [activeRole, setActiveRole] = useState<string>("viewer");

//   const isShareOpen = Boolean(shareAnchorEl);


//    useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUser(parsedUser);
//       } catch (e) {
//         console.error("Failed to parse user from localStorage", e);
//       }
//     }

//     const loadCollaborators = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return;
//       try {
//         const response = await fetch("http://localhost:5000/api/share/collaborators", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (response.ok) {
//           const data = await response.json();
//           setCollaborators(data.collaborators || []);
//         }
//       } catch (err) {
//         console.error("Failed to load collaborators", err);
//       }
//     };

//     loadCollaborators();
//   }, []);



//   useEffect(() => {
//     localStorage.setItem('local_saved_notes', JSON.stringify(savedFiles));
//   }, [savedFiles]);

//   const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleMenuClick = (pageType: string) => {
//     setActivePage(pageType);
//     setNoteTitle('');
//     setNoteDescription('');
//     setPdfUrl(null); 
//     handleMenuClose();
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       const file = files[0];
//       setNoteTitle(file.name.replace(".pdf", "")); 
//       setNoteDescription(`PDF File: ${file.name}`);
      
      
//       const url = URL.createObjectURL(file);
//       setPdfUrl(url);
//       setActivePage('/note-create-form/pdf-view'); 
//     }
//   };

//   const getFileIcon = (type: string) => {
//     switch (type) {
//       case '/note-create-form/spread-sheet': return <TableChartOutlined sx={{ color: '#2e7d32', fontSize: 18 }} />;
//       case '/note-create-form/white-board': return <BorderColorOutlined sx={{ color: '#0288d1', fontSize: 18 }} />;
//       case '/note-create-form/book-mark': return <BookmarkBorderOutlined sx={{ color: '#ed6c02', fontSize: 18 }} />;
//       case '/note-create-form/task-list': return <FormatListBulletedOutlined sx={{ color: '#7b1fa2', fontSize: 18 }} />;
//       case '/note-create-form/rich-text': return <ArticleOutlined sx={{ color: '#973aa8', fontSize: 18 }} />;
//       case '/note-create-form/mark-down': return <DescriptionOutlined sx={{ color: '#009688', fontSize: 18 }} />;
//       case '/note-create-form/pdf-view': return <PictureAsPdfOutlined sx={{ color: '#d32f2f', fontSize: 18 }} />;
//       default: return <DescriptionOutlined sx={{ color: '#555', fontSize: 18 }} />;
//     }
//   };

//   const handleDeleteClick = (event: React.MouseEvent<HTMLDivElement>) => {
//     setDeleteAnchorEl(event.currentTarget);
//   };

//   const handleDeleteClose = () => {
//     setDeleteAnchorEl(null);
//   };

//   const handleDeleteConfirm = () => {
//     setSavedFiles([]); 
//     setDeleteAnchorEl(null);
//   };

  
//   const handleSingleDelete = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
//     e.stopPropagation();
//     setSingleDeleteAnchorEl(e.currentTarget);
//     setSelectedDeleteId(id);
//   };

//   const handleSingleDeleteClose = (e?: React.MouseEvent) => {
//     if (e) e.stopPropagation();
//     setSingleDeleteAnchorEl(null);
//     setSelectedDeleteId(null);
//   };

//   const handleSingleDeleteConfirm = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (selectedDeleteId) {
//       setSavedFiles(prev => prev.filter(file => file.id !== selectedDeleteId));
//     }
//     handleSingleDeleteClose();
//   };

//   const handleSortByTitle = () => {
//     const nextOrder = titleSortOrder === 'asc' ? 'desc' : 'asc';
//     setTitleSortOrder(nextOrder);
//     setUpdateSortOrder(null);

//     const sorted = [...savedFiles].sort((a, b) => {
//       return nextOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
//     });
//     setSavedFiles(sorted);
//   };

//   const handleSortByUpdated = () => {
//     const nextOrder = updateSortOrder === 'asc' ? 'desc' : 'asc';
//     setUpdateSortOrder(nextOrder);
//     setTitleSortOrder(null);

//     const sorted = [...savedFiles].sort((a, b) => {
//       return nextOrder === 'asc' ? a.updatedAt - b.updatedAt : b.updatedAt - a.updatedAt;
//     });
//     setSavedFiles(sorted);
//   };

//   const handleOpenFile = (file: LocalNoteFile) => {
//     setActivePage(file.type);
//     setNoteTitle(file.title);
//     setNoteDescription(file.description);
//     if (file.pdfUrl) {
//       setPdfUrl(file.pdfUrl);
//     } else {
//       setPdfUrl(null);
//     }
//   };

//   const handleSaveNote = () => {
//     if (!noteTitle.trim()) {
//       alert("Please enter a note title!");
//       return;
//     }

//     const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setShareAnchorEl(event.currentTarget);
//   };

//   const handleShareClose = () => {
//     setShareAnchorEl(null);
//   };

//   const handleOpenPermissionMenu = (event: React.MouseEvent<HTMLButtonElement>, id: string | null, currentRole: string) => {
//     setPermissionMenuAnchorEl(event.currentTarget);
//     setActiveCollaboratorId(id);
//     setActiveRole(currentRole || "viewer");
//   };

//   const handleClosePermissionMenu = () => {
//     setPermissionMenuAnchorEl(null);
//     setActiveCollaboratorId(null);
//   };

//   const handlePermissionChange = async (role: string) => {
//     if (!activeCollaboratorId) {
//       handleClosePermissionMenu();
//       return;
//     }
//     try {
//       const response = await fetch(`http://localhost:5000/api/share/${activeCollaboratorId}/role`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
//         },
//         body: JSON.stringify({ role }),
//       });
//       if (response.ok) {
//         setCollaborators((prev) => prev.map((person) => person._id === activeCollaboratorId ? { ...person, role } : person));
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       handleClosePermissionMenu();
//     }
//   };

//   const handleRemoveCollaborator = async () => {
//     if (!activeCollaboratorId) return;
//     try {
//       const response = await fetch(`http://localhost:5000/api/share/${activeCollaboratorId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
//       });
//       if (response.ok) {
//         setCollaborators((prev) => prev.filter((person) => person._id !== activeCollaboratorId));
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       handleClosePermissionMenu();
//     }
//   };

//   const getRoleLabel = (role: string) => {
//     if (role === "full") return "Full access";
//     if (role === "editor") return "Can edit";
//     if (role === "commenter") return "Can comment";
//     return "Can view";
//   };


//     const existingFileIndex = savedFiles.findIndex(f => f.title === noteTitle && f.type === activePage);

//     if (existingFileIndex >= 0) {
//       const updatedFiles = [...savedFiles];
//       updatedFiles[existingFileIndex] = {
//         ...updatedFiles[existingFileIndex],
//         description: noteDescription,
//         pdfUrl: pdfUrl || undefined,
//         updatedAt: Date.now()
//       };
//       setSavedFiles(updatedFiles);
//       alert("Note updated successfully!");
//     } else {
//       const newFile: LocalNoteFile = {
//         id: Date.now().toString(),
//         title: noteTitle,
//         description: noteDescription,
//         type: activePage, 
//         pdfUrl: pdfUrl || undefined,
//         updatedAt: Date.now()
//       };
//       setSavedFiles(prev => [newFile, ...prev]);
//       alert("Note saved successfully!");
//     }
//   };

//   const renderFolderFiles = () => (
//     <Stack spacing={1} sx={{ pl: 4, mt: 1, mb: 1, maxHeight: '200px', overflowY: 'auto' }}>
//       {savedFiles.map((file) => (
//         <Box key={file.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.2 }}>
//           {getFileIcon(file.type)}
//           <Typography 
//             noWrap 
//             onClick={() => handleOpenFile(file)} 
//             sx={{ fontSize: '13px', color: 'text.primary', cursor: 'pointer', maxWidth: '150px' }}
//           >
//             {file.title}
//           </Typography>
//         </Box>
//       ))}
//     </Stack>
//   );

//   const renderActivePage = () => {
//     switch (activePage) {
//       case '/note-create-form/plain-text': return <PlainTextNotePage description={noteDescription} setText={setNoteDescription} />;
//       case '/note-create-form/rich-text': return <RichTextNotePage description={noteDescription} setText={setNoteDescription} />;
//       case '/note-create-form/mark-down': return <MarkdownPage description={noteDescription} setText={setNoteDescription}/>;
//       case '/note-create-form/task-list': return <TaskListPage description={noteDescription} setText={setNoteDescription} />;
//       case '/note-create-form/book-mark': return <BookMarkPage description={noteDescription} setText={setNoteDescription}/>; 
//       case '/note-create-form/white-board': return <WhiteboardPage description={noteDescription} setText={setNoteDescription}/>;
//       case '/note-create-form/spread-sheet': return <SpreadsheetPage description={noteDescription} setText={setNoteDescription} />;
//       case '/note-create-form/group-chat': return <GroupChatPage description={noteDescription} setText={setNoteDescription} />;
      
//       // PDF Import လုပ်လိုက်တဲ့အချိန်မှာ တိုက်ရိုက် PDF View ပေါ်လာစေမယ့် အပိုင်း
//       case '/note-create-form/pdf-view': 
//         return pdfUrl ? (
//           <Box sx={{ width: '100%', height: '65vh', border: '1px solid #ccc', borderRadius: 1, overflow: 'hidden' }}>
//             <embed src={pdfUrl} type="application/pdf" width="100%" height="100%" />
//           </Box>
//         ) : (
//           <Typography color="error">No PDF file loaded.</Typography>
//         );
//       default: return <PlainTextNotePage description={noteDescription} setText={setNoteDescription} />;
//     }
//   };



//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', width: "100%", p: 2, bgcolor:"background.default", color:"text.primary" }}>
//       <Box>
//         <Stack sx={{ mb: 2 }}>
//           <TextField 
//             variant='outlined' 
//             label="Note Title" 
//             value={noteTitle} 
//             onChange={(e) => setNoteTitle(e.target.value)}
//           />
//         </Stack>
        
//         <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
//           <Button 
//             id="new-note-button"
//             startIcon={<NoteAddOutlined/>} 
//             onClick={handleMenuOpen} 
//             sx={{ textTransform: "none", color: "text.primary", fontSize: "14px", "& .MuiButton-startIcon": { color: "#973aa8" } }}
//           >
//             New Note
//           </Button>

//           <Menu
//             id="new-note-menu"
//             anchorEl={anchorEl}
//             open={openMenu}
//             onClose={handleMenuClose}
//             slotProps={{
//               list: { 'aria-labelledby': 'new-note-button' },
//               paper: {
//                 sx: {
//                   boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
//                   border: '1px solid #e0e0e0',
//                   borderRadius: '8px',
//                   minWidth: '180px',
//                   mt: 0.5,
//                   "& .MuiMenuItem-root": {
//                     fontSize: '14px',
//                     color: '#973aa8',
//                     fontWeight: '500',
//                     py: 1,
//                     gap: 1.5,
//                     "& :hover": { bgcolor: "#f5f9ff" }
//                   },
//                 }
//               }
//             }}
//           >
//             <MenuItem onClick={() => handleMenuClick('/note-create-form/plain-text')}>
//               <DescriptionOutlined fontSize="small"/> Plain Text Note
//             </MenuItem>
//             <MenuItem onClick={() => handleMenuClick('/note-create-form/rich-text')}>
//               <ArticleOutlined fontSize="small"/> Rich Text Note
//             </MenuItem>
//             <MenuItem onClick={() => handleMenuClick('/note-create-form/mark-down')}>
//               <DescriptionOutlined fontSize="small"/> Markdown
//             </MenuItem>
//             <MenuItem onClick={() => handleMenuClick('/note-create-form/task-list')}>
//               <FormatListBulletedOutlined fontSize="small"/> Task List
//             </MenuItem>
//             <MenuItem onClick={() => handleMenuClick('/note-create-form/book-mark')}>
//               <BookmarkBorderOutlined fontSize="small"/> Bookmark
//             </MenuItem>
//             <MenuItem onClick={() => handleMenuClick('/note-create-form/white-board')}>
//               <BorderColorOutlined fontSize="small"/> Whiteboard
//             </MenuItem>
//             <MenuItem onClick={() => handleMenuClick('/note-create-form/spread-sheet')}>
//               <TableChartOutlined fontSize="small"/> Spreadsheet
//             </MenuItem>
//           </Menu>

//           <label htmlFor="pdf-upload">
//             <Button
//               component="span"
//               size="small"
//               startIcon={<FileUploadOutlined />}
//               sx={{ textTransform: "none", color: "text.primary", "& .MuiButton-startIcon": { color: "#973aa8" } }}
//             >
//               Import Pdf
//             </Button>
//           </label>
//          <IconButton size="small" sx={{ color: 'text.primary', mr: searchOpen ? 1 : 0, borderRadius: '4px'}} onClick={() => setSearchOpen((prev) => !prev)}>
//                   <Search fontSize="small" />
//                 </IconButton>
//                 {searchOpen && (
//                   <TextField
//                     size="small"
//                     autoFocus
//                     placeholder="Search text"
//                     value={searchText}
//                     onChange={(event) => setSearchText(event.target.value)}
//                     sx={{
//                       width: 180,
//                       '& .MuiOutlinedInput-root': {
//                         height: 30,
//                         fontSize: '0.85rem',
//                         bgcolor: 'background.default',
//                         borderRadius: '4px',
//                       },
//                       '& .MuiOutlinedInput-input': {
//                         py: 0.5,
//                         px: 1,
//                       },
//                     }}
//                   />
//                 )}
        
//                   <Button
//             startIcon={<ShareOutlined />}
//             onClick={handleShareClick}
//             sx={{
//               color: 'text.primary',
//               bgcolor: isShareOpen ? 'action.selected' : 'background.default',
//               borderRadius: '4px',
//               textTransform: 'none',
//               transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//               '&:hover': {
//                 bgcolor: 'action.hover'
//               }
//             }}
//           >
//             Share
//           </Button>
//         </Stack>
        
//         {/* Share Note Page Popover */}
//         <Popover
//           open={isShareOpen}
//           anchorEl={shareAnchorEl}
//           onClose={handleShareClose}
//           anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//           transformOrigin={{ vertical: "top", horizontal: "left" }}
//           slotProps={{
//             paper: {
//               sx: {
//                 width: 420,
//                 p: 2.5,
//                 mt: 1,
//                 borderRadius: 3,
//                 boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
//                 bgcolor: 'background.paper',
//                 color: 'text.primary'
//               }
//             }
//           }}
//         >
//           <ShareNotePage
//             user={user}
//             collaborators={collaborators}
//             setCollaborators={setCollaborators}
//             handleOpenPermissionMenu={handleOpenPermissionMenu}
//             getRoleLabel={getRoleLabel}
//           />
//         </Popover>

//         {/* --- 💡 Permission Settings Dropdown Menu --- */}
//         <Menu
//           anchorEl={permissionMenuAnchorEl}
//           open={Boolean(permissionMenuAnchorEl)}
//           onClose={handleClosePermissionMenu}
//           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//           transformOrigin={{ vertical: "top", horizontal: "right" }}
//           slotProps={{ paper: { sx: { width: 340, borderRadius: 3, p: 0.5, boxShadow: "0px 4px 16px rgba(0,0,0,0.12)" } } }}
//         >
//           <MenuItem onClick={() => handlePermissionChange("full")} sx={{ py: 1 }}>
//             <ListItemText
//               primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Full access</Typography>}
//               secondary={<Typography variant="caption" color="text.secondary">Edit, suggest, comment, and share</Typography>}
//             />
//             {activeRole === "full" && <Check sx={{ fontSize: 16, ml: 1 }} />}
//           </MenuItem>

//           <MenuItem onClick={() => handlePermissionChange("editor")} sx={{ py: 1 }}>
//             <ListItemText
//               primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can edit</Typography>}
//               secondary={<Typography variant="caption" color="text.secondary">Edit, suggest, and comment</Typography>}
//             />
//             {activeRole === "editor" && <Check sx={{ fontSize: 16, ml: 1 }} />}
//           </MenuItem>

//           <MenuItem onClick={() => handlePermissionChange("commenter")} sx={{ py: 1 }}>
//             <ListItemText
//               primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can comment</Typography>}
//               secondary={<Typography variant="caption" color="text.secondary">Suggest and comment</Typography>}
//             />
//             {activeRole === "commenter" && <Check sx={{ fontSize: 16, ml: 1 }} />}
//           </MenuItem>

//           <MenuItem onClick={() => handlePermissionChange("viewer")} sx={{ py: 1 }}>
//             <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can view</Typography>} />
//             {activeRole === "viewer" && <Check sx={{ fontSize: 16, ml: 1 }} />}
//           </MenuItem>

//           {activeCollaboratorId && (
//             <>
//               <Box sx={{ my: 0.5, borderTop: "1px solid #f0f0f0" }} />
//               <MenuItem onClick={handleRemoveCollaborator} sx={{ py: 1, color: "error.main" }}>
//                 <ListItemIcon sx={{ color: "error.main", minWidth: 30 }}><DeleteOutlined sx={{ fontSize: 18 }} /></ListItemIcon>
//                 <Typography variant="body2" sx={{ fontWeight: 500 }}>Remove</Typography>
//               </MenuItem>
//             </>
//           )}
//         </Menu>


//         <VisuallyHiddenInput
//           type="file"
//           id="pdf-upload"
//           accept="application/pdf"
//           onChange={handleFileChange}
//         />

//         <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 3, width: '100%' }}>
//           {renderActivePage()}
//         </Box>

//         <Button
//           type='button'
//           variant="contained"
//           onClick={handleSaveNote}
//           sx={{ textTransform: "none", bgcolor: "#973aa8", borderRadius: 3, px: 3, mt: 2, mb: 4, "&:hover": { bgcolor: "#7b2c8a" } }}
//         >
//           Save Note
//         </Button>

//         <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 3 ,color:'text.primary'}}>
//           <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
//             <Button onClick={handleSortByTitle} startIcon={<SwapVertOutlined sx={{ fontSize: 16 }} />} sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 'bold', fontSize: '12px' }}>
//               Sort by Title {titleSortOrder ? `(${titleSortOrder.toUpperCase()})` : ''}
//             </Button>
//             <Button onClick={handleSortByUpdated} startIcon={<SwapVertOutlined sx={{ fontSize: 16 }} />} sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 'bold', fontSize: '12px' }}>
//               Sort by Updated {updateSortOrder ? `(${updateSortOrder.toUpperCase()})` : ''}
//             </Button>
//           </Stack>

//           <Grid container spacing={4}>
//             <Grid size={{xs:12,md:3.5}}>
//               <Stack spacing={1.5}>
//                 <Box>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//                     <FolderOpenOutlined sx={{ color: '#d4a373' }} />
//                     <Typography sx={{ color: 'text.primary', fontWeight: 500, fontSize: '14px' }}>All Notes</Typography>
//                   </Box>
//                   {savedFiles.length > 0 && renderFolderFiles()}
//                 </Box>
                
//                 <Box 
//                   onClick={handleDeleteClick} 
//                   sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', maxWidth: '200px' }}
//                 >
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//                     <DeleteOutlineOutlined sx={{ color: '#ff3d00' }} />
//                     <Typography sx={{ color: 'text.primary', fontWeight: 500, fontSize: '14px' }}>Recycle Bin</Typography>
//                   </Box>
//                   <IconButton size="small"><MoreVertOutlined sx={{ fontSize: 16, color: '#ff3d00' }} /></IconButton>
//                 </Box>

//                 <Popover
//                   open={openDeletePopover}
//                   anchorEl={deleteAnchorEl}
//                   onClose={handleDeleteClose}
//                   anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
//                   transformOrigin={{ vertical: 'center', horizontal: 'left' }}
//                   slotProps={{
//                     paper: { sx: { p: 2, boxShadow: '0px 4px 16px rgba(0,0,0,0.12)', border: '1px solid #e0e0e0', borderRadius: '8px', ml: 1 } }
//                   }}
//                 >
//                   <Typography sx={{ fontSize: '13px', fontWeight: 500, mb: 1.5, color: 'text.primary' }}>
//                     Delete all saved files?
//                   </Typography>
//                   <Stack direction="row" spacing={1} sx={{justifyContent:'flex-end'}}>
//                     <Button size="small" onClick={handleDeleteClose} sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '12px' }}>
//                       Cancel
//                     </Button>
//                     <Button size="small" variant="contained" onClick={handleDeleteConfirm} sx={{ textTransform: 'none', bgcolor: '#ff3d00', fontSize: '12px', '&:hover': { bgcolor: '#e03500' } }}>
//                       Confirm
//                     </Button>
//                   </Stack>
//                 </Popover>
//               </Stack>
//             </Grid>

//             <Grid size={{xs:12,md:8.5}}>
//               <Grid container spacing={2}>
//                 {savedFiles.map((file) => (
//                   <Grid size={{xs:12,sm:6,md:4}} key={file.id}>
//                     <Box 
//                       onClick={() => handleOpenFile(file)}
//                       sx={{ 
//                         display: 'flex', 
//                         alignItems: 'center', 
//                         justifyContent: 'space-between', 
//                         p: 1, 
//                         borderRadius: '4px', 
//                         cursor: 'pointer', 
//                         border: activePage === file.type && noteTitle === file.title ? '1px solid #973aa8' : '1px solid #eee',
//                         '&:hover': { bgcolor: '#f5f5f5' } 
//                       }}
//                     >
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
//                         {getFileIcon(file.type)}
//                         <Typography noWrap sx={{ fontSize: '14px', color: 'text.primary', fontWeight: 500 }}>
//                           {file.title}
//                         </Typography>
//                       </Box>
                  
//                       {/* Click Mouse Event ကို ButtonElement သို့ လိုက်လျောညီထွေဖြစ်အောင် ပြောင်းလဲလိုက်ပါတယ် */}
//                       <IconButton size="small" onClick={(e) => handleSingleDelete(file.id, e)}>
//                         <DeleteOutlineOutlined sx={{ fontSize: 16, color: '#ff3d00' }} />
//                       </IconButton>
                
//                       <Popover
//                         open={openSingleDeletePopover}
//                         anchorEl={singleDeleteAnchorEl}
//                         onClose={() => handleSingleDeleteClose()}
//                         anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
//                         transformOrigin={{ vertical: 'center', horizontal: 'left' }}
//                         onClick={(e) => e.stopPropagation()}
//                         slotProps={{
//                           paper: { sx: { p: 2, boxShadow: '0px 4px 16px rgba(0,0,0,0.12)', border: '1px solid #e0e0e0', borderRadius: '8px', ml: 1 } }
//                         }}
//                       >
//                         <Typography sx={{ fontSize: '13px', fontWeight: 500, mb: 1.5, color: 'text.primary' }}>
//                           Delete saved files?
//                         </Typography>
//                         <Stack direction="row" spacing={1} sx={{justifyContent:'flex-end'}}>
//                           <Button size="small" onClick={() => handleSingleDeleteClose()} sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '12px' }}>
//                             Cancel
//                           </Button>
//                           <Button size="small" variant="contained" onClick={handleSingleDeleteConfirm} sx={{ textTransform: 'none', bgcolor: '#ff3d00', fontSize: '12px', '&:hover': { bgcolor: '#e03500' } }}>
//                             Confirm
//                           </Button>
//                         </Stack>
//                       </Popover>
//                     </Box>
//                   </Grid>
//                 ))}
//               </Grid>
//             </Grid>
//           </Grid>
//         </Box>
//       </Box>
//     </Box>
//   );
// };



// import { Box, Button, Stack, TextField, styled, Menu, MenuItem, ListItemText, ListItemIcon, Typography, Grid, IconButton, Popover } from '@mui/material';
// import React, { useRef, useState, useEffect } from 'react';
// import { 
//   NoteAddOutlined, FileUploadOutlined, ShareOutlined, DescriptionOutlined, 
//   ArticleOutlined, FormatListBulletedOutlined, BookmarkBorderOutlined, 
//   BorderColorOutlined, TableChartOutlined, DeleteOutlined, Check,
//   FolderOpenOutlined, DeleteOutlineOutlined, MoreVertOutlined,
//   SwapVertOutlined, PictureAsPdfOutlined, Search
// } from '@mui/icons-material';
// import { PlainTextNotePage } from '../notecreatepage/PlainTextNotePage';
// import { RichTextNotePage } from '../notecreatepage/RichTextNotePage';
// import { TaskListPage } from '../notecreatepage/TaskListPage';
// import { WhiteboardPage } from '../notecreatepage/WhiteboardPage';
// import { BookMarkPage } from '../notecreatepage/BookMarkPage';
// import { SpreadsheetPage } from '../notecreatepage/SpreadsheetPage';
// import { GroupChatPage } from '../notecreatepage/GroupChatPage';
// import { MarkdownPage } from '../notecreatepage/MarkdownPage';
// import { ShareNotePage } from '../sharepages/ShareNotePage';

// const VisuallyHiddenInput = styled('input')({
//   display: 'none', 
// });

// interface LocalNoteFile {
//   id: string;
//   title: string;
//   description: string; 
//   type: string;        
//   updatedAt: number;   
//   pdfUrl?: string; 
// }

// interface CollaboratorItem {
//   _id?: string;
//   invitedEmail: string;
//   status: string;
//   role: string;
//   pageUrl?: string;
//   source?: string;
// }

// interface UserProfile {
//   firstName?: string;
//   lastName?: string;
//   email?: string;
//   photo?: string;
// }

// export const NoteCreateForm = () => {
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [noteTitle, setNoteTitle] = useState<string>('');
//   const [noteDescription, setNoteDescription] = useState<string>('');
//   const [activePage, setActivePage] = useState<string>('/note-create-form/plain-text');
//   const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

//   const [titleSortOrder, setTitleSortOrder] = useState<'asc' | 'desc' | null>(null);
//   const [updateSortOrder, setUpdateSortOrder] = useState<'asc' | 'desc' | null>(null);

//   const [savedFiles, setSavedFiles] = useState<LocalNoteFile[]>(() => {
//     const localData = localStorage.getItem('local_saved_notes');
//     return localData ? JSON.parse(localData) : [];
//   });

//   const [singleDeleteAnchorEl, setSingleDeleteAnchorEl] = useState<HTMLButtonElement | null>(null);
//   const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
//   const openSingleDeletePopover = Boolean(singleDeleteAnchorEl);

//   const [deleteAnchorEl, setDeleteAnchorEl] = useState<HTMLDivElement | null>(null);
//   const openDeletePopover = Boolean(deleteAnchorEl);
//   const openMenu = Boolean(anchorEl);

//   // Selected PDF State tracker
//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);

//   // Search States
//   const [searchOpen, setSearchOpen] = useState<boolean>(false);
//   const [searchText, setSearchText] = useState<string>('');

//   // --- Share States (Note Sharing သီးသန့်ဖြစ်အောင် ပြင်ဆင်ထားပါသည်) ---
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [collaborators, setCollaborators] = useState<CollaboratorItem[]>([]);
//   const [shareAnchorEl, setShareAnchorEl] = useState<HTMLButtonElement | null>(null);
//   const [permissionMenuAnchorEl, setPermissionMenuAnchorEl] = useState<HTMLElement | null>(null);
//   const [activeCollaboratorId, setActiveCollaboratorId] = useState<string | null>(null);
//   const [activeRole, setActiveRole] = useState<string>("viewer");

//   const isShareOpen = Boolean(shareAnchorEl);

//   useEffect(() => {
//     localStorage.setItem('local_saved_notes', JSON.stringify(savedFiles));
//   }, [savedFiles]);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUser(parsedUser);
//       } catch (e) {
//         console.error("Failed to parse user from localStorage", e);
//       }
//     }

//     const loadCollaborators = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return;
//       try {
//         // 💡 Note Sharing နဲ့ သက်ဆိုင်တဲ့ API Endpoint သို့ လှမ်းခေါ်ရန် လိုအပ်ပါက ပြောင်းလဲနိုင်ပါသည်
//         const response = await fetch("http://localhost:5000/api/share/collaborators", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (response.ok) {
//           const data = await response.json();
//           setCollaborators(data.collaborators || []);
//         }
//       } catch (err) {
//         console.error("Failed to load collaborators", err);
//       }
//     };

//     loadCollaborators();
//   }, []);

//   const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleMenuClick = (pageType: string) => {
//     setActivePage(pageType);
//     setNoteTitle('');
//     setNoteDescription('');
//     setPdfUrl(null); 
//     handleMenuClose();
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       const file = files[0];
//       setNoteTitle(file.name.replace(".pdf", "")); 
//       setNoteDescription(`PDF File: ${file.name}`);
      
//       const url = URL.createObjectURL(file);
//       setPdfUrl(url);
//       setActivePage('/note-create-form/pdf-view'); 
//     }
//   };

//   const getFileIcon = (type: string) => {
//     switch (type) {
//       case '/note-create-form/spread-sheet': return <TableChartOutlined sx={{ color: '#2e7d32', fontSize: 18 }} />;
//       case '/note-create-form/white-board': return <BorderColorOutlined sx={{ color: '#0288d1', fontSize: 18 }} />;
//       case '/note-create-form/book-mark': return <BookmarkBorderOutlined sx={{ color: '#ed6c02', fontSize: 18 }} />;
//       case '/note-create-form/task-list': return <FormatListBulletedOutlined sx={{ color: '#7b1fa2', fontSize: 18 }} />;
//       case '/note-create-form/rich-text': return <ArticleOutlined sx={{ color: '#973aa8', fontSize: 18 }} />;
//       case '/note-create-form/mark-down': return <DescriptionOutlined sx={{ color: '#009688', fontSize: 18 }} />;
//       case '/note-create-form/pdf-view': return <PictureAsPdfOutlined sx={{ color: '#d32f2f', fontSize: 18 }} />;
//       default: return <DescriptionOutlined sx={{ color: '#555', fontSize: 18 }} />;
//     }
//   };

//   const handleDeleteClick = (event: React.MouseEvent<HTMLDivElement>) => {
//     setDeleteAnchorEl(event.currentTarget);
//   };

//   const handleDeleteClose = () => {
//     setDeleteAnchorEl(null);
//   };

//   const handleDeleteConfirm = () => {
//     setSavedFiles([]); 
//     setDeleteAnchorEl(null);
//   };

//   const handleSingleDelete = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
//     e.stopPropagation();
//     setSingleDeleteAnchorEl(e.currentTarget);
//     setSelectedDeleteId(id);
//   };

//   const handleSingleDeleteClose = (e?: React.MouseEvent) => {
//     if (e) e.stopPropagation();
//     setSingleDeleteAnchorEl(null);
//     setSelectedDeleteId(null);
//   };

//   const handleSingleDeleteConfirm = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (selectedDeleteId) {
//       setSavedFiles(prev => prev.filter(file => file.id !== selectedDeleteId));
//     }
//     handleSingleDeleteClose();
//   };

//   const handleSortByTitle = () => {
//     const nextOrder = titleSortOrder === 'asc' ? 'desc' : 'asc';
//     setTitleSortOrder(nextOrder);
//     setUpdateSortOrder(null);

//     const sorted = [...savedFiles].sort((a, b) => {
//       return nextOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
//     });
//     setSavedFiles(sorted);
//   };

//   const handleSortByUpdated = () => {
//     const nextOrder = updateSortOrder === 'asc' ? 'desc' : 'asc';
//     setUpdateSortOrder(nextOrder);
//     setTitleSortOrder(null);

//     const sorted = [...savedFiles].sort((a, b) => {
//       return nextOrder === 'asc' ? a.updatedAt - b.updatedAt : b.updatedAt - a.updatedAt;
//     });
//     setSavedFiles(sorted);
//   };

//   const handleOpenFile = (file: LocalNoteFile) => {
//     setActivePage(file.type);
//     setNoteTitle(file.title);
//     setNoteDescription(file.description);
//     if (file.pdfUrl) {
//       setPdfUrl(file.pdfUrl);
//     } else {
//       setPdfUrl(null);
//     }
//   };

//   const handleSaveNote = () => {
//     if (!noteTitle.trim()) {
//       alert("Please enter a note title!");
//       return;
//     }

//     const existingFileIndex = savedFiles.findIndex(f => f.title === noteTitle && f.type === activePage);

//     if (existingFileIndex >= 0) {
//       const updatedFiles = [...savedFiles];
//       updatedFiles[existingFileIndex] = {
//         ...updatedFiles[existingFileIndex],
//         description: noteDescription,
//         pdfUrl: pdfUrl || undefined,
//         updatedAt: Date.now()
//       };
//       setSavedFiles(updatedFiles);
//       alert("Note updated successfully!");
//     } else {
//       const newFile: LocalNoteFile = {
//         id: Date.now().toString(),
//         title: noteTitle,
//         description: noteDescription,
//         type: activePage, 
//         pdfUrl: pdfUrl || undefined,
//         updatedAt: Date.now()
//       };
//       setSavedFiles(prev => [newFile, ...prev]);
//       alert("Note saved successfully!");
//     }
//   };

//   // --- Share Popover/Menu Handlers ---
//   const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setShareAnchorEl(event.currentTarget);
//   };

//   const handleShareClose = () => {
//     setShareAnchorEl(null);
//   };

//   const handleOpenPermissionMenu = (event: React.MouseEvent<HTMLButtonElement>, id: string | null, currentRole: string) => {
//     setPermissionMenuAnchorEl(event.currentTarget);
//     setActiveCollaboratorId(id);
//     setActiveRole(currentRole || "viewer");
//   };

//   const handleClosePermissionMenu = () => {
//     setPermissionMenuAnchorEl(null);
//     setActiveCollaboratorId(null);
//   };

//   const handlePermissionChange = async (role: string) => {
//     if (!activeCollaboratorId) {
//       handleClosePermissionMenu();
//       return;
//     }
//     try {
//       const response = await fetch(`http://localhost:5000/api/share/${activeCollaboratorId}/role`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
//         },
//         body: JSON.stringify({ role }),
//       });
//       if (response.ok) {
//         setCollaborators((prev) => prev.map((person) => person._id === activeCollaboratorId ? { ...person, role } : person));
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       handleClosePermissionMenu();
//     }
//   };

//   const handleRemoveCollaborator = async () => {
//     if (!activeCollaboratorId) return;
//     try {
//       const response = await fetch(`http://localhost:5000/api/share/${activeCollaboratorId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
//       });
//       if (response.ok) {
//         setCollaborators((prev) => prev.filter((person) => person._id !== activeCollaboratorId));
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       handleClosePermissionMenu();
//     }
//   };

//   // 💡 Note Sharing အတွက် Role အခေါ်အဝေါ် ပြောင်းလဲပြင်ဆင်ထားပါသည်
//   const getRoleLabel = (role: string) => {
//     if (role === "editor") return "Can edit";
//     return "Can view";
//   };

//   const renderFolderFiles = () => (
//     <Stack spacing={1} sx={{ pl: 4, mt: 1, mb: 1, maxHeight: '200px', overflowY: 'auto' }}>
//       {savedFiles.map((file) => (
//         <Box key={file.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.2 }}>
//           {getFileIcon(file.type)}
//           <Typography 
//             noWrap 
//             onClick={() => handleOpenFile(file)} 
//             sx={{ fontSize: '13px', color: 'text.primary', cursor: 'pointer', maxWidth: '150px' }}
//           >
//             {file.title}
//           </Typography>
//         </Box>
//       ))}
//     </Stack>
//   );

//   const renderActivePage = () => {
//     switch (activePage) {
//       case '/note-create-form/plain-text': return <PlainTextNotePage description={noteDescription} setText={setNoteDescription} />;
//       case '/note-create-form/rich-text': return <RichTextNotePage description={noteDescription} setText={setNoteDescription} />;
//       case '/note-create-form/mark-down': return <MarkdownPage description={noteDescription} setText={setNoteDescription}/>;
//       case '/note-create-form/task-list': return <TaskListPage description={noteDescription} setText={setNoteDescription} />;
//       case '/note-create-form/book-mark': return <BookMarkPage description={noteDescription} setText={setNoteDescription}/>; 
//       case '/note-create-form/white-board': return <WhiteboardPage description={noteDescription} setText={setNoteDescription}/>;
//       case '/note-create-form/spread-sheet': return <SpreadsheetPage description={noteDescription} setText={setNoteDescription} />;
//       case '/note-create-form/group-chat': return <GroupChatPage description={noteDescription} setText={setNoteDescription} />;
      
//       case '/note-create-form/pdf-view': 
//         return pdfUrl ? (
//           <Box sx={{ width: '100%', height: '65vh', border: '1px solid #ccc', borderRadius: 1, overflow: 'hidden' }}>
//             <embed src={pdfUrl} type="application/pdf" width="100%" height="100%" />
//           </Box>
//         ) : (
//           <Typography color="error">No PDF file loaded.</Typography>
//         );
//       default: return <PlainTextNotePage description={noteDescription} setText={setNoteDescription} />;
//     }
//   };

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', width: "100%", p: 2, bgcolor:"background.default", color:"text.primary" }}>
//       <Box>
//         <Stack sx={{ mb: 2 }}>
//           <TextField 
//             variant='outlined' 
//             label="Note Title" 
//             value={noteTitle} 
//             onChange={(e) => setNoteTitle(e.target.value)}
//           />
//         </Stack>
        
//         <Stack spacing={2} direction="row" sx={{ mb: 2, alignItems: 'center' }}>
//           <Button 
//             id="new-note-button"
//             startIcon={<NoteAddOutlined/>} 
//             onClick={handleMenuOpen} 
//             sx={{ textTransform: "none", color: "text.primary", fontSize: "14px", "& .MuiButton-startIcon": { color: "#973aa8" } }}
//           >
//             New Note
//           </Button>

//           <Menu
//             id="new-note-menu"
//             anchorEl={anchorEl}
//             open={openMenu}
//             onClose={handleMenuClose}
//             slotProps={{
//               list: { 'aria-labelledby': 'new-note-button' },
//               paper: {
//                 sx: {
//                   boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
//                   border: '1px solid #e0e0e0',
//                   borderRadius: '8px',
//                   minWidth: '180px',
//                   mt: 0.5,
//                   "& .MuiMenuItem-root": {
//                     fontSize: '14px',
//                     color: '#973aa8',
//                     fontWeight: '500',
//                     py: 1,
//                     gap: 1.5,
//                     "& :hover": { bgcolor: "#f5f9ff" }
//                   },
//                 }
//               }
//             }}
//           >
//             <MenuItem onClick={() => handleMenuClick('/note-create-form/plain-text')}>
//               <DescriptionOutlined fontSize="small"/> Plain Text Note
//             </MenuItem>
//             <MenuItem onClick={() => handleMenuClick('/note-create-form/rich-text')}>
//               <ArticleOutlined fontSize="small"/> Rich Text Note
//             </MenuItem>
//             <MenuItem onClick={() => handleMenuClick('/note-create-form/mark-down')}>
//               <DescriptionOutlined fontSize="small"/> Markdown
//             </MenuItem>
//             <MenuItem onClick={() => handleMenuClick('/note-create-form/task-list')}>
//               <FormatListBulletedOutlined fontSize="small"/> Task List
//             </MenuItem>
//             <MenuItem onClick={() => handleMenuClick('/note-create-form/book-mark')}>
//               <BookmarkBorderOutlined fontSize="small"/> Bookmark
//             </MenuItem>
//             <MenuItem onClick={() => handleMenuClick('/note-create-form/white-board')}>
//               <BorderColorOutlined fontSize="small"/> Whiteboard
//             </MenuItem>
//             <MenuItem onClick={() => handleMenuClick('/note-create-form/spread-sheet')}>
//               <TableChartOutlined fontSize="small"/> Spreadsheet
//             </MenuItem>
//           </Menu>

//           <label htmlFor="pdf-upload">
//             <Button
//               component="span"
//               size="small"
//               startIcon={<FileUploadOutlined />}
//               sx={{ textTransform: "none", color: "text.primary", "& .MuiButton-startIcon": { color: "#973aa8" } }}
//             >
//               Import Pdf
//             </Button>
//           </label>
          
//           <IconButton size="small" sx={{ color: 'text.primary', mr: searchOpen ? 1 : 0, borderRadius: '4px'}} onClick={() => setSearchOpen((prev) => !prev)}>
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
//                   bgcolor: 'background.default',
//                   borderRadius: '4px',
//                 },
//                 '& .MuiOutlinedInput-input': {
//                   py: 0.5,
//                   px: 1,
//                 },
//               }}
//             />
//           )}
        
//           {/* Share Button */}
//           <Button
//             startIcon={<ShareOutlined />}
//             onClick={handleShareClick}
//             sx={{
//               color: 'text.primary',
//               bgcolor: isShareOpen ? 'action.selected' : 'background.default',
//               borderRadius: '4px',
//               textTransform: 'none',
//               transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//               '&:hover': {
//                 bgcolor: 'action.hover'
//               }
//             }}
//           >
//             Share
//           </Button>
//         </Stack>
        
//         {/* 💡 ShareNotePage သို့ ချိတ်ဆက်ပြင်ဆင်ထားသော Popover */}
//         <Popover
//           open={isShareOpen}
//           anchorEl={shareAnchorEl}
//           onClose={handleShareClose}
//           anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//           transformOrigin={{ vertical: "top", horizontal: "left" }}
//           slotProps={{
//             paper: {
//               sx: {
//                 width: 420,
//                 p: 2.5,
//                 mt: 1,
//                 borderRadius: 3,
//                 boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
//                 bgcolor: 'background.paper',
//                 color: 'text.primary'
//               }
//             }
//           }}
//         >
//           <ShareNotePage
//             user={user}
//             collaborators={collaborators}
//             setCollaborators={setCollaborators}
//             handleOpenPermissionMenu={handleOpenPermissionMenu}
//             getRoleLabel={getRoleLabel}
//           />
//         </Popover>

     
//         <Menu
//           anchorEl={permissionMenuAnchorEl}
//           open={Boolean(permissionMenuAnchorEl)}
//           onClose={handleClosePermissionMenu}
//           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//           transformOrigin={{ vertical: "top", horizontal: "right" }}
//           slotProps={{ paper: { sx: { width: 280, borderRadius: 3, p: 0.5, boxShadow: "0px 4px 16px rgba(0,0,0,0.12)" } } }}
//         >
//           <MenuItem onClick={() => handlePermissionChange("editor")} sx={{ py: 1 }}>
//             <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can edit</Typography>} />
//             {activeRole === "editor" && <Check sx={{ fontSize: 16, ml: 1 }} />}
//           </MenuItem>

//           <MenuItem onClick={() => handlePermissionChange("viewer")} sx={{ py: 1 }}>
//             <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can view</Typography>} />
//             {activeRole === "viewer" && <Check sx={{ fontSize: 16, ml: 1 }} />}
//           </MenuItem>

//           {activeCollaboratorId && (
//             <>
//               <Box sx={{ my: 0.5, borderTop: "1px solid #f0f0f0" }} />
//               <MenuItem onClick={handleRemoveCollaborator} sx={{ py: 1, color: "error.main" }}>
//                 <ListItemIcon sx={{ color: "error.main", minWidth: 30 }}><DeleteOutlined sx={{ fontSize: 18 }} /></ListItemIcon>
//                 <Typography variant="body2" sx={{ fontWeight: 500 }}>Remove</Typography>
//               </MenuItem>
//             </>
//           )}
//         </Menu>

//         <VisuallyHiddenInput
//           type="file"
//           id="pdf-upload"
//           accept="application/pdf"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//         />

//         <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 3, width: '100%' }}>
//           {renderActivePage()}
//         </Box>

//         <Button
//           type='button'
//           variant="contained"
//           onClick={handleSaveNote}
//           sx={{ textTransform: "none", bgcolor: "#973aa8", borderRadius: 3, px: 3, mt: 2, mb: 4, "&:hover": { bgcolor: "#7b2c8a" } }}
//         >
//           Save Note
//         </Button>

//         <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 3 ,color:'text.primary'}}>
//           <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
//             <Button onClick={handleSortByTitle} startIcon={<SwapVertOutlined sx={{ fontSize: 16 }} />} sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 'bold', fontSize: '12px' }}>
//               Sort by Title {titleSortOrder ? `(${titleSortOrder.toUpperCase()})` : ''}
//             </Button>
//             <Button onClick={handleSortByUpdated} startIcon={<SwapVertOutlined sx={{ fontSize: 16 }} />} sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 'bold', fontSize: '12px' }}>
//               Sort by Updated {updateSortOrder ? `(${updateSortOrder.toUpperCase()})` : ''}
//             </Button>
//           </Stack>

//           <Grid container spacing={4}>
//             <Grid size={{xs:12,md:3.5}}>
//               <Stack spacing={1.5}>
//                 <Box>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//                     <FolderOpenOutlined sx={{ color: '#d4a373' }} />
//                     <Typography sx={{ color: 'text.primary', fontWeight: 500, fontSize: '14px' }}>All Notes</Typography>
//                   </Box>
//                   {savedFiles.length > 0 && renderFolderFiles()}
//                 </Box>
                
//                 <Box 
//                   onClick={handleDeleteClick} 
//                   sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', maxWidth: '200px' }}
//                 >
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//                     <DeleteOutlineOutlined sx={{ color: '#ff3d00' }} />
//                     <Typography sx={{ color: 'text.primary', fontWeight: 500, fontSize: '14px' }}>Recycle Bin</Typography>
//                   </Box>
//                   <IconButton size="small"><MoreVertOutlined sx={{ fontSize: 16, color: '#ff3d00' }} /></IconButton>
//                 </Box>

//                 <Popover
//                   open={openDeletePopover}
//                   anchorEl={deleteAnchorEl}
//                   onClose={handleDeleteClose}
//                   anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
//                   transformOrigin={{ vertical: 'center', horizontal: 'left' }}
//                   slotProps={{
//                     paper: { sx: { p: 2, boxShadow: '0px 4px 16px rgba(0,0,0,0.12)', border: '1px solid #e0e0e0', borderRadius: '8px', ml: 1 } }
//                   }}
//                 >
//                   <Typography sx={{ fontSize: '13px', fontWeight: 500, mb: 1.5, color: 'text.primary' }}>
//                     Delete all saved files?
//                   </Typography>
//                   <Stack direction="row" spacing={1} sx={{justifyContent:'flex-end'}}>
//                     <Button size="small" onClick={handleDeleteClose} sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '12px' }}>
//                       Cancel
//                     </Button>
//                     <Button size="small" variant="contained" onClick={handleDeleteConfirm} sx={{ textTransform: 'none', bgcolor: '#ff3d00', fontSize: '12px', '&:hover': { bgcolor: '#e03500' } }}>
//                       Confirm
//                     </Button>
//                   </Stack>
//                 </Popover>
//               </Stack>
//             </Grid>

//             <Grid size={{xs:12,md:8.5}}>
//               <Grid container spacing={2}>
//                 {savedFiles.map((file) => (
//                   <Grid size={{xs:12,sm:6,md:4}} key={file.id}>
//                     <Box 
//                       onClick={() => handleOpenFile(file)}
//                       sx={{ 
//                         display: 'flex', 
//                         alignItems: 'center', 
//                         justifyContent: 'space-between', 
//                         p: 1, 
//                         borderRadius: '4px', 
//                         cursor: 'pointer', 
//                         border: activePage === file.type && noteTitle === file.title ? '1px solid #973aa8' : '1px solid #eee',
//                         '&:hover': { bgcolor: '#f5f5f5' } 
//                       }}
//                     >
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
//                         {getFileIcon(file.type)}
//                         <Typography noWrap sx={{ fontSize: '14px', color: 'text.primary', fontWeight: 500 }}>
//                           {file.title}
//                         </Typography>
//                       </Box>
                  
//                       <IconButton size="small" onClick={(e) => handleSingleDelete(file.id, e)}>
//                         <DeleteOutlineOutlined sx={{ fontSize: 16, color: '#ff3d00' }} />
//                       </IconButton>
                
//                       <Popover
//                         open={openSingleDeletePopover}
//                         anchorEl={singleDeleteAnchorEl}
//                         onClose={() => handleSingleDeleteClose()}
//                         anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
//                         transformOrigin={{ vertical: 'center', horizontal: 'left' }}
//                         onClick={(e) => e.stopPropagation()}
//                         slotProps={{
//                           paper: { sx: { p: 2, boxShadow: '0px 4px 16px rgba(0,0,0,0.12)', border: '1px solid #e0e0e0', borderRadius: '8px', ml: 1 } }
//                         }}
//                       >
//                         <Typography sx={{ fontSize: '13px', fontWeight: 500, mb: 1.5, color: 'text.primary' }}>
//                           Delete saved files?
//                         </Typography>
//                         <Stack direction="row" spacing={1} sx={{justifyContent:'flex-end'}}>
//                           <Button size="small" onClick={() => handleSingleDeleteClose()} sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '12px' }}>
//                             Cancel
//                           </Button>
//                           <Button size="small" variant="contained" onClick={handleSingleDeleteConfirm} sx={{ textTransform: 'none', bgcolor: '#ff3d00', fontSize: '12px', '&:hover': { bgcolor: '#e03500' } }}>
//                             Confirm
//                           </Button>
//                         </Stack>
//                       </Popover>
//                     </Box>
//                   </Grid>
//                 ))}
//               </Grid>
//             </Grid>
//           </Grid>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// import { Box, Button, Stack, TextField, styled, Menu, MenuItem, ListItemText, ListItemIcon, Typography, Grid, IconButton, Popover } from '@mui/material';
// import React, { useRef, useState, useEffect } from 'react';
// import { 
//   NoteAddOutlined, FileUploadOutlined, ShareOutlined, DescriptionOutlined, 
//   ArticleOutlined, FormatListBulletedOutlined, BookmarkBorderOutlined, 
//   BorderColorOutlined, TableChartOutlined, DeleteOutlined, Check,
//   FolderOpenOutlined, DeleteOutlineOutlined, MoreVertOutlined,
//   SwapVertOutlined, PictureAsPdfOutlined, Search
// } from '@mui/icons-material';
// import { PlainTextNotePage } from '../notecreatepage/PlainTextNotePage';
// import { RichTextNotePage } from '../notecreatepage/RichTextNotePage';
// import { TaskListPage } from '../notecreatepage/TaskListPage';
// import { WhiteboardPage } from '../notecreatepage/WhiteboardPage';
// import { BookMarkPage } from '../notecreatepage/BookMarkPage';
// import { SpreadsheetPage } from '../notecreatepage/SpreadsheetPage';
// import { GroupChatPage } from '../notecreatepage/GroupChatPage';
// import { MarkdownPage } from '../notecreatepage/MarkdownPage';
// import { ShareNotePage } from '../sharepages/ShareNotePage';

// const VisuallyHiddenInput = styled('input')({
//   display: 'none', 
// });

// interface LocalNoteFile {
//   id: string;
//   title: string;
//   description: string; 
//   type: string;        
//   updatedAt: number;   
//   pdfUrl?: string; 
// }

// interface CollaboratorItem {
//   _id?: string;
//   invitedEmail: string;
//   status: string;
//   role: string;
//   pageUrl?: string;
//   source?: string;
// }

// interface UserProfile {
//   firstName?: string;
//   lastName?: string;
//   email?: string;
//   photo?: string;
// }

// export const NoteCreateForm = () => {
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [noteTitle, setNoteTitle] = useState<string>('');
//   const [noteDescription, setNoteDescription] = useState<string>('');
//   const [activePage, setActivePage] = useState<string>('/note-create-form/plain-text');
//   const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

//   const [titleSortOrder, setTitleSortOrder] = useState<'asc' | 'desc' | null>(null);
//   const [updateSortOrder, setUpdateSortOrder] = useState<'asc' | 'desc' | null>(null);

//   const [savedFiles, setSavedFiles] = useState<LocalNoteFile[]>(() => {
//     const localData = localStorage.getItem('local_saved_notes');
//     return localData ? JSON.parse(localData) : [];
//   });

//   // Track anchor element and file ID globally for individual deletions
//   const [singleDeleteAnchorEl, setSingleDeleteAnchorEl] = useState<HTMLButtonElement | null>(null);
//   const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
//   const openSingleDeletePopover = Boolean(singleDeleteAnchorEl);

//   const [deleteAnchorEl, setDeleteAnchorEl] = useState<HTMLDivElement | null>(null);
//   const openDeletePopover = Boolean(deleteAnchorEl);
//   const openMenu = Boolean(anchorEl);

//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);
//   const [searchOpen, setSearchOpen] = useState<boolean>(false);
//   const [searchText, setSearchText] = useState<string>('');

//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [collaborators, setCollaborators] = useState<CollaboratorItem[]>([]);
//   const [shareAnchorEl, setShareAnchorEl] = useState<HTMLButtonElement | null>(null);
//   const [permissionMenuAnchorEl, setPermissionMenuAnchorEl] = useState<HTMLElement | null>(null);
//   const [activeCollaboratorId, setActiveCollaboratorId] = useState<string | null>(null);
//   const [activeRole, setActiveRole] = useState<string>("viewer");

//   const isShareOpen = Boolean(shareAnchorEl);

//   useEffect(() => {
//     localStorage.setItem('local_saved_notes', JSON.stringify(savedFiles));
//   }, [savedFiles]);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUser(parsedUser);
//       } catch (e) {
//         console.error("Failed to parse user from localStorage", e);
//       }
//     }

//     const loadCollaborators = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return;
//       try {
//         const response = await fetch("http://localhost:5000/api/share/collaborators", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (response.ok) {
//           const data = await response.json();
//           setCollaborators(data.collaborators || []);
//         }
//       } catch (err) {
//         console.error("Failed to load collaborators", err);
//       }
//     };

//     loadCollaborators();
//   }, []);

//   const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleMenuClick = (pageType: string) => {
//     setActivePage(pageType);
//     setNoteTitle('');
//     setNoteDescription('');
//     setPdfUrl(null); 
//     handleMenuClose();
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       const file = files[0];
//       setNoteTitle(file.name.replace(".pdf", "")); 
//       setNoteDescription(`PDF File: ${file.name}`);
      
//       const url = URL.createObjectURL(file);
//       setPdfUrl(url);
//       setActivePage('/note-create-form/pdf-view'); 
//     }
//   };

//   const getFileIcon = (type: string) => {
//     switch (type) {
//       case '/note-create-form/spread-sheet': return <TableChartOutlined sx={{ color: '#2e7d32', fontSize: 18 }} />;
//       case '/note-create-form/white-board': return <BorderColorOutlined sx={{ color: '#0288d1', fontSize: 18 }} />;
//       case '/note-create-form/book-mark': return <BookmarkBorderOutlined sx={{ color: '#ed6c02', fontSize: 18 }} />;
//       case '/note-create-form/task-list': return <FormatListBulletedOutlined sx={{ color: '#7b1fa2', fontSize: 18 }} />;
//       case '/note-create-form/rich-text': return <ArticleOutlined sx={{ color: '#973aa8', fontSize: 18 }} />;
//       case '/note-create-form/mark-down': return <DescriptionOutlined sx={{ color: '#009688', fontSize: 18 }} />;
//       case '/note-create-form/pdf-view': return <PictureAsPdfOutlined sx={{ color: '#d32f2f', fontSize: 18 }} />;
//       default: return <DescriptionOutlined sx={{ color: '#555', fontSize: 18 }} />;
//     }
//   };

//   const handleDeleteClick = (event: React.MouseEvent<HTMLDivElement>) => {
//     setDeleteAnchorEl(event.currentTarget);
//   };

//   const handleDeleteClose = () => {
//     setDeleteAnchorEl(null);
//   };

//   const handleDeleteConfirm = () => {
//     setSavedFiles([]); 
//     setDeleteAnchorEl(null);
//   };

//   const handleSingleDelete = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
//     e.stopPropagation();
//     setSingleDeleteAnchorEl(e.currentTarget);
//     setSelectedDeleteId(id);
//   };

//   const handleSingleDeleteClose = (e?: React.MouseEvent) => {
//     if (e) e.stopPropagation();
//     setSingleDeleteAnchorEl(null);
//     setSelectedDeleteId(null);
//   };

//   const handleSingleDeleteConfirm = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (selectedDeleteId) {
//       setSavedFiles(prev => prev.filter(file => file.id !== selectedDeleteId));
//     }
//     handleSingleDeleteClose();
//   };

//   const handleSortByTitle = () => {
//     const nextOrder = titleSortOrder === 'asc' ? 'desc' : 'asc';
//     setTitleSortOrder(nextOrder);
//     setUpdateSortOrder(null);

//     const sorted = [...savedFiles].sort((a, b) => {
//       return nextOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
//     });
//     setSavedFiles(sorted);
//   };

//   const handleSortByUpdated = () => {
//     const nextOrder = updateSortOrder === 'asc' ? 'desc' : 'asc';
//     setUpdateSortOrder(nextOrder);
//     setTitleSortOrder(null);

//     const sorted = [...savedFiles].sort((a, b) => {
//       return nextOrder === 'asc' ? a.updatedAt - b.updatedAt : b.updatedAt - a.updatedAt;
//     });
//     setSavedFiles(sorted);
//   };

//   const handleOpenFile = (file: LocalNoteFile) => {
//     setActivePage(file.type);
//     setNoteTitle(file.title);
//     setNoteDescription(file.description);
//     if (file.pdfUrl) {
//       setPdfUrl(file.pdfUrl);
//     } else {
//       setPdfUrl(null);
//     }
//   };

//   const handleSaveNote = () => {
//     if (!noteTitle.trim()) {
//       alert("Please enter a note title!");
//       return;
//     }

//     const existingFileIndex = savedFiles.findIndex(f => f.title === noteTitle && f.type === activePage);

//     if (existingFileIndex >= 0) {
//       const updatedFiles = [...savedFiles];
//       updatedFiles[existingFileIndex] = {
//         ...updatedFiles[existingFileIndex],
//         description: noteDescription,
//         pdfUrl: pdfUrl || undefined,
//         updatedAt: Date.now()
//       };
//       setSavedFiles(updatedFiles);
//       alert("Note updated successfully!");
//     } else {
//       const newFile: LocalNoteFile = {
//         id: Date.now().toString(),
//         title: noteTitle,
//         description: noteDescription,
//         type: activePage, 
//         pdfUrl: pdfUrl || undefined,
//         updatedAt: Date.now()
//       };
//       setSavedFiles(prev => [newFile, ...prev]);
//       alert("Note saved successfully!");
//     }
//   };

//   const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setShareAnchorEl(event.currentTarget);
//   };
  

//   const handleShareClose = () => {
//     setShareAnchorEl(null);
//   };

//   const handleOpenPermissionMenu = (event: React.MouseEvent<HTMLButtonElement>, id: string | null, currentRole: string) => {
//     setPermissionMenuAnchorEl(event.currentTarget);
//     setActiveCollaboratorId(id);
//     setActiveRole(currentRole || "viewer");
//   };

//   const handleClosePermissionMenu = () => {
//     setPermissionMenuAnchorEl(null);
//     setActiveCollaboratorId(null);
//   };

//   const handlePermissionChange = async (role: string) => {
//     if (!activeCollaboratorId) {
//       handleClosePermissionMenu();
//       return;
//     }
//     try {
//       const response = await fetch(`http://localhost:5000/api/share/${activeCollaboratorId}/role`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
//         },
//         body: JSON.stringify({ role }),
//       });
//       if (response.ok) {
//         setCollaborators((prev) => prev.map((person) => person._id === activeCollaboratorId ? { ...person, role } : person));
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       handleClosePermissionMenu();
//     }
//   };

//   const handleRemoveCollaborator = async () => {
//     if (!activeCollaboratorId) return;
//     try {
//       const response = await fetch(`http://localhost:5000/api/share/${activeCollaboratorId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
//       });
//       if (response.ok) {
//         setCollaborators((prev) => prev.filter((person) => person._id !== activeCollaboratorId));
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       handleClosePermissionMenu();
//     }
//   };

//   const getRoleLabel = (role: string) => {
//     if (role === "editor") return "Can edit";
//     return "Can view";
//   };

//   const renderFolderFiles = () => (
//     <Stack spacing={1} sx={{ pl: 4, mt: 1, mb: 1, maxHeight: '200px', overflowY: 'auto' }}>
//       {savedFiles.map((file) => (
//         <Box key={file.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.2 }}>
//           {getFileIcon(file.type)}
//           <Typography 
//             noWrap 
//             onClick={() => handleOpenFile(file)} 
//             sx={{ fontSize: '13px', color: 'text.primary', cursor: 'pointer', maxWidth: '150px' }}
//           >
//             {file.title}
//           </Typography>
//         </Box>
//       ))}
//     </Stack>
//   );

//   const renderActivePage = () => {
//     switch (activePage) {
//       case '/note-create-form/plain-text': return <PlainTextNotePage description={noteDescription} setText={setNoteDescription} />;
//       case '/note-create-form/rich-text': return <RichTextNotePage description={noteDescription} setText={setNoteDescription} />;
//       case '/note-create-form/mark-down': return <MarkdownPage description={noteDescription} setText={setNoteDescription}/>;
//       case '/note-create-form/task-list': return <TaskListPage description={noteDescription} setText={setNoteDescription} />;
//       case '/note-create-form/book-mark': return <BookMarkPage description={noteDescription} setText={setNoteDescription}/>; 
//       case '/note-create-form/white-board': return <WhiteboardPage description={noteDescription} setText={setNoteDescription}/>;
//       case '/note-create-form/spread-sheet': return <SpreadsheetPage description={noteDescription} setText={setNoteDescription} />;
//       case '/note-create-form/group-chat': return <GroupChatPage description={noteDescription} setText={setNoteDescription} />;
      
//       case '/note-create-form/pdf-view': 
//         return pdfUrl ? (
//           <Box sx={{ width: '100%', height: '65vh', border: '1px solid #ccc', borderRadius: 1, overflow: 'hidden' }}>
//             <embed src={pdfUrl} type="application/pdf" width="100%" height="100%" />
//           </Box>
//         ) : (
//           <Typography color="error">No PDF file loaded.</Typography>
//         );
//       default: return <PlainTextNotePage description={noteDescription} setText={setNoteDescription} />;
//     }
//   };

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', width: "100%", p: 2, bgcolor:"background.default", color:"text.primary" }}>
//       <Box>
//         <Stack sx={{ mb: 2 }}>
//           <TextField 
//             variant='outlined' 
//             label="Note Title" 
//             value={noteTitle} 
//             onChange={(e) => setNoteTitle(e.target.value)}
//           />
//         </Stack>
        
//         <Stack spacing={2} direction="row" sx={{ mb: 2, alignItems: 'center' }}>
//           <Button 
//             id="new-note-button"
//             startIcon={<NoteAddOutlined/>} 
//             onClick={handleMenuOpen} 
//             sx={{ textTransform: "none", color: "text.primary", fontSize: "14px", "& .MuiButton-startIcon": { color: "#973aa8" } }}
//           >
//             New Note
//           </Button>

//           <Menu
//             id="new-note-menu"
//             anchorEl={anchorEl}
//             open={openMenu}
//             onClose={handleMenuClose}
//             slotProps={{
//               list: { 'aria-labelledby': 'new-note-button' },
//               paper: {
//                 sx: {
//                   boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
//                   border: '1px solid #e0e0e0',
//                   borderRadius: '8px',
//                   minWidth: '180px',
//                   mt: 0.5,
//                   "& .MuiMenuItem-root": {
//                     fontSize: '14px',
//                     color: '#973aa8',
//                     fontWeight: '500',
//                     py: 1,
//                     gap: 1.5,
//                     "& :hover": { bgcolor: "#f5f9ff" }
//                   },
//                 }
//               }
//             }}
//           >
//             <MenuItem onClick={() => handleMenuClick('/note-create-form/plain-text')}>
//               <DescriptionOutlined fontSize="small"/> Plain Text Note
//             </MenuItem>
//             <MenuItem onClick={() => handleMenuClick('/note-create-form/rich-text')}>
//               <ArticleOutlined fontSize="small"/> Rich Text Note
//             </MenuItem>
//             <MenuItem onClick={() => handleMenuClick('/note-create-form/mark-down')}>
//               <DescriptionOutlined fontSize="small"/> Markdown
//             </MenuItem>
//             <MenuItem onClick={() => handleMenuClick('/note-create-form/task-list')}>
//               <FormatListBulletedOutlined fontSize="small"/> Task List
//             </MenuItem>
//             <MenuItem onClick={() => handleMenuClick('/note-create-form/book-mark')}>
//               <BookmarkBorderOutlined fontSize="small"/> Bookmark
//             </MenuItem>
//             <MenuItem onClick={() => handleMenuClick('/note-create-form/white-board')}>
//               <BorderColorOutlined fontSize="small"/> Whiteboard
//             </MenuItem>
//             <MenuItem onClick={() => handleMenuClick('/note-create-form/spread-sheet')}>
//               <TableChartOutlined fontSize="small"/> Spreadsheet
//             </MenuItem>
//           </Menu>

//           <label htmlFor="pdf-upload">
//             <Button
//               component="span"
//               size="small"
//               startIcon={<FileUploadOutlined />}
//               sx={{ textTransform: "none", color: "text.primary", "& .MuiButton-startIcon": { color: "#973aa8" } }}
//             >
//               Import Pdf
//             </Button>
//           </label>
          
//           <IconButton size="small" sx={{ color: 'text.primary', mr: searchOpen ? 1 : 0, borderRadius: '4px'}} onClick={() => setSearchOpen((prev) => !prev)}>
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
//                   bgcolor: 'background.default',
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
//             startIcon={<ShareOutlined />}
//             onClick={handleShareClick}
//             sx={{
//               color: 'text.primary',
//               bgcolor: isShareOpen ? 'action.selected' : 'background.default',
//               borderRadius: '4px',
//               textTransform: 'none',
//               transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//               '&:hover': {
//                 bgcolor: 'action.hover'
//               }
//             }}
//           >
//             Share
//           </Button>
//         </Stack>
        
//         <Popover
//           open={isShareOpen}
//           anchorEl={shareAnchorEl}
//           onClose={handleShareClose}
//           anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//           transformOrigin={{ vertical: "top", horizontal: "left" }}
//           slotProps={{
//             paper: {
//               sx: {
//                 width: 420,
//                 p: 2.5,
//                 mt: 1,
//                 borderRadius: 3,
//                 boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
//                 bgcolor: 'background.paper',
//                 color: 'text.primary'
//               }
//             }
//           }}
//         >
//           <ShareNotePage
//             user={user}
//             collaborators={collaborators}
//             setCollaborators={setCollaborators}
//             handleOpenPermissionMenu={handleOpenPermissionMenu}
//             getRoleLabel={getRoleLabel}
//           />
//         </Popover>

//         <Menu
//           anchorEl={permissionMenuAnchorEl}
//           open={Boolean(permissionMenuAnchorEl)}
//           onClose={handleClosePermissionMenu}
//           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//           transformOrigin={{ vertical: "top", horizontal: "right" }}
//           slotProps={{ paper: { sx: { width: 280, borderRadius: 3, p: 0.5, boxShadow: "0px 4px 16px rgba(0,0,0,0.12)" } } }}
//         >
//           <MenuItem onClick={() => handlePermissionChange("editor")} sx={{ py: 1 }}>
//             <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can edit</Typography>} />
//             {activeRole === "editor" && <Check sx={{ fontSize: 16, ml: 1 }} />}
//           </MenuItem>

//           <MenuItem onClick={() => handlePermissionChange("viewer")} sx={{ py: 1 }}>
//             <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can view</Typography>} />
//             {activeRole === "viewer" && <Check sx={{ fontSize: 16, ml: 1 }} />}
//           </MenuItem>

//           {activeCollaboratorId && (
//             <>
//               <Box sx={{ my: 0.5, borderTop: "1px solid #f0f0f0" }} />
//               <MenuItem onClick={handleRemoveCollaborator} sx={{ py: 1, color: "error.main" }}>
//                 <ListItemIcon sx={{ color: "error.main", minWidth: 30 }}><DeleteOutlined sx={{ fontSize: 18 }} /></ListItemIcon>
//                 <Typography variant="body2" sx={{ fontWeight: 500 }}>Remove</Typography>
//               </MenuItem>
//             </>
//           )}
//         </Menu>

//         <VisuallyHiddenInput
//           type="file"
//           id="pdf-upload"
//           accept="application/pdf"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//         />

//         <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 3, width: '100%' }}>
//           {renderActivePage()}
//         </Box>

//         <Button
//           type='button'
//           variant="contained"
//           onClick={handleSaveNote}
//           sx={{ textTransform: "none", bgcolor: "#973aa8", borderRadius: 3, px: 3, mt: 2, mb: 4, "&:hover": { bgcolor: "#7b2c8a" } }}
//         >
//           Save Note
//         </Button>

//         <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 3 ,color:'text.primary'}}>
//           <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
//             <Button onClick={handleSortByTitle} startIcon={<SwapVertOutlined sx={{ fontSize: 16 }} />} sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 'bold', fontSize: '12px' }}>
//               Sort by Title {titleSortOrder ? `(${titleSortOrder.toUpperCase()})` : ''}
//             </Button>
//             <Button onClick={handleSortByUpdated} startIcon={<SwapVertOutlined sx={{ fontSize: 16 }} />} sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 'bold', fontSize: '12px' }}>
//               Sort by Updated {updateSortOrder ? `(${updateSortOrder.toUpperCase()})` : ''}
//             </Button>
//           </Stack>

//           <Grid container spacing={4}>
//             <Grid size={{xs:12,md:3.5}}>
//               <Stack spacing={1.5}>
//                 <Box>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//                     <FolderOpenOutlined sx={{ color: '#d4a373' }} />
//                     <Typography sx={{ color: 'text.primary', fontWeight: 500, fontSize: '14px' }}>All Notes</Typography>
//                   </Box>
//                   {savedFiles.length > 0 && renderFolderFiles()}
//                 </Box>
                
//                 <Box 
//                   onClick={handleDeleteClick} 
//                   sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', maxWidth: '200px' }}
//                 >
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//                     <DeleteOutlineOutlined sx={{ color: '#ff3d00' }} />
//                     <Typography sx={{ color: 'text.primary', fontWeight: 500, fontSize: '14px' }}>Recycle Bin</Typography>
//                   </Box>
//                   <IconButton size="small"><MoreVertOutlined sx={{ fontSize: 16, color: '#ff3d00' }} /></IconButton>
//                 </Box>

//                 <Popover
//                   open={openDeletePopover}
//                   anchorEl={deleteAnchorEl}
//                   onClose={handleDeleteClose}
//                   anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
//                   transformOrigin={{ vertical: 'center', horizontal: 'left' }}
//                   slotProps={{
//                     paper: { sx: { p: 2, boxShadow: '0px 4px 16px rgba(0,0,0,0.12)', border: '1px solid #e0e0e0', borderRadius: '8px', ml: 1 } }
//                   }}
//                 >
//                   <Typography sx={{ fontSize: '13px', fontWeight: 500, mb: 1.5, color: 'text.primary' }}>
//                     Delete all saved files?
//                   </Typography>
//                   <Stack direction="row" spacing={1} sx={{justifyContent:'flex-end'}}>
//                     <Button size="small" onClick={handleDeleteClose} sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '12px' }}>
//                       Cancel
//                     </Button>
//                     <Button size="small" variant="contained" onClick={handleDeleteConfirm} sx={{ textTransform: 'none', bgcolor: '#ff3d00', fontSize: '12px', '&:hover': { bgcolor: '#e03500' } }}>
//                       Confirm
//                     </Button>
//                   </Stack>
//                 </Popover>
//               </Stack>
//             </Grid>

//             <Grid size={{xs:12,md:8.5}}>
//               <Grid container spacing={2}>
//                 {savedFiles.map((file) => (
//                   <Grid size={{xs:12,sm:6,md:4}} key={file.id}>
//                     <Box 
//                       onClick={() => handleOpenFile(file)}
//                       sx={{ 
//                         display: 'flex', 
//                         alignItems: 'center', 
//                         justifyContent: 'space-between', 
//                         p: 1, 
//                         borderRadius: '4px', 
//                         cursor: 'pointer', 
//                         border: activePage === file.type && noteTitle === file.title ? '1px solid #973aa8' : '1px solid #eee',
//                         '&:hover': { bgcolor: '#f5f5f5' } 
//                       }}
//                     >
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
//                         {getFileIcon(file.type)}
//                         <Typography noWrap sx={{ fontSize: '14px', color: 'text.primary', fontWeight: 500 }}>
//                           {file.title}
//                         </Typography>
//                       </Box>
                  
//                       <IconButton size="small" onClick={(e) => handleSingleDelete(file.id, e)}>
//                         <DeleteOutlineOutlined sx={{ fontSize: 16, color: '#ff3d00' }} />
//                       </IconButton>
//                     </Box>
//                   </Grid>
//                 ))}
//               </Grid>
//             </Grid>
//           </Grid>
//         </Box>
//       </Box>

//       {/* FIXED POPOVER PLACEHOLDER: Placed outside the loop completely */}
//       <Popover
//         open={openSingleDeletePopover}
//         anchorEl={singleDeleteAnchorEl}
//         onClose={() => handleSingleDeleteClose()}
//         anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
//         transformOrigin={{ vertical: 'center', horizontal: 'left' }}
//         onClick={(e) => e.stopPropagation()}
//         slotProps={{
//           paper: { sx: { p: 2, boxShadow: '0px 4px 16px rgba(0,0,0,0.12)', border: '1px solid #e0e0e0', borderRadius: '8px', ml: 1 } }
//         }}
//       >
//         <Typography sx={{ fontSize: '13px', fontWeight: 500, mb: 1.5, color: 'text.primary' }}>
//           Delete saved files?
//         </Typography>
//         <Stack direction="row" spacing={1} sx={{justifyContent:'flex-end'}}>
//           <Button size="small" onClick={() => handleSingleDeleteClose()} sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '12px' }}>
//             Cancel
//           </Button>
//           <Button size="small" variant="contained" onClick={handleSingleDeleteConfirm} sx={{ textTransform: 'none', bgcolor: '#ff3d00', fontSize: '12px', '&:hover': { bgcolor: '#e03500' } }}>
//             Confirm
//           </Button>
//         </Stack>
//       </Popover>
//     </Box>
//   );
// };


import { Box, Button, Stack, TextField, styled, Menu, MenuItem, ListItemText, ListItemIcon, Typography, Grid, IconButton, Popover } from '@mui/material';
import React, { useRef, useState, useEffect } from 'react';
import { 
  NoteAddOutlined, FileUploadOutlined, ShareOutlined, DescriptionOutlined, 
  ArticleOutlined, FormatListBulletedOutlined, BookmarkBorderOutlined, 
  BorderColorOutlined, TableChartOutlined, DeleteOutlined, Check,
  FolderOpenOutlined, DeleteOutlineOutlined, MoreVertOutlined,
  SwapVertOutlined, PictureAsPdfOutlined, Search
} from '@mui/icons-material';
import { PlainTextNotePage } from '../notecreatepage/PlainTextNotePage';
import { RichTextNotePage } from '../notecreatepage/RichTextNotePage';
import { TaskListPage } from '../notecreatepage/TaskListPage';
import { WhiteboardPage } from '../notecreatepage/WhiteboardPage';
import { BookMarkPage } from '../notecreatepage/BookMarkPage';
import { SpreadsheetPage } from '../notecreatepage/SpreadsheetPage';
import { GroupChatPage } from '../notecreatepage/GroupChatPage';
import { MarkdownPage } from '../notecreatepage/MarkdownPage';
import { ShareNotePage } from '../sharepages/ShareNotePage';

const VisuallyHiddenInput = styled('input')({
  display: 'none', 
});

interface LocalNoteFile {
  id: string;
  title: string;
  description: string; 
  type: string;        
  updatedAt: number;   
  pdfUrl?: string; 
}

interface CollaboratorItem {
  _id?: string;
  invitedEmail: string;
  status: string;
  role: string;
  pageUrl?: string;
  source?: string;
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  photo?: string;
}

export const NoteCreateForm = () => {

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteDescription, setNoteDescription] = useState<string>('');
  const [activePage, setActivePage] = useState<string>('/note-create-form/plain-text');
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);

  const [titleSortOrder, setTitleSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [updateSortOrder, setUpdateSortOrder] = useState<'asc' | 'desc' | null>(null);

  const [savedFiles, setSavedFiles] = useState<LocalNoteFile[]>(() => {
    const localData = localStorage.getItem('local_saved_notes');
    return localData ? JSON.parse(localData) : [];
  });

  const [singleDeleteAnchorEl, setSingleDeleteAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const openSingleDeletePopover = Boolean(singleDeleteAnchorEl);

  const [deleteAnchorEl, setDeleteAnchorEl] = useState<HTMLDivElement | null>(null);
  const openDeletePopover = Boolean(deleteAnchorEl);
  const openMenu = Boolean(anchorEl);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');

  const [user, setUser] = useState<UserProfile | null>(null);
  const [collaborators, setCollaborators] = useState<CollaboratorItem[]>([]);
  const [shareAnchorEl, setShareAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [permissionMenuAnchorEl, setPermissionMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [activeCollaboratorId, setActiveCollaboratorId] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<string>("viewer");

  const isShareOpen = Boolean(shareAnchorEl);

  useEffect(() => {
    localStorage.setItem('local_saved_notes', JSON.stringify(savedFiles));
  }, [savedFiles]);

  //for sharing
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }

    const loadCollaborators = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await fetch("http://localhost:5000/api/share/collaborators", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setCollaborators(data.collaborators || []);
        }
      } catch (err) {
        console.error("Failed to load collaborators", err);
      }
    };

    loadCollaborators();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (pageType: string) => {
    setActivePage(pageType);
    setNoteTitle('');
    setNoteDescription('');
    setPdfUrl(null); 
    setCurrentNoteId(null); 
    handleMenuClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setNoteTitle(file.name.replace(".pdf", "")); 
      setNoteDescription(`PDF File: ${file.name}`);
      
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      setActivePage('/note-create-form/pdf-view'); 
      setCurrentNoteId(null);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case '/note-create-form/spread-sheet': return <TableChartOutlined sx={{ color: '#2e7d32', fontSize: 18 }} />;
      case '/note-create-form/white-board': return <BorderColorOutlined sx={{ color: '#0288d1', fontSize: 18 }} />;
      case '/note-create-form/book-mark': return <BookmarkBorderOutlined sx={{ color: '#ed6c02', fontSize: 18 }} />;
      case '/note-create-form/task-list': return <FormatListBulletedOutlined sx={{ color: '#7b1fa2', fontSize: 18 }} />;
      case '/note-create-form/rich-text': return <ArticleOutlined sx={{ color: '#973aa8', fontSize: 18 }} />;
      case '/note-create-form/mark-down': return <DescriptionOutlined sx={{ color: '#009688', fontSize: 18 }} />;
      case '/note-create-form/pdf-view': return <PictureAsPdfOutlined sx={{ color: '#d32f2f', fontSize: 18 }} />;
      default: return <DescriptionOutlined sx={{ color: '#555', fontSize: 18 }} />;
    }
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setDeleteAnchorEl(event.currentTarget);
  };

  const handleDeleteClose = () => {
    setDeleteAnchorEl(null);
  };

  const handleDeleteConfirm = () => {
    setSavedFiles([]); 
    setCurrentNoteId(null);
    setDeleteAnchorEl(null);
  };

  const handleSingleDelete = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSingleDeleteAnchorEl(e.currentTarget);
    setSelectedDeleteId(id);
  };

  const handleSingleDeleteClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSingleDeleteAnchorEl(null);
    setSelectedDeleteId(null);
  };

  const handleSingleDeleteConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedDeleteId) {
      setSavedFiles(prev => prev.filter(file => file.id !== selectedDeleteId));
      if (currentNoteId === selectedDeleteId) {
        setCurrentNoteId(null);
      }
    }
    handleSingleDeleteClose();
  };

  const handleSortByTitle = () => {
    const nextOrder = titleSortOrder === 'asc' ? 'desc' : 'asc';
    setTitleSortOrder(nextOrder);
    setUpdateSortOrder(null);

    const sorted = [...savedFiles].sort((a, b) => {
      return nextOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    });
    setSavedFiles(sorted);
  };

  const handleSortByUpdated = () => {
    const nextOrder = updateSortOrder === 'asc' ? 'desc' : 'asc';
    setUpdateSortOrder(nextOrder);
    setTitleSortOrder(null);

    const sorted = [...savedFiles].sort((a, b) => {
      return nextOrder === 'asc' ? a.updatedAt - b.updatedAt : b.updatedAt - a.updatedAt;
    });
    setSavedFiles(sorted);
  };

  const handleOpenFile = (file: LocalNoteFile) => {
    setActivePage(file.type);
    setNoteTitle(file.title);
    setNoteDescription(file.description);
    setCurrentNoteId(file.id);
    if (file.pdfUrl) {
      setPdfUrl(file.pdfUrl);
    } else {
      setPdfUrl(null);
    }
  };

  
  const handleSaveNote = () => {
    if (!noteTitle.trim()) {
      alert("Please enter a note title!");
      return;
    }

    const existingFileIndex = savedFiles.findIndex(f => f.title === noteTitle && f.type === activePage);

    if (existingFileIndex >= 0) {
      const updatedFiles = [...savedFiles];
      updatedFiles[existingFileIndex] = {
        ...updatedFiles[existingFileIndex],
        description: noteDescription,
        pdfUrl: pdfUrl || undefined,
        updatedAt: Date.now()
      };
      setSavedFiles(updatedFiles);
      setCurrentNoteId(updatedFiles[existingFileIndex].id);
      alert("Note updated successfully!");
    } else {
      const generatedId = Date.now().toString(); 
      const newFile: LocalNoteFile = {
        id: generatedId,
        title: noteTitle,
        description: noteDescription,
        type: activePage, 
        pdfUrl: pdfUrl || undefined,
        updatedAt: Date.now()
      };
      setSavedFiles(prev => [newFile, ...prev]);
      setCurrentNoteId(generatedId); 
      alert("Note saved successfully!");
    }
  };

  
  const handleShareNoteSubmit = async (emails: string[]) => {
    
    if (!currentNoteId) {
      alert("Please save the note first before sharing!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to share notes.");
      return;
    }

    
    const targetPageUrl = `${window.location.origin}/note-create-form/${currentNoteId}`;

    try {
      const response = await fetch("http://localhost:5000/api/share/multiple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emails: emails,
          pageUrl: targetPageUrl,
          source: "note_create_form_page" 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCollaborators(data.collaborators || []);
        alert("Shared successfully!");
      } else {
        alert("Failed to share note.");
      }
    } catch (err) {
      console.error("Error sharing note:", err);
    }
  };

  const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
   
    // if (!currentNoteId) {
    //   alert("Please save your note before sharing!");
    //   return;
    // }
    setShareAnchorEl(event.currentTarget);
  };
  

  const handleShareClose = () => {
    setShareAnchorEl(null);
  };

  const handleOpenPermissionMenu = (event: React.MouseEvent<HTMLButtonElement>, id: string | null, currentRole: string) => {
    setPermissionMenuAnchorEl(event.currentTarget);
    setActiveCollaboratorId(id);
    setActiveRole(currentRole || "viewer");
  };

  const handleClosePermissionMenu = () => {
    setPermissionMenuAnchorEl(null);
    setActiveCollaboratorId(null);
  };

  const handlePermissionChange = async (role: string) => {
    if (!activeCollaboratorId) {
      handleClosePermissionMenu();
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/share/${activeCollaboratorId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ role }),
      });
      if (response.ok) {
        setCollaborators((prev) => prev.map((person) => person._id === activeCollaboratorId ? { ...person, role } : person));
      }
    } catch (err) {
      console.error(err);
    } finally {
      handleClosePermissionMenu();
    }
  };

  const handleRemoveCollaborator = async () => {
    if (!activeCollaboratorId) return;
    try {
      const response = await fetch(`http://localhost:5000/api/share/${activeCollaboratorId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      if (response.ok) {
        setCollaborators((prev) => prev.filter((person) => person._id !== activeCollaboratorId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      handleClosePermissionMenu();
    }
  };

  const getRoleLabel = (role: string) => {
    if (role === "editor") return "Can edit";
    return "Can view";
  };



  const renderFolderFiles = () => (
    <Stack spacing={1} sx={{ pl: 4, mt: 1, mb: 1, maxHeight: '200px', overflowY: 'auto' }}>
      {savedFiles.map((file) => (
        <Box key={file.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.2 }}>
          {getFileIcon(file.type)}
          <Typography 
            noWrap 
            onClick={() => handleOpenFile(file)} 
            sx={{ fontSize: '13px', color: 'text.primary', cursor: 'pointer', maxWidth: '150px' }}
          >
            {file.title}
          </Typography>
        </Box>
      ))}
    </Stack>
  );

  const renderActivePage = () => {
    switch (activePage) {
      case '/note-create-form/plain-text': return <PlainTextNotePage description={noteDescription} setText={setNoteDescription} />;
      case '/note-create-form/rich-text': return <RichTextNotePage description={noteDescription} setText={setNoteDescription} />;
      case '/note-create-form/mark-down': return <MarkdownPage description={noteDescription} setText={setNoteDescription}/>;
      case '/note-create-form/task-list': return <TaskListPage description={noteDescription} setText={setNoteDescription} />;
      case '/note-create-form/book-mark': return <BookMarkPage description={noteDescription} setText={setNoteDescription}/>; 
      case '/note-create-form/white-board': return <WhiteboardPage description={noteDescription} setText={setNoteDescription}/>;
      case '/note-create-form/spread-sheet': return <SpreadsheetPage description={noteDescription} setText={setNoteDescription} />;
      case '/note-create-form/group-chat': return <GroupChatPage description={noteDescription} setText={setNoteDescription} />;
      
      case '/note-create-form/pdf-view': 
        return pdfUrl ? (
          <Box sx={{ width: '100%', height: '65vh', border: '1px solid #ccc', borderRadius: 1, overflow: 'hidden' }}>
            <embed src={pdfUrl} type="application/pdf" width="100%" height="100%" />
          </Box>
        ) : (
          <Typography color="error">No PDF file loaded.</Typography>
        );
      default: return <PlainTextNotePage description={noteDescription} setText={setNoteDescription} />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: "100%", p: 2, bgcolor:"background.default", color:"text.primary" }}>
      <Box>
        <Stack sx={{ mb: 2 }}>
          <TextField 
            variant='outlined' 
            label="Note Title" 
            value={noteTitle} 
            onChange={(e) => setNoteTitle(e.target.value)}
          />
        </Stack>
        
        <Stack spacing={2} direction="row" sx={{ mb: 2, alignItems: 'center' }}>
          <Button 
            id="new-note-button"
            startIcon={<NoteAddOutlined/>} 
            onClick={handleMenuOpen} 
            sx={{ textTransform: "none", color: "text.primary", fontSize: "14px", "& .MuiButton-startIcon": { color: "#973aa8" } }}
          >
            New Note
          </Button>

          <Menu
            id="new-note-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            slotProps={{
              list: { 'aria-labelledby': 'new-note-button' },
              paper: {
                sx: {
                  boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  minWidth: '180px',
                  mt: 0.5,
                  "& .MuiMenuItem-root": {
                    fontSize: '14px',
                    color: '#973aa8',
                    fontWeight: '500',
                    py: 1,
                    gap: 1.5,
                    "& :hover": { bgcolor: "#f5f9ff" }
                  },
                }
              }
            }}
          >
            <MenuItem onClick={() => handleMenuClick('/note-create-form/plain-text')}>
              <DescriptionOutlined fontSize="small"/> Plain Text Note
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick('/note-create-form/rich-text')}>
              <ArticleOutlined fontSize="small"/> Rich Text Note
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick('/note-create-form/mark-down')}>
              <DescriptionOutlined fontSize="small"/> Markdown
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick('/note-create-form/task-list')}>
              <FormatListBulletedOutlined fontSize="small"/> Task List
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick('/note-create-form/book-mark')}>
              <BookmarkBorderOutlined fontSize="small"/> Bookmark
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick('/note-create-form/white-board')}>
              <BorderColorOutlined fontSize="small"/> Whiteboard
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick('/note-create-form/spread-sheet')}>
              <TableChartOutlined fontSize="small"/> Spreadsheet
            </MenuItem>
          </Menu>

          <label htmlFor="pdf-upload">
            <Button
              component="span"
              size="small"
              startIcon={<FileUploadOutlined />}
              sx={{ textTransform: "none", color: "text.primary", "& .MuiButton-startIcon": { color: "#973aa8" } }}
            >
              Import Pdf
            </Button>
          </label>
          
          <IconButton size="small" sx={{ color: 'text.primary', mr: searchOpen ? 1 : 0, borderRadius: '4px'}} onClick={() => setSearchOpen((prev) => !prev)}>
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
            startIcon={<ShareOutlined />}
            onClick={handleShareClick}
            sx={{
              color: 'text.primary',
              bgcolor: isShareOpen ? 'action.selected' : 'background.default',
              borderRadius: '4px',
              textTransform: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            Share
          </Button>
        </Stack>
        
        <Popover
          open={isShareOpen}
          anchorEl={shareAnchorEl}
          onClose={handleShareClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          slotProps={{
            paper: {
              sx: {
                width: 420,
                p: 2.5,
                mt: 1,
                borderRadius: 3,
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
                bgcolor: 'background.paper',
                color: 'text.primary'
              }
            }
          }}
        >
         
          <ShareNotePage
            user={user}
            collaborators={collaborators}
            setCollaborators={setCollaborators}
            handleOpenPermissionMenu={handleOpenPermissionMenu}
            getRoleLabel={getRoleLabel}
            onShareSubmit={handleShareNoteSubmit} 
          />
        </Popover>

        <Menu
          anchorEl={permissionMenuAnchorEl}
          open={Boolean(permissionMenuAnchorEl)}
          onClose={handleClosePermissionMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{ paper: { sx: { width: 280, borderRadius: 3, p: 0.5, boxShadow: "0px 4px 16px rgba(0,0,0,0.12)" } } }}
        >
          <MenuItem onClick={() => handlePermissionChange("editor")} sx={{ py: 1 }}>
            <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can edit</Typography>} />
            {activeRole === "editor" && <Check sx={{ fontSize: 16, ml: 1 }} />}
          </MenuItem>

          <MenuItem onClick={() => handlePermissionChange("viewer")} sx={{ py: 1 }}>
            <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can view</Typography>} />
            {activeRole === "viewer" && <Check sx={{ fontSize: 16, ml: 1 }} />}
          </MenuItem>

          {activeCollaboratorId && (
            <>
              <Box sx={{ my: 0.5, borderTop: "1px solid #f0f0f0" }} />
              <MenuItem onClick={handleRemoveCollaborator} sx={{ py: 1, color: "error.main" }}>
                <ListItemIcon sx={{ color: "error.main", minWidth: 30 }}><DeleteOutlined sx={{ fontSize: 18 }} /></ListItemIcon>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>Remove</Typography>
              </MenuItem>
            </>
          )}
        </Menu>

        <VisuallyHiddenInput
          type="file"
          id="pdf-upload"
          accept="application/pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 3, width: '100%' }}>
          {renderActivePage()}
        </Box>

        <Button
          type='button'
          variant="contained"
          onClick={handleSaveNote}
          sx={{ textTransform: "none", bgcolor: "#973aa8", borderRadius: 3, px: 3, mt: 2, mb: 4, "&:hover": { bgcolor: "#7b2c8a" } }}
        >
          Save Note
        </Button>

        <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 3 ,color:'text.primary'}}>
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Button onClick={handleSortByTitle} startIcon={<SwapVertOutlined sx={{ fontSize: 16 }} />} sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 'bold', fontSize: '12px' }}>
              Sort by Title {titleSortOrder ? `(${titleSortOrder.toUpperCase()})` : ''}
            </Button>
            <Button onClick={handleSortByUpdated} startIcon={<SwapVertOutlined sx={{ fontSize: 16 }} />} sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 'bold', fontSize: '12px' }}>
              Sort by Updated {updateSortOrder ? `(${updateSortOrder.toUpperCase()})` : ''}
            </Button>
          </Stack>

          <Grid container spacing={4}>
            <Grid size={{xs:12,md:3.5}}>
              <Stack spacing={1.5}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <FolderOpenOutlined sx={{ color: '#d4a373' }} />
                    <Typography sx={{ color: 'text.primary', fontWeight: 500, fontSize: '14px' }}>All Notes</Typography>
                  </Box>
                  {savedFiles.length > 0 && renderFolderFiles()}
                </Box>
                
                <Box 
                  onClick={handleDeleteClick} 
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', maxWidth: '200px' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <DeleteOutlineOutlined sx={{ color: '#ff3d00' }} />
                    <Typography sx={{ color: 'text.primary', fontWeight: 500, fontSize: '14px' }}>Recycle Bin</Typography>
                  </Box>
                  <IconButton size="small"><MoreVertOutlined sx={{ fontSize: 16, color: '#ff3d00' }} /></IconButton>
                </Box>

                <Popover
                  open={openDeletePopover}
                  anchorEl={deleteAnchorEl}
                  onClose={handleDeleteClose}
                  anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'center', horizontal: 'left' }}
                  slotProps={{
                    paper: { sx: { p: 2, boxShadow: '0px 4px 16px rgba(0,0,0,0.12)', border: '1px solid #e0e0e0', borderRadius: '8px', ml: 1 } }
                  }}
                >
                  <Typography sx={{ fontSize: '13px', fontWeight: 500, mb: 1.5, color: 'text.primary' }}>
                    Delete all saved files?
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{justifyContent:'flex-end'}}>
                    <Button size="small" onClick={handleDeleteClose} sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '12px' }}>
                      Cancel
                    </Button>
                    <Button size="small" variant="contained" onClick={handleDeleteConfirm} sx={{ textTransform: 'none', bgcolor: '#ff3d00', fontSize: '12px', '&:hover': { bgcolor: '#e03500' } }}>
                      Confirm
                    </Button>
                  </Stack>
                </Popover>
              </Stack>
            </Grid>

            <Grid size={{xs:12,md:8.5}}>
              <Grid container spacing={2}>
                {savedFiles.map((file) => (
                  <Grid size={{xs:12,sm:6,md:4}} key={file.id}>
                    <Box 
                      onClick={() => handleOpenFile(file)}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        p: 1, 
                        borderRadius: '4px', 
                        cursor: 'pointer', 
                        border: currentNoteId === file.id ? '1px solid #973aa8' : '1px solid #eee',
                        '&:hover': { bgcolor: '#f5f5f5' } 
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
                        {getFileIcon(file.type)}
                        <Typography noWrap sx={{ fontSize: '14px', color: 'text.primary', fontWeight: 500 }}>
                          {file.title}
                        </Typography>
                      </Box>
                  
                      <IconButton size="small" onClick={(e) => handleSingleDelete(file.id, e)}>
                        <DeleteOutlineOutlined sx={{ fontSize: 16, color: '#ff3d00' }} />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Popover
        open={openSingleDeletePopover}
        anchorEl={singleDeleteAnchorEl}
        onClose={() => handleSingleDeleteClose()}
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
        transformOrigin={{ vertical: 'center', horizontal: 'left' }}
        onClick={(e) => e.stopPropagation()}
        slotProps={{
          paper: { sx: { p: 2, boxShadow: '0px 4px 16px rgba(0,0,0,0.12)', border: '1px solid #e0e0e0', borderRadius: '8px', ml: 1 } }
        }}
      >
        <Typography sx={{ fontSize: '13px', fontWeight: 500, mb: 1.5, color: 'text.primary' }}>
          Delete saved files?
        </Typography>
        <Stack direction="row" spacing={1} sx={{justifyContent:'flex-end'}}>
          <Button size="small" onClick={() => handleSingleDeleteClose()} sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '12px' }}>
            Cancel
          </Button>
          <Button size="small" variant="contained" onClick={handleSingleDeleteConfirm} sx={{ textTransform: 'none', bgcolor: '#ff3d00', fontSize: '12px', '&:hover': { bgcolor: '#e03500' } }}>
            Confirm
          </Button>
        </Stack>
      </Popover>
    </Box>
  );
};