

import { Box, Typography, Card, CardContent, Chip, Button, Stack, CircularProgress,  } from '@mui/material';
import { Add, ChatBubbleOutlineOutlined } from '@mui/icons-material';
import { useGetNotesQuery } from '../../services/noteApi';
import type { Note } from '../../types/Note';
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable,  } from '@hello-pangea/dnd';
import type { DropResult } from "@hello-pangea/dnd";


type ColumnConfig = {
  id: string;
  label: string;
  color: string;
};


const STATUS_COLUMNS:ColumnConfig[] = [
  { id: 'Todo', label: 'Todo',color:"#a3c4f3" },
  { id: 'In Progress', label: 'In Progress' ,color:"#ffadad"},
  { id: 'Complete', label: 'Complete',color:"#a3b18a" },
  { id: 'Done', label: 'Done' ,color:"#588157"},
];

interface BoardStatusProps {
  statusFilter: string;
  filteredNotes:Note[];
}

export const BoardStatus = ({ statusFilter, filteredNotes }: BoardStatusProps) => {
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
        Unable to load boards.
      </Typography>
    );
  }

  const displayedColumns = statusFilter === 'All' 
    ? STATUS_COLUMNS 
    : STATUS_COLUMNS.filter(col => col.id === statusFilter);

  const gridTemplate = displayedColumns.length === 1 
    ? '1fr' 
    : { xs: '1fr', md: `repeat(${displayedColumns.length}, minmax(0, 1fr))` };

  const handleOnDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    const targetStatus = destination.droppableId;
    const movedNoteId = draggableId;
    console.log(`Move note ${movedNoteId} to status: ${targetStatus}`);
    
    // Note: To make the interface persist, trigger your RTK query mutation endpoint here
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Box sx={{ display: 'grid', gridTemplateColumns: gridTemplate, gap: 2 }}>
        {displayedColumns.map((column) => {
          const columnNotes = filteredNotes.filter((note) => (note.task || 'Todo') === column.id);

          return (
            <Box 
              key={column.id} 
              sx={{ 
                bgcolor: '#f7f7f5', 
               border:`1px solid ${column.color}`,
                p: 1.5, 
                borderRadius: 2, 
                // minHeight: 450,
                display: 'flex',       // Added to ensure the Stack can grow
                flexDirection: 'column', // Stack cards vertically inside the container
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="subtitle1" sx={{  fontWeight: "bold",
                    mb: 1,
                    pl: 1,
                    textTransform: "uppercase",color: column.color,}}>
                  {column.label}
                </Typography>
                <Chip size="small" label={columnNotes.length} sx={{ bgcolor: column.color, }} />
              </Box>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <Stack
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    spacing={1}
                    sx={{
                      flexGrow: 1,
                      transition: 'background-color 0.2s ease',
                      bgcolor: snapshot.isDraggingOver ? 'rgba(0,0,0,0.02)' : 'transparent',
                      minHeight: 100
                    }}
                  >
                    {columnNotes.length ? (
                      columnNotes.map((note: Note, index: number) => {
                        // Crucial fix: properly structuralized inside curly braces
                        const cardId = note._id || note.id || `note-${index}`;
                        
                        return (
                          <Draggable key={cardId} draggableId={String(cardId)} index={index}>
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  mb: 1.5,
                                  boxShadow: '0px 1px 3px rgba(0,0,0,0.08)',
                                   borderLeft:`5px solid ${column.color}`,
                                  borderRadius: 1.5,
                                   height:'250px',
                                  userSelect: "none",
                                  ...provided.draggableProps.style // Important for dnd structural integrity during transition
                                }}
                              >
                                <CardContent sx={{ p: '12px !important' }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                    {note.title || 'Untitled'}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: '#6b6a65', mb: 1 }}>
                                    {note.description || note.content || 'No description'}
                                  </Typography>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
                                    <Chip label={note.assignee || 'Unassigned'} size="small" sx={{ fontSize: '0.7rem' }} />
                                    <Chip label={note.priority || 'Priority: none'} size="small" sx={{ fontSize: '0.7rem' }} />
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1, color: '#878682' }}>
                                    <ChatBubbleOutlineOutlined sx={{ fontSize: 12 }} />
                                    <Typography variant="caption">
                                      {note.category || 'No category'}
                                    </Typography>
                                  </Box>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        );
                      })
                    ) : (
                      <Typography variant="body2" sx={{ color: '#6b6a65', mt: 1, fontStyle: 'italic' }}>
                        No notes in this stage.
                      </Typography>
                    )}
                    {provided.placeholder}
                  </Stack>
                )}
              </Droppable>

              <Button
                startIcon={<Add />}
                fullWidth
                onClick={() => navigate('/my-project/new-project')}
                sx={{ justifyContent: 'flex-start', color: '#878682', textTransform: 'none', fontSize: '0.85rem', mt: 1, cursor: 'pointer' }}
              >
                New project
              </Button>
            </Box>
          );
        })}
      </Box>
    </DragDropContext>
  );
};
