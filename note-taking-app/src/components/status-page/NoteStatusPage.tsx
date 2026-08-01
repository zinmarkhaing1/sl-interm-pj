
// import * as React from "react";
// import { useState, useEffect, useRef, useCallback, useMemo } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   Box,
//   Card,
//   CircularProgress,
//   CardContent,
//   Typography,
//   Paper,
//   Stack,
//   IconButton,
//   TextField,
//   Button,
//   Menu,
//   MenuItem,
//   ListItemText,
//   ListItemIcon,
//   Popover,
//   FormControl,
//   InputLabel,
//   Select,
// } from "@mui/material";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import type { DropResult } from "@hello-pangea/dnd";
// import { useGetTasksQuery, useUpdateTaskMutation } from "../../services/taskApi";
// import { useGetProjectsQuery } from "../../services/projectApi";
// import type { Task } from "../../types/Project";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import {
//   Search,
//   SwapVertOutlined,
//   LineWeightOutlined,
//   Share,
//   Check,
//   DeleteOutlined,
// } from "@mui/icons-material";
// import { ShareStatusPage } from "../sharepages/ShareStatusPage";

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

// type ColumnConfig = {
//   id: string;
//   label: string;
//   color: string;
// };

// const COLUMNS: ColumnConfig[] = [
//   { id: "Todo", label: "Todo", color: "#a3c4f3" },
//   { id: "In Progress", label: "In Progress", color: "#ffadad" },
//   { id: "Complete", label: "Complete", color: "#a3b18a" },
//   { id: "Not Started", label: "Not Started", color: "#588157" },
// ];

// export const NoteStatusPage: React.FC = () => {
//   const [searchOpen, setSearchOpen] = useState<boolean>(false);
//   const [searchText, setSearchText] = useState<string>("");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Project filter 
//   const [selectedProjectId, setSelectedProjectId] = useState<string>(() =>
//     new URLSearchParams(location.search).get("project") || "",
//   );

//   // ---- Fetch projects ----
//   const { data: projects = [], isLoading: projectsLoading } = useGetProjectsQuery();

//   // ---- Detect shared view ----
//   const isShared = new URLSearchParams(location.search).get('shared') === 'true';

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const projectParam = params.get("project") || "";
//     setSelectedProjectId(projectParam);
//   }, [location.search]);

//   // ---- Fetch tasks with shareScope if shared ----
//   const {
//     data: fetchedTasks = [],
//     isLoading: tasksLoading,
//     isError: tasksError,
//     refetch,
//   } = useGetTasksQuery({
//     projectId: selectedProjectId || undefined,
//     shareScope: isShared ? 'board' : undefined,
//   });

//   const [updateTask] = useUpdateTaskMutation();

//   // Local state for drag & drop 
//   const isUpdatingRef = useRef(false);
//   const previousTasksRef = useRef<Task[]>([]);

//   // User & collaborators (sharing) 
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [collaborators, setCollaborators] = useState<CollaboratorItem[]>([]);
//   const [shareAnchorEl, setShareAnchorEl] = useState<HTMLButtonElement | null>(null);
//   const [permissionMenuAnchorEl, setPermissionMenuAnchorEl] = useState<HTMLElement | null>(null);
//   const [activeCollaboratorId, setActiveCollaboratorId] = useState<string | null>(null);
//   const [activeRole, setActiveRole] = useState<string>("full");

//   // Map user IDs to names (for assignee display)
//   const [usersMap, setUsersMap] = useState<Record<string, { firstName: string; lastName: string }>>({});

//   // Fetch users for assignee names
//   useEffect(() => {
//     const fetchUsers = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return;
//       try {
//         const res = await fetch("http://localhost:5000/api/users", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (res.ok) {
//           const users = await res.json();
//           const map: Record<string, { firstName: string; lastName: string }> = {};
//           users.forEach((u: any) => {
//             map[u._id] = { firstName: u.firstName, lastName: u.lastName || "" };
//           });
//           setUsersMap(map);
//         }
//       } catch (err) {
//         console.error("Failed to fetch users", err);
//       }
//     };
//     fetchUsers();
//   }, []);

//   // ---- Compute selectedProject from projects ----
//   const selectedProject = useMemo(
//     () => projects.find((project) => project._id === selectedProjectId),
//     [projects, selectedProjectId],
//   );

//   // ---- Share page info ----
//   const sharePageName = selectedProject?.name || "All Projects";
//   const sharePageUrl = selectedProjectId
//     ? `${window.location.origin}/board?project=${encodeURIComponent(selectedProjectId)}&shared=true`
//     : `${window.location.origin}/board?shared=true`;

