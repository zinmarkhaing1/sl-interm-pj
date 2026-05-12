import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
// import { useNavigate } from 'react-router-dom';
// import React from 'react';

const categoties = [
    "Family & Friends",
    "Fitness & Health",
    "Study",
    "My Note",
    "Company Note",
];


export const CategoriesPage = () => {
  return (
   <Box sx={{bgcolor: "#ddecf1", width:'100%',minHeight:'100vh'}}>
    <Typography variant='h4' sx={{fontWeight:'bold',mb:3,display:'flex',justifyContent:'center',alignItems:'center'}}>Categories</Typography>
    <Grid container spacing={3}>
        {categoties.map((item, index) =>(
             <Grid sx={{xs:12,sm:6,md:3,m:2}} key={index}>
                <Card sx={{borderRadius:3,justifyContent:'center',alignItems:'center', boxShadow:3,cursor:'pointer',transition:'0.3s','&:hover':{transform:'translateY(-5px)',},}}>
                    <CardContent>
                        <Typography variant='h6' sx={{fontWeight:'bold'}}>
                            {item}
                        </Typography>
                        <Typography color='text.secondary'>Open notes</Typography>
                    </CardContent>
                </Card>
             </Grid>
        ))}
   
    </Grid>
   </Box>
  )
}
