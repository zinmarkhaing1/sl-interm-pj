import { Box, Card, CardContent, Typography, Button, Stack, Chip, Divider, TextField, Avatar } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useGetNotesQuery } from "../../services/noteApi";
import { useEffect, useState } from "react";
import { ArrowBackIosNewOutlined,CalendarToday ,Person } from "@mui/icons-material";

export const CommentPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: notes = [] } = useGetNotesQuery();
  const note = notes.find((n: any) => n._id === id);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Array<{ id: string; author: string; text: string; createdAt: string }>>([]);

  const accessPermission = (note as { accessPermission?: string } | undefined)?.accessPermission || "view";
  const canEdit = accessPermission === "edit" || accessPermission === "owner";
  const canComment = accessPermission === "comment" || canEdit;
  const canView = accessPermission === "view" || accessPermission === "comment" || canEdit;

  useEffect(() => {
    if (!id) return;
    const saved = localStorage.getItem(`note-comments-${id}`);
    if (saved) {
      try {
        setComments(JSON.parse(saved));
      } catch {
        setComments([]);
      }
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    localStorage.setItem(`note-comments-${id}`, JSON.stringify(comments));
  }, [comments, id]);

  const handleAddComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed || !canComment) return;

    const storedUser = localStorage.getItem("user");
    let authorName = "You";

    try {
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      authorName = parsedUser?.firstName || "You";
    } catch {
      authorName = "You";
    }

    setComments((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        author: authorName,
        text: trimmed,
        createdAt: new Date().toISOString(),
      },
    ]);
    setCommentText("");
  };

  if (!note) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">Note Not Found!</Typography>
        <Button startIcon={<ArrowBackIosNewOutlined />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  

  return (
    <Box sx={{ backgroundColor: "#f4f6f8", width: "100%", minHeight: "80vh", p: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        
      
        <Button 
          startIcon={<ArrowBackIosNewOutlined />} 
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
            <Stack direction={{ xs: "column", sm: "row" }}  spacing={2} sx={{ mb: 2 ,alignItems:{xs:"flex-start",sm:"center"},justifyContent:"space-between"}}>
                {!canView ? (
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
              </Button>
            )}

            <Divider sx={{ mb: 3 }} />

            {/* Meta Data Grid (Assignee & Date) */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
              <Box>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <Person sx={{ color: "#5a206c" }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">ASSIGNEE</Typography>
                    <Typography variant="body1" sx={{ fontWeight: "500" }}>{note.assignee || "Unassigned"}</Typography>
                  </Box>
                </Stack>
              </Box>
              
              <Box>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <CalendarToday sx={{ color: "#5a206c" }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">TIMELINE</Typography>
                    <Typography variant="body1" sx={{ fontWeight: "500" }}>
                      {note.startDate || "N/A"} — {note.endDate || "N/A"}
                    </Typography>
                  </Box>
                  </Stack>
                  </Box>
                  </Box>
                

                </Stack>
                </CardContent>
                </Card>
                </Box>
                </Box>

  )
}
