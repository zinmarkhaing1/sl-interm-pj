

// import React, { useRef, useState, useEffect } from 'react';
// import { 
//   Box, 
//   Button, 
//   Stack, 
//   TextField, 
//   styled, 
//   Menu, 
//   MenuItem, 
//   ListItemText, 
//   ListItemIcon, 
//   Typography, 
//   Grid, 
//   IconButton, 
//   Popover 
// } from '@mui/material';
// import {  
//   NoteAddOutlined, 
//   FileUploadOutlined, 
//   ShareOutlined, 
//   DescriptionOutlined,  
//   ArticleOutlined, 
//   FormatListBulletedOutlined, 
//   BookmarkBorderOutlined,  
//   BorderColorOutlined, 
//   TableChartOutlined, 
//   DeleteOutlined, 
//   Check,
//   FolderOpenOutlined, 
//   DeleteOutlineOutlined, 
//   MoreVertOutlined,
//   SwapVertOutlined, 
//   PictureAsPdfOutlined, 
// } from '@mui/icons-material';

// // Pages placeholders - Replace paths with your actual project structure
// import { PlainTextNotePage } from '../notecreatepage/PlainTextNotePage';
// import { RichTextNotePage } from '../notecreatepage/RichTextNotePage';
// import { TaskListPage } from '../notecreatepage/TaskListPage';
// import { WhiteboardPage } from '../notecreatepage/WhiteboardPage';
// import { BookMarkPage } from '../notecreatepage/BookMarkPage';
// import { SpreadsheetPage } from '../notecreatepage/SpreadsheetPage';
// // import { GroupChatPage } from '../notecreatepage/GroupChatPage';
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
//   noteId?: string; 
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
//   const [activePage, setActivePage] = useState<string>('/note/plain-text');
//   const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

//   const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
//   const [titleSortOrder, setTitleSortOrder] = useState<'asc' | 'desc' | null>(null);
//   const [updateSortOrder, setUpdateSortOrder] = useState<'asc' | 'desc' | null>(null);

//   // Retrieve data from localStorage initially
//   const [savedFiles, setSavedFiles] = useState<LocalNoteFile[]>(() => {
//     const localData = localStorage.getItem('local_saved_notes');
//     return localData ? JSON.parse(localData) : [];
//   });

//   const [actionAnchorEl, setActionAnchorEl] = useState<HTMLButtonElement | null>(null);
//   const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
//   const openActionMenu = Boolean(actionAnchorEl);

//   // Single Delete Confirmation Popover
//   const [singleDeleteAnchorEl, setSingleDeleteAnchorEl] = useState<HTMLElement | null>(null);
//   const openSingleDeletePopover = Boolean(singleDeleteAnchorEl);

//   // Recycle Bin Clear All Popover
//   const [deleteAnchorEl, setDeleteAnchorEl] = useState<HTMLDivElement | null>(null);
//   const openDeletePopover = Boolean(deleteAnchorEl);
//   const openMenu = Boolean(anchorEl);

//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);

//   // Sharing States
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [collaborators, setCollaborators] = useState<CollaboratorItem[]>([]);
//   const [shareAnchorEl, setShareAnchorEl] = useState<HTMLElement | null>(null);
//   const [activeShareNoteId, setActiveShareNoteId] = useState<string | null>(null);
//   const [permissionMenuAnchorEl, setPermissionMenuAnchorEl] = useState<HTMLElement | null>(null);
//   const [activeCollaboratorId, setActiveCollaboratorId] = useState<string | null>(null);
//   const [activeRole, setActiveRole] = useState<string>("viewer");

//   const isShareOpen = Boolean(shareAnchorEl);

//   // Sync to localStorage whenever changes occur
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
//   }, []);

//   // API Call: Fetch collaborators assigned to a single note
//   const loadCollaboratorsForNote = async (noteId: string) => {
//     const token = localStorage.getItem("token");
//     if (!token) return;
//     try {
//       const response = await fetch(`http://localhost:5000/api/share/collaborators?noteId=${noteId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (response.ok) {
//         const data = await response.json();
//         const noteCollaborators = (data.collaborators || []).filter(
//           (c: CollaboratorItem) => c.source === `note_id_${noteId}`
//         );
//         setCollaborators(noteCollaborators);
//       }
//     } catch (err) {
//       console.error("Failed to load collaborators", err);
//     }
//   };

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
//     setCurrentNoteId(null); 
//     handleMenuClose();
//   };

//   // PDF File Import Functionality
//   // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//   //   const files = event.target.files;
//   //   if (files && files.length > 0) {
//   //     const file = files[0];
//   //     setNoteTitle(file.name.replace(".pdf", "")); 
//   //     setNoteDescription(`PDF File: ${file.name}`);
      
