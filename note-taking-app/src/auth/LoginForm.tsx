import {
  Box,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  Stack,
  Button,
  IconButton,
  Alert,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Email from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLoginMutation } from "../services/authApi";
import notebook from "../navicons/34864fc706609d92a131368af91c1e8b-removebg-preview.png";

export const LoginForm = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    if (email.trim() === "" || password.trim() === "") {
      setErrorMessage("Fill Email and Password");
      return;
    }
    try {
      const response = await login({ email, password }).unwrap();

      if (response.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/dashboard");
      } else {
        setErrorMessage(response.message || "Login Failed. Network Error");
      }
    } catch (error: any) {
      const errorMsg =
        error?.data?.message ||
        error?.message ||
        "Invalid Email or Password";
      setErrorMessage(errorMsg);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        px: 2,
        background:
          "linear-gradient(160deg, #faf7fc 0%, #f3e8ff 55%, #dec9e9 100%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 420,
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
            Sign in
          </Typography>
        </Stack>

        <TextField
          fullWidth
          margin="normal"
          variant="standard"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          variant="standard"
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
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

        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2, mb: 1, borderRadius: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: 3,
            py: 1.2,
            borderRadius: 2,
            fontWeight: "bold",
          }}
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>

        <Stack
          spacing={2}
          sx={{ mt: 3, justifyContent: "center", alignItems: "center" }}
        >
          <MuiLink
            component={RouterLink}
            to="/signup"
            color="primary"
            sx={{ cursor: "pointer" }}
          >
            Don&apos;t have an account? Sign up here.
          </MuiLink>
        </Stack>
      </Paper>
    </Box>
  );
};
