// import {
//   Box,
//   Card,
//   CardContent,
//   Grid,
//   Typography,
//   Link,
//   Stack,
//   Button,
//   IconButton,
//   TextField,
//   CircularProgress,
//   Menu,
//   MenuItem,
//   ListItemText,
//   ListItemIcon,
//   Popover,
//   Alert,
//   FormControl,
//   InputLabel,
//   Select
// } from "@mui/material";
// import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
// import { SwapVertOutlined, Search, CategoryOutlined, Share, DeleteOutlined, Check, } from "@mui/icons-material";
// import { useGetNotesQuery, useUpdateNoteMutation } from "../../services/noteApi";
// import { useNavigate } from "react-router-dom";
// import type { Note } from "../../types/Note";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import type { DropResult } from "@hello-pangea/dnd";
// import { ShareCategoryPage } from "../sharepages/ShareCategoryPage";
// import { useGetProjectsQuery } from "../../services/projectApi";
// import { useGetTasksQuery } from "../../services/taskApi";

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
//   _id?: string;
// }

// type CategoryConfig = {
//   id: string;
//   label: string;
//   color: string;
// };

// const COLUMNS: CategoryConfig[] = [
//   { id: "Family & Friends", label: "Family & Friends", color: "#f49cbb" },
//   { id: "Fitness & Health", label: "Fitness & Health", color: "#457b9d" },
//   { id: "Study", label: "Study", color: "#31572c" },
//   { id: "My Note", label: "My Note", color: "#3e5c76" },
//   { id: "Company Note", label: "Company Note", color: "#772e25" },
// ];

// export const CategoriesPage = () => {
//   const [searchOpen, setSearchOpen] = useState<boolean>(false);
//   const [searchText, setSearchText] = useState<string>("");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
//   const navigate = useNavigate();

//   //  Remove shareScope parameter to get all notes
//   const { data: notes = [], isLoading, isError, refetch,status, isSuccess,isUninitialized,isFetching } = useGetNotesQuery({shareScope:'category', populate: 'user firstName lastName'});
//   const [updatedNote] = useUpdateNoteMutation();

//   //  const [currentCategoryName, setCurrentCategoryName] = useState<string>("");

//   // Local state for tasks
//   const [categoryTasks, setCategoryTasks] = useState<Note[]>([]);

  
//   const isUpdatingRef = useRef(false);
//   const previousNotesRef = useRef<Note[]>([]);

//   // For sharing
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [collaborators, setCollaborators] = useState<CollaboratorItem[]>([]);
//   const [shareAnchorEl, setShareAnchorEl] = useState<HTMLButtonElement | null>(null);
//   const [permissionMenuAnchorEl, setPermissionMenuAnchorEl] = useState<HTMLElement | null>(null);
//   const [activeCollaboratorId, setActiveCollaboratorId] = useState<string | null>(null);
//   const [activeRole, setActiveRole] = useState<string>("full");

//   const [selectedShareCategory, setSelectedShareCategory] = useState<string>(COLUMNS[0].id);
//   const [isCategorySelectorOpen, setIsCategorySelectorOpen] = useState<boolean>(false);



//   // In CategoriesPage.tsx - Add state for user permission

// // Add this state:
// const [userPermission, setUserPermission] = useState<"owner" | "full" | "viewer">("owner");
// const [isViewOnly, setIsViewOnly] = useState(false);

// const [usersMap, setUsersMap] = useState<Record<string, { firstName: string; lastName: string }>>({});

// useEffect(() => {
//   const fetchUsers = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) return;
//     try {
//       const res = await fetch('http://localhost:5000/api/users', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.ok) {
//         const users = await res.json();
//         const map: Record<string, { firstName: string; lastName: string }> = {};
//         users.forEach((u: any) => {
//           map[u._id] = { firstName: u.firstName, lastName: u.lastName || '' };
//         });
//         setUsersMap(map);
//       }
//     } catch (err) {
//       console.error('Failed to fetch users', err);
//     }
//   };
//   fetchUsers();
// }, []);


// const getCreatorName = useCallback((note: Note): string => {
//   //
//   if (note.user && typeof note.user === 'object') {
//     const u = note.user as any;
//     if (u.firstName) return `${u.firstName} ${u.lastName || ''}`.trim();
//   }


//   if (typeof note.user === 'string') {
//     const userObj = usersMap[note.user];
//     if (userObj) {
//       return `${userObj.firstName} ${userObj.lastName}`.trim();
//     }
//   }

 
//   const userId = (user as any)?._id;
//   const noteUserId = typeof note.user === 'string' ? note.user : (note.user as any)?._id;
//   if (userId && noteUserId === userId) {
//     return `${user?.firstName || 'You'} ${user?.lastName || ''}`.trim() || 'You';
//   }


//   return note.assignee || 'Unknown User';
// }, [usersMap, user]);

// // Update the loadCollaborators function to also get user's permission
// const loadCollaboratorsAndPermission = async () => {
//   const token = localStorage.getItem("token");
//   if (!token) return;
  
//   try {
//     // Get collaborators
//     const collaboratorsResponse = await fetch("http://localhost:5000/api/share/collaborators", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     if (collaboratorsResponse.ok) {
//       const data = await collaboratorsResponse.json();
//       setCollaborators(data.collaborators || []);
//     }

//     // Get user's permission for this page
//     // You might need to fetch this from a separate endpoint or derive it from the notes data
//     const userData = JSON.parse(localStorage.getItem("user") || "{}");
//     const permission = userData.categoryPermission || "owner"; // You'll need to store this
//     setUserPermission(permission);
//     setIsViewOnly(permission === "viewer" || permission === "commenter");
    
