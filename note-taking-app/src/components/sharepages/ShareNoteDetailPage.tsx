
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
// }

// interface UserProfile {
//   firstName?: string;
//   lastName?: string;
//   email?: string;
//   photo?: string;
// }

// interface ShareNoteDetailPageProps {
//   user: UserProfile | null;
//   collaborators: CollaboratorItem[];
//   setCollaborators: React.Dispatch<React.SetStateAction<CollaboratorItem[]>>;
//   handleOpenPermissionMenu: (
//     event: React.MouseEvent<HTMLButtonElement>,
//     id: string | null,
//     currentRole: string
//   ) => void;
//   getRoleLabel: (role: string) => string;
// }

// export const ShareNoteDetailPage: React.FC<ShareNoteDetailPageProps> = ({
//   user,
//   collaborators,
//   setCollaborators,
//   handleOpenPermissionMenu,
//   getRoleLabel,
// }) => {
//   const [inviteEmail, setInviteEmail] = useState<string>("");
//   const [copySuccess, setCopySuccess] = useState<boolean>(false);

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
//     // if(inviteEmail.trim().toLowerCase() === user?.email?.toLowerCase){
//       // console.log('you cannot invite yourself');
//       // return;
//     // }
//     if (!inviteEmail.trim()) return;

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://localhost:5000/api/share/invite", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token || ""}`,
//         },
//         body: JSON.stringify({
//           email: inviteEmail.trim(),          
//           invitedEmail: inviteEmail.trim(),   
//           role: "viewer", 
//           pageUrl: window.location.href, 
//           source: "note_form_page",
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
        
//         // check data from collaborator
//         if (data && data.collaborator) {
//           setCollaborators((prev) => [...prev, data.collaborator]);
//         } else if (data && data.data) {//some backend come from data to data
//           setCollaborators((prev) => [...prev, data.data]);
//         } else {
         
//           const fallbackNewCollaborator: CollaboratorItem = {
//             _id: data._id || String(Date.now()),
//             invitedEmail: inviteEmail.trim(),
//             status: data.status || "pending",
//             role: "viewer",
//           };
//           setCollaborators((prev) => [...prev, fallbackNewCollaborator]);
//         }
        
//         setInviteEmail("");
//       } else {
//         console.error("Failed to invite collaborator");
//       }
//     } catch (error) {
//       console.error("Error inviting collaborator:", error);
//     }
//   };

//   return (
//     <Box>
//       <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
//         Share Note Detail Page
//       </Typography>

//       <Box sx={{ display: "flex", gap: 1, mb: 2.5 }}>
//         <TextField
//           fullWidth
//           size="small"
//           placeholder="Add people by email"
//           value={inviteEmail}
//           onChange={(e) => setInviteEmail(e.target.value)}
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
//           sx={{
//             bgcolor: "#973aa8",
//             textTransform: "none",
//             borderRadius: 2,
//             px: 2.5,
//             "&]:hover": { bgcolor: "#7b2c8a" },
//           }}
//         >
//           Invite
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

       
//         {collaborators && collaborators.filter((person) => person.invitedEmail !==user?.email)
//         .map((person, index) => (
//           <ListItem disableGutters key={person._id || person.invitedEmail || index} sx={{ py: 0.75 }}>
//             <ListItemAvatar sx={{ minWidth: 40 }}>
//               <Avatar sx={{ width: 32, height: 32, bgcolor: "action.focus", fontSize: "14px" }}>
//                 {person.invitedEmail ? person.invitedEmail.charAt(0).toUpperCase() : "U"}
//               </Avatar>
//             </ListItemAvatar>
//             <ListItemText
//               primary={
//                 <Typography variant="body2" >
//                   {person.invitedEmail}
//                 </Typography>
//               }
//               secondary={
//                 <Typography variant="caption" color="text.secondary">
//                   {person.status}
//                 </Typography>
//               }
//             />
            
