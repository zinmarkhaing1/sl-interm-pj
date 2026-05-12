
import {
  Box,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  Stack,
  Button,
} from "@mui/material";

// import { ThemeProvider, createTheme } from "@mui/material/styles";

import { Link as RouterLink } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';

import Email from "@mui/icons-material/Email";
import Lock from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


export const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = () => {
    if (email.trim() === "" || password.trim() === "") {
      alert("Fill Email and Password");
      return;
    }
    localStorage.setItem("token", "user-login");
    navigate("/");
  };


          

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "primary.main",
        minHeight: "100vh"
        // "&:hover": { bgcolor: "primary.dark", pt: 5 },
      }}
    >
      <Paper elevation={10} sx={{ width: 420, p: 4, borderRadius: 3 }}>
        <Typography
          variant="h5"
          sx={{ textAlign: "center", fontWeight: "bold", color: "#2f72ba" }}
        >
          Sign In
        </Typography>
        {/* <TextField fullWidth margin='normal' variant='standard' label="Name" slotProps={{input: {startAdornment: (
                    <InputAdornment position="start"> <AccountCircle /></InputAdornment> ),},}} /> */}
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
                  {" "}
                  <Email />
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
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  {" "}
                  <Lock />
                </InputAdornment>
              ),
            },
          }}
        />

        <Stack
          spacing={2}
          direction="row"
          sx={{ mt: 3, justifyContent: "center", alignItems: "center" }}
        >
          <Button
            variant="contained"
            color="info"
            fullWidth
            sx={{
              mt: 1,
              py: 1.2,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
            
            }}
            onClick={handleLogin}
          >
            {" "}
            Submit
          </Button>
          </Stack>
          <Stack
            spacing={2} 
            sx={{ mt: 3, justifyContent: "center", alignItems: "center" }}
          >
            
            <MuiLink component={RouterLink} to="/signup" color='inherit' sx={{cursor:'pointer'}}>Don't have an account?Sign Up here.</MuiLink>

            {/* <Button variant="outlined" color='info' sx={{mt:1, py:1.0,borderRadius:2, textTransform:"none",fontWeight:"bold"}}> Sign Out</Button> */}
          
          </Stack>
        </Paper>
      </Box>
    // {/* </ThemeProvider>
          // {/* <Button variant="outlined" color='info' sx={{mt:1, py:1.0,borderRadius:2, textTransform:"none",fontWeight:"bold"}}> Sign Out</Button> */}
        // </Stack>
      // </Paper>
    // </Box> */}

  );
};