//   } catch (err) {
//     console.error("Failed to load data", err);
//   }
// };
// //debug all states
//   useEffect(() => {
//     console.log('🔄 RTK Query States:', {
//       isUninitialized,
//       isLoading,
//       isFetching,
//       isSuccess,
//       isError,
//       status,
//       notesLength: notes.length,
//       notes: notes
//     });
//   }, [isUninitialized, isLoading, isFetching, isSuccess, isError, status, notes]);
// // Update useEffect:
// useEffect(() => {
//   const token = localStorage.getItem('token');
//   const storedUser = localStorage.getItem("user");
//   console.log('Auth Check:', {hasToken:  !!token, hasUser: !!user, tokenPreview : token ? token.substring(0, 30) + '...' : null, user: user ? JSON.parse(user as any):null});
//   if (storedUser) {
//     try {
//       const parsedUser = JSON.parse(storedUser);
//       setUser(parsedUser);
//     } catch (e) {
//       console.error("Failed to parse user from localStorage", e);
//     }
//   }


//   loadCollaboratorsAndPermission();
// }, []);





// const getUserPermissionFromNotes = (notes: Note[], userId: string): "owner" | "viewer"  => {
//   if (!notes || notes.length === 0) return "owner";
  
//   // Check if user is owner of any note in the category
//   const isOwner = notes.some((note: any) => {
//     const noteUserId = typeof note.user === 'string' ? note.user : (note.user as any)?._id;
//     return noteUserId === userId;
//   });
  
//   if (isOwner) return "owner";

//   const pageAccess = (notes[0] as any)?.pageAccess;
//   if (pageAccess === "view") return "viewer";

//   return "viewer";
// }
  

// useEffect(() => {
//   if (notes && notes.length > 0 && user) {
//     const permission = getUserPermissionFromNotes(notes, (user as any)._id);
//     setUserPermission(permission);
//     setIsViewOnly(permission === "viewer" );
//   }
// }, [notes, user]);

  

// const filteredAndSortedNotes = useMemo(() => {
//   if (!Array.isArray(notes)) return [];

//   let result = [...notes];
//   const searchLower = searchText.trim().toLowerCase();

//   if (searchLower !== "") {
//     const statusKeywords = ["todo", "in progress", "complete", "not started"];
//     const matchedStatus = statusKeywords.find(keyword => keyword === searchLower);
//     let statusFilter: string | null = null;

//     if (matchedStatus) {
//       if (matchedStatus === "todo") statusFilter = "Todo";
//       else if (matchedStatus === "in progress") statusFilter = "In Progress";
//       else if (matchedStatus === "complete") statusFilter = "Complete";
//       else if (matchedStatus === "not started") statusFilter = "Not Started";
//     }

//     result = result.filter((note: Note) => {
//       // ၁။ status filter (exact match)
//       if (statusFilter !== null) {
//         const currentStatus = (note.task || note.category || "").trim().toLowerCase();
//         return currentStatus === statusFilter.toLowerCase();
//       }

//       // ၂။ status မဟုတ်ရင် category, assignee, priority, title, content ကို partial match (OR)
//       const currentCategory = (note.category || "").trim().toLowerCase();
//       const currentAssignee = (note.assignee || "").trim().toLowerCase();
//       const currentPriority = (note.priority || "").trim().toLowerCase();
//       const titleText = (note.title || "").toLowerCase();
//       const contentText = (note.content || note.description || "").toLowerCase();

//       return currentCategory.includes(searchLower) ||
//              currentAssignee.includes(searchLower) ||
//              currentPriority.includes(searchLower) ||
//              titleText.includes(searchLower) ||
//              contentText.includes(searchLower);
//     });
//   }

//   // Sort by title
//   result.sort((a, b) => {
//     const titleA = (a.title || "").toLowerCase();
//     const titleB = (b.title || "").toLowerCase();
//     return sortOrder === "asc"
//       ? titleA.localeCompare(titleB)
//       : titleB.localeCompare(titleA);
//   });

//   return result;
// }, [notes, searchText, sortOrder]);

//   // ============ FIX: Update tasks only when data actually changes ============
//   useEffect(() => {
//     const currentData = JSON.stringify(filteredAndSortedNotes);
//     const previousData = JSON.stringify(previousNotesRef.current);

//     if (currentData !== previousData) {
//       previousNotesRef.current = filteredAndSortedNotes;
//       setCategoryTasks(filteredAndSortedNotes);
//     }
//   }, [filteredAndSortedNotes]);

//   // ============ FIX: Load user and collaborators once ============
//   // useEffect(() => {
//   //   const storedUser = localStorage.getItem("user");
//   //   if (storedUser) {
//   //     try {
//   //       const parsedUser = JSON.parse(storedUser);
//   //       setUser(parsedUser);
//   //     } catch (e) {
//   //       console.error("Failed to parse user from localStorage", e);
//   //     }
//   //   }

//   //   const loadCollaborators = async () => {
//   //     const token = localStorage.getItem("token");
//   //     if (!token) return;
//   //     try {
//   //       const response = await fetch("http://localhost:5000/api/share/collaborators", {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       });
//   //       if (response.ok) {
//   //         const data = await response.json();
//   //         setCollaborators(data.collaborators || []);
//   //       }
//   //     } catch (err) {
//   //       console.error("Failed to load collaborators", err);
//   //     }
//   //   };

//   //   loadCollaborators();
//   // }, []); // Empty dependency array - runs once


//   const loadCollaborators = useCallback(async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return;
//       try {
//         // const url = `http://localhost:5000/api/share/collaborators?pageType=board&pageName=${encodeURIComponent(BOARD_NAME)}`;
//         const url = `http://localhost:5000/api/share/collaborators?pageType=board`;
//         const response = await fetch(url, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (response.ok) {
//           const data = await response.json();
//           setCollaborators(data.collaborators || []);
//         }
//       } catch (err) {
//         console.error("Failed to load collaborators", err);
//       }
//     }, []);

