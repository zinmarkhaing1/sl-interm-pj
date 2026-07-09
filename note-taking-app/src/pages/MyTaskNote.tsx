

import * as React from 'react';
import { Box, Button, Stack, Typography, IconButton, TextField, Menu, MenuItem, CircularProgress, } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, SwapVertOutlined } from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CheckIcon from '@mui/icons-material/Check';
import { useGetNotesQuery } from "../services/noteApi";
import type { Note } from "../types/Note"; 
import { TaskNotesStatus } from '../components/status-page/TaskNotesStatus';
import { AssigneeTaskNotes } from '../components/status-page/AssigneeTaskNotes';
import { SharedTaskPage } from '../components/status-page/SharedTaskPage';

export const MyTaskNote = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  
  const [searchOpen, setSearchOpen] = React.useState<boolean>(false);
  const [searchText, setSearchText] = React.useState<string>("");

  const getInitialView = () => {
    if (location.search.includes("view=shared")) return "shared" as const;
    if (localStorage.getItem("sharedNotesRequested") === "true") return "shared" as const;
    return "all" as const;
  };

  const [activeView, setActiveView] = React.useState<"all" | "assignee" | "shared">(getInitialView());

  React.useEffect(() => {
    if (location.search.includes("view=shared")) {
      setActiveView("shared");
      localStorage.setItem("sharedNotesRequested", "true");
    }
  }, [location.search]);

  // Filter states
  const [selectedStatus, setSelectedStatus] = React.useState<string>("All");
  const [selectedAssignee, setSelectedAssignee] = React.useState<string>("All");


  const { data: notes = [], isLoading, isError } = useGetNotesQuery(undefined); 

  // Dropdown States
  const [statusAnchor, setStatusAnchor] = React.useState<null | HTMLElement>(null);
  const [assigneeAnchor, setAssigneeAnchor] = React.useState<null | HTMLElement>(null);

  const uniqueAssignees = React.useMemo(() => {
    if (!Array.isArray(notes)) return ["All"];
    const assignees = notes
      .map((note: Note) => note.assignee?.trim())
      .filter((name): name is string => !!name);
    return ["All", ...Array.from(new Set(assignees))];
  }, [notes]);

  const uniqueStatuses = React.useMemo(() => {
    if (!Array.isArray(notes)) return ["All"];
    const statuses = notes
      .map((note: Note) => (note.task || note.category || "").trim())
      .filter((status): status is string => !!status);
    return ["All", ...Array.from(new Set(statuses))];
  }, [notes]);

  const filteredNotes = React.useMemo(() => {
    if (!Array.isArray(notes)) return [];

    return notes.filter((note: Note) => {

     if (activeView !== "assignee" && selectedStatus !== "All") {
        const currentStatus = (note.task || note.category || "").trim().toLowerCase();
        if (currentStatus !== selectedStatus.toLowerCase()) return false;
      }

      if (selectedAssignee !== "All") {
        const currentAssignee = (note.assignee || "").trim().toLowerCase();
        if (currentAssignee !== selectedAssignee.toLowerCase()) return false;
      }

      if (searchText && !note.title?.toLowerCase().includes(searchText.toLowerCase())) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      const titleA = (a.title || "").toLowerCase();
      const titleB = (b.title || "").toLowerCase();

      return sortOrder === "asc"
        ? titleA.localeCompare(titleB)
        : titleB.localeCompare(titleA);
    });
  }, [notes, selectedStatus, selectedAssignee, searchText, sortOrder]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 5 }}>
        Unable to load projects
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor:"background.default", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 54px' }}>
        
        {/* Title Section */}
        <Typography variant="h6" sx={{ fontSize:"16px", color: 'text.primary', mb: 3, letterSpacing: '-0.5px' }}>
          My Tasks
        </Typography>

        {/* Toolbar Controls */}
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", borderBottom: '1px solid #ededed', pb: 1, mb: 2 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Button
              startIcon={<TaskAltIcon sx={{ fontSize: '16px' }} />}
              onClick={() => 
                setActiveView("all")
             }
              sx={{
                textTransform: 'none',
                color: '#37352f',
                fontSize: '14px',
                bgcolor: '#f1f1ef',
                borderRadius: '6px',
                px: 1.5,
                py: 0.5,
                '&:hover': { bgcolor: '#e3e2e0' }
              }}
            >
              My Tasks
            </Button>
          </Stack>

          {/* Right Toolbar Actions */}
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <IconButton size="small" onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
              sx={{ color: sortOrder === 'desc' ? '#973aa8' : 'text.primary', 
                bgcolor: sortOrder === 'desc' ? 'background.default' : 'transparent',
                borderRadius: '4px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                '& .MuiSvgIcon-root': {
                  transition: 'transform 0.3s ease',
                  transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)', 
                },
                '&:hover': {
                  bgcolor: sortOrder === 'desc' ? '#e3f2fd' : '#f1f1ef'
                }}}>
              <SwapVertOutlined fontSize="small" />
            </IconButton>
            
            <IconButton size="small" sx={{ color: 'text.primary', mr: searchOpen ? 1 : 0, borderRadius: '4px' }} onClick={() => setSearchOpen((prev) => !prev)}>
              <Search fontSize="small" />
            </IconButton>

            {searchOpen && (
              <TextField
                size="small"
                autoFocus
                placeholder="Search tasks..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                sx={{
                  width: 160,
                  mr: 1,
                  '& .MuiOutlinedInput-root': {
                    height: 28,
                    fontSize: '13px',
                    borderRadius: '4px',
                    '& fieldset': { borderColor: '#ededed' },
                    '&:hover fieldset': { borderColor: '#dfdfdf' },
                    '&.Mui-focused fieldset': { borderColor: '#973aa8', borderWidth: '1px' },
                  },
                  '& .MuiOutlinedInput-input': { py: 0.5, px: 1 }
                }}
              />
            )}

          

            <Button 
              variant="contained" 
              disableElevation
              onClick={() => navigate("/note-form/create")} 
              sx={{ 
                backgroundColor: '#dec9e9', 
                textTransform: 'none', 
                fontWeight: 500,
                fontSize: '13px',
                padding: '4px 12px',
                borderRadius: '4px',
                '&:hover': { backgroundColor: '#973aa8', color: "#ffffff" },
                transition: '0.15s'
              }}
            >
              New task
            </Button>
          </Stack>
        </Stack>

        {/* Inline Sub-Filters */}
        <Stack direction="row" spacing={1.5} sx={{ mb: 4, alignItems: "center" }}>
          
          {/* Dynamic Status Dropdown Menu */}
          <Button
            endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14 }} />}
            onClick={(e) => setStatusAnchor(e.currentTarget)}
            sx={{ textTransform: 'none', color: selectedStatus !== 'All' ? '#973aa8' : 'text.primary', fontWeight: selectedStatus !== 'All' ? 600 : 400, fontSize: '14px', p: 0, '&:hover': { bgcolor: 'transparent' } }}
          >
            Status: {selectedStatus}
          </Button>
          <Menu anchorEl={statusAnchor} open={Boolean(statusAnchor)} onClose={() => setStatusAnchor(null)}>
            {uniqueStatuses.map((status) => (
              <MenuItem
                key={status}
                onClick={() => {
                  setSelectedStatus(status); 
                  setStatusAnchor(null);
                  setActiveView("all");
                }}
                sx={{ display: "flex", justifyContent: "space-between", gap: 2, fontSize: '14px' }}
              >
                {status} {selectedStatus.toLowerCase() === status.toLowerCase() && <CheckIcon sx={{ fontSize: 14, color: '#973aa8' }} />}
              </MenuItem>
            ))}
          </Menu>

          <Button
            endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14 }} />}
            onClick={(e) => setAssigneeAnchor(e.currentTarget)}
            sx={{ textTransform: 'none', color: selectedAssignee !== 'All' ? '#973aa8' : 'text.primary', fontWeight: selectedAssignee !== 'All' ? 600 : 400, fontSize: '14px', p: 0, '&:hover': { bgcolor: 'transparent' } }}
          >
            Assignee: {selectedAssignee}
          </Button>
          <Menu anchorEl={assigneeAnchor} open={Boolean(assigneeAnchor)} onClose={() => setAssigneeAnchor(null)}>
            {uniqueAssignees.map((name) => (
              <MenuItem 
                key={name} 
                onClick={() => {
                  setSelectedAssignee(name); 
                  setAssigneeAnchor(null);
                  setActiveView("assignee");
                }}
                sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, fontSize: '14px' }}
              >
                {name} {selectedAssignee.toLowerCase() === name.toLowerCase() && <CheckIcon sx={{ fontSize: 14, color: '#973aa8' }} />}
              </MenuItem>
            ))}
          </Menu>
         
                {/* Shared Button */}
