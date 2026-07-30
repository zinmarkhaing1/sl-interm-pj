

import * as React from 'react';
import { 
  Box, Typography, Stack, CircularProgress, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper, Button, Tooltip, IconButton 
} from "@mui/material";
import { PeopleAltOutlined, ContentCopyOutlined } from '@mui/icons-material';
import { useEffect } from 'react';
import { useGetUsersQuery } from '../../services/authApi';

interface CollaboratorItem {
  _id?: string;
  invitedEmail: string;
  status: string;
  role: string;
  pageUrl?: string;
}


const getEmailFromToken = (token: string): string | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload).email; // သင့် Token Payload ထဲက Email Key အတိုင်း ပြင်ပေးရန်
  } catch (e) {
    return null;
  }
};

export const SharedTaskPage = () => {
  const [collaborators, setCollaborators] = React.useState<CollaboratorItem[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isError, setIsError] = React.useState<boolean>(false);

  const { data:users = [] } = useGetUsersQuery();

 

  useEffect(() => {
  const loadCollaboratorsData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

   
    const currentUserEmail = localStorage.getItem("userEmail") || localStorage.getItem("email"); 

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/share/collaborators", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        // const allCollaborators = data.collaborators || [];
        
const allCollaborators: CollaboratorItem[] = data.collaborators || [];
// const currentUserEmail = localStorage.getItem("userEmail") || localStorage.getItem("email") || "";
// const currentUserEmail = users.email
const currentUserEmail = "";

const filteredCollaborators = allCollaborators.filter(
  (item) => item.invitedEmail?.trim().toLowerCase() !== currentUserEmail.trim().toLowerCase()
);
        
        
       

        setCollaborators(filteredCollaborators);
        setIsError(false);
      } else {
        setIsError(true);
      }
    } catch (err) {
      setIsError(true);
      setCollaborators([]);
    } finally {
      setIsLoading(false);
    }
  };

  loadCollaboratorsData();
}, []);

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("Page URL copied to clipboard!");
  };

  const getRoleLabel = (role: string) => {
    if (role === "full") return "Full access";
    if (role === "editor") return "Can edit";
    if (role === "commenter") return "Can comment";
    return "Can view";
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" sx={{ textAlign: 'center', mt: 5, fontWeight: 500 }}>
        Unable to load invited users. Please try again.
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: 'background.default' }}>
      <Box sx={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 54px' }}>
        
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 4 }}>
          <PeopleAltOutlined sx={{ color: '#37352f', fontSize: '20px' }} />
          <Typography variant="h5" sx={{ fontSize: "18px", color: '#37352f', fontWeight: 600 }}>
            Invited Users & Collaborators
          </Typography>
        </Stack>

        {collaborators.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, border: '1px dashed #ededed', borderRadius: '8px' }}>
            <Typography variant="body1" color="text.secondary">
              No invited users found.
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ededed', borderRadius: '8px' }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px' }}>Email Address</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px' }}>Permission Role</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px' }}>Shared Link</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px' }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {collaborators.map((person, index) => {
                  const targetUrl = person.pageUrl || window.location.origin;
                  return (
                    <TableRow key={person._id || index} sx={{ '&:hover': { bgcolor: '#fbfbfa' } }}>
                      <TableCell sx={{ color: '#37352f', fontWeight: 500, fontSize: '14px' }}>
                        {person.invitedEmail}
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            bgcolor: person.status === "accepted" ? "#e6f4ea" : "#feeed5", 
                            color: person.status === "accepted" ? "#137333" : "#b06000",
                            px: 1, py: 0.3, borderRadius: 1, fontWeight: 600 
                          }}
                        >
                          {person.status === "accepted" ? "Active" : "Pending"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#5f5e5b', fontSize: '14px' }}>
                        {getRoleLabel(person.role)}
                      </TableCell>
                      <TableCell sx={{ maxWidth: '200px' }}>
                        <Typography variant="caption" sx={{ color: '#0066cc', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {targetUrl}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} >
                          <Tooltip title="Copy Link">
                            <IconButton size="small" onClick={() => handleCopyLink(targetUrl)}>
                              <ContentCopyOutlined sx={{ fontSize: '16px', color: '#7c7b77' }} />
                            </IconButton>
                          </Tooltip>
                          <Button
                            size="small"
                            variant="contained"
                            disableElevation
                            onClick={() => window.open(targetUrl, '_blank')}
                            sx={{ textTransform: 'none', bgcolor: '#dec9e9', color: '#37352f', '&:hover': { bgcolor: '#973aa8', color: '#fff' } }}
                          >
                            Open Link
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};