//   //     const url = URL.createObjectURL(file);
//   //     setPdfUrl(url);
//   //     setActivePage('/note/pdf-view'); 
//   //     setCurrentNoteId(null);
//   //   }
//   // };


//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       const file = files[0];
//       setNoteTitle(file.name.replace(".pdf", ""));
//       setNoteDescription(`PDF File: ${file.name}`);

//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const base64String = e.target?.result as string;
//         setPdfUrl(base64String);
//         setActivePage('/note/pdf-view');
//         setCurrentNoteId(null);
//       };
//       reader.readAsDataURL(file);
//     }
//   };
      
      
//   const getFileIcon = (type: string) => {
//     switch (type) {
//       case '/note/spread-sheet': return <TableChartOutlined sx={{ color: '#2e7d32', fontSize: 18 }} />;
//       case '/note/white-board': return <BorderColorOutlined sx={{ color: '#0288d1', fontSize: 18 }} />;
//       case '/note/book-mark': return <BookmarkBorderOutlined sx={{ color: '#ed6c02', fontSize: 18 }} />;
//       case '/note/task-list': return <FormatListBulletedOutlined sx={{ color: '#7b1fa2', fontSize: 18 }} />;
//       case '/note/rich-text': return <ArticleOutlined sx={{ color: '#973aa8', fontSize: 18 }} />;
//       case '/note/mark-down': return <DescriptionOutlined sx={{ color: '#009688', fontSize: 18 }} />;
//       case '/note/pdf-view': return <PictureAsPdfOutlined sx={{ color: '#d32f2f', fontSize: 18 }} />;
//       default: return <DescriptionOutlined sx={{ color: '#555', fontSize: 18 }} />;
//     }
//   };

//   // Recycle Bin Clear All Actions
//   const handleDeleteClick = (event: React.MouseEvent<HTMLDivElement>) => {
//     setDeleteAnchorEl(event.currentTarget);
//   };

//   const handleDeleteClose = () => {
//     setDeleteAnchorEl(null);
//   };

//   const handleDeleteConfirm = () => {
//     setSavedFiles([]); 
//     setCurrentNoteId(null);
//     setDeleteAnchorEl(null);
//     alert("Recycle bin cleared completely!");
//   };

//   // Card List Action Trigger (Three dots click)
//   const handleActionMenuOpen = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
//     e.stopPropagation();
//     setActionAnchorEl(e.currentTarget);
//     setSelectedNoteId(id);
//   };

//   const handleActionMenuClose = () => {
//     setActionAnchorEl(null);
//   };

//   // Remove Note Popover Setup
//   const handleSingleDeleteClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setSingleDeleteAnchorEl(actionAnchorEl); 
//     handleActionMenuClose();
//   };

//   const handleSingleDeleteClose = (e?: React.MouseEvent) => {
//     if (e) e.stopPropagation();
//     setSingleDeleteAnchorEl(null);
//     setSelectedNoteId(null);
//   };

//   const handleSingleDeleteConfirm = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (selectedNoteId) {
//       setSavedFiles(prev => prev.filter(file => file.id !== selectedNoteId));
//       if (currentNoteId === selectedNoteId) {
//         setCurrentNoteId(null);
//         setNoteTitle('');
//         setNoteDescription('');
//         setPdfUrl(null);
//       }
//     }
//     handleSingleDeleteClose();
//   };

//   // Open Share interface for target card
//   const handleSingleShareClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (selectedNoteId) {
//       setActiveShareNoteId(selectedNoteId);
//       setShareAnchorEl(actionAnchorEl); 
//       loadCollaboratorsForNote(selectedNoteId); 
//     }
//     handleActionMenuClose();
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

//   // Load Note from local system state
//   const handleOpenFile = (file: LocalNoteFile) => {
//     setActivePage(file.type);
//     setNoteTitle(file.title);
//     setNoteDescription(file.description);
//     setCurrentNoteId(file.id);
//     setPdfUrl(file.pdfUrl || null);
//     // if (file.pdfUrl) {
//     //   setPdfUrl(file.pdfUrl);
//     // } else {
//     //   setPdfUrl(null);
//     // }
//     // console.log(file.pdfUrl)
//   };

//   // Save or Update Local Note Data
//   const handleSaveNote = () => {
//     if (!noteTitle.trim()) {
//       alert("Please enter a note title!");
//       return;
//     }