//   // ---- Get assignee name ----
//   const getAssigneeName = useCallback(
//     (task: Task): string => {
//       if (task.assignee && typeof task.assignee === "object") {
//         const u = task.assignee as any;
//         if (u.firstName) return `${u.firstName} ${u.lastName || ""}`.trim();
//       }
//       if (typeof task.assignee === "string") {
//         const userObj = usersMap[task.assignee];
//         if (userObj) {
//           return `${userObj.firstName} ${userObj.lastName}`.trim();
//         }
//       }
//       const userId = (user as any)?._id;
//       if (userId && task.assignee === userId) {
//         return `${user?.firstName || "You"} ${user?.lastName || ""}`.trim() || "You";
//       }
//       return "Unknown";
//     },
//     [usersMap, user]
//   );

//   // ---- Filtering & sorting ----
//   const filteredAndSortedTasks = useMemo(() => {
//     if (!Array.isArray(fetchedTasks)) return [];

//     let result = [...fetchedTasks];
//     const searchLower = searchText.trim().toLowerCase();

//     if (searchLower !== "") {
//       const statusKeywords = ["todo", "in progress", "complete", "not started"];
//       const matchedStatus = statusKeywords.find((keyword) => keyword === searchLower);
//       let statusFilter: string | null = null;

//       if (matchedStatus) {
//         if (matchedStatus === "todo") statusFilter = "Todo";
//         else if (matchedStatus === "in progress") statusFilter = "In Progress";
//         else if (matchedStatus === "complete") statusFilter = "Complete";
//         else if (matchedStatus === "not started") statusFilter = "Not Started";
//       }

//       result = result.filter((task: Task) => {
//         if (statusFilter !== null) {
//           const currentStatus = (task.status || "").trim().toLowerCase();
//           return currentStatus === statusFilter.toLowerCase();
//         }

//         const currentAssignee = (task.assignee || "").toString().toLowerCase();
//         const currentPriority = (task.priority || "").trim().toLowerCase();
//         const titleText = (task.title || "").toLowerCase();
//         const contentText = (task.description || "").toLowerCase();

//         return (
//           currentAssignee.includes(searchLower) ||
//           currentPriority.includes(searchLower) ||
//           titleText.includes(searchLower) ||
//           contentText.includes(searchLower)
//         );
//       });
//     }

//     result.sort((a, b) => {
//       const titleA = (a.title || "").toLowerCase();
//       const titleB = (b.title || "").toLowerCase();
//       return sortOrder === "asc" ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
//     });

//     return result;
//   }, [fetchedTasks, searchText, sortOrder]);

//   // Sync local tasks when filtered data changes
//   useEffect(() => {
//     const currentData = JSON.stringify(filteredAndSortedTasks);
//     const previousData = JSON.stringify(previousTasksRef.current);
//     if (currentData !== previousData) {
//       previousTasksRef.current = filteredAndSortedTasks;
//       setTasks(filteredAndSortedTasks);
//     }
//   }, [filteredAndSortedTasks]);

//   // ---- Load collaborators ----
//   const loadCollaborators = useCallback(async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;
//     try {
//       const params = new URLSearchParams({
//         pageType: "board",
//         pageName: sharePageName, // "All Projects" if none selected
//       });
//       const url = `http://localhost:5000/api/share/collaborators?${params.toString()}`;
//       const response = await fetch(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setCollaborators(data.collaborators || []);
//       }
//     } catch (err) {
//       console.error("Failed to load collaborators", err);
//     }
//   }, [sharePageName]);

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
//     loadCollaborators();
//   }, [loadCollaborators]);

//   // ---------- Drag & Drop handler ----------
//   const handleOnDragEnd = useCallback(
//     async (result: DropResult) => {
//       const { source, destination, draggableId } = result;

//       if (!destination) return;
//       if (
//         source.droppableId === destination.droppableId &&
//         source.index === destination.index
//       ) {
//         return;
//       }

//       if (isUpdatingRef.current) return;
//       isUpdatingRef.current = true;

//       try {
//         const movedTask = tasks.find((t) => t._id === draggableId);
//         if (!movedTask) {
//           isUpdatingRef.current = false;
//           return;
//         }

//         const updatedTasks = Array.from(tasks);
//         const sourceTasksInColumn = updatedTasks.filter(
//           (t) => (t.status || "Todo") === source.droppableId
//         );
//         const targetTask = sourceTasksInColumn[source.index];
//         if (!targetTask) {
//           isUpdatingRef.current = false;
//           return;
//         }
//         const globalSourceIndex = updatedTasks.indexOf(targetTask);
//         if (globalSourceIndex !== -1) {
//           updatedTasks.splice(globalSourceIndex, 1);
//         }

