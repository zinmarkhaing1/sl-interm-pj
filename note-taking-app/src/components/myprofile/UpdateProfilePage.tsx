import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
  Snackbar,
  Alert,
  IconButton
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {useNavigate} from "react-router-dom";
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  photo?: string;
}

export const UpdateProfilePage = () => {
    const navigate = useNavigate();
 
    const photoInputRef = useRef<HTMLInputElement>(null);
 
  const [user, setUser] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    photo: "",
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  // load user data 
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
    }, []); // input change
    const handleChange = ( 
        e: React.ChangeEvent<HTMLInputElement> 
    ) => { 
        setUser({ ...user,
             [e.target.name]: e.target.value, 
            });
         }; 


         //full name

         const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const fullValue = e.target.value;

          const nameParts = fullValue.trimStart().split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ");

            setUser({
              ...user,
              firstName,
              lastName,
    });
         }
         // save profile 
    const handleSave = () => {
         localStorage.setItem("user", JSON.stringify(user));
         window.dispatchEvent(
           new CustomEvent("profileUpdated", { detail: user })
         );
          setSnackbarMessage("Profile photo updated!");
      setOpenSnackbar(true);
        };

    // const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   const file = e.target.files?.[0];
    //   if (!file) return;

    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     const photo = reader.result as string;
    //     setUser((currentUser) => ({
    //       ...currentUser,
    //       photo,
    //     }));
    //     window.dispatchEvent(
    //       new CustomEvent("profileUpdated", { detail: { ...user, photo } })
    //     );
    //   };
    //   reader.readAsDataURL(file);
    // };
     const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const photoBase64 = reader.result as string;
      
      // Update state immediately
      const updatedUser = { ...user, photo: photoBase64 };
      setUser(updatedUser);

      // Save to localStorage so it syncs and persists
      localStorage.setItem("user", JSON.stringify(updatedUser));

      window.dispatchEvent(
        new CustomEvent("profileUpdated", { detail: updatedUser })
      );
      setSnackbarMessage("Profile photo updated!");
      setOpenSnackbar(true);
    };
    reader.readAsDataURL(file);
  };

    const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

 

  return (
    <Box sx={{minHeight:"400px",backgroundColor:"f4f6f8",width:"100%"}}>
     <Button 
          startIcon={<ArrowBackIosNewOutlinedIcon />} 
          onClick={() => navigate("/")} 
          sx={{  textTransform: 'none', color: '#5a206c' }}
        >
          Back to Profile
        </Button>
        <Typography variant="h5" sx={{fontSize:"16px",display:"flex",justifyContent:"center",alignItems:"center",}}> Update Profile</Typography>

        
    <Box
      sx={{
        width:"100%",
        minHeight: { xs: "calc(100vh - 150px)", sm: "calc(100vh - 120px)" },
        bgcolor: "#f4f6f8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // p: { xs: 1, sm: 3 },
      }}
    >
       

      <Card
        sx={{ width: "100%", maxWidth: 400, borderRadius: 4, boxShadow: 4 ,minHeight:300}}
      >

        <CardContent>
            
          <Stack
            spacing={1}
            sx={{
              mb: 2,
              display:"flex",
              flexDirection:"column",
             
            }}
          >
            <Box sx={{display:"flex",flexDirection:"row", }}>
            
            <Box sx={{ position: "relative" }}>
                <Avatar
                  src={user.photo}
                  sx={{ width: 100, height: 100, fontSize: "32px", bgcolor: "#6596c6" }}
                >
                  {!user.photo && (user.firstName?.charAt(0).toUpperCase() || "U")}
                </Avatar>
                <IconButton
                  onClick={() => photoInputRef.current?.click()}
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    bgcolor: "white",
                    boxShadow: 2,
                    "&:hover": { bgcolor: "#f0f0f0" }
                  }}
                  size="small"
                >
                  <AddAPhotoOutlinedIcon fontSize="small" color="primary" />
                </IconButton>
              </Box>
               <input
                type="file"
                ref={photoInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                style={{ display: "none" }}
              />
            </Box>
            {/* <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography color="text.secondary">{user.email}</Typography> */}
         
          </Stack>
          <Divider sx={{ mb: 1.5 }} />
          <Stack spacing={1}>
            <TextField
              label="Full Name"
              name="fullName"
              value={`${user.firstName} ${user.lastName}`.trim()}
              onChange={handleFullNameChange}
              fullWidth
            />
             {/* <TextField
              label="Last Name"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              fullWidth
            /> */}
            <TextField
              label="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
              fullWidth
              disabled
            />
            <TextField
              label="bio"
              name= "bio"
              value={user.bio}
              onChange={handleChange}
              multiline
              rows={2}
              fullWidth
            />
            <Button
              variant="contained"
              size="medium"
              sx={{ p: 1, borderRadius: 2,backgroundColor:"#973aa8",color:"white"}}
              onClick={handleSave}
            >
              Save Changes
            </Button>
           
          </Stack>
        </CardContent>
      </Card>
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} 
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%', borderRadius: 2 }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
    </Box>

  )
}