//     if (currentNoteId) {
//       // Update targeted ID document
//       const updatedFiles = savedFiles.map(file => {
//         if (file.id === currentNoteId) {
//           return {
//             ...file,
//             title: noteTitle,
//             description: noteDescription,
//             pdfUrl: pdfUrl || undefined,
//             updatedAt: Date.now()
//           };
//         }
//         return file;
//       });
//       setSavedFiles(updatedFiles);
//       alert("Note updated successfully!");
//     } else {
//       // Setup new document block instance
//       const generatedId = Date.now().toString(); 
//       const newFile: LocalNoteFile = {
//         id: generatedId,
//         title: noteTitle,
//         description: noteDescription,
//         type: activePage, 
//         pdfUrl: pdfUrl || undefined,
//         updatedAt: Date.now()
//       };
//       setSavedFiles(prev => [newFile, ...prev]);
//       setCurrentNoteId(generatedId); 
//       alert("Note saved successfully!");
//     }
//   };

//   // API Call: Share processing block configuration
//   const handleShareNoteSubmit = async (emails: string[]) => {
//     const targetNoteId = activeShareNoteId;
//     if (!targetNoteId) {
//       alert("No note selected to share!");
//       return;
//     }

//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("Please login to share notes.");
//       throw new Error("Unauthorized");
//     }

//     const targetPageUrl = `${window.location.origin}/note/${targetNoteId}`;

//     try {
//       const response = await fetch("http://localhost:5000/api/share/multiple", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           emails: emails,
//           pageUrl: targetPageUrl,
//           source: `note_id_${targetNoteId}`, 
//           noteId: targetNoteId
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setCollaborators(data.collaborators || []);
//         alert("Shared successfully!");
//       } else {
//         alert("Failed to share note.");
//         throw new Error("API error");
//       }
//     } catch (err) {
//       console.error("Error sharing note:", err);
//       throw err;
//     }
//   };

//   const handleShareClose = () => {
//     setShareAnchorEl(null);
//     setActiveShareNoteId(null);
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

//   // API Call: Update Collaborator access level updates
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

//   // API Call: Delete collaborator link access
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


// // const renderActivePage = () => {


// //   const keyProp = currentNoteId || activePage;

// //   switch (activePage) {
// //     case '/note/plain-text': 
// //       return <PlainTextNotePage key={keyProp} description={noteDescription} setText={setNoteDescription} />;
// //     case '/note/rich-text': 
// //       return <RichTextNotePage key={keyProp} description={noteDescription} setText={setNoteDescription} />;
// //     case '/note/mark-down': 
// //       return <MarkdownPage key={keyProp} description={noteDescription} setText={setNoteDescription}/>;
// //     case '/note/task-list': 
// //       return <TaskListPage key={keyProp} description={noteDescription} setText={setNoteDescription} />;
// //     case '/note/book-mark': 
// //       return <BookMarkPage key={keyProp} description={noteDescription} setText={setNoteDescription}/>; 
// //     case '/note/white-board': 
// //       return <WhiteboardPage key={keyProp} description={noteDescription} setText={setNoteDescription}/>;
// //     case '/note/spread-sheet': 
// //       return <SpreadsheetPage key={keyProp} description={noteDescription} setText={setNoteDescription} />;
// //     // case '/note/group-chat': 
// //     //   return <GroupChatPage key={keyProp} description={noteDescription} setText={setNoteDescription} />;
    
// //     // case '/note/pdf-view': 
// //     //   return pdfUrl ? (
// //     //     <Box key={keyProp} sx={{ width: '100%', height: '65vh', border: '1px solid #ccc', borderRadius: 1, overflow: 'hidden' }}>
// //     //       <embed src={pdfUrl} type="application/pdf" width="100%" height="100%" />
// //     //     </Box>
// //     //   ) : (
// //     //     <Typography color="error">No PDF file loaded.</Typography>
// //     //   );
// //     case "/note/pdf-view":
// //   return pdfUrl ? (
// //     <Box
// //       sx={{
// //         width: "100%",
// //         height: "65vh",
// //         border: "1px solid #ccc",
// //         borderRadius: 1,
// //         overflow: "hidden",
// //       }}
// //     >
// //       <embed
// //         src={pdfUrl}
// //         type="application/pdf"
// //         width="100%"
// //         height="100%"
// //       />
// //     </Box>
// //   ) : (
// //     <Typography color="error">No PDF file loaded.</Typography>
// //   );
// //     default: 
// //       return <PlainTextNotePage key={keyProp} description={noteDescription} setText={setNoteDescription} />;
// //   }
// // };

// const renderActivePage = () => {
//     const keyProp = currentNoteId || activePage;

