import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Typography,
} from "@mui/material";
import type { Task } from '../../types/Project';
import { useNavigate } from 'react-router-dom';

const statusColors: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  'Todo': 'default',
  'In Progress': 'warning',
  'Complete': 'success',
  'Not Started': 'info',
};

interface TaskListViewProps {
  tasks: Task[];
}



export const TaskListView: React.FC<TaskListViewProps> = ({ tasks }) => {

    const navigate = useNavigate();
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      <Table>
        <TableHead sx={{ bgcolor: '#fafafa' }}>

          <TableRow >
            <TableCell sx={{ fontWeight: 600 }}>Task Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Project</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Assignee</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                No tasks found.
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => {
              const project = typeof task.project === 'object' ? task.project : null;
              return (
                <TableRow key={task._id} hover sx={{
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.04)"
    }
  }} onClick={(e) => {  e.stopPropagation();
                    console.log("Task ID:", task._id);
                navigate(`/my-tasks/task-detail/${task._id}`)}}>
                  <TableCell>
                    <Typography>{task.title}</Typography>
                    {task.description && (
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        {task.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip label={project?.name || 'N/A'} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      avatar={<Avatar sx={{ width: 20, height: 20, fontSize: 10 }}>{typeof task.assignee === 'string' ? task.assignee.charAt(0).toUpperCase() : task.assignee?.username?.charAt(0).toUpperCase() || '?'}</Avatar>}
                      label={typeof task.assignee === 'string' ? task.assignee : task.assignee?.username || task.assignee?.email || 'Unassigned'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.status}
                      color={statusColors[task.status] || 'default'}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.priority}
                      size="small"
                      variant={task.priority === 'High' ? 'filled' : 'outlined'}
                      color={task.priority === 'High' ? 'error' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};