//         const updatedMovedTask = { ...targetTask, status: destination.droppableId as Task["status"] };

//         const destTasksInColumn = updatedTasks.filter(
//           (t) => (t.status || "Todo") === destination.droppableId
//         );

//         let globalDestIndex = updatedTasks.length;
//         if (destination.index < destTasksInColumn.length) {
//           const nextTask = destTasksInColumn[destination.index];
//           globalDestIndex = updatedTasks.indexOf(nextTask);
//         } else if (destTasksInColumn.length > 0) {
//           const lastTask = destTasksInColumn[destTasksInColumn.length - 1];
//           globalDestIndex = updatedTasks.indexOf(lastTask) + 1;
//         }

//         updatedTasks.splice(globalDestIndex, 0, updatedMovedTask);
//         setTasks(updatedTasks);

//         const taskId = targetTask._id;
//         if (taskId) {
//           await updateTask({
//             id: taskId,
//             body: { status: destination.droppableId as Task["status"] },
//           }).unwrap();
//           refetch();
//         }
//       } catch (err) {
//         console.error("Failed to update task status:", err);
//         setTasks(filteredAndSortedTasks);
//       } finally {
//         isUpdatingRef.current = false;
//       }
//     },
//     [tasks, updateTask, refetch, filteredAndSortedTasks]
//   );

//   // ---------- Share Popover Handlers ----------
//   const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setShareAnchorEl(event.currentTarget);
//   };

//   const handleShareClose = () => {
//     setShareAnchorEl(null);
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

//   const handlePermissionChange = async (role: string) => {
//     if (!activeCollaboratorId) {
//       handleClosePermissionMenu();
//       return;
//     }
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/share/${activeCollaboratorId}/role`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
//           },
//           body: JSON.stringify({ role }),
//         }
//       );
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
//       const response = await fetch(
//         `http://localhost:5000/api/share/${activeCollaboratorId}`,
//         {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
//         }
//       );
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

//   const handleRowClick = (id: any) => {
//     navigate(`/task-detail/${id}`);
//   };

//   const handleSearchToggle = () => {
//     setSearchOpen((prev) => !prev);
//     if (searchOpen) {
//       setSearchText("");
//     }
//   };

//   const handleSortToggle = () => {
//     setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
//   };

//   // ---------- Loading / Error ----------
//   if (tasksLoading || projectsLoading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
//         <CircularProgress />
//         <Typography sx={{ ml: 2 }}>Loading tasks...</Typography>
//       </Box>
//     );
//   }

//   if (tasksError) {
//     return (
//       <Typography color="error" sx={{ textAlign: "center", mt: 5 }}>
//         Failed to load tasks.
//       </Typography>
//     );
//   }

//   // ---------- Render ----------
//   return (
//     <Box sx={{ py: 2 }}>
//       {/* Header Section */}
//       <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center", mb: 2, flexWrap: "wrap" }}>
//         <Button
//           startIcon={<LineWeightOutlined />}
//           sx={{
//             textTransform: "none",
//             color: "text.primary",
//             fontSize: "18px",
//             fontWeight: "500",
//             borderRadius: 3,
//             px: 1.5,
//             whiteSpace: "nowrap",
//             "& .MuiButton-startIcon": { color: "#973aa8" },
//           }}
//         >
//           Status Page
//         </Button>

//         <IconButton
//           size="small"
//           onClick={handleSortToggle}
//           sx={{
//             color: sortOrder === "desc" ? "#973aa8" : "text.primary",
//             bgcolor: sortOrder === "desc" ? "background.default" : "transparent",
//             borderRadius: "4px",
//             transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//             "& .MuiSvgIcon-root": {
//               transition: "transform 0.3s ease",
//               transform: sortOrder === "desc" ? "rotate(180deg)" : "rotate(0deg)",
//             },
//             "&:hover": {
//               bgcolor: sortOrder === "desc" ? "background.default" : "transparent",
//             },
//           }}
//         >
//           <SwapVertOutlined fontSize="small" />
//         </IconButton>

//         <IconButton
//           size="small"
//           sx={{ color: "text.primary", mr: searchOpen ? 1 : 0, borderRadius: "4px" }}
//           onClick={handleSearchToggle}
//         >
//           <Search fontSize="small" />
//         </IconButton>

