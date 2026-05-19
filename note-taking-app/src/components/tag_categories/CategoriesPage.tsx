import { Box, Card, CardContent, Grid, Typography } from '@mui/material'

import { useGetNotesQuery } from '../../services/noteApi';
const categoties = [
    "Family & Friends",
    "Fitness & Health",
    "Study",
    "My Note",
    "Company Note",
];





export const CategoriesPage = () => {
    const {data: notes = [],isLoading} = useGetNotesQuery();
    const getNotesByCategory = (category: string) => {
     return notes.filter((note: any) => note.category === category);
      };
      if (isLoading) return <p>Loading...</p>
  return (
   <Box sx={{ bgcolor: "#dee4ea", width: "100%", maxWidth: 1200, mx: "auto" }}>
    <Typography
      variant='h5'
      sx={{
        fontWeight: 'bold',
        mb: 3,
        textAlign: "center",
        fontSize: { xs: "1.5rem", sm: "1.75rem" },
      }}
    >
      Categories
    </Typography>
    <Grid container spacing={{ xs: 2, sm: 3 }}>
        {categoties.map((item) =>(

             <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={item}>
                <Card sx={{borderRadius:3,justifyContent:'center',alignItems:'center', boxShadow:3,cursor:'pointer',transition:'0.3s',height:"100%",'&:hover':{transform:'translateY(-5px)',},}}>
                    <CardContent>
                        <Typography variant='h6' sx={{fontWeight:'bold'}}>
                            {item}
                        </Typography>
                         {getNotesByCategory(item).map((note: any) => (
                    <Box key={note._id} sx={{ mt: 1, p: 1, bgcolor: "#fff", borderRadius: 2 }}>
                        <Typography sx={{fontWeight:'bold'}}>{note.title}</Typography>
                        <Typography variant="body2">{note.content}</Typography>
                        </Box>
        ))}
                        <Typography color='text.secondary'>Open notes</Typography>
                    </CardContent>
                </Card>
             </Grid>
        ))}
   
    </Grid>
   </Box>
  )
}
