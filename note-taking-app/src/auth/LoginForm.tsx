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
  CircularProgress,
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
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) errors.email = "Email is required";
    if (!password.trim()) errors.password = "Password is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!validate()) return;

    try {
      const response = await login({ email, password }).unwrap();

      if (response.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/dashboard");
      } else {
        setErrorMessage(response.message || "Login failed. Please try again.");
      }
    } catch (error: any) {
      const errorMsg =
        error?.data?.message ||
        error?.message ||
        "Invalid email or password";
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
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Stack  spacing={0.5} sx={{ mb: 3 ,alignItems:'center'}}>
          <Stack  sx={{display:"flex",flexDirection:'row',mb:1}}>
          <Box
            component="img"
            src={notebook}
            alt="Note Book"
            sx={{ width: 44, height: 44, }}
          />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 900, color: "primary.main", letterSpacing: 0.3 ,ml:1,mt:1,fontSize:'22px',fontFamily:'sans-serif'}}
          >
            Note Book
          </Typography>
          </Stack>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            Sign in
          </Typography>
          <Typography variant="body2" sx={{color:'text.secondary',textAlign:'center'}}>
            Welcome back to your workspace.
          </Typography>
        </Stack>

        <Box component="form" onSubmit={handleLogin} noValidate>
          <Stack spacing={2.5}>
            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }}
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
              disabled={isLoading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
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
                        size="small"
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
              startIcon={
                isLoading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : undefined
              }
              sx={{ py: 1.25, mt: 0.5 }}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </Stack>
        </Box>

        <Typography
          variant="body2"
          sx={{ mt: 3 ,textAlign:'center',color:'text.secondary'}}
        >
          Don&apos;t have an account?{" "}
          <MuiLink
            component={RouterLink}
            to="/signup"
            color="primary"
            underline="hover"
          sx={{fontWeight:500}}
          >
            Sign up
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
};