//         {searchOpen && (
//           <TextField
//             size="small"
//             autoFocus
//             placeholder="Search by title, assignee, or priority..."
//             value={searchText}
//             onChange={(event) => setSearchText(event.target.value)}
//             sx={{
//               width: 180,
//               "& .MuiOutlinedInput-root": {
//                 height: 30,
//                 fontSize: "0.85rem",
//                 bgcolor: "background.default",
//                 borderRadius: "4px",
//               },
//               "& .MuiOutlinedInput-input": {
//                 py: 0.5,
//                 px: 1,
//               },
//             }}
//           />
//         )}

//         {/* Project Dropdown */}
//         <FormControl size="small" sx={{ minWidth: 150 }}>
//           <InputLabel>Project</InputLabel>
//           <Select
//             value={selectedProjectId}
//             label="Project"
//             onChange={(e) => {
//               const projectId = e.target.value;
//               const params = new URLSearchParams(location.search);
//               if (projectId) {
//                 params.set("project", projectId);
//               } else {
//                 params.delete("project");
//               }
//               if (isShared) {
//                 params.set("shared", "true");
//               } else {
//                 params.delete("shared");
//               }
//               setSelectedProjectId(projectId);
//               navigate(projectId || isShared ? `/board?${params.toString()}` : "/board", { replace: true });
//             }}
//           >
//             <MenuItem value="">All Projects</MenuItem>
//             {projects.map((proj: any) => (
//               <MenuItem key={proj._id} value={proj._id}>
//                 {proj.name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <Button
//           startIcon={<Share />}
//           onClick={handleShareClick}
//           sx={{
//             color: "text.primary",
//             bgcolor: isShareOpen ? "action.selected" : "background.default",
//             borderRadius: "4px",
//             textTransform: "none",
//             transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//             "&:hover": {
//               bgcolor: "action.hover",
//             },
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
//               bgcolor: "background.paper",
//               color: "text.primary",
//             },
//           },
//         }}
//       >
//         <ShareStatusPage
//           user={user}
//           collaborators={collaborators}
//           setCollaborators={setCollaborators}
//           handleOpenPermissionMenu={handleOpenPermissionMenu}
//           getRoleLabel={getRoleLabel}
//           boardName={sharePageName}
//           pageUrl={sharePageUrl}
//           redirectUrl="/board"
//         />
//       </Popover>

//       {/* Permission Menu */}
//       <Menu
//         anchorEl={permissionMenuAnchorEl}
//         open={Boolean(permissionMenuAnchorEl)}
//         onClose={handleClosePermissionMenu}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         transformOrigin={{ vertical: "top", horizontal: "right" }}
//         slotProps={{
//           paper: {
//             sx: {
//               width: 340,
//               borderRadius: 3,
//               p: 0.5,
//               boxShadow: "0px 4px 16px rgba(0,0,0,0.12)",
//             },
//           },
//         }}
//       >
//         <MenuItem onClick={() => handlePermissionChange("viewer")} sx={{ py: 1 }}>
//           <ListItemText
//             primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can view</Typography>}
//           />
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
//         <Box
//           sx={{
//             display: "grid",
//             gridTemplateColumns: {
//               xs: "1fr",
//               sm: "1fr 1fr",
//               md: "1fr 1fr 1fr 1fr",
//             },
//             gap: 2,
//             alignItems: "start",
//           }}
//         >
//           {COLUMNS.map((column) => {
//             const columnId = column.id;
//             const columnTasks = tasks.filter((t) => (t.status || "Todo") === columnId);

//             return (
//               <Box key={columnId} sx={{ display: "flex", flexDirection: "column" }}>
//                 <Typography
//                   variant="subtitle1"
//                   sx={{
//                     fontWeight: "bold",
//                     mb: 1,
//                     pl: 1,
//                     textTransform: "uppercase",
//                     color: column.color,
//                   }}
//                 >
//                   {column.label} ({columnTasks.length})
//                 </Typography>

//                 <Droppable droppableId={columnId}>
//                   {(provided) => (
//                     <Paper
//                       {...provided.droppableProps}
//                       ref={provided.innerRef}
//                       elevation={0}
//                       sx={{
//                         p: 1,
//                         bgcolor: "background.default",
//                         minHeight: "600px",
//                         borderRadius: 2,
//                         border: `1px solid ${column.color}`,
//                       }}
//                     >
//                       <Stack spacing={2}>
//                         {columnTasks.map((task, index) => {
//                           const taskId = task._id || String(index);