<Button
  onClick={() => setActiveView(activeView === "shared" ? "all" : "shared")} 
  sx={{
    textTransform: "none",
    color: activeView === "shared" ? "#973aa8" : "text.primary",
    bgcolor: activeView === "shared" ? "background.default" : "transparent",
    gap: 0.5,
    px: 1,
    mr: 2,
    borderRadius: 2,
    border: "none",
    "&:hover": { bgcolor: "background.default" },
  }}
>
  <PeopleOutlinedIcon />
  Shared
</Button>

          {(selectedStatus !== "All" || selectedAssignee !== "All" || activeView === "shared") && (
            <Typography 
              onClick={() => { setSelectedStatus("All"); 
                setSelectedAssignee("All");
                setActiveView("all")
               }}
              sx={{ fontSize: '13px', color: 'text.primary', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              Clear filters
            </Typography>
          )}

  
          {/* {showSharedList && (
            <Box sx={{ mt: 2, mb: 2 }}>
              {collabLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={20} />
                </Box>
              ) : collaborators.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No collaborators yet.</Typography>
              ) : (
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                  {collaborators.map((c) => {
                    const email = c.invitedEmail || '';
                    const displayName = (c as any).fullName || (email.includes('@') ? email.split('@')[0] : email);
                    const initial = (displayName && displayName.charAt(0)) ? displayName.charAt(0).toUpperCase() : '';
                    return (
                      <Box key={c._id || email} sx={{ p: 1, border: '1px solid #eee', borderRadius: 2, minWidth: 200, display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Card>
                           <Avatar sx={{ width: 36, height: 36, bgcolor: '#e8f3ff', color: '#1a6cb3' }}>{initial}</Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{displayName}</Typography>
                          <Typography variant="caption" color="text.secondary">{email}</Typography>
                        </Box>
                        </Card>
                       
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </Box>
          )} */}
        </Stack>

     <Box sx={{ mt: 2 }}>
          {activeView === "all" && (
            <TaskNotesStatus filteredNotes={filteredNotes} />
          )}

          {activeView === "assignee" && (
            <AssigneeTaskNotes 
              selectedAssignee={selectedAssignee} 
              setSelectedAssignee={setSelectedAssignee} 
              uniqueAssignees={uniqueAssignees} 
              filteredNotes={filteredNotes}
            />
          )}

          {activeView === "shared" && (
            <SharedTaskPage/>
          )}
        </Box>
          </Box>

      </Box>
  
  );
};