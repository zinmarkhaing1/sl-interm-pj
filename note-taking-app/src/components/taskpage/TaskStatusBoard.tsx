import React from 'react';
import {
  Box,
  Paper,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Avatar,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { CalendarMonth } from '@mui/icons-material';
import type { Task } from '../../types/Project';

const statusColors: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  'Todo': 'default',
  'In Progress': 'warning',
  'Complete': 'success',
  'Not Started': 'info',
};

const COLUMNS = [
  { id: 'Todo', label: 'Todo', color: '#a3c4f3' },
  { id: 'In Progress', label: 'In Progress', color: '#ffadad' },
  { id: 'Complete', label: 'Complete', color: '#a3b18a' },
  { id: 'Not Started', label: 'Not Started', color: '#588157' },
];

interface TaskStatusBoardProps {
  tasks: Task[];
  onUpdate: (id: string, status: string) => Promise<void>;
}

export const TaskStatusBoard: React.FC<TaskStatusBoardProps> = ({ tasks, onUpdate }) => {
  const [localTasks, setLocalTasks] = React.useState<Task[]>(tasks);

  React.useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const movedTask = localTasks.find((t) => t._id === draggableId);
    if (!movedTask) return;

    // Optimistic update
    const updatedTasks = Array.from(localTasks);
    const sourceTasks = updatedTasks.filter((t) => t.status === source.droppableId);
    const targetTask = sourceTasks[source.index];
    const srcIdx = updatedTasks.indexOf(targetTask);
    if (srcIdx !== -1) updatedTasks.splice(srcIdx, 1);

    const updatedMoved = { ...targetTask, status: destination.droppableId as Task['status'] };

    const destTasks = updatedTasks.filter((t) => t.status === destination.droppableId);
    let destIdx = updatedTasks.length;
    if (destination.index < destTasks.length) {
      const next = destTasks[destination.index];
      destIdx = updatedTasks.indexOf(next);
    } else if (destTasks.length > 0) {
      const last = destTasks[destTasks.length - 1];
      destIdx = updatedTasks.indexOf(last) + 1;
    }
    updatedTasks.splice(destIdx, 0, updatedMoved);
    setLocalTasks(updatedTasks);

    try {
      await onUpdate(targetTask._id, destination.droppableId);
    } catch (err) {
      console.error('Failed to update status:', err);
      setLocalTasks(tasks);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2, alignItems: 'start' }}>
        {COLUMNS.map((col) => {
          const colTasks = localTasks.filter((t) => t.status === col.id);
          return (
            <Box key={col.id}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, pl: 1, textTransform: 'uppercase', color: col.color }}>
                {col.label} ({colTasks.length})
              </Typography>
              <Droppable droppableId={col.id}>
                {(provided) => (
                  <Paper {...provided.droppableProps} ref={provided.innerRef} elevation={0} sx={{ p: 1.5, bgcolor: '#f5f5f5', minHeight: '200px', borderRadius: 2, border: `1px solid ${col.color}` }}>
                    <Stack spacing={2}>
                      {colTasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{ boxShadow: '0px 2px 4px rgba(0,0,0,0.05)', borderRadius: 2, borderLeft: `5px solid ${col.color}`, cursor: 'pointer', '&:hover': { boxShadow: '0px 4px 8px rgba(0,0,0,0.1)' } }}
                            >
                              <CardContent sx={{ p: 2 }}>
                                <Typography variant="subtitle1" >{task.title}</Typography>
                                {task.description && (
                                  <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mt: 0.5 }}>
                                    {task.description}
                                  </Typography>
                                )}
                                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                                  {task.priority && <Chip label={task.priority} size="small" variant="outlined" color={task.priority === 'High' ? 'error' : 'default'} />}
                                  {task.assignee && <Chip avatar={<Avatar sx={{ width: 16, height: 16, fontSize: 10 }}>{task.assignee[0]}</Avatar>} label={task.assignee} size="small" />}
                                </Stack>
                                {task.dueDate && (
                                  <Stack direction="row" sx={{ mt: 1, alignItems: 'center', color: 'text.secondary' }}>
                                    <CalendarMonth sx={{ fontSize: 16, mr: 0.5 }} />
                                    <Typography variant="caption">{new Date(task.dueDate).toLocaleDateString()}</Typography>
                                  </Stack>
                                )}
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Stack>
                  </Paper>
                )}
              </Droppable>
            </Box>
          );
        })}
      </Box>
    </DragDropContext>
  );
};