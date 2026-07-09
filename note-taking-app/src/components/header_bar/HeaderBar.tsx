// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Box,
//   IconButton,
//   Avatar,
//   Stack,
//   Button,
//   Badge,
//   Divider,
//   Tabs,
//   Tab, 
//   TextField,
//   Popover,
//   Dialog,
//   Menu,
//   MenuItem,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// // import Brightness7Icon from "@mui/icons-material/Brightness7";
// // import Brightness2OutlinedIcon from '@mui/icons-material/Brightness2Outlined';
// import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
// // import Brightness4Icon from "@mui/icons-material/Brightness4";
// // import LightModeIcon from '@mui/icons-material/LightMode';
// import NightlightIcon from '@mui/icons-material/Nightlight';
// import notebook from "../../navicons/34864fc706609d92a131368af91c1e8b-removebg-preview.png";
// // import ShareIcon from "@mui/icons-material/Share";
// import SendIcon from '@mui/icons-material/Send';
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// import KeyboardArrowDownIcon  from "@mui/icons-material/KeyboardArrowDown";
// import HelpOutlineIcon from "@mui/icons-material/HelpOutlined";
// import NotificationsIcon from '@mui/icons-material/NotificationsNone';
// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useGetNotificationsQuery, useMarkNotificationReadMutation } from "../../services/noteApi";
// import { useThemeContext } from "../../Context/ThemeContext";

// interface CollaboratorItem {
//   _id?: string;
//   invitedEmail: string;
//   status: string;
//   role: string;
//   pageUrl?: string;
//   source?: string;
// }

// interface InvitationNotice {
//   _id?: string;
//   invitedEmail: string;
//   role: string;
//   status: string;
//   invitedBy?: string;
//   pageUrl?: string;
//   noteId?: string;
//   source?: string;
// }

// interface UserProfile {
//   firstName?: string;
//   photo?: string;
//   email?: string;
// }

// interface HeaderBarProps {
//   onMenuClick: () => void;
// }

// export const HeaderBar = ({ onMenuClick }: HeaderBarProps) => {
  
//   // const [darkMode, setDarkMode] = useState(false);
//   const { darkMode, toggleDarkMode } = useThemeContext();
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const navigate = useNavigate();

