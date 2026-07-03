// import * as React from 'react';
// import { useState } from 'react';
// import {Box,IconButton,Paper,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,TextField,Typography,Button,Stack,useTheme,useMediaQuery} from "@mui/material";
// import { Search } from '@mui/icons-material';
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
// import { useGetNotesQuery ,useDeleteNoteMutation  } from "../services/noteApi";
// import NoteAddIcon from "@mui/icons-material/NoteAdd"
// import { useNavigate } from 'react-router-dom';
// import type { Note } from '../types/Note';

// export const NoteFrom = () => {

//     const navigate = useNavigate();

//     const [searchOpen, setSearchOpen] = useState<boolean>(false);
//         const [searchText, setSearchText] = useState<string>("");

//         const { data: notes = [], isLoading,isError } = useGetNotesQuery();

       
        
//           const filteredNotes = React.useMemo<Note[]>(() => {
//                 if (!Array.isArray(notes)) return [];
            
//                 return notes.filter((note: Note) => {
//                   if (searchText.trim() !== "") {
//                     const titleText = (note.title || "").toLowerCase();
//                     const searchTarget = searchText.toLowerCase();
//                     if (!titleText.includes(searchTarget)) return false;
//                   }
          
//                   return true;
//                 })
                 
            
//               }, [ notes,  searchText]);
  
   

//     const handleCreate =():void =>{
      
//         navigate("/note-form/create")
//     }
  
//     const [deleteNote] = useDeleteNoteMutation();
//      const handleDelete = async (id:any,e: React.MouseEvent) => {
//       e.stopPropagation();
//     try {
//         await deleteNote(id).unwrap();
//     }catch(err:any){
//         console.log("Delete Failed:",err);
        
//     }
//   }

//   //   const filteredRows = notes.filter(
//   //   (row) =>
//   //     row.title?.toLowerCase().includes(search.toLowerCase()) ||
//   //     row.description?.toLowerCase().includes(search.toLowerCase()) ||
//   //     row.content?.toLowerCase().includes(search.toLowerCase())
//   // );
//   const handleEdit = (id: any, e: React.MouseEvent) => {
//     e.stopPropagation(); 
//     navigate(`/note-form/edit/${id}`);
//   } 

//   const handleRowClick = (id: any) => {
//     navigate(`/note-form/detail/${id}`); 
//   }

//   const theme = useTheme();
// const isMobile = useMediaQuery(theme.breakpoints.down("md"));


 

//   if (isLoading) return <Typography>Loading notes...</Typography>;
//   if (isError) return <Typography color="error">Failed to load notes.</Typography>;
 
//   if (isMobile) {
//   return (
    
//     <Box sx={{p:2}}>
//         <Stack spacing={2} direction="row" sx={{display:"flex",alignItems:"center",mb:2}}>
//         <Button
//     onClick={handleCreate}
//     startIcon={<NoteAddIcon />}
//     sx={{
//       ml: 2,
//       textTransform: "none",
//       color: "black",
//       fontSize: "18px",
//       fontWeight: "500",
//       borderRadius: 3,
//       px: 1.5,
//       "& .MuiButton-startIcon": { color: "#973aa8" },
//       "&:hover": { bgcolor: "#f5f5f5" },
//     }}
//   >
//     Create Note
//   </Button>
          
//             {/* <TextField  size='small' placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)}  slotProps={{input:{startAdornment: (<InputAdornment position="end"><SearchIcon/></InputAdornment>),},}}/> */}
//              <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
//              <IconButton size="small" sx={{ color: '#7c7b77', mr: searchOpen ? 1 : 0, borderRadius: '4px'}} onClick={() => setSearchOpen((prev) => !prev)}>
//                               <Search fontSize="small" />
//                             </IconButton>
//                             {searchOpen && (
//                               <TextField
//                                 size="small"
//                                 autoFocus
//                                 placeholder="Search text"
//                                 value={searchText}
//                                 onChange={(event) => setSearchText(event.target.value)}
//                                 sx={{
//                                   width: 180,
//                                   '& .MuiOutlinedInput-root': {
//                                     height: 30,
//                                     fontSize: '0.85rem',
//                                     backgroundColor: '#ffffff',
//                                     borderRadius: '4px',
//                                   },
//                                   '& .MuiOutlinedInput-input': {
//                                     py: 0.5,
//                                     px: 1,
//                                   },
//                                 }}
//                               />
//                             )}
//                             </Box>

