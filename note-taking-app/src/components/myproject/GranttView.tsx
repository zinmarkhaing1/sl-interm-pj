import { Box, Typography, Divider, Stack, CircularProgress } from '@mui/material';
import { useGetNotesQuery } from '../../services/noteApi';
import type { Note } from '../../types/Note';

const getTimelineWidth = (note: Note) => {
  if (!note.startDate || !note.endDate) return 120;
  return Math.min(360, Math.max(100, 20 + new Date(note.endDate).getTime() / 1_000_000 - new Date(note.startDate).getTime() / 1_000_000));
};
interface GranttViewProps {
  filteredNotes: Note[]; 
}
export const GranttView = ({ filteredNotes }: GranttViewProps) => {
  const { data: notes = [], isLoading, isError } = useGetNotesQuery();

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
        Unable to load Gantt view.
      </Typography>
    );
  }

  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1.5, overflow: 'hidden' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '240px 1fr' } }}>
        <Box sx={{ borderRight: { md: '1px solid #e0e0e0' }, p: 2, bgcolor: "background.default" }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Project name
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Stack spacing={1}>
            {filteredNotes.map((note: Note) => (
              <Box key={note._id || note.id} sx={{ py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {note.title || 'Untitled'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {note.assignee || 'Unassigned'}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <Box sx={{ p: 2, position: 'relative' }}>
          <Box sx={{ display: 'flex', gap: 4, mb: 1, borderBottom: '1px solid #e0e0e0', pb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#878682' }}>
              Timeline
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: ' #973aa8' }}>
              Today
            </Typography>
          </Box>

          <Stack spacing={2}>
            {filteredNotes.map((note: Note) => (
              <Box key={note._id || note.id}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  {note.title || 'Untitled'}
                </Typography>
                <Box sx={{ position: 'relative', bgcolor: '#efeee9', borderRadius: 1, height: 24, width: '100%' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 2,
                      left: 0,
                      height: 20,
                      width: getTimelineWidth(note),
                      bgcolor: ' #dec9e9',
                      borderRadius: 1,
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
