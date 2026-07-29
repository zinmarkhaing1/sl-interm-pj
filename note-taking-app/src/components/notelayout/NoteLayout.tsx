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
import LabelIcon from "@mui/icons-material/Label";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";
import { useGetNotesQuery } from "../../services/noteApi";
import type { Note } from "../../types/Note";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
export const NoteLayout = () => {
  const navigate = useNavigate();
  const { data: notes = [], isLoading } = useGetNotesQuery();

  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Categories
  const categoriesList = [
    "All",
    "Family & Friends",
    "Fitness & Health",
    "Study",
    "My Note",
    "Company Note",
  ];

  // Compute filtered notes based on search and category
  const filteredNotes = useMemo(() => {
    if (!Array.isArray(notes)) return [];

    return notes.filter((note: Note) => {
      // Category filter
      if (selectedCategory !== "All" && note.category !== selectedCategory) {
        return false;
      }
      // Search filter (on title, description, content)
      if (searchText) {
        const lower = searchText.toLowerCase();
        const match =
          note.title?.toLowerCase().includes(lower) ||
          note.description?.toLowerCase().includes(lower) ||
          note.content?.toLowerCase().includes(lower);
        if (!match) return false;
      }
      return true;
    });
  }, [notes, searchText, selectedCategory]);

  // State for the ordered list (drag‑and‑drop order)
  const [orderedNotes, setOrderedNotes] = useState<Note[]>([]);

  // Sync orderedNotes whenever filteredNotes changes (reset order)
  useEffect(() => {
    setOrderedNotes(filteredNotes);
  }, [filteredNotes]);

  // Drag‑and‑drop handler
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(orderedNotes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setOrderedNotes(items);
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

          {/* Category chips */}
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
            {categoriesList.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                clickable
                color={selectedCategory === cat ? "primary" : "default"}
                variant={selectedCategory === cat ? "filled" : "outlined"}
                onClick={() => setSelectedCategory(cat)}
                sx={{
                  fontWeight: 500,
                  bgcolor:
                    selectedCategory === cat ? "primary.main" : "background.paper",
                  color: selectedCategory === cat ? "primary.contrastText" : "text.primary",
                  borderColor: "divider",
                  "&:hover": {
                    bgcolor:
                      selectedCategory === cat ? "primary.dark" : "secondary.main",
                    boxShadow: "none",
                  },
                }}
              />
            ))}
          </Box>
        </Stack>

        {/* Notes header */}
        <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <PushPinIcon sx={{ color: "#7f8c8d", fontSize: 18 }} />
          <Typography variant="h6" sx={{ color: "text.primary" }}>
            {selectedCategory === "All" ? "Recent Notes" : `${selectedCategory} Notes`} (
            {orderedNotes.length})
          </Typography>
        </Box>

        {orderedNotes.length === 0 ? (
          <Paper
            sx={{
              p: 5,
              textAlign: "center",
              bgcolor: "rgba(255,255,255,0.6)",
              borderRadius: 3,
            }}
          >
            <Typography color="textSecondary">
              No notes available. Create a new note to get started!
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
                  {orderedNotes.map((note: any, index: number) => (
                    <Draggable
                      key={note._id || `note-${index}`}
                      draggableId={note._id || `note-${index}`}
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
                              borderLeft: `6px solid ${getPriorityColor(note.priority)}`,
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
                                  {note.title}
                                </Typography>
                                <Chip
                                  label={note.task || "Todo"}
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
                                {note.description || note.content}
                              </Typography>

                              <Divider sx={{ my: 1.5, opacity: 0.5 }} />

                              <Stack
                                direction="row"
                                sx={{
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    color:'text.secondary',
                                  }}
                                >
                                  <LabelIcon
                                    sx={{ fontSize: 16, color: 'text.secondary' }}
                                  />
                                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                    {note.category}
                                  </Typography>
                                </Box>
                                {note.startDate && (
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
                                      {note.startDate.split(" ")[0]}
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