//     switch (activePage) {
//       case '/note/plain-text': 
//         return <PlainTextNotePage key={keyProp} description={noteDescription} setText={setNoteDescription} />;
//       case '/note/rich-text': 
//         return <RichTextNotePage key={keyProp} description={noteDescription} setText={setNoteDescription} />;
//       case '/note/mark-down': 
//         return <MarkdownPage key={keyProp} description={noteDescription} setText={setNoteDescription}/>;
//       case '/note/task-list': 
//         return <TaskListPage key={keyProp} description={noteDescription} setText={setNoteDescription} />;
//       case '/note/book-mark': 
//         return <BookMarkPage key={keyProp} description={noteDescription} setText={setNoteDescription}/>; 
//       case '/note/white-board': 
//         return <WhiteboardPage key={keyProp} description={noteDescription} setText={setNoteDescription}/>;
//       case '/note/spread-sheet': 
//         return <SpreadsheetPage key={keyProp} description={noteDescription} setText={setNoteDescription} />;
      
//       case '/note/pdf-view':
//         return pdfUrl ? (
//           <Box
//             sx={{
//               width: "100%",
//               height: "65vh",
//               border: "1px solid #ccc",
//               borderRadius: 1,
//               overflow: "hidden",
//             }}
//           >
//             <embed
//               src={pdfUrl}
//               type="application/pdf"
//               width="100%"
//               height="100%"
//             />
//           </Box>
//         ) : (
//           <Typography color="error">No PDF file loaded.</Typography>
//         );
        
//       default: 
//         return <PlainTextNotePage key={keyProp} description={noteDescription} setText={setNoteDescription} />;
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
//                     "&:hover": { bgcolor: "#f5f9ff" }
//                   },
//                 }
//               }
//             }}
//           >
//             <MenuItem onClick={() => handleMenuClick('/note/plain-text')}>
//               <DescriptionOutlined fontSize="small"/> Plain Text Note
//             </MenuItem>
//             <MenuItem onClick={() => handleMenuClick('/note/rich-text')}>
//               <ArticleOutlined fontSize="small"/> Rich Text Note
//             </MenuItem>
//             <MenuItem onClick={() => handleMenuClick('/note/mark-down')}>
//               <DescriptionOutlined fontSize="small"/> Markdown
//             </MenuItem>
//             <MenuItem onClick={() => handleMenuClick('/note/task-list')}>
//               <FormatListBulletedOutlined fontSize="small"/> Task List
//             </MenuItem>
//             <MenuItem onClick={() => handleMenuClick('/note/book-mark')}>
//               <BookmarkBorderOutlined fontSize="small"/> Bookmark
//             </MenuItem>
//             <MenuItem onClick={() => handleMenuClick('/note/white-board')}>
//               <BorderColorOutlined fontSize="small"/> Whiteboard
//             </MenuItem>
//             <MenuItem onClick={() => handleMenuClick('/note/spread-sheet')}>
//               <TableChartOutlined fontSize="small"/> Spreadsheet
//             </MenuItem>
//           </Menu>

//           {/* <label htmlFor="pdf-upload">
//             <Button
//               component="span"
//               size="small"
//               startIcon={<FileUploadOutlined />}
//               sx={{ textTransform: "none", color: "text.primary", "& .MuiButton-startIcon": { color: "#973aa8" } }}
//             >
//               Import Pdf
//             </Button>
//           </label> */}

//            <label htmlFor="pdf-upload">
//                        <Button
//               component="span"
//               size="small"
//               startIcon={<FileUploadOutlined />}
//               sx={{ textTransform: "none", color: "text.primary", "& .MuiButton-startIcon": { color: "#973aa8" } }}
//             >
//               Import Pdf
//             </Button>
//           </label>
//         </Stack>
        
//         {/* Note sharing component Popover setup */}
//         <Popover
//           open={isShareOpen}
//           anchorEl={shareAnchorEl}
//           onClose={handleShareClose}
//           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//           transformOrigin={{ vertical: "top", horizontal: "right" }}
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
//             // onShareSubmit={handleShareNoteSubmit} 
//           />
//         </Popover>

//         {/* Collaborator Role & Remove Management Menu */}
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
//             <Grid  size={{xs:12,md:3.5}}>
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

//             {/* Note Cards List Section */}
//             <Grid  size={{xs:12,md:8.5}}>
//               <Grid container spacing={2}>
//                 {savedFiles.map((file) => (
//                   <Grid  size={{xs:12,sm:6,md:4}} key={file.id}>
//                     <Box 
//                       onClick={() => handleOpenFile(file)}
//                       sx={{ 
//                         display: 'flex', 
//                         alignItems: 'center', 
//                         justifyContent: 'space-between', 
//                         p: 1, 
//                         borderRadius: '4px', 
//                         cursor: 'pointer', 
//                         border: currentNoteId === file.id ? '1px solid #973aa8' : '1px solid #eee',
//                         '&:hover': { bgcolor: '#f5f5f5' } 
//                       }}
//                     >
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
//                         {getFileIcon(file.type)}
//                         <Typography noWrap sx={{ fontSize: '14px', color: 'text.primary', fontWeight: 500 }}>
//                           {file.title}
//                         </Typography>
//                       </Box>
                    