//                             <Button
  
//     startIcon={<CloudDownloadOutlinedIcon/>}
//     sx={{
//       ml: 2,
//       textTransform: "none",
//       color: "black",
//       fontSize: "14px",
//       fontWeight: "500",
//       borderRadius: 3,
//       px: 1.3,
//       "& .MuiButton-startIcon": { color: "#973aa8" },
//       "&:hover": { bgcolor: "#f5f5f5" },
//     }}
//   >
//      Save File 
    
//   </Button>
            
            
//         </Stack>
//       <Stack spacing={2}>
//         {filteredNotes.map((row, index) => (
//           <Paper
//             key={row._id ?? index}
//             elevation={2}
//             sx={{
//               p: 2,
//               borderRadius: 3,
//               cursor:"pointer",
//             }}
//             onClick={()=>handleRowClick(row._id)}
//           >
//             <Typography variant="h6" >
//               {row.title}
//             </Typography>

//             <Typography sx={{mt:1}}>
//               {row.description ?? row.content}
//             </Typography>

//             <Stack direction="row" spacing={1} sx={{mt:2}}>
//               <Typography variant="body2">
//                 <b>Priority:</b> {row.priority}
//               </Typography>
//             </Stack>

//             <Stack direction="row" spacing={1}>
//               <Typography variant="body2">
//                 <b>Assignee:</b> {row.assignee}
//               </Typography>
//             </Stack>

//             <Stack direction="row" spacing={1}>
//               <Typography variant="body2">
//                 <b>Category:</b> {row.category}
//               </Typography>
//             </Stack>

//             <Stack direction="row" spacing={1}>
//               <Typography variant="body2">
//                 <b>Status:</b> {row.task}
//               </Typography>
//             </Stack>

//             <Typography  variant="body2" sx={{mt:1}}>
//               {row.startDate} - {row.endDate}
//             </Typography>

//             <Stack
//               direction="row"
//               spacing={1}
//             //   justifyContent="flex-end"
//             //   mt={2}
//             sx={{justifyContent:"flex-end", mt:2}}
//             >
//               <IconButton
//                 color="success"
//                 onClick={(e) => handleEdit(row._id,e)}
//               >
//                 <EditIcon />
//               </IconButton>

//               <IconButton
//                 color="error"
//                 onClick={(e) => handleDelete(row._id,e)}
//               >
//                 <DeleteIcon />
//               </IconButton>
//             </Stack>
//           </Paper>
//         ))}
//       </Stack>
//     </Box>
//   );
// }
  
//   return (
//     <Paper sx={{width:'100%',minWidth:400,p:2}}>
//         {/* <Box sx={{display:'flex',justifyContent:"center",mb:2,alignItems:'center'}}>
//             <Typography variant='h5'  sx={{display:'flex',mr:5,fontWeight:'bold'}}>Note Form </Typography>
//         </Box> */}
//         <Stack spacing={1} direction="row" sx={{display:"flex",alignItems:"center",mb:2}}>
//         <Button
//     onClick={handleCreate}
//     startIcon={<NoteAddIcon />}
//     sx={{
//       ml: 2,
//       textTransform: "none",
//       color: "black",
//       fontSize: "18px",
//       fontWeight: "500",
//       borderRadius: 3,
//       px: 1.5,
//       "& .MuiButton-startIcon": { color: "#973aa8" },
//       "&:hover": { bgcolor: "#f5f5f5" },
//     }}
//   >
//     Create Note
//   </Button>
//             {/* <TextField size='small' placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)}  slotProps={{input:{startAdornment: (<InputAdornment position="end"><SearchIcon/></InputAdornment>),},}}/> */}


//             <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
//              <IconButton size="small" sx={{ color: '#7c7b77', mr: searchOpen ? 1 : 0, borderRadius: '4px',}} onClick={() => setSearchOpen((prev) => !prev)}>
//                               <Search fontSize="small" />
//                             </IconButton>
//                             {searchOpen && (
//                               <TextField
//                                 size="small"
//                                 autoFocus
//                                 placeholder="Search text"
//                                 value={searchText}
//                                 onChange={(event) => setSearchText(event.target.value)}
//                                 sx={{
//                                   width: 180,
//                                   '& .MuiOutlinedInput-root': {
//                                     height: 30,
//                                     fontSize: '0.85rem',
//                                     backgroundColor: '#ffffff',
//                                     borderRadius: '4px',
//                                   },
//                                   '& .MuiOutlinedInput-input': {
//                                     py:0.5,
//                                     px: 1,
//                                   },
//                                 }}
//                               />
//                             )}
//                       </Box>

