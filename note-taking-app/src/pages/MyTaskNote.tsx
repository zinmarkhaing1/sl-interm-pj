
import * as React from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
  TextField,
  Menu,
  MenuItem,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  SwapVertOutlined,
  KeyboardArrowDown,
  TaskAlt,
  Check,
  DeleteOutlined,
  EditOutlined,
} from '@mui/icons-material';
import { useDeleteTaskMutation, useGetTasksQuery } from '../services/taskApi';
import { useGetProjectsQuery } from '../services/projectApi';
import type { Task } from '../types/Project';

// Helper for status colors
const statusColors: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  'Todo': 'default',
  'In Progress': 'warning',
  'Complete': 'success',
  'Not Started': 'info',
};

export const MyTaskNote = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const projectIdParam = new URLSearchParams(location.search).get('project') || undefined;

  
  const { data: projects } = useGetProjectsQuery();

  const projectName = React.useMemo(() => {
    if (!projects || !projectIdParam) return null;
    const project = projects.find((p) => p._id === projectIdParam);
    return project?.name || 'Unknown Project';
  }, [projects, projectIdParam]);

  const getAssigneeDisplay = (assignee: Task['assignee']) => {
  if (!assignee) return 'Unassigned';
  if (typeof assignee === 'object' && 'username' in assignee) {
    return assignee.username;
  }
  return assignee; // fallback to string ID
};

// const getAssigneeInitial = (assignee: Task['assignee']) => {
//   if (!assignee) return '?';
//   if (typeof assignee === 'object' && 'username' in assignee) {
//     return assignee.username.charAt(0).toUpperCase();
//   }
//   return assignee.charAt(0).toUpperCase();
// };