//      //  User and Collaborator  Load 
//       useEffect(() => {
//         const storedUser = localStorage.getItem("user");
//         if (storedUser) {
//           try {
//             const parsedUser = JSON.parse(storedUser);
//             setUser(parsedUser);
//           } catch (e) {
//             console.error("Failed to parse user from localStorage", e);
//           }
//         }
//         loadCollaborators();
//       }, [loadCollaborators]);

  

//   const handleRowClick = (id: any) => {
//     navigate(`/note-form/detail/${id}`);
//   };

//   // ============ FIX: Handle drag end with useCallback ============
//   const handleOnDragEnd = useCallback(async (result: DropResult) => {
//     const { source, destination, draggableId } = result;
    
//     if (!destination) return;
//     if (
//       source.droppableId === destination.droppableId &&
//       source.index === destination.index
//     ) {
//       return;
//     }

//     if (isUpdatingRef.current) return;
//     isUpdatingRef.current = true;

//     try {
//       const movedNote = categoryTasks.find((c) => (c._id || c.id) === draggableId);
//       if (!movedNote) {
//         isUpdatingRef.current = false;
//         return;
//       }

//       const updatedTasksList = Array.from(categoryTasks);

//       // Remove from source
//       const sourceNotesInColumn = updatedTasksList.filter(
//         (c) => (c.category || "My Note") === source.droppableId
//       );
//       const targetNote = sourceNotesInColumn[source.index];
//       const globalSourceIndex = updatedTasksList.indexOf(targetNote);
//       if (globalSourceIndex !== -1) {
//         updatedTasksList.splice(globalSourceIndex, 1);
//       }

//       // Update category
//       const updatedMovedNote = { ...targetNote, category: destination.droppableId };

//       // Insert at destination
//       const destNotesInColumn = updatedTasksList.filter(
//         (t) => (t.category || "My Note") === destination.droppableId
//       );

//       let globalDestIndex = updatedTasksList.length;
//       if (destination.index < destNotesInColumn.length) {
//         const nextNote = destNotesInColumn[destination.index];
//         globalDestIndex = updatedTasksList.indexOf(nextNote);
//       } else if (destNotesInColumn.length > 0) {
//         const lastNote = destNotesInColumn[destNotesInColumn.length - 1];
//         globalDestIndex = updatedTasksList.indexOf(lastNote) + 1;
//       }

//       updatedTasksList.splice(globalDestIndex, 0, updatedMovedNote);
//       setCategoryTasks(updatedTasksList);

//       // Update backend
//       const noteId = targetNote._id || targetNote.id;
//       if (noteId) {
//         await updatedNote({
//           id: noteId,
//           body: { category: destination.droppableId },
//         }).unwrap();
//         // Refetch to sync
//         refetch();
//       }
//     } catch (err) {
//       console.error("Failed to update note category:", err);
//       setCategoryTasks(filteredAndSortedNotes);
//     } finally {
//       isUpdatingRef.current = false;
//     }
//   }, [categoryTasks, updatedNote, refetch, filteredAndSortedNotes]);

//   const getNotesByCategory = (categoryName: string) => {
//     return categoryTasks.filter((note: any) => (note.category || "My Note") === categoryName);
//   };

//   // Share popover handlers
//   const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setShareAnchorEl(event.currentTarget);
//   //    const url = window.location.href;
//   // const categoryMatch = url.match(/\/category\/([^\/?#]+)/);
//   // if (categoryMatch) {
//   //   setCurrentCategoryName(decodeURIComponent(categoryMatch[1]));
//   // }
//   // setIsCategorySelectorOpen(true);
//   };

//   const handleShareClose = () => {
//     setShareAnchorEl(null);
//     // setIsCategorySelectorOpen(false);
//   };

//   const handleOpenPermissionMenu = (
//     event: React.MouseEvent<HTMLButtonElement>,
//     id: string | null,
//     currentRole: string
//   ) => {
//     setPermissionMenuAnchorEl(event.currentTarget);
//     setActiveCollaboratorId(id);
//     setActiveRole(currentRole || "full");
//   };

//   const handleClosePermissionMenu = () => {
//     setPermissionMenuAnchorEl(null);
//     setActiveCollaboratorId(null);
//   };

//    const handleCategoryChange = (event: any) => {
//     setSelectedShareCategory(event.target.value);
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
//         setCollaborators((prev) =>
//           prev.map((person) =>
//             person._id === activeCollaboratorId ? { ...person, role } : person
//           )
//         );
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

//   const isShareOpen = Boolean(shareAnchorEl);

//   //  FIX: Handle search toggle
//   const handleSearchToggle = () => {
//     setSearchOpen((prev) => !prev);
//     if (searchOpen) {
//       setSearchText("");
//     }
//   };

//   //FIX: Handle sort toggle
//   const handleSortToggle = () => {
//     setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
//   };

//   if (isLoading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (isError) {
//     return (
//       <Alert severity="error" sx={{ m: 2 }}>
//         Unable to load categories. Please try again.
//       </Alert>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         bgcolor: "background.default",
//         width: "100%",
//         maxWidth: 1200,
//         mx: "auto",
//         py: 2,
//         px: 2
//       }}
//     >
//       {/* Header Section */}
//       <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center", mb: 2, flexWrap: "wrap" }}>
//         <Button
//           startIcon={<CategoryOutlined />}
//           sx={{
//             textTransform: "none",
//             color: "text.primary",
//             fontSize: "16px",
//             borderRadius: 3,
//             px: 1.5,
//             whiteSpace: 'nowrap',
//             "& .MuiButton-startIcon": { color: "#973aa8" },
//           }}
//         >
//           Category Page
//         </Button>

