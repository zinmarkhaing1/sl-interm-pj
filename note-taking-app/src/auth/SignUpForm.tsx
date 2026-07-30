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
  CircularProgress,
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.firstName.trim()) errors.firstName = "First name is required";
    if (!form.lastName.trim()) errors.lastName = "Last name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    if (!form.password.trim()) errors.password = "Password is required";
    else if (form.password.length < 8)
      errors.password = "Use at least 8 characters";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!validate()) return;

    try {
      const res = await signup({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      }).unwrap();
      console.log(res)

      if (res.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.auth));
        navigate("/");
      } else {
        setErrorMessage(res.message || "Signup failed. Please try again.");
      }
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || "Signup failed. Network error.";
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
          width: 440,
          maxWidth: "100%",
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Stack spacing={0.5} sx={{  alignItems:'center'}}>
          <Box  sx={{display:"flex",flexDirection:'row'}}>
        <Box
            component="img"
            src={notebook}
            alt="Note Book"
            sx={{ width: 44, height: 44, }}
          />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 900, color: "primary.main", letterSpacing: 0.3,mt:1,ml:1,fontSize:'22px' ,fontFamily:'sans-serif'}}
          >
            Note Book
          </Typography>

          </Box>
          
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "text.primary" ,mt:0}}
          >
            Create account
          </Typography>
          <Typography variant="body2" sx={{textAlign:'center', color:'text.secondary'}}>
            Start organizing your notes and tasks.
          </Typography>
        </Stack>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt:2}}>
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                name="firstName"
                label="First name"
                value={form.firstName}
                onChange={handleChange}
                error={!!fieldErrors.firstName}
                helperText={fieldErrors.firstName}
                disabled={isLoading}
                required
              />
              <TextField
                name="lastName"
                label="Last name"
                value={form.lastName}
                onChange={handleChange}
                error={!!fieldErrors.lastName}
                helperText={fieldErrors.lastName}
                disabled={isLoading}
                required
              />
            </Stack>

            <TextField
              name="email"
              type="email"
              label="Email"
              value={form.email}
              onChange={handleChange}
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
              disabled={isLoading}
              required
              autoComplete="email"
            />

            <TextField
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              value={form.password}
              onChange={handleChange}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password || "At least 8 characters"}
              disabled={isLoading}
              required
              autoComplete="new-password"
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
              sx={{ py: 1.25 }}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </Stack>
        </Box>

        <Typography
          variant="body2"
          sx={{ mt: 3,textAlign:'center', color:'text.secondary' }}
        >
          Already have an account?{" "}
          <MuiLink
            component={RouterLink}
            to="/login"
            color="primary"
            underline="hover"
             sx={{fontWeight:500}}
           
          >
            Sign in
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
};
