

import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import {
  Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Typography, Button, Stack, useTheme, useMediaQuery,
  Dialog, DialogTitle, DialogContent, DialogActions, Popover, Menu, MenuItem, ListItemText, ListItemIcon
} from "@mui/material";
import { Search } from '@mui/icons-material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
// import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetNotesQuery, useDeleteNoteMutation, useGetNoteByIdQuery } from "../services/noteApi";
import { useGetTasksQuery } from '../services/taskApi';
import type { Note } from '../types/Note';
import { Share, Check, DeleteOutlined } from '@mui/icons-material';
import { ShareNoteDetailPage } from '../components/sharepages/ShareNoteDetailPage';

// Share props types
interface CollaboratorItem {
  _id?: string;
  invitedEmail: string;
  status: string;
  role: string;
  pageUrl?: string;
  source?: string;
  noteId?: string;
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  photo?: string;
  _id?: string;
}

// PDF Export Libraries
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

export const NoteFrom = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));



  // States
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [deleteAnchorEl, setDeleteAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedDeleteId, setSelectedDeleteId] = useState<any>(null);
  const openDeletePopover = Boolean(deleteAnchorEl);

  // Dialog (Pop-up) Control States
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [exportStartDate, setExportStartDate] = useState<string>("");
  const [exportEndDate, setExportEndDate] = useState<string>("");

  // Share states - now with note tracking
  const [user, setUser] = useState<UserProfile | null>(null);
  const [collaborators, setCollaborators] = useState<CollaboratorItem[]>([]);
  const [shareAnchorEl, setShareAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedNoteTitle, setSelectedNoteTitle] = useState<string>("");
  const [permissionMenuAnchorEl, setPermissionMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [activeCollaboratorId, setActiveCollaboratorId] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<string>("full");
  const [showOnlySharedNote, setShowOnlySharedNote] = useState<boolean>(false);

  // ============ FIX: Remove 'undefined' parameter ============
  // Get all notes - no parameter needed
  const { data: allNotes = [], isLoading: isAllLoading, isError, refetch } = useGetNotesQuery(); 

 const { data: allTasks = [] } = useGetTasksQuery({});

  

  // Get specific note
  const { 
    data: specificNote, 
    isLoading: isSpecificLoading,
    refetch: refetchSpecific 
  } = useGetNoteByIdQuery(selectedNoteId || "", { 
    skip: !selectedNoteId || !showOnlySharedNote 
  });

  const notes = useMemo(() => {
    if (showOnlySharedNote && specificNote) {
      return [specificNote];
    }
    return allNotes;
  }, [showOnlySharedNote, specificNote, allNotes]);

  const isLoading = showOnlySharedNote ? isSpecificLoading : isAllLoading;

  const location = useLocation();

  const [deleteNote] = useDeleteNoteMutation();

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  // Check if we're viewing a shared note
   useEffect(() => {
    const path = location.pathname;
    const isDetailPage = path.includes('/note-form/detail/');
    
    if (isDetailPage) {
      const noteId = path.split('/').pop();
      if (noteId && noteId !== selectedNoteId) {
        setSelectedNoteId(noteId);
        setShowOnlySharedNote(true);
      }
    } else if (showOnlySharedNote) {
      // Reset only if currently in shared mode
      setShowOnlySharedNote(false);
      setSelectedNoteId(null);
    }
  },[location.pathname]);

  useEffect(() => {
  console.log('📝 All Notes:', allNotes);
  console.log('📋 All Tasks:', allTasks);
}, [allNotes, allTasks]);

  const taskMap = useMemo(() => {
  const map = new Map<string, string>();
  if (Array.isArray(allTasks)) {
    allTasks.forEach((task) => {
      if (task?._id && task?.title) {
        map.set(task._id, task.title);
      }
    });
  }
  return map;
}, [allTasks]);



   const notesWithTaskTitle = useMemo(() => {
    if (!Array.isArray(notes)) return [];
    return notes.map((note) => {
    
     if (note.task && typeof note.task === 'object' && note.task.title) {
      return {
        ...note,
        taskTitle: note.task.title,
        taskId: note.task._id || note.taskId,
      };
    }

      if (note.taskId && taskMap.has(note.taskId)) {
        return {
          ...note,
          taskTitle: taskMap.get(note.taskId),
          taskId: note.taskId,
        };
      }
      return {
        ...note,
        taskTitle: 'None',
        taskId: note.taskId,
      };
    });
  }, [notes, taskMap]);
const loadCollaboratorsForNote = async (noteId: string, pageUrl: string, source: string) => {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    const response = await fetch(`http://localhost:5000/api/share/collaborators?noteId=${noteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();

      const filtered = (data.collaborators || []).filter(
        (c: CollaboratorItem) => c.noteId === noteId
      );
      setCollaborators(filtered);
      console.log(`📋 Loaded ${filtered.length} collaborators for note ${noteId}`);
    }
  } catch (err) {
    console.error("Failed to load collaborators", err);
  }
};


const refreshCollaboratorsForNote = async (noteId: string) => {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    const response = await fetch(`http://localhost:5000/api/share/collaborators?noteId=${noteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      const filtered = (data.collaborators || []).filter(
        (c: CollaboratorItem) => c.noteId === noteId
      );
      setCollaborators(filtered);
      console.log(`📋 Refreshed ${filtered.length} collaborators for note ${noteId}`);
    }
  } catch (err) {
    console.error("Failed to refresh collaborators", err);
  }
};
  



 
const filteredNotes = useMemo<Note[]>(() => {
  if (!Array.isArray(notes)) return [];

  const statusKeywords = ["todo", "in progress", "complete", "not started"];
  const searchLower = searchText.trim().toLowerCase();

 
  let statusFilter: string | null = null;
  if (searchLower !== "") {
    const matchedStatus = statusKeywords.find(keyword => keyword === searchLower);
    if (matchedStatus) {
      if (matchedStatus === "todo") statusFilter = "Todo";
      else if (matchedStatus === "in progress") statusFilter = "In Progress";
      else if (matchedStatus === "complete") statusFilter = "Complete";
      else if (matchedStatus === "not started") statusFilter = "Not Started";
    }
  }

  return notesWithTaskTitle.filter((note: Note) => {

    if (statusFilter !== null) {
      const currentStatus = (note.task || note.category || "").trim().toLowerCase();
      return currentStatus === statusFilter.toLowerCase();
    }

   
    if (searchLower !== "") {
      const currentAssignee = (note.assignee || "").trim().toLowerCase();
      const currentPriority = (note.priority || "").trim().toLowerCase();
      const currentCategory = (note.category || "").trim().toLowerCase();

      const matchAssignee = currentAssignee.includes(searchLower);
      const matchPriority = currentPriority.includes(searchLower);
      const matchCategory = currentCategory.includes(searchLower);

      
      return matchAssignee || matchPriority || matchCategory;
    }

   
    return true;
  });
}, [notesWithTaskTitle, searchText]);

  const handleCreate = (): void => {
    navigate("/note-form/create");
  };

  const handleDeleteClick = (id: any, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setDeleteAnchorEl(e.currentTarget as HTMLButtonElement);
    setSelectedDeleteId(id);
  };

  const handleDeleteClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteAnchorEl(null);
    setSelectedDeleteId(null);
  };

  const handleConfirmDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedDeleteId) return;
    try {
      await deleteNote(selectedDeleteId).unwrap();
      if (showOnlySharedNote) {
        refetchSpecific();
      } else {
        refetch();
      }
    } catch (err: any) {
      console.log("Delete Failed:", err);
    } finally {
      setDeleteAnchorEl(null);
      setSelectedDeleteId(null);
    }
  };

  const handleEdit = (id: any, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/note-form/edit/${id}`);
  };

  const handleRowClick = (id: any) => {
    navigate(`/note-form/detail/${id}`);
  };

  // PDF Export Logic
  const handleExportPDF = async () => {
    const noteList = Array.isArray(notes) ? notes : [];

    const pdfData = noteList.filter((note: Note) => {
      if (!note.startDate) return false;
      const noteDate = new Date(note.startDate).getTime();

      if (exportStartDate) {
        const start = new Date(exportStartDate).getTime();
        if (noteDate < start) return false;
      }

      if (exportEndDate) {
        const end = new Date(exportEndDate).getTime();
        if (noteDate > end + 86400000) return false;
      }
      return true;
    });

    if (pdfData.length === 0) {
      alert("No notes found for the selected date range");
      return;
    }

    try {
      const doc = new jsPDF();
      doc.text("Notes Report by Date Range", 14, 15);
      doc.setFontSize(10);
      doc.text(`Date Range: ${exportStartDate || 'Any'} to ${exportEndDate || 'Any'}`, 14, 22);

      const tableHeaders = [["ID", "Title", "Description", "Priority", "Assignee", "Status", "Start Date"]];
      const tableRows = pdfData.map((note, index) => [
        note.id ?? index + 1,
        note.title || "",
        note.description || note.content || "",
        note.priority || "",
        note.assignee || "",
        note.task || "",
        note.startDate || ""
      ]);

      autoTable(doc, {
        head: tableHeaders,
        body: tableRows,
        startY: 26,
        theme: 'grid',
        headStyles: { fillColor: [151, 58, 168] }
      });

      const defaultFileName = `Notes_${(exportStartDate || 'start').replace(/-/g, '')}_to_${(exportEndDate || 'end').replace(/-/g, '')}.pdf`;
      const pdfBlob = doc.output('blob');
      saveAs(pdfBlob, defaultFileName);

      setDialogOpen(false);
      setExportStartDate("");
      setExportEndDate("");
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("PDF export failed. Please try again.");
    }
  };

  // Share Popover Handlers
  const handleShareClick = async (event: React.MouseEvent<HTMLButtonElement>, noteId: string, noteTitle: string) => {
    event.stopPropagation();
    setShareAnchorEl(event.currentTarget);
    setSelectedNoteId(noteId);
    setSelectedNoteTitle(noteTitle);
    await loadCollaboratorsForNote(noteId,window.location.pathname,"note_form_page");
  };

  const handleShareClose = () => {
    setShareAnchorEl(null);
    setSelectedNoteId(null);
    setSelectedNoteTitle("");
  };

  const handleOpenPermissionMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string | null,
    currentRole: string
  ) => {
    event.stopPropagation();
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
      const response = await fetch(`http://localhost:5000/api/share/${activeCollaboratorId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      if (response.ok) {
        setCollaborators((prev) => prev.filter((person) => person._id !== activeCollaboratorId));
        if (selectedNoteId) {
          await loadCollaboratorsForNote(selectedNoteId,window.location.pathname,"note_form_page");
        }
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

const renderSharePopover = () => (
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
    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
      Sharing: {selectedNoteTitle}
    </Typography>
    <ShareNoteDetailPage
      user={user}
      collaborators={collaborators}
      setCollaborators={setCollaborators}
      handleOpenPermissionMenu={handleOpenPermissionMenu}
      getRoleLabel={getRoleLabel}
      noteId={selectedNoteId || ''}
      onRefresh={() => selectedNoteId && loadCollaboratorsForNote(selectedNoteId, window.location.pathname, "note_form_page")}
    />
  </Popover>
);

  // Render Permission Menu
  const renderPermissionMenu = () => (
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
            boxShadow: "0px 4px 16px rgba(0,0,0,0.12)"
          }
        }
      }}
    >
      {[
        { role: "full", label: "Full access", desc: "Edit, suggest, comment, and share" },
        { role: "editor", label: "Can edit", desc: "Edit, suggest, and comment" },
        { role: "commenter", label: "Can comment", desc: "Suggest and comment" },
        { role: "viewer", label: "Can view", desc: "" },
      ].map(({ role, label, desc }) => (
        <MenuItem key={role} onClick={() => handlePermissionChange(role)} sx={{ py: 1 }}>
          <ListItemText
            primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>{label}</Typography>}
            secondary={desc && <Typography variant="caption" color="text.secondary">{desc}</Typography>}
          />
          {activeRole === role && <Check sx={{ fontSize: 16, ml: 1 }} />}
        </MenuItem>
      ))}

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
  );

  const renderShareButton = (noteId: string, noteTitle: string) => (
    <IconButton
      onClick={(e) => handleShareClick(e, noteId, noteTitle)}
      sx={{
        color: 'text.primary',
        borderRadius: '4px',
        textTransform: 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          bgcolor: 'action.hover'
        }
      }}
    >
      <Share />
    </IconButton>
  );

  if (isLoading) return <Typography>Loading notes...</Typography>;
  if (isError) return <Typography color="error">Failed to load notes.</Typography>;

  return (
    <Paper sx={{ width: '100%', minWidth: isMobile ? 300 : 400, p: 2, bgcolor: "background.default", color: "text.primary" }}>
      {/* Header Section */}
      <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        {/* <Button
          onClick={handleCreate}
          startIcon={<NoteAddIcon />}
          sx={{
            textTransform: "none",
            color: "text.primary",
            fontSize: "18px",
            fontWeight: "500",
            borderRadius: 3,
            px: 1.5,
            whiteSpace: 'nowrap',
            "& .MuiButton-startIcon": { color: "#973aa8" },
          }}
        >
          Create Note
        </Button> */}

        <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
          <IconButton
            size="small"
            sx={{ color: 'text.primary', mr: searchOpen ? 1 : 0, borderRadius: '4px' }}
            onClick={() => setSearchOpen((prev) => !prev)}
          >
            <Search fontSize="small" />
          </IconButton>
          {searchOpen && (
            <TextField
              size="small"
              autoFocus
              placeholder="Search by status, priority, or category"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              sx={{
                width: 220,
                '& .MuiOutlinedInput-root': { height: 30, fontSize: '0.85rem', borderRadius: '4px' },
                '& .MuiOutlinedInput-input': { py: 0.5, px: 1 },
              }}
            />
          )}
        </Box>

        <Button
          startIcon={<CloudDownloadOutlinedIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{
            ml: 2,
            textTransform: "none",
            color: "text.primary",
            fontSize: "14px",
            fontWeight: "500",
            borderRadius: 3,
            px: 1.3,
            whiteSpace: 'nowrap',
            "& .MuiButton-startIcon": { color: "#973aa8" },
          }}
        >
          Download File
        </Button>
      </Stack>

      {/* Date Picker Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Select the dates for PDF export</DialogTitle>
        <DialogContent sx={{ minWidth: 300, pt: 2 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="From Date"
              type="date"
              fullWidth
              value={exportStartDate}
              onChange={(e) => setExportStartDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="To Date"
              type="date"
              fullWidth
              value={exportEndDate}
              onChange={(e) => setExportEndDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit" sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleExportPDF}
            variant="contained"
            disabled={!exportStartDate || !exportEndDate}
            sx={{ bgcolor: "#973aa8", "&:hover": { bgcolor: "#7b2e8a" }, textTransform: 'none' }}
          >
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notes List */}
      {isMobile ? (
        <Stack spacing={2}>
          {filteredNotes.map((row, index) => (
            <Paper
              key={row._id ?? index}
              elevation={2}
              sx={{ p: 2, borderRadius: 3, cursor: "pointer" }}
              onClick={() => handleRowClick(row._id)}
            >
              <Typography variant="h6">{row.title}</Typography>
              <Typography sx={{ mt: 1 }}>{row.description ?? row.content}</Typography>
              <Typography variant="body2"><b>Linked Task:</b> {row.taskTitle || row.taskId || 'None'}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}><b>Priority:</b> {row.priority}</Typography>
              <Typography variant="body2"><b>Assignee:</b> {row.assignee}</Typography>
              <Typography variant="body2"><b>Category:</b> {row.category}</Typography>
              <Typography variant="body2"><b>Status:</b> {row.task}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>{row.startDate} - {row.endDate}</Typography>

              <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", mt: 2 }}>
                <IconButton sx={{ color: "#973aa8" }} onClick={(e) => handleEdit(row._id, e)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={(e) => handleDeleteClick(row._id, e)}>
                  <DeleteIcon />
                </IconButton>
                {renderShareButton(row._id, row.title)}
              </Stack>
            </Paper>
          ))}
        </Stack>
      ) : (
        <TableContainer sx={{ overflowX: "auto", mt: 1 }}>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#dec9e9', fontWeight: 'bold', color: "#2f004f" }}>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Task Title</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Assignee</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNotes.map((row, index) => (
                <TableRow
                  key={row._id ?? row.id ?? index}
                  onClick={() => handleRowClick(row._id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{row.id ?? index + 1}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.description ?? row.content}</TableCell>
                  <TableCell>{row.taskId ? (row.taskTitle || row.taskId
        ) : (
          'None'
        )}</TableCell>
                  <TableCell>{row.priority}</TableCell>
                  <TableCell>{row.assignee}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.task}</TableCell>
                  <TableCell>{row.startDate}</TableCell>
                  <TableCell>{row.endDate}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex" }}>
                      <IconButton sx={{ color: "text.primary" }} onClick={(e) => handleEdit(row._id, e)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton sx={{ color: "#720026" }} onClick={(e) => handleDeleteClick(row._id, e)}>
                        <DeleteIcon />
                      </IconButton>
                      {renderShareButton(row._id, row.title)}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Shared Popovers - rendered once */}
      {renderSharePopover()}
      {renderPermissionMenu()}

      {/* Delete Confirmation Popover */}
      <Popover
        open={openDeletePopover}
        anchorEl={deleteAnchorEl}
        onClose={(e: any) => handleDeleteClose(e)}
        onClick={(e) => e.stopPropagation()}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { p: 1.5, boxShadow: '0px 2px 10px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0', borderRadius: '8px' }
          }
        }}
      >
        <Typography sx={{ fontSize: '13px', fontWeight: 500, mb: 1, color: 'text.primary' }}>
          Delete this note?
        </Typography>
        <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
          <Button size="small" onClick={handleDeleteClose} sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '11px' }}>
            Cancel
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={handleConfirmDelete}
            sx={{ textTransform: 'none', bgcolor: '#720026', fontSize: '11px', '&:hover': { bgcolor: '#50001a' } }}
          >
            Confirm
          </Button>
        </Stack>
      </Popover>
    </Paper>
  );
};