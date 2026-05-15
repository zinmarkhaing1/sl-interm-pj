// import { Box, Paper,TextField,Typography,InputAdornment,Stack,Button } from '@mui/material';
// import { ThemeProvider,createTheme } from '@mui/material/styles';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import Email from '@mui/icons-material/Email';
// import Lock from '@mui/icons-material/Lock';
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#accbed',
//       dark: '#6596c6',
//     },
//   },
// });
// export const LoginForm = () => {
//   return (
//      <ThemeProvider theme={theme}>

//             <Box  sx={{display:'flex',justifyContent:'center',alignItems:"center",minHeight:"100vh",bgcolor:'primary.main','&:hover':{bgcolor:'primary.dark',pt:5}}}>
//                 <Paper elevation={10} sx={{width: 420,p: 4,borderRadius: 3,}} >
//                    <Typography variant="h5" sx={{textAlign:"center",fontWeight:"bold",color:'#2f72ba'}}>Sign In</Typography>
//                    {/* <TextField fullWidth margin='normal' variant='standard' label="Name" slotProps={{input: {startAdornment: (
//                     <InputAdornment position="start"> <AccountCircle /></InputAdornment> ),},}} /> */}
//                     <TextField fullWidth margin='normal' variant='standard' label="Email" slotProps={{input: {startAdornment: (
//                     <InputAdornment position="start"> <Email /></InputAdornment> ),},}} />
//                     <TextField fullWidth margin='normal' variant='standard' label="Password" type='password' slotProps={{input: {startAdornment: (
//                     <InputAdornment position="start"> <Lock /></InputAdornment> ),},}} />

//                     <Stack spacing={2} direction='row' sx={{mt:3,justifyContent:"center",alignItems:"center"}}>
//                         <Button variant="contained" color='info' sx={{mt:1, py:1.2,borderRadius:2, textTransform:"none",fontWeight:"bold"}}> Submit</Button>
//                         {/* <Button variant="outlined" color='info' sx={{mt:1, py:1.0,borderRadius:2, textTransform:"none",fontWeight:"bold"}}> Sign Out</Button> */}
//                     </Stack>
//                 </Paper>

//             </Box>

//     </ThemeProvider>

//   )
// }

import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSignupMutation } from "../services/authApi";



const theme = createTheme({
  palette: {
    primary: {
      main: "#accbed",
      dark: "#6596c6",
    },
  },
});

// const initialValuesRegister: RegisterValues = {
//   firstName: "",
//   lastName: "",
//   email: "",
//   password: "",
// };

export const SignUpForm = () => {
  const [signup, { isLoading,  }] = useSignupMutation();
  const navigate = useNavigate();
  

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });


  //input change
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

   // submit
  const handleSubmit = async () => {
    const { firstName, lastName, email, password } = form;

    if (!firstName || !lastName || !email || !password) {
      alert("Please fill all fields");
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

        alert("Signup Success");
        navigate("/login");
       
      } else {
        alert("Signup failed");
      }
    } catch (err) {
      console.log(err);
      alert("Signup Failed");
    }
  };

    
    return (
      <ThemeProvider theme={theme}>
        <Box>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              color: "#2f72ba",
              m: 2,
            }}
          >
            Note Taking App
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Paper elevation={10} sx={{ width: 500, p: 4, borderRadius: 3 }}>
              <Stack spacing={2} direction="row" sx={{ m: 2 }}>
                <TextField
                  variant="outlined"
                  name="firstName"
                  label="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
                <TextField
                  variant="outlined"
                  name="lastName"
                  label="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </Stack>
              <Stack spacing={2} sx={{ m: 2 }}>
                <TextField
                  variant="outlined"
                  name="email"
                  label="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  sx={{}}
                />
                <TextField
                  variant="outlined"
                  name="password"
                  type="password"
                  label="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  sx={{}}
                />
              </Stack>
              <Stack spacing={2} sx={{ m: 1 }}>
                <Button
                  variant="contained"
                  color="info"
                  sx={{
                    py: 1.2,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                  onClick={handleSubmit}
                  disabled={isLoading}
                  
                >
                 
                  {isLoading ? "loading" : "Register"}
                </Button>
                {/* <Link color='inherit' onClick={()=>navigate('/login')}>Already have an account? Login here.</Link> */}
                <MuiLink
                  component={RouterLink}
                  to="/login"
                  color="inherit"
                  sx={{ cursor: "pointer" }}
                >
                  Already have an account? Login here.
                </MuiLink>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </ThemeProvider>
    );
  
};
