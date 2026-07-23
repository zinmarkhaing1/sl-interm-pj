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
import { CalendarMonth, AssignmentIndOutlined } from '@mui/icons-material';
import type { Task } from '../../types/Project';

const statusColors: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  'Todo': 'default',
  'In Progress': 'warning',
  'Complete': 'success',
  'Not Started': 'info',
};

interface TaskAssigneeBoardProps {
  tasks: Task[];
  onUpdate: (id: string, assignee: string) => Promise<void>;
}

export const TaskAssigneeBoard: React.FC<TaskAssigneeBoardProps> = ({ tasks, onUpdate }) => {
  const uniqueAssignees = React.useMemo(() => {
    const list = tasks.map((t) => t.assignee).filter(Boolean);
    return Array.from(new Set(list));
  }, [tasks]);

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

    const updatedTasks = Array.from(localTasks);
    const sourceTasks = updatedTasks.filter((t) => t.assignee === source.droppableId);
    const targetTask = sourceTasks[source.index];
    const srcIdx = updatedTasks.indexOf(targetTask);
    if (srcIdx !== -1) updatedTasks.splice(srcIdx, 1);

    const updatedMoved = { ...targetTask, assignee: destination.droppableId };

    const destTasks = updatedTasks.filter((t) => t.assignee === destination.droppableId);
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
      console.error('Failed to update assignee:', err);
      setLocalTasks(tasks);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: `repeat(${Math.min(uniqueAssignees.length, 4)}, 1fr)` }, gap: 2, alignItems: 'start' }}>
        {uniqueAssignees.map((assignee) => {
          const colTasks = localTasks.filter((t) => t.assignee === assignee);
          return (
            <Box key={assignee}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, pl: 1, textTransform: 'uppercase', color: '#973aa8', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AssignmentIndOutlined sx={{ fontSize: 16 }} />
                {assignee} ({colTasks.length})
              </Typography>
              <Droppable droppableId={assignee}>
                {(provided) => (
                  <Paper {...provided.droppableProps} ref={provided.innerRef} elevation={0} sx={{ p: 1.5, bgcolor: '#f5f5f5', minHeight: '200px', borderRadius: 2, border: '1px solid #dfdfdf' }}>
                    <Stack spacing={2}>
                      {colTasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{ boxShadow: '0px 2px 4px rgba(0,0,0,0.05)', borderRadius: 2, borderLeft: '5px solid #973aa8', cursor: 'pointer', '&:hover': { boxShadow: '0px 4px 8px rgba(0,0,0,0.1)' } }}
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
                                  <Chip label={task.status} size="small" color={statusColors[task.status] || 'default'} />
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