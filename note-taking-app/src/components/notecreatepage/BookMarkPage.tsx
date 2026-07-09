// import { useState } from "react";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   CardActionArea,
//   Grid,
//   TextField,
//   Button,
//   Stack,
//   IconButton,
// } from "@mui/material";

// import { DeleteOutlineOutlined } from "@mui/icons-material";

// interface Bookmark {
//   title: string;
//   url: string;
// }

// interface BookMarkPageProps {
//   description: string;
//   setText: (value: string) => void;
// }

// export function BookMarkPage({
//   description,
//   setText,
// }: BookMarkPageProps) {
//   const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
//     try {
//       return description
//         ? JSON.parse(description)
//         : [
//             {
//               title: "Google",
//               url: "https://google.com",
//             },
//             {
//               title: "React Documentation",
//               url: "https://react.dev",
//             },
//           ];
//     } catch {
//       return [];
//     }
//   });

//   const [title, setTitle] = useState("");
//   const [url, setUrl] = useState("");

//   const updateBookmarks = (newBookmarks: Bookmark[]) => {
//     setBookmarks(newBookmarks);
//     setText(JSON.stringify(newBookmarks));
//   };

//   const handleAdd = () => {
//     if (!title.trim() || !url.trim()) return;

//     let formattedUrl = url.trim();

//     if (
//       !formattedUrl.startsWith("http://") &&
//       !formattedUrl.startsWith("https://")
//     ) {
//       formattedUrl = "https://" + formattedUrl;
//     }

//     updateBookmarks([
//       ...bookmarks,
//       {
//         title: title.trim(),
//         url: formattedUrl,
//       },
//     ]);

//     setTitle("");
//     setUrl("");
//   };

//   const handleDelete = (index: number) => {
//     updateBookmarks(bookmarks.filter((_, i) => i !== index));
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography
//         variant="h5"
//       sx={{mb:3}}
      
//       >
//         Bookmark Manager
//       </Typography>

//       <Stack
//         spacing={2}
//         direction={{
//           xs: "column",
//           md: "row",
//         }}
//         sx={{mb:4}}
        
//       >
//         <TextField
//           label="Website Title"
//           fullWidth
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />

//         <TextField
//           label="Website URL"
//           fullWidth
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//           placeholder="https://example.com"
//         />

//         <Button
//           variant="contained"
//           onClick={handleAdd}
//           sx={{
//             minWidth: 140,
//           }}
//         >
//           Add
//         </Button>
//       </Stack>

//       <Grid container spacing={2}>
//         {bookmarks.map((bookmark, index) => (
//           <Grid
//             key={index}
//             size={{
//               xs: 12,
//               sm: 6,
//               md: 4,
//             }}
//           >
//             <Card
//               sx={{
//                 borderRadius: 3,
//                 transition: "0.25s",
//                 "&:hover": {
//                   transform: "translateY(-3px)",
//                   boxShadow: 4,
//                 },
//               }}
//             >
//               <CardActionArea
//                 href={bookmark.url}
//                 target="_blank"
//               >
//                 <CardContent>
//                   <Typography
//                     variant="h6"
//                     noWrap
                  
//                   >
//                     {bookmark.title}
//                   </Typography>

//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     noWrap
//                   >
//                     {bookmark.url}
//                   </Typography>
//                 </CardContent>
//               </CardActionArea>

//               <Box
//                 sx={{display:"flex",justifyContent:'flex-end',px:1,pb:1}}
//               >
//                 <IconButton
//                   color="error"
//                   onClick={() => handleDelete(index)}
//                 >
//                   <DeleteOutlineOutlined />
//                 </IconButton>
//               </Box>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// }