//   <Button
  
//     startIcon={<CloudDownloadOutlinedIcon/>}
//     sx={{
//       ml: 2,
//       textTransform: "none",
//       color: "black",
//       fontSize: "14px",
//       fontWeight: "500",
//       borderRadius: 3,
//       px: 1.3,
//       "& .MuiButton-startIcon": { color: "#973aa8" },
//       "&:hover": { bgcolor: "#f5f5f5" },
//     }}
//   >
//      Save File 
    
//   </Button>
           
//         </Stack>

//         <TableContainer 
//          sx={{overflowX:"auto",mt:2}}>
//             <Table sx={{minWidth:{xs:900,sm:1000,md:1100}}}>
//                 <TableHead >
//                     <TableRow sx={{bgcolor:'#dec9e9',fontWeight:'bold',color:"#2f004f"}}>
//                         <TableCell>ID</TableCell>
//                         <TableCell>Title</TableCell>
//                         <TableCell>Description</TableCell>
//                         <TableCell>Priority</TableCell>
//                         <TableCell>Assignee</TableCell>
//                         <TableCell>Category</TableCell>
//                         <TableCell>Status</TableCell>
//                         <TableCell>Start Date</TableCell>
//                         <TableCell>End Date</TableCell>
//                         <TableCell>Action</TableCell>

//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {filteredNotes.map((row, index)=>(
//                          <TableRow key={row._id ?? row.id ?? index} 
//                         onClick={() => handleRowClick(row._id)} 
//                         sx={{ cursor: 'pointer'}}>
//                         <TableCell>{row.id ?? index + 1}</TableCell>
//                         <TableCell>{row.title}</TableCell>
//                         <TableCell>{row.description ?? row.content}</TableCell>
//                         <TableCell>{row.priority}</TableCell>
//                         <TableCell>{row.assignee}</TableCell>
//                         <TableCell>{row.category}</TableCell>
//                         <TableCell>{row.task}</TableCell>
//                         <TableCell>{row.startDate}</TableCell>
//                         <TableCell>{row.endDate}</TableCell>
//                         <TableCell> <Box sx={{display:"flex", }}><IconButton sx={{fontWeight:'12px',color:"#5a206c"}}  onClick={(e)=>handleEdit(row._id,e)}><EditIcon/></IconButton>
//                         <IconButton sx={{color:"#720026"}} onClick={(e) => handleDelete(row._id, e)}><DeleteIcon/></IconButton>
//                         </Box></TableCell>


//                     </TableRow>
//                     ))}
                   
//                 </TableBody>
//             </Table>
//         </TableContainer>
//     </Paper>
//   )
// }


