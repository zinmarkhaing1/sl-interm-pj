

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
//   ListItemText,
//   ListItemIcon,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
// import NightlightIcon from "@mui/icons-material/Nightlight";
// import notebook from "../../navicons/34864fc706609d92a131368af91c1e8b-removebg-preview.png";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import HelpOutlineIcon from "@mui/icons-material/HelpOutlined";
// import NotificationsIcon from "@mui/icons-material/NotificationsNone";
// import CheckIcon from "@mui/icons-material/Check";
// import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
// import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
// import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
// import { useState, useEffect, useRef, useCallback } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import {
//   useGetNotificationsQuery,
//   useMarkNotificationReadMutation,
//   useGetCollaboratorsQuery,
//   useGetInvitationsQuery,
// } from "../../services/noteApi";
// import { useTheme } from "../../Context/ThemeContext";

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
//   lastName?: string;
//   email?: string;
//   photo?: string;
// }

// interface HeaderBarProps {
//   onMenuClick: () => void;
// }

// export const HeaderBar = ({ onMenuClick }: HeaderBarProps) => {
//   const { darkMode, toggleDarkMode } = useTheme();
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
//   const [tabValue, setTabValue] = useState<number>(0);
//   const [email, setEmail] = useState<string>("");
//   const [inviteMessage, setInviteMessage] = useState<string>("");
//   const [isInviting, setIsInviting] = useState<boolean>(false);
//   const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
//   const [activeCollaboratorId, setActiveCollaboratorId] = useState<string | null>(null);
//   const [activeRole, setActiveRole] = useState<string>("full");
//   const [notificationAnchor, setNotificationAnchor] = useState<HTMLElement | null>(null);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [openInviteDialog, setOpenInviteDialog] = useState(false);
//   const [profileMenuAnchor, setProfileMenuAnchor] = useState<HTMLElement | null>(null);
//   const [processingInvite, setProcessingInvite] = useState<string | null>(null);

//   const hasLoadedRef = useRef(false);

 
//   const {
//     data: collaboratorsData,
//     refetch: refetchCollaborators,
//   } = useGetCollaboratorsQuery(undefined, { skip: !token });

//   const {
//     data: invitationsData,
//     refetch: refetchInvitations,
//   } = useGetInvitationsQuery(undefined, { skip: !token });


//   const collaborators = collaboratorsData?.collaborators || [];
//   const invitations = invitationsData?.invitations || [];

//   // ---------- Load User ----------
//   const loadUser = useCallback(() => {
//     const storedUser = localStorage.getItem("user");
//     if (!storedUser) {
//       setUser(null);
//       return;
//     }
//     try {
//       setUser(JSON.parse(storedUser));
//     } catch {
//       setUser(null);
//       localStorage.removeItem("user");
//     }
//   }, []);

//   // ---------- Refresh All Data ----------
//   const refreshData = useCallback(() => {
//     loadUser();
//     if (token) {
//       refetchCollaborators();
//       refetchInvitations();
//     }
//   }, [loadUser, refetchCollaborators, refetchInvitations, token]);

//   // ---------- Initial Load ----------
//   useEffect(() => {
//     if (hasLoadedRef.current) return;
//     hasLoadedRef.current = true;
//     refreshData();
//   }, [refreshData]);

//   // ---------- Event Listeners ----------
//   useEffect(() => {
//     const handleProfileUpdated = (event: Event) => {
//       const updatedUser = (event as CustomEvent<UserProfile>).detail;
//       if (updatedUser) {
//         setUser(updatedUser);
//         return;
//       }
//       loadUser();
//     };

//     window.addEventListener("profileUpdated", handleProfileUpdated);
//     window.addEventListener("storage", refreshData);
//     window.addEventListener("focus", refreshData);

//     return () => {
//       window.removeEventListener("profileUpdated", handleProfileUpdated);
//       window.removeEventListener("storage", refreshData);
//       window.removeEventListener("focus", refreshData);
//     };
//   }, [loadUser, refreshData]);

//   // ---------- Invitation Dialog Logic ----------
//   useEffect(() => {
//     if (invitations.length > 0 && localStorage.getItem("invitationDismissed") !== "true") {
//       setOpenInviteDialog(true);
//     }
//   }, [invitations]);

//   // ---------- Notifications ----------
//   const { data: notificationData } = useGetNotificationsQuery(undefined, {
//     skip: !token,
//   });

//   const [markNotificationRead] = useMarkNotificationReadMutation();

//   useEffect(() => {
//     if (notificationData?.notifications) {
//       setUnreadCount(
//         notificationData.notifications.filter((item) => !item.isRead).length
//       );
//     }
//   }, [notificationData]);

//   // ---------- Handlers ----------
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

//   const handleShareClose = () => {
//     setAnchorEl(null);
//   };

//   const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//     setProfileMenuAnchor(event.currentTarget);
//   };

//   const handleProfileMenuClose = () => {
//     setProfileMenuAnchor(null);
//   };

//   const handleLogout = () => {
//     handleProfileMenuClose();
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
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

//   // ---------- Invite People ----------
//   const handleInvite = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!email.trim()) {
//       setInviteMessage("Please enter at least one email address.");
//       return;
//     }
//     const emailList = email
//       .split(",")
//       .map((str) => str.trim())
//       .filter((str) => str !== "");
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
//         setInviteMessage(
//           data.message ||
//             `Invite sent to ${emailList.length} email${emailList.length > 1 ? "s" : ""}.`
//         );
//         setEmail("");
      
//         refetchCollaborators();
//       } else {
//         const errorData = await response.json().catch(() => ({}));
//         setInviteMessage(errorData.message || "Unable to send invitations right now.");
//       }
//     } catch {
//       setInviteMessage("Unable to send invitations right now.");
//     } finally {
//       setIsInviting(false);
//     }
//   };

