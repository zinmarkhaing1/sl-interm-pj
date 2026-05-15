import { Box,Grid,Typography,Card ,CardContent, CardActions,IconButton,Tooltip } from '@mui/material'
import { useState } from 'react';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';


const initialTrashNotes=[
    {id:1,title:'',content:''},
    {id:2,title:'',content:''},
]
export const TrashPage = () => {
    const [notes,setNotes] = useState(initialTrashNotes);

    const handleRestore = (id:number) =>{
        setNotes(notes.filter(note => note.id !==id));
        console.log("Restored note:",id);
    };

    const handleDeletePermanent = (id:number) => {
        setNotes(notes.filter(note => note.id !==id));
        console.log("Permanently deleted note:", id);
        
    };
  return (
    <Box sx={{width:'100%',minHeight:'100vh',bgcolor:'#dee4ea',flexGrow:1,  justifyContent:'center', alignItems:'center'}}>
        <Typography variant='h4' sx={{mb:3,fontWeight:'bold',display:'flex',justifyContent:'center',alignItems:'center'}}>
            Trash
        </Typography>

        {notes.length === 0 ? (
            <Typography variant='body1' color='text.Secondary' sx={{display:'flex',justifyContent:'center',alignItems:'center'}} >This is empty.</Typography>
        ):(
            <Grid container spacing={3} sx={{m:2,display:'flex',justifyContent:'center',alignItems:'center'}} >
                {notes.map((note) =>(
                    <Grid  key={note.id} sx={{sm:6,xs:12,md:4,}}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {note.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {note.content}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Tooltip title="Restore">
                    <IconButton onClick={() => handleRestore(note.id)} color="primary">
                      <RestoreFromTrashIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Permanently">
                    <IconButton onClick={() => handleDeletePermanent(note.id)} color="error">
                      <DeleteForeverIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
                ))}
            </Grid>
        )}
    </Box>
  )
}
