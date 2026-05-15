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
   <Box sx={{bgcolor: "#ddecf1", width:'100%',height:'auto'}}>
    <Typography variant='h4' sx={{fontWeight:'bold',mb:3,display:'flex',justifyContent:'center',alignItems:'center'}}>Categories</Typography>
    <Grid container spacing={3}>
        {categoties.map((item) =>(

             <Grid sx={{xs:12,sm:6,md:3,m:2}} key={item}>
                <Card sx={{borderRadius:3,justifyContent:'center',alignItems:'center', boxShadow:3,cursor:'pointer',transition:'0.3s','&:hover':{transform:'translateY(-5px)',},}}>
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
