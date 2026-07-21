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

// interface ShareCategryPageProps {
//   user: UserProfile | null;
//   collaborators: CollaboratorItem[];
//   setCollaborators: React.Dispatch<React.SetStateAction<CollaboratorItem[]>>;
//   handleOpenPermissionMenu: (
//     event: React.MouseEvent<HTMLButtonElement>,
//     id: string | null,
//     currentRole: string
//   ) => void;
//   getRoleLabel: (role: string) => string;
//   userPermission? : "owner" | "full" | "editor" | "commenter" | "viewer";
// }

// export const ShareCategoryPage: React.FC<ShareCategryPageProps> = ({
//   user,
//   collaborators,
//   setCollaborators,
//   handleOpenPermissionMenu,
//   getRoleLabel,
//   userPermission = "owner",
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


//   console.log({
//   email: inviteEmail.trim(),
//   pageUrl: window.location.href,
//   source:"category_page"
// });
//   // to invite email
//   const handleInvite = async () => {
//     if (!inviteEmail.trim()) return;

   
//     if (user?.email && inviteEmail.trim().toLowerCase() === user.email.toLowerCase()) {
//       console.log('You cannot invite yourself');
//       return;
//     }

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
//           source: "category_page",
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
     
//         if (data && data.collaborator) {
//           setCollaborators((prev) => [...prev, data.collaborator]);
//         } else if (data && data.data) {
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
//   const canInvite = userPermission === "owner" || userPermission === "full" || userPermission === "editor";
//   const canChangePermissions = userPermission === "owner" || userPermission === "full"

//   return (
//     <Box>
//       <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
//         Share Category Page
//       </Typography>
//       {canInvite &&(
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
//             "&:hover": { bgcolor: "#7b2c8a" },
//           }}
//         >
//           Invite
//         </Button>
//       </Box>
//       )}

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

        
//         {collaborators && collaborators
//           .filter((person: CollaboratorItem) => person.invitedEmail !== user?.email)
//           .map((person, index) => (
//             <ListItem disableGutters key={person._id || person.invitedEmail || index} sx={{ py: 0.75 }}>
//               <ListItemAvatar sx={{ minWidth: 40 }}>
//                 <Avatar sx={{ width: 32, height: 32, bgcolor: "action.focus", fontSize: "14px" }}>
//                   {person.invitedEmail ? person.invitedEmail.charAt(0).toUpperCase() : "U"}
//                 </Avatar>
//               </ListItemAvatar>
//               <ListItemText
//                 primary={
//                   <Typography variant="body2" >
//                     {person.invitedEmail}
//                   </Typography>
//                 }
//                 secondary={
//                   <Typography variant="caption" color="text.secondary">
//                     {person.status}
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
  Alert,
  Snackbar,
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
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  photo?: string;
  _id?:string;
}

interface ShareCategoryPageProps {
  user: UserProfile | null;
  collaborators: CollaboratorItem[];
  setCollaborators: React.Dispatch<React.SetStateAction<CollaboratorItem[]>>;
  handleOpenPermissionMenu: (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string | null,
    currentRole: string
  ) => void;
  getRoleLabel: (role: string) => string;
  userPermission?: "owner" | "full" |"editor"| "commenter"  |"viewer";
  categoryName?:string;
}

