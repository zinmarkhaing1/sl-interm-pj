// import { Stack,Button,TextField ,Paper,Typography} from "@mui/material";

// export const LoginForm = () => {
//     return(
//          <Stack sx={{minHeight: "100vh",background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",}} justifyContent="center" alignItems="center">
//         <Paper elevation={10} sx={{width:420, p:4,borderRadius:3}}  >
//             <Typography variant='h5' fontWeight='bold' textAlign='center' mb={3}>Welcome To Note App</Typography>
//             <Stack spacing={2}>
//                 <TextField label="Name" variant="standard" fullWidth />
//                 <TextField label="Email" variant="standard" fullWidth />
//                 <TextField label="Password" type="password" variant="standard"   fullWidth helperText="Do not share password with anyone!"/>
//             </Stack>
//             <Stack spacing={2} direction='row' sx={{mt:3}}>
//                 <Button variant="contained" color="info" fullWidth >Sign In</Button>
//                 <Button variant="outlined" color="error" fullWidth >Sign Out</Button>

//             </Stack>
//         </Paper>
//      </Stack>
//     )
// }

// import Box from '@mui/material/Box';
// import { Paper,Typography,Button,Stack,CircularProgress, InputAdornment,TextField, } from '@mui/material';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import { Email } from '@mui/icons-material';
// import { Lock } from '@mui/icons-material';
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// type FormState = {
//   name: string;
//   email: string;
//   password: string;
// };

// type TouchedState = {
//   name: boolean;
//   email: boolean;
//   password: boolean;
// };
// export const LoginForm =()=>{
//     const [form, setForm] = useState<FormState>({
//         name: "",
//         email: "",
//         password: "",
//       });

//       const [touched, setTouched] = useState<TouchedState>({
//         name: false,
//         email: false,
//         password: false,
//       });

//       const [loading, setLoading] = useState<boolean>(false);

//       const navigate = useNavigate();

//       const errors = {
//         name: !form.name.trim(),
//         email: !form.email.includes("@"),
//         password: form.password.length < 6,
//       };

//       const handleChange = (field: keyof FormState, value: string) => {
//         // setForm({ ...form, [field]: value });
//         setForm ((prev) =>({
//             ...prev,[field]:value,
//         }))
//       };

//       const handleSubmit = async () => {
//         setTouched({
//           name: true,
//           email: true,
//           password: true,
//         });

//         if (errors.name || errors.email || errors.password) return;

//         setLoading(true);

//         await new Promise((res) => setTimeout(res, 2000));

//         setLoading(false);

//         localStorage.setItem("token", "demo-token");
//         navigate("/dashboard");
//       };
// const handleLogout = () => {
//   setForm({
//     name: "",
//     email: "",
//     password: "",
//   });

//   localStorage.removeItem("token");

//   navigate("/login");
// };

// return(
//     <Box  sx={{ minHeight: "100vh",background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" ,}}  >
//         <Paper  elevation={10} sx={{width: 420,p: 4,borderRadius: 3,}}>
//         <Typography variant="h5" sx={{textAlign:"center",fontWeight:"bold"}}>Welcome </Typography>
//             <TextField fullWidth margin='normal' label="Name" slotProps={{input: {startAdornment: (
//               <InputAdornment position="start"> <AccountCircle /></InputAdornment> ),},}} variant="standard"  value={form.name}
//             onChange={(e) => handleChange("name", e.target.value)}
//             onBlur={() =>
//               setTouched((prev) => ({ ...prev, name: true }))
//             }
//             error={touched.name && errors.name}
//             helperText={
//               touched.name && errors.name ? "Name is required" : ""
//             }/>
//             <TextField fullWidth margin='normal'  label="Email" slotProps={{input: {startAdornment: (
//               <InputAdornment position="start"> <Email /></InputAdornment> ),},}} variant="standard" value={form.email}
//             onChange={(e) => handleChange("email", e.target.value)}
//             onBlur={() =>
//               setTouched((prev) => ({ ...prev, email: true }))
//             }
//             error={touched.email && errors.email}
//             helperText={
//               touched.email && errors.email ? "Invalid email" : ""
//             }/>
//             <TextField fullWidth margin='normal' label="Password" type='password' slotProps={{input: {startAdornment: (
//               <InputAdornment position="start"> <Lock /></InputAdornment> ),},}} variant="standard" value={form.password}
//             onChange={(e) => handleChange("password", e.target.value)}
//             onBlur={() =>
//               setTouched((prev) => ({ ...prev, password: true }))
//             }
//             error={touched.password && errors.password}
//             helperText={
//               touched.password && errors.password
//                 ? "Min 6 characters required"
//                 : "Don't share password with anyone!"
//             } />
//             <Stack spacing={2} direction='row' sx={{mt:3}}>
//             <Button variant="contained" color="info"  sx={{mt: 1, py: 1.2, borderRadius: 2,textTransform: "none",fontWeight: "bold",}} onClick={handleSubmit}
//             disabled={loading}> {loading ? (
//               <CircularProgress size={22} sx={{ color: "white" }} />
//             ) : (
//               "Sign In"
//             )}</Button>
//             <Button variant="outlined" color="error"  sx={{mt: 1, py: 1.2, borderRadius: 2,textTransform: "none",fontWeight: "bold", }} onClick={handleLogout}>Sign Out</Button>
//             </Stack>

//         </Paper>

//     </Box>

// )
// }

import {
  Box,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  Stack,
  Button,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Link as RouterLink } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import Email from "@mui/icons-material/Email";
import Lock from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const theme = createTheme({
  palette: {
    primary: {
      main: "#accbed",
      dark: "#6596c6",
    },
  },
});

export const LoginForm = () => {
  const navigate = useNavigate();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const handleLogin = () => {
    if (email.trim() === "" || password.trim() === ""){
      alert ("Fill Email and Password");
      return;
    }
    localStorage.setItem("token", "user-login");
    navigate("/");
  };
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "primary.main",
          "&:hover": { bgcolor: "primary.dark", pt: 5 },
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
            <MuiLink component={RouterLink} to="/signup" color='inherit' sx={{cursor:'pointer'}}>Don't have an account?Sign Up here.</MuiLink>
            {/* <Button variant="outlined" color='info' sx={{mt:1, py:1.0,borderRadius:2, textTransform:"none",fontWeight:"bold"}}> Sign Out</Button> */}
          </Stack>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};