//   const handleCopyLink = () => {
//     navigator.clipboard.writeText(window.location.href);
//     alert("Link copied to clipboard!");
//   };

//   // ---------- Accept / Decline Invitation ----------
//   const handleAcceptInvitation = async (notification: any) => {
//     const invitationId = notification.invitationId;
//     if (!invitationId) {
//       alert("Invitation ID missing");
//       return;
//     }
//     setProcessingInvite(invitationId);
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/share/accept/${invitationId}`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         await markNotificationRead(notification._id).unwrap();
      
//         refetchCollaborators();
//         refetchInvitations();
//         window.dispatchEvent(new Event("storage"));
//         if (data.pageUrl) {
//           window.location.href = data.pageUrl;
//         } else {
//           alert("Invitation accepted!");
//         }
//       } else {
//         const err = await response.json().catch(() => ({}));
//         alert(err.message || "Failed to accept.");
//       }
//     } catch (error) {
//       console.error("Accept error:", error);
//       alert("An error occurred.");
//     } finally {
//       setProcessingInvite(null);
//     }
//   };

//   const handleDeclineInvitation = async (notification: any) => {
//     const invitationId = notification.invitationId;
//     if (!invitationId) {
//       alert("Invitation ID missing");
//       return;
//     }
//     setProcessingInvite(invitationId);
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/share/decline/${invitationId}`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.ok) {
//         await markNotificationRead(notification._id).unwrap();
//         refetchCollaborators();
//         refetchInvitations();
//         window.dispatchEvent(new Event("storage"));
//         alert("Invitation declined.");
//       } else {
//         const err = await response.json().catch(() => ({}));
//         alert(err.message || "Failed to decline.");
//       }
//     } catch (error) {
//       console.error("Decline error:", error);
//       alert("An error occurred.");
//     } finally {
//       setProcessingInvite(null);
//     }
//   };

//   const dismissInvitationNotice = () => {
//     setOpenInviteDialog(false);
//     localStorage.setItem("invitationDismissed", "true");
  
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
//     try {
//       arr = JSON.parse(localStorage.getItem("watchLaterSharedNotes") || "[]");
//     } catch {
//       arr = [];
//     }
//     if (!arr.includes(noteId)) arr.push(noteId);
//     localStorage.setItem("watchLaterSharedNotes", JSON.stringify(arr));
//     localStorage.setItem("sharedNotesRequested", "true");
//     localStorage.setItem("invitationDismissed", "true");
//     setOpenInviteDialog(false);
//     alert("Saved to Watch Later");
//   };

//   // ---------- Collaborator Permission Menu ----------
//   const handleOpenPermissionMenu = (
//     event: React.MouseEvent<HTMLButtonElement>,
//     id: string | null,
//     currentRole: string
//   ) => {
//     setMenuAnchorEl(event.currentTarget);
//     setActiveCollaboratorId(id);
//     setActiveRole(currentRole || "full");
//   };

//   const handleClosePermissionMenu = () => {
//     setMenuAnchorEl(null);
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
      
//         refetchCollaborators();
//       }
//     } catch {
//       // Handle Error
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
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
//           },
//         }
//       );
//       if (response.ok) {
//         refetchCollaborators();
//       }
//     } catch {
//       // Error handling
//     } finally {
//       handleClosePermissionMenu();
//     }
//   };

//   const getRoleLabel = (role: string) => {
//     if (role === "full") return "Full access";
//     if (role === "editor") return "Can edit";
//     if (role === "edit_content") return "Can edit content";
//     if (role === "commenter") return "Can comment";
//     return "Can view";
//   };

//   const isShareOpen = Boolean(anchorEl);
//   const shareId = isShareOpen ? "share-popover" : undefined;

//   return (
//     <AppBar
//       position="fixed"
//       elevation={0}
//       sx={{
//         top: 0,
//         left: 0,
//         right: 0,
//         zIndex: (theme) => theme.zIndex.drawer + 1,
//         boxShadow: "none",
//         backgroundColor: "background.paper",
//         color: "text.primary",
//         borderBottom: "1px solid",
//         borderColor: "divider",
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
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.primary" }}>
//           <IconButton onClick={onMenuClick} sx={{ color: "text.primary", p: 1 }}>
//             <MenuIcon />
//           </IconButton>
//           <Box
//             sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
//             onClick={() => navigate("/dashboard")}
//           >
//             <Box component="img" src={notebook} alt="notebook" sx={{ width: 35, height: 35 }} />
//             <Typography
//               sx={{
//                 fontSize: { xs: "1rem", sm: "1.2rem" },
//                 whiteSpace: "nowrap",
//                 lineHeight: 1,
//                 letterSpacing: "0.5px",
//               }}
//             >
//               Note Book
//             </Typography>
//           </Box>
//         </Box>

//         <Box sx={{ flexGrow: 1 }} />

//         <IconButton
//           sx={{ color: "text.primary", mr: 1 }}
//           onClick={() => toggleDarkMode()}
//         >
//           {darkMode ? <NightlightIcon /> : <LightModeOutlinedIcon />}
//         </IconButton>

//         <IconButton
//           sx={{ color: "text.primary", mr: 1 }}
//           onClick={handleNotificationToggle}
//         >
//           <Badge badgeContent={unreadCount} sx={{ "& .MuiBadge-badge": { color: "#973aa8" } }}>
//             <NotificationsIcon />
//           </Badge>
//         </IconButton>

//         <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0, ml: 0.5 }}>
//           <Avatar
//             src={user?.photo || ""}
//             sx={{
//               width: 36,
//               height: 36,
//               bgcolor: "primary.main",
//               fontSize: "15px",
//               fontWeight: 600,
//             }}
//           >
//             {!user?.photo && (user?.firstName?.charAt(0).toUpperCase() || "U")}
//           </Avatar>
//         </IconButton>

//         {/* Notification Popover */}
//         <Popover
//           id={notificationAnchor ? "notification-popover" : undefined}
//           open={Boolean(notificationAnchor)}
//           anchorEl={notificationAnchor}
//           onClose={handleNotificationClose}
//           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//           transformOrigin={{ vertical: "top", horizontal: "right" }}
//           slotProps={{
//             paper: {
//               sx: {
//                 width: 320,
//                 p: 2,
//                 mt: 1,
//                 borderRadius: 2,
//                 bgcolor: "background.paper",
//               },
//             },
//           }}
//         >
//           <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
//             Notifications
//           </Typography>
//           {notificationData?.notifications?.length ? (
//             notificationData.notifications.map((notification) => {
//               const notif = notification as any;
//               const isInvitation = notif?.type === "invite" || notif?.type === "share_invitation";

//               return (
//                 <Box key={notif._id} sx={{ fontSize: 12, mb: 1, p: 1, borderRadius: 1, bgcolor: notif.isRead ? "#fafafa" : "#f2f7ff" }}>
//                   <Typography variant="body2">{notif.message}</Typography>
//                   <Typography variant="caption" color="text.secondary">
//                     {new Date(notif.createdAt).toLocaleString()}
//                   </Typography>
//                   {!notif.isRead && (
//                     <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
//                       {isInvitation ? (
//                         <>
//                           <Button
//                             size="small"
//                             variant="contained"
//                             color="primary"
//                             disabled={processingInvite === notif.invitationId}
//                             onClick={() => handleAcceptInvitation(notif)}
//                           >
//                             Accept
//                           </Button>
//                           <Button
//                             size="small"
//                             variant="outlined"
//                             color="error"
//                             disabled={processingInvite === notif.invitationId}
//                             onClick={() => handleDeclineInvitation(notif)}
//                           >
//                             Decline
//                           </Button>
//                         </>
//                       ) : (
//                         <Button size="small" onClick={() => handleMarkRead(notif._id)}>
//                           Mark as read
//                         </Button>
//                       )}
//                     </Box>
//                   )}
//                 </Box>
//               );
//             })
//           ) : (
//             <Typography variant="body2" color="text.secondary">
//               No notifications yet.
//             </Typography>
//           )}
//         </Popover>

//         {/* Share Popover */}
//         <Popover
//           id={shareId}
//           open={isShareOpen}
//           anchorEl={anchorEl}
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
//                 bgcolor: "background.default",
//                 color: "text.primary",
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
//           </Tabs>

//           {tabValue === 0 && (
//             <Box>
//               <Box
//                 component="form"
//                 onSubmit={handleInvite}
//                 sx={{ display: "flex", gap: 1, mb: 2.5 }}
//               >
//                 <TextField
//                   fullWidth
//                   size="small"
//                   placeholder="Email or group, separated by commas"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   sx={{ "& .MuiOutlinedInput-root": { fontSize: "13px" } }}
//                 />
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   disableElevation
//                   disabled={isInviting}
//                   sx={{
//                     textTransform: "none",
//                     bgcolor: "#e9c0f1",
//                     "&:hover": { bgcolor: "#973aa8", color: "white" },
//                   }}
//                 >
//                   {isInviting ? "Sending..." : "Invite"}
//                 </Button>
//               </Box>

//               {inviteMessage && (
//                 <Typography
//                   variant="body2"
//                   sx={{
//                     mb: 1.5,
//                     color:
//                       inviteMessage.includes("Unable") || inviteMessage.includes("Please")
//                         ? "error.main"
//                         : "success.main",
//                   }}
//                 >
//                   {inviteMessage}
//                 </Typography>
//               )}

//               {/* Current User */}
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   mb: 2,
//                   color: "text.primary",
//                 }}
//               >
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//                   <Avatar
//                     src={user?.photo || ""}
//                     sx={{
//                       width: 36,
//                       height: 36,
//                       bgcolor: "#e3e3e3",
//                     }}
//                   >
//                     {!user?.photo && (user?.firstName?.charAt(0) || "U")}
//                   </Avatar>
//                   <Box>
//                     <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "13.5px" }}>
//                       {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : ""} (You)
//                     </Typography>
//                     <Typography
//                       variant="caption"
//                       color="text.secondary"
//                       sx={{ display: "block", fontSize: "11px" }}
//                     >
//                       {user?.email}
//                     </Typography>
//                   </Box>
//                 </Box>
//                 <Button
//                   size="small"
//                   variant="text"
//                   endIcon={<KeyboardArrowDownIcon />}
//                   onClick={(e) => handleOpenPermissionMenu(e, null, "full")}
//                   sx={{ textTransform: "none", color: "text.secondary", fontSize: "13px" }}
//                 >
//                   Full access
//                 </Button>
//               </Box>

//               {/* Collaborators List */}
//               <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
//                 {collaborators.map((person: CollaboratorItem) => (
//                   <Box
//                     key={person._id || person.invitedEmail}
//                     sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
//                   >
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//                       <Avatar
//                         sx={{
//                           width: 36,
//                           height: 36,
//                           bgcolor: "#e8f3ff",
//                           color: "#1a6cb3",
//                           fontSize: "14px",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         {person.invitedEmail.charAt(0).toUpperCase()}
//                       </Avatar>
//                       <Box>
//                         <Typography variant="body2" sx={{ fontSize: "13.5px", fontWeight: 500 }}>
//                           {person.invitedEmail}
//                         </Typography>
//                         <Typography
//                           variant="caption"
//                           color="text.secondary"
//                           sx={{
//                             display: "inline-block",
//                             bgcolor: "background.default",
//                             px: 0.8,
//                             py: 0.1,
//                             borderRadius: 1,
//                             fontSize: "10px",
//                             fontWeight: 600,
//                             mt: 0.3,
//                           }}
//                         >
//                           {person.status === "accepted" ? "Active" : "Invited"}
//                         </Typography>
//                       </Box>
//                     </Box>
//                     <Button
//                       size="small"
//                       variant="text"
//                       endIcon={<KeyboardArrowDownIcon />}
//                       onClick={(e) =>
//                         handleOpenPermissionMenu(e, person._id || null, person.role)
//                       }
//                       sx={{
//                         textTransform: "none",
//                         color: "text.primary",
//                         fontSize: "13px",
//                         bgcolor: "background.default",
//                         borderRadius: 3,
//                         px: 1,
//                       }}
//                     >
//                       {getRoleLabel(person.role)}
//                     </Button>
//                   </Box>
//                 ))}
//               </Box>

//               <Typography
//                 variant="caption"
//                 sx={{ fontWeight: 600, color: "text.secondary", display: "block", mb: 1 }}
//               >
//                 General access
//               </Typography>
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
//                 <Avatar sx={{ width: 32, height: 32, bgcolor: "#f0f0f0" }}>🔒</Avatar>
//                 <Typography variant="body2" color="text.secondary" sx={{ fontSize: "13px" }}>
//                   Only people invited can open this link
//                 </Typography>
//               </Box>

//               <Divider sx={{ my: 1.5 }} />

//               <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 0.5,
//                     color: "text.secondary",
//                     cursor: "pointer",
//                   }}
//                 >
//                   <HelpOutlineIcon sx={{ fontSize: 16 }} />
//                   <Typography variant="caption" sx={{ fontSize: "12px" }}>
//                     Learn about sharing
//                   </Typography>
//                 </Box>
//                 <Button
//                   size="small"
//                   variant="outlined"
//                   startIcon={<ContentCopyIcon sx={{ fontSize: 14 }} />}
//                   onClick={handleCopyLink}
//                   sx={{
//                     textTransform: "none",
//                     borderRadius: 2,
//                     borderColor: "#e0e0e0",
//                     color: "text.primary",
//                   }}
//                 >
//                   Copy link
//                 </Button>
//               </Box>
//             </Box>
//           )}
//         </Popover>

//         {/* User Profile Dropdown Menu */}
//         <Menu
//           anchorEl={profileMenuAnchor}
//           open={Boolean(profileMenuAnchor)}
//           onClose={handleProfileMenuClose}
//           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//           transformOrigin={{ vertical: "top", horizontal: "right" }}
//           slotProps={{
//             paper: {
//               sx: {
//                 width: 240,
//                 borderRadius: 3,
//                 mt: 1.5,
//                 p: 0.5,
//                 boxShadow: "0px 4px 16px rgba(0,0,0,0.1)",
//               },
//             },
//           }}
//         >
//           <Box sx={{ px: 2, py: 1.5 }}>
//             <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
//               {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : ""}
//             </Typography>
//             <Typography
//               variant="caption"
//               color="text.secondary"
//               sx={{
//                 display: "block",
//                 mt: 0.2,
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               {user?.email || ""}
//             </Typography>
//           </Box>

//           <Divider sx={{ my: 0.5 }} />

//           <MenuItem
//             onClick={() => {
//               handleProfileMenuClose();
//               navigate("/profile");
//             }}
//             sx={{ py: 1, borderRadius: 1.5 }}
//           >
//             <ListItemIcon sx={{ minWidth: 32 }}>
//               <AccountCircleOutlinedIcon sx={{ fontSize: 20 }} />
//             </ListItemIcon>
//             <ListItemText primary={<Typography variant="body2">My Profile</Typography>} />
//           </MenuItem>

//           <MenuItem onClick={handleLogout} sx={{ py: 1, color: "error.main", borderRadius: 1.5 }}>
//             <ListItemIcon sx={{ minWidth: 32, color: "error.main" }}>
//               <LogoutOutlinedIcon sx={{ fontSize: 20 }} />
//             </ListItemIcon>
//             <ListItemText
//               primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>Logout</Typography>}
//             />
//           </MenuItem>
//         </Menu>

//         {/* Permission Menu */}
//         <Menu
//           anchorEl={menuAnchorEl}
//           open={Boolean(menuAnchorEl)}
//           onClose={handleClosePermissionMenu}
//           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//           transformOrigin={{ vertical: "top", horizontal: "right" }}
//           slotProps={{
//             paper: {
//               sx: {
//                 width: 340,
//                 borderRadius: 3,
//                 p: 0.5,
//                 boxShadow: "0px 4px 16px rgba(0,0,0,0.12)",
//               },
//             },
//           }}
//         >
//           <MenuItem onClick={() => handlePermissionChange("full")} sx={{ py: 1 }}>
//             <ListItemText
//               primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Full access</Typography>}
//               secondary={
//                 <Typography variant="caption" color="text.secondary">
//                   Edit, suggest, comment, and share
//                 </Typography>
//               }
//             />
//             {activeRole === "full" && <CheckIcon sx={{ fontSize: 16, ml: 1 }} />}
//           </MenuItem>

//           <MenuItem onClick={() => handlePermissionChange("editor")} sx={{ py: 1 }}>
//             <ListItemText
//               primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can edit</Typography>}
//               secondary={
//                 <Typography variant="caption" color="text.secondary">
//                   Edit, suggest, and comment
//                 </Typography>
//               }
//             />
//             {activeRole === "editor" && <CheckIcon sx={{ fontSize: 16, ml: 1 }} />}
//           </MenuItem>

//           <MenuItem onClick={() => handlePermissionChange("commenter")} sx={{ py: 1 }}>
//             <ListItemText
//               primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can comment</Typography>}
//               secondary={
//                 <Typography variant="caption" color="text.secondary">
//                   Suggest and comment
//                 </Typography>
//               }
//             />
//             {activeRole === "commenter" && <CheckIcon sx={{ fontSize: 16, ml: 1 }} />}
//           </MenuItem>

//           <MenuItem onClick={() => handlePermissionChange("viewer")} sx={{ py: 1 }}>
//             <ListItemText
//               primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can view</Typography>}
//             />
//             {activeRole === "viewer" && <CheckIcon sx={{ fontSize: 16, ml: 1 }} />}
//           </MenuItem>

//           <Divider sx={{ my: 0.5 }} />

//           {activeCollaboratorId && (
//             <MenuItem onClick={handleRemoveCollaborator} sx={{ py: 1, color: "error.main" }}>
//               <ListItemIcon sx={{ color: "error.main", minWidth: 30 }}>
//                 <DeleteOutlinedIcon sx={{ fontSize: 18 }} />
//               </ListItemIcon>
//               <Typography variant="body2" sx={{ fontWeight: 500 }}>Remove</Typography>
//             </MenuItem>
//           )}
//         </Menu>

//         {/* Invitations Dialog */}
//         <Dialog open={openInviteDialog} onClose={() => setOpenInviteDialog(false)}>
//           <Box sx={{ p: 2, minWidth: 320 }}>
//             <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
//               Shared invitations
//             </Typography>
//             {invitations.length === 0 ? (
//               <Typography variant="body2">No invitations</Typography>
//             ) : (
//               invitations.map((inv) => (
//                 <Box
//                   key={inv._id || inv.invitedEmail}
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     py: 1,
//                   }}
//                 >
//                   <Box>
//                     <Typography variant="subtitle2">{inv.invitedEmail}</Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       Role: {inv.role}
//                     </Typography>
//                   </Box>
//                   <Stack direction="row" spacing={1}>
//                     <Button
//                       size="small"
//                       onClick={() => {
//                         if ((inv as any).pageUrl) {
//                           window.open((inv as any).pageUrl);
//                         }
//                       }}
//                     >
//                       Open
//                     </Button>
//                     <Button size="small" onClick={() => handleWatchLaterForInvitation(inv)}>
//                       Watch later
//                     </Button>
//                   </Stack>
//                 </Box>
//               ))
//             )}
//             <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: "flex-end" }}>
//               <Button
//                 onClick={() => {
//                   setOpenInviteDialog(false);
//                   localStorage.setItem("invitationDismissed", "true");
//                 }}
//               >
//                 Dismiss
//               </Button>
//             </Stack>
//           </Box>
//         </Dialog>

//         {/* Auth Buttons */}
//         {!token && (
//           <Stack spacing={1} direction="row" sx={{ my: { xs: 0, sm: 2 }, ml: 1 }}>
//             <Button size="small" variant="contained" component={Link} to="/login">
//               Login
//             </Button>
//             <Button size="small" variant="contained" component={Link} to="/signup">
//               Sign Up
//             </Button>
//           </Stack>
//         )}
//       </Toolbar>

//       {/* Invitations Alert Bar */}
//       {/* {invitations.length > 0 && (
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
//             You have been invited to collaborate with access:{" "}
//             {invitations[0].role === "editor"
//               ? "Can edit"
//               : invitations[0].role === "commenter"
//               ? "Can comment"
//               : "Can view"}
//           </Typography> */}
//           {/* <Stack direction="row" spacing={1}>
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
//             </Button> */}
//             {/* <Button
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
//             </Button> */}
//           {/* </Stack> */}
//         {/* </Box> */}
//       {/* )} */}
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
  Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import NightlightIcon from "@mui/icons-material/Nightlight";
import notebook from "../../navicons/34864fc706609d92a131368af91c1e8b-removebg-preview.png";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlined";
import NotificationsIcon from "@mui/icons-material/NotificationsNone";
import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useGetCollaboratorsQuery,
  useGetInvitationsQuery,
} from "../../services/noteApi";
import { useTheme } from "../../Context/ThemeContext";

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
  const { darkMode, toggleDarkMode } = useTheme();
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [tabValue, setTabValue] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [inviteMessage, setInviteMessage] = useState<string>("");
  const [isInviting, setIsInviting] = useState<boolean>(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [activeCollaboratorId, setActiveCollaboratorId] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<string>("full");
  const [notificationAnchor, setNotificationAnchor] = useState<HTMLElement | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<HTMLElement | null>(null);
  const [processingInvite, setProcessingInvite] = useState<string | null>(null);

  const hasLoadedRef = useRef(false);

  // ---- RTK Query Hooks ----
  const {
    data: collaboratorsData,
    refetch: refetchCollaborators,
  } = useGetCollaboratorsQuery(undefined, { skip: !token });

  const {
    data: notificationData,
    refetch: refetchNotifications,
  } = useGetNotificationsQuery(undefined, {
    skip: !token,
  });

  const {
    data: invitationsData,
    refetch: refetchInvitations,
  } = useGetInvitationsQuery(undefined, { skip: !token });

  const [markNotificationRead] = useMarkNotificationReadMutation();

  const collaborators = collaboratorsData?.collaborators || [];
  const invitations = invitationsData?.invitations || [];

  // ---------- Delete Notification Helper (with Debug Logs) ----------
  const deleteNotification = async (notificationId: string) => {
    if (!notificationId) {
      console.error("❌ No notification ID provided");
      return false;
    }

    console.log("🗑️ Attempting to delete notification:", notificationId);

    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📡 Delete response status:", response.status);

      if (response.ok) {
        console.log("✅ Notification deleted successfully:", notificationId);
        return true;
      } else {
        const errorText = await response.text();
        console.error("❌ Delete failed:", response.status, errorText);
        return false;
      }
    } catch (err) {
      console.error("❌ Delete error:", err);
      return false;
    }
  };

  // ---------- Load User ----------
  const loadUser = useCallback(() => {
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
  }, []);

  // ---------- Refresh All Data ----------
  const refreshData = useCallback(() => {
    loadUser();
    if (token) {
      refetchCollaborators();
      refetchInvitations();
      refetchNotifications();
    }
  }, [loadUser, refetchCollaborators, refetchInvitations, refetchNotifications, token]);

  // ---------- Initial Load ----------
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    refreshData();
  }, [refreshData]);

  // ---------- Event Listeners ----------
  useEffect(() => {
    const handleProfileUpdated = (event: Event) => {
      const updatedUser = (event as CustomEvent<UserProfile>).detail;
      if (updatedUser) {
        setUser(updatedUser);
        return;
      }
      loadUser();
    };

    window.addEventListener("profileUpdated", handleProfileUpdated);
    window.addEventListener("storage", refreshData);
    window.addEventListener("focus", refreshData);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdated);
      window.removeEventListener("storage", refreshData);
      window.removeEventListener("focus", refreshData);
    };
  }, [loadUser, refreshData]);

  // ---------- Invitation Dialog Logic ----------
  useEffect(() => {
    if (invitations.length > 0 && localStorage.getItem("invitationDismissed") !== "true") {
      setOpenInviteDialog(true);
    }
  }, [invitations]);

  // ---------- Unread Count ----------
  useEffect(() => {
    if (notificationData?.notifications) {
      setUnreadCount(
        notificationData.notifications.filter((item) => !item.isRead).length
      );
    }
  }, [notificationData]);

  // ---------- Handlers ----------
  const handleNotificationToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNotificationAnchor(notificationAnchor ? null : event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  // 👇 Mark as read → Delete Notification
  // const handleMarkRead = async (notification: any) => {
  //   console.log("📌 Mark as read clicked for:", notification._id);
  //   const success = await deleteNotification(notification._id);
  //   if (success) {
  //     setNotificationAnchor(null);
  //     refetchNotifications?.();
  //   } else {
  //     alert("Failed to delete notification. Please check console for details.");
  //   }
  // };

    const handleMarkRead = async (notification: any) => {
    await markNotificationRead(notification._id).unwrap().catch(() => null);
    setNotificationAnchor(null);
    refetchNotifications?.();
  };

  const handleShareClose = () => {
    setAnchorEl(null);
  };

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

  // ---------- Invite People ----------
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setInviteMessage("Please enter at least one email address.");
      return;
    }
    const emailList = email
      .split(",")
      .map((str) => str.trim())
      .filter((str) => str !== "");
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
        setInviteMessage(
          data.message ||
            `Invite sent to ${emailList.length} email${emailList.length > 1 ? "s" : ""}.`
        );
        setEmail("");
        refetchCollaborators();
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
    alert("Link copied to clipboard!");
  };

  // ---------- Accept Invitation ----------
  const handleAcceptInvitation = async (notification: any) => {
    const invitationId = notification.invitationId;
    if (!invitationId) {
      alert("Invitation ID missing");
      return;
    }
    setProcessingInvite(invitationId);
    try {
      const response = await fetch(
        `http://localhost:5000/api/share/accept/${invitationId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

       if (response.ok) {
        const data = await response.json();
        await markNotificationRead(notification._id).unwrap().catch(() => null);
        refetchCollaborators();
        refetchInvitations();
        refetchNotifications?.();
        window.dispatchEvent(new Event("storage"));
        if (data.pageUrl) {
          window.location.href = data.pageUrl;
        } else {
          alert("Invitation accepted!");
        }
      } else {
        const err = await response.json().catch(() => ({}));
        alert(err.message || "Failed to accept.");
      }
    } catch (error) {
      console.error("Accept error:", error);
      alert("An error occurred.");
    } finally {
      setProcessingInvite(null);
      setNotificationAnchor(null);
    }
  };

  // ---------- Decline Invitation ----------
  const handleDeclineInvitation = async (notification: any) => {
    const invitationId = notification.invitationId;
    if (!invitationId) {
      alert("Invitation ID missing");
      return;
    }
    setProcessingInvite(invitationId);
    try {
      const response = await fetch(
        `http://localhost:5000/api/share/decline/${invitationId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Delete notification after decline
        console.log("✅ Decline success, deleting notification:", notification._id);
        await markNotificationRead(notification._id).unwrap().catch(() => null);
        refetchCollaborators();
        refetchInvitations();
        refetchNotifications?.();
        window.dispatchEvent(new Event("storage"));
        alert("Invitation declined.");
      } else {
        const err = await response.json().catch(() => ({}));
        alert(err.message || "Failed to decline.");
      }
    } catch (error) {
      console.error("Decline error:", error);
      alert("An error occurred.");
    } finally {
      setProcessingInvite(null);
      setNotificationAnchor(null);
    }
  };

  useEffect(() => {
    if (notificationData?.notifications) {
      setUnreadCount(
        notificationData.notifications.filter((item) => !item.isRead).length
      );
    }
  }, [notificationData]);

  const dismissInvitationNotice = () => {
    setOpenInviteDialog(false);
    localStorage.setItem("invitationDismissed", "true");
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
    try {
      arr = JSON.parse(localStorage.getItem("watchLaterSharedNotes") || "[]");
    } catch {
      arr = [];
    }
    if (!arr.includes(noteId)) arr.push(noteId);
    localStorage.setItem("watchLaterSharedNotes", JSON.stringify(arr));
    localStorage.setItem("sharedNotesRequested", "true");
    localStorage.setItem("invitationDismissed", "true");
    setOpenInviteDialog(false);
    alert("Saved to Watch Later");
  };

  // ---------- Collaborator Permission Menu ----------
  const handleOpenPermissionMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string | null,
    currentRole: string
  ) => {
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
        refetchCollaborators();
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
      const response = await fetch(
        `http://localhost:5000/api/share/${activeCollaboratorId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      if (response.ok) {
        refetchCollaborators();
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
  const shareId = isShareOpen ? "share-popover" : undefined;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        top: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: "none",
        backgroundColor: "background.paper",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar
        sx={{
          height: 64,
          px: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.primary" }}>
          <IconButton onClick={onMenuClick} sx={{ color: "text.primary", p: 1 }}>
            <MenuIcon />
          </IconButton>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          >
            <Box component="img" src={notebook} alt="notebook" sx={{ width: 35, height: 35 }} />
            <Typography
              sx={{
                fontSize: { xs: "1rem", sm: "1.2rem" },
                whiteSpace: "nowrap",
                lineHeight: 1,
                letterSpacing: "0.5px",
              }}
            >
              Note Book
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton
          sx={{ color: "text.primary", mr: 1 }}
          onClick={() => toggleDarkMode()}
        >
          {darkMode ? <NightlightIcon /> : <LightModeOutlinedIcon />}
        </IconButton>

        <IconButton
          sx={{ color: "text.primary", mr: 1 }}
          onClick={handleNotificationToggle}
        >
          <Badge badgeContent={unreadCount} sx={{ "& .MuiBadge-badge": { color: "#973aa8" } }}>
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0, ml: 0.5 }}>
          <Avatar
            src={user?.photo || ""}
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primary.main",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            {!user?.photo && (user?.firstName?.charAt(0).toUpperCase() || "U")}
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
          slotProps={{
            paper: {
              sx: {
                width: 320,
                p: 2,
                mt: 1,
                borderRadius: 2,
                bgcolor: "background.paper",
              },
            },
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
            Notifications
          </Typography>
         {notificationData?.notifications?.filter((n) => !n.isRead).length ? (
          notificationData.notifications
            .filter((n) => !n.isRead) 
            .map((notification) => {
              const notif = notification as any;
              const isInvitation = notif?.type === "invite" || notif?.type === "share_invitation";

              return (
                <Box
                  key={notif._id}
                  sx={{
                    fontSize: 12,
                    mb: 1,
                    p: 1,
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                  }}
                >
                  <Typography variant="body2">
                    {notif.message}
                    {notif.source === "project_member" && (
                      <Chip
                        label="Project Member"
                        size="small"
                        color="primary"
                        sx={{ ml: 1, height: 18, fontSize: "10px" }}
                      />
                    )}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(notif.createdAt).toLocaleString()}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 0.5 ,bgcolor:'background.paper'}}>
                    {isInvitation ? (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          disabled={processingInvite === notif.invitationId}
                          onClick={() => handleAcceptInvitation(notif)}
                        >
                          Accept
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          disabled={processingInvite === notif.invitationId}
                          onClick={() => handleDeclineInvitation(notif)}
                        >
                          Decline
                        </Button>
                      </>
                    ) : (
                      <Button size="small" variant="outlined" onClick={() => handleMarkRead(notif)}>
                        Mark as read
                      </Button>
                    )}
                  </Box>
                </Box>
              );
            })
          ) : (
            <Typography variant="body2" color="text.secondary">
              No unread notifications
            </Typography>
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
          slotProps={{
            paper: {
              sx: {
                width: 420,
                p: 2.5,
                mt: 1,
                borderRadius: 3,
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
                bgcolor: "background.default",
                color: "text.primary",
              },
            },
          }}
        >
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            textColor="primary"
            indicatorColor="primary"
            sx={{ minHeight: 32, mb: 2, borderBottom: "1px solid #f0f0f0" }}
          >
            <Tab label="Share" sx={{ textTransform: "none", minHeight: 32, fontWeight: 600 }} />
          </Tabs>

          {tabValue === 0 && (
            <Box>
              <Box
                component="form"
                onSubmit={handleInvite}
                sx={{ display: "flex", gap: 1, mb: 2.5 }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Email or group, separated by commas"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { fontSize: "13px" } }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disableElevation
                  disabled={isInviting}
                  sx={{
                    textTransform: "none",
                    bgcolor: "#e9c0f1",
                    "&:hover": { bgcolor: "#973aa8", color: "white" },
                  }}
                >
                  {isInviting ? "Sending..." : "Invite"}
                </Button>
              </Box>

              {inviteMessage && (
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1.5,
                    color:
                      inviteMessage.includes("Unable") || inviteMessage.includes("Please")
                        ? "error.main"
                        : "success.main",
                  }}
                >
                  {inviteMessage}
                </Typography>
              )}

              {/* Current User */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                  color: "text.primary",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar
                    src={user?.photo || ""}
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "#e3e3e3",
                    }}
                  >
                    {!user?.photo && (user?.firstName?.charAt(0) || "U")}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "13.5px" }}>
                      {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : ""} (You)
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", fontSize: "11px" }}
                    >
                      {user?.email}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  size="small"
                  variant="text"
                  endIcon={<KeyboardArrowDownIcon />}
                  onClick={(e) => handleOpenPermissionMenu(e, null, "full")}
                  sx={{ textTransform: "none", color: "text.secondary", fontSize: "13px" }}
                >
                  Full access
                </Button>
              </Box>

              {/* Collaborators List */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
                {collaborators.map((person: CollaboratorItem) => (
                  <Box
                    key={person._id || person.invitedEmail}
                    sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: "#e8f3ff",
                          color: "#1a6cb3",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {person.invitedEmail.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontSize: "13.5px", fontWeight: 500 }}>
                          {person.invitedEmail}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "inline-block",
                            bgcolor: "background.default",
                            px: 0.8,
                            py: 0.1,
                            borderRadius: 1,
                            fontSize: "10px",
                            fontWeight: 600,
                            mt: 0.3,
                          }}
                        >
                          {person.status === "accepted" ? "Active" : "Invited"}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      size="small"
                      variant="text"
                      endIcon={<KeyboardArrowDownIcon />}
                      onClick={(e) =>
                        handleOpenPermissionMenu(e, person._id || null, person.role)
                      }
                      sx={{
                        textTransform: "none",
                        color: "text.primary",
                        fontSize: "13px",
                        bgcolor: "background.default",
                        borderRadius: 3,
                        px: 1,
                      }}
                    >
                      {getRoleLabel(person.role)}
                    </Button>
                  </Box>
                ))}
              </Box>

              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: "text.secondary", display: "block", mb: 1 }}
              >
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
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "text.secondary",
                    cursor: "pointer",
                  }}
                >
                  <HelpOutlineIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption" sx={{ fontSize: "12px" }}>
                    Learn about sharing
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<ContentCopyIcon sx={{ fontSize: 14 }} />}
                  onClick={handleCopyLink}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    borderColor: "#e0e0e0",
                    color: "text.primary",
                  }}
                >
                  Copy link
                </Button>
              </Box>
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
          slotProps={{
            paper: {
              sx: {
                width: 240,
                borderRadius: 3,
                mt: 1.5,
                p: 0.5,
                boxShadow: "0px 4px 16px rgba(0,0,0,0.1)",
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
              {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : ""}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mt: 0.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.email || ""}
            </Typography>
          </Box>

          <Divider sx={{ my: 0.5 }} />

          <MenuItem
            onClick={() => {
              handleProfileMenuClose();
              navigate("/profile");
            }}
            sx={{ py: 1, borderRadius: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <AccountCircleOutlinedIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary={<Typography variant="body2">My Profile</Typography>} />
          </MenuItem>

          <MenuItem onClick={handleLogout} sx={{ py: 1, color: "error.main", borderRadius: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 32, color: "error.main" }}>
              <LogoutOutlinedIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>Logout</Typography>}
            />
          </MenuItem>
        </Menu>

        {/* Permission Menu */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
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
          <MenuItem onClick={() => handlePermissionChange("full")} sx={{ py: 1 }}>
            <ListItemText
              primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Full access</Typography>}
              secondary={
                <Typography variant="caption" color="text.secondary">
                  Edit, suggest, comment, and share
                </Typography>
              }
            />
            {activeRole === "full" && <CheckIcon sx={{ fontSize: 16, ml: 1 }} />}
          </MenuItem>

          <MenuItem onClick={() => handlePermissionChange("editor")} sx={{ py: 1 }}>
            <ListItemText
              primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can edit</Typography>}
              secondary={
                <Typography variant="caption" color="text.secondary">
                  Edit, suggest, and comment
                </Typography>
              }
            />
            {activeRole === "editor" && <CheckIcon sx={{ fontSize: 16, ml: 1 }} />}
          </MenuItem>

          <MenuItem onClick={() => handlePermissionChange("commenter")} sx={{ py: 1 }}>
            <ListItemText
              primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can comment</Typography>}
              secondary={
                <Typography variant="caption" color="text.secondary">
                  Suggest and comment
                </Typography>
              }
            />
            {activeRole === "commenter" && <CheckIcon sx={{ fontSize: 16, ml: 1 }} />}
          </MenuItem>

          <MenuItem onClick={() => handlePermissionChange("viewer")} sx={{ py: 1 }}>
            <ListItemText
              primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can view</Typography>}
            />
            {activeRole === "viewer" && <CheckIcon sx={{ fontSize: 16, ml: 1 }} />}
          </MenuItem>

          <Divider sx={{ my: 0.5 }} />

          {activeCollaboratorId && (
            <MenuItem onClick={handleRemoveCollaborator} sx={{ py: 1, color: "error.main" }}>
              <ListItemIcon sx={{ color: "error.main", minWidth: 30 }}>
                <DeleteOutlinedIcon sx={{ fontSize: 18 }} />
              </ListItemIcon>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>Remove</Typography>
            </MenuItem>
          )}
        </Menu>

        {/* Invitations Dialog */}
        <Dialog open={openInviteDialog} onClose={() => setOpenInviteDialog(false)}>
          <Box sx={{ p: 2, minWidth: 320 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
              Shared invitations
            </Typography>
            {invitations.length === 0 ? (
              <Typography variant="body2">No invitations</Typography>
            ) : (
              invitations.map((inv) => (
                <Box
                  key={inv._id || inv.invitedEmail}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 1,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2">{inv.invitedEmail}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Role: {inv.role}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      onClick={() => {
                        if ((inv as any).pageUrl) {
                          window.open((inv as any).pageUrl);
                        }
                      }}
                    >
                      Open
                    </Button>
                    <Button size="small" onClick={() => handleWatchLaterForInvitation(inv)}>
                      Watch later
                    </Button>
                  </Stack>
                </Box>
              ))
            )}
            <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  setOpenInviteDialog(false);
                  localStorage.setItem("invitationDismissed", "true");
                }}
              >
                Dismiss
              </Button>
            </Stack>
          </Box>
        </Dialog>

        {/* Auth Buttons */}
        {!token && (
          <Stack spacing={1} direction="row" sx={{ my: { xs: 0, sm: 2 }, ml: 1 }}>
            <Button size="small" variant="contained" component={Link} to="/login">
              Login
            </Button>
            <Button size="small" variant="contained" component={Link} to="/signup">
              Sign Up
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
};