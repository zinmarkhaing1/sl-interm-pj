import { Box, Stack,Typography ,TextField,Button,ToggleButtonGroup,ToggleButton,List,ListItem,ListItemText,Paper, IconButton} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteIcon from '@mui/icons-material/Note'

type Todo = {
  id: number;
  text: string;
  type:'todo' | 'important';
};


export const NoteCategory = () => {
  const today = new Date().toDateString();
  const [input, setInput] = useState('');
  const [type, setType] = useState<'todo' | 'important'>('todo');
  const [todos, setTodos] = useState<Todo[]>([]);

  // Add item 
  const handleAdd = () =>{
    if(!input.trim()) return;

    const newItem :Todo = {
      id: Date.now(),
      text:input,
      type:type,
    };
    setTodos([...todos,newItem]);
    setInput("");
  };
  // Delete 
  const handleDelete = (id:number) => {
    setTodos(todos.filter((t) =>t.id !== id));
  };
  const navigate = useNavigate();
  return (
    <Box sx={{bgcolor: "#ddecf1",width:'100%',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}} >
      <Paper sx={{width:500,height:500, justifyContent:'center',alignItems:'center'}}>
        
      <Box sx={{justifyContent:'center',alignItems:'center',display:'grid'}}>
        <CalendarTodayIcon fontSize="medium" color="primary" sx={{mt:2}}/>
        <Typography variant='h5' sx={{fontWeight:'bold'}} > {today}</Typography>
        <Typography sx={{color:'gray', fontWeight:'bold',mb:2}}>
        Create your tasks and mark importance
      </Typography>
      </Box>
      <Box sx={{display:'flex',gap:3,m:2,borderRadius:2}}>
        
          {/* <NoteIcon sx={{color:'gray', fontWeight:'bold',}}/> */}
        <TextField  fullWidth label="Write task..." value={input} onChange={(e)=>setInput(e.target.value)}/>
        <Button variant="contained" onClick={handleAdd} sx={{bgcolor:'#949ea9'}} > Add</Button>
      
      </Box>
       <ToggleButtonGroup exclusive sx={{ display:'flex',justifyContent:'center',alignItems:'center', p:2 ,m:3 }} value={type} onChange={(e,val) =>{ if (val !==null) setType(val);}}>
        
        <ToggleButton sx={{mr:1, fontWeight:'bold'}} value="todo">Todo</ToggleButton>
        <ToggleButton sx={{ml:1,fontWeight:'bold'}} value="important">Important </ToggleButton>
      </ToggleButtonGroup>
     
      <Paper sx={{ p: 1, m: 2,bgcolor:'#b2bcc7'}}>
        <Typography variant="h6" sx={{display:'flex',justifyContent:'center',alignItems:'center' }}> Important</Typography>

        <List>
              {todos.filter((t)=>t.type == 'important').map((todo) =>( <ListItem key={todo.id} secondaryAction ={<IconButton onClick={() => handleDelete(todo.id)}><DeleteIcon onClick={()=>navigate('/trash')}/></IconButton>}>
              <ListItemText primary={todo.text}/> 
              </ListItem>))}
            
        </List>
      </Paper>
      <Paper sx={{ p: 1, m: 2,mb:2,bgcolor:'#b2bcc7'}}>
        <Typography variant="h6" sx={{display:'flex',justifyContent:'center',alignItems:'center', }}> Todo List</Typography>

        <List>
              {todos.filter((t)=>t.type == 'todo').map((todo) =>( <ListItem key={todo.id} secondaryAction ={<IconButton onClick={() => handleDelete(todo.id)}><DeleteIcon onClick={()=>navigate('/trash')}/></IconButton>}>
              <ListItemText primary={todo.text}/> 
              </ListItem>))}
            
        </List>
      </Paper>
      </Paper>
    </Box>
  )
}
