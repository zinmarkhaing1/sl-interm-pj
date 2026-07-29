import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
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
  Divider,
  Paper,
} from '@mui/material';
import {
  Folder,
  Lock,
  Public,
  People,
  Delete,
  Edit,
  Share,
  ContentCopy,
  Check,
  ArrowBack,
  CalendarToday,
  Person,
  Email,
} from '@mui/icons-material';
import { useGetProjectsQuery, useDeleteProjectMutation } from '../services/projectApi';
import type { Project } from '../types/Project';

export const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // MyProjectPages မှာ သုံးထားတဲ့ hook အတိုင်း ပြန်သုံးထားပါတယ်
  const { data: projects = [], isLoading, isError } = useGetProjectsQuery();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  // URL ပါ id နဲ့ ကိုက်ညီတဲ့ Project ကို ရှာပါ
  const project = useMemo(() => {
    return projects.find((p: Project) => p._id === id);
  }, [projects, id]);

  // Share & Delete Dialog States (MyProjectPages နဲ့ အတူတူပါ)
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null);
  const [projectToShare, setProjectToShare] = useState<Project | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  // Helper Functions
  const getShareLink = (projectId: string) =>
    `${window.location.origin}/my-project/edit-project/${projectId}`;

  // Loading State
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error State
  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 5 }}>
        Failed to load projects
      </Alert>
    );
  }

  // Not Found State
  if (!project) {
    return (
      <Alert severity="warning" sx={{ mt: 5 }}>
        Project not found. The project may have been deleted or you do not have access.
      </Alert>
    );
  }

  // ---- Delete Handlers (MyProjectPages က အတိုင်း) ----
  const openDeleteDialog = () => {
    setProjectToDelete({ id: project._id, name: project.name });
  };
  const closeDeleteDialog = () => {
    if (!isDeleting) setProjectToDelete(null);
  };
  const confirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProject(projectToDelete.id).unwrap();
      setProjectToDelete(null);
      navigate('/my-project'); // Delete ပြီးရင် Main Page ကိုပြန်သွားမယ်
    } catch (err) {
      console.error('Failed to delete project', err);
    }
  };

  // ---- Share Handlers (MyProjectPages က အတိုင်း) ----
  const openShareDialog = () => {
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

  // Format Date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 4 }}>
      {/* ---- Top Navigation Bar (MyProjectPages Style) ---- */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Stack direction="row" spacing={1} sx={{alignItems:'center'}}>
          <IconButton onClick={() => navigate('/my-project')} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" sx={{ fontSize: '20px', fontWeight: 500 }}>
            Project Details
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<Share />}
            onClick={openShareDialog}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Share
          </Button>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate(`/my-project/edit-project/${project._id}`)}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={openDeleteDialog}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Delete
          </Button>
        </Stack>
      </Box>

      {/* ---- Main Detail Card (Same Shadow & Radius as MyProjectPages) ---- */}
      <Card
        sx={{
          borderRadius: 0.5,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          p: 3,
          mb: 4,
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Header: Name + Privacy Chip */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Folder color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h4" sx={{ fontFamily: 'sans-serif', fontWeight: 600 }}>
              {project.name}
            </Typography>
            <Chip
              size="medium"
              icon={project.isPrivate ? <Lock fontSize="small" /> : <Public fontSize="small" />}
              label={project.isPrivate ? 'Private' : 'Public'}
              variant="outlined"
              sx={{ py: 1.5, px: 0.5 }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Description */}
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: '1rem' }}>
            {project.description || 'No description provided for this project.'}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Info Grid: Owner, Members, Dates */}
          <Grid container spacing={3}>
            {/* Owner */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack direction="row" spacing={1} sx={{alignItems:'center'}}>
                <Person color="action" />
                <Typography variant="subtitle2" color="text.secondary">
                  Owner:
                </Typography>
                <Typography variant="body2">
                  {project.owners && project.owners.length > 0
                    ? project.owners.join(', ')
                    : 'Unknown'}
                </Typography>
              </Stack>
            </Grid>

            {/* Members Count */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack direction="row" spacing={1} sx={{alignItems:'center'}}>
                <People color="action" />
                <Typography variant="subtitle2" color="text.secondary">
                  Members:
                </Typography>
                <Typography variant="body2">{project.members?.length || 0}</Typography>
              </Stack>
            </Grid>

            {/* Created Date */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack direction="row" spacing={1} sx={{alignItems:'center'}}>
                <CalendarToday color="action" />
                <Typography variant="subtitle2" color="text.secondary">
                  Created:
                </Typography>
                <Typography variant="body2">{formatDate(project.createdAt)}</Typography>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Members Avatars List (Same as MyProjectPages) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Team:
            </Typography>
            <Stack direction="row" spacing={0.5}>
              {project.members?.slice(0, 5).map((m, i) => (
                <Tooltip title={m} key={i}>
                  <Avatar sx={{ width: 32, height: 32, fontSize: 12 }}>
                    {m.charAt(0).toUpperCase()}
                  </Avatar>
                </Tooltip>
              ))}
              {(project.members?.length || 0) > 5 && (
                <Avatar sx={{ width: 32, height: 32, fontSize: 12 }}>
                  +{project.members!.length - 5}
                </Avatar>
              )}
              {(!project.members || project.members.length === 0) && (
                <Typography variant="caption" color="text.secondary">
                  No members added yet.
                </Typography>
              )}
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* ---- Action Cards (Task Overview) ---- */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 0.5,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              📋 Tasks Overview
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              View all tasks associated with this project.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate(`/my-tasks?project=${project._id}`)}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              View Tasks
            </Button>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 0.5,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              ⚙️ Project Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Manage project members, privacy, and general settings.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate(`/my-project/edit-project/${project._id}`)}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Go to Settings
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* ---- Share Dialog (Exact copy from MyProjectPages) ---- */}
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

      {/* ---- Delete Dialog (Exact copy from MyProjectPages) ---- */}
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

      {/* ---- Snackbar ---- */}
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