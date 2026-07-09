import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Chip, Typography, Box, Button, CircularProgress } from '@mui/material';
import { Add, ChatBubbleOutlineOutlined } from '@mui/icons-material';
import { useGetNotesQuery } from '../../services/noteApi';
import type { Note } from '../../types/Note';
import { useNavigate } from 'react-router-dom';

interface AllProjectProps {
  filteredNotes : Note[];
}

export const AllProject:React.FC<AllProjectProps> = ({filteredNotes}) => {
  const {  isLoading, isError } = useGetNotesQuery();

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" sx={{ textAlign: 'center', mt: 5 }}>
        Unable to load projects.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', borderRadius: 1.5 }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: '#fafafa' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, color: '#6b6a65' }}>Project name</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#6b6a65' }}>Assignee</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#6b6a65' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#6b6a65' }}>Start date</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#6b6a65' }}>End date</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#6b6a65' }}>Priority</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#6b6a65' }}>Team</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredNotes.map((note: Note) => (
            <TableRow key={note._id || note.id} sx={{ '&:hover': { bgcolor: '#f7f7f5' } }}>
              <TableCell sx={{ fontWeight: 500,color:"#6d6875" }}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                  <ChatBubbleOutlineOutlined sx={{ fontSize: 12 }} />
                  <Typography variant="body2">{note.title || 'Untitled'}</Typography>
                </Box>
              </TableCell>
              <TableCell sx={{color:"#6d6875"}}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 18, height: 18, fontSize: '0.65rem' }}>
                    {note.assignee ? note.assignee.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                  <Typography variant="body2">{note.assignee || 'Unassigned'}</Typography>
                </Box>
              </TableCell>
              <TableCell sx={{color:"#6d6875"}}>
                <Chip label={note.task || 'Todo'} size="small" sx={{ fontSize: '0.75rem', height: 20, color:"#6d6875"}} />
              </TableCell>
              <TableCell sx={{ color: '#6d6875' }}>{note.startDate || '-'}</TableCell>
              <TableCell sx={{ color: '#6b6a65' }}>{note.endDate || '-'}</TableCell>
              <TableCell sx={{color:"#6d6875"}}>
                <Chip label={note.priority || '-'} size="small" sx={{ fontSize: '0.75rem', height: 20, borderRadius: '4px' ,color:"#6d6875"}} />
              </TableCell>
              <TableCell sx={{color:"#6d6875"}}>{note.category || '-'}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={7}>
              <Button startIcon={<Add />} sx={{ color: '#878682', textTransform: 'none', p: 0 }} onClick={() => navigate('/my-project/new-project')}>
                New project
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
