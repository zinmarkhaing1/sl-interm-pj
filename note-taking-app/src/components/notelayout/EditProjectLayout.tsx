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
  Lock as LockIcon,
  Public as PublicIcon,
  Clear as ClearIcon,
  People as PeopleIcon,
  SupervisorAccount as OwnerIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
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
  });

  const [fieldErrors, setFieldErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        isPrivate: project.isPrivate || false,
        members: project.members?.join(", ") || "",
      });
    }
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "name") {
      setFieldErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleClearField = (field: keyof typeof formData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validate = () => {
    const errors: { name?: string } = {};
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
    if (!project?.isOwner) return;
    if (!validate()) return;

    // Backend keeps the single owner; only members are editable here
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      isPrivate: formData.isPrivate,
      members: formData.members
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    };

    try {
      await updateProject({
        id: id!,
        body: payload,
      }).unwrap();
      navigate("/my-project");
    } catch (err) {
      console.log(err);
    }
  };

  if (loadingProject) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const errorStatus =
    projectError && "status" in projectError ? Number(projectError.status) : undefined;

  if (errorStatus === 403) {
    return (
      <Box sx={{ maxWidth: 480, mx: "auto", mt: 6, textAlign: "center", px: 2 }}>
        <LockIcon color="warning" sx={{ fontSize: 48, mb: 1.5 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Access denied
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          This project is private. Only the owner and members can view it.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/my-project")}
          sx={{ textTransform: "none" }}
        >
          Back to projects
        </Button>
      </Box>
    );
  }

  if (errorStatus === 404) {
    return (
      <Box sx={{ maxWidth: 480, mx: "auto", mt: 6, textAlign: "center", px: 2 }}>
        <FolderOutlinedIcon color="disabled" sx={{ fontSize: 48, mb: 1.5 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Project not found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          This project does not exist or may have been deleted.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/my-project")}
          sx={{ textTransform: "none" }}
        >
          Back to projects
        </Button>
      </Box>
    );
  }

  if (projectError) {
    return (
      <Alert severity="error" sx={{ maxWidth: 640, mx: "auto", mt: 4 }}>
        Failed to load project
      </Alert>
    );
  }

  const canEdit = Boolean(project?.isOwner);


  return (
    <Box sx={{ maxWidth: 640, mx: "auto", width: "100%", py: 1 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/my-project")}
        sx={{
          mb: 1.5,
          textTransform: "none",
          color: "text.secondary",
          "&:hover": { bgcolor: "action.hover", color: "text.primary" },
        }}
      >
        Back to projects
      </Button>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 4 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <FolderOutlinedIcon color="primary" sx={{ fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {canEdit ? "Edit project" : "Project details"}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {canEdit
            ? "Update project details, visibility, and members."
            : "You can view this project, but only the owner can edit it."}
        </Typography>

        {!canEdit && (
          <Alert severity="info" sx={{ mb: 2.5 }}>
            Read-only access. Contact the owner to request edit permission.
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              required
              label="Project name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!canEdit}
              error={!!fieldErrors.name}
              helperText={fieldErrors.name || "Update your project name"}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PeopleIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment:
                    canEdit && formData.name ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => handleClearField("name")}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ) : undefined,
                },
              }}
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={!canEdit}
              multiline
              rows={3}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPrivate}
                    onChange={handleChange}
                    name="isPrivate"
                    color="primary"
                    disabled={!canEdit}
                  />
                }
                label={
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
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
                  formData.isPrivate
                    ? "Only owner & members"
                    : "Anyone signed in with the link"
                }
                color={formData.isPrivate ? "warning" : "success"}
                variant="outlined"
                size="small"
              />
            </Box>

            <Divider />

            <Stack spacing={2}>
              <TextField
                label="Owner"
                value={project?.ownerEmail || "Unknown"}
                disabled
                helperText="Projects have a single owner"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <OwnerIcon color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                label="Members"
                name="members"
                value={formData.members}
                onChange={handleChange}
                disabled={!canEdit}
                helperText="Comma-separated emails of additional members"
                placeholder="teammate@email.com"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PeopleIcon color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Stack>

            {error && <Alert severity="error">Update failed</Alert>}

            <Divider />

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
              <Button
                color="inherit"
                onClick={() => navigate("/my-project")}
                disabled={isLoading}
              >
                {canEdit ? "Cancel" : "Close"}
              </Button>
              {canEdit && (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : undefined
                  }
                  sx={{ px: 3 }}
                >
                  {isLoading ? "Updating..." : "Save changes"}
                </Button>
              )}
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};
