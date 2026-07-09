
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Box,Card,CircularProgress,CardContent,Typography,Paper,Stack,IconButton,TextField, Button} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { useGetNotesQuery ,useUpdateNoteMutation} from "../../services/noteApi"; 
import type { Note } from "../../types/Note";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Search,SwapVertOutlined, LineWeightOutlined  } from "@mui/icons-material";



type ColumnConfig = {
  id: string;
  label: string;
  color: string;
};

const COLUMNS: ColumnConfig[] = [
  { id: "Todo", label: "Todo", color: "#a3c4f3" },
  { id: "In Progress", label: "In Progress", color: "#ffadad" },
  { id: "Complete", label: "Complete", color: "#a3b18a" },
  { id: "Not Started", label: "Not Started", color: "#588157" },
];

export const NoteStatusPage: React.FC = () => {

   const [searchOpen, setSearchOpen] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>("");
    const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  

  const { data: notes = [], isLoading, isError } = useGetNotesQuery();
   const [updatedNote] = useUpdateNoteMutation();
  const [tasks, setTasks] = React.useState<Note[]>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (notes) {
      setTasks(notes);
    }
  }, [notes]);


  const filteredNotes = React.useMemo<Note[]>(() => {
        if (!Array.isArray(notes)) return [];
    
        return notes.filter((note: Note) => {
          if (searchText.trim() !== "") {
            const titleText = (note.title || "").toLowerCase();
            const searchTarget = searchText.toLowerCase();
            if (!titleText.includes(searchTarget)) return false;
          }
  
          return true;
        })
         .sort((a, b) => {
          const titleA = (a.title || "").toLowerCase();
          const titleB = (b.title || "").toLowerCase();
    
          return sortOrder === "asc"
            ? titleA.localeCompare(titleB)
            : titleB.localeCompare(titleA);
        });
    
      }, [ notes,  searchText,sortOrder]);
  
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

   const handleRowClick = (id: any) => {
    navigate(`/note-form/detail/${id}`); 
  }

  return (
    <Box sx={{py:2}} >
      {/* <Typography
        variant="h5"
        sx={{mb:1, fontWeight: "bold", textAlign: "center" }}
      >
        My Notes
      </Typography> */}
      <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
       <Button
              
                startIcon={<LineWeightOutlined/>}
                sx={{
                  textTransform: "none",
                  color: "text.primary",
                  fontSize: "18px",
                  fontWeight: "500",
                  borderRadius: 3,
                  px: 1.5,
                  whiteSpace: 'nowrap',
                  "& .MuiButton-startIcon": { color: "#973aa8" },
                  // "&:hover": { bgcolor: "#f5f5f5" },
                }}
              >
                Status Page 
              </Button>
        <IconButton size="small" onClick={() =>
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
                 sx={{ color: sortOrder === 'desc' ? '#973aa8' : 'text.primary', 
                                bgcolor: sortOrder === 'desc' ? 'background.default' : 'transparent',
                                borderRadius: '4px',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                                '& .MuiSvgIcon-root': {
                                  transition: 'transform 0.3s ease',
                                  transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)', 
                                },
                                '&:hover': {
                                  bgcolor: sortOrder === 'desc' ? 'background.default' : 'transparent'
                                }}}><SwapVertOutlined fontSize="small" /></IconButton>
       <IconButton size="small" sx={{ color: 'text.primary', mr: searchOpen ? 1 : 0, borderRadius: '4px'}} onClick={() => setSearchOpen((prev) => !prev)}>
                  <Search fontSize="small" />
                </IconButton>
                {searchOpen && (
                  <TextField
                    size="small"
                    autoFocus
                    placeholder="Search text"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    sx={{
                      width: 180,
                      '& .MuiOutlinedInput-root': {
                        height: 30,
                        fontSize: '0.85rem',
                       bgcolor:'background.default',
                        borderRadius: '4px',
                      },
                      '& .MuiOutlinedInput-input': {
                        py: 0.5,
                        px: 1,
                      },
                    }}
                  />
                )}

                </Stack>

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
          {COLUMNS.map((column) => {
            const columnId = column.id;
            const columnTasks = filteredNotes.filter(
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
                    color: column.color,
                  }}
                >
                  {column.label} ({columnTasks.length})
                </Typography>

                <Droppable droppableId={columnId}>
                  {(provided) => (
                    <Paper
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      elevation={0}
                      sx={{
                        p: 1.5,
                        bgcolor: "#e9e9ef",
                        minHeight: "100%",
                        borderRadius: 2,
                        border: `1px solid ${column.color}`,
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
                                    borderLeft: `5px solid ${column.color}`,
                                    "&:hover": {
                                      boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                                    },
                                  }}
                                >
                                  <CardContent
                                    sx={{ p: "10px !important", width: "100%" }}
                                    onClick={() => handleRowClick(task._id)} 
                                  >
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        // fontWeight: "bold",
                                        fontSize:"16px",
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
