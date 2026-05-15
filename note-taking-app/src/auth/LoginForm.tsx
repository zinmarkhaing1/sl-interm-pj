
import {
  Box,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  Stack,
  Button,
} from "@mui/material";



import { Link as RouterLink } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';

import Email from "@mui/icons-material/Email";
import Lock from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { useLoginMutation } from "../services/authApi";


export const LoginForm = () => {
  const navigate = useNavigate();
  const [login, {isLoading}] = useLoginMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // const [loading,setLoading] = useState(false);
  // setLoading(true);
  const handleLogin = async() => {
    if (email.trim() === "" || password.trim() === "") {
      alert("Fill Email and Password");
      return;
    }
    try{
      const response = await login( {email, password}).unwrap();

      if (response.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user",JSON.stringify(response.data.user));

        alert("Login Success");
        navigate('/');
      }else {
        alert("Login failed");
      }
    }catch(error){
      console.log(error);
      alert("Login Failed");
      }
    }
  
          

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
            disabled={isLoading}
          >
            {isLoading? "Logging in..." : "Submit"}
           
          </Button>
          </Stack>
          <Stack
            spacing={2} 
            sx={{ mt: 3, justifyContent: "center", alignItems: "center" }}
          >
            
            <MuiLink component={RouterLink} to="/signup" color='inherit' sx={{cursor:'pointer'}}>Don't have an account?Sign Up here.</MuiLink>

           
          
          </Stack>
        </Paper>
      </Box>
    

  );
};
