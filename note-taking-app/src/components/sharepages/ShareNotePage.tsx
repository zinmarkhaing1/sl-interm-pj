
// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Avatar,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
// } from "@mui/material";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import LinkIcon from "@mui/icons-material/Link";

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

// interface ShareNotePageProps {
//   user: UserProfile | null;
//   collaborators: CollaboratorItem[];
//   setCollaborators: React.Dispatch<React.SetStateAction<CollaboratorItem[]>>;
//   handleOpenPermissionMenu: (
//     event: React.MouseEvent<HTMLButtonElement>,
//     id: string | null,
//     currentRole: string
//   ) => void;
//   getRoleLabel: (role: string) => string;
//   onInvite: (email: string) => Promise<void>; // Add onInvite prop
// }

// export const ShareNotePage: React.FC<ShareNotePageProps> = ({
//   user,
//   collaborators,
//   handleOpenPermissionMenu,
//   getRoleLabel,
//   onInvite, // Receive onInvite
// }) => {
//   const [inviteEmail, setInviteEmail] = useState<string>("");
//   const [copySuccess, setCopySuccess] = useState<boolean>(false);
//   const [isInviting, setIsInviting] = useState<boolean>(false);

//   const handleCopyLink = async () => {
//     try {
//       await navigator.clipboard.writeText(window.location.href);
//       setCopySuccess(true);
//       setTimeout(() => setCopySuccess(false), 2000);
//     } catch (err) {
//       console.error("Failed to copy link: ", err);
//     }
//   };

//   const handleInvite = async () => {
//     if (!inviteEmail.trim()) {
//       alert("Please enter an email address!");
//       return;
//     }
    
//     setIsInviting(true);
//     try {
//       await onInvite(inviteEmail.trim());
//       setInviteEmail("");
//     } catch (error) {
//       console.error("Error inviting collaborator:", error);
//     } finally {
//       setIsInviting(false);
//     }
//   };

//   return (
//     <Box>
//       <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
//         Share Note
//       </Typography>

//       <Box sx={{ display: "flex", gap: 1, mb: 2.5 }}>
//         <TextField
//           fullWidth
//           size="small"
//           placeholder="Add people by email"
//           value={inviteEmail}
//           onChange={(e) => setInviteEmail(e.target.value)}
//           disabled={isInviting}
//           sx={{
//             "& .MuiOutlinedInput-root": {
//               borderRadius: 2,
//               fontSize: "0.875rem",
//             },
//           }}
//         />
//         <Button
//           variant="contained"
//           size="small"
//           onClick={handleInvite}
//           disabled={isInviting || !inviteEmail.trim()}
//           sx={{
//             bgcolor: "#973aa8",
//             textTransform: "none",
//             borderRadius: 2,
//             px: 2.5,
//             "&:hover": { bgcolor: "#7b2c8a" },
//             "&.Mui-disabled": { bgcolor: "#c9a0d4" },
//           }}
//         >
//           {isInviting ? "Inviting..." : "Invite"}
//         </Button>
//       </Box>

//       <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary", mb: 1 }}>
//         People with access
//       </Typography>

//       <List disablePadding sx={{ maxHeight: 180, overflowY: "auto", mb: 2 }}>
//         {user && (
//           <ListItem disableGutters sx={{ py: 0.75 }}>
//             <ListItemAvatar sx={{ minWidth: 40 }}>
//               <Avatar
//                 src={user.photo}
//                 alt={user.firstName}
//                 sx={{ width: 32, height: 32, bgcolor: "#973aa8", fontSize: "14px" }}
//               >
//                 {user.firstName?.charAt(0).toUpperCase()}
//               </Avatar>
//             </ListItemAvatar>
//             <ListItemText
//               primary={
//                 <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                   {user.firstName} {user.lastName} (You)
//                 </Typography>
//               }
//               secondary={
//                 <Typography variant="caption" color="text.secondary">
//                   {user.email}
//                 </Typography>
//               }
//             />
//             <Typography variant="caption" sx={{ color: "text.secondary", pr: 1 }}>
//               Owner
//             </Typography>
//           </ListItem>
//         )}

//         {collaborators
//           .filter((person) => person.invitedEmail !== user?.email)
//           .map((person, index) => (
//             <ListItem 
//               disableGutters 
//               key={person._id || person.invitedEmail || index} 
//               sx={{ py: 0.75 }}
//             >
//               <ListItemAvatar sx={{ minWidth: 40 }}>
//                 <Avatar sx={{ width: 32, height: 32, bgcolor: "action.focus", fontSize: "14px" }}>
//                   {person.invitedEmail ? person.invitedEmail.charAt(0).toUpperCase() : "U"}
//                 </Avatar>
//               </ListItemAvatar>
//               <ListItemText
//                 primary={
//                   <Typography variant="body2">
//                     {person.invitedEmail}
//                   </Typography>
//                 }
//                 secondary={
//                   <Typography variant="caption" color="text.secondary">
//                     {person.status === "accepted" ? "Active" : "Invited"}
//                   </Typography>
//                 }
//               />
//               <Button
//                 size="small"
//                 endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14 }} />}
//                 onClick={(e) => handleOpenPermissionMenu(e, person._id || null, person.role)}
//                 sx={{
//                   textTransform: "none",
//                   color: "text.secondary",
//                   fontSize: "0.75rem",
//                   py: 0.5,
//                 }}
//               >
//                 {getRoleLabel(person.role)}
//               </Button>
//             </ListItem>
//           ))}
//       </List>

//       <Box
//         sx={{
//           pt: 1.5,
//           borderTop: "1px solid",
//           borderColor: "divider",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <Button
//           startIcon={<LinkIcon sx={{ transform: "rotate(-45deg)" }} />}
//           onClick={handleCopyLink}
//           sx={{
//             textTransform: "none",
//             color: "#973aa8",
//             fontSize: "0.85rem",
//             fontWeight: 500,
//             "&:hover": { bgcolor: "transparent", opacity: 0.8 },
//           }}
//         >
//           {copySuccess ? "Copied link!" : "Copy link"}
//         </Button>
//       </Box>
//     </Box>
//   );
// };
