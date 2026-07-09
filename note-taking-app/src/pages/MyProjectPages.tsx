import React,{ useState } from 'react';
import { Box, Button, Stack, Typography, IconButton, TextField, Tabs, Tab ,Menu,MenuItem,CircularProgress} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SwapVertOutlined, Search } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { BoardStatus } from '../components/myproject/BoardStatus';
import { AllProject } from '../components/myproject/AllProject';
import { GranttView } from '../components/myproject/GranttView';
import { MyProject } from '../components/myproject/MyProject';
import { useGetNotesQuery } from "../services/noteApi";
import type { Note } from "../types/Note";

export const MyProjectPages = () => {
 const navigate = useNavigate();
  
      const [currentTab, setCurrentTab] = useState<number>(0);
      const [searchOpen, setSearchOpen] = useState<boolean>(false);
      const [searchText, setSearchText] = useState<string>("");
        const { data: notes = [], isLoading, isError } = useGetNotesQuery(undefined); 
       

        const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");

      const [selectedStatus,setSelectedStatus] = useState<string>("All");

      const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);


  const handleTabClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

   const filteredNotes = React.useMemo<Note[]>(() => {
      if (!Array.isArray(notes)) return [];
  
      return notes.filter((note: Note) => {
      
        if (selectedStatus !== "All") {
          const currentStatus = (note.task || note.category || "").trim().toLowerCase();
          if (currentStatus !== selectedStatus.toLowerCase()) return false;
        }
        if (searchText.trim() !== "") {
          const titleText = (note.title || "").toLowerCase();
          const searchTarget = searchText.toLowerCase();
          if (!titleText.includes(searchTarget)) return false;
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
  
    }, [ notes,selectedStatus,  searchText,sortOrder]);

 
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

 
  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setCurrentTab(0); 
    handleMenuClose();
  };


  if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      );
    }
  
    if (isError) {
      return (
        <Typography color="error" sx={{ textAlign: 'center', mt: 5 }}>
          Unable to load projects.
        </Typography>
      );
    }
  return (
  <Box>
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',bgcolor:"background.defalut",color:"text.primary"}}>
      
      {/* Header Section */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="h3" sx={{ fontWeight: 500, color: 'text.primary', mb: 1, fontSize: '18px' }}>
         Projects 
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.primary', fontSize: '16px' }}>
          Stay organized with projects, your way.
        </Typography>
      </Box>

      {/* Navigation Toolbar */}
      <Stack direction="row"  sx={{justifyContent:"space-between",alignItems:"center", mt: 3, mb: 2, borderBottom: '1px solid #ededed', pb: 0.5 }}>
        <Tabs 
          value={currentTab} 
          onChange={(_, newValue) => 
          {
            if (newValue !== 0) {
                setCurrentTab(newValue);
              }
          }
          }
          sx={{
            minHeight: 'auto',
            '& .MuiTabs-indicator': { bgcolor:'background.default', height: '2px' },
            '& .MuiTab-root': { 
              textTransform: 'none', 
              fontWeight: 500, 
              fontSize: '0.9rem', 
              minWidth: 'auto', 
              padding: '6px 12px',
              color: 'text.primary',
              '&.Mui-selected': { color: 'text.primary' }
            }
          }}
        >
          <Tab label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, }}>
                  By Status ({selectedStatus})
                  <ArrowDropDownIcon sx={{ fontSize: 18 }} />
                </Box>
              }
              onClick={handleTabClick}/>
          <Tab label="All Projects"  />
          <Tab label="Grant "  />
          <Tab label = "My Projects" />

        </Tabs>

        <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            disableScrollLock 
            slotProps={{
    paper: {
      sx: {
        mt: 1,
        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        borderRadius: "8px",
        minWidth: 140,
      },
    },
  }}
          >
            <MenuItem onClick={() => handleStatusSelect("All")} selected={selectedStatus === "All"}>All Status</MenuItem>
            <MenuItem onClick={() => handleStatusSelect("Todo")} selected={selectedStatus === "Todo"}>Todo</MenuItem>
            <MenuItem onClick={() => handleStatusSelect("In Progress")} selected={selectedStatus === "In Progress"}>In Progress</MenuItem>
            <MenuItem onClick={() => handleStatusSelect("Complete")} selected={selectedStatus === "Complete"}>Complete</MenuItem>
            <MenuItem onClick={() => handleStatusSelect("Not Started")} selected={selectedStatus === "Not Started"}>Done</MenuItem>
          </Menu>

        {/* Right side controls */}
        <Stack direction="row" spacing={1} sx={{alignItems:"center",}}>

         
          <IconButton size="small" onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
           sx={{ color: sortOrder === 'desc' ? 'text.primary' : '#text.primary', 
                          bgcolor: sortOrder === 'desc' ? 'background.default' : 'transparent',
                          borderRadius: '4px',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                          '& .MuiSvgIcon-root': {
                            transition: 'transform 0.3s ease',
                            transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)', 
                          },
                          '&:hover': {
                            bgcolor: sortOrder === 'desc' ? 'background.default' : 'background.paper'
                          }}}><SwapVertOutlined fontSize="small" /></IconButton>

          <IconButton size="small" sx={{ color: 'text.primary' }} onClick={() => setSearchOpen((prev) => !prev)}>
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
                '& .MuiOutlinedInput-root': {
                  height: 30,
                  fontSize: '0.85rem',
                  bgcolor:'background.default',
                  borderRadius: '4px',
                },
                '& .MuiOutlinedInput-input': {
                  py: 0.5,
                  px: 1,
                },
              }}
            />
          )}
          
          <Button 
            variant="contained" 
            disableElevation
            sx={{ 
              backgroundColor: '#dec9e9', 
              textTransform: 'none', 
              fontWeight: 500,
              fontSize: '0.85rem',
              padding: '4px 12px',
              borderRadius: '4px',
              '&:hover': { backgroundColor: '#973aa8',color:"white" }
            }}
          onClick={() => navigate('/my-project/new-project')} 
          >
            New
            
              <KeyboardArrowDownIcon sx={{ fontSize:12,m:0.2}}/>
           
            
          </Button>
          </Stack>
          </Stack>
          {currentTab === 0 && <BoardStatus  statusFilter={selectedStatus}   filteredNotes={filteredNotes} />}

        {currentTab === 1 && <AllProject filteredNotes={filteredNotes}/>
          // <Box sx={{ py: 5 }}>
          //   <Typography variant="h6">
          //     By Status Page
          //   </Typography>
          // </Box>
          
        }
        {currentTab ===2 && <GranttView filteredNotes={filteredNotes}/>}
        {currentTab ===3 && <MyProject  filteredNotes={filteredNotes}/>}
          </Box>
  </Box>
  )
}