//                           return (
//                             <Draggable key={taskId} draggableId={taskId} index={index}>
//                               {(provided) => (
//                                 <Card
//                                   ref={provided.innerRef}
//                                   {...provided.draggableProps}
//                                   {...provided.dragHandleProps}
//                                   sx={{
//                                     boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
//                                     borderRadius: 2,
//                                     height: "250px",
//                                     borderLeft: `5px solid ${column.color}`,
//                                     "&:hover": {
//                                       boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
//                                     },
//                                   }}
//                                 >
//                                   <CardContent
//                                     sx={{
//                                       p: "10px !important",
//                                       width: "100%",
//                                       height: "100%",
//                                       display: "flex",
//                                       flexDirection: "column",
//                                       justifyContent: "space-between",
//                                       cursor: "pointer",
//                                       bgcolor: "background.default",
//                                     }}
//                                     onClick={() => handleRowClick(task._id)}
//                                   >
//                                     <Box>
//                                       <Typography
//                                         variant="subtitle1"
//                                         sx={{ fontSize: "16px", color: "text.secondary", fontWeight: 500 }}
//                                       >
//                                         {task.title || "No Title"}
//                                       </Typography>

//                                       <Typography
//                                         variant="body2"
//                                         color="textSecondary"
//                                         sx={{
//                                           my: 1,
//                                           display: "-webkit-box",
//                                           WebkitLineClamp: 3,
//                                           WebkitBoxOrient: "vertical",
//                                           overflow: "hidden",
//                                           textOverflow: "ellipsis",
//                                           lineHeight: 1.5,
//                                           color: "text.secondary",
//                                         }}
//                                       >
//                                         {task.description || "No Description"}
//                                       </Typography>

//                                       {task.project && (
//                                         <Typography
//                                           variant="caption"
//                                           sx={{ color: "text.secondary" }}
//                                         >
//                                           Project:{" "}
//                                           {typeof task.project === "string"
//                                             ? task.project
//                                             : task.project.name}
//                                         </Typography>
//                                       )}

//                                       <Typography
//                                         variant="caption"
//                                         sx={{
//                                           color: "text.secondary",
//                                           fontWeight: "500",
//                                           display: "block",
//                                         }}
//                                       >
//                                         Assignee: {getAssigneeName(task)}
//                                       </Typography>
//                                     </Box>

//                                     <Box>
//                                       <Stack direction="row" spacing={1} useFlexGap sx={{ mt: 0.2, flexWrap: "wrap" }}>
//                                         {task.priority && (
//                                           <Typography
//                                             variant="caption"
//                                             sx={{ bgcolor: "background.paper", px: 1, py: 0.5, borderRadius: 1 }}
//                                           >
//                                             Priority: {task.priority}
//                                           </Typography>
//                                         )}
//                                       </Stack>

//                                       {(task.startDate || task.dueDate) && (
//                                         <Stack direction="row" sx={{ mt: 1, alignItems: "center", color: "blue" }}>
//                                           <IconButton size="small" sx={{ color: "blue", p: 0, mr: 0.5 }} disabled>
//                                             <CalendarMonthIcon sx={{ fontSize: "medium", color: "skyblue" }} />
//                                           </IconButton>
//                                           <Typography variant="caption" color="text.secondary">
//                                             {task.startDate || "-"} To {task.dueDate || "-"}
//                                           </Typography>
//                                         </Stack>
//                                       )}
//                                     </Box>
//                                   </CardContent>
//                                 </Card>
//                               )}
//                             </Draggable>
//                           );
//                         })}
//                         {provided.placeholder}
//                       </Stack>
//                     </Paper>
//                   )}
//                 </Droppable>
//               </Box>
//             );
//           })}
//         </Box>
//       </DragDropContext>
//     </Box>
//   );
// };

import * as React from "react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CircularProgress,
  CardContent,
  Typography,
  Paper,
  Stack,
  IconButton,
  TextField,
  Button,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Popover,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { useGetTasksQuery, useUpdateTaskMutation } from "../../services/taskApi";
import { useGetProjectsQuery } from "../../services/projectApi";
import type { Task } from "../../types/Project";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
  Search,
  SwapVertOutlined,
  LineWeightOutlined,
  Share,
  Check,
  DeleteOutlined,
} from "@mui/icons-material";
import { ShareStatusPage } from "../sharepages/ShareStatusPage";

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
  username?: string;
}

type ColumnConfig = {
  id: string;
  label: string;
  color: string;
};

