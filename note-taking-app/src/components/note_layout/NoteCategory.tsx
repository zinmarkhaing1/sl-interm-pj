import { Box, Typography ,TextField,Button,ToggleButtonGroup,ToggleButton,List,ListItem,ListItemText,Paper, IconButton} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from 'react';

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
  return (
    <Box sx={{p:3}}>
        <CalendarTodayIcon fontSize="small" color="primary"/>
        <Typography variant='h5' sx={{fontWeight:'bold'}} >{today}</Typography>
        <Typography sx={{color:'gray', fontWeight:'bold',mb:2}}>
        Create your tasks and mark importance
      </Typography>

      <Box sx={{display:'flex',gap:2,mb:2}}>
        <TextField fullWidth label="Write task..." value={input} onChange={(e)=>setInput(e.target.value)}/>

        <Button variant="contained" onClick={handleAdd} > Add</Button>
      </Box>
      <ToggleButtonGroup exclusive sx={{ mb: 3,p:2 ,m:3 }} value={type} onChange={(e,val) =>{ if (val !==null) setType(val);}}>
        
        <ToggleButton sx={{mr:2}} value="todo">Todo</ToggleButton>
        <ToggleButton value="important">Important </ToggleButton>
      </ToggleButtonGroup>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6"> Important</Typography>

        <List>
              {todos.filter((t)=>t.type == 'important').map((todo) =>( <ListItem key={todo.id} secondaryAction ={<IconButton onClick={() => handleDelete(todo.id)}><DeleteIcon/></IconButton>}>
              <ListItemText primary={todo.text}/> 
              </ListItem>))}
            
        </List>
      </Paper>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6"> Todo List</Typography>

        <List>
              {todos.filter((t)=>t.type == 'todo').map((todo) =>( <ListItem key={todo.id} secondaryAction ={<IconButton onClick={() => handleDelete(todo.id)}><DeleteIcon/></IconButton>}>
              <ListItemText primary={todo.text}/> 
              </ListItem>))}
            
        </List>
      </Paper>
    </Box>
  )
}
