import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import { AutoStories } from "@mui/icons-material";
import { useGetTasksQuery } from "../../services/taskApi";
import { NoteLayout } from "./NoteLayout";

export const HomeNoteLayout = () => {
  const { data: tasks = [], isLoading } = useGetTasksQuery({});

  const totalTasks = tasks.length;
  const highPriorityCount = tasks.filter(
    (task: { priority?: string }) => task.priority === "High"
  ).length;
  const todoCount = tasks.filter(
    (task: { status?: string }) => task.status === "Todo" || task.status === "In Progress"
  ).length;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const stats = [
    { label: "Total Tasks", value: totalTasks },
    { label: "Urgent (High)", value: highPriorityCount },
    { label: "Tasks Remaining", value: todoCount },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            color: "text.primary",
            display: "flex",
            alignItems: "center",
            fontWeight: 700,
            mb: 0.75,
          }}
        >
          <AutoStories
            sx={{ fontSize: 22, mr: 1, color: "primary.main" }}
          />
          My Workspace
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review your priorities, progress, and task activity in one place.
        </Typography>
      </Box>

      <Box sx={{ mb: 3, width: "100%" }}>
        <Grid container spacing={2}>
          {stats.map((stat) => (
            <Grid key={stat.label} size={{ xs: 12, sm: 4 }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  height: "100%",
                }}
              >
                <CardContent>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "text.secondary" }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: "bold",
                      mt: 1,
                      color: "primary.main",
                    }}
                  >
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <NoteLayout />

      {/* <Fab
        color="primary"
        aria-label="add-note"
        onClick={() => navigate("/note-form/create")}
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          boxShadow: "0px 6px 20px rgba(151, 58, 168, 0.35)",
        }}
      >
        <Add />
      </Fab> */}
    </Box>
  );
};
