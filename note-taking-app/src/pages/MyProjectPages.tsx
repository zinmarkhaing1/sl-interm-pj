
import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Stack,
  CircularProgress,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  InputAdornment,
  Tooltip,
  Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetProjectsQuery, useDeleteProjectMutation } from '../services/projectApi';
import { Folder, Lock, Public, People, Delete, Edit, Share, ContentCopy, Check } from '@mui/icons-material';
import type { Project } from '../types/Project';

export const MyProjectPages = () => {
  const navigate = useNavigate();
  const { data: projects=[], isLoading, isError } = useGetProjectsQuery();

console.log("PROJECT ERROR:", isError);
console.log("PROJECT LOADING:", isLoading);

  console.log("projects =>", projects);
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null);
  const [projectToShare, setProjectToShare] = useState<Project | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 5 }}>
        Failed to load projects
      </Alert>
    );
  }

  const getShareLink = (projectId: string) =>
    `${window.location.origin}/my-project/edit-project/${projectId}`;

  const openDeleteDialog = (id: string, name: string) => {
    setProjectToDelete({ id, name });
  };

  const closeDeleteDialog = () => {
    if (!isDeleting) setProjectToDelete(null);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProject(projectToDelete.id).unwrap();
      setProjectToDelete(null);
    } catch (err) {
      console.error('Failed to delete project', err);
    }
  };

  const openShareDialog = (project: Project) => {
    setCopied(false);
    setCopyError(false);
    setProjectToShare(project);
  };

  const closeShareDialog = () => {
    setProjectToShare(null);
    setCopied(false);
  };

  const handleCopyLink = async () => {
    if (!projectToShare) return;
    const link = getShareLink(projectToShare._id);
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontSize: '16px', fontWeight: 700, color: 'text.primary' }}>My Projects</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5,fontSize:'14px' }}>
            Organize workspaces, share them with your team, and jump back into active projects quickly.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate('/my-project/new-project')}
          sx={{ textTransform: 'none' }}
        >
          + New Project
        </Button>
      </Box>

      <Grid container spacing={3}>
        {projects?.map((project) => (
          <Grid size={{ xs: 12, md: 4 }} key={project._id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 12px 30px rgba(15, 23, 42, 0.05)',
                '&:hover': { boxShadow: '0 16px 35px rgba(15, 23, 42, 0.09)', transform: 'translateY(-2px)' },
                height: '100%',
                display: 'flex',
                p:0.2,
                flexDirection: 'column',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  pt: 2,
                  // pb: 0.5,
                }}
              >
                <Box
                  onClick={() => navigate(`/my-project/edit-project/${project._id}`)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    minWidth: 0,
                    flex: 1,
                    cursor: 'pointer',
                  }}
                >
                  <Folder color="primary" />
                  <Typography variant="h6" noWrap sx={{fontFamily:'sans-serif', fontSize:'16px'}}>
                    {project.name}
                  </Typography>
                  <Chip
                    size="small"
                    icon={project.isPrivate ? <Lock fontSize="small" /> : <Public fontSize="small" />}
                    label={project.isPrivate ? 'Private' : 'Public'}
                    variant="outlined"
                    sx={{m:1,py:1.5,fontSize:'14px'}}
                  />
                </Box>
                <Tooltip title="Share project">
                  <IconButton
                    size="small"
                    onClick={() => openShareDialog(project)}
                    sx={{ flexShrink: 0 }}
                  >
                    <Share fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
{/* 
              <CardActionArea
                onClick={() => navigate(`/my-project/project-detail/${project._id}`)}
                sx={{ flex: 1, alignItems: 'stretch' }}
              > */}
                {/* <CardContent sx={{  pt: 0.5,height: '100%',display: 'flex',flexDirection: 'column',}}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, height: 35, overflow: 'hidden' }}
                  > */}
                    {/* {project.description || 'No description'}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                    <People fontSize="small" color="action" />
                    <Typography variant="caption">
                      Members: {project.members?.length || 0}
                    </Typography>
                     <Typography
                    variant="caption"
                    color="text.secondary"
                  > */}
                    {/* Owner: {project.ownerEmail || 'Unknown'} */}
                    {/* Owner:{project.owners?.length || 0}
                  </Typography>
                  <Typography variant="caption" color="primary" sx={{ fontWeight: 500 }}>
    {project.ownerEmail || 'Unknown'} {/* primary owner */}
  {/* </Typography>  */}
                  {/* </Stack>
                 
                  <Box sx={{ display: 'flex'}}>
                    {project.members?.slice(0, 3).map((m, i) => (
                      <Avatar key={i} sx={{ width: 24, height: 24, fontSize: 10 }}>
                        {m[0]}
                      </Avatar>
                    ))} */}
                    {/* {(project.members?.length || 0) > 3 && (
                      <Avatar sx={{ width: 24, height: 24, fontSize: 10 }}>
                        +{project.members!.length - 3}
                      </Avatar>
                    )}
                  </Box> */}
                {/* </CardContent> */}
              {/* </CardActionArea> */}

              <CardActionArea
  onClick={() => navigate(`/my-project/project-detail/${project._id}`)}
  sx={{ flex: 1, alignItems: 'stretch' }}
>
  <CardContent sx={{ pt: 0.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ mb: 2, height: 35, overflow: 'hidden',fontSize:'14px' }}
    >
      {project.description || 'No description'}
    </Typography>

    {/* Members & Owners Info */}
    <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
      <Stack direction="row" spacing={0.5} sx={{alignItems:'center'}}>
        <People fontSize="small" color="action" />
        <Typography variant="caption" sx={{fontSize:'14px'}}>
          Members: {project.members?.length || 0}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={0.5} sx={{alignItems:'center'}}>
        <People fontSize="small" color="action" />
        <Typography variant="caption" color="text.secondary" sx={{fontSize:'14px'}}>
          Owners: {project.owners?.length || 0}
        </Typography>
      </Stack>
  
      {project.ownerEmail && (
        <Typography variant="caption" sx={{color:'text.primary'}}>
          Owner: {project.ownerEmail}
        </Typography>
      )}
    </Stack>

    {/* Member Avatars */}
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      {project.members?.slice(0, 3).map((m, i) => {
     
        let initial = '?';
        if (typeof m === 'string') {
          initial = m[0]?.toUpperCase() || '?';
        } else if (typeof m === 'object' && m !== null) {
          initial = (m.username?.[0] || m.email?.[0] || m._id?.[0] || '?').toUpperCase();
        }
        return (
          <Avatar key={i} sx={{ width: 24, height: 24, fontSize: 10 }}>
            {initial}
          </Avatar>
        );
      })}
      {(project.members?.length || 0) > 3 && (
        <Avatar sx={{ width: 24, height: 24, fontSize: 10 }}>
          +{project.members!.length - 3}
        </Avatar>
      )}
    </Box>
  </CardContent>
</CardActionArea>

              <Box sx={{ display: 'flex', gap: 0.5, px: 2, pb: 2 }}>
                <Button
                  size="small"
                  variant="contained"
                  sx={{ textTransform: 'none', flex: 1 }}
                  onClick={() => navigate(`/my-tasks?project=${project._id}`)}
                >
                  View Tasks
                </Button>
                <IconButton
                  size="small"
                  onClick={() => navigate(`/my-project/edit-project/${project._id}`)}
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => openDeleteDialog(project._id, project.name)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Share dialog */}
      <Dialog
        open={Boolean(projectToShare)}
        onClose={closeShareDialog}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: { maxWidth: 320, borderRadius: 2 },
          },
        }}
      >
        <DialogTitle>Share “{projectToShare?.name}”</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {projectToShare?.isPrivate
              ? 'This project is private. Only the owner and members can open this link.'
              : 'This project is public. Anyone signed in with the link can view it.'}
          </DialogContentText>
          <TextField
            fullWidth
            size="small"
            label="Share link"
            value={projectToShare ? getShareLink(projectToShare._id) : ''}
            slotProps={{
              input: {
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title={copied ? 'Copied!' : 'Copy link'}>
                      <IconButton
                        edge="end"
                        onClick={handleCopyLink}
                        color={copied ? 'success' : 'default'}
                        aria-label="Copy link"
                      >
                        {copied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              },
            }}
          />
          {copyError && (
            <Alert severity="error" sx={{ mt: 1.5 }}>
              Could not copy. Please select the link and copy manually.
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={closeShareDialog}
            fullWidth
            variant="contained"
            disableElevation
            sx={{
              textTransform: 'none',
              bgcolor: 'grey.300',
              color: 'text.primary',
              '&:hover': { bgcolor: 'grey.400' },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete dialog */}
      <Dialog
        open={Boolean(projectToDelete)}
        onClose={closeDeleteDialog}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: { maxWidth: 360, borderRadius: 2 },
          },
        }}
      >
        <DialogTitle>Delete project permanently?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {projectToDelete
              ? `Are you sure you want to permanently delete "${projectToDelete.name}"? This action cannot be undone.`
              : ''}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={closeDeleteDialog}
            disabled={isDeleting}
            fullWidth
            variant="contained"
            disableElevation
            sx={{
              flex: 1,
              textTransform: 'none',
              bgcolor: 'grey.300',
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'grey.400',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            fullWidth
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : undefined}
            sx={{ flex: 1, textTransform: 'none' }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        message="Link copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};
