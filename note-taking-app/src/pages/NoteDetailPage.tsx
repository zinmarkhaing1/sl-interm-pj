

import { 
  Box, Card, CardContent, Typography, Button, Stack, Chip, Divider, 
  Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText,
  TextField, Avatar
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import PersonIcon from "@mui/icons-material/Person";
import ShareIcon from "@mui/icons-material/Share";
import { useState, useEffect, useCallback } from "react";
import { useDeleteNoteMutation, useGetCommentsQuery, useAddCommentMutation, useGetNoteByIdQuery } from "../services/noteApi";
import { Popover, Menu, MenuItem, ListItemText, ListItemIcon } from "@mui/material";
import { Check, DeleteOutlined } from '@mui/icons-material';
import { ShareNoteDetailPage } from '../components/sharepages/ShareNoteDetailPage';

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

export const NoteDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: fetchedNote, isLoading, refetch: refetchNote } = useGetNoteByIdQuery(id || "", { skip: !id });
  const note = fetchedNote;

  const [commentText, setCommentText] = useState("");
  const { data: commentData, refetch: refetchComments } = useGetCommentsQuery(id || "", { skip: !id });
  const [addComment] = useAddCommentMutation();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Share states
  const [user, setUser] = useState<UserProfile | null>(null);
  const [collaborators, setCollaborators] = useState<CollaboratorItem[]>([]);
  const [shareAnchorEl, setShareAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [permissionMenuAnchorEl, setPermissionMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [activeCollaboratorId, setActiveCollaboratorId] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<string>("full");

  useEffect(() => {
    if (!isLoading) {
      if (!note) {
        navigate('/note-form');
      }
    }
  }, [isLoading, note, navigate]);
  

  // Load user
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

  // Load collaborators for this note
  useEffect(() => {
    const loadCollaborators = async () => {
      if (!id) return;
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await fetch(`http://localhost:5000/api/share/collaborators?noteId=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setCollaborators(data.collaborators || []);
        }
      } catch (err) {
        console.error("Failed to fetch collaborators", err);
      }
    };
    loadCollaborators();
  }, [id]);

  // --- Role & Permissions Logic ---
  const normalizeId = (value: any) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      if (typeof value.toString === "function" && value.toString() !== "[object Object]") {
        return value.toString();
      }
      if ((value as any)._id) return String((value as any)._id);
      if ((value as any).id) return String((value as any).id);
    }
    return "";
  };

  const storedUser = localStorage.getItem("user");
  let currentUserId = "";
  let currentUserEmail = "";
  try {
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    currentUserId = normalizeId(parsedUser?.id || parsedUser?._id || parsedUser?.userId || parsedUser?.authId);
    currentUserEmail = parsedUser?.email || "";
  } catch (err) {
    console.error("Failed to parse user from localStorage", err);
  }

  const noteOwnerId = normalizeId(note?.authId || (note as any)?.user || (note as any)?.userId);
  const isOwner = note?.isOwned === true || (Boolean(note) && noteOwnerId && noteOwnerId === currentUserId);

  const rawRole = isOwner || note?.accessPermission === "owner" || note?.isOwned === true
    ? "owner"
    : (note?.accessPermission || (note as any)?.currentUserRole || "viewer");

  const isFullAccess = isOwner || rawRole === "owner" || rawRole === "full";
  const canEditNote = isFullAccess || rawRole === "editor" || rawRole === "edit" || rawRole === "edit_content";
  const isCommentRole = rawRole === "comment" || rawRole === "commenter";
  
  // ============ FIX: Owner can always comment ============
  const hasCommentPermission = isOwner || isCommentRole;
  // ============ END FIX ============

  const accessLabel = isOwner || rawRole === "owner"
    ? "Owner"
    : canEditNote
    ? "Can edit"
    : isCommentRole
    ? "Can comment"
    : "Can view";

  // Share handlers
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
        // Refresh collaborators
        if (id) {
          const token = localStorage.getItem("token");
          const response = await fetch(`http://localhost:5000/api/share/collaborators?noteId=${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setCollaborators(data.collaborators || []);
          }
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

  const handleAddComment = async () => {
    const trimmed = commentText.trim();
    if (!trimmed || !hasCommentPermission) return;

    const storedUserStr = localStorage.getItem('user');
    let authorName = 'You';
    try { const parsed = storedUserStr ? JSON.parse(storedUserStr) : null; authorName = parsed?.firstName || 'You'; } catch {}

    try {
      await addComment({ 
        id: id || '', 
        text: trimmed, 
        userName: authorName,
        userEmail: currentUserEmail 
      }).unwrap();
      setCommentText('');
      refetchComments();
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };

  const [deleteNote] = useDeleteNoteMutation();
  
  const handleDeleteClick = () => { setOpenDeleteDialog(true); };
  const handleDeleteClose = () => { setOpenDeleteDialog(false); };

  const handleConfirmDelete = async () => {
    try {
      const noteId = note?._id || note?.id;
      if (noteId && isOwner) {
        await deleteNote(noteId).unwrap();
        setOpenDeleteDialog(false);
        navigate(-1);
      }
    } catch (err: any) {
      console.log("Delete Failed:", err);
    }
  };

  if (!note) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">Note Not Found!</Typography>
      </Box>
    );
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case "high": return "error";
      case "medium": return "warning";
      default: return "info";
    }
  };

  const handleEdit = (noteId: any) => {
    if (noteId && canEditNote) navigate(`/note-form/edit/${noteId}`);
  };

  const filteredComments = commentData?.comments || [];

  return (
    <Box sx={{ bgcolor: "background.default", width: "100%", minHeight: "80vh", p: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        
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
                bgcolor: 'background.paper',
                color: 'text.primary'
              }
            }
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
            Sharing: {note.title}
          </Typography>
          <ShareNoteDetailPage
            user={user}
            collaborators={collaborators}
            setCollaborators={setCollaborators}
            handleOpenPermissionMenu={handleOpenPermissionMenu}
            getRoleLabel={getRoleLabel}
            noteId={id || ''}
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

        {/* Back Button */}
        {isOwner && (
          <Button 
            startIcon={<ArrowBackIosNewOutlinedIcon />} 
            onClick={() => navigate(-1)} 
            sx={{ mb: 3, textTransform: 'none', color: 'text.primary' }}
          >
            Back to Notes
          </Button>
        )}

        <Card sx={{ borderRadius: 4, boxShadow: 3, borderLeft: "6px solid #5a206c", overflow: "hidden" }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            
            {/* Title & Priority */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 1, alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between" }}>
              <Typography variant="h6" sx={{ fontWeight: "600", fontSize: { xs: "16px", md: "20px" }, color: "#2F004F" }}>
                {note.title}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip label={`Priority: ${note.priority || "Normal"}`} color={getPriorityColor(note.priority)} size="medium" />
                {isOwner && (
                  <Button
                    startIcon={<ShareIcon />}
                    onClick={handleShareClick}
                    size="small"
                    sx={{
                      textTransform: 'none',
                      color: '#973aa8',
                      '&:hover': { bgcolor: 'rgba(151, 58, 168, 0.08)' }
                    }}
                  >
                    Share
                  </Button>
                )}
              </Stack>
            </Stack>

            {/* Content Display */}
            <Stack direction="row" sx={{ mb: 2, mt: 1 }}>
              <Typography variant="body1" sx={{ color: "#4a4a4a", lineHeight: 1.7, whiteSpace: "pre-line", width: "100%" }}>
                {note.description || note.content || "No description provided."}
              </Typography>
            </Stack>

            {/* Tags & Permissions Label */}
            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
              {note.category && <Chip label={note.category} variant="outlined" size="small" sx={{ color: "#121212" }} />}
              {note.task && <Chip label={note.task} color="secondary" size="small" />}
              <Chip label={accessLabel} variant="outlined" color={rawRole === "viewer" ? "default" : rawRole === "commenter" ? "info" : "success"} size="small" />
            </Stack>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                {isOwner ? "Owner view — you can manage, edit, and comment on this note." : `Shared document view — Access Level: ${accessLabel}.`}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* ============ FIX: Show comment section for both owner and commenter ============ */}
            {hasCommentPermission && (
              <Box sx={{ mb: 4, p: 2.5, border: "1px solid #e5e7eb", borderRadius: 3, bgcolor: "#fcfdff" }}>
                <Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, mb: 1.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#2F004F" }}>
                    {canEditNote ? "Discussion and edits" : "Discussion"}
                  </Typography>
                  <Chip label={canEditNote ? "Collaborative" : "Comment only"} size="small" color="secondary" />
                </Stack>

                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  placeholder={isOwner ? "Leave a note for the team..." : "Add your comment..."}
                  sx={{ mb: 1.5 }}
                />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {isOwner ? "You can edit the note and leave thoughtful comments." : "You can leave comments but cannot edit the note content."}
                  </Typography>
                  <Button variant="contained" onClick={handleAddComment} sx={{ textTransform: "none" }}>
                    Add comment
                  </Button>
                </Stack>

                {filteredComments.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No comments yet. Start the conversation.
                  </Typography>
                ) : (
                  <Stack spacing={1.25}>
                    {filteredComments.map((comment: any) => (
                      <Box key={comment._id || comment.id} sx={{ display: "flex", gap: 1.25, p: 1.25, borderRadius: 2, bgcolor: "white", border: "1px solid #eef2f7" }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: "#5a206c", fontSize: 13 }}>
                          {comment.userName?.charAt(0)?.toUpperCase() || 'C'}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.25 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#2F004F" }}>
                              {comment.userName || 'Collaborator'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(comment.createdAt).toLocaleString()}
                            </Typography>
                          </Stack>
                          <Typography variant="body2" sx={{ color: "#4a4a4a", whiteSpace: "pre-line" }}>
                            {comment.text}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            )}
            {/* ============ END FIX ============ */}

            {/* Meta Data Area */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.2fr 2fr 1.5fr" }, gap: 2, mt: 2 }}>
              <Box>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <PersonIcon sx={{ color: "#5a206c" }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Assignee</Typography>
                    <Typography variant="body1" sx={{ fontWeight: "500" }}>{note.assignee || "Unassigned"}</Typography>
                  </Box>
                </Stack>
              </Box>
              
              <Box>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <CalendarTodayIcon sx={{ color: "#5a206c" }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Timeline</Typography>
                    <Typography variant="body1" sx={{ fontWeight: "500" }}>
                      {note.startDate || "N/A"} — {note.endDate || "N/A"}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Edit / Delete Buttons Control */}
              <Box sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" } }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Button 
                    disabled={!canEditNote}
                    onClick={() => handleEdit(note._id || note.id)} 
                    startIcon={<EditOutlinedIcon />} 
                    sx={{ 
                      textTransform: "none", color: "black", fontSize: "14px", borderRadius: 3, px: 1.5,
                      "&:hover": { bgcolor: "#f5f5f5" },
                    }}
                  >
                    Edit
                  </Button>
                  
                  <Button 
                    disabled={!isOwner}
                    onClick={handleDeleteClick} 
                    startIcon={<DeleteOutlinedIcon />} 
                    sx={{ 
                      textTransform: "none", color: "black", fontSize: "14px", borderRadius: 3, px: 1.5,
                      "&:hover": { bgcolor: "#f5f5f5" },
                    }}
                  >
                    Delete
                  </Button>
                </Stack>
              </Box>
            </Box>

          </CardContent>
        </Card>
      </Box>

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteClose}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this note? Once deleted, it cannot be recovered.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleDeleteClose} variant="outlined" sx={{ borderRadius: 2, textTransform: "none", color: "gray", borderColor: "gray" }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error" autoFocus sx={{ borderRadius: 2, textTransform: "none" }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};