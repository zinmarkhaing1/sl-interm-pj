import * as React from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Stack,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetNoteByIdQuery,
  useUpdateNoteMutation,
} from "../services/noteApi";

interface NoteFormState {
  title: string;
  description: string;
  priority: string;
  assignee: string;
  category: string;
  task: string;
  startDate: string;
  endDate: string;
}

const CATEGORIES = [
  "My Note",
  "Company Note",
  "Study",
  "Family & Friends",
  "Fitness & Health",
];
const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES = ["Todo", "In Progress", "Complete", "Not Started"];

const formatDateForInput = (dateStr: string | undefined): string => {
  if (!dateStr) return "";
  const cleanDate = dateStr.includes(" ")
    ? dateStr.split(" ")[0]
    : dateStr.split("T")[0];
  return cleanDate;
};

export const EditNotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetNoteByIdQuery(id!, {
    skip: !id,
  });
  const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>(
    {}
  );

  const [form, setForm] = React.useState<NoteFormState>({
    title: "",
    description: "",
    priority: "",
    assignee: "",
    category: "",
    task: "",
    startDate: "",
    endDate: "",
  });

  React.useEffect(() => {
    if (data) {
      setForm({
        title: data.title || "",
        description: data.description || data.content || "",
        priority: data.priority || "",
        assignee: data.assignee || "",
        category: data.category || "",
        task: data.task || "",
        startDate: formatDateForInput(data.startDate),
        endDate: formatDateForInput(data.endDate),
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.title.trim()) errors.title = "Title is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!id) return;
    setSubmitError(null);
    if (!validate()) return;

    try {
      await updateNote({
        id,
        body: {
          ...form,
          content: form.description,
        },
      }).unwrap();
      navigate("/note-form");
    } catch (err: any) {
      setSubmitError(
        err?.data?.message || err?.message || "Update failed. Please try again."
      );
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ maxWidth: 640, mx: "auto", mt: 4 }}>
        Error loading note data.
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 640, mx: "auto", width: "100%", py: 1 }}>
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
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
          <EditNoteIcon color="primary" />
          <Typography variant="h5" fontWeight={700}>
            Edit note
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Update content, status, and schedule for this note.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2.5}>
            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              error={!!fieldErrors.title}
              helperText={fieldErrors.title}
              required
              disabled={isUpdating}
            />

            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              multiline
              rows={4}
              disabled={isUpdating}
            />

            <Divider />

            <Typography variant="subtitle2" color="text.secondary">
              Details
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                select
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                disabled={isUpdating}
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                disabled={isUpdating}
              >
                {PRIORITIES.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Status"
                name="task"
                value={form.task}
                onChange={handleChange}
                disabled={isUpdating}
              >
                {STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <TextField
              label="Assignee"
              name="assignee"
              value={form.assignee}
              onChange={handleChange}
              disabled={isUpdating}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Start date"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                disabled={isUpdating}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="End date"
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                disabled={isUpdating}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Stack>

            {submitError && <Alert severity="error">{submitError}</Alert>}

            <Divider />

            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button
                color="inherit"
                onClick={() => navigate("/note-form")}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isUpdating}
                startIcon={
                  isUpdating ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : undefined
                }
                sx={{ px: 3 }}
              >
                {isUpdating ? "Saving..." : "Save changes"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};
