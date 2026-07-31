
import * as React from 'react';
import { Box, Button, Menu, MenuItem, Typography, Card, CardContent, Stack, Paper } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import type { Note } from "../../types/Note"; 
import { useNavigate } from "react-router-dom";
import { useUpdateNoteMutation } from "../../services/noteApi";

interface AssigneeFilterProps {
  selectedAssignee: string;
  setSelectedAssignee: (assignee: string) => void;
  uniqueAssignees: string[];
  filteredNotes: Note[];
}

export const AssigneeTaskNotes: React.FC<AssigneeFilterProps> = ({
  selectedAssignee,
  setSelectedAssignee,
  uniqueAssignees,
  filteredNotes,
}) => {
  const navigate = useNavigate();
  const [updateNote] = useUpdateNoteMutation();
  const [assigneeAnchor, setAssigneeAnchor] = React.useState<null | HTMLElement>(null);

  //control filters
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAssigneeAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAssigneeAnchor(null);
  };

  const handleSelect = (name: string) => {
    setSelectedAssignee(name);
    handleClose();
  };
//dropdown option
  const columnsToDisplay = React.useMemo(() => {
    //all assignee list
    if (selectedAssignee === "All") {
      return uniqueAssignees.filter(name => name !== "All");
    }
    // 
    return [selectedAssignee];
  }, [selectedAssignee, uniqueAssignees]);

  // after drag and drop => work on backend
  const handleOnDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
   
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    try {
      
      await updateNote({
        id: draggableId,
        body: { assignee: destination.droppableId },
      }).unwrap();
    } catch (err) {
      console.error("Failed to update assignee in backend:", err);
    }
  };

  return (
    <Box sx={{ py: 2 }}>
      {/* Assignee Filter Dropdown */}
      <Stack direction="row" sx={{ mb: 3, alignItems: "center" }}>
        <Button
          endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14 }} />}
          onClick={handleOpen}
          sx={{
            textTransform: 'none',
            color: selectedAssignee !== 'All' ? 'text.secondary' : '#7c7b77',
            fontWeight: selectedAssignee !== 'All' ? 600 : 400,
            fontSize: '14px',
            p: 0,
            '&:hover': { bgcolor: 'transparent' }
          }}
        >
          View Board by Assignee: {selectedAssignee}
        </Button>
        
        <Menu
          anchorEl={assigneeAnchor}
          open={Boolean(assigneeAnchor)}
          onClose={handleClose}
        >
          {uniqueAssignees.map((name) => (
            <MenuItem
              key={name}
              onClick={() => handleSelect(name)}
              sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, fontSize: '14px' }}
            >
              {name}
              {selectedAssignee.toLowerCase() === name.toLowerCase() && (
                <CheckIcon sx={{ fontSize: 14, color: '#973aa8' }} />
              )}
            </MenuItem>
          ))}
        </Menu>
      </Stack>

      {/* Drag And Drop Board Area */}
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: columnsToDisplay.length > 1 ? "1fr 1fr" : "1fr",
              md: `repeat(${Math.min(columnsToDisplay.length, 4)}, 1fr)`,
            },
            gap: 2,
            alignItems: "start",
          }}
        >
          {columnsToDisplay.map((assigneeName) => {
            // filterassignee
            const assigneeTasks = filteredNotes.filter(
              (t) => (t.assignee || "").trim().toLowerCase() === assigneeName.toLowerCase()
            );

            return (
              <Box key={assigneeName} sx={{ display: "flex", flexDirection: "column" }}>
                {/* Column Title */}
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    pl: 1,
                    textTransform: "uppercase",
                    color: "text.secondary",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    fontSize: "14px"
                  }}
                >
                  <AssignmentIndOutlinedIcon sx={{ fontSize: 16 }} />
                  {assigneeName} ({assigneeTasks.length})
                </Typography>

                {/* Droppable Container */}
                <Droppable droppableId={assigneeName}>
                  {(provided) => (
                    <Paper
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      elevation={0}
                      sx={{
                        p: 1.5,
                        bgcolor: "#e9e9ef",
                        minHeight: "400px",
                        borderRadius: 2,
                        border: "1px solid #dfdfdf",
                      }}
                    >
                      <Stack spacing={2}>
                        {assigneeTasks.map((task, index) => {
                          const taskId = task._id || task.id || String(index);

                          return (
                            <Draggable key={taskId} draggableId={taskId} index={index}>
                              {(dragProvided) => (
                                <Card
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                  {...dragProvided.dragHandleProps}
                                  onClick={() => navigate(`/note-form/detail/${taskId}`)}
                                  sx={{
                                    boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
                                    borderRadius: 2,
                                    height: '250px',
                                    borderLeft: `5px solid #973aa8`,
                                    cursor: 'pointer',
                                    "&:hover": {
                                      boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                                    },
                                  }}
                                >
                                  <CardContent sx={{ p: "10px !important", width: "100%" }}>
                                    {/* Note Title */}
                                    <Typography variant="subtitle1" sx={{ fontSize: "16px", color: "#1a202c", fontWeight: 600 }}>
                                      {task.title || "No Title"}
                                    </Typography>

                                    {/* Note Description */}
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{
                                        my: 1,
                                        display: "-webkit-box",
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: "vertical",
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        lineHeight: 1.5,
                                        maxHeight: '6em',
                                      }}
                                    >
                                      {task.description || task.content || "No Description"}
                                    </Typography>

                                    {/* Priority & Category Badges */}
                                    <Stack direction="row" spacing={1} useFlexGap sx={{ mt: 1, flexWrap: "wrap" }}>
                                      {task.priority && (
                                        <Typography variant="caption" sx={{ bgcolor: "#edf2f7", px: 1, py: 0.5, borderRadius: 1 }}>
                                          Priority: {task.priority}
                                        </Typography>
                                      )}
                                      {task.category && (
                                        <Typography variant="caption" sx={{ bgcolor: "#e2e8f0", px: 1, py: 0.5, borderRadius: 1 }}>
                                          Category: {task.category}
                                        </Typography>
                                      )}
                                    </Stack>

                                    {/* Start Date & End Date */}
                                    {(task.startDate || task.endDate) && (
                                      <Stack direction="row" sx={{ mt: 1.5, alignItems: 'center', color: 'blue' }}>
                                        <CalendarMonthIcon sx={{ fontSize: 'medium', color: 'skyblue', mr: 0.5 }} />
                                        <Typography variant='caption' color="textSecondary">
                                          {task.startDate || '-'} To {task.endDate || '-'}
                                        </Typography>
                                      </Stack>
                                    )}
                                  </CardContent>
                                </Card>
                              )}
                            </Draggable>
                          );
                        })}
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
    </Box>
  );
};