export const ShareCategoryPage: React.FC<ShareCategoryPageProps> = ({
  user,
  collaborators,
  setCollaborators,
  handleOpenPermissionMenu,
  getRoleLabel,
  userPermission = "owner",
  categoryName="",
}) => {
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
  //   // Validate email
  //   const email = inviteEmail.trim();
  //   if (!email) {
  //     setError("Please enter an email address");
  //     return;
  //   }

  //   // Validate email format
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(email)) {
  //     setError("Please enter a valid email address");
  //     return;
  //   }

  //   // Check if inviting self
  //   if (user?.email && email.toLowerCase() === user.email.toLowerCase()) {
  //     setError("You cannot invite yourself");
  //     return;
  //   }

  //   // Check if already invited
  //   const alreadyInvited = collaborators.some(
  //     (c) => c.invitedEmail.toLowerCase() === email.toLowerCase()
  //   );
  //   if (alreadyInvited) {
  //     setError("This email has already been invited");
  //     return;
  //   }

  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       setError("You must be logged in to invite collaborators");
  //       setLoading(false);
  //       return;
  //     }

  //      const url = window.location.href;
  //   const categoryMatch = url.match(/\/category\/([^\/?#]+)/);
  //   const categoryName = categoryMatch ? decodeURIComponent(categoryMatch[1]) : null;

  //     console.log("📨 Sending invite:", {
  //       email: email,
  //       pageUrl: window.location.href,
  //       source: "category_page",
  //       role: "viewer",
  //       pageType : "category",
  //       pageName : categoryName,
  //     });

  //   const fullPageUrl = window.location.href;
  //   console.log("📂 Current categoryName:", categoryName);

  //   let categoryNameToUse = categoryName;

  //    if (!categoryNameToUse) {
  //     const url = window.location.href;
  //     const match = url.match(/\/category\/([^\/?#]+)/);
  //     if (match) {
  //       categoryNameToUse = decodeURIComponent(match[1]);
  //     }
  //   }

  //   if (!categoryNameToUse) {
  //     categoryNameToUse = "Family & Friends";
  //   }

  //   const requestBody = {
  //   email: email,
  //   invitedEmail: email,
  //   role: "viewer",
  //   pageUrl: fullPageUrl,  
  //   source: "category_page",
  //   pageType: "category",
  //   pageName: categoryNameToUse, 
  // };

  // console.log("Sending invite request:", requestBody);

  //     const response = await fetch("http://localhost:5000/api/share/invite", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         email: email,
  //         invitedEmail: email,
  //         role: "viewer",
  //         pageUrl: window.location.href,
  //         source: "category_page",
  //         pageType: "category",
  //         pageName: categoryName,
  //       }),
  //     });

  //     console.log("📨 Response status:", response.status);

  //     // Try to get response data
  //     let data;
  //     const responseText = await response.text();
  //     console.log("📨 Response text:", responseText);

  //     try {
  //       data = responseText ? JSON.parse(responseText) : {};
  //     } catch (parseError) {
  //       console.error("Failed to parse response:", parseError);
  //       setError("Invalid response from server");
  //       setLoading(false);
  //       return;
  //     }

  //     if (!response.ok) {
  //       console.error(" Invite failed:", data);
  //       setError(data?.message || "Failed to invite collaborator");
  //       setLoading(false);
  //       return;
  //     }

  //     console.log(" Invite successful:", data);

  //     // Handle response data
  //     let newCollaborator = null;

  //     if (data && data.collaborator) {
  //       newCollaborator = data.collaborator;
  //     } else if (data && data.data) {
  //       newCollaborator = data.data;
  //     } else if (data && data._id) {
  //       newCollaborator = {
  //         _id: data._id,
  //         invitedEmail: email,
  //         status: data.status || "pending",
  //         role: data.role || "viewer",
  //       };
  //     } else {
  //       // Create fallback collaborator
  //       newCollaborator = {
  //         _id: `temp_${Date.now()}`,
  //         invitedEmail: email,
  //         status: "pending",
  //         role: "viewer",
  //       };
  //     }

  //     // Add to collaborators list
  //     setCollaborators((prev) => [...prev, newCollaborator]);
  //     setInviteEmail("");
  //     setSuccess(`Invitation sent to ${email}`);
  //     setTimeout(() => setSuccess(null), 3000);
  //   } catch (error) {
  //     console.error(" Error inviting collaborator:", error);
  //     setError("Network error. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // ShareCategoryPage.tsx

const handleInvite = async () => {
  const email = inviteEmail.trim();
  if (!email) {
    setError("Please enter an email address");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setError("Please enter a valid email address");
    return;
  }

  if (user?.email && email.toLowerCase() === user.email.toLowerCase()) {
    setError("You cannot invite yourself");
    return;
  }

  const alreadyInvited = collaborators.some(
    (c) => c.invitedEmail.toLowerCase() === email.toLowerCase()
  );
  if (alreadyInvited) {
    setError("This email has already been invited");
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to invite collaborators");
      setLoading(false);
      return;
    }

   
    let categoryNameToUse = categoryName;
    if (!categoryNameToUse) {
      const url = window.location.href;
      const match = url.match(/\/category\/([^\/?#]+)/);
      if (match) {
        categoryNameToUse = decodeURIComponent(match[1]);
      }
    }
    if (!categoryNameToUse) {
      categoryNameToUse = "Family & Friends";
    }

    const requestBody = {
      invitedEmail: email,
      email: email,
      role: "viewer",
      pageUrl: window.location.href,
      source: "category_page",
      pageType: "category",
    };

    console.log("📨 Sending invite request:", requestBody);

    const response = await fetch("http://localhost:5000/api/share/invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log(" Response status:", response.status);

  
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      setError(`Server error: ${response.status} - ${errorText.substring(0, 100)}`);
      setLoading(false);
      return;
    }


    const data = await response.json();
    console.log(" Invite successful:", data);

    // ... rest of code ...
  } catch (error) {
    console.error("Error inviting collaborator:", error);
    setError("Network error. Please try again.");
  } finally {
    setLoading(false);
  }
};


  const canInvite = userPermission === "owner" || userPermission === "full" ;
  const canChangePermissions = userPermission === "owner" || userPermission === "full";

  return (
    <Box>
      {/* Error Alert */}
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      {/* Success Alert */}
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>

      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
        Share Category Page
      </Typography>

      {canInvite && (
        <Box sx={{ display: "flex", gap: 1, mb: 2.5 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Add people by email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            disabled={loading}
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
            disabled={loading || !inviteEmail.trim()}
            sx={{
              bgcolor: "#973aa8",
              textTransform: "none",
              borderRadius: 2,
              px: 2.5,
              "&:hover": { bgcolor: "#7b2c8a" },
              "&:disabled": { opacity: 0.5 },
            }}
          >
            {loading ? "Sending..." : "Invite"}
          </Button>
        </Box>
      )}

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

        {collaborators &&
          collaborators
            .filter((person) => person.invitedEmail !== user?.email)
            .map((person, index) => (
              <ListItem
                disableGutters
                key={person._id || person.invitedEmail || index}
                sx={{ py: 0.75 }}
              >
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "action.focus",
                      fontSize: "14px",
                    }}
                  >
                    {person.invitedEmail ? person.invitedEmail.charAt(0).toUpperCase() : "U"}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2">{person.invitedEmail}</Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {person.status}
                    </Typography>
                  }
                />
                {canChangePermissions && (
                  <Button
                    size="small"
                    endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14 }} />}
                    onClick={(e) =>
                      handleOpenPermissionMenu(e, person._id || null, person.role)
                    }
                    sx={{
                      textTransform: "none",
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      py: 0.5,
                    }}
                  >
                    {getRoleLabel(person.role)}
                  </Button>
                )}
                {!canChangePermissions && (
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", fontSize: "0.75rem" }}
                  >
                    {getRoleLabel(person.role)}
                  </Typography>
                )}
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