import  { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Chip,
  Stack,
  Grid,
  Paper,
  Divider,
  IconButton,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import PushPinIcon from "@mui/icons-material/PushPin";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";
import { useGetTasksQuery } from "../../services/taskApi";
import type { Task } from "../../types/Project";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
export const NoteLayout = () => {
  const navigate = useNavigate();
  const { data: tasks = [], isLoading } = useGetTasksQuery({});

  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState("All");

  // Task filters
  const taskOptions = [
    "All",
    "Todo",
    "In Progress",
    "Complete",
    "Not Started",
  ];

  // Compute filtered notes based on search and task
  const filteredTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return [];

    return tasks.filter((task: Task) => {
      const taskValue = task.status || "Todo";
      if (selectedTask !== "All" && taskValue !== selectedTask) {
        return false;
      }
      if (searchText) {
        const lower = searchText.toLowerCase();
        const match =
          task.title?.toLowerCase().includes(lower) ||
          task.description?.toLowerCase().includes(lower);
        if (!match) return false;
      }
      return true;
    });
  }, [tasks, searchText, selectedTask]);

  // State for the ordered list (drag‑and‑drop order)
  const [orderedTasks, setOrderedTasks] = useState<Task[]>([]);

  // Sync orderedTasks whenever filteredTasks changes (reset order)
  useEffect(() => {
    setOrderedTasks(filteredTasks);
  }, [filteredTasks]);

  // Drag‑and‑drop handler
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(orderedTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setOrderedTasks(items);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "#720026";
      case "Medium":
        return "#5a206c";
      case "Low":
        return "#357266";
      default:
        return "#9f86c0";
    }
  };

  if (isLoading)
    return (
      <Typography sx={{ p: 4, textAlign: "center" }}>
        Loading Dashboard...
      </Typography>
    );

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ width: "100%" }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ mb: 4, alignItems: "center" }}
        >
          <IconButton
            size="small"
            sx={{
              color: "text.secondary",
              mr: searchOpen ? 1 : 0,
              borderRadius: "4px",
            }}
            onClick={() => setSearchOpen((prev) => !prev)}
          >
            <Search fontSize="small" />
          </IconButton>

          {searchOpen && (
            <TextField
              size="small"
              autoFocus
              placeholder="Search tasks..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{
                width: 160,
                mr: 1,
                "& .MuiOutlinedInput-root": {
                  height: 28,
                  fontSize: "13px",
                  borderRadius: "4px",
                  "& fieldset": { borderColor: "divider" },
                  "&:hover fieldset": { borderColor: "primary.light" },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                    borderWidth: "1px",
                  },
                },
                "& .MuiOutlinedInput-input": { py: 0.5, px: 1 },
              }}
            />
          )}

          {/* Task chips */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              overflowX: "auto",
              width: "100%",
              pb: 1,
              "&::-webkit-scrollbar": { height: "4px" },
            }}
          >
            {taskOptions.map((task) => (
              <Chip
                key={task}
                label={task}
                clickable
                color={selectedTask === task ? "primary" : "default"}
                variant={selectedTask === task ? "filled" : "outlined"}
                onClick={() => setSelectedTask(task)}
                sx={{
                  fontWeight: 500,
                  bgcolor:
                    selectedTask === task ? "primary.main" : "background.paper",
                  color: selectedTask === task ? "primary.contrastText" : "text.primary",
                  borderColor: "divider",
                  "&:hover": {
                    bgcolor:
                      selectedTask === task ? "primary.dark" : "secondary.main",
                    boxShadow: "none",
                  },
                }}
              />
            ))}
          </Box>
        </Stack>

        {/* Notes header */}
        <Box sx={{ mb: 2.5, display: "flex", alignItems: "center", gap: 1 }}>
          <PushPinIcon sx={{ color: "primary.main", fontSize: 18 }} />
          <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 700 ,fontSize:'16px'}}>
            {selectedTask === "All" ? "Recent Tasks" : `${selectedTask} Tasks`} (
            {orderedTasks.length})
          </Typography>
        </Box>

        {orderedTasks.length === 0 ? (
          <Paper
            sx={{
              p: 5,
              textAlign: "center",
              bgcolor: "background.paper",
              borderRadius: 3,
              border: "1px dashed",
              borderColor: "divider",
            }}
          >
            <Typography color="text.secondary">
              No tasks available right now. Create a new task to get started.
            </Typography>
          </Paper>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="notes-grid" direction="vertical">
              {(provided) => (
                <Grid
                  container
                  spacing={3}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {orderedTasks.map((task: Task, index: number) => (
                    <Draggable
                      key={task._id || `task-${index}`}
                      draggableId={task._id || `task-${index}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Grid
                          size={{ xs: 12, sm: 6, lg: 4 }}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            ...(snapshot.isDragging && {
                              opacity: 0.6,
                              transform: "rotate(1deg)",
                            }),
                          }}
                        >
                          <Card
                            sx={{
                              borderRadius: 3,
                              boxShadow: "0px 6px 18px rgba(0,0,0,0.03)",
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              position: "relative",
                              borderLeft: `6px solid ${getPriorityColor(task.priority)}`,
                              transition: "0.3s",
                              cursor: "pointer",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0px 10px 20px rgba(0,0,0,0.08)",
                              },
                            }}
                            onClick={() => navigate(`/note-form`)}
                          >
                            <CardContent>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                  mb: 1.5,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontSize: "16px",
                                    color: 'text.primary',
                                    lineHeight: 1.3,
                                  }}
                                >
                                  {task.title}
                                </Typography>
                                <Chip
                                  label={task.status || "Todo"}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    fontSize: "11px",
                                    fontWeight: "bold",
                                    color: 'text.primary',
                                  }}
                                />
                              </Box>

                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'text.secondary',
                                  mb: 2,
                                  display: "-webkit-box",
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  minHeight: "60px",
                                }}
                              >
                                {task.description || "No description"}
                              </Typography>

                              <Divider sx={{ my: 1.5, opacity: 0.5 }} />

                              <Stack spacing={1}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                                  <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
                                    Status:
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: "text.primary" }}>
                                    {task.status || "Todo"}
                                  </Typography>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                                  <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
                                    Category:
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: "text.primary" }}>
                                    {typeof task.category === "string" ? task.category : task.category?.name || "Uncategorized"}
                                  </Typography>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                                  <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
                                    Assignee:
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: "text.primary" }}>
                                    {typeof task.assignee === "string" ? task.assignee : task.assignee?.username || task.assignee?.email || "Unassigned"}
                                  </Typography>
                                </Box>

                                {task.startDate && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 0.5,
                                      color: 'text.secondary',
                                    }}
                                  >
                                    <AccessTimeIcon sx={{ fontSize: 14 }} />
                                    <Typography variant="caption" sx={{ fontSize: "11px" }}>
                                      {task.startDate.split(" ")[0]}
                                    </Typography>
                                  </Box>
                                )}
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Grid>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </Box>
    </Box>
  );
};