import * as React from 'react';
import { useState } from 'react';
import {
  Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Typography, Button, Stack, useTheme, useMediaQuery,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { Search } from '@mui/icons-material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { useNavigate } from 'react-router-dom';
import { useGetNotesQuery, useDeleteNoteMutation } from "../services/noteApi";
import type { Note } from '../types/Note';

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
  
  // Dialog (Pop-up) Control States
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [exportStartDate, setExportStartDate] = useState<string>("");
  const [exportEndDate, setExportEndDate] = useState<string>("");

  const { data: notes = [], isLoading, isError } = useGetNotesQuery();
  const [deleteNote] = useDeleteNoteMutation();

 
  const filteredNotes = React.useMemo<Note[]>(() => {
    if (!Array.isArray(notes)) return [];
    return notes.filter((note: Note) => {
      if (searchText.trim() !== "") {
        const titleText = (note.title || "").toLowerCase();
        const searchTarget = searchText.toLowerCase();
        if (!titleText.includes(searchTarget)) return false;
      }
      return true;
    });
  }, [notes, searchText]);

  
  const handleCreate = (): void => {
    navigate("/note-form/create");
  };

  const handleDelete = async (id: any, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteNote(id).unwrap();
    } catch (err: any) {
      console.log("Delete Failed:", err);
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
      const doc = new jsPDF() ;
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

      autoTable(doc,{
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


  if (isLoading) return <Typography>Loading notes...</Typography>;
  if (isError) return <Typography color="error">Failed to load notes.</Typography>;

  return (
    <Paper sx={{ width: '100%', minWidth: isMobile ? 300 : 400, p: 2 }}>
    
      <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Button
          onClick={handleCreate}
          startIcon={<NoteAddIcon />}
          sx={{
            textTransform: "none",
            color: "black",
            fontSize: "18px",
            fontWeight: "500",
            borderRadius: 3,
            px: 1.5,
            whiteSpace: 'nowrap',
            "& .MuiButton-startIcon": { color: "#973aa8" },
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
        >
          Create Note
        </Button>
        
        {/* Search Field */}
        <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
          <IconButton size="small" sx={{ color: '#7c7b77', mr: searchOpen ? 1 : 0, borderRadius: '4px' }} onClick={() => setSearchOpen((prev) => !prev)}>
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
                '& .MuiOutlinedInput-root': { height: 30, fontSize: '0.85rem', backgroundColor: '#ffffff', borderRadius: '4px' },
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
            color: "black",
            fontSize: "14px",
            fontWeight: "500",
            borderRadius: 3,
            px: 1.3,
            whiteSpace: 'nowrap',
            "& .MuiButton-startIcon": { color: "#973aa8" },
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
        >
          Download File
        </Button>
      </Stack>

      {/* --- Date Picker Dialog (Pop-up Box) --- */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Select the dates for PDF export</DialogTitle>
        <DialogContent sx={{ minWidth: 300, pt: 2 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="From Date "
              type="date"
              fullWidth
              value={exportStartDate}
              onChange={(e) => setExportStartDate(e.target.value)}
               slotProps={{
    inputLabel: {
      shrink: true,
    },
  }}
            />
            <TextField
              label="To Date "
              type="date"
              fullWidth
              value={exportEndDate}
              onChange={(e) => setExportEndDate(e.target.value)}
               slotProps={{
    inputLabel: {
      shrink: true,
    },
  }}
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
            sx={{ bgcolor: "#973aa8",color:"white", "&:hover": { bgcolor: "#7b2e8a" }, textTransform: 'none' }}
          >
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>

  
      {isMobile ? (
        <Stack spacing={2}>
          {filteredNotes.map((row, index) => (
            <Paper key={row._id ?? index} elevation={2} sx={{ p: 2, borderRadius: 3, cursor: "pointer" }} onClick={() => handleRowClick(row._id)}>
              <Typography variant="h6">{row.title}</Typography>
              <Typography sx={{ mt: 1 }}>{row.description ?? row.content}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}><b>Priority:</b> {row.priority}</Typography>
              <Typography variant="body2"><b>Assignee:</b> {row.assignee}</Typography>
              <Typography variant="body2"><b>Category:</b> {row.category}</Typography>
              <Typography variant="body2"><b>Status:</b> {row.task}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>{row.startDate} - {row.endDate}</Typography>
              <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", mt: 2 }}>
                <IconButton color="success" onClick={(e) => handleEdit(row._id, e)}><EditIcon /></IconButton>
                <IconButton color="error" onClick={(e) => handleDelete(row._id, e)}><DeleteIcon /></IconButton>
              </Stack>
            </Paper>
          ))}
        </Stack>
      ) : (
        <TableContainer sx={{ overflowX: "auto", mt: 2 }}>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#dec9e9', fontWeight: 'bold', color: "#2f004f" }}>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
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
                <TableRow key={row._id ?? row.id ?? index} onClick={() => handleRowClick(row._id)} sx={{ cursor: 'pointer' }}>
                  <TableCell>{row.id ?? index + 1}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.description ?? row.content}</TableCell>
                  <TableCell>{row.priority}</TableCell>
                  <TableCell>{row.assignee}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.task}</TableCell>
                  <TableCell>{row.startDate}</TableCell>
                  <TableCell>{row.endDate}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex" }}>
                      <IconButton sx={{ color: "#5a206c" }} onClick={(e) => handleEdit(row._id, e)}><EditIcon /></IconButton>
                      <IconButton sx={{ color: "#720026" }} onClick={(e) => handleDelete(row._id, e)}><DeleteIcon /></IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};
