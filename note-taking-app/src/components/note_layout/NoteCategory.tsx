import { Box, Typography ,TextField,Button,ToggleButtonGroup,ToggleButton,List,ListItem,ListItemText,Paper} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';



const today = new Date().toDateString();
export const NoteCategory = () => {
  return (
    <Box sx={{p:3}}>
        <CalendarTodayIcon fontSize="small" color="primary"/>
        <Typography variant='h5' sx={{fontWeight:'bold'}} >{today}</Typography>
        <Typography sx={{color:'gray', fontWeight:'bold',mb:2}}>
        Create your tasks and mark importance
      </Typography>

      <Box sx={{display:'flex',gap:2,mb:2}}>
        <TextField fullWidth label="Write task..."/>

        <Button variant="contained" > Add</Button>
      </Box>
      <ToggleButtonGroup exclusive sx={{ mb: 3,p:2 ,m:3 }}>
        
        <ToggleButton sx={{mr:2}} value="todo">Todo</ToggleButton>
        <ToggleButton value="important">Important </ToggleButton>
      </ToggleButtonGroup>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6"> Important</Typography>

        <List>
              <ListItem>   <ListItemText  />
              </ListItem>
            
        </List>
      </Paper>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6"> Todo List</Typography>

        <List>
              <ListItem>   <ListItemText  />
              </ListItem>
            
        </List>
      </Paper>
    </Box>
  )
}
