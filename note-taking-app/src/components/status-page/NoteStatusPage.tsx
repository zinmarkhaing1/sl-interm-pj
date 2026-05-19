
import * as React from "react";
import {Box,Card,CircularProgress,CardContent,Typography,Paper,Stack,IconButton,} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { useGetNotesQuery ,useUpdateNoteMutation} from "../../services/noteApi"; 
import type { Note } from "../../types/Note";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";


const COLUMNS = ["Todo", "In Progress", "Complete", "Done"];

export const NoteStatusPage: React.FC = () => {

  const { data: notes = [], isLoading, isError } = useGetNotesQuery();
   const [updatedNote] = useUpdateNoteMutation();
  const [tasks, setTasks] = React.useState<Note[]>([]);

  React.useEffect(() => {
    if (notes) {
      setTasks(notes);
    }
  }, [notes]);

 const getCardBorderColor = (columnId: string) => {
    switch (columnId) {
      case "Todo":
        return "#e7dfc3"; // Yellow
      case "In Progress":
        return "#91b8d2"; // Blue
      case "Complete":
        return "#4c795f"; // Green
      case "Done":
        return "#92d2ad"; // Green
      default:
        return "#e2e8f0";
    }
  };

  const handleOnDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const movedTask = tasks.find((t) => (t._id || t.id) === draggableId);
    if (!movedTask) return;

    const updatedTasks = Array.from(tasks);

    const sourceTasksInColumn = updatedTasks.filter(
      (t) => (t.task || "Todo") === source.droppableId,
    );
    const targetTask = sourceTasksInColumn[source.index];
    const globalSourceIndex = updatedTasks.indexOf(targetTask);
    if (globalSourceIndex !== -1) {
      updatedTasks.splice(globalSourceIndex, 1);
    }

    const updatedMovedTask = { ...targetTask, task: destination.droppableId };

    const destTasksInColumn = updatedTasks.filter(
      (t) => (t.task || "Todo") === destination.droppableId,
    );

    let globalDestIndex = updatedTasks.length;
    if (destination.index < destTasksInColumn.length) {
      const nextTask = destTasksInColumn[destination.index];
      globalDestIndex = updatedTasks.indexOf(nextTask);
    } else if (destTasksInColumn.length > 0) {
      const lastTask = destTasksInColumn[destTasksInColumn.length - 1];
      globalDestIndex = updatedTasks.indexOf(lastTask) + 1;
    }

    updatedTasks.splice(globalDestIndex, 0, updatedMovedTask);

    setTasks(updatedTasks);
    //something need

    try {
      const taskId = targetTask._id || targetTask.id;
      if (taskId) {
        await updatedNote({
          id: taskId,
          body: { task: destination.droppableId },
        }).unwrap();
      }
    } catch (err) {
      console.log("Failed to update task status in backend:", err);
      setTasks(notes);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5}}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading notes...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 5 }}>
        Failed to load notes .
      </Typography>
    );
  }

  return (
    <Box >
      <Typography
        variant="h5"
        sx={{mb:1, fontWeight: "bold", textAlign: "center" }}
      >
        My Notes
      </Typography>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr 1fr",
            },
            gap: 2,
            alignItems: "start",
          }}
        >
          {COLUMNS.map((columnId) => {
            const columnTasks = tasks.filter(
              (t) => (t.task || "Todo") === columnId,
            );

            return (
              <Box
                key={columnId}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    pl: 1,
                    textTransform: "uppercase",
                    color: "#4a5568",
                  }}
                >
                  {columnId === "InProgress" ? "In Progress" : columnId} (
                  {columnTasks.length})
                </Typography>

                <Droppable droppableId={columnId}>
                  {(provided) => (
                    <Paper
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      elevation={0}
                      sx={{
                       P:1.5,
                        bgcolor: "#e9e9ef",
                        minHeight: "100%",
                        borderRadius: 2,
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Stack spacing={2}>
                        {columnTasks.map((task, index) => {
                          const taskId = task._id || task.id || String(index);

                          return (
                            <Draggable
                              key={taskId}
                              draggableId={taskId}
                              index={index}
                            >
                              {(provided) => (
                                <Card
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  sx={{
                                    boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
                                    borderRadius: 2,
                                    height:'250px',
                                    borderLeft: `5px solid ${getCardBorderColor(columnId)}`,
                                    "&:hover": {
                                      boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                                    },
                                  }}
                                >
                                  <CardContent
                                    sx={{ p: "10px !important", width: "100%" }}
                                  >
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: "bold",
                                        color: "#1a202c",
                                      }}
                                    >
                                      {task.title || "No Title"}
                                    </Typography>

                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                      sx={{ my: 1,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:'hidden',textOverflow:'ellipsis',lineHeight:1.5,maxHeight:'6em' ,}}
                                    >
                                      {task.description ||
                                        task.content ||
                                        "No Description"}
                                    </Typography>

                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      useFlexGap
                                      sx={{ mt: 1, flexWrap: "wrap" }}
                                    >
                                      {task.priority && (
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            bgcolor: "#edf2f7",
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: 1,
                                          }}
                                        >
                                          Priority: {task.priority}
                                        </Typography>
                                      )}
                                      {task.category && (
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            bgcolor: "#e2e8f0",
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: 1,
                                          }}
                                        >
                                          Category: {task.category}
                                        </Typography>
                                      )}
                                    </Stack>

                                    {(task.startDate || task.endDate) && (
                                      <Stack direction="row" sx={{ mt: 1.5,alignItems:'center',color:'blue' }}>
                                        <IconButton size="small" sx={{ color: 'blue', p: 0, mr: 0.5 }} disabled>
                                            <CalendarMonthIcon sx={{fontSize:'medium',color:'skyblue'}} />
                                            </IconButton>
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
