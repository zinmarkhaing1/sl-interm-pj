
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Link,
  Stack,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Popover,
  Alert,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  SwapVertOutlined,
  Search,
  CategoryOutlined,
  Share,
  DeleteOutlined,
  Check,
} from "@mui/icons-material";
import { useGetNotesQuery, useUpdateNoteMutation } from "../../services/noteApi";
import { useGetTasksQuery } from "../../services/taskApi";
import { useNavigate } from "react-router-dom";
import type { Note } from "../../types/Note";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { ShareCategoryPage } from "../sharepages/ShareCategoryPage";

// ---------- Types ----------
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
  _id?: string;
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
  // ---------- UI state ----------
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();

  // ---------- Task filter (only) ----------
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  // ---------- RTK Query hooks ----------
  const {
    data: notes = [],
    isLoading,
    isError,
    refetch,
  } = useGetNotesQuery({
    shareScope: "category",
    populate: "user firstName lastName",
    taskId: selectedTaskId || undefined, // filter by task only
  });

  // Get ALL tasks (no project filter)
  const { data: tasks = [] } = useGetTasksQuery({}); // empty = all tasks

  const [updateNote] = useUpdateNoteMutation();

  // ---------- Local state for drag & drop ----------
  const [categoryTasks, setCategoryTasks] = useState<Note[]>([]);
  const isUpdatingRef = useRef(false);
  const previousNotesRef = useRef<Note[]>([]);

  // ---------- User & collaborators for sharing ----------
  const [user, setUser] = useState<UserProfile | null>(null);
  const [collaborators, setCollaborators] = useState<CollaboratorItem[]>([]);
  const [shareAnchorEl, setShareAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [permissionMenuAnchorEl, setPermissionMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [activeCollaboratorId, setActiveCollaboratorId] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<string>("full");
  const [userPermission, setUserPermission] = useState<"owner" | "full" | "viewer">("owner");
  const [isViewOnly, setIsViewOnly] = useState(false);

  // Users map for creator name lookup
  // const [usersMap, setUsersMap] = useState<Record<string, { firstName: string; lastName: string }>>(
  //   {}
  // );

  // ---------- Filtering & sorting ----------
  const filteredAndSortedNotes = useMemo(() => {
    if (!Array.isArray(notes)) return [];

    let result = [...notes];
    const searchLower = searchText.trim().toLowerCase();

    if (searchLower !== "") {
      const statusKeywords = ["todo", "in progress", "complete", "not started"];
      const matchedStatus = statusKeywords.find((keyword) => keyword === searchLower);
      let statusFilter: string | null = null;

      if (matchedStatus) {
        if (matchedStatus === "todo") statusFilter = "Todo";
        else if (matchedStatus === "in progress") statusFilter = "In Progress";
        else if (matchedStatus === "complete") statusFilter = "Complete";
        else if (matchedStatus === "not started") statusFilter = "Not Started";
      }

      result = result.filter((note: Note) => {
        if (statusFilter !== null) {
          const currentStatus = (note.task || note.category || "").trim().toLowerCase();
          return currentStatus === statusFilter.toLowerCase();
        }

        const currentCategory = (note.category || "").trim().toLowerCase();
        const currentAssignee = (note.assignee || "").trim().toLowerCase();
        const currentPriority = (note.priority || "").trim().toLowerCase();
        const titleText = (note.title || "").toLowerCase();
        const contentText = (note.content || note.description || "").toLowerCase();

        return (
          currentCategory.includes(searchLower) ||
          currentAssignee.includes(searchLower) ||
          currentPriority.includes(searchLower) ||
          titleText.includes(searchLower) ||
          contentText.includes(searchLower)
        );
      });
    }

    result.sort((a, b) => {
      const titleA = (a.title || "").toLowerCase();
      const titleB = (b.title || "").toLowerCase();
      return sortOrder === "asc" ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
    });

    return result;
  }, [notes, searchText, sortOrder]);

  // Sync local tasks when filtered data changes
  useEffect(() => {
    const currentData = JSON.stringify(filteredAndSortedNotes);
    const previousData = JSON.stringify(previousNotesRef.current);

    if (currentData !== previousData) {
      previousNotesRef.current = filteredAndSortedNotes;
      setCategoryTasks(filteredAndSortedNotes);
    }
  }, [filteredAndSortedNotes]);

 

  
  const getCreatorName = useCallback((): string => {
  if (user) {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    return fullName || 'You';
  }
  return 'You';
}, [user]);
  // ---------- Helper to get task title from ID or object ----------
  const getTaskTitle = useCallback(
    (note: Note): string => {
      if (!note.task) return "";
      if (typeof note.task === "object" && note.task.title) {
        return note.task.title;
      }
      if (typeof note.task === "string") {
        const found = tasks.find((t: any) => t._id === note.task);
        return found ? found.title : note.task;
      }
      return "";
    },
    [tasks]
  );

  // ---------- Load collaborators and user permission ----------
  const loadCollaboratorsAndPermission = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const collabRes = await fetch("http://localhost:5000/api/share/collaborators?pageType=category", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (collabRes.ok) {
        const data = await collabRes.json();
        setCollaborators(data.collaborators || []);
      }

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (err) {
      console.error("Failed to load collaborators", err);
    }
  }, []);

  useEffect(() => {
    loadCollaboratorsAndPermission();
  }, [loadCollaboratorsAndPermission]);

  useEffect(() => {
    if (notes.length > 0 && user) {
      const userId = (user as any)._id;
      const isOwner = notes.some((note: any) => {
        const noteUserId = typeof note.user === "string" ? note.user : note.user?._id;
        return noteUserId === userId;
      });
      const permission = isOwner ? "owner" : "viewer";
      setUserPermission(permission);
      setIsViewOnly(permission === "viewer");
    }
  }, [notes, user]);

  // ---------- Drag & drop handler ----------
  const handleOnDragEnd = useCallback(
    async (result: DropResult) => {
      const { source, destination, draggableId } = result;

      if (!destination) return;
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }

      if (isUpdatingRef.current) return;
      isUpdatingRef.current = true;

      try {
        const movedNote = categoryTasks.find((c) => (c._id || c.id) === draggableId);
        if (!movedNote) {
          isUpdatingRef.current = false;
          return;
        }

        const updatedTasksList = Array.from(categoryTasks);
        const sourceNotesInColumn = updatedTasksList.filter(
          (c) => (c.category || "My Note") === source.droppableId
        );
        const targetNote = sourceNotesInColumn[source.index];
        const globalSourceIndex = updatedTasksList.indexOf(targetNote);
        if (globalSourceIndex !== -1) {
          updatedTasksList.splice(globalSourceIndex, 1);
        }

        const updatedMovedNote = { ...targetNote, category: destination.droppableId };

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

        const noteId = targetNote._id || targetNote.id;
        if (noteId) {
          await updateNote({
            id: noteId,
            body: { category: destination.droppableId },
          }).unwrap();
          refetch();
        }
      } catch (err) {
        console.error("Failed to update note category:", err);
        setCategoryTasks(filteredAndSortedNotes);
      } finally {
        isUpdatingRef.current = false;
      }
    },
    [categoryTasks, updateNote, refetch, filteredAndSortedNotes]
  );

  // ---------- Helpers for categories ----------
  const getNotesByCategory = (categoryName: string) => {
    return categoryTasks.filter((note: any) => (note.category || "My Note") === categoryName);
  };

  const categoryColumns = useMemo<CategoryConfig[]>(() => {
    const known = new Set(COLUMNS.map((column) => column.id));
    const extraCategories = Array.from(new Set(
      categoryTasks
        .map((note) => (note.category || "My Note").trim())
        .filter((category) => category && !known.has(category)),
    ));

    return [
      ...COLUMNS,
      ...extraCategories.map((category, index) => ({
        id: category,
        label: category,
        color: ["#6a4c93", "#1982c4", "#8ac926", "#ff595e"][index % 4],
      })),
    ];
  }, [categoryTasks]);

  // ---------- Share handlers ----------
  const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShareAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setShareAnchorEl(null);
  };

  const handleOpenPermissionMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string | null,
    currentRole: string
  ) => {
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
      const response = await fetch(
        `http://localhost:5000/api/share/${activeCollaboratorId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify({ role }),
        }
      );
      if (response.ok) {
        setCollaborators((prev) =>
          prev.map((person) =>
            person._id === activeCollaboratorId ? { ...person, role } : person
          )
        );
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
      const response = await fetch(
        `http://localhost:5000/api/share/${activeCollaboratorId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
        }
      );
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

  const handleSearchToggle = () => {
    setSearchOpen((prev) => !prev);
    if (searchOpen) {
      setSearchText("");
    }
  };

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // ---------- Loading / Error states ----------
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Unable to load categories. Please try again.
      </Alert>
    );
  }

  // Render 
  return (
    <Box
      sx={{
        bgcolor: "background.default",
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
        py: 2,
        px: 2,
      }}
    >
      {/* Header Section */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <Button
          startIcon={<CategoryOutlined />}
          sx={{
            textTransform: "none",
            color: "text.primary",
            fontSize: "16px",
            borderRadius: 3,
            px: 1.5,
            whiteSpace: "nowrap",
            "& .MuiButton-startIcon": { color: "#973aa8",fontSize:'16px' },
          }}
        >
          Category Page
        </Button>

        <IconButton
          size="small"
          onClick={handleSortToggle}
          sx={{
            color: sortOrder === "desc" ? "#973aa8" : "text.primary",
            bgcolor: sortOrder === "desc" ? "background.default" : "transparent",
            borderRadius: "4px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "& .MuiSvgIcon-root": {
              transition: "transform 0.3s ease",
              transform: sortOrder === "desc" ? "rotate(180deg)" : "rotate(0deg)",
            },
            "&:hover": {
              bgcolor: sortOrder === "desc" ? "background.default" : "transparent",
            },
          }}
        >
          <SwapVertOutlined fontSize="small" />
        </IconButton>

        <IconButton
          size="small"
          sx={{ color: "text.primary", mr: searchOpen ? 1 : 0, borderRadius: "4px" }}
          onClick={handleSearchToggle}
        >
          <Search fontSize="small" />
        </IconButton>

        {searchOpen && (
          <TextField
            size="small"
            autoFocus
            placeholder="Search by category, status, or priority..."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            sx={{
              width: 180,
              "& .MuiOutlinedInput-root": {
                height: 30,
                fontSize: "0.85rem",
                bgcolor: "background.default",
                borderRadius: "4px",
              },
              "& .MuiOutlinedInput-input": {
                py: 0.5,
                px: 1,
              },
            }}
          />
        )}

        {/* TASK DROPDOWN (only)  */}
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Task</InputLabel>
          <Select
            value={selectedTaskId}
            label="Task"
            onChange={(e) => setSelectedTaskId(e.target.value)}
          >
            <MenuItem value="">All Tasks</MenuItem>
            {tasks.map((tsk: any) => (
              <MenuItem key={tsk._id} value={tsk._id}>
                {tsk.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          startIcon={<Share />}
          onClick={handleShareClick}
          sx={{
            color: "text.primary",
            bgcolor: isShareOpen ? "action.selected" : "background.default",
            borderRadius: "4px",
            textTransform: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          Share
        </Button>
      </Stack>

      {/* Share Popover */}
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
              bgcolor: "background.paper",
              color: "text.primary",
            },
          },
        }}
      >
        <ShareCategoryPage
          user={user}
          collaborators={collaborators}
          setCollaborators={setCollaborators}
          handleOpenPermissionMenu={handleOpenPermissionMenu}
          getRoleLabel={getRoleLabel}
          userPermission={userPermission}
          categoryName="all"
          redirectUrl = "/category"
        />
      </Popover>

      {/* Permission Menu */}
      <Menu
        anchorEl={permissionMenuAnchorEl}
        open={Boolean(permissionMenuAnchorEl)}
        onClose={handleClosePermissionMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              width: 340,
              borderRadius: 3,
              p: 0.5,
              boxShadow: "0px 4px 16px rgba(0,0,0,0.12)",
            },
          },
        }}
      >
        <MenuItem onClick={() => handlePermissionChange("viewer")} sx={{ py: 1 }}>
          <ListItemText
            primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Can view</Typography>}
          />
          {activeRole === "viewer" && <Check sx={{ fontSize: 16, ml: 1 }} />}
        </MenuItem>

        {activeCollaboratorId && (
          <>
            <Box sx={{ my: 0.5, borderTop: "1px solid #f0f0f0" }} />
            <MenuItem onClick={handleRemoveCollaborator} sx={{ py: 1, color: "error.main" }}>
              <ListItemIcon sx={{ color: "error.main", minWidth: 30 }}>
                <DeleteOutlined sx={{ fontSize: 18 }} />
              </ListItemIcon>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>Remove</Typography>
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Drag and Drop Board */}
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {categoryColumns.map((column) => {
            const columnId = column.id;
            const color = column.color;
            const notesInColumn = getNotesByCategory(columnId);

            return (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={columnId}>
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
                        bgcolor: "background.default",
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
                              <Draggable
                                key={noteId}
                                draggableId={noteId}
                                index={index}
                                isDragDisabled={isViewOnly}
                              >
                                {(dragProvided) => (
                                  <Box
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    {...dragProvided.dragHandleProps}
                                    onClick={() => {
                                      navigate(`/note-form/detail/${note._id || note.id}`);
                                    }}
                                    sx={{
                                      p: 1.5,
                                      bgcolor: "background.default",
                                      borderRadius: 2,
                                      boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
                                      borderLeft: `4px solid ${color}`,
                                      cursor: "pointer",
                                      transition: "0.2s",
                                      "&:hover": {
                                        transform: "translateY(-2px)",
                                        boxShadow: 2,
                                      },
                                    }}
                                  >
                                    <Typography
                                      sx={{ fontSize: "16px", color: "text.primary", fontWeight: "500" }}
                                    >
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
                                        mt: 0.5,
                                        color: "text.primary",
                                      }}
                                    >
                                      {note.content || note.description || "No Content"}
                                    </Typography>

                                    {/* ---------- Display Task only ---------- */}
                                    {(note.taskId || note.taskTitle) && (
                                      <Typography
                                        variant="caption"
                                        sx={{ color: "text.secondary", display: "block" }}
                                      >
                                        Task: {note.taskTitle || getTaskTitle(note) || note.taskId}
                                      </Typography>
                                    )}

                                    <Link
                                      component="button"
                                      variant="body2"
                                      underline="always"
                                      sx={{ mt: 1, color: "#973aa8", fontSize: "14px" }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/note-form/detail/${note._id || note.id}`);
                                      }}
                                    >
                                      Open notes
                                    </Link>

                                    <Typography
                                      variant="caption"
                                      sx={{
                                        mt: 1,
                                        color: "text.primary",
                                        fontWeight: "500",
                                        display: "block",
                                      }}
                                    >
                                      Created By: {getCreatorName()}
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
