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
  // console.log('user',user)

    const [, forceUpdate] = useState(0);
  const navigate = useNavigate();
   useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log(" ProfilePage - storedUser raw:", storedUser);

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log(" ProfilePage - parsedUser:", parsedUser);
        setUser({
          firstName: parsedUser.firstName || "",
          lastName: parsedUser.lastName || "",
          email: parsedUser.email || "",
          bio: parsedUser.bio || "",
          photo: parsedUser.photo || "",
        });
        forceUpdate((prev) => prev + 1);
      } catch (error) {
        console.error(" ProfilePage - Parse error:", error);
        localStorage.removeItem("user");
      }
    } else {
      console.warn("ProfilePage - No user found in localStorage");
    }
  }, []);


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
        bgcolor: "background.default",
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
            
        
            <Avatar
              src={user.photo}
              sx={{
                width: 100,
                height: 100,
                fontSize: "32px",
                bgcolor: "primary.main",
                boxShadow: 2,
              }}
            >
              {!user.photo && (user.firstName?.charAt(0).toUpperCase() || "U")}
          
            </Avatar>

            {/* name and email */}
            <Box sx={{ textAlign: "center", width: "100%" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
                {user.firstName || "First"} {user.lastName || "last"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email || "Email"}
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
              >
                Logout
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleUpdateProfile}
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