//                       <IconButton size="small" onClick={(e) => handleActionMenuOpen(file.id, e)}>
//                         <MoreVertOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
//                       </IconButton>
//                     </Box>
//                   </Grid>
//                 ))}
//               </Grid>
//             </Grid>
//           </Grid>
//         </Box>
//       </Box>

//       {/* Action Options (Three Dot Action Menu Structure) */}
//       <Menu
//         anchorEl={actionAnchorEl}
//         open={openActionMenu}
//         onClose={handleActionMenuClose}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//         transformOrigin={{ vertical: 'top', horizontal: 'left' }}
//       >
//         <MenuItem onClick={handleSingleShareClick}>
//           <ShareOutlined fontSize="small" sx={{ mr: 1, color: '#973aa8' }} /> Share
//         </MenuItem>
//         <MenuItem onClick={handleSingleDeleteClick} sx={{ color: '#ff3d00' }}>
//           <DeleteOutlineOutlined fontSize="small" sx={{ mr: 1, color: '#ff3d00' }} /> Remove
//         </MenuItem>
//       </Menu>

//       {/* Target Single Note Delete Confirmation */}
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



import React, { useRef, useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Stack, 
  TextField, 
  styled, 
  Menu, 
  MenuItem, 
  ListItemText, 
  ListItemIcon, 
  Typography, 
  Grid, 
  IconButton, 
  Popover,
  Alert,
  Snackbar
} from '@mui/material';
import {  
  NoteAddOutlined, 
  FileUploadOutlined, 
  ShareOutlined, 
  DescriptionOutlined,  
  ArticleOutlined, 
  FormatListBulletedOutlined, 
  BookmarkBorderOutlined,  
  BorderColorOutlined, 
  TableChartOutlined, 
  DeleteOutlined, 
  Check,
  FolderOpenOutlined, 
  DeleteOutlineOutlined, 
  MoreVertOutlined,
  SwapVertOutlined, 
  PictureAsPdfOutlined, 
} from '@mui/icons-material';

// Pages placeholders
import { PlainTextNotePage } from '../notecreatepage/PlainTextNotePage';
import { RichTextNotePage } from '../notecreatepage/RichTextNotePage';
import { TaskListPage } from '../notecreatepage/TaskListPage';
import { WhiteboardPage } from '../notecreatepage/WhiteboardPage';
import { BookMarkPage } from '../notecreatepage/BookMarkPage';
import { SpreadsheetPage } from '../notecreatepage/SpreadsheetPage';
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
  collaborators?: CollaboratorItem[]; // Note-specific collaborators
}

interface CollaboratorItem {
  _id?: string;
  invitedEmail: string;
  status: string;
  role: string;
  pageUrl?: string;
  source?: string;
  noteId?: string; 
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  photo?: string;
  _id?: string;
}

