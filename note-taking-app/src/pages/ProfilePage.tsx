// import {
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Divider,
//   Stack,
//   Typography,
//   Snackbar,
//   Alert,
//   TextField,
//   IconButton
// } from "@mui/material";
// import { useEffect, useRef, useState } from "react";
// import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';

// interface UserProfile {
//   firstName: string;
//   lastName: string;
//   email: string;
//   bio?: string;
//   photo?: string;
// }

// export const ProfilePage = () => {
//   const photoInputRef = useRef<HTMLInputElement>(null);

//   const [user, setUser] = useState<UserProfile>({
//     firstName: "",
//     lastName: "",
//     email: "",
//     bio: "",
//     photo: "",
//   });

//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");

//   // Load user data on mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUser({
//           firstName: parsedUser.firstName || "",
//           lastName: parsedUser.lastName || "",
//           email: parsedUser.email || "",
//           bio: parsedUser.bio || "",
//           photo: parsedUser.photo || "",
//         });
//       } catch {
//         localStorage.removeItem("user");
//       }
//     }
//   }, []);

//   // Standard input change handler
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setUser({
//       ...user,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Save profile to local storage
//   const handleSave = () => {
//     localStorage.setItem("user", JSON.stringify(user));
//     window.dispatchEvent(
//       new CustomEvent("profileUpdated", { detail: user })
//     );
//     setSnackbarMessage("Profile updated successfully!");
//     setOpenSnackbar(true);
//   };

//   // Photo change handler
//   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const photoBase64 = reader.result as string;
      
//       // Update state immediately
//       const updatedUser = { ...user, photo: photoBase64 };
//       setUser(updatedUser);

//       // Save to localStorage so it syncs and persists
//       localStorage.setItem("user", JSON.stringify(updatedUser));

//       window.dispatchEvent(
//         new CustomEvent("profileUpdated", { detail: updatedUser })
//       );
//       setSnackbarMessage("Profile photo updated!");
//       setOpenSnackbar(true);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setOpenSnackbar(false);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     setUser({ firstName: "", lastName: "", email: "", bio: "", photo: "" });
//     setSnackbarMessage("Logged out successfully!");
//     setOpenSnackbar(true);
//   };

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         minHeight: { xs: "calc(100vh - 150px)", sm: "calc(100vh - 120px)" },
//         bgcolor: "#f4f6f8",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         p: { xs: 2, sm: 3 },
//       }}
//     >
//       <Card sx={{ width: "100%", maxWidth: 450, borderRadius: 4, boxShadow: 4 }}>
//         <CardContent sx={{ p: 3 }}>
//           <Stack spacing={3}>
            
//             {/* Avatar and Photo Upload Section */}
//             <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
//               <Box sx={{ position: "relative" }}>
//                 <Avatar
//                   src={user.photo}
//                   sx={{ width: 100, height: 100, fontSize: "32px", bgcolor: "#6596c6" }}
//                 >
//                   {!user.photo && (user.firstName?.charAt(0).toUpperCase() || "U")}
//                 </Avatar>
//                 <IconButton
//                   onClick={() => photoInputRef.current?.click()}
//                   sx={{
//                     position: "absolute",
//                     bottom: 0,
//                     right: 0,
//                     bgcolor: "white",
//                     boxShadow: 2,
//                     "&:hover": { bgcolor: "#f0f0f0" }
//                   }}
//                   size="small"
//                 >
//                   <AddAPhotoOutlinedIcon fontSize="small" color="primary" />
//                 </IconButton>
//               </Box>
              
//               {/* Hidden HTML Input for File Upload */}
//               <input
//                 type="file"
//                 ref={photoInputRef}
//                 onChange={handlePhotoChange}
//                 accept="image/*"
//                 style={{ display: "none" }}
//               />
//             </Box>

//             {/* Display Name and Info */}
//             <Box sx={{ textAlign: "center" }}>
//               <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//                 {user.firstName || "First Name"} {user.lastName || "Last Name"}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">{user.email || "No Email Provided"}</Typography>
//             </Box>

//             <Divider />

//             {/* Form Fields for Editing */}
//             <Stack spacing={2}>
//               <Box sx={{ display: "flex", gap: 2 }}>
//                 <TextField
//                   label="First Name"
//                   name="firstName"
//                   value={user.firstName}
//                   onChange={handleChange}
//                   fullWidth
//                   size="small"
//                 />
//                 <TextField
//                   label="Last Name"
//                   name="lastName"
//                   value={user.lastName}
//                   onChange={handleChange}
//                   fullWidth
//                   size="small"
//                 />
//               </Box>
//               <TextField
//                 label="Email"
//                 name="email"
//                 value={user.email}
//                 onChange={handleChange}
//                 fullWidth
//                 size="small"
//               />
//               <TextField
//                 label="Bio"
//                 name="bio"
//                 value={user.bio}
//                 onChange={handleChange}
//                 fullWidth
//                 multiline
//                 rows={3}
//                 size="small"
//               />
//             </Stack>

//             <Divider />

//             {/* Action Buttons */}
//             <Stack direction="row" spacing={2} sx={{justifyContent:"flex-end"}}>
//               <Button
//                 variant="outlined"
//                 color="error"
//                 onClick={handleLogout}
//                 sx={{ borderRadius: 2 }}
//               >
//                 Logout
//               </Button>
//               <Button
//                 variant="contained"
//                 onClick={handleSave}
//                 sx={{ borderRadius: 2, backgroundColor: "#973aa8", "&:hover": { backgroundColor: "#7b2c8a" } }}
//               >
//                 Save Changes
//               </Button>
//             </Stack>

//           </Stack>
//         </CardContent>
//       </Card>

//       {/* Snackbar Alert */}
//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={3000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%', borderRadius: 2 }}>
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// import {
//   Avatar,
//   Box,
//   Card,
//   CardContent,
//   Divider,
//   Stack,
//   Typography,
// } from "@mui/material";
// import { useEffect, useState } from "react";

// interface UserProfile {
//   firstName: string;
//   lastName: string;
//   email: string;
//   bio?: string;
//   photo?: string;
// }

// export const ProfilePage = () => {
//   const [user, setUser] = useState<UserProfile>({
//     firstName: "",
//     lastName: "",
//     email: "",
//     bio: "",
//     photo: "",
//   });

//   // LocalStorage ကနေ ဒေတာကို ဖတ်ပြီး ပြသရန်သက်သက်
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUser({
//           firstName: parsedUser.firstName || "",
//           lastName: parsedUser.lastName || "",
//           email: parsedUser.email || "",
//           bio: parsedUser.bio || "",
//           photo: parsedUser.photo || "",
//         });
//       } catch {
//         localStorage.removeItem("user");
//       }
//     }
//   }, []);

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         minHeight: { xs: "calc(100vh - 150px)", sm: "calc(100vh - 120px)" },
//         bgcolor: "#f4f6f8",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         p: { xs: 2, sm: 3 },
//       }}
//     >
//       <Card
//         sx={{
//           width: "100%",
//           maxWidth: 400,
//           borderRadius: 4,
//           boxShadow: 4,
//           minHeight: 300, 
//           display: "flex",
//           alignItems: "center",
//         }}
//       >
//         <CardContent sx={{ width: "100%", p: 3 }}>
//           <Stack
//             spacing={2}
           
//             sx={{ alignItems:"center",textAlign: "center" }}
//           >
           
//             <Avatar
//               src={user.photo}
//               sx={{
//                 width: 100,
//                 height: 100,
//                 fontSize: "32px",
//                 bgcolor: "#6596c6",
//                 boxShadow: 2,
//               }}
//             >
//               {!user.photo && (user.firstName?.charAt(0).toUpperCase() || "U")}
//             </Avatar>

         
//             <Typography variant="h5" sx={{ color: "#293a4b",fontSize:"18px", mt: 1 }}>
//               {user.firstName || "First"} {user.lastName || "Last"}
//             </Typography>

//             <Divider sx={{ width: "100%" }} />

//             <Stack spacing={1} sx={{ width: "100%" }}>
//               <Typography variant="body1" color= "#293a4b">
//                  {user.email || "Not provided"}
//               </Typography>
              
//               {user.bio && (
//                 <Typography variant="body2" color="#293a4b" sx={{ fontStyle: "italic" }}>
//                   "{user.bio}"
//                 </Typography>
//               )}
//             </Stack>
//           </Stack>

//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  photo?: string;
}

export const ProfilePage = () => {
  const [user, setUser] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    photo: "",
  });

  // LocalStorage ကနေ ဒေတာကို ဖတ်ပြီး ပြသရန်
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          firstName: parsedUser.firstName || "",
          lastName: parsedUser.lastName || "",
          email: parsedUser.email || "",
          bio: parsedUser.bio || "",
          photo: parsedUser.photo || "",
        });
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);
  const navigate = useNavigate();


  const handleUpdateProfile = () => {
    // console.log("Navigate to edit profile page or open edit modal");
    navigate('/profile/edit-profile');

  };


  // const handleLogout = () => {
  //   localStorage.removeItem("user");
  //   setUser({ firstName: "", lastName: "", email: "", bio: "", photo: "" });
  //   console.log("Logged out successfully");
  // };
   const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: { xs: "calc(100vh - 150px)", sm: "calc(100vh - 120px)" },
        bgcolor: "#f4f6f8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 2, sm: 3 },
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 4,
          boxShadow: 4,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={3} sx={{alignItems:"center"}}>
            
            {/* Avatar ပြသခြင်း */}
            <Avatar
              src={user.photo}
              sx={{
                width: 100,
                height: 100,
                fontSize: "32px",
                bgcolor: "#6596c6",
                boxShadow: 2,
              }}
            >
              {!user.photo && (user.firstName?.charAt(0).toUpperCase() || "U")}
            </Avatar>

            {/* နာမည် နှင့် အီးမေးလ် အချက်အလက်များ */}
            <Box sx={{ textAlign: "center", width: "100%" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
                {user.firstName || "First"} {user.lastName || "Last"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email || "no-email@example.com"}
              </Typography>
              {user.bio && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, fontStyle: "italic" }}>
                  "{user.bio}"
                </Typography>
              )}
            </Box>

            <Divider sx={{ width: "100%" }} />

            <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={handleLogout}
                sx={{ borderRadius: 2, textTransform: "none" ,border:"none"}}
              >
                Logout
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={handleUpdateProfile}
                sx={{
                  borderRadius: 2,
                  backgroundColor: "#973aa8",
                  color:"white",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#7b2c8a", },
                }}
              >
                Update Profile
              </Button>
            </Stack>

          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};