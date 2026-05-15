import { Box, Typography ,TextField,Button,ToggleButtonGroup,ToggleButton,List,ListItem,ListItemText,Paper, IconButton} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from 'react';
import { useCreateTaskMutation, useDeleteTaskMutation, useGetTasksQuery } from '../../services/taskApi';
import type { Task, TaskType } from '../../services/taskApi';



export const NoteCategory = () => {
  const today = new Date().toDateString();
  const [input, setInput] = useState('');
  const [type, setType] = useState<TaskType>('Todo');
  const { data: tasks = [], isLoading } = useGetTasksQuery();
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const importantTasks = tasks.filter((task) => task.notetypes === 'Important');
  const todoTasks = tasks.filter((task) => task.notetypes === 'Todo');

  const handleAdd = async () =>{
    if(!input.trim()) return;

    try {
      await createTask({
        input: input.trim(),
        notetypes: type,
      }).unwrap();
      setInput("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id:string) => {
    try {
      await deleteTask(id).unwrap();
    } catch (err) {
      console.log(err);
    }
  };

  const renderTasks = (taskList: Task[]) => (
    <List>
      {taskList.map((task) => (
        <ListItem
          key={task._id}
          secondaryAction={
            <IconButton onClick={() => handleDelete(task._id)}>
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemText primary={task.input} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box sx={{bgcolor: "#ddecf1",width:'100%',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}} >
      <Paper sx={{width:500,minHeight:500, justifyContent:'center',alignItems:'center'}}>
        
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
        <Button variant="contained" onClick={handleAdd} disabled={isCreating} sx={{bgcolor:'#949ea9'}} > Add</Button>
      
      </Box>
       <ToggleButtonGroup exclusive sx={{ display:'flex',justifyContent:'center',alignItems:'center', p:2 ,m:3 }} value={type} onChange={(_e,val) =>{ if (val !==null) setType(val);}}>
        
        <ToggleButton sx={{mr:1, fontWeight:'bold'}} value="Todo">Todo</ToggleButton>
        <ToggleButton sx={{ml:1,fontWeight:'bold'}} value="Important">Important </ToggleButton>
      </ToggleButtonGroup>
     
      <Paper sx={{ p: 1, m: 2,bgcolor:'#b2bcc7'}}>
        <Typography variant="h6" sx={{display:'flex',justifyContent:'center',alignItems:'center' }}> Important</Typography>

        {isLoading ? <Typography sx={{textAlign:'center'}}>Loading...</Typography> : renderTasks(importantTasks)}
      </Paper>
      <Paper sx={{ p: 1, m: 2,mb:2,bgcolor:'#b2bcc7'}}>
        <Typography variant="h6" sx={{display:'flex',justifyContent:'center',alignItems:'center', }}> Todo List</Typography>

        {isLoading ? <Typography sx={{textAlign:'center'}}>Loading...</Typography> : renderTasks(todoTasks)}
      </Paper>
      </Paper>
    </Box>
  )
}
