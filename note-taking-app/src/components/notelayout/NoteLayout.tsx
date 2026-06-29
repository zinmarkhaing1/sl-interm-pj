import { useState } from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  TextField, 
  Chip, 
  // Fab, 
  InputAdornment,
  Stack,
  // useTheme,
  Grid,
  Paper,
  Divider
} from "@mui/material";
// import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SearchIcon from "@mui/icons-material/Search";
// import AddIcon from "@mui/icons-material/Add";
import PushPinIcon from "@mui/icons-material/PushPin";
import LabelIcon from "@mui/icons-material/Label";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";
import { useGetNotesQuery } from "../../services/noteApi";

export const NoteLayout = () => {
  const navigate = useNavigate();
  const { data: notes = [], isLoading } = useGetNotesQuery();
  
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Categories 
  const categoriesList = ["All", "Family & Friends", "Fitness & Health", "Study", "My Note", "Company Note"];

  //   (Dashboard Stats)
  

  //  Data Filtering 
  const filteredNotes = notes.filter((note: any) => {
    const matchesSearch = 
      note.title?.toLowerCase().includes(search.toLowerCase()) ||
      note.description?.toLowerCase().includes(search.toLowerCase()) ||
      note.content?.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || note.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "#e74c3c";     
      case "Medium": return "#f39c12";   
      case "Low": return "#2ecc71";      
      default: return "#bdc3c7";
    }
  };

  if (isLoading) return <Typography sx={{ p: 4, textAlign: "center" }}>Loading Dashboard...</Typography>;

  return (
    <Box sx={{ backgroundColor:"#f4f6f8", minHeight: "100vh", width: "100%" }}>

        <Box sx={{ width: "100%" }}>
          
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 4, alignItems:"center" }} >
            <TextField
              size="small"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ 
                bgcolor: "white", 
                borderRadius: 2, 
                width: { xs: "100%", md: "350px" },
                "& .MuiOutlinedInput-root": { borderRadius: 2 }
              }}
            />

            {/* Category Scrolling Chips */}
            <Box sx={{ display: "flex", gap: 1, overflowX: "auto", width: "100%", pb: 1, "&::-webkit-scrollbar": { height: "4px" } }}>
              {categoriesList.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  clickable
                  color={selectedCategory === cat ? "primary" : "default"}
                  variant={selectedCategory === cat ? "filled" : "outlined"}
                  onClick={() => setSelectedCategory(cat)}
                  sx={{ 
                    bgcolor: selectedCategory === cat ? undefined : "white",
                    fontWeight: "500",
                    transition: "0.2s"
                  }}
                />
              ))}
            </Box>
            </Stack>
      

          {/* Notes Grid Content */}
          <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <PushPinIcon sx={{ color: "#7f8c8d", fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#34495e" }}>
              {selectedCategory === "All" ? "Recent Notes" : `${selectedCategory} Notes`} ({filteredNotes.length})
            </Typography>
          </Box>

          {filteredNotes.length === 0 ? (
            <Paper sx={{ p: 5, textAlign: "center", bgcolor: "rgba(255,255,255,0.6)", borderRadius: 3 }}>
              <Typography color="textSecondary">No notes available. Create a new note to get started!</Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filteredNotes.map((note: any, index: number) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={note._id ?? index}>
                  <Card 
                    sx={{ 
                      borderRadius: 3, 
                      boxShadow: "0px 6px 18px rgba(0,0,0,0.03)", 
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      position: "relative",
                      borderLeft: `6px solid ${getPriorityColor(note.priority)}`, // Priority အရောင်လိုင်း
                      transition: "0.3s",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0px 10px 20px rgba(0,0,0,0.08)"
                      }
                    }}
                    onClick={() => navigate(`/note-form`)} // create note form 
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#2c3e50", lineHeight: 1.3 }}>
                          {note.title}
                        </Typography>
                        {/* Status Chip (Todo, In Progress, etc.) */}
                        <Chip 
                          label={note.task || "Todo"} 
                          size="small" 
                          variant="outlined"
                          sx={{ fontSize: "11px", fontWeight: "bold" }} 
                        />
                      </Box>

                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: "#7f8c8d", 
                          mb: 2, 
                          display: "-webkit-box",
                          WebkitLineClamp: 3, 
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          minHeight: "60px"
                        }}
                      >
                        {note.description || note.content}
                      </Typography>

                      <Divider sx={{ my: 1.5, opacity: 0.5 }} />

                      <Stack direction="row" sx={{ justifyContent:"space-between",alignItems:"center"}}>
                        {/* Category Label */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#7f8c8d" }}>
                          <LabelIcon sx={{ fontSize: 16, color: "#95a5a6" }} />
                          <Typography variant="caption" sx={{ fontWeight: 500 }}>{note.category}</Typography>
                        </Box>
                        {/* Date info */}
                        {note.startDate && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#95a5a6" }}>
                            <AccessTimeIcon sx={{ fontSize: 14 }} />
                            <Typography variant="caption" sx={{ fontSize: "11px" }}>
                              {note.startDate.split(" ")[0]} 
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          
          </Box>
          </Box>
          );
          }