//         <IconButton
//           size="small"
//           onClick={handleSortToggle}
//           sx={{
//             color: sortOrder === 'desc' ? '#973aa8' : 'text.primary',
//             bgcolor: sortOrder === 'desc' ? 'background.default' : 'transparent',
//             borderRadius: '4px',
//             transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//             '& .MuiSvgIcon-root': {
//               transition: 'transform 0.3s ease',
//               transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)',
//             },
//             '&:hover': {
//               bgcolor: sortOrder === 'desc' ? 'background.default' : 'transparent'
//             }
//           }}
//         >
//           <SwapVertOutlined fontSize="small" />
//         </IconButton>

//         <IconButton
//           size="small"
//           sx={{ color: 'text.primary', mr: searchOpen ? 1 : 0, borderRadius: '4px' }}
//           onClick={handleSearchToggle}
//         >
//           <Search fontSize="small" />
//         </IconButton>

//         {searchOpen && (
//           <TextField
//             size="small"
//             autoFocus
//             placeholder="Search by category, status, or priority..."
//             value={searchText}
//             onChange={(event) => setSearchText(event.target.value)}
//             sx={{
//               width: 180,
//               '& .MuiOutlinedInput-root': {
//                 height: 30,
//                 fontSize: '0.85rem',
//                 bgcolor: 'background.default',
//                 borderRadius: '4px',
//               },
//               '& .MuiOutlinedInput-input': {
//                 py: 0.5,
//                 px: 1,
//               },
//             }}
//           />
//         )}

//          <Button
//           startIcon={<Share />}
//           onClick={handleShareClick}
//           sx={{
//             color: 'text.primary',
//             bgcolor: isShareOpen ? 'action.selected' : 'background.default',
//             borderRadius: '4px',
//             textTransform: 'none',
//             transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//             '&:hover': {
//               bgcolor: 'action.hover'
//             }
//           }}
//         >
//           Share
//         </Button> 
//       </Stack>

//       {/* Share Popover */}
//       <Popover
//         open={isShareOpen}
//         anchorEl={shareAnchorEl}
//         onClose={handleShareClose}
//         anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//         transformOrigin={{ vertical: "top", horizontal: "left" }}
//         slotProps={{
//           paper: {
//             sx: {
//               width: 420,
//               p: 2.5,
//               mt: 1,
//               borderRadius: 3,
//               boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
//               bgcolor: 'background.paper',
//               color: 'text.primary'
//             }
//           }
//         }}
//       >
//       {/* <Box sx={{ mb: 2 }}>
//       <FormControl fullWidth size="small">
//         <InputLabel>Select Category to Share</InputLabel>
//         <Select
//           value={selectedShareCategory}
//           label="Select Category to Share"
//           onChange={handleCategoryChange}
//         >
//           {COLUMNS.map((col) => (
//             <MenuItem key={col.id} value={col.id}>
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                 <Box
//                   sx={{
//                     idth: 12,
//                     height: 12,
//                     borderRadius: "50%",
//                     bgcolor: col.color,
//                   }}
//                 />
//                 {col.label}
//               </Box>
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//     </Box> */}
//         <ShareCategoryPage
//           user={user}
//           collaborators={collaborators}
//           setCollaborators={setCollaborators}
//           handleOpenPermissionMenu={handleOpenPermissionMenu}
//           getRoleLabel={getRoleLabel}
//           userPermission={userPermission}
//           categoryName = "all"
//         />
//       </Popover>

//       {/* Permission Menu */}
//       <Menu
//         anchorEl={permissionMenuAnchorEl}
//         open={Boolean(permissionMenuAnchorEl)}
//         onClose={handleClosePermissionMenu}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         transformOrigin={{ vertical: "top", horizontal: "right" }}
//         slotProps={{ paper: { sx: { width: 340, borderRadius: 3, p: 0.5, boxShadow: "0px 4px 16px rgba(0,0,0,0.12)" } } }}
//       >
//         {/* <MenuItem onClick={() => handlePermissionChange("full")} sx={{ py: 1 }}>
//           <ListItemText
//             primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Full access</Typography>}
//             secondary={<Typography variant="caption" color="text.secondary">Edit, suggest, comment, and share</Typography>}
//           />
//           {activeRole === "full" && <Check sx={{ fontSize: 16, ml: 1 }} />}
//         </MenuItem> */}

//         {/* <MenuItem onClick={() => handlePermissionChange("editor")} sx={{ py: 1 }}>
//           <ListItemText
//             primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can edit</Typography>}
//             secondary={<Typography variant="caption" color="text.secondary">Edit, suggest, and comment</Typography>}
//           />
//           {activeRole === "editor" && <Check sx={{ fontSize: 16, ml: 1 }} />}
//         </MenuItem> */}

//         {/* <MenuItem onClick={() => handlePermissionChange("commenter")} sx={{ py: 1 }}>
//           <ListItemText
//             primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can comment</Typography>}
//             secondary={<Typography variant="caption" color="text.secondary">Suggest and comment</Typography>}
//           />
//           {activeRole === "commenter" && <Check sx={{ fontSize: 16, ml: 1 }} />}
//         </MenuItem> */}

//         <MenuItem onClick={() => handlePermissionChange("viewer")} sx={{ py: 1 }}>
//           <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can view</Typography>} />
//           {activeRole === "viewer" && <Check sx={{ fontSize: 16, ml: 1 }} />}
//         </MenuItem>

