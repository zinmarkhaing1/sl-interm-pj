import {
  Box,
  Paper,
  TextField,
  Typography,
  Stack,
  Button,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSignupMutation } from "../services/authApi";
import notebook from "../navicons/34864fc706609d92a131368af91c1e8b-removebg-preview.png";

export const SignUpForm = () => {
  const [signup, { isLoading }] = useSignupMutation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const { firstName, lastName, email, password } = form;
    setErrorMessage(null);

    if (!firstName || !lastName || !email || !password) {
      setErrorMessage("Please fill all fields");
      return;
    }

    try {
      const res = await signup({
        firstName,
        lastName,
        email,
        password,
      }).unwrap();

      if (res.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/login");
      } else {
        setErrorMessage(res.message || "Signup failed. Please try again.");
      }
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || "Signup Failed. Network error.";
      setErrorMessage(errorMsg);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        py: 3,
        background:
          "linear-gradient(160deg, #faf7fc 0%, #f3e8ff 55%, #dec9e9 100%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 500,
          maxWidth: "100%",
          p: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <Box
            component="img"
            src={notebook}
            alt="Note Book"
            sx={{ width: 44, height: 44 }}
          />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: "primary.main", letterSpacing: 0.3 }}
          >
            Note Book
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "text.primary" }}
          >
            Create account
          </Typography>
        </Stack>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            name="firstName"
            label="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            variant="outlined"
            name="lastName"
            label="Last Name"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </Stack>

        <Stack spacing={2} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            name="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            variant="outlined"
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <VisibilityOff sx={{ fontSize: 20 }} />
                      ) : (
                        <Visibility sx={{ fontSize: 20 }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            py: 1.2,
            borderRadius: 2,
            fontWeight: "bold",
          }}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Register"}
        </Button>

        <Stack alignItems="center" sx={{ mt: 3 }}>
          <MuiLink
            component={RouterLink}
            to="/login"
            color="primary"
            sx={{ cursor: "pointer" }}
          >
            Already have an account? Sign in here.
          </MuiLink>
        </Stack>
      </Paper>
    </Box>
  );
};
