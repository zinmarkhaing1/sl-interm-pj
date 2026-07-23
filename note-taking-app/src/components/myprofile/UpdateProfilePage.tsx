import {
  Avatar,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
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
  const [isSaving, setIsSaving] = useState(false);

  const [user, setUser] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    photo: "",
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ fullName?: string }>({});

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

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
    setFieldErrors({});
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.firstName.trim()) {
      setFieldErrors({ fullName: "Name is required" });
      return;
    }

    setIsSaving(true);
    localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new CustomEvent("profileUpdated", { detail: user }));
    setSnackbarMessage("Profile updated successfully");
    setOpenSnackbar(true);
    setIsSaving(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const photoBase64 = reader.result as string;
      const updatedUser = { ...user, photo: photoBase64 };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(
        new CustomEvent("profileUpdated", { detail: updatedUser })
      );
      setSnackbarMessage("Profile photo updated");
      setOpenSnackbar(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ maxWidth: 520, mx: "auto", width: "100%", py: 1 }}>
      <Button
        startIcon={<ArrowBackIosNewOutlinedIcon fontSize="small" />}
        onClick={() => navigate("/profile")}
        color="inherit"
        sx={{ mb: 2 }}
      >
        Back to profile
      </Button>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 4 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
          Update profile
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Manage how you appear across Note Book.
        </Typography>

        <Box component="form" onSubmit={handleSave} noValidate>
          <Stack spacing={2.5} alignItems="center" sx={{ mb: 3 }}>
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={user.photo}
                sx={{
                  width: 96,
                  height: 96,
                  fontSize: 32,
                  bgcolor: "primary.main",
                }}
              >
                {!user.photo &&
                  (user.firstName?.charAt(0).toUpperCase() || "U")}
              </Avatar>
              <IconButton
                onClick={() => photoInputRef.current?.click()}
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": { bgcolor: "secondary.main" },
                }}
                size="small"
              >
                <AddAPhotoOutlinedIcon fontSize="small" color="primary" />
              </IconButton>
              <input
                type="file"
                ref={photoInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                style={{ display: "none" }}
              />
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={2.5}>
            <TextField
              label="Full name"
              name="fullName"
              value={`${user.firstName} ${user.lastName}`.trim()}
              onChange={handleFullNameChange}
              error={!!fieldErrors.fullName}
              helperText={fieldErrors.fullName}
              required
            />
            <TextField
              label="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
              disabled
              helperText="Email cannot be changed here"
            />
            <TextField
              label="Bio"
              name="bio"
              value={user.bio}
              onChange={handleChange}
              multiline
              rows={3}
              placeholder="A short intro about you"
            />

            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button
                color="inherit"
                onClick={() => navigate("/profile")}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSaving}
                startIcon={
                  isSaving ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : undefined
                }
                sx={{ px: 3 }}
              >
                Save changes
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