//   const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
//   const [tabValue, setTabValue] = useState<number>(0);
//   const [email, setEmail] = useState<string>('');
//   const [inviteMessage, setInviteMessage] = useState<string>('');
//   const [isInviting, setIsInviting] = useState<boolean>(false);
//   const [collaborators, setCollaborators] = useState<CollaboratorItem[]>([]);
//   const [invitations, setInvitations] = useState<InvitationNotice[]>([]);
//   const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
//   const [activeCollaboratorId, setActiveCollaboratorId] = useState<string | null>(null);
//   const [notificationAnchor, setNotificationAnchor] = useState<HTMLElement | null>(null);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [markNotificationRead] = useMarkNotificationReadMutation();
//   const [openInviteDialog, setOpenInviteDialog] = useState(false);

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const loadUser = () => {
//       const storedUser = localStorage.getItem("user");
//       if (!storedUser) {
//         setUser(null);
//         return;
//       }

//       try {
//         setUser(JSON.parse(storedUser));
//       } catch {
//         setUser(null);
//         localStorage.removeItem("user");
//       }
//     };

//     const handleProfileUpdated = (event: Event) => {
//       const updatedUser = (event as CustomEvent<UserProfile>).detail;
//       if (updatedUser) {
//         setUser(updatedUser);
//         return;
//       }

//       loadUser();
//     };

//     const loadCollaborators = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       try {
//         const response = await fetch("http://localhost:5000/api/share/collaborators", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setCollaborators(data.collaborators || []);
//         }
//       } catch {
//         setCollaborators([]);
//       }
//     };

//     const loadInvitations = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return;
//       if (localStorage.getItem("invitationDismissed") === "true") {
//     setInvitations([]);
//     return;
//   }

//       try {
//         const response = await fetch("http://localhost:5000/api/share/invitations", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setInvitations(data.invitations || []);
//           if ((data.invitations || []).length > 0 && localStorage.getItem("invitationDismissed") !== "true") {
//             setOpenInviteDialog(true);
//           }
//         }
//       } catch {
//         setInvitations([]);
//       }
//     };

//     const refreshInvitationData = () => {
//       loadUser();
//       loadCollaborators();
//       loadInvitations();
//     };

//     refreshInvitationData();
//     window.addEventListener("profileUpdated", handleProfileUpdated);
//     window.addEventListener("storage", refreshInvitationData);
//     window.addEventListener("focus", refreshInvitationData);
//     return () => {
//       window.removeEventListener("profileUpdated", handleProfileUpdated);
//       window.removeEventListener("storage", refreshInvitationData);
//       window.removeEventListener("focus", refreshInvitationData);
//     };
//   }, [token]);

//   const { data: notificationData } = useGetNotificationsQuery(undefined, { skip: !token });

//   useEffect(() => {
//     if (notificationData?.notifications) {
//       setUnreadCount(notificationData.notifications.filter((item) => !item.isRead).length);
//     }
//   }, [notificationData]);

//   const handleNotificationToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setNotificationAnchor(notificationAnchor ? null : event.currentTarget);
//   };

//   const handleNotificationClose = () => {
//     setNotificationAnchor(null);
//   };

//   const handleMarkRead = async (notificationId: string) => {
//     await markNotificationRead(notificationId).unwrap().catch(() => null);
//     setNotificationAnchor(null);
//   };

//   const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleShareClose = () => {
//     setAnchorEl(null);
//   };

//   const handleInvite = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!email.trim()) {
//       setInviteMessage("Please enter at least one email address.");
//       return;
//     }

//     const emailList = email
//       .split(',')
//       .map((str) => str.trim())
//       .filter((str) => str !== '');

//     if (emailList.length === 0) {
//       setInviteMessage("Please enter at least one valid email address.");
//       return;
//     }

//     setIsInviting(true);
//     setInviteMessage("");

//     try {
//       const response = await fetch("http://localhost:5000/api/share/multiple", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
//         },
//         body: JSON.stringify({
//           emails: emailList,
//           pageUrl: window.location.href,
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json().catch(() => ({}));
//         setInviteMessage(data.message || `Invite sent to ${emailList.length} email${emailList.length > 1 ? "s" : ""}.`);
//         setEmail('');
//         const nextCollaborators = (data.invitations || []).map((item: { email: string; status: string; role: string; pageUrl?: string }) => ({
//           invitedEmail: item.email,
//           status: item.status,
//           role: item.role,
//           pageUrl: item.pageUrl,
//           source: item.pageUrl
//             ? item.pageUrl.includes('/note-form')
//               ? 'Note form'
//               : item.pageUrl.includes('/my-project')
//               ? 'Project page'
//               : 'Shared link'
//             : 'Shared link',
//         }));
//         setCollaborators((prev) => [...nextCollaborators, ...prev]);
//       } else {
//         const errorData = await response.json().catch(() => ({}));
//         setInviteMessage(errorData.message || "Unable to send invitations right now.");
//       }
//     } catch (error) {
//       setInviteMessage("Unable to send invitations right now.");
//     } finally {
//       setIsInviting(false);
//     }
//   };
//   const handleCopyLink = () => {
//     navigator.clipboard.writeText(window.location.href);
//     alert('Link copied to clipboard!');
//   };

//   const dismissInvitationNotice = () => {
//     setInvitations([]);
//     handleShareClose();
//     setOpenInviteDialog(false);
//   };

//   const handleOpenSharedNotes = () => {
//     localStorage.setItem("sharedNotesRequested", "true");
//     localStorage.removeItem("watchLaterSharedNotes");
//     localStorage.setItem("invitationDismissed", "true");
//     dismissInvitationNotice();
//     navigate("/my-tasks?view=shared");
//   };

//   const handleWatchLater = () => {
//     localStorage.setItem("watchLaterSharedNotes", "true");
//     localStorage.setItem("sharedNotesRequested", "true");
//     localStorage.setItem("invitationDismissed", "true");
//     dismissInvitationNotice();
//     navigate("/my-tasks?view=shared");
//   };

//   const extractNoteIdFromUrl = (url?: string) => {
//     if (!url) return null;
//     const m = url.match(/note-form\/(?:detail|edit)\/([a-zA-Z0-9_-]{1,100})/);
//     return m ? m[1] : null;
//   };

//   const handleWatchLaterForInvitation = (inv: InvitationNotice) => {
//     const pageUrl = (inv as any).pageUrl || window.location.href;
//     const noteId = extractNoteIdFromUrl(pageUrl);
//     if (!noteId) {
//       localStorage.setItem("sharedNotesRequested", "true");
//       localStorage.setItem("invitationDismissed", "true");
//       setOpenInviteDialog(false);
//       alert("Saved to Watch Later");
//       return;
//     }

//     let arr: string[] = [];
//     try { arr = JSON.parse(localStorage.getItem("watchLaterSharedNotes") || "[]"); } catch { arr = []; }
//     if (!arr.includes(noteId)) arr.push(noteId);
//     localStorage.setItem("watchLaterSharedNotes", JSON.stringify(arr));
//     localStorage.setItem("sharedNotesRequested", "true");
//     localStorage.setItem("invitationDismissed", "true");
//     setOpenInviteDialog(false);
//     alert("Saved to Watch Later");
//   };

//   const handleOpenPermissionMenu = (event: React.MouseEvent<HTMLButtonElement>, collaboratorId?: string) => {
//     setMenuAnchorEl(event.currentTarget);
//     setActiveCollaboratorId(collaboratorId || null);
//   };

//   const handleClosePermissionMenu = () => {
//     setMenuAnchorEl(null);
//     setActiveCollaboratorId(null);
//   };

//   const handlePermissionChange = async (role: string) => {
//     if (!activeCollaboratorId) return;

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
//     } catch {
//       // Ignore for now
//     } finally {
//       handleClosePermissionMenu();
//     }
//   };

//   const handleRemoveCollaborator = async () => {
//     if (!activeCollaboratorId) return;

//     try {
//       const response = await fetch(`http://localhost:5000/api/share/${activeCollaboratorId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
//         },
//       });

//       if (response.ok) {
//         setCollaborators((prev) => prev.filter((person) => person._id !== activeCollaboratorId));
//       }
//     } catch {
//       // Ignore for now
//     } finally {
//       handleClosePermissionMenu();
//     }
//   };

//   const isShareOpen = Boolean(anchorEl);
//   const shareId = isShareOpen ? 'share-popover' : undefined;


//   //to close box 
// //   const handleDismissInvitation = () => {
// //   setInvitations([]);
// // };
//   return (
//     <AppBar
//       position="fixed"
//   elevation={0}
//   sx={{
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: (theme) => theme.zIndex.drawer + 1,
//     boxShadow: "none",
//     backgroundColor: "background.default",
//     color: "text.primary"     
//       }}
//     >
//       <Toolbar
//         sx={{
  
//           height: 64,
//           px: 2,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             gap: 1.5,
//              bgcolor: "background.paper",
//     color: "text.primary",
//           }}
//         >
//           {/* Hamburger Menu Button */}
//           <IconButton
//             onClick={onMenuClick}
//             sx={{
//               color: "text.primary",
//               p: 1,
//             }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 1,
//               cursor: "pointer",
//             }}
//             onClick={() => navigate("/")}
//           >
//             <Box
//               component="img"
//               src={notebook}
//               alt="notebook"
//               sx={{
//                 fontSize:"32px",
//                 fontWeight:"bold",
//                 width: 35,
//                 height: 35,
//               }}
//             />

//             <Typography
//               sx={{
              
//                 fontSize: { xs: "1rem", sm: "1.2rem" },
//                 whiteSpace: "nowrap",
//                 lineHeight: 1,
//                 letterSpacing: "0.5px",
//                 bgcolor: "background.paper",
//     color: "text.primary",
//               }}
//             >
//               Note Book
//             </Typography>
//           </Box>
//         </Box>

//         <Box sx={{ flexGrow: 1 }} />

//         <IconButton
//           sx={{ bgcolor: "background.paper",
//     color: "text.primary", }}
//           onClick={() =>  toggleDarkMode()}
//         >
//           {darkMode ? <NightlightIcon /> : <LightModeOutlinedIcon />}
//         </IconButton>
//         <IconButton sx={{ color: "gray" }} onClick={handleNotificationToggle}>
//           <Badge badgeContent={unreadCount} color="error">
//             <NotificationsIcon />
//           </Badge>
//         </IconButton>
//        <Button
//           aria-describedby={shareId}
//           onClick={handleShareClick}
//           sx={{
//             border: "1px solid #d0d0d0",
//             textTransform: "none",
//             color: "text.primary",
//             bgcolor: "f4f6f8",
//             gap: 0.5,
//             px: 1,
//             mr: 2,
//             borderRadius:2,
//             "&:hover": {
//              bgcolor: "background.paper",
//     color: "text.primary",
              
//             },
//           }}
          
//         >
//           <SendIcon sx={{ fontSize: 12 }} />
//           Share
//           <KeyboardArrowDownIcon sx={{ fontSize: 12}} />
//         </Button>

//         <Popover
//           id={notificationAnchor ? "notification-popover" : undefined}
//           open={Boolean(notificationAnchor)}
//           anchorEl={notificationAnchor}
//           onClose={handleNotificationClose}
//           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//           transformOrigin={{ vertical: "top", horizontal: "right" }}
//           slotProps={{ paper: { sx: { width: 320, p: 2, mt: 1, borderRadius: 2 } } }}
//         >
//           <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700,bgcolor: "background.paper",
//     color: "text.primary", }}>
//             Notifications
//           </Typography>
//           {notificationData?.notifications?.length ? (
//             notificationData.notifications.map((notification) => (
//               <Box key={notification._id} sx={{ mb: 1, p: 1, borderRadius: 2, bgcolor: notification.isRead ? "#fafafa" : "#f2f7ff" }}>
//                 <Typography variant="body2" sx={{ mb: 0.5 }}>
//                   {notification.message}
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary">
//                   {new Date(notification.createdAt || "").toLocaleString()}
//                 </Typography>
//                 {!notification.isRead && (
//                   <Button size="small" onClick={() => handleMarkRead(notification._id || "")} sx={{ textTransform: "none", mt: 1 }}>
//                     Mark as read
//                   </Button>
//                 )}
//               </Box>
//             ))
//           ) : (
//             <Typography variant="body2" color="text.secondary">
//               No notifications yet.
//             </Typography>
//           )}
//         </Popover>
//         <Popover
//           id={shareId}
//           open={isShareOpen}
//           anchorEl={anchorEl}
//           onClose={handleShareClose}
//           anchorOrigin={{
//             vertical: "bottom",
//             horizontal: "right",
//           }}
//           transformOrigin={{
//             vertical: "top",
//             horizontal: "right",
//           }}
//           slotProps={{
//             paper: {
//               sx: {
//                 width: 380,
//                 p: 2,
//                 mt: 1,
//                 borderRadius: 2,
//                 boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.12)",
//               },
//             },
//           }}
//         >
//           <Tabs
//             value={tabValue}
//             onChange={(_, newValue) => setTabValue(newValue)}
//             textColor="primary"
//             indicatorColor="primary"
//             sx={{ minHeight: 32, mb: 2, borderBottom: "1px solid #f0f0f0" }}
//           >
//             <Tab label="Share" sx={{ textTransform: "none", minHeight: 32, fontWeight: 600 }} />
//             <Tab label="Publish" sx={{ textTransform: "none", minHeight: 32 }} />
//           </Tabs>

//           {tabValue === 0 && (
//             <Box>
//               {/* Form Input Section */}
//               <Box component="form" onSubmit={handleInvite} sx={{ display: "flex", gap: 1, mb: 2 }}>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   placeholder="Email or group, separated by commas"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       fontSize: "13px",
//                       bgcolor: "background.paper",
//     color: "text.primary",
//                     },
//                   }}
//                 />
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   disableElevation
//                   disabled={isInviting}
//                   sx={{ textTransform: "none", bgcolor: "#2383e2", "&:hover": { bgcolor: "#1a6cb3" } }}
//                 >
//                   {isInviting ? "Sending..." : "Invite"}
//                 </Button>
//               </Box>

//               {inviteMessage && (
//                 <Typography variant="body2" sx={{ mb: 1.5, color: inviteMessage.includes("Unable") || inviteMessage.includes("Please") ? "error.main" : "success.main" }}>
//                   {inviteMessage}
//                 </Typography>
//               )}

//               {/* Current User Info Section */}
//               <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 ,bgcolor: "background.paper",
//     color: "text.primary",}}>
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//                   <Avatar 
//                     src={user?.photo || ""} 
//                     sx={{ width: 32, height: 32, bgcolor: "#e3e3e3", color: "#555", fontSize: "14px", fontWeight: "bold" }}
//                   >
//                     {!user?.photo && (user?.firstName?.charAt(0) || "Z")}
//                   </Avatar>
//                   <Box>
//                     <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "13px", color: "black" }}>
//                       {user?.firstName ? `${user.firstName} (You)` : "Zin Mar Khaing (You)"}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: "11px" }}>
//                       {user?.email || "your@email.com"}
//                     </Typography>
//                   </Box>
//                 </Box>
//                 <Typography variant="caption" color="text.secondary" sx={{ fontSize: "12px" }}>
//                   Full access
//                 </Typography>
//               </Box>

//               <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, mb: 2 }}>
//                 {collaborators.length === 0 ? (
//                   <Typography variant="body2" color="text.secondary">
//                     No collaborators yet.
//                   </Typography>
//                 ) : (
//                   collaborators.map((person) => (
//                     <Box key={`${person.invitedEmail}-${person.status}`} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 0.5 }}>
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                         <Avatar sx={{ width: 28, height: 28, bgcolor: "#e8f3ff", color: "#1a6cb3", fontSize: "12px" }}>
//                           {person.invitedEmail.charAt(0).toUpperCase()}
//                         </Avatar>
//                         <Box>
//                           <Typography variant="body2" sx={{ fontSize: "13px", fontWeight: 500 }}>
//                             {person.invitedEmail}
//                           </Typography>
//                           <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: "11px" }}>
//                             {person.status === "accepted" ? "Active collaborator" : "Pending invite"}
//                           </Typography>
//                         </Box>
//                       </Box>
//                       <Button
//                         size="small"
//                         variant="outlined"
//                         onClick={(event) => handleOpenPermissionMenu(event, person._id)}
//                         sx={{
//                           textTransform: "none",
//                           borderColor: "#e0e0e0",
//                           color: person.role === "editor" ? "#2383e2" : person.role === "commenter" ? "#6b7280" : "#37352f",
//                           fontSize: "12px",
//                           py: 0.2,
//                           px: 1,
//                           bgcolor: "background.paper",
  
//                         }}
//                       >
//                         {person.role === "editor" ? "Can edit" : person.role === "commenter" ? "Can comment" : "Can view"}
//                       </Button>
//                     </Box>
//                   ))
//                 )}
//               </Box>

//               <Menu
//                 anchorEl={menuAnchorEl}
//                 open={Boolean(menuAnchorEl)}
//                 onClose={handleClosePermissionMenu}
//                 anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//                 transformOrigin={{ vertical: "top", horizontal: "right" }}
//               >
//                 <MenuItem onClick={() => handlePermissionChange("editor")}>Can edit</MenuItem>
//                 <MenuItem onClick={() => handlePermissionChange("commenter")}>Can comment</MenuItem>
//                 <MenuItem onClick={() => handlePermissionChange("viewer")}>Can view</MenuItem>
//                 <MenuItem onClick={handleRemoveCollaborator} sx={{ color: "error.main" }}>Remove</MenuItem>
//               </Menu>

//               <Divider sx={{ my: 1.5 }} />

//               {/* Footer Links */}
//               <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary", cursor: "pointer" }}>
//                   <HelpOutlineIcon sx={{ fontSize: 16 }} />
//                   <Typography variant="caption" sx={{ fontSize: "12px" }}>Learn about sharing</Typography>
//                 </Box>

//                 <Button
//                   size="small"
//                   variant="outlined"
//                   startIcon={<ContentCopyIcon sx={{ fontSize: 14 }} />}
//                   onClick={handleCopyLink}
//                   sx={{
//                     textTransform: "none",
//                     color: "#37352f",
//                     borderColor: "#e0e0e0",
//                     fontSize: "12px",
//                     py: 0.5,
//                     "&:hover": { borderColor: "gray" }
//                   }}
//                 >
//                   Copy link
//                 </Button>
//               </Box>
//             </Box>
//           )}

//           {tabValue === 1 && (
//             <Box sx={{ p: 1 }}>
//               <Typography variant="body2" color="text.secondary">
//                 Publish settings will go here.
//               </Typography>
//             </Box>
//           )}
//         </Popover>

//         {/* Invitations dialog (watch later / open) */}
//         <Dialog open={openInviteDialog} onClose={() => setOpenInviteDialog(false)}>
//           <Box sx={{ p: 2, minWidth: 320 }}>
//             <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Shared invitations</Typography>
//             {invitations.length === 0 ? (
//               <Typography variant="body2">No invitations</Typography>
//             ) : (
//               invitations.map((inv) => (
//                 <Box key={inv._id || inv.invitedEmail} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
//                   <Box>
//                     <Typography variant="subtitle2">{inv.invitedEmail}</Typography>
//                     <Typography variant="caption" color="text.secondary">Role: {inv.role}</Typography>
//                     {inv.source && (
//                       <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
//                         Shared from: {inv.source}
//                       </Typography>
//                     )}
//                   </Box>
//                   <Stack direction="row" spacing={1}>
//                     <Button size="small" onClick={() => { if ((inv as any).pageUrl) { window.open((inv as any).pageUrl); } }}>Open</Button>
//                     <Button size="small" onClick={() => handleWatchLaterForInvitation(inv)}>Watch later</Button>
//                   </Stack>
//                 </Box>
//               ))
//             )}
//             <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: 'flex-end' }}>
//               <Button onClick={() => { setOpenInviteDialog(false); localStorage.setItem('invitationDismissed', 'true'); setInvitations([]); }}>
//                 Dismiss
//               </Button>
//             </Stack>
//           </Box>
//         </Dialog>

//         {token ? (
//           <Stack direction="row" spacing={1} sx={{ my: { xs: 0, sm: 2 } }}>
//             <IconButton component={Link} to="/profile">
//               <Avatar
//                 alt={user?.firstName || "User"}
//                 src={user?.photo || ""}
//                 key={user?.photo || "default-avatar"}
//               />
//             </IconButton>
//           </Stack>
//         ) : (
//           <Stack spacing={1} direction="row" sx={{ my: { xs: 0, sm: 2 } }}>
//             <Button
//               size="small"
//               variant="contained"
//               component={Link}
//               to="/login"
//             >
//               Login
//             </Button>
//             <Button
//               size="small"
//               variant="contained"
//               component={Link}
//               to="/signup"
//             >
//               Sign Up
//             </Button>
//           </Stack>
//         )}
//       </Toolbar>

//       {invitations.length > 0 && (
//         <Box
//           sx={{
//             px: 2,
//             py: 1,
//             bgcolor: "#fff7e6",
//             borderTop: "1px solid #f3d9a3",
//             color: "#7a4b00",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: 1,
//             flexWrap: "wrap",
//           }}
//         >
//           <Typography variant="body2" sx={{ fontWeight: 600 }}>
//             You have been invited to collaborate with access: {invitations[0].role === "editor" ? "Can edit" : invitations[0].role === "commenter" ? "Can comment" : "Can view"}
//           </Typography>
//           <Stack direction="row" spacing={1}>
//             <Button
//               size="small"
//               variant="contained"
//               onClick={handleOpenSharedNotes}
//               sx={{
//                 textTransform: "none",
//                 bgcolor: "#2383e2",
//                 color: "white",
//                 borderRadius: 999,
//                 "&:hover": { bgcolor: "#1a6cb3" },
//               }}
//             >
//               Open shared notes
//             </Button>
//             <Button
//               size="small"
//               variant="outlined"
//               onClick={handleWatchLater}
//               sx={{
//                 textTransform: "none",
//                 borderColor: "#f3d9a3",
//                 color: "#7a4b00",
//                 borderRadius: 999,
//                 bgcolor: "#fff7e6",
//                 "&:hover": { bgcolor: "#fff1cf", borderColor: "#f3d9a3" },
//               }}
//             >
//               Watch later
//             </Button>
//           </Stack>
//         </Box>
//       )}
//     </AppBar>
//   );
// };


import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Stack,
  Button,
  Badge,
  Divider,
  Tabs,
  Tab, 
  TextField,
  Popover,
  Dialog,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NightlightIcon from '@mui/icons-material/Nightlight';
import notebook from "../../navicons/34864fc706609d92a131368af91c1e8b-removebg-preview.png";
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import KeyboardArrowDownIcon  from "@mui/icons-material/KeyboardArrowDown";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlined";
import NotificationsIcon from '@mui/icons-material/NotificationsNone';
import CheckIcon from '@mui/icons-material/Check';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import { useGetNotificationsQuery, useMarkNotificationReadMutation } from "../../services/noteApi";
import { useThemeContext } from "../../Context/ThemeContext";

interface CollaboratorItem {
  _id?: string;
  invitedEmail: string;
  status: string;
  role: string;
  pageUrl?: string;
  source?: string;
}

interface InvitationNotice {
  _id?: string;
  invitedEmail: string;
  role: string;
  status: string;
  invitedBy?: string;
  pageUrl?: string;
  noteId?: string;
  source?: string;
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  photo?: string;
}

interface HeaderBarProps {
  onMenuClick: () => void;
}

export const HeaderBar = ({ onMenuClick }: HeaderBarProps) => {
  const { darkMode, toggleDarkMode } = useThemeContext();
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [tabValue, setTabValue] = useState<number>(0);
  const [email, setEmail] = useState<string>('');
  const [inviteMessage, setInviteMessage] = useState<string>('');
  const [isInviting, setIsInviting] = useState<boolean>(false);
  const [collaborators, setCollaborators] = useState<CollaboratorItem[]>([]);
  const [invitations, setInvitations] = useState<InvitationNotice[]>([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  
  const [activeCollaboratorId, setActiveCollaboratorId] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<string>("full"); 

  const [notificationAnchor, setNotificationAnchor] = useState<HTMLElement | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [markNotificationRead] = useMarkNotificationReadMutation();
  const [openInviteDialog, setOpenInviteDialog] = useState(false);

 
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<HTMLElement | null>(null);

  const token = localStorage.getItem("token");

  const handleOpenSharedNotes = () => {
    localStorage.setItem("sharedNotesRequested", "true");
    localStorage.removeItem("watchLaterSharedNotes");
    localStorage.setItem("invitationDismissed", "true");
    dismissInvitationNotice();
    navigate("/my-tasks?view=shared");
  };

  const handleWatchLater = () => {
    localStorage.setItem("watchLaterSharedNotes", "true");
    localStorage.setItem("sharedNotesRequested", "true");
    localStorage.setItem("invitationDismissed", "true");
    dismissInvitationNotice();
    navigate("/my-tasks?view=shared");
  };

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setUser(null);
        return;
      }
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
        localStorage.removeItem("user");
      }
    };

    const handleProfileUpdated = (event: Event) => {
      const updatedUser = (event as CustomEvent<UserProfile>).detail;
      if (updatedUser) {
        setUser(updatedUser);
        return;
      }
      loadUser();
    };

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
      } catch {
        setCollaborators([]);
      }
    };

    const loadInvitations = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      if (localStorage.getItem("invitationDismissed") === "true") {
        setInvitations([]);
        return;
      }
      try {
        const response = await fetch("http://localhost:5000/api/share/invitations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setInvitations(data.invitations || []);
          if ((data.invitations || []).length > 0 && localStorage.getItem("invitationDismissed") !== "true") {
            setOpenInviteDialog(true);
          }
        }
      } catch {
        setInvitations([]);
      }
    };

    const refreshInvitationData = () => {
      loadUser();
      loadCollaborators();
      loadInvitations();
    };

    refreshInvitationData();
    window.addEventListener("profileUpdated", handleProfileUpdated);
    window.addEventListener("storage", refreshInvitationData);
    window.addEventListener("focus", refreshInvitationData);
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdated);
      window.removeEventListener("storage", refreshInvitationData);
      window.removeEventListener("focus", refreshInvitationData);
    };
  }, [token]);

  const { data: notificationData } = useGetNotificationsQuery(undefined, { skip: !token });

  useEffect(() => {
    if (notificationData?.notifications) {
      setUnreadCount(notificationData.notifications.filter((item) => !item.isRead).length);
    }
  }, [notificationData]);

  const handleNotificationToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNotificationAnchor(notificationAnchor ? null : event.currentTarget);
  };

  const handleNotificationClose = () => { setNotificationAnchor(null); };

  const handleMarkRead = async (notificationId: string) => {
    await markNotificationRead(notificationId).unwrap().catch(() => null);
    setNotificationAnchor(null);
  };

  const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => { setAnchorEl(event.currentTarget); };
  const handleShareClose = () => { setAnchorEl(null); };

  // Profile Menu Open/Close Handlers
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setInviteMessage("Please enter at least one email address.");
      return;
    }
    const emailList = email.split(',').map((str) => str.trim()).filter((str) => str !== '');
    if (emailList.length === 0) {
      setInviteMessage("Please enter at least one valid email address.");
      return;
    }

    setIsInviting(true);
    setInviteMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/share/multiple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          emails: emailList,
          pageUrl: window.location.href,
        }),
      });

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        setInviteMessage(data.message || `Invite sent to ${emailList.length} email${emailList.length > 1 ? "s" : ""}.`);
        setEmail('');
        const nextCollaborators = (data.invitations || []).map((item: any) => ({
          invitedEmail: item.email,
          status: item.status,
          role: item.role || "full",
          pageUrl: item.pageUrl,
          source: 'Shared link',
        }));
        setCollaborators((prev) => [...nextCollaborators, ...prev]);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setInviteMessage(errorData.message || "Unable to send invitations right now.");
      }
    } catch {
      setInviteMessage("Unable to send invitations right now.");
    } finally {
      setIsInviting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const dismissInvitationNotice = () => {
    setInvitations([]);
    handleShareClose();
    setOpenInviteDialog(false);
  };

  const extractNoteIdFromUrl = (url?: string) => {
    if (!url) return null;
    const m = url.match(/note-form\/(?:detail|edit)\/([a-zA-Z0-9_-]{1,100})/);
    return m ? m[1] : null;
  };

  const handleWatchLaterForInvitation = (inv: InvitationNotice) => {
    const pageUrl = (inv as any).pageUrl || window.location.href;
    const noteId = extractNoteIdFromUrl(pageUrl);
    if (!noteId) {
      localStorage.setItem("sharedNotesRequested", "true");
      localStorage.setItem("invitationDismissed", "true");
      setOpenInviteDialog(false);
      alert("Saved to Watch Later");
      return;
    }
    let arr: string[] = [];
    try { arr = JSON.parse(localStorage.getItem("watchLaterSharedNotes") || "[]"); } catch { arr = []; }
    if (!arr.includes(noteId)) arr.push(noteId);
    localStorage.setItem("watchLaterSharedNotes", JSON.stringify(arr));
    localStorage.setItem("sharedNotesRequested", "true");
    localStorage.setItem("invitationDismissed", "true");
    setOpenInviteDialog(false);
    alert("Saved to Watch Later");
  };

  const handleOpenPermissionMenu = (event: React.MouseEvent<HTMLButtonElement>, id: string | null, currentRole: string) => {
    setMenuAnchorEl(event.currentTarget);
    setActiveCollaboratorId(id);
    setActiveRole(currentRole || "full");
  };

  const handleClosePermissionMenu = () => {
    setMenuAnchorEl(null);
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
    } catch {
        // Handle Error
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
    } catch {
      // Error handling
    } finally {
      handleClosePermissionMenu();
    }
  };

  const getRoleLabel = (role: string) => {
    if (role === "full") return "Full access";
    if (role === "editor") return "Can edit";
    if (role === "edit_content") return "Can edit content";
    if (role === "commenter") return "Can comment";
    return "Can view";
  };

  const isShareOpen = Boolean(anchorEl);
  const shareId = isShareOpen ? 'share-popover' : undefined;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        top: 0, left: 0, right: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: "none",
        backgroundColor: "background.default",
        color: "text.primary"     
      }}
    >
      <Toolbar sx={{ height: 64, px: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1., color: "text.primary" }}>
          <IconButton onClick={onMenuClick} sx={{ color: "text.primary", p: 1 }}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }} onClick={() => navigate("/")}>
            <Box component="img" src={notebook} alt="notebook" sx={{ width: 35, height: 35 }} />
            <Typography sx={{ fontSize: { xs: "1rem", sm: "1.2rem" }, whiteSpace: "nowrap", lineHeight: 1, letterSpacing: "0.5px" }}>
              Note Book
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton sx={{ bgcolor: "background.", color: "text.primary", mr: 1 }} onClick={() => toggleDarkMode()}>
          {darkMode ? <NightlightIcon /> : <LightModeOutlinedIcon />}
        </IconButton>
        
        <IconButton sx={{ color: "text.primary", mr: 1 }} onClick={handleNotificationToggle}>
          <Badge badgeContent={unreadCount} sx={{color:'#973aa8'}}>
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <Button
          aria-describedby={shareId}
          onClick={handleShareClick}
          sx={{
            border: "1px solid #d0d0d0",
            textTransform: "none",
            color: "text.primary",
            bgcolor: "f4f6f8",
            gap: 0.5, px: 1.5, mr: 2, borderRadius: 2,
            "&:hover": { bgcolor: "background.paper" },
          }}
        >
          <SendIcon sx={{ fontSize: 12 }} />
          Share
          <KeyboardArrowDownIcon sx={{ fontSize: 14 }} />
        </Button>

        <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0, ml: 0.5 }}>
          <Avatar 
            src={user?.photo || ""} 
            sx={{ width: 36, height: 36, bgcolor: "#6596c6", fontSize: "15px", fontWeight: 600 }}
          >
            {!user?.photo && (user?.firstName?.charAt(0).toUpperCase() || "Z")}
          </Avatar>
        </IconButton>

        {/* Notification Popover */}
        <Popover
          id={notificationAnchor ? "notification-popover" : undefined}
          open={Boolean(notificationAnchor)}
          anchorEl={notificationAnchor}
          onClose={handleNotificationClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{ paper: { sx: { width: 320, p: 2, mt: 1, borderRadius: 2 } } }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Notifications</Typography>
          {notificationData?.notifications?.length ? (
            notificationData.notifications.map((notification) => (
              <Box key={notification._id} sx={{ mb: 1, p: 1, borderRadius: 2, bgcolor: notification.isRead ? "#fafafa" : "#f2f7ff" }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>{notification.message}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(notification.createdAt || "").toLocaleString()}
                </Typography>
                {!notification.isRead && (
                  <Button size="small" onClick={() => handleMarkRead(notification._id || "")} sx={{ textTransform: "none", mt: 1 }}>
                    Mark as read
                  </Button>
                )}
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">No notifications yet.</Typography>
          )}
        </Popover>

        {/* Share Popover */}
        <Popover
          id={shareId}
          open={isShareOpen}
          anchorEl={anchorEl}
          onClose={handleShareClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{ paper: { sx: { width: 420, p: 2.5, mt: 1, borderRadius: 3, boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)" ,bgcolor:'background.default',color:'text.primary'} } }}
        >
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            textColor="primary" indicatorColor="primary"
            sx={{ minHeight: 32, mb: 2, borderBottom: "1px solid #f0f0f0", }}
          >
            <Tab label="Share" sx={{ textTransform: "none", minHeight: 32, fontWeight: 600 }} />
            {/* <Tab label="Publish" sx={{ textTransform: "none", minHeight: 32 }} /> */}
          </Tabs>

          {tabValue === 0 && (
            <Box>
              <Box component="form" onSubmit={handleInvite} sx={{ display: "flex", gap: 1, mb: 2.5 }}>
                <TextField
                  fullWidth size="small"
                  placeholder="Email or group, separated by commas"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { fontSize: "13px" } }}
                />
                <Button
                  type="submit" variant="contained" disableElevation disabled={isInviting}
                  sx={{ textTransform: "none", bgcolor: "#e9c0f1", "&:hover": { bgcolor: "#973aa8",color:'white' } }}
                >
                  {isInviting ? "Sending..." : "Invite"}
                </Button>
              </Box>

              {inviteMessage && (
                <Typography variant="body2" sx={{ mb: 1.5, color: inviteMessage.includes("Unable") || inviteMessage.includes("Please") ? "error.main" : "success.main" }}>
                  {inviteMessage}
                </Typography>
              )}

              {/* Current User (You) Row */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2,color:'text.primary' }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar src={user?.photo || ""} sx={{ width: 36, height: 36, bgcolor: "#e3e3e3" }}>
                    {!user?.photo && (user?.firstName?.charAt(0) || "Z")}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "13.5px" }}>
                      {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "Zin Mar Khaing"} (You)
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: "11px" }}>
                      {user?.email || "zinmarkhaing979@gmail.com"}
                    </Typography>
                  </Box>
                </                 Box>
                <Button
                  size="small" variant="text"
                  endIcon={<KeyboardArrowDownIcon />}
                  onClick={(e) => handleOpenPermissionMenu(e, null, "full")}
                  sx={{ textTransform: "none", color: "text.secondary", fontSize: "13px" ,}}
                >
                  Full access
                </Button>
              </Box>

              {/* Collaborators List */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
                {collaborators.map((person) => (
                  <Box key={person._id || person.invitedEmail} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: "#e8f3ff", color: "#1a6cb3", fontSize: "14px", fontWeight: "bold" }}>
                        {person.invitedEmail.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontSize: "13.5px", fontWeight: 500 }}>
                          {person.invitedEmail}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "inline-block", bgcolor: "background.default", px: 0.8, py: 0.1, borderRadius: 1, fontSize: "10px", fontWeight: 600, mt: 0.3 }}>
                          {person.status === "accepted" ? "Active" : "Invited"}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      size="small" variant="text"
                      endIcon={<KeyboardArrowDownIcon />}
                      onClick={(e) => handleOpenPermissionMenu(e, person._id || null, person.role)}
                      sx={{ textTransform: "none", color: "text.primary", fontSize: "13px", bgcolor: "background.default",borderRadius:3, px: 1 }}
                    >
                      {getRoleLabel(person.role)}
                    </Button>
                  </Box>
                ))}
              </Box>

              <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", display: "block", mb: 1 }}>
                General access
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: "#f0f0f0" }}>🔒</Avatar>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "13px" }}>
                  Only people invited can open this link
                </Typography>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary", cursor: "pointer" }}>
                  <HelpOutlineIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption" sx={{ fontSize: "12px" }}>Learn about sharing</Typography>
                </Box>
                <Button
                  size="small" variant="outlined"
                  startIcon={<ContentCopyIcon sx={{ fontSize: 14 }} />}
                  onClick={handleCopyLink}
                  sx={{ textTransform: "none", borderRadius: 2, borderColor: "#e0e0e0", color: "text.primary" }}
                >
                  Copy link
                </Button>
              </Box>
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ p: 1 }}>
              <Typography variant="body2" color="text.secondary">Publish settings will go here.</Typography>
            </Box>
          )}
        </Popover>

        {/* User Profile Dropdown Menu */}
        <Menu
          anchorEl={profileMenuAnchor}
          open={Boolean(profileMenuAnchor)}
          onClose={handleProfileMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{ paper: { sx: { width: 240, borderRadius: 3, mt: 1.5, p: 0.5, boxShadow: "0px 4px 16px rgba(0,0,0,0.1)" } } }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
              {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "Zin Mar Khaing"}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.email || "zinmarkhaing979@gmail.com"}
            </Typography>
          </Box>
          
          <Divider sx={{ my: 0.5 }} />
          
          <MenuItem onClick={() => { handleProfileMenuClose(); navigate("/profile/edit-profile"); }} sx={{ py: 1, borderRadius: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}><AccountCircleOutlinedIcon sx={{ fontSize: 20 }} /></ListItemIcon>
            <ListItemText primary={<Typography variant="body2">My Profile</Typography>} />
          </MenuItem>
          
          <MenuItem onClick={handleLogout} sx={{ py: 1, color: "error.main", borderRadius: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 32, color: "error.main" }}><LogoutOutlinedIcon sx={{ fontSize: 20 }} /></ListItemIcon>
            <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>Logout</Typography>} />
          </MenuItem>
        </Menu>

        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleClosePermissionMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{ paper: { sx: { width: 340, borderRadius: 3, p: 0.5, boxShadow: "0px 4px 16px rgba(0,0,0,0.12)" } } }}
        >
          <MenuItem onClick={() => handlePermissionChange("full")} sx={{ py: 1 }}>
            <ListItemText
              primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Full access</Typography>}
              secondary={<Typography variant="caption" color="text.secondary">Edit, suggest, comment, and share</Typography>}
            />
            {activeRole === "full" && <CheckIcon sx={{ fontSize: 16, ml: 1 }} />}
          </MenuItem>

          <MenuItem onClick={() => handlePermissionChange("editor")} sx={{ py: 1 }}>
            <ListItemText
              primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can edit</Typography>}
              secondary={<Typography variant="caption" color="text.secondary">Edit, suggest, and comment</Typography>}
            />
            {activeRole === "editor" && <CheckIcon sx={{ fontSize: 16, ml: 1 }} />}
          </MenuItem>

          <MenuItem onClick={() => handlePermissionChange("commenter")} sx={{ py: 1 }}>
            <ListItemText
              primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can comment</Typography>}
              secondary={<Typography variant="caption" color="text.secondary">Suggest and comment</Typography>}
            />
            {activeRole === "commenter" && <CheckIcon sx={{ fontSize: 16, ml: 1 }} />}
          </MenuItem>

          <MenuItem onClick={() => handlePermissionChange("viewer")} sx={{ py: 1 }}>
            <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can view</Typography>} />
            {activeRole === "viewer" && <CheckIcon sx={{ fontSize: 16, ml: 1 }} />}
          </MenuItem>

          <Divider sx={{ my: 0.5 }} />

          {activeCollaboratorId && (
            <MenuItem onClick={handleRemoveCollaborator} sx={{ py: 1, color: "error.main" }}>
              <ListItemIcon sx={{ color: "error.main", minWidth: 30 }}><DeleteOutlinedIcon sx={{ fontSize: 18 }} /></ListItemIcon>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>Remove</Typography>
            </MenuItem>
          )}
        </Menu>

        {/* Invitations Dialog */}
        <Dialog open={openInviteDialog} onClose={() => setOpenInviteDialog(false)}>
          <Box sx={{ p: 2, minWidth: 320 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Shared invitations</Typography>
            {invitations.length === 0 ? (
              <Typography variant="body2">No invitations</Typography>
            ) : (
              invitations.map((inv) => (
                <Box key={inv._id || inv.invitedEmail} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
                  <Box>
                    <Typography variant="subtitle2">{inv.invitedEmail}</Typography>
                    <Typography variant="caption" color="text.secondary">Role: {inv.role}</Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" onClick={() => { if ((inv as any).pageUrl) { window.open((inv as any).pageUrl); } }}>Open</Button>
                    <Button size="small" onClick={() => handleWatchLaterForInvitation(inv)}>Watch later</Button>
                  </Stack>
                </Box>
              ))
            )}
            <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: 'flex-end' }}>
              <Button onClick={() => { setOpenInviteDialog(false); localStorage.setItem('invitationDismissed', 'true'); setInvitations([]); }}>
                Dismiss
              </Button>
            </Stack>
          </Box>
        </Dialog>

   
        {!token && (
          <Stack spacing={1} direction="row" sx={{ my: { xs: 0, sm: 2 }, ml: 1 }}>
            <Button size="small" variant="contained" component={Link} to="/login">Login</Button>
            <Button size="small" variant="contained" component={Link} to="/signup">Sign Up</Button>
          </Stack>
        )}
      </Toolbar>

      {/* Invitations Alert Bar */}
      {invitations.length > 0 && (
        <Box
          sx={{
            px: 2,
            py: 1,
            bgcolor: "#fff7e6",
            borderTop: "1px solid #f3d9a3",
            color: "#7a4b00",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            You have been invited to collaborate with access: {invitations[0].role === "editor" ? "Can edit" : invitations[0].role === "commenter" ? "Can comment" : "Can view"}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              onClick={handleOpenSharedNotes}
              sx={{
                textTransform: "none",
                bgcolor: "#2383e2",
                color: "white",
                borderRadius: 999,
                "&:hover": { bgcolor: "#1a6cb3" },
              }}
            >
              Open shared notes
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={handleWatchLater}
              sx={{
                textTransform: "none",
                borderColor: "#f3d9a3",
                color: "#7a4b00",
                borderRadius: 999,
                bgcolor: "#fff7e6",
                "&:hover": { bgcolor: "#fff1cf", borderColor: "#f3d9a3" },
              }}
            >
              Watch later
            </Button>
          </Stack>
        </Box>
      )}
    </AppBar>
  );
};