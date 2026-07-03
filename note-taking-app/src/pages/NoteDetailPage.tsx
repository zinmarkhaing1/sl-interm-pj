import { Box, Card, CardContent, Typography, Button, Stack, Chip, Divider, Dialog,DialogTitle,DialogActions,DialogContent,DialogContentText } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import { useDeleteNoteMutation, useGetNotesQuery } from "../services/noteApi";

export const NoteDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: notes = [] } = useGetNotesQuery();
  const note = notes.find((n: any) => n._id === id);
  // const [commentText, setCommentText] = useState("");
  // const [comments, setComments] = useState<Array<{ id: string; author: string; text: string; createdAt: string }>>([]);

  // const accessPermission = (note as { accessPermission?: string } | undefined)?.accessPermission || "view";
  // const canEdit = accessPermission === "edit" || accessPermission === "owner";
  // const canComment = accessPermission === "comment" || canEdit;
  // const canView = accessPermission === "view" || accessPermission === "comment" || canEdit;

  // useEffect(() => {
  //   if (!id) return;
  //   const saved = localStorage.getItem(`note-comments-${id}`);
  //   if (saved) {
  //     try {
  //       setComments(JSON.parse(saved));
  //     } catch {
  //       setComments([]);
  //     }
  //   }
  // }, [id]);

  // useEffect(() => {
  //   if (!id) return;
  //   localStorage.setItem(`note-comments-${id}`, JSON.stringify(comments));
  // }, [comments, id]);

  // const handleAddComment = () => {
  //   const trimmed = commentText.trim();
  //   if (!trimmed || !canComment) return;

  //   const storedUser = localStorage.getItem("user");
  //   let authorName = "You";

  //   try {
  //     const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  //     authorName = parsedUser?.firstName || "You";
  //   } catch {
  //     authorName = "You";
  //   }

  //   setComments((prev) => [
  //     ...prev,
  //     {
  //       id: `${Date.now()}`,
  //       author: authorName,
  //       text: trimmed,
  //       createdAt: new Date().toISOString(),
  //     },
  //   ]);
  //   setCommentText("");
  // };

  //delete confirm box
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  if (!note) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">Note Not Found!</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
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

  const handleEdit = (noteId:any) => {
    if (noteId) navigate(`/note-form/edit/${noteId}`);
  }

  const [deleteNote] = useDeleteNoteMutation();
 const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const noteId = note._id || note.id;
      if (noteId) {
        await deleteNote(noteId).unwrap();
        setOpenDeleteDialog(false);
        navigate(-1); 
      }
    } catch (err: any) {
      console.log("Delete Failed:", err);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f4f6f8", width: "100%", minHeight: "80vh", p: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        
      
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)} 
          sx={{ mb: 3, textTransform: 'none', color: '#5a206c' }}
        >
          Back to Notes
        </Button>

        <Card 
          sx={{ 
            borderRadius: 4, 
            boxShadow: 3, 
            borderLeft: "6px solid #5a206c",
            overflow: "hidden"
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            
            {/* Title & Priority */}
            <Stack direction={{ xs: "column", sm: "row" }}  spacing={2} sx={{ mb: 1,alignItems:{xs:"flex-start",sm:"center"},justifyContent:"space-between"}}>
              <Typography variant="caption" sx={{ fontWeight: "500", fontSize: { xs: "14px", md: "16px" } }}>
                {note.title}
              </Typography>

              <Chip label={`Priority: ${note.priority || "Normal"}`} color={getPriorityColor(note.priority)} size="medium" />
            </Stack>
            <Stack direction="row" sx={{mb:2}}>
              <Typography variant="h6" sx={{ fontStyle:"italic",fontFamily:"sans-serif", fontSize: { xs: "12px", md: "14px" } }}>
                {note.description || note.content}
              </Typography>
            </Stack>
            

            {/* Category & Status */}
            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
              {note.category && <Chip label={note.category} variant="outlined" size="small" />}
              {note.task && <Chip label={note.task} color="secondary" size="small" />}
            </Stack>

            {/* <Divider sx={{ mb: 3 }} /> */}

            {/* {!canView ? (
              <Typography color="error" sx={{ mb: 3 }}>
                You do not have access to view this note.
              </Typography>
            ) : (
              <Box>
                <Typography variant="h6" sx={{ color: "#5a206c", mb: 1, fontWeight: "600" }}>
                  Description / Content
                </Typography>
                <Typography variant="body1" sx={{ color: "#4a4a4a", lineHeight: 1.7, whiteSpace: "pre-line", mb: 4 }}>
                  {note.content ?? note.description ?? "No description provided."}
                </Typography>
              </Box>
            )}

            {canComment && (
              <Box sx={{ mb: 4, p: 2.5, border: "1px solid #e5e7eb", borderRadius: 3, bgcolor: "#fcfdff" }}>
                <Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, mb: 1.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#2F004F" }}>
                    {canEdit ? "Discussion and edits" : "Discussion"}
                  </Typography>
                  <Chip label={canEdit ? "Collaborative" : "Comment only"} size="small" color="secondary" />
                </Stack>

                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  placeholder="Leave a note for the team..."
                  sx={{ mb: 1.5 }}
                />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {canEdit ? "You can edit the note and leave thoughtful comments." : "You can leave comments but cannot edit the note content."}
                  </Typography>
                  <Button variant="contained" onClick={handleAddComment} sx={{ textTransform: "none" }}>
                    Add comment
                  </Button>
                </Stack>

                {comments.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No comments yet. Start the conversation.
                  </Typography>
                ) : (
                  <Stack spacing={1.25}>
                    {comments.map((comment) => (
                      <Box key={comment.id} sx={{ display: "flex", gap: 1.25, p: 1.25, borderRadius: 2, bgcolor: "white", border: "1px solid #eef2f7" }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: "#5a206c", fontSize: 13 }}>
                          {comment.author.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.25 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#2F004F" }}>
                              {comment.author}
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

            {!canEdit && !canComment && (
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                This note is shared for viewing only.
              </Typography>
            )}

            {canEdit && (
              <Button variant="outlined" onClick={() => navigate(`/note-form/edit/${id}`)} sx={{ textTransform: "none" }}>
                Edit note
              </Button> */}
            {/* )} */}

            <Divider sx={{ mb: 2 }} />

            {/* Meta Data Grid (Assignee & Date) */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.2fr 2fr 1.5fr" }, gap:2}}>
              <Box>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <PersonIcon sx={{ color: "#5a206c" }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Assignee</Typography>
                    <Typography variant="body1" sx={{ fontWeight: "100" }}>{note.assignee || "Unassigned"}</Typography>
                  </Box>
                </Stack>
              </Box>
              
              <Box>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <CalendarTodayIcon sx={{ color: "#5a206c" }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Timeline</Typography>
                    <Typography variant="body1" sx={{ fontWeight: "100" }}>
                      {note.startDate || "N/A"} — {note.endDate || "N/A"}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              <Box sx={{display:"flex", justifyContent:{xs:"flex-start",md:"flex-end"}}}>
                <Stack direction="row" spacing={1} sx={{alignItems:"center"}}>
                <Button onClick={()=>handleEdit(note._id || note.id)} startIcon={<EditOutlinedIcon/>} sx={{ textTransform:"none", color:"black",fontSize:"14px",borderRadius:3,px:1.5,"& .MuiButton-startIcon": { color: "#973aa8" },
      "&:hover": { bgcolor: "#f5f5f5" },
}}>
                Edit
                </Button>
                <Button onClick={()=> handleDeleteClick} startIcon={<DeleteOutlinedIcon/>} sx={{ textTransform:"none", color:"black",fontSize:"14px",borderRadius:3,px:1.5,"& .MuiButton-startIcon": { color: "#973aa8" },
      "&:hover": { bgcolor: "#f5f5f5" },
}}>
                Delete
                </Button>
                </Stack>
              </Box>
            </Box>

          </CardContent>
        </Card>
      </Box>

      

      <Dialog
        open={openDeleteDialog}
        onClose={()=> handleDeleteClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        // PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
        slotProps={{
          paper:{
            sx:{borderRadius:3,p:1}
          }
        }}
      >
        <DialogTitle id="delete-dialog-title" sx={{ fontWeight: "bold" }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
             Are you sure you want to delete this note? Once deleted, it cannot be recovered.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={()=>handleDeleteClose} variant="outlined" sx={{ borderRadius: 2, textTransform: "none", color: "gray", borderColor: "gray" }}>
            Cancel
          </Button>
          <Button onClick={()=>handleConfirmDelete} variant="contained" color="error" autoFocus sx={{ borderRadius: 2, textTransform: "none" }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};