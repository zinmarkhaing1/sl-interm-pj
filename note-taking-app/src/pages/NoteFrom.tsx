import * as React from 'react';
import {Box,IconButton,Paper,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,TextField,Typography,InputAdornment,Stack} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGetNotesQuery ,useDeleteNoteMutation  } from "../services/noteApi";
import NoteAddIcon from "@mui/icons-material/NoteAdd"
import { useNavigate } from 'react-router-dom';
export const NoteFrom = () => {
    const [search,setSearch] = React.useState("");
    const navigate = useNavigate();

   

    const handleCreate =():void =>{
        navigate("/note-form/create")
    }
    const { data: notes = [], isLoading, isError } = useGetNotesQuery();
    const [deleteNote] = useDeleteNoteMutation();
     const handleDelete = async (id:any) => {
    try {
        await deleteNote(id).unwrap();
    }catch(err:any){
        console.log("Delete Failed:",err);
        
    }
  }

    const filteredRows = notes.filter(
    (row) =>
      row.title?.toLowerCase().includes(search.toLowerCase()) ||
      row.description?.toLowerCase().includes(search.toLowerCase()) ||
      row.content?.toLowerCase().includes(search.toLowerCase())
  ); 
 

  if (isLoading) return <Typography>Loading notes...</Typography>;
  if (isError) return <Typography color="error">Failed to load notes.</Typography>;
 
  
  return (
    <Paper sx={{width:'100%',minWidth:400,p:2}}>
        <Box sx={{display:'flex',justifyContent:"center",mb:2,alignItems:'center'}}>
            <Typography variant='h5'  sx={{display:'flex',mr:5,fontWeight:'bold'}}>Note Form </Typography>
        </Box>
        <Stack spacing={2} direction="row" sx={{m:1}}>
        <IconButton sx={{ml:2,borderRadius:3}} onClick={handleCreate} >
            <NoteAddIcon sx={{color:'green'}}/>
            <Typography variant='h6' sx={{color:'black'}}>Create Note</Typography>   
          </IconButton>
            <TextField size='small' placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)}  slotProps={{input:{startAdornment: (<InputAdornment position="end"><SearchIcon/></InputAdornment>),},}}/>
        </Stack>

        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow sx={{bgcolor:'#dee4ea',fontWeight:'bold'}}>
                        <TableCell>ID</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Assignee</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell>Action</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredRows.map((row, index)=>(
                         <TableRow key={row._id ?? row.id ?? index}>
                        <TableCell>{row.id ?? index + 1}</TableCell>
                        <TableCell>{row.title}</TableCell>
                        <TableCell>{row.description ?? row.content}</TableCell>
                        <TableCell>{row.priority}</TableCell>
                        <TableCell>{row.assignee}</TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell>{row.task}</TableCell>
                        <TableCell>{row.startDate}</TableCell>
                        <TableCell>{row.endDate}</TableCell>
                        <TableCell> <IconButton sx={{fontWeight:'12px'}} color='success' onClick={()=>navigate(`/note-form/edit/${row._id}`)}><EditIcon/></IconButton>
                        <IconButton color='error' onClick={()=>handleDelete(row._id)}><DeleteIcon/></IconButton></TableCell>


                    </TableRow>
                    ))}
                   
                </TableBody>
            </Table>
        </TableContainer>
    </Paper>
  )
}
