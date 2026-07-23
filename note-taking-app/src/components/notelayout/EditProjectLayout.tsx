import React, { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";

import {
//   GitHub as GitHubIcon,
  Lock as LockIcon,
  Public as PublicIcon,
  Clear as ClearIcon,
  People as PeopleIcon,
  SupervisorAccount as OwnerIcon,
} from "@mui/icons-material";
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import { useNavigate, useParams } from "react-router-dom";

import {
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
} from "../../services/projectApi";

export const EditProjectLayout = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const {
    data: project,
    isLoading: loadingProject,
    error: projectError,
  } = useGetProjectByIdQuery(id!);

  const [updateProject, { isLoading, error }] = useUpdateProjectMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPrivate: false,
    members: "",
    owners: "",
  });

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
  }>({});

  // Fill existing data
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",

        description: project.description || "",

        isPrivate: project.isPrivate || false,

        members: project.members?.join(", ") || "",

        owners: project.owners?.join(", ") || "",
      });
    }
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleClearField = (field: keyof typeof formData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validate = () => {
    const errors: {
      name?: string;
    } = {};

    if (!formData.name.trim()) {
      errors.name = "Project name is required";
    } else if (formData.name.length < 3) {
      errors.name = "Project name must be at least 3 characters";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),

      description: formData.description.trim(),

      isPrivate: formData.isPrivate,

      members: formData.members
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),

      owners: formData.owners
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    };

    try {
      await updateProject({
  id:id!,
  body:payload
}).unwrap();

      navigate("/my-project");
    } catch (err) {
      console.log(err);
    }
  };

  if (loadingProject)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 5,
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (projectError)
    return <Alert severity="error">Failed to load project</Alert>;

  const repoUrl = `https://github.com/your-org/${formData.name || "project-name"}`;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,

          borderRadius: 3,

          border: "1px solid",

          borderColor: "divider",

          boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3,
          }}
        >
          {/* <GitHubIcon color="primary" sx={{ fontSize: 36 }} /> */}
          <FolderOutlinedIcon color="primary" sx={{fontSize:30}}/>

          <Typography variant="h5">Edit Project</Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            label="Project name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!fieldErrors.name}
            helperText={fieldErrors.name || "Update your project name"}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PeopleIcon color="action" />
                  </InputAdornment>
                ),

                endAdornment: formData.name && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleClearField("name")}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{ mb: 2 }}
          />

          {formData.name && !fieldErrors.name && (
            <Box
              sx={{
                p: 1.5,

                mb: 3,

                borderRadius: 1,

                bgcolor: "primary.50",
              }}
            >
              <Typography variant="body2" color="primary">
                {repoUrl}
              </Typography>
            </Box>
          )}

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            sx={{ mb: 3 }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 3,
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isPrivate}
                  onChange={handleChange}
                  name="isPrivate"
                />
              }
              label={
                <Box sx={{ display: "flex", gap: 1 }}>
                  {formData.isPrivate ? (
                    <LockIcon fontSize="small" />
                  ) : (
                    <PublicIcon fontSize="small" />
                  )}

                  <Typography>
                    {formData.isPrivate ? "Private" : "Public"}
                  </Typography>
                </Box>
              }
            />

            <Chip
              label={
                formData.isPrivate ? "Only members can see" : "Anyone can see"
              }
              color={formData.isPrivate ? "warning" : "success"}
              variant="outlined"
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Members"
              name="members"
              value={formData.members}
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PeopleIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              fullWidth
              label="Owners"
              name="owners"
              value={formData.owners}
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <OwnerIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              Update failed
            </Alert>
          )}

          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              display: "flex",

              justifyContent: "flex-end",

              gap: 2,
            }}
          >
            <Button variant="outlined" onClick={() => navigate("/my-project")}>
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading && <CircularProgress size={20} />}
            >
              {isLoading ? "Updating..." : "Update Project"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};