import { useState, useMemo } from "react";
import {
  Box,
  Typography,
   Grid,
  TextField,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { DeleteOutlined } from "@mui/icons-material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CheckIcon from "@mui/icons-material/Check";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";


interface Bookmark {
  url: string;
  title?: string;
  tags: string[];
  comment?: string;
}

interface BookMarkPageProps {
  description: string;
  setText: (value: string) => void;
}

export function BookMarkPage({ description, setText }: BookMarkPageProps) {
  // ရရှိလာသော JSON ကို Parse လုပ်ပြီး Bookmark Lists ထုတ်ယူခြင်း
  const bookmarks = useMemo<Bookmark[]>(() => {
    try {
      return description ? JSON.parse(description) : [];
    } catch {
      return [];
    }
  }, [description]);


  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [comment, setComment] = useState("");


  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    bookmarks.forEach((b) => b.tags.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [bookmarks]);

//to show filterdata
  const filteredBookmarks = useMemo(() => {
    if (!selectedTag) return bookmarks;
    return bookmarks.filter((b) => b.tags.includes(selectedTag));
  }, [bookmarks, selectedTag]);

  const updateBookmarks = (newBookmarks: Bookmark[]) => {
    setText(JSON.stringify(newBookmarks));
  };

//to store data 
  const handleAdd = () => {
    if (!url.trim()) return;

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl;
    }

//split comma, storearray
    const processedTags = tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t !== "");

    const newBookmark: Bookmark = {
      url: formattedUrl,
      title: title.trim() || "note-taking", // default fallback Title as seen in screenshot
      tags: processedTags,
      comment: comment.trim(),
    };

    updateBookmarks([...bookmarks, newBookmark]);

    setUrl("");
    setTitle("");
    setTagsInput("");
    setComment("");
  };

  const handleDelete = (indexToDelete: number) => {
    updateBookmarks(bookmarks.filter((_, index) => index !== indexToDelete));
  };

  return (
    <Box 
      sx={{ 
        p: 3, 
        maxWidth: 900, 
        mx: 'auto',
        fontFamily: 'sans-serif',
        bgcolor:"background.default",
        color:'text.primary'
       
      }}
    >
    {/* filter by tag area  */}
      {allTags.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
            Filter by Tags
          </Typography>
          {allTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              sx={{
                backgroundColor: selectedTag === tag ? 'background.default' : '#e8eaed',
                color: selectedTag === tag ? 'text.primary' : '#3c4043',
                borderRadius: '4px',
                fontSize: '12px',
                '&:hover': {
                  backgroundColor: selectedTag === tag ? 'background.default' : 'transparent',
                }
              }}
            />
          ))}
        </Box>
      )}

     {/* bookmark list  */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', p: 3, mb: 2, bgcolor:'background.default' }}>
        {filteredBookmarks.map((bookmark, index) => (
          <Box key={index} sx={{ mb: index !== filteredBookmarks.length - 1 ? 3 : 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              
          
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#973aa8' }}>
                  <BookmarkBorderIcon sx={{ fontSize: 18 }} />
                  <Typography 
                    component="a" 
                    href={bookmark.url}
                    target="_blank"
                    sx={{ 
                      fontWeight: 500, 
                      textDecoration: 'none', 
                      bgcolor:'background.default',
                      color: 'text.primary',
                      '&:hover': { textDecoration: 'underline' } 
                    }}
                  >
                    {bookmark.title}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ bgcolor:'background.default',color: 'text.primary' }}>
                  {bookmark.url}
                </Typography>
              </Box>

      
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, flexGrow: 1, px: 2 ,}}>
                {bookmark.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{ 
                      // backgroundColor: '#e8eaed', 
                      bgcolor:'background.default',
                      color: 'text.primary', 
                      borderRadius: '4px',
                      height: '20px',
                      fontSize: '11px'
                    }}
                  />
                ))}
                {bookmark.comment && (
                  <Typography variant="body2" sx={{ color: 'text.primary', mt: 0.5 }}>
                    {bookmark.comment}
                  </Typography>
                )}
              </Box>

              
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton size="small" sx={{ color: 'text.primary' }}>
                  <EditNoteIcon sx={{ fontSize: 22 }} />
                </IconButton>
                <IconButton size="small" sx={{ color: 'text.primary' }} onClick={() => handleDelete(index)}>
                  <DeleteOutlined sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>

            </Box>
            {index !== filteredBookmarks.length - 1 && <Divider sx={{ mt: 2, borderColor: '#f1f3f4' }} />}
          </Box>
        ))}
      </Box>

      <Box 
        sx={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          p: 2, 
          // backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          bgcolor:'background.default',
        }}
      >
        <Grid container spacing={1.5} sx={{ flexGrow: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              placeholder="URL"
              fullWidth
              size="small"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              slotProps={{ input: { style: { backgroundColor: 'background.default' } } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              placeholder="Tags (comma separated, optional)"
              fullWidth
              size="small"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              slotProps={{ input: { style: { backgroundColor: 'background.default' } } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              placeholder="Title (optional)"
              fullWidth
              size="small"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              slotProps={{ input: { style: { backgroundColor: 'background.default' } } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              placeholder="Comment (optional)"
              fullWidth
              size="small"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              slotProps={{ input: { style: { backgroundColor: 'background.default' } } }}
            />
          </Grid>
        </Grid>

       
        <IconButton 
          onClick={handleAdd}
          sx={{ 
            color: 'text.primary',
            backgroundColor: 'transparent',
            '&:hover': { backgroundColor: 'background.default' }
          }}
        >
          <CheckIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </Box>
    </Box>
  );
}