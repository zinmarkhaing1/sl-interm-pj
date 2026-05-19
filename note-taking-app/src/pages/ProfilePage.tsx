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
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  photo?: string;
}
export const ProfilePage = () => {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    photo: "",
  });
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
         // save profile 
    const handleSave = () => {
         localStorage.setItem("user", JSON.stringify(user));
         window.dispatchEvent(
           new CustomEvent("profileUpdated", { detail: user })
         );
          alert("Profile Updated"); };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        const photo = reader.result as string;
        setUser((currentUser) => ({
          ...currentUser,
          photo,
        }));
        window.dispatchEvent(
          new CustomEvent("profileUpdated", { detail: { ...user, photo } })
        );
      };
      reader.readAsDataURL(file);
    };

  return (
    <Box
      sx={{
        width:"100%",
        minHeight: { xs: "calc(100vh - 150px)", sm: "calc(100vh - 120px)" },
        bgcolor: "dee4ea",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 1, sm: 3 },
      }}
    >
      <Card
        sx={{ width: "100%", maxWidth: 400, borderRadius: 4, boxShadow: 4 }}
      >
        <CardContent>
          <Stack
            spacing={2}
            sx={{
              mb: 3,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Avatar
              src={user.photo }
              sx={{ width: 100, height: 100 }}
            />
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography color="text.secondary">{user.email}</Typography>
            <Typography color="text.secondary"> {user.bio} </Typography>

            <Button
              variant="contained"
              sx={{ width: 200, p: 1, borderRadius: 2 }}
              onClick={() => photoInputRef.current?.click()}
            >
              Change Photo
            </Button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handlePhotoChange}
            />
          </Stack>
          <Divider sx={{ mb: 3 }} />
          <Stack spacing={3}>
            <TextField
              label="First Name"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              fullWidth
            />
             <TextField
              label="Last Name"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="bio"
              name= "bio"
              value={user.bio}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />
            <Button
              variant="contained"
              size="medium"
              sx={{ p: 1, borderRadius: 2 }}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};
