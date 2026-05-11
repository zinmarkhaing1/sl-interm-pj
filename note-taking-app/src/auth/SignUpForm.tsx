
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

import { ThemeProvider,createTheme } from '@mui/material/styles';
import { Box, Paper,TextField,Typography,Stack,Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// import React from 'react';
const theme = createTheme({
  palette: {
    primary: {
      main: '#accbed',
      dark: '#6596c6',
    },
  },
});
export const SignUpForm = () => {
const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>

        <Box >
            <Typography variant='h5' sx={{textAlign:"center",fontWeight:"bold",color:'#2f72ba',m:2}}>Note Taking App</Typography>
            <Box sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <Paper elevation={10} sx={{width: 500,p:4,borderRadius: 3,}} >
            <Stack spacing={2} direction="row" sx={{m:2}}>
                <TextField variant='outlined' label="First Name" required/>
                <TextField variant='outlined' label='Last Name' required/>
            </Stack>
            <Stack spacing={2} sx={{m:2}}>
                <TextField variant='outlined' label="Email" required sx={{}} />
                <TextField variant='outlined' type='password' label="Password" required sx={{}} />
            </Stack>
            <Stack spacing={2} sx={{m:1}}>
            <Button variant="contained" color='info' sx={{ py:1.2,borderRadius:2, textTransform:"none",fontWeight:"bold"}}> Register</Button>
            {/* <Link color='inherit' onClick={()=>navigate('/login')}>Already have an account? Login here.</Link> */}
            <MuiLink component={RouterLink} to="/login" color='inherit' sx={{cursor:'pointer'}}>Already have an account? Login here.</MuiLink>
            
            </Stack>
            </Paper>
            </Box>
            
        </Box>

    </ThemeProvider>
  )
}

