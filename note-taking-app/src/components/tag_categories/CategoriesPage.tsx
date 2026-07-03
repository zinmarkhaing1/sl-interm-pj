import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Link
} from "@mui/material";

import { useGetNotesQuery } from "../../services/noteApi";
import {  useNavigate } from "react-router-dom";
type CategoryConfig = {
  id: string;
  label: string;
  color: string;
};

const COLUMNS: CategoryConfig[] = [
  { id: "Family & Friends", label: "Family & Friends", color: "#abde89" },
  { id: "Fitness & Health", label: "Fitness & Health", color: "#f6d7cb" },
  { id: "Study", label: "Study", color: "#ebf8dd" },
  { id: "My Note", label: "My Note", color: "#c8efaf" },
  { id: "Company Note", label: "Company Note", color: "#89aa8f" },
];

export const CategoriesPage = () => {
  const navigate = useNavigate();
  const { data: notes = [], isLoading } = useGetNotesQuery();
  const getNotesByCategory = (category: string) => {
    return notes.filter((note: any) => note.category === category);
  };
  if (isLoading) return <p>Loading...</p>;

  const handleRowClick = (id: any) => {
    navigate(`/note-form/detail/${id}`); 
  }
  return (
    <Box
      sx={{
        backgroundColor: "#f4f6f8",
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
      }}
    >
      {/* <Typography
      variant='h6'
      sx={{
        fontWeight: 'bold',
        mb: 3,
        textAlign: "center",
        fontSize: { xs: "1.5rem", sm: "1.75rem" },
      }}
    >
      Categories
    </Typography> */}
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {COLUMNS.map((column) => {
          const item = column.id;
          const color = column.color;

          return (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={item}>
              <Card
                sx={{
                  borderRadius: 3,
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: 3,
                  cursor: "pointer",
                  transition: "0.3s",
                  height: "100%",
                  borderLeft: `5px solid ${color}`,
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "18px", color: color }}
                  >
                    {column.label}
                  </Typography>
                  {getNotesByCategory(item).map((note: any) => (
                    <Box
                      key={note._id}
                      sx={{
                        mt: 1,
                        p: 1,
                        bgcolor: "#f4f6f8",
                        borderRadius: 2,
                        border: `1px solid ${color}`,
                        cursor:'pointer',
                        transition:"0.2s",
                        "&:hover": { 
                          transform: "translateY(-2px)", 
                          boxShadow: 1 
                        },
                      }}
                    >
                      <Typography sx={{ fontSize: "16px", color: "#2F004F" }}>
                        {note.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {note.content}
                      </Typography>

                       <Link
                    component="button"
                    variant="body2"
                    underline="always"
                    sx={{mt:2,color:"#973aa8", fontSize:"16px" , }}
                    
                    onClick={(e)=> {e.stopPropagation();
                      handleRowClick(note._id);
                    }}
                    
                  >
                    Open notes
                  </Link>
                    </Box>
                  ))}
                  {/* <Box></Box> */}
                 
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