const COLUMNS: ColumnConfig[] = [
  { id: "Todo", label: "Todo", color: "#a3c4f3" },
  { id: "In Progress", label: "In Progress", color: "#ffadad" },
  { id: "Complete", label: "Complete", color: "#a3b18a" },
  { id: "Not Started", label: "Not Started", color: "#588157" },
];

export const NoteStatusPage: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // 👇 Date Formatter Helper (ဒီမှာ ထည့်ထားတယ်)
  const formatDate = useCallback((dateString?: string): string => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      // ဥပမာ Output: "Aug 5, 2026"
    } catch {
      return "-";
    }
  }, []);

  // Project filter 
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() =>
    new URLSearchParams(location.search).get("project") || "",
  );

  // ---- Fetch projects ----
  const { data: projects = [], isLoading: projectsLoading } = useGetProjectsQuery();

  // ---- Detect shared view ----
  const isShared = new URLSearchParams(location.search).get('shared') === 'true';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const projectParam = params.get("project") || "";
    setSelectedProjectId(projectParam);
  }, [location.search]);

  // ---- Fetch tasks with populate assignee ----
  const {
    data: fetchedTasks = [],
    isLoading: tasksLoading,
    isError: tasksError,
    refetch,
  } = useGetTasksQuery({
    projectId: selectedProjectId || undefined,
    shareScope: isShared ? 'board' : undefined,
    populate: 'assignee project category',
  });

  const [updateTask] = useUpdateTaskMutation();

  // Local state for drag & drop 
  const isUpdatingRef = useRef(false);
  const previousTasksRef = useRef<Task[]>([]);

  // User & collaborators (sharing) 
  const [user, setUser] = useState<UserProfile | null>(null);
  const [collaborators, setCollaborators] = useState<CollaboratorItem[]>([]);
  const [shareAnchorEl, setShareAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [permissionMenuAnchorEl, setPermissionMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [activeCollaboratorId, setActiveCollaboratorId] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<string>("full");

  // Map user IDs to names (for assignee display)
  const [usersMap, setUsersMap] = useState<Record<string, { username: string; firstName?: string; lastName?: string }>>({});

  // Fetch users for assignee names (username preferred)
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
          const map: Record<string, { username: string; firstName?: string; lastName?: string }> = {};
          users.forEach((u: any) => {
            map[u._id] = {
              username: u.username || u.email || 'Unknown',
              firstName: u.firstName,
              lastName: u.lastName || "",
            };
          });
          setUsersMap(map);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  // ---- Compute selectedProject from projects ----
  const selectedProject = useMemo(
    () => projects.find((project) => project._id === selectedProjectId),
    [projects, selectedProjectId],
  );

  // ---- Share page info ----
  const sharePageName = selectedProject?.name || "All Projects";
  const sharePageUrl = selectedProjectId
    ? `${window.location.origin}/board?project=${encodeURIComponent(selectedProjectId)}&shared=true`
    : `${window.location.origin}/board?shared=true`;

  // ---- Get assignee name ----
  const getAssigneeName = useCallback(
    (task: Task): string => {
      const assignee = task.assignee;
      if (!assignee) return "Unassigned";

      if (typeof assignee === "object" && assignee !== null) {
        const name = (assignee as any).username || (assignee as any).firstName || (assignee as any).email;
        if (name) return name;
        if ((assignee as any)._id) {
          const userObj = usersMap[(assignee as any)._id];
          if (userObj) return userObj.username || userObj.firstName || 'Unknown';
        }
        return "Unknown";
      }

      if (typeof assignee === "string") {
        const userObj = usersMap[assignee];
        if (userObj) {
          return userObj.username || userObj.firstName || 'Unknown';
        }
        const currentUserId = (user as any)?._id;
        if (currentUserId && assignee === currentUserId) {
          return user?.username || user?.firstName || "You";
        }
        return assignee;
      }

      return "Unknown";
    },
    [usersMap, user]
  );

  // ---- Filtering & sorting ----
  const filteredAndSortedTasks = useMemo(() => {
    if (!Array.isArray(fetchedTasks)) return [];

    let result = [...fetchedTasks];
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

      result = result.filter((task: Task) => {
        if (statusFilter !== null) {
          const currentStatus = (task.status || "").trim().toLowerCase();
          return currentStatus === statusFilter.toLowerCase();
        }

        const currentAssignee = getAssigneeName(task).toLowerCase();
        const currentPriority = (task.priority || "").trim().toLowerCase();
        const titleText = (task.title || "").toLowerCase();
        const contentText = (task.description || "").toLowerCase();

        return (
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
  }, [fetchedTasks, searchText, sortOrder, getAssigneeName]);

  // Sync local tasks when filtered data changes
  useEffect(() => {
    const currentData = JSON.stringify(filteredAndSortedTasks);
    const previousData = JSON.stringify(previousTasksRef.current);
    if (currentData !== previousData) {
      previousTasksRef.current = filteredAndSortedTasks;
      setTasks(filteredAndSortedTasks);
    }
  }, [filteredAndSortedTasks]);

  // ---- Load collaborators ----
  const loadCollaborators = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const params = new URLSearchParams({
        pageType: "board",
        pageName: sharePageName,
      });
      const url = `http://localhost:5000/api/share/collaborators?${params.toString()}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCollaborators(data.collaborators || []);
      }
    } catch (err) {
      console.error("Failed to load collaborators", err);
    }
  }, [sharePageName]);

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
    loadCollaborators();
  }, [loadCollaborators]);

  // ---------- Drag & Drop handler ----------
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
        const movedTask = tasks.find((t) => t._id === draggableId);
        if (!movedTask) {
          isUpdatingRef.current = false;
          return;
        }

        const updatedTasks = Array.from(tasks);
        const sourceTasksInColumn = updatedTasks.filter(
          (t) => (t.status || "Todo") === source.droppableId
        );
        const targetTask = sourceTasksInColumn[source.index];
        if (!targetTask) {
          isUpdatingRef.current = false;
          return;
        }
        const globalSourceIndex = updatedTasks.indexOf(targetTask);
        if (globalSourceIndex !== -1) {
          updatedTasks.splice(globalSourceIndex, 1);
        }

        const updatedMovedTask = { ...targetTask, status: destination.droppableId as Task["status"] };

        const destTasksInColumn = updatedTasks.filter(
          (t) => (t.status || "Todo") === destination.droppableId
        );

        let globalDestIndex = updatedTasks.length;
        if (destination.index < destTasksInColumn.length) {
          const nextTask = destTasksInColumn[destination.index];
          globalDestIndex = updatedTasks.indexOf(nextTask);
        } else if (destTasksInColumn.length > 0) {
          const lastTask = destTasksInColumn[destTasksInColumn.length - 1];
          globalDestIndex = updatedTasks.indexOf(lastTask) + 1;
        }

        updatedTasks.splice(globalDestIndex, 0, updatedMovedTask);
        setTasks(updatedTasks);

        const taskId = targetTask._id;
        if (taskId) {
          await updateTask({
            id: taskId,
            body: { status: destination.droppableId as Task["status"] },
          }).unwrap();
          refetch();
        }
      } catch (err) {
        console.error("Failed to update task status:", err);
        setTasks(filteredAndSortedTasks);
      } finally {
        isUpdatingRef.current = false;
      }
    },
    [tasks, updateTask, refetch, filteredAndSortedTasks]
  );

  // ---------- Share Popover Handlers ----------
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

  const handleRowClick = (id: any) => {
    navigate(`/my-tasks/task-detail/${id}`);
  };

  const handleSearchToggle = () => {
    setSearchOpen((prev) => !prev);
    if (searchOpen) {
      setSearchText("");
    }
  };

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // ---------- Loading / Error ----------
  if (tasksLoading || projectsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading tasks...</Typography>
      </Box>
    );
  }

  if (tasksError) {
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 5 }}>
        Failed to load tasks.
      </Typography>
    );
  }

  // ---------- Render ----------
  return (
    <Box sx={{ py: 2 }}>
      {/* Header Section */}
      <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center", mb: 2, flexWrap: "wrap" }}>
        <Button
          startIcon={<LineWeightOutlined />}
          sx={{
            textTransform: "none",
            color: "text.primary",
            fontSize: "18px",
            fontWeight: "500",
            borderRadius: 3,
            px: 1.5,
            whiteSpace: "nowrap",
            "& .MuiButton-startIcon": { color: "#973aa8" },
          }}
        >
          Status Page
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
            placeholder="Search by title, assignee, or priority..."
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

        {/* Project Dropdown */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Project</InputLabel>
          <Select
            value={selectedProjectId}
            label="Project"
            onChange={(e) => {
              const projectId = e.target.value;
              const params = new URLSearchParams(location.search);
              if (projectId) {
                params.set("project", projectId);
              } else {
                params.delete("project");
              }
              if (isShared) {
                params.set("shared", "true");
              } else {
                params.delete("shared");
              }
              setSelectedProjectId(projectId);
              navigate(projectId || isShared ? `/board?${params.toString()}` : "/board", { replace: true });
            }}
          >
            <MenuItem value="">All Projects</MenuItem>
            {projects.map((proj: any) => (
              <MenuItem key={proj._id} value={proj._id}>
                {proj.name}
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
        <ShareStatusPage
          user={user}
          collaborators={collaborators}
          setCollaborators={setCollaborators}
          handleOpenPermissionMenu={handleOpenPermissionMenu}
          getRoleLabel={getRoleLabel}
          boardName={sharePageName}
          pageUrl={sharePageUrl}
          redirectUrl="/board"
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
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr 1fr",
            },
            gap: 2,
            alignItems: "start",
          }}
        >
          {COLUMNS.map((column) => {
            const columnId = column.id;
            const columnTasks = tasks.filter((t) => (t.status || "Todo") === columnId);

            return (
              <Box key={columnId} sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    pl: 1,
                    textTransform: "uppercase",
                    color: column.color,
                  }}
                >
                  {column.label} ({columnTasks.length})
                </Typography>

                <Droppable droppableId={columnId}>
                  {(provided) => (
                    <Paper
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      elevation={0}
                      sx={{
                        p: 1,
                        bgcolor: "background.default",
                        minHeight: "600px",
                        borderRadius: 2,
                        border: `1px solid ${column.color}`,
                      }}
                    >
                      <Stack spacing={2}>
                        {columnTasks.map((task, index) => {
                          const taskId = task._id || String(index);

                          return (
                            <Draggable key={taskId} draggableId={taskId} index={index}>
                              {(provided) => (
                                <Card
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  sx={{
                                    boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
                                    borderRadius: 2,
                                    height: "250px",
                                    borderLeft: `5px solid ${column.color}`,
                                    "&:hover": {
                                      boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                                    },
                                  }}
                                >
                                  <CardContent
                                    sx={{
                                      p: "10px !important",
                                      width: "100%",
                                      height: "100%",
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "space-between",
                                      cursor: "pointer",
                                      bgcolor: "background.default",
                                    }}
                                    onClick={() => handleRowClick(task._id)}
                                  >
                                    <Box>
                                      <Typography
                                        variant="subtitle1"
                                        sx={{ fontSize: "16px", color: "text.secondary", fontWeight: 500 }}
                                      >
                                        {task.title || "No Title"}
                                      </Typography>

                                      <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{
                                          my: 1,
                                          display: "-webkit-box",
                                          WebkitLineClamp: 3,
                                          WebkitBoxOrient: "vertical",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          lineHeight: 1.5,
                                          color: "text.secondary",
                                        }}
                                      >
                                        {task.description || "No Description"}
                                      </Typography>

                                      {task.project && (
                                        <Typography
                                          variant="caption"
                                          sx={{ color: "text.secondary" }}
                                        >
                                          Project:{" "}
                                          {typeof task.project === "string"
                                            ? task.project
                                            : task.project.name}
                                        </Typography>
                                      )}

                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: "text.secondary",
                                          fontWeight: "500",
                                          display: "block",
                                        }}
                                      >
                                        Assignee: {getAssigneeName(task)}
                                      </Typography>
                                    </Box>

                                    <Box>
                                      <Stack direction="row" spacing={1} useFlexGap sx={{ mt: 0.2, flexWrap: "wrap" }}>
                                        {task.priority && (
                                          <Typography
                                            variant="caption"
                                            sx={{ bgcolor: "background.paper", px: 1, py: 0.5, borderRadius: 1 }}
                                          >
                                            Priority: {task.priority}
                                          </Typography>
                                        )}
                                      </Stack>

                                      {/* 👇👇👇 ဒီနေရာက Date ကို ပြင်ထားတယ် 👇👇👇 */}
                                      {(task.startDate || task.dueDate) && (
                                        <Stack direction="row" sx={{ mt: 1, alignItems: "center" }}>
                                          <IconButton size="small" sx={{ p: 0, mr: 0.5 }} disabled>
                                            <CalendarMonthIcon sx={{ fontSize: "medium", color: "text.secondary" }} />
                                          </IconButton>
                                          <Typography variant="caption" color="text.secondary">
                                            {formatDate(task.startDate)} - {formatDate(task.dueDate)}
                                          </Typography>
                                        </Stack>
                                      )}
                                      {/* 👆👆👆 Date ပြင်ဆင်ပြီးသွားပြီ 👆👆👆 */}
                                    </Box>
                                  </CardContent>
                                </Card>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </Stack>
                    </Paper>
                  )}
                </Droppable>
              </Box>
            );
          })}
        </Box>
      </DragDropContext>
    </Box>
  );
};