//         {activeCollaboratorId && (
//           <>
//             <Box sx={{ my: 0.5, borderTop: "1px solid #f0f0f0" }} />
//             <MenuItem onClick={handleRemoveCollaborator} sx={{ py: 1, color: "error.main" }}>
//               <ListItemIcon sx={{ color: "error.main", minWidth: 30 }}>
//                 <DeleteOutlined sx={{ fontSize: 18 }} />
//               </ListItemIcon>
//               <Typography variant="body2" sx={{ fontWeight: 500 }}>Remove</Typography>
//             </MenuItem>
//           </>
//         )}
//       </Menu>

//       {/* Drag and Drop Board */}
//       <DragDropContext onDragEnd={handleOnDragEnd}>
//         <Grid container spacing={{ xs: 2, sm: 3 }}>
//           {COLUMNS.map((column) => {
//             const columnId = column.id;
//             const color = column.color;
//             const notesInColumn = getNotesByCategory(columnId);

//             return (
//               <Grid size={{ xs: 12, md: 6, lg: 4 }} key={columnId}>
//                 <Droppable droppableId={columnId}>
//                   {(provided) => (
//                     <Card
//                       ref={provided.innerRef}
//                       {...provided.droppableProps}
//                       sx={{
//                         borderRadius: 3,
//                         boxShadow: 3,
//                         height: "100%",
//                         minHeight: "200px",
//                         borderTop: `5px solid ${color}`,
//                         bgcolor: "background.default",
//                       }}
//                     >
//                       <CardContent>
//                         <Typography
//                           variant="h6"
//                           sx={{ fontSize: "18px", color: color, fontWeight: "bold", mb: 2 }}
//                         >
//                           {column.label} ({notesInColumn.length})
//                         </Typography>

//                         <Stack spacing={1.5}>
//                           {notesInColumn.map((note: Note, index: number) => {
//                             const noteId = note._id || note.id || String(index);

//                             return (
//                               <Draggable key={noteId} draggableId={noteId} index={index} isDragDisabled={isViewOnly}>
//                                 {(dragProvided) => (
//                                   <Box
//                                     ref={dragProvided.innerRef}
//                                     {...dragProvided.draggableProps}
//                                     {...dragProvided.dragHandleProps}
//                                     onClick={() => {
//                                       if(isViewOnly) {
//                                         navigate(`/note-form/detail/${note.id || note.id}`);
//                                       }else{
//                                         handleRowClick(note._id || note.id);
//                                       }
//                                     }}
//                                     sx={{
//                                       p: 1.5,
//                                       bgcolor: "background.default",
//                                       borderRadius: 2,
//                                       boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
//                                       borderLeft: `4px solid ${color}`,
//                                       cursor: 'pointer',
//                                       transition: "0.2s",
//                                       "&:hover": {
//                                         transform: "translateY(-2px)",
//                                         boxShadow: 2
//                                       },
//                                     }}
//                                   >
//                                     <Typography sx={{ fontSize: "16px", color: "text.primary", fontWeight: "500" }}>
//                                       {note.title || "No Title"}
//                                     </Typography>

//                                     <Typography
//                                       variant="body2"
//                                       color="textSecondary"
//                                       sx={{
//                                         display: "-webkit-box",
//                                         WebkitLineClamp: 3,
//                                         WebkitBoxOrient: "vertical",
//                                         overflow: "hidden",
//                                         textOverflow: "ellipsis",
//                                         mt: 0.5,
//                                         color:"text.primary"
//                                       }}
//                                     >
//                                       {note.content || note.description || "No Content"}
//                                     </Typography>

//                                     <Link
//                                       component="button"
//                                       variant="body2"
//                                       underline="always"
//                                       sx={{ mt: 1, color: "#973aa8", fontSize: "14px" }}
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleRowClick(note._id || note.id);
//                                       }}
//                                     >
//                                       Open notes
//                                     </Link>

//                                     {/* ============ FIX: Display owner info ============ */}
//                                     <Typography
//                                       variant="caption"
//                                       sx={{
//                                         mt: 1,
//                                         color: "text.primary",
//                                         fontWeight: "500",
//                                         display: "block",
//                                       }}
//                                     >
//                                       Created By: {getCreatorName(note)}
//                                       {/* {(() => {
//                                         // If user is populated from backend
//                                         if (note.user && typeof note.user === 'object') {
//                                           const u = note.user as any;
//                                           if (u.firstName) return `${u.firstName} ${u.lastName || ''}`.trim();
//                                         } */}

//                                         {/* // If current user is the owner
//                                         const userId = (user as any)?._id;
//                                         const noteUserId = typeof note.user === 'string' ? note.user : (note.user as any)?._id;
                                        
//                                         if (userId && noteUserId === userId) {
//                                           return `${user?.firstName || 'You'} ${user?.lastName || ''}`.trim() || 'You';
//                                         }

//                                         // Fallback to assignee or unknown
//                                         return note.assignee || 'Unknown User';
//                                       })()} */}
//                                     </Typography>
//                                   </Box>
//                                 )}
//                               </Draggable>
//                             );
//                           })}
//                           {provided.placeholder}
//                         </Stack>
//                       </CardContent>
//                     </Card>
//                   )}
//                 </Droppable>
//               </Grid>
//             );
//           })}
//         </Grid>
//       </DragDropContext>
//     </Box>
//   );
// };

import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Link,
  Stack,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Popover,
  Alert,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  SwapVertOutlined,
  Search,
  CategoryOutlined,
  Share,
  DeleteOutlined,
  Check,
} from "@mui/icons-material";
import { useGetNotesQuery, useUpdateNoteMutation } from "../../services/noteApi";
import { useGetTasksQuery } from "../../services/taskApi";
import { useNavigate } from "react-router-dom";
import type { Note } from "../../types/Note";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { ShareCategoryPage } from "../sharepages/ShareCategoryPage";

// ---------- Types ----------
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
  _id?: string;
}