export const NoteCreateForm = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteDescription, setNoteDescription] = useState<string>('');
  const [activePage, setActivePage] = useState<string>('/note/plain-text');
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [titleSortOrder, setTitleSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [updateSortOrder, setUpdateSortOrder] = useState<'asc' | 'desc' | null>(null);

  // Retrieve data from localStorage initially
  const [savedFiles, setSavedFiles] = useState<LocalNoteFile[]>(() => {
    const localData = localStorage.getItem('local_saved_notes');
    return localData ? JSON.parse(localData) : [];
  });

  const [actionAnchorEl, setActionAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const openActionMenu = Boolean(actionAnchorEl);

  // Single Delete Confirmation Popover
  const [singleDeleteAnchorEl, setSingleDeleteAnchorEl] = useState<HTMLElement | null>(null);
  const openSingleDeletePopover = Boolean(singleDeleteAnchorEl);

  // Recycle Bin Clear All Popover
  const [deleteAnchorEl, setDeleteAnchorEl] = useState<HTMLDivElement | null>(null);
  const openDeletePopover = Boolean(deleteAnchorEl);
  const openMenu = Boolean(anchorEl);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Sharing States
  const [user, setUser] = useState<UserProfile | null>(null);
  const [collaborators, setCollaborators] = useState<CollaboratorItem[]>([]);
  const [shareAnchorEl, setShareAnchorEl] = useState<HTMLElement | null>(null);
  const [activeShareNoteId, setActiveShareNoteId] = useState<string | null>(null);
  const [permissionMenuAnchorEl, setPermissionMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [activeCollaboratorId, setActiveCollaboratorId] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<string>("viewer");
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const isShareOpen = Boolean(shareAnchorEl);

  // Sync to localStorage whenever changes occur
  useEffect(() => {
    localStorage.setItem('local_saved_notes', JSON.stringify(savedFiles));
  }, [savedFiles]);

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
  }, []);

  // ============ Load collaborators for a specific note ============
  const loadCollaboratorsForNote = async (noteId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:5000/api/share/collaborators?noteId=${noteId}`, {
        headers: { Authorization: `Bearer ${token}`,
      'Content-Type':'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        // Filter collaborators for this specific note
        const noteCollaborators = (data.collaborators || []).filter(
          (c: CollaboratorItem) => c.noteId === noteId || c.source === `note_id_${noteId}`
        );
        setCollaborators(noteCollaborators);
        
        // Also save collaborators to the note in localStorage
        setSavedFiles(prev => prev.map(file => 
          file.id === noteId 
            ? { ...file, collaborators: noteCollaborators }
            : file
        ));
      }
    } catch (err) {
      console.error("Failed to load collaborators", err);
    }
  };

  // ============ Get collaborators for a note from localStorage ============
  const getNoteCollaborators = (noteId: string): CollaboratorItem[] => {
    const note = savedFiles.find(f => f.id === noteId);
    return note?.collaborators || [];
  };

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

  // ============ PDF File Import - Save as Base64 ============
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setNoteTitle(file.name.replace(".pdf", ""));
      setNoteDescription(`PDF File: ${file.name}`);

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setPdfUrl(base64String);
        setActivePage('/note/pdf-view');
        setCurrentNoteId(null);
      };
      reader.readAsDataURL(file);
    }
  };
      
  const getFileIcon = (type: string) => {
    switch (type) {
      case '/note/spread-sheet': return <TableChartOutlined sx={{ color: '#2e7d32', fontSize: 18 }} />;
      case '/note/white-board': return <BorderColorOutlined sx={{ color: '#0288d1', fontSize: 18 }} />;
      case '/note/book-mark': return <BookmarkBorderOutlined sx={{ color: '#ed6c02', fontSize: 18 }} />;
      case '/note/task-list': return <FormatListBulletedOutlined sx={{ color: '#7b1fa2', fontSize: 18 }} />;
      case '/note/rich-text': return <ArticleOutlined sx={{ color: '#973aa8', fontSize: 18 }} />;
      case '/note/mark-down': return <DescriptionOutlined sx={{ color: '#009688', fontSize: 18 }} />;
      case '/note/pdf-view': return <PictureAsPdfOutlined sx={{ color: '#d32f2f', fontSize: 18 }} />;
      default: return <DescriptionOutlined sx={{ color: '#555', fontSize: 18 }} />;
    }
  };

  // Recycle Bin Clear All Actions
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
    setSnackbar({ open: true, message: "All notes deleted successfully!", severity: 'success' });
  };

  // Card List Action Trigger (Three dots click)
  const handleActionMenuOpen = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setActionAnchorEl(e.currentTarget);
    setSelectedNoteId(id);
  };

  const handleActionMenuClose = () => {
    setActionAnchorEl(null);
  };

  // Remove Note Popover Setup
  const handleSingleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSingleDeleteAnchorEl(actionAnchorEl); 
    handleActionMenuClose();
  };

  const handleSingleDeleteClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSingleDeleteAnchorEl(null);
    setSelectedNoteId(null);
  };

  const handleSingleDeleteConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedNoteId) {
      setSavedFiles(prev => prev.filter(file => file.id !== selectedNoteId));
      if (currentNoteId === selectedNoteId) {
        setCurrentNoteId(null);
        setNoteTitle('');
        setNoteDescription('');
        setPdfUrl(null);
      }
      setSnackbar({ open: true, message: "Note deleted successfully!", severity: 'success' });
    }
    handleSingleDeleteClose();
  };

  // ============ Open Share interface for target card ============
  const handleSingleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedNoteId) {
      setActiveShareNoteId(selectedNoteId);
      setShareAnchorEl(actionAnchorEl);
      
      // Load collaborators for this specific note
      const noteCollaborators = getNoteCollaborators(selectedNoteId);
      if (noteCollaborators.length > 0) {
        setCollaborators(noteCollaborators);
      } else {
        loadCollaboratorsForNote(selectedNoteId);
      }
    }
    handleActionMenuClose();
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

  // Load Note from local system state
  const handleOpenFile = (file: LocalNoteFile) => {
    setActivePage(file.type);
    setNoteTitle(file.title);
    setNoteDescription(file.description);
    setCurrentNoteId(file.id);
    setPdfUrl(file.pdfUrl || null);
    
    // Load note-specific collaborators
    if (file.collaborators) {
      setCollaborators(file.collaborators);
    }
  };

  // ============ Save or Update Local Note Data ============
  const handleSaveNote = () => {
    if (!noteTitle.trim()) {
      setSnackbar({ open: true, message: "Please enter a note title!", severity: 'error' });
      return;
    }

    if (currentNoteId) {
      // Update existing note
      const updatedFiles = savedFiles.map(file => {
        if (file.id === currentNoteId) {
          return {
            ...file,
            title: noteTitle,
            description: noteDescription,
            pdfUrl: pdfUrl || undefined,
            updatedAt: Date.now(),
            // Keep existing collaborators
            collaborators: file.collaborators || []
          };
        }
        return file;
      });
      setSavedFiles(updatedFiles);
      setSnackbar({ open: true, message: "Note updated successfully!", severity: 'success' });
    } else {
      // Create new note
      const generatedId = Date.now().toString(); 
      const newFile: LocalNoteFile = {
        id: generatedId,
        title: noteTitle,
        description: noteDescription,
        type: activePage, 
        pdfUrl: pdfUrl || undefined,
        updatedAt: Date.now(),
        collaborators: [] // Initialize empty collaborators
      };
      setSavedFiles(prev => [newFile, ...prev]);
      setCurrentNoteId(generatedId);
      setSnackbar({ open: true, message: "Note saved successfully!", severity: 'success' });
    }
  };

  // ============ Share Note - Send invite with noteId ============
  const handleInvite = async (email: string) => {
    if (!activeShareNoteId) {
      setSnackbar({ open: true, message: "No note selected to share!", severity: 'error' });
      return;
    }

    if (!email.trim()) {
      setSnackbar({ open: true, message: "Please enter an email address!", severity: 'error' });
      return;
    }

    // Check if inviting self
    if (user?.email && email.trim().toLowerCase() === user.email.toLowerCase()) {
      setSnackbar({ open: true, message: "You cannot invite yourself!", severity: 'error' });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setSnackbar({ open: true, message: "Please login to share notes!", severity: 'error' });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/share/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          invitedEmail: email.trim(),
          role: "viewer",
          pageUrl: window.location.href,
          source: `note_id_${activeShareNoteId}`,
          noteId: activeShareNoteId, // Send noteId to backend
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newCollaborator = data.collaborator || {
          _id: data._id || String(Date.now()),
          invitedEmail: email.trim(),
          status: "pending",
          role: "viewer",
          noteId: activeShareNoteId,
        };
        
        // Update collaborators state
        setCollaborators(prev => [...prev, newCollaborator]);
        
        // Update note's collaborators in localStorage
        setSavedFiles(prev => prev.map(file => 
          file.id === activeShareNoteId 
            ? { ...file, collaborators: [...(file.collaborators || []), newCollaborator] }
            : file
        ));
        
        setSnackbar({ open: true, message: `Invitation sent to ${email}!`, severity: 'success' });
      } else {
        const errorData = await response.json();
        setSnackbar({ open: true, message: errorData.message || "Failed to send invitation!", severity: 'error' });
      }
    } catch (error) {
      console.error("Error inviting collaborator:", error);
      setSnackbar({ open: true, message: "Network error. Please try again!", severity: 'error' });
    }
  };

  const handleShareClose = () => {
    setShareAnchorEl(null);
    setActiveShareNoteId(null);
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

  // API Call: Update Collaborator access level updates
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
        setCollaborators((prev) => prev.map((person) => 
          person._id === activeCollaboratorId ? { ...person, role } : person));
        
        // Update in localStorage
        if (activeShareNoteId) {
          setSavedFiles(prev => prev.map(file => 
            file.id === activeShareNoteId 
              ? { ...file, collaborators: file.collaborators?.map(c =>
                c._id === activeCollaboratorId ? { ...c, role } : c) }
              : file
          ));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      handleClosePermissionMenu();
    }
  };

  // API Call: Delete collaborator link access
  const handleRemoveCollaborator = async () => {
    if (!activeCollaboratorId) return;
    try {
      const response = await fetch(`http://localhost:5000/api/share/${activeCollaboratorId}`, {
        method: "DELETE",
        headers: {
           Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          'Content-Type' : 'application/json' },
      });
      if (response.ok) {
        setCollaborators((prev) => prev.filter((person) => person._id !== activeCollaboratorId));
        
        // Update in localStorage
        if (activeShareNoteId) {
          setSavedFiles(prev => prev.map(file => 
            file.id === activeShareNoteId 
              ? { ...file, collaborators: file.collaborators?.filter(c => c._id !== activeCollaboratorId) }
              : file
          ));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      handleClosePermissionMenu();
    }
  };

  const getRoleLabel = (role: string) => {
    if (role === "full") return "Full access";
    if (role === "editor") return "Can edit";
    if (role === "commenter") return "Can comment";
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
    const keyProp = currentNoteId || activePage;

    switch (activePage) {
      case '/note/plain-text': 
        return <PlainTextNotePage key={keyProp} description={noteDescription} setText={setNoteDescription} />;
      case '/note/rich-text': 
        return <RichTextNotePage key={keyProp} description={noteDescription} setText={setNoteDescription} />;
      case '/note/mark-down': 
        return <MarkdownPage key={keyProp} description={noteDescription} setText={setNoteDescription}/>;
      case '/note/task-list': 
        return <TaskListPage key={keyProp} description={noteDescription} setText={setNoteDescription} />;
      case '/note/book-mark': 
        return <BookMarkPage key={keyProp} description={noteDescription} setText={setNoteDescription}/>; 
      case '/note/white-board': 
        return <WhiteboardPage key={keyProp} description={noteDescription} setText={setNoteDescription}/>;
      case '/note/spread-sheet': 
        return <SpreadsheetPage key={keyProp} description={noteDescription} setText={setNoteDescription} />;
      
      case '/note/pdf-view':
        return pdfUrl ? (
          <Box
            sx={{
              width: "100%",
              height: "65vh",
              border: "1px solid #ccc",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <embed
              src={pdfUrl}
              type="application/pdf"
              width="100%"
              height="100%"
            />
          </Box>
        ) : (
          <Typography color="error">No PDF file loaded.</Typography>
        );
        
      default: 
        return <PlainTextNotePage key={keyProp} description={noteDescription} setText={setNoteDescription} />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: "100%", p: 2, bgcolor:"background.default", color:"text.primary" }}>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box>
        <Stack sx={{ mb: 2 }}>
          <TextField 
            variant='outlined' 
            label="Note Title" 
            value={noteTitle} 
            onChange={(e) => setNoteTitle(e.target.value)}
          />
        </Stack>
        
        <Stack spacing={2} direction="row" sx={{ mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
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
                    "&:hover": { bgcolor: "#f5f9ff" }
                  },
                }
              }
            }}
          >
            <MenuItem onClick={() => handleMenuClick('/note/plain-text')}>
              <DescriptionOutlined fontSize="small"/> Plain Text Note
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick('/note/rich-text')}>
              <ArticleOutlined fontSize="small"/> Rich Text Note
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick('/note/mark-down')}>
              <DescriptionOutlined fontSize="small"/> Markdown
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick('/note/task-list')}>
              <FormatListBulletedOutlined fontSize="small"/> Task List
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick('/note/book-mark')}>
              <BookmarkBorderOutlined fontSize="small"/> Bookmark
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick('/note/white-board')}>
              <BorderColorOutlined fontSize="small"/> Whiteboard
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick('/note/spread-sheet')}>
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
              Import PDF
            </Button>
          </label>
        </Stack>
        
        {/* ============ Share Popover with noteId ============ */}
        <Popover
          open={isShareOpen}
          anchorEl={shareAnchorEl}
          onClose={handleShareClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
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
            onInvite={handleInvite}
          />
        </Popover>

        {/* Permission Menu */}
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

            {/* Note Cards List Section */}
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
                        {file.collaborators && file.collaborators.length > 0 && (
                          <Typography variant="caption" sx={{ color: '#973aa8', ml: 0.5 }}>
                            ({file.collaborators.length} shared)
                          </Typography>
                        )}
                      </Box>
                    
                      <IconButton size="small" onClick={(e) => handleActionMenuOpen(file.id, e)}>
                        <MoreVertOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Action Options (Three Dot Action Menu Structure) */}
      <Menu
        anchorEl={actionAnchorEl}
        open={openActionMenu}
        onClose={handleActionMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem onClick={handleSingleShareClick}>
          <ShareOutlined fontSize="small" sx={{ mr: 1, color: '#973aa8' }} /> Share
        </MenuItem>
        <MenuItem onClick={handleSingleDeleteClick} sx={{ color: '#ff3d00' }}>
          <DeleteOutlineOutlined fontSize="small" sx={{ mr: 1, color: '#ff3d00' }} /> Remove
        </MenuItem>
      </Menu>

      {/* Target Single Note Delete Confirmation */}
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
          Delete this note?
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