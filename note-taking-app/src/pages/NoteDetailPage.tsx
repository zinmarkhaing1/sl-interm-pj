
import { 
  Box, Card, CardContent, Typography, Button, Stack, Chip, Divider, 
  Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText,
  TextField, Avatar
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import PersonIcon from "@mui/icons-material/Person";
import ShareIcon from "@mui/icons-material/Share";
import SendIcon from '@mui/icons-material/Send';
import { useState, useEffect, useRef, useMemo } from "react"; 
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
  userId?: string | {
    _id? : string;
    email?: string;
    name?: string;
  }
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  photo?: string;
  _id?: string;
}

interface Comment {
  _id: string;
  noteId: string;
  text: string;
  userName: string;
  userEmail: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export const NoteDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: fetchedNote, isLoading, refetch: refetchNote } = useGetNoteByIdQuery(id || "", { skip: !id });
  const note = fetchedNote;
  const { data: commentData, refetch: refetchComments } = useGetCommentsQuery(id || "", { skip: !id });
  const [addComment] = useAddCommentMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const [commentText, setCommentText] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const [openDeleteCommentDialog, setOpenDeleteCommentDialog] = useState(false);

  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Share states
  const [user, setUser] = useState<UserProfile | null>(null);
  const [collaborators, setCollaborators] = useState<CollaboratorItem[]>([]);
  const [shareAnchorEl, setShareAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [permissionMenuAnchorEl, setPermissionMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [activeCollaboratorId, setActiveCollaboratorId] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<string>("full");


 
  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [commentData]);

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

 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const parts = token.split('.');
        const payload = JSON.parse(atob(parts[1]));
        console.log("🔐 Token payload:", payload);
        console.log("👤 User ID from token:", payload.id || payload._id || payload.userId);
      } catch (e) {
        console.error("Failed to decode token", e);
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

  // ===== FIXED: normalizeId =====
  const normalizeId = (value: any) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      if (value._id) {
        return typeof value._id === "string" ? value._id : value._id.toString();
      }
      if (value.id) {
        return typeof value.id === "string" ? value.id : value.id.toString();
      }
      if (typeof value.toString === "function" && value.toString() !== "[object Object]") {
        return value.toString();
      }
    }
    return "";
  };

  // ===== Get current user =====
  const storedUser = localStorage.getItem("user");
  let currentUserId = "";
  let currentUserEmail = "";
  try {
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    currentUserId = normalizeId(parsedUser?.id || parsedUser?._id || parsedUser?.userId || parsedUser?.authId);
    currentUserEmail = parsedUser?.email || "";
    console.log("👤 currentUserId:", currentUserId);
    console.log("📧 currentUserEmail:", currentUserEmail);
  } catch (err) {
    console.error("Failed to parse user from localStorage", err);
  }

  // ===== Check owner =====
  const noteOwnerId = normalizeId(note?.authId || (note as any)?.user || (note as any)?.userId);
  const isOwner = note?.isOwned === true || (Boolean(note) && noteOwnerId && noteOwnerId === currentUserId);

  console.log("👑 Note Owner ID:", noteOwnerId);
  console.log("👤 Current User ID:", currentUserId);
  console.log("👑 Is Owner:", isOwner);

  // ===== FIXED: getUserRole =====
  const getUserRole = () => {
    if (isOwner) {
      return "owner";
    }
    
    const collaborator = collaborators.find((c) => {
      if (c.userId) {
        const uid = typeof c.userId === "object" ? c.userId._id : c.userId;
        if (uid === currentUserId) return true;
      }
      if (c.invitedEmail && c.invitedEmail.toLowerCase() === currentUserEmail.toLowerCase()) {
        return true;
      }
      return false;
    });
    
    if (collaborator && collaborator.status === "accepted") {
      return collaborator.role;
    }
    
    return "none";
  };

  const userRole = getUserRole();

  // ===== FIXED: hasCommentPermission =====
  const hasCommentPermission = () => {
    console.log(" Checking comment permission...");
    console.log(" isOwner:", isOwner);
    console.log("Collaborators count:", collaborators.length);

    
    if (isOwner) {
      const hasInvitedSomeone = collaborators.length > 0;
    console.log(" Has invited someone:", hasInvitedSomeone);
    
    if (hasInvitedSomeone) {
      console.log(" Owner - has invited someone, can comment");
      return true;
    } else {
      console.log(" Owner - hasn't invited anyone yet");
      return false;
    }
    }
    
    const collaborator = collaborators.find((c) => {
      if (c.userId) {
        const uid = typeof c.userId === "object" ? c.userId._id : c.userId;
        if (uid === currentUserId) {
          console.log("✅ Found collaborator by userId:", uid);
          return true;
        }
      }
      if (c.invitedEmail && c.invitedEmail.toLowerCase() === currentUserEmail.toLowerCase()) {
        console.log("✅ Found collaborator by email:", c.invitedEmail);
        return true;
      }
      return false;
    });
    
    if (collaborator && collaborator.status === "accepted") {
      const hasCommentRole = collaborator.role === "commenter" || 
                            collaborator.role === "editor" || 
                            collaborator.role === "full";
      console.log("📋 Collaborator role:", collaborator.role);
      console.log("📋 Has comment role:", hasCommentRole);
      return hasCommentRole;
    }
    
    console.log(" No permission found");
    return false;
  };



  const hasEditCollaborator = collaborators.some(
  c => (c.role === "editor" || c.role === "full") && c.status === "accepted"
);

  // const canEditNote = userRole === "owner" || userRole === "editor" || userRole === "full";
  const canEditNote = note?.accessPermission === "owner" || 
                    note?.accessPermission === "edit" || 
                    note?.accessPermission === "full";

  const showCommentBox = !hasEditCollaborator && hasCommentPermission();
  const canAddComment = hasCommentPermission();
  
  console.log(" showCommentBox:", showCommentBox);
  console.log(" canAddComment:", canAddComment);
  const hasBeenShared = collaborators.length > 0;

  // ===== FIXED: accessLabel =====
  const accessLabel = isOwner
    ? "Owner"
    : !hasBeenShared
    ? "Not shared"
    : userRole === "full"
    ? "Full access"
    : userRole === "editor"
    ? "Can edit"
    : userRole === "commenter"
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
        
        refetchNote();
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
      const collaboratorToRemove = collaborators.find(
        (c) => c._id === activeCollaboratorId
      );
      
      const response = await fetch(`http://localhost:5000/api/share/${activeCollaboratorId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      
      if (response.ok) {
        if (collaboratorToRemove?.role === "commenter" || collaboratorToRemove?.role === "comment") {
          const email = collaboratorToRemove.invitedEmail;
          
          const deleteCommentsResponse = await fetch(
            `http://localhost:5000/api/comments/delete-by-user?noteId=${id}&userEmail=${encodeURIComponent(email)}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
            }
          );
          
          if (deleteCommentsResponse.ok) {
            refetchComments();
          }
        }
        
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
        
        refetchNote();
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

  // ===== FIXED: handleAddComment =====
  const handleAddComment = async () => {
    const trimmed = commentText.trim();
    if (!trimmed || !canAddComment) return;

    console.log("===== ADD COMMENT REQUEST =====");
    console.log("Note ID:", id);
    console.log("Can Add Comment:", canAddComment);
    console.log("User Role:", userRole);
    console.log("Is Owner:", isOwner);
    console.log("Has Comment Permission:", hasCommentPermission());

    const storedUserStr = localStorage.getItem('user');
    let authorName = 'You';
    let userEmail = '';
    
    try {
      if (storedUserStr) {
        const parsed = JSON.parse(storedUserStr);
        authorName = parsed?.firstName || parsed?.name || 'You';
        userEmail = parsed?.email || '';
        console.log("User from localStorage:", { authorName, userEmail });
      }
    } catch (err) {
      console.log("Failed to parse user from localStorage", err);
    }

    if (!userEmail && user?.email) {
      userEmail = user.email;
      console.log("User email from state:", userEmail);
    }
    
    if (!userEmail && currentUserEmail) {
      userEmail = currentUserEmail;
      console.log("User email from currentUserEmail:", userEmail);
    }

    try {
      console.log("Sending comment with:", { 
        id: id || '', 
        text: trimmed, 
        userName: authorName,
        userEmail: userEmail 
      });
      
      await addComment({ 
        id: id || '', 
        text: trimmed, 
        userName: authorName,
        userEmail: userEmail
      }).unwrap();
      
      setCommentText('');
      refetchComments();
    } catch (err: any) {
      console.error('Failed to add comment', err);
      console.log('Error details:', err?.data?.debug);
      alert(err?.data?.message || 'Failed to send comment. Please try again.');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleAddComment();
    }
  };

  // ===== FIXED: handleDeleteComment =====
  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      
      if (response.ok) {
        refetchComments();
        setOpenDeleteCommentDialog(false);
        setDeleteCommentId(null);
      } else {
        let errorMessage = "Failed to delete comment.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        alert(errorMessage);
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  
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

 
  const comments = (commentData?.comments || []) as Comment[];


  const filteredComments = useMemo(() => {
    if (isOwner) {
      return comments;
    }
    if (hasBeenShared) {
      return comments;
    }
  
    return comments.filter((comment) => {
      const commentUserId = normalizeId(comment.userId);
      const commentEmail = comment.userEmail?.toLowerCase() || '';
      const currentEmail = currentUserEmail?.toLowerCase() || '';
      return commentUserId === currentUserId || commentEmail === currentEmail;
    });
  }, [comments, isOwner, hasBeenShared, currentUserId, currentUserEmail]);

  console.log('📊 All comments (raw):', comments);
  console.log('📊 Filtered comments (visible):', filteredComments);


   if (!note) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">Note Not Found!</Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ width: "100%", minHeight: "80vh", p: { xs: 2, md: 4 } }}>
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
            { role: "editor", label: "Can edit", desc: "Edit and suggesst" },
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
              <Chip 
                label={accessLabel} 
                variant="outlined" 
                color={
                  isOwner ? "success" : 
                  userRole === "full" ? "primary" :
                  userRole === "editor" ? "primary" :
                  userRole === "commenter" ? "info" : 
                  "default"
                } 
                size="small" 
              />
            </Stack>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                {isOwner && !showCommentBox
                  ? "Owner view — Share this note with someone and give them 'Can comment' permission to enable comments."
                  : isOwner && showCommentBox
                  ? "Comments are enabled — You can participate in the discussion."
                  : userRole === "commenter"
                  ? "You have comment access — you can leave comments on this note."
                  : !hasBeenShared
                  ? "This note has not been shared with you."
                  : `Shared document view — Access Level: ${accessLabel}.`}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* ============ COMMENT SECTION ============ */}
            {showCommentBox && (
              <Box sx={{ mb: 4 }}>
           
                <Stack 
                  direction="row" 
                  sx={{ 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    mb: 2,
                    p: 1.5,
                    bgcolor: "#f5f0f7",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#2F004F" }}>
                    Comments ({filteredComments.length})
                  </Typography>
                  <Chip 
                    label={canAddComment ? "You can comment" : "View only"} 
                    size="small" 
                    color={canAddComment ? "primary" : "default"} 
                  />
                </Stack>

                {/* Comment Input */}
                {canAddComment && (
                  <Box 
                    sx={{ 
                      mb: 3,
                      p: 2,
                      bgcolor: 'white',
                      borderRadius: 2,
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: '#5a206c' }}>
                        {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          value={commentText}
                          onChange={(event) => setCommentText(event.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder="Write a comment..."
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              bgcolor: '#fafafa',
                            }
                          }}
                        />
                        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end', mt: 1 }}>
                          <Button 
                            variant="contained" 
                            onClick={handleAddComment}
                            disabled={!commentText.trim()}
                            endIcon={<SendIcon />}
                            sx={{ 
                              textTransform: 'none',
                              bgcolor: commentText.trim() ? '#5a206c' : '#e0e0e0',
                              '&:hover': {
                                bgcolor: commentText.trim() ? '#4a1a5c' : '#e0e0e0',
                              }
                            }}
                          >
                            Comment
                          </Button>
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                )}

                
                {filteredComments.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#fafafa', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {isOwner 
                        ? "No comments yet." 
                        : "No comments from you yet."}
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {filteredComments.map((comment) => {
                     
                      const isOwnComment = comment.userId?.toString() === currentUserId?.toString() || 
                                           comment.userEmail === currentUserEmail;
                      const canDelete = isOwner || isOwnComment;
                      
                      return (
                        <Box 
                          key={comment._id}
                          sx={{ 
                            display: 'flex',
                            gap: 2,
                            p: 2,
                            bgcolor: 'white',
                            borderRadius: 2,
                            border: '1px solid #e5e7eb',
                            transition: 'all 0.2s',
                            '&:hover': {
                              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            }
                          }}
                        >
                          <Avatar sx={{ width: 40, height: 40, bgcolor: '#5a206c', flexShrink: 0 }}>
                            {comment.userName?.charAt(0)?.toUpperCase() || 'C'}
                          </Avatar>
                          
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', mb: 0.5 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                {comment.userName || 'Anonymous'}
                              </Typography>
                              
                              {isOwnComment && (
                                <Chip 
                                  label="You" 
                                  size="small" 
                                  sx={{ 
                                    fontSize: '10px', 
                                    height: 18,
                                    bgcolor: '#5a206c',
                                    color: 'white',
                                  }} 
                                />
                              )}
                              
                              {isOwner && !isOwnComment && (
                                <Chip 
                                  label="Guest" 
                                  size="small" 
                                  sx={{ 
                                    fontSize: '10px', 
                                    height: 18,
                                    bgcolor: '#f5f5f5',
                                    color: '#666',
                                  }} 
                                />
                              )}
                              
                              <Typography variant="caption" color="text.secondary">
                                {new Date(comment.createdAt).toLocaleString()}
                              </Typography>
                            </Stack>

                            <Typography variant="body2" sx={{ 
                              color: '#333', 
                              whiteSpace: 'pre-line',
                              wordWrap: 'break-word',
                              mt: 0.5,
                            }}>
                              {comment.text}
                            </Typography>
                            
                            {canDelete && (
                              <Box sx={{ mt: 1 }}>
                                <Button
                                  size="small"
                                  onClick={() => {
                                    setDeleteCommentId(comment._id);
                                    setOpenDeleteCommentDialog(true);
                                  }}
                                  sx={{ 
                                    textTransform: 'none', 
                                    fontSize: '12px', 
                                    color: '#e53935',
                                    p: 0,
                                    minWidth: 'auto',
                                    '&:hover': { 
                                      bgcolor: 'transparent',
                                      color: '#c62828',
                                    }
                                  }}
                                >
                                  Delete
                                </Button>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                    <div ref={commentsEndRef} />
                  </Stack>
                )}
              </Box>
            )}
            {/* ============ END COMMENT SECTION ============ */}

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

      {/* Delete Note Dialog */}
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

      {/* Delete Comment Dialog */}
      <Dialog open={openDeleteCommentDialog} onClose={() => setOpenDeleteCommentDialog(false)}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Delete Comment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this comment?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenDeleteCommentDialog(false)} variant="outlined" sx={{ borderRadius: 2, textTransform: "none", color: "gray", borderColor: "gray" }}>
            Cancel
          </Button>
          <Button 
            onClick={() => deleteCommentId && handleDeleteComment(deleteCommentId)} 
            variant="contained" 
            color="error" 
            autoFocus 
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};