type CategoryConfig = {
  id: string;
  label: string;
  color: string;
};

const COLUMNS: CategoryConfig[] = [
  { id: "Family & Friends", label: "Family & Friends", color: "#f49cbb" },
  { id: "Fitness & Health", label: "Fitness & Health", color: "#457b9d" },
  { id: "Study", label: "Study", color: "#31572c" },
  { id: "My Note", label: "My Note", color: "#3e5c76" },
  { id: "Company Note", label: "Company Note", color: "#772e25" },
];

export const CategoriesPage = () => {
  // ---------- UI state ----------
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();

  // ---------- Task filter (only) ----------
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  // ---------- RTK Query hooks ----------
  const {
    data: notes = [],
    isLoading,
    isError,
    refetch,
  } = useGetNotesQuery({
    shareScope: "category",
    populate: "user firstName lastName",
    taskId: selectedTaskId || undefined, // filter by task only
  });

  // Get ALL tasks (no project filter)
  const { data: tasks = [] } = useGetTasksQuery({}); // empty = all tasks

  const [updateNote] = useUpdateNoteMutation();

  // ---------- Local state for drag & drop ----------
  const [categoryTasks, setCategoryTasks] = useState<Note[]>([]);
  const isUpdatingRef = useRef(false);
  const previousNotesRef = useRef<Note[]>([]);

  // ---------- User & collaborators for sharing ----------
  const [user, setUser] = useState<UserProfile | null>(null);
  const [collaborators, setCollaborators] = useState<CollaboratorItem[]>([]);
  const [shareAnchorEl, setShareAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [permissionMenuAnchorEl, setPermissionMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [activeCollaboratorId, setActiveCollaboratorId] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<string>("full");
  const [userPermission, setUserPermission] = useState<"owner" | "full" | "viewer">("owner");
  const [isViewOnly, setIsViewOnly] = useState(false);

  // Users map for creator name lookup
  const [usersMap, setUsersMap] = useState<Record<string, { firstName: string; lastName: string }>>(
    {}
  );

  // ---------- Filtering & sorting ----------
  const filteredAndSortedNotes = useMemo(() => {
    if (!Array.isArray(notes)) return [];

    let result = [...notes];
    const searchLower = searchText.trim().toLowerCase();

    if (searchLower !== "") {
      const statusKeywords = ["todo", "in progress", "complete", "not started"];
      const matchedStatus = statusKeywords.find((keyword) => keyword === searchLower);
      let statusFilter: string | null = null;

      if (matchedStatus) {
        if (matchedStatus === "todo") statusFilter = "Todo";
        else if (matchedStatus === "in progress") statusFilter = "In Progress";
        else if (matchedStatus === "complete") statusFilter = "Complete";
        else if (matchedStatus === "not started") statusFilter = "Not Started";
      }

      result = result.filter((note: Note) => {
        if (statusFilter !== null) {
          const currentStatus = (note.task || note.category || "").trim().toLowerCase();
          return currentStatus === statusFilter.toLowerCase();
        }

        const currentCategory = (note.category || "").trim().toLowerCase();
        const currentAssignee = (note.assignee || "").trim().toLowerCase();
        const currentPriority = (note.priority || "").trim().toLowerCase();
        const titleText = (note.title || "").toLowerCase();
        const contentText = (note.content || note.description || "").toLowerCase();

        return (
          currentCategory.includes(searchLower) ||
          currentAssignee.includes(searchLower) ||
          currentPriority.includes(searchLower) ||
          titleText.includes(searchLower) ||
          contentText.includes(searchLower)
        );
      });
    }

    result.sort((a, b) => {
      const titleA = (a.title || "").toLowerCase();
      const titleB = (b.title || "").toLowerCase();
      return sortOrder === "asc" ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
    });

    return result;
  }, [notes, searchText, sortOrder]);

  // Sync local tasks when filtered data changes
  useEffect(() => {
    const currentData = JSON.stringify(filteredAndSortedNotes);
    const previousData = JSON.stringify(previousNotesRef.current);

    if (currentData !== previousData) {
      previousNotesRef.current = filteredAndSortedNotes;
      setCategoryTasks(filteredAndSortedNotes);
    }
  }, [filteredAndSortedNotes]);

  // ---------- Load users for creator name ----------
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const users = await res.json();
          const map: Record<string, { firstName: string; lastName: string }> = {};
          users.forEach((u: any) => {
            map[u._id] = { firstName: u.firstName, lastName: u.lastName || "" };
          });
          setUsersMap(map);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  // ---------- Get creator name helper ----------
  const getCreatorName = useCallback(
    (note: Note): string => {
      if (note.user && typeof note.user === "object") {
        const u = note.user as any;
        if (u.firstName) return `${u.firstName} ${u.lastName || ""}`.trim();
      }
      if (typeof note.user === "string") {
        const userObj = usersMap[note.user];
        if (userObj) {
          return `${userObj.firstName} ${userObj.lastName}`.trim();
        }
      }
      const userId = (user as any)?._id;
      const noteUserId = typeof note.user === "string" ? note.user : (note.user as any)?._id;
      if (userId && noteUserId === userId) {
        return `${user?.firstName || "You"} ${user?.lastName || ""}`.trim() || "You";
      }
      return note.assignee || "Unknown User";
    },
    [usersMap, user]
  );

  // ---------- Helper to get task title from ID or object ----------
  const getTaskTitle = useCallback(
    (note: Note): string => {
      if (!note.task) return "";
      if (typeof note.task === "object" && note.task.title) {
        return note.task.title;
      }
      if (typeof note.task === "string") {
        const found = tasks.find((t: any) => t._id === note.task);
        return found ? found.title : note.task;
      }
      return "";
    },
    [tasks]
  );

  // ---------- Load collaborators and user permission ----------
  const loadCollaboratorsAndPermission = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const collabRes = await fetch("http://localhost:5000/api/share/collaborators?pageType=board", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (collabRes.ok) {
        const data = await collabRes.json();
        setCollaborators(data.collaborators || []);
      }

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (err) {
      console.error("Failed to load collaborators", err);
    }
  }, []);

  useEffect(() => {
    loadCollaboratorsAndPermission();
  }, [loadCollaboratorsAndPermission]);

  useEffect(() => {
    if (notes.length > 0 && user) {
      const userId = (user as any)._id;
      const isOwner = notes.some((note: any) => {
        const noteUserId = typeof note.user === "string" ? note.user : note.user?._id;
        return noteUserId === userId;
      });
      const permission = isOwner ? "owner" : "viewer";
      setUserPermission(permission);
      setIsViewOnly(permission === "viewer");
    }
  }, [notes, user]);

  // ---------- Drag & drop handler ----------
  const handleOnDragEnd = useCallback(
    async (result: DropResult) => {
      const { source, destination, draggableId } = result;

      if (!destination) return;
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }

      if (isUpdatingRef.current) return;
      isUpdatingRef.current = true;

      try {
        const movedNote = categoryTasks.find((c) => (c._id || c.id) === draggableId);
        if (!movedNote) {
          isUpdatingRef.current = false;
          return;
        }

        const updatedTasksList = Array.from(categoryTasks);
        const sourceNotesInColumn = updatedTasksList.filter(
          (c) => (c.category || "My Note") === source.droppableId
        );
        const targetNote = sourceNotesInColumn[source.index];
        const globalSourceIndex = updatedTasksList.indexOf(targetNote);
        if (globalSourceIndex !== -1) {
          updatedTasksList.splice(globalSourceIndex, 1);
        }

        const updatedMovedNote = { ...targetNote, category: destination.droppableId };

        const destNotesInColumn = updatedTasksList.filter(
          (t) => (t.category || "My Note") === destination.droppableId
        );

        let globalDestIndex = updatedTasksList.length;
        if (destination.index < destNotesInColumn.length) {
          const nextNote = destNotesInColumn[destination.index];
          globalDestIndex = updatedTasksList.indexOf(nextNote);
        } else if (destNotesInColumn.length > 0) {
          const lastNote = destNotesInColumn[destNotesInColumn.length - 1];
          globalDestIndex = updatedTasksList.indexOf(lastNote) + 1;
        }

        updatedTasksList.splice(globalDestIndex, 0, updatedMovedNote);
        setCategoryTasks(updatedTasksList);

        const noteId = targetNote._id || targetNote.id;
        if (noteId) {
          await updateNote({
            id: noteId,
            body: { category: destination.droppableId },
          }).unwrap();
          refetch();
        }
      } catch (err) {
        console.error("Failed to update note category:", err);
        setCategoryTasks(filteredAndSortedNotes);
      } finally {
        isUpdatingRef.current = false;
      }
    },
    [categoryTasks, updateNote, refetch, filteredAndSortedNotes]
  );

  // ---------- Helpers for categories ----------
  const getNotesByCategory = (categoryName: string) => {
    return categoryTasks.filter((note: any) => (note.category || "My Note") === categoryName);
  };

  // ---------- Share handlers ----------
  const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShareAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setShareAnchorEl(null);
  };

  const handleOpenPermissionMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string | null,
    currentRole: string
  ) => {
    setPermissionMenuAnchorEl(event.currentTarget);
    setActiveCollaboratorId(id);
    setActiveRole(currentRole || "full");
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
      const response = await fetch(
        `http://localhost:5000/api/share/${activeCollaboratorId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify({ role }),
        }
      );
      if (response.ok) {
        setCollaborators((prev) =>
          prev.map((person) =>
            person._id === activeCollaboratorId ? { ...person, role } : person
          )
        );
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
      const response = await fetch(
        `http://localhost:5000/api/share/${activeCollaboratorId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
        }
      );
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
    if (role === "full") return "Full access";
    if (role === "editor") return "Can edit";
    if (role === "commenter") return "Can comment";
    return "Can view";
  };

  const isShareOpen = Boolean(shareAnchorEl);

  const handleSearchToggle = () => {
    setSearchOpen((prev) => !prev);
    if (searchOpen) {
      setSearchText("");
    }
  };

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // ---------- Loading / Error states ----------
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Unable to load categories. Please try again.
      </Alert>
    );
  }

  // ---------- Render ----------
  return (
    <Box
      sx={{
        bgcolor: "background.default",
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
        py: 2,
        px: 2,
      }}
    >
      {/* Header Section */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <Button
          startIcon={<CategoryOutlined />}
          sx={{
            textTransform: "none",
            color: "text.primary",
            fontSize: "16px",
            borderRadius: 3,
            px: 1.5,
            whiteSpace: "nowrap",
            "& .MuiButton-startIcon": { color: "#973aa8" },
          }}
        >
          Category Page
        </Button>

        <IconButton
          size="small"
          onClick={handleSortToggle}
          sx={{
            color: sortOrder === "desc" ? "#973aa8" : "text.primary",
            bgcolor: sortOrder === "desc" ? "background.default" : "transparent",
            borderRadius: "4px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "& .MuiSvgIcon-root": {
              transition: "transform 0.3s ease",
              transform: sortOrder === "desc" ? "rotate(180deg)" : "rotate(0deg)",
            },
            "&:hover": {
              bgcolor: sortOrder === "desc" ? "background.default" : "transparent",
            },
          }}
        >
          <SwapVertOutlined fontSize="small" />
        </IconButton>

        <IconButton
          size="small"
          sx={{ color: "text.primary", mr: searchOpen ? 1 : 0, borderRadius: "4px" }}
          onClick={handleSearchToggle}
        >
          <Search fontSize="small" />
        </IconButton>

        {searchOpen && (
          <TextField
            size="small"
            autoFocus
            placeholder="Search by category, status, or priority..."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            sx={{
              width: 180,
              "& .MuiOutlinedInput-root": {
                height: 30,
                fontSize: "0.85rem",
                bgcolor: "background.default",
                borderRadius: "4px",
              },
              "& .MuiOutlinedInput-input": {
                py: 0.5,
                px: 1,
              },
            }}
          />
        )}

        {/* ---------- TASK DROPDOWN (only) ---------- */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Task</InputLabel>
          <Select
            value={selectedTaskId}
            label="Task"
            onChange={(e) => setSelectedTaskId(e.target.value)}
          >
            <MenuItem value="">All Tasks</MenuItem>
            {tasks.map((tsk: any) => (
              <MenuItem key={tsk._id} value={tsk._id}>
                {tsk.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          startIcon={<Share />}
          onClick={handleShareClick}
          sx={{
            color: "text.primary",
            bgcolor: isShareOpen ? "action.selected" : "background.default",
            borderRadius: "4px",
            textTransform: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          Share
        </Button>
      </Stack>

      {/* Share Popover */}
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
              bgcolor: "background.paper",
              color: "text.primary",
            },
          },
        }}
      >
        <ShareCategoryPage
          user={user}
          collaborators={collaborators}
          setCollaborators={setCollaborators}
          handleOpenPermissionMenu={handleOpenPermissionMenu}
          getRoleLabel={getRoleLabel}
          userPermission={userPermission}
          categoryName="all"
        />
      </Popover>

      {/* Permission Menu */}
      <Menu
        anchorEl={permissionMenuAnchorEl}
        open={Boolean(permissionMenuAnchorEl)}
        onClose={handleClosePermissionMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              width: 340,
              borderRadius: 3,
              p: 0.5,
              boxShadow: "0px 4px 16px rgba(0,0,0,0.12)",
            },
          },
        }}
      >
        <MenuItem onClick={() => handlePermissionChange("viewer")} sx={{ py: 1 }}>
          <ListItemText
            primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can view</Typography>}
          />
          {activeRole === "viewer" && <Check sx={{ fontSize: 16, ml: 1 }} />}
        </MenuItem>

        {activeCollaboratorId && (
          <>
            <Box sx={{ my: 0.5, borderTop: "1px solid #f0f0f0" }} />
            <MenuItem onClick={handleRemoveCollaborator} sx={{ py: 1, color: "error.main" }}>
              <ListItemIcon sx={{ color: "error.main", minWidth: 30 }}>
                <DeleteOutlined sx={{ fontSize: 18 }} />
              </ListItemIcon>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>Remove</Typography>
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Drag and Drop Board */}
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {COLUMNS.map((column) => {
            const columnId = column.id;
            const color = column.color;
            const notesInColumn = getNotesByCategory(columnId);

            return (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={columnId}>
                <Droppable droppableId={columnId}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        borderRadius: 3,
                        boxShadow: 3,
                        height: "100%",
                        minHeight: "200px",
                        borderTop: `5px solid ${color}`,
                        bgcolor: "background.default",
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{ fontSize: "18px", color: color, fontWeight: "bold", mb: 2 }}
                        >
                          {column.label} ({notesInColumn.length})
                        </Typography>

                        <Stack spacing={1.5}>
                          {notesInColumn.map((note: Note, index: number) => {
                            const noteId = note._id || note.id || String(index);

                            return (
                              <Draggable
                                key={noteId}
                                draggableId={noteId}
                                index={index}
                                isDragDisabled={isViewOnly}
                              >
                                {(dragProvided) => (
                                  <Box
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    {...dragProvided.dragHandleProps}
                                    onClick={() => {
                                      navigate(`/note-form/detail/${note._id || note.id}`);
                                    }}
                                    sx={{
                                      p: 1.5,
                                      bgcolor: "background.default",
                                      borderRadius: 2,
                                      boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
                                      borderLeft: `4px solid ${color}`,
                                      cursor: "pointer",
                                      transition: "0.2s",
                                      "&:hover": {
                                        transform: "translateY(-2px)",
                                        boxShadow: 2,
                                      },
                                    }}
                                  >
                                    <Typography
                                      sx={{ fontSize: "16px", color: "text.primary", fontWeight: "500" }}
                                    >
                                      {note.title || "No Title"}
                                    </Typography>

                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                      sx={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        mt: 0.5,
                                        color: "text.primary",
                                      }}
                                    >
                                      {note.content || note.description || "No Content"}
                                    </Typography>

                                    {/* ---------- Display Task only ---------- */}
                                    {note.task && (
                                      <Typography
                                        variant="caption"
                                        sx={{ color: "text.secondary", display: "block" }}
                                      >
                                        Task: {getTaskTitle(note)}
                                      </Typography>
                                    )}

                                    <Link
                                      component="button"
                                      variant="body2"
                                      underline="always"
                                      sx={{ mt: 1, color: "#973aa8", fontSize: "14px" }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/note-form/detail/${note._id || note.id}`);
                                      }}
                                    >
                                      Open notes
                                    </Link>

                                    <Typography
                                      variant="caption"
                                      sx={{
                                        mt: 1,
                                        color: "text.primary",
                                        fontWeight: "500",
                                        display: "block",
                                      }}
                                    >
                                      Created By: {getCreatorName(note)}
                                    </Typography>
                                  </Box>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </Stack>
                      </CardContent>
                    </Card>
                  )}
                </Droppable>
              </Grid>
            );
          })}
        </Grid>
      </DragDropContext>
    </Box>
  );
};