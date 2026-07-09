

import * as React from 'react';
import { useState } from 'react';
import {
  Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Typography, Button, Stack, useTheme, useMediaQuery,
  Dialog, DialogTitle, DialogContent, DialogActions,Popover
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

  const [deleteAnchorEl, setDeleteAnchorEl] = useState<HTMLButtonElement | null>(null);
const [selectedDeleteId, setSelectedDeleteId] = useState<any>(null);
const openDeletePopover = Boolean(deleteAnchorEl);
  
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

  // const handleDelete = async (id: any, e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   try {
  //     await deleteNote(id).unwrap();
  //   } catch (err: any) {
  //     console.log("Delete Failed:", err);
  //   }
  // };

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
    <Paper sx={{ width: '100%', minWidth: isMobile ? 300 : 400, p: 2 ,bgcolor:"background.default",color:"text.primary"}}>
    
      <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center", mb:  2,bgcolor:"backgroundColor.default",color:"text.primary" }}>
        <Button
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
        </Button>
        
        {/* Search Field */}
        <Box sx={{ display: "flex", alignItems: "center", ml: 1,color:"text.primary"}}>
          <IconButton size="small" sx={{ color: 'text.primary', mr: searchOpen ? 1 : 0, borderRadius: '4px' }} onClick={() => setSearchOpen((prev) => !prev)}>
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
                color:"text.primary",
                width: 180,
                '& .MuiOutlinedInput-root': { height: 30, fontSize: '0.85rem',  borderRadius: '4px' },
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
            sx={{ bgcolor: "#973aa8",color:"text.primary", "&:hover": { bgcolor: "#7b2e8a" }, textTransform: 'none' }}
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
                <IconButton sx={{color:"#973aa8"}} onClick={(e) => handleEdit(row._id, e)}><EditIcon /></IconButton>
                <IconButton color="error" onClick={(e) => handleDeleteClick(row._id, e)}><DeleteIcon /></IconButton>
              </Stack>
            </Paper>
          ))}
        </Stack>
      ) : (
        <TableContainer sx={{ overflowX: "auto", mt: 1}}>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#dec9e9', fontWeight: 'bold', color: "#2f004f",mx:0 }}>
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
                  <TableCell >{row.description ?? row.content}</TableCell>
                  <TableCell>{row.priority}</TableCell>
                  <TableCell>{row.assignee}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.task}</TableCell>
                  <TableCell>{row.startDate}</TableCell>
                  <TableCell>{row.endDate}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex" }}>
                      <IconButton sx={{ color:"text.primary"}} onClick={(e) => handleEdit(row._id, e)}><EditIcon /></IconButton>
                      <IconButton sx={{ color: "#720026" }} onClick={(e) => handleDeleteClick(row._id, e)}><DeleteIcon /></IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

    
     

      <Popover
        open={openDeletePopover}
        anchorEl={deleteAnchorEl}
        onClose={(e: any) => handleDeleteClose(e)}
        onClick={(e) => e.stopPropagation()} 
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: { p: 1.5, boxShadow: '0px 2px 10px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0', borderRadius: '8px' }
          }
        }}
      >
        <Typography sx={{ fontSize: '13px', fontWeight: 500, mb: 1, color: 'text.primary' }}>
          Delete this note?
        </Typography>
        <Stack direction="row" spacing={1}  sx={{justifyContent:"flex-end"}}>
          <Button size="small" onClick={handleDeleteClose} sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '11px' }}>
            Cancel
          </Button>
          <Button size="small" variant="contained" onClick={handleConfirmDelete} sx={{ textTransform: 'none', bgcolor: '#720026', fontSize: '11px', '&:hover': { bgcolor: '#50001a' } }}>
            Confirm
          </Button>
        </Stack>
      </Popover>

    
    </Paper>
  );
};