//             <Button
//               size="small"
//               endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14 }} />}
//               onClick={(e) => handleOpenPermissionMenu(e, person._id || null, person.role)}
//               sx={{
//                 textTransform: "none",
//                 color: "text.secondary",
//                 fontSize: "0.75rem",
//                 py: 0.5,
//               }}
//             >
//               {getRoleLabel(person.role)}
//             </Button>
//           </ListItem>
//         ))}
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

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LinkIcon from "@mui/icons-material/Link";

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

interface ShareNoteDetailPageProps {
  user: UserProfile | null;
  collaborators: CollaboratorItem[];
  setCollaborators: React.Dispatch<React.SetStateAction<CollaboratorItem[]>>;
  handleOpenPermissionMenu: (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string | null,
    currentRole: string
  ) => void;
  getRoleLabel: (role: string) => string;
  noteId: string; // Add noteId prop
}

export const ShareNoteDetailPage: React.FC<ShareNoteDetailPageProps> = ({
  user,
  collaborators,
  setCollaborators,
  handleOpenPermissionMenu,
  getRoleLabel,
  noteId, // receive note id
}) => {
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isInviting, setIsInviting] = useState<boolean>(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  // const handleInvite = async () => {
  //   if (!inviteEmail.trim() || !noteId) return;
    
  //   // Check if inviting self
  //   if (user?.email && inviteEmail.trim().toLowerCase() === user.email.toLowerCase()) {
  //     alert("You cannot invite yourself!");
  //     return;
  //   }

  //   setIsInviting(true);

  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await fetch("http://localhost:5000/api/share/invite", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token || ""}`,
  //       },
  //       body: JSON.stringify({
  //         invitedEmail: inviteEmail.trim(),
  //         role: "viewer",
  //         pageUrl: window.location.href,
  //         source: "note_form_page",
  //         noteId: noteId, // Important: Send noteId
  //       }),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
        
  //       // Check data from collaborator
  //       let newCollaborator = null;
  //       if (data && data.collaborator) {
  //         newCollaborator = {
  //           ...data.collaborator,
  //           noteId: noteId
  //         };
  //       } else if (data && data.data) {
  //         newCollaborator = {
  //           ...data.data,
  //           noteId: noteId
  //         };
  //       } else {
  //         newCollaborator = {
  //           _id: data._id || String(Date.now()),
  //           invitedEmail: inviteEmail.trim(),
  //           status: data.status || "pending",
  //           role: "viewer",
  //           noteId: noteId,
  //         };
  //       }
        
  //       setCollaborators((prev) => [...prev, newCollaborator]);
  //       setInviteEmail("");
  //     } else {
  //       const errorData = await response.json();
  //       console.error("Failed to invite collaborator:", errorData);
  //       alert(errorData.message || "Failed to send invitation. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error inviting collaborator:", error);
  //     alert("Network error. Please check your connection and try again.");
  //   } finally {
  //     setIsInviting(false);
  //   }
  // };

  // In ShareNoteDetailPage component
// const handleInvite = async () => {
//   if (!inviteEmail.trim() || !noteId) return;

//   try {
//     const token = localStorage.getItem("token");
//     const response = await fetch("http://localhost:5000/api/share/invite", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token || ""}`,
//       },
//       body: JSON.stringify({
//         invitedEmail: inviteEmail.trim(),
//         role: "viewer",
//         pageUrl: window.location.href,
//         source: "note_form_page",
//         noteId: noteId, // Important: Send the specific note ID
//       }),
//     });

//     if (response.ok) {
//       const data = await response.json();
//       // ... rest of the code
//     }
//   } catch (error) {
//     console.error("Error inviting collaborator:", error);
//   }
// };

// In ShareNoteDetailPage component
const handleInvite = async () => {
  if (!inviteEmail.trim() || !noteId) return;

  // Check if inviting self
  if (user?.email && inviteEmail.trim().toLowerCase() === user.email.toLowerCase()) {
    alert("You cannot invite yourself!");
    return;
  }

  setIsInviting(true);

  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/share/invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      body: JSON.stringify({
        email: inviteEmail.trim(),        // Add this - backend expects 'email' or 'invitedEmail'
        invitedEmail: inviteEmail.trim(), // Keep this too
        role: "commenter",
        pageUrl: window.location.href,
        source: "note_form_page",
        noteId: noteId,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      
      let newCollaborator = null;
      if (data && data.collaborator) {
        newCollaborator = {
          ...data.collaborator,
          noteId: noteId
        };
      } else if (data && data.data) {
        newCollaborator = {
          ...data.data,
          noteId: noteId
        };
      } else {
        newCollaborator = {
          _id: data._id || String(Date.now()),
          invitedEmail: inviteEmail.trim(),
          status: data.status || "pending",
          role: "commenter",
          noteId: noteId,
        };
      }
      
      setCollaborators((prev) => [...prev, newCollaborator]);
      setInviteEmail("");
    } else {
      const errorData = await response.json();
      console.error("Failed to invite collaborator:", errorData);
      alert(errorData.message || "Failed to send invitation. Please try again.");
    }
  } catch (error) {
    console.error("Error inviting collaborator:", error);
    alert("Network error. Please check your connection and try again.");
  } finally {
    setIsInviting(false);
  }
};

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
        Share Note
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 2.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Add people by email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          disabled={isInviting}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              fontSize: "0.875rem",
            },
          }}
        />
        <Button
          variant="contained"
          size="small"
          onClick={handleInvite}
          disabled={isInviting || !inviteEmail.trim()}
          sx={{
            bgcolor: "#973aa8",
            textTransform: "none",
            borderRadius: 2,
            px: 2.5,
            "&:hover": { bgcolor: "#7b2c8a" },
            "&.Mui-disabled": { bgcolor: "#c9a0d4" },
          }}
        >
          {isInviting ? "Inviting..." : "Invite"}
        </Button>
      </Box>

      <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary", mb: 1 }}>
        People with access
      </Typography>

      <List disablePadding sx={{ maxHeight: 180, overflowY: "auto", mb: 2 }}>
        {user && (
          <ListItem disableGutters sx={{ py: 0.75 }}>
            <ListItemAvatar sx={{ minWidth: 40 }}>
              <Avatar
                src={user.photo}
                alt={user.firstName}
                sx={{ width: 32, height: 32, bgcolor: "#973aa8", fontSize: "14px" }}
              >
                {user.firstName?.charAt(0).toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {user.firstName} {user.lastName} (You)
                </Typography>
              }
              secondary={
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              }
            />
            <Typography variant="caption" sx={{ color: "text.secondary", pr: 1 }}>
              Owner
            </Typography>
          </ListItem>
        )}

        {collaborators
          .filter((person) => person.invitedEmail !== user?.email)
          .map((person, index) => (
            <ListItem 
              disableGutters 
              key={person._id || person.invitedEmail || index} 
              sx={{ py: 0.75 }}
            >
              <ListItemAvatar sx={{ minWidth: 40 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: "action.focus", fontSize: "14px" }}>
                  {person.invitedEmail ? person.invitedEmail.charAt(0).toUpperCase() : "U"}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body2">
                    {person.invitedEmail}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {person.status}
                  </Typography>
                }
              />
              
              <Button
                size="small"
                endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14 }} />}
                onClick={(e) => handleOpenPermissionMenu(e, person._id || null, person.role)}
                sx={{
                  textTransform: "none",
                  color: "text.secondary",
                  fontSize: "0.75rem",
                  py: 0.5,
                }}
              >
                {getRoleLabel(person.role)}
              </Button>
            </ListItem>
          ))}
      </List>

      <Box
        sx={{
          pt: 1.5,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          startIcon={<LinkIcon sx={{ transform: "rotate(-45deg)" }} />}
          onClick={handleCopyLink}
          sx={{
            textTransform: "none",
            color: "#973aa8",
            fontSize: "0.85rem",
            fontWeight: 500,
            "&:hover": { bgcolor: "transparent", opacity: 0.8 },
          }}
        >
          {copySuccess ? "Copied link!" : "Copy link"}
        </Button>
      </Box>
    </Box>
  );
};