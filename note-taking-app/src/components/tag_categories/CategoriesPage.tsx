

import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Link ,
  Stack,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Popover
} from "@mui/material";
import React, { useState } from "react";
import { SwapVertOutlined, Search, CategoryOutlined ,Share,DeleteOutlined,Check} from "@mui/icons-material";
import { useGetNotesQuery, useUpdateNoteMutation } from "../../services/noteApi";
import { useNavigate } from "react-router-dom";
import type { Note } from "../../types/Note";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { ShareCategoryPage } from "../sharepages/ShareCategoryPage";

interface CollaboratorItem {
  _id?: string;
  invitedEmail: string;
  status: string;
  role: string;
  pageUrl?: string;
  source?: string;
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  photo?: string;
}

type CategoryConfig = {
  id: string;
  label: string;
  color: string;
};

const COLUMNS: CategoryConfig[] = [
  { id: "Family & Friends", label: "Family & Friends", color: "#f49cbb" },
  { id: "Fitness & Health", label: "Fitness & Health", color: "#457b9d" },
  { id: "Study", label: "Study", color: "#31572c" },
  { id: "My Note", label: "My Note", color: "#3e5c76" },
  { id: "Company Note", label: "Company Note", color: "#772e25" },
];

export const CategoriesPage = () => {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  // const [user, setUser] = useState<string>("");
  const navigate = useNavigate();
  const { data: notes = [], isLoading, isError } = useGetNotesQuery({ shareScope: "category" });
  const [categoryTasks, setCategoryTasks] = React.useState<Note[]>([]);
  const [updatedNote] = useUpdateNoteMutation();

  //for sharing
  const [user, setUser] = useState<UserProfile | null>(null);
  const [collaborators, setCollaborators] = useState<CollaboratorItem[]>([]);
  const [shareAnchorEl, setShareAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [permissionMenuAnchorEl, setPermissionMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [activeCollaboratorId, setActiveCollaboratorId] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<string>("full");

 


  const stringifiedNotes = JSON.stringify(notes);
  React.useEffect(() => {
    if (notes && Array.isArray(notes)) {
      setCategoryTasks(JSON.parse(stringifiedNotes));
    }
  }, [stringifiedNotes]);

  //for sharing state

  
React.useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
  }

  const loadCollaborators = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch("http://localhost:5000/api/share/collaborators", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCollaborators(data.collaborators || []);
      }
    } catch (err) {
      console.error("Failed to load collaborators", err);
    }
  };

  loadCollaborators();
}, []); // Empty dependency array ensures this runs ONLY ONCE on mount

  

  



  const handleRowClick = (id: any) => {
    navigate(`/note-form/detail/${id}`); 
  };



  // Drag and Drop Logic 
  const handleOnDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId && 
      source.index === destination.index
    ) {
      return;
    }

    const movedNote = categoryTasks.find((c) => (c._id || c.id) === draggableId);
    if (!movedNote) return;

    const updatedTasksList = Array.from(categoryTasks);

  
    const sourceNotesInColumn = updatedTasksList.filter(
      (c) => (c.category || "My Note") === source.droppableId
    );
    const targetNote = sourceNotesInColumn[source.index];
    const globalSourceIndex = updatedTasksList.indexOf(targetNote);
    if (globalSourceIndex !== -1) {
      updatedTasksList.splice(globalSourceIndex, 1);
    }

    // Category  update
    const updatedMovedNote = { ...targetNote, category: destination.droppableId };

   //put a place
    const destNotesInColumn = updatedTasksList.filter(
      (t) => (t.category || "My Note") === destination.droppableId
    );

    let globalDestIndex = updatedTasksList.length;
    if (destination.index < destNotesInColumn.length) {
      const nextNote = destNotesInColumn[destination.index];
      globalDestIndex = updatedTasksList.indexOf(nextNote);
    } else if (destNotesInColumn.length > 0) {
      const lastNote = destNotesInColumn[destNotesInColumn.length - 1];
      globalDestIndex = updatedTasksList.indexOf(lastNote) + 1;
    }

    updatedTasksList.splice(globalDestIndex, 0, updatedMovedNote);
    setCategoryTasks(updatedTasksList);

    // update database
    try {
      const noteId = targetNote._id || targetNote.id;
      if (noteId) {
        await updatedNote({
          id: noteId,
          body: { category: destination.droppableId },
        }).unwrap();
      }
    } catch (err) {
      console.log("Failed to update note category in backend:", err);
      setCategoryTasks(notes); 
    }
  };

  // Search & Sorting UI filter 
  const filteredNotes = React.useMemo<Note[]>(() => {
    if (!Array.isArray(categoryTasks)) return [];

    return categoryTasks
      .filter((note: Note) => {
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
  }, [categoryTasks, searchText, sortOrder]);

  const getNotesByCategory = (categoryName: string) => {
    return filteredNotes.filter((note: any) => (note.category || "My Note") === categoryName);
  };

  //share popover handlers
  const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShareAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setShareAnchorEl(null);
  };

  const handleOpenPermissionMenu = (event: React.MouseEvent<HTMLButtonElement>, id: string | null, currentRole: string) => {
    setPermissionMenuAnchorEl(event.currentTarget);
    setActiveCollaboratorId(id);
    setActiveRole(currentRole || "full");
  };

  const handleClosePermissionMenu = () => {
    setPermissionMenuAnchorEl(null);
    setActiveCollaboratorId(null);
  };

 
  const handlePermissionChange = async (role: string) => {
    if (!activeCollaboratorId) {
      handleClosePermissionMenu();
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/share/${activeCollaboratorId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ role }),
      });
      if (response.ok) {
        setCollaborators((prev) => prev.map((person) => person._id === activeCollaboratorId ? { ...person, role } : person));
      }
    } catch (err) {
      console.error(err);
    } finally {
      handleClosePermissionMenu();
    }
  };

 
  const handleRemoveCollaborator = async () => {
    if (!activeCollaboratorId) return;
    try {
      const response = await fetch(`http://localhost:5000/api/share/${activeCollaboratorId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      if (response.ok) {
        setCollaborators((prev) => prev.filter((person) => person._id !== activeCollaboratorId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      handleClosePermissionMenu();
    }
  };

  const getRoleLabel = (role: string) => {
    if (role === "full") return "Full access";
    if (role === "editor") return "Can edit";
    if (role === "commenter") return "Can comment";
    return "Can view";
  };
  const isShareOpen = Boolean(shareAnchorEl);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 5 }}>
        Unable to load boards.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
        py: 2
      }}
    >
      <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Button
          startIcon={<CategoryOutlined />}
          sx={{
            textTransform: "none",
            color: "text.primary",
            fontSize: "16px",
            borderRadius: 3,
            px: 1.5,
            whiteSpace: 'nowrap',
            "& .MuiButton-startIcon": { color: "#973aa8" },
          }}
        >
          Category Page 
        </Button>
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
              bgcolor: sortOrder === 'desc' ? 'background.default' : 'transparent'
            }
          }}
        >
          <SwapVertOutlined fontSize="small" />
        </IconButton>
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
                bgcolor: 'background.default',
                borderRadius: '4px',
              },
              '& .MuiOutlinedInput-input': {
                py: 0.5,
                px: 1,
              },
            }}
          />
        )}

          <Button
          startIcon={<Share />}
          onClick={handleShareClick}
          sx={{
            color: 'text.primary',
            bgcolor: isShareOpen ? 'action.selected' : 'background.default',
            borderRadius: '4px',
            textTransform: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          Share
        </Button>
      </Stack>

      {/* to connect share category page */}
      <Popover
        open={isShareOpen}
        anchorEl={shareAnchorEl}
        onClose={handleShareClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              width: 420,
              p: 2.5,
              mt: 1,
              borderRadius: 3,
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
              bgcolor: 'background.paper',
              color: 'text.primary'
            }
          }
        }}
      >
        <ShareCategoryPage
          user={user}
          collaborators={collaborators}
          setCollaborators={setCollaborators}
          handleOpenPermissionMenu={handleOpenPermissionMenu}
          getRoleLabel={getRoleLabel}
        />
      </Popover>

      {/* --- Permission Settings Dropdown Menu --- */}
      <Menu
        anchorEl={permissionMenuAnchorEl}
        open={Boolean(permissionMenuAnchorEl)}
        onClose={handleClosePermissionMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { width: 340, borderRadius: 3, p: 0.5, boxShadow: "0px 4px 16px rgba(0,0,0,0.12)" } } }}
      >
        <MenuItem onClick={() => handlePermissionChange("full")} sx={{ py: 1 }}>
          <ListItemText
            primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Full access</Typography>}
            secondary={<Typography variant="caption" color="text.secondary">Edit, suggest, comment, and share</Typography>}
          />
          {activeRole === "full" && <Check sx={{ fontSize: 16, ml: 1 }} />}
        </MenuItem>

        <MenuItem onClick={() => handlePermissionChange("editor")} sx={{ py: 1 }}>
          <ListItemText
            primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can edit</Typography>}
            secondary={<Typography variant="caption" color="text.secondary">Edit, suggest, and comment</Typography>}
          />
          {activeRole === "editor" && <Check sx={{ fontSize: 16, ml: 1 }} />}
        </MenuItem>

        <MenuItem onClick={() => handlePermissionChange("commenter")} sx={{ py: 1 }}>
          <ListItemText
            primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can comment</Typography>}
            secondary={<Typography variant="caption" color="text.secondary">Suggest and comment</Typography>}
          />
          {activeRole === "commenter" && <Check sx={{ fontSize: 16, ml: 1 }} />}
        </MenuItem>

        <MenuItem onClick={() => handlePermissionChange("viewer")} sx={{ py: 1 }}>
          <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can view</Typography>} />
          {activeRole === "viewer" && <Check sx={{ fontSize: 16, ml: 1 }} />}
        </MenuItem>

        {activeCollaboratorId && (
          <>
            <Box sx={{ my: 0.5, borderTop: "1px solid #f0f0f0" }} />
            <MenuItem onClick={handleRemoveCollaborator} sx={{ py: 1, color: "error.main" }}>
              <ListItemIcon sx={{ color: "error.main", minWidth: 30 }}><DeleteOutlined sx={{ fontSize: 18 }} /></ListItemIcon>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>Remove</Typography>
            </MenuItem>
          </>
        )}
      </Menu>


      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {COLUMNS.map((column) => {
            const columnId = column.id;
            const color = column.color;
            const notesInColumn = getNotesByCategory(columnId);

            return (
              <Grid size={{xs:12,sm:16,lg:4}}  key={columnId}>
               
                <Droppable droppableId={columnId}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        borderRadius: 3,
                        boxShadow: 3,
                        height: "100%",
                        minHeight: "200px",
                        borderTop: `5px solid ${color}`,
                        bgcolor: "#f8f9fa",
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{ fontSize: "18px", color: color, fontWeight: "bold", mb: 2 }}
                        >
                          {column.label} ({notesInColumn.length})
                        </Typography>
                        
                        <Stack spacing={1.5}>
                          {notesInColumn.map((note: Note, index: number) => {
                            const noteId = note._id || note.id || String(index);

                            return (
                              // to input draggable
                              <Draggable key={noteId} draggableId={noteId} index={index}>
                                {(dragProvided) => (
                                  <Box
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    {...dragProvided.dragHandleProps}
                                    onClick={() => handleRowClick(note._id || note.id)}
                                    sx={{
                                      p: 1.5,
                                      bgcolor: "#ffffff",
                                      borderRadius: 2,
                                      boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
                                      borderLeft: `4px solid ${color}`,
                                      cursor: 'pointer',
                                      transition: "0.2s",
                                      "&:hover": { 
                                        transform: "translateY(-2px)", 
                                        boxShadow: 2 
                                      },
                                    }}
                                  >
                                    <Typography sx={{ fontSize: "16px", color: "#2F004F", fontWeight: "500" }}>
                                      {note.title || "No Title"}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                      sx={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        mt: 0.5
                                      }}
                                    >
                                      {note.content || note.description || "No Content"}
                                    </Typography>

                                    <Link
                                      component="button"
                                      variant="body2"
                                      underline="always"
                                      sx={{ mt: 1, color: "#973aa8", fontSize: "14px" }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRowClick(note._id || note.id);
                                      }}
                                    >
                                      Open notes
                                    </Link>

<Typography 
  variant="caption" 
  sx={{ 
    mt: 1, 
    color: "text.secondary", 
    fontWeight: "500",
    display: "block" 
  }}
>
  {(() => {
    // ၁။ Backend က အောင်မြင်စွာ Populate လုပ်ပေးပြီး Object ဖြစ်နေလျှင်
    if (note.user && typeof note.user === 'object') {
      const u = note.user as any;
      if (u.firstName) return `Created By: ${u.firstName} ${u.lastName || ''}`;
    }

    if (user) {
      const noteUserIdStr = typeof note.user === 'string' ? note.user : (note.user as any)?._id;
      const currentLoggedInUserId = (user as any)._id || user.email;

     
      if (
        noteUserIdStr === (user as any)._id || 
        noteUserIdStr === user.email ||
        (note as any).userId === user.email ||
        (note as any).authId === user.email
      ) {
        return `Created By: ${user.firstName || 'Zin Mar'} ${user.lastName || 'Khaing'}`;
      }
    }

    const rawUserStr = typeof note.user === 'string' ? note.user : '';
    if (rawUserStr === "6a08d3d23b4852cf0dd47330") {
      return `Created By: Zin Mar Khaing`;
    }

    return `Created By: ${note.assignee}`;
  })()}
</Typography>
                                  </Box>
                                  
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </Stack>
                      </CardContent>
                    </Card>
                  )}
                </Droppable>
              </Grid>
            );
          })}
        </Grid>
      </DragDropContext>
    </Box>
  );
};

