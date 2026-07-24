import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Stack,
  Button,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Grid,
  Collapse,
} from "@mui/material";
import {
  ArrowBack,
  NoteAdd,
  Person,
  CalendarToday,
  Flag,
  Category,
  Description,
  Folder,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

// Import from taskApi
import { useGetTaskQuery } from "../../services/taskApi";

// Import from noteApi
import {
  useGetNotesQuery,
  useCreateNoteMutation,
} from "../../services/noteApi";

// Import types and data
import type { Note } from "../../types/Note";
import { categories, priority } from "../../../../note-taking-app-backend/data/index";

// Priority color mapping
const priorityColor: Record<string, any> = {
  Low: "success",
  Medium: "warning",
  High: "error",
};

export const TaskNotesPage = () => {
  const navigate = useNavigate();
  const { id: taskId } = useParams<{ id: string }>();

  // State for expanded descriptions (per note)
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});

  // Toggle expand function
  const toggleExpand = (noteId: string) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [noteId]: !prev[noteId],
    }));
  };

  // 1. Fetch task details using taskApi
  const {
    data: task,
    isLoading: taskLoading,
    isError: taskError,
  } = useGetTaskQuery(taskId!, {
    skip: !taskId,
  });

  // 2. Fetch notes for this task using noteApi
  const {
    data: notes,
    isLoading: notesLoading,
    isError: notesError,
    refetch,
  } = useGetNotesQuery(
    // { task: taskId, populate: "user" },
    // { skip: !taskId }
  );

  // 3. Create note using noteApi
  const [addNote, { isLoading: isAdding, error: addError }] =
    useCreateNoteMutation();

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [priorityValue, setPriorityValue] = useState("");
  const [assignee, setAssignee] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !taskId) return;
    try {
      await addNote({
        task: taskId,
        title: title.trim(),
        category,
        description: description.trim(),
        priority: priorityValue,
        assignee,
        startDate,
        endDate,
      }).unwrap();
      // Reset form
      setTitle("");
      setCategory("");
      setDescription("");
      setPriorityValue("");
      setAssignee("");
      setStartDate("");
      setEndDate("");
      refetch();
    } catch (err) {
      // handled by hook
    }
  };

  // Loading / error states
  if (taskLoading || notesLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (taskError || notesError || !task) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load task or notes.
      </Alert>
    );
  }

  // Display the project name (if project is populated)
  const projectName =
    typeof task.project === "object" ? task.project.name : "N/A";

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        {/* Header with Task Info */}
        <Stack direction="row" spacing={1} sx={{ mb: 1 ,alignItems:'center'}}>
          <IconButton onClick={() => navigate(`/tasks/${taskId}`)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5">Task Notes</Typography>
        </Stack>

        {/* Task summary (from taskApi) */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 3, p: 2, bgcolor: "action.hover", borderRadius: 2 }}
        >
          <Stack direction="row" spacing={1} sx={{alignItems:'center'}}>
            <Folder color="primary" />
            <Typography variant="body2">
              <strong>Project:</strong> {projectName}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{alignItems:'center'}}>
            <Typography variant="body2">
              <strong>Task:</strong> {task.title}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{alignItems:'center'}}>
            <Chip
              label={task.status}
              size="small"
              color={
                task.status === "Complete"
                  ? "success"
                  : task.status === "In Progress"
                  ? "warning"
                  : "default"
              }
            />
          </Stack>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* Add Note Form (using noteApi) */}
        <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            <NoteAdd sx={{ mr: 1, verticalAlign: "middle" }} />
            Add New Note
          </Typography>
          <Box component="form" onSubmit={handleAddNote}>
            <Grid container spacing={2}>
              <Grid  size={{xs:12}}>
                <TextField
                  label="Title *"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Grid>
              <Grid size={{xs:12,sm:6}}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat._id.toString()} value={cat.name}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{xs:12,sm:6}}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={priorityValue}
                    label="Priority"
                    onChange={(e) => setPriorityValue(e.target.value)}
                  >
                    {priority.map((p) => (
                      <MenuItem key={p._id.toString()} value={p.name}>
                        {p.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{xs:12}}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
              <Grid size={{xs:12}}>
                <TextField
                  label="Assignee (username)"
                  fullWidth
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                />
              </Grid>
              <Grid size={{xs:12,sm:3}}>
                <TextField
                  label="Start Date"
                  type="date"
                  fullWidth
                
                slotProps={{
                    inputLabel:{
                        shrink:true
                    }
                }}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Grid>
              <Grid   size={{xs:12,sm:3}}>
                <TextField
                  label="End Date"
                  type="date"
                  fullWidth
             
                slotProps={{
                    inputLabel:{
                        shrink:true
                    }
                }}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Grid>
              <Grid size={{xs:12}}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<NoteAdd />}
                  disabled={isAdding || !title.trim()}
                >
                  Add Note
                </Button>
              </Grid>
            </Grid>
            {addError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Failed to add note. Please try again.
              </Alert>
            )}
          </Box>
        </Paper>

        {/* Notes List (from noteApi) */}
        {notes && notes.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No notes yet. Add one above.
          </Typography>
        ) : (
          <Stack spacing={3}>
            {notes?.map((note: Note) => {
              const isExpanded = expandedNotes[note._id] || false;
              const hasDescription = note.description && note.description.trim().length > 0;

              // Determine if we need a "More" button: if description is longer than, say, 100 characters or has more than 1 line
              const shouldTruncate = hasDescription && note.description!.length > 100;

              return (
                <Card key={note._id} variant="outlined">
                  <CardContent>
                    <Stack direction="row"  sx={{alignItems:'center',justifyContent:'space-between'}}>
                      <Typography variant="h6" gutterBottom>
                        {note.title || "Untitled"}
                      </Typography>
                      {/* Author avatar + name */}
                      <Stack direction="row" spacing={1}  sx={{alignItems:'center'}}>
                        <Avatar sx={{ width: 28, height: 28 }}>
                          {(note.user || note.authId || "U")[0].toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" color="text.secondary">
                          {note.user || note.authId || "Unknown"}
                        </Typography>
                      </Stack>
                    </Stack>

                    {/* Meta info row */}
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      sx={{ mb: 1,flexWrap:'wrap' }}
                    >
                      {note.category && (
                        <Chip
                          icon={<Category fontSize="small" />}
                          label={note.category}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {note.priority && (
                        <Chip
                          icon={<Flag fontSize="small" />}
                          label={note.priority}
                          size="small"
                          color={priorityColor[note.priority] || "default"}
                        />
                      )}
                      {note.assignee && (
                        <Chip
                          icon={<Person fontSize="small" />}
                          label={note.assignee}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {note.startDate && (
                        <Chip
                          icon={<CalendarToday fontSize="small" />}
                          label={`Start: ${new Date(note.startDate).toLocaleDateString()}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {note.endDate && (
                        <Chip
                          icon={<CalendarToday fontSize="small" />}
                          label={`End: ${new Date(note.endDate).toLocaleDateString()}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Stack>

                    {/* Description with expand/collapse */}
                    {hasDescription && (
                      <Box sx={{ mt: 1 }}>
                        {shouldTruncate ? (
                          <>
                            <Typography variant="body2" color="text.secondary">
                              {isExpanded
                                ? note.description
                                : `${note.description!.slice(0, 100)}...`}
                            </Typography>
                            <Button
                              size="small"
                              onClick={() => toggleExpand(note._id)}
                              endIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
                              sx={{ mt: 0.5, textTransform: "none" }}
                            >
                              {isExpanded ? "Less" : "More"}
                            </Button>
                          </>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {note.description}
                          </Typography>
                        )}
                      </Box>
                    )}

                    {/* Created date */}
                    <Typography variant="caption" color="text.disabled" sx={{ display: "block", mt: 1 }}>
                      Created: {note.createdAt ? new Date(note.createdAt).toLocaleString() : "N/A"}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        )}

        {/* <Divider sx={{ my: 3 }} />
        <Button
          variant="outlined"
          onClick={() => navigate(`/tasks/${taskId}`)}
          startIcon={<ArrowBack />}
        >
          Back to Task
        </Button> */}
      </Paper>
    </Box>
  );
};