import React from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Divider,
  Stack,
  Button,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import {
  Assignment,
  Person,
  CalendarMonth,
  Flag,
  Folder,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useGetTaskQuery } from "../services/taskApi";

const statusColor: Record<any, any> = {
  Todo: "default",
  "In Progress": "warning",
  Complete: "success",
  "Not Started": "info",
};

const priorityColor: Record<any, any> = {
  Low: "success",
  Medium: "warning",
  High: "error",
};

export const TaskDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: task,
    isLoading,
    isError,
  } = useGetTaskQuery(id!, {
    skip: !id,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !task) {
    return (
      <Box sx={{ maxWidth: 700, mx: "auto", py: 4 }}>
        <Alert severity="error">Failed to load task.</Alert>
      </Box>
    );
  }

  const project = typeof task.project === "object" ? task.project : null;

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
        }}
      >
        {/* Header */}
        <Typography variant="h5"  gutterBottom sx={{fontSize:'18px',fontFamily:'sans-serif',alignItems:'center',justifyContent:'center'}}>
          Task Details
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Grid Layout */}
        <Grid container spacing={3}>
          {/* Title - Full width */}
          <Grid size={{xs:12}}>
            <Typography variant="subtitle2" sx={{fontSize:'16px',fontFamily:'sans-serif'}}>
              Title
            </Typography>
            <Typography variant="h6" sx={{fontSize:'14px',fontFamily:'sans-serif'}}>
              {task.title}
            </Typography>
          </Grid>

          {/* Description - Full width */}
          <Grid  size={{xs:12}}>
            <Typography variant="subtitle2" sx={{fontSize:'16px',fontFamily:'sans-serif'}}>
              Description
            </Typography>
            <Typography sx={{fontSize:'14px',fontFamily:'sans-serif'}}>
              {task.description || "No description"}
            </Typography>
          </Grid>

          <Grid size={{xs:12}}>
            <Divider />
          </Grid>

          {/* Project - Half width */}
          <Grid size={{xs:12, sm:6}}>
            <Stack direction="row" spacing={1}  sx={{alignItems:'center'}}>
              <Folder color="primary" fontSize="small" />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{fontSize:'12px', fontFamily: 'sans-serif'}}>
                  Project
                </Typography>
                <Typography sx={{fontFamily: 'sans-serif'}}>
                  {project?.name || "N/A"}
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Assignee - Half width */}
          <Grid  size={{xs:12,sm:6}}>
            <Stack direction="row" spacing={1} sx={{alignItems:'center'}}>
              <Person color="primary" fontSize="small" />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{fontSize:'12px',fontFamily: 'sans-serif'}}>
                  Assignee
                </Typography>
                <Typography >
                  {task.assignee || "Unassigned"}
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Status - Half width */}
          <Grid size={{xs:12,sm:6}}>
            <Stack direction="row" spacing={1}  sx={{alignItems:'center'}}>
              <Assignment color="primary" fontSize="small" fontFamily= 'sans-serif'/>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{fontFamily: 'sans-serif'}}>
                  Status
                </Typography>
                <Chip
                  label={task.status}
                  color={statusColor[task.status]}
                  size="small"
                  sx={{ fontSize:'12px',fontFamily: 'sans-serif'}}
                />
              </Box>
            </Stack>
          </Grid>

          {/* Priority - Half width */}
          <Grid  size={{xs:12,sm:6}}>
            <Stack direction="row" spacing={1} sx={{alignItems:'center'}}>
              <Flag color="primary" fontSize="small" />
              <Box>
                <Typography variant="subtitle2" color="text.secondary"  sx={{fontFamily: 'sans-serif'}}>
                  Priority
                </Typography>
                <Chip
                  label={task.priority}
                  color={priorityColor[task.priority]}
                  size="small"
                  sx={{ fontSize:'12px', fontFamily: 'sans-serif'}}
                />
              </Box>
            </Stack>
          </Grid>

          {/* Due Date - Full width */}
          <Grid  size={{xs:12}}>
            <Stack direction="row" spacing={1}  sx={{alignItems:'center'}}>
              <CalendarMonth color="primary" fontSize="small" />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{fontFamily: 'sans-serif'}}>
                  Due Date
                </Typography>
                <Typography sx={{fontFamily: 'sans-serif'}} >
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "—"}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Back Button */}
        <Button
          variant="contained"
          onClick={() => navigate("/my-tasks")}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Back to Tasks
        </Button>
      </Paper>
    </Box>
  );
};