const getAssigneeInitial = (assignee: Task['assignee']) => {
  const display = getAssigneeDisplay(assignee);
  return display !== 'Unassigned' ? display.charAt(0).toUpperCase() : '?';
};

  // Filter states
  const [selectedStatus, setSelectedStatus] = React.useState<string>("All");
  const [selectedAssignee, setSelectedAssignee] = React.useState<string>("All");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  const [searchText, setSearchText] = React.useState<string>("");
  const [searchOpen, setSearchOpen] = React.useState<boolean>(false);

  // Dropdown anchors
  const [statusAnchor, setStatusAnchor] = React.useState<null | HTMLElement>(null);
  const [assigneeAnchor, setAssigneeAnchor] = React.useState<null | HTMLElement>(null);

  // Fetch tasks
  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useGetTasksQuery({ projectId: projectIdParam });
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const handleDelete = async (task: Task) => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    try {
      await deleteTask(task._id).unwrap();
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  // Compute unique statuses and assignees from tasks (for dropdowns)
  const uniqueStatuses = React.useMemo(() => {
    const statuses = tasks.map((t: Task) => t.status);
    return ['All', ...Array.from(new Set(statuses))];
  }, [tasks]);

  // const uniqueAssignees = React.useMemo(() => {
  //   const assignees = tasks.map((t: Task) => t.assignee).filter(Boolean);
  //   return ['All', ...Array.from(new Set(assignees))];
  // }, [tasks]);

  const uniqueAssignees = React.useMemo(() => {
  const assignees = tasks.map((t: Task) => {
    if (!t.assignee) return null;
    if (typeof t.assignee === 'object' && 'username' in t.assignee) {
      return t.assignee.username;
    }
    return t.assignee; // string ID
  }).filter((name): name is string => Boolean(name));
  return ['All', ...Array.from(new Set(assignees))];
}, [tasks]);

  // Filter and sort tasks
  const filteredTasks = React.useMemo(() => {
    let result = tasks;

    // ၁။ Search
    if (searchText.trim()) {
      const lower = searchText.toLowerCase();
      result = result.filter((t: Task) =>
        t.title.toLowerCase().includes(lower) ||
        (typeof t.project === 'object' && t.project.name.toLowerCase().includes(lower)) ||
        getAssigneeDisplay(t.assignee).toLowerCase().includes(lower)
      );
    }

 
    if (selectedStatus !== 'All') {
      result = result.filter((t: Task) => t.status === selectedStatus);
    }


    if (selectedAssignee !== 'All') {
  result = result.filter((t: Task) => {
    const display = getAssigneeDisplay(t.assignee);
        return display === selectedAssignee;
  //   const assigneeVal = t.assignee;
  //   if (!assigneeVal) return false;
  //   if (typeof assigneeVal === 'object' && 'username' in assigneeVal) {
  //     return assigneeVal.username === selectedAssignee;
  //   }
  //   return assigneeVal === selectedAssignee;
  });
}

    // ၄။ Sort by title (copy before sort)
    return [...result].sort((a, b) =>
      sortOrder === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );
  }, [tasks, searchText, selectedStatus, selectedAssignee, sortOrder]);

  const clearFilters = () => {
    setSearchText('');
    setSelectedStatus('All');
    setSelectedAssignee('All');
  };

  const isFiltered =
    selectedStatus !== 'All' ||
    selectedAssignee !== 'All' ||
    searchText !== '';

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 5 }}>
        Unable to load tasks. Please try again later.
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "background.default" }}>
      <Box sx={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 54px' }}>

        {/* Title */}
        <Typography variant="h6" sx={{ fontSize: "16px", color: 'text.primary', mb: 3 }}>
          My Tasks
        </Typography>

        {/* Toolbar */}
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", borderBottom: '1px solid #ededed', pb: 1, mb: 2 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Button
              startIcon={<TaskAlt sx={{ fontSize: '16px' }} />}
              sx={{
                textTransform: 'none',
                color: '#37352f',
                fontSize: '14px',
                bgcolor: '#f1f1ef',
                borderRadius: '6px',
                px: 1.5,
                py: 0.5,
                '&:hover': { bgcolor: '#e3e2e0' }
              }}
            >
              Tasks
            </Button>
            {projectIdParam && (
              <Chip
                label={`Filtered by: ${projectName || 'Loading...'}`}
                size="small"
                onDelete={() => navigate('/my-tasks')}
                sx={{ fontWeight: 500 }}
              />
            )}
          </Stack>

          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            {/* Sort */}
            <IconButton
              size="small"
              onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
              sx={{
                color: sortOrder === 'desc' ? '#973aa8' : 'text.primary',
                bgcolor: sortOrder === 'desc' ? 'background.default' : 'transparent',
                borderRadius: '4px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '& .MuiSvgIcon-root': {
                  transition: 'transform 0.3s ease',
                  transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)',
                },
                '&:hover': {
                  bgcolor: sortOrder === 'desc' ? '#e3f2fd' : '#f1f1ef'
                }
              }}
            >
              <SwapVertOutlined fontSize="small" />
            </IconButton>

            {/* Search toggle */}
            <IconButton
              size="small"
              sx={{ color: 'text.primary', mr: searchOpen ? 1 : 0, borderRadius: '4px' }}
              onClick={() => setSearchOpen((prev) => !prev)}
            >
              <Search fontSize="small" />
            </IconButton>

            {searchOpen && (
              <TextField
                size="small"
                autoFocus
                placeholder="Search tasks, projects, assignees..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                sx={{
                  width: 220,
                  mr: 1,
                  '& .MuiOutlinedInput-root': {
                    height: 28,
                    fontSize: '13px',
                    borderRadius: '4px',
                    '& fieldset': { borderColor: '#ededed' },
                    '&:hover fieldset': { borderColor: '#dfdfdf' },
                    '&.Mui-focused fieldset': { borderColor: '#973aa8', borderWidth: '1px' },
                  },
                  '& .MuiOutlinedInput-input': { py: 0.5, px: 1 }
                }}
              />
            )}

            {/* New Task button */}
            <Button
              variant="contained"
              disableElevation
              onClick={() => navigate("/my-tasks/task-create-note")}
              sx={{
                backgroundColor: '#973aa8',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '13px',
                padding: '4px 12px',
                borderRadius: '4px',
                '&:hover': { backgroundColor: '#7e3a8a' },
                transition: '0.15s',
                color:'#ffffff'
              }}
            >
              New task
            </Button>
          </Stack>
        </Stack>

        {/* 🔥 Filter Row: List (static) | Status: All (dropdown) | Assignee: All (dropdown) */}
        <Stack direction="row" spacing={2} sx={{ mb: 4, alignItems: "center", flexWrap: 'wrap' }}>
          {/* Static List Label */}
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              fontSize: '14px',
              color: 'text.primary',
              mr: 1,
            }}
          >
            List
          </Typography>

          {/* Status Dropdown */}
          <Button
            endIcon={<KeyboardArrowDown sx={{ fontSize: 14 }} />}
            onClick={(e) => setStatusAnchor(e.currentTarget)}
            sx={{
              textTransform: 'none',
              color: selectedStatus !== 'All' ? '#973aa8' : 'text.primary',
              fontWeight: selectedStatus !== 'All' ? 600 : 400,
              fontSize: '14px',
              p: 0,
              '&:hover': { bgcolor: 'transparent' }
            }}
          >
            Status: {selectedStatus}
          </Button>
          <Menu anchorEl={statusAnchor} open={Boolean(statusAnchor)} onClose={() => setStatusAnchor(null)}>
            {uniqueStatuses.map((status) => (
              <MenuItem key={status} onClick={() => { setSelectedStatus(status); setStatusAnchor(null); }}>
                {status} {selectedStatus === status && <Check sx={{ fontSize: 14, color: '#973aa8', ml: 1 }} />}
              </MenuItem>
            ))}
          </Menu>

          {/* Assignee Dropdown */}
          <Button
            endIcon={<KeyboardArrowDown sx={{ fontSize: 14 }} />}
            onClick={(e) => setAssigneeAnchor(e.currentTarget)}
            sx={{
              textTransform: 'none',
              color: selectedAssignee !== 'All' ? '#973aa8' : 'text.primary',
              fontWeight: selectedAssignee !== 'All' ? 600 : 400,
              fontSize: '14px',
              p: 0,
              '&:hover': { bgcolor: 'transparent' }
            }}
          >
            Assignee: {selectedAssignee}
          </Button>
          <Menu anchorEl={assigneeAnchor} open={Boolean(assigneeAnchor)} onClose={() => setAssigneeAnchor(null)}>
            {uniqueAssignees.map((name) => (
              <MenuItem key={name} onClick={() => { setSelectedAssignee(name); setAssigneeAnchor(null); }}>
                {name} {selectedAssignee === name && <Check sx={{ fontSize: 14, color: '#973aa8', ml: 1 }} />}
              </MenuItem>
            ))}
          </Menu>

          {isFiltered && (
            <Typography
              onClick={clearFilters}
              sx={{ fontSize: '13px', color: 'text.primary', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              Clear filters
            </Typography>
          )}
        </Stack>

        {/* ===== TABLE VIEW (List) ===== */}
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#fafafa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Task Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Project</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Assignee</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                    No tasks found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task: Task) => {
                  const project = typeof task.project === 'object' ? task.project : null;
                  return (
                    <TableRow key={task._id} hover onClick={() =>   navigate(`/my-tasks/task-detail/${task._id}`)}>
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
                          avatar={<Avatar sx={{ width: 20, height: 20, fontSize: 10 }}>{getAssigneeInitial(task.assignee)}</Avatar>}
                    label={ getAssigneeDisplay(task.assignee)}
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
                      <TableCell onClick={(event) => event.stopPropagation()}>
                        <Stack direction="row" spacing={0.5}>
                          <IconButton size="small" aria-label={`Edit ${task.title}`} onClick={() => navigate(`/my-tasks/edit/${task._id}`)} disabled={isDeleting}>
                            <EditOutlined fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" aria-label={`Delete ${task.title}`} onClick={() => handleDelete(task)} disabled={isDeleting}>
                            <DeleteOutlined fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
