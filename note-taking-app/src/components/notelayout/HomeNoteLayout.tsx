import {
  Box,
  Typography,
  Card,
  CardContent,
  Fab,
  Grid,
  CircularProgress,
} from "@mui/material";
import { AutoStories,} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useGetNotesQuery } from "../../services/noteApi";
import { NoteLayout } from "./NoteLayout";

export const HomeNoteLayout = () => {
  const navigate = useNavigate();
  const { data: notes = [], isLoading } = useGetNotesQuery();

  const totalNotes = notes.length;
  const highPriorityCount = notes.filter(
    (n: { priority?: string }) => n.priority === "High"
  ).length;
  const todoCount = notes.filter(
    (n: { task?: string }) => n.task === "Todo" || n.task === "In Progress"
  ).length;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const stats = [
    { label: "Total Notes", value: totalNotes },
    { label: "Urgent (High)", value: highPriorityCount },
    { label: "Tasks Remaining", value: todoCount },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            color: "text.primary",
            display: "flex",
            alignItems: "center",
          }}
        >
          <AutoStories
            sx={{ fontSize: 20, mr: 1, color: "primary.main" }}
          />
          My Workspace
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review your notes and tasks for today.
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
