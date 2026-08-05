// import * as React from "react";
// import {
//   Box,
//   Button,
//   Paper,
//   TextField,
//   Typography,
//   Stack,
//   MenuItem,
//   Alert,
//   CircularProgress,
//   Divider,
// } from "@mui/material";
// import EditNoteIcon from "@mui/icons-material/EditNote";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   useGetNoteByIdQuery,
//   useUpdateNoteMutation,
// } from "../services/noteApi";

// interface NoteFormState {
//   title: string;
//   description: string;
//   priority: string;
//   assignee: string;
//   category: string;
//   task: string;
//   startDate: string;
//   endDate: string;
// }

// const CATEGORIES = [
//   "My Note",
//   "Company Note",
//   "Study",
//   "Family & Friends",
//   "Fitness & Health",
// ];
// const PRIORITIES = ["Low", "Medium", "High"];
// const STATUSES = ["Todo", "In Progress", "Complete", "Not Started"];

// const formatDateForInput = (dateStr: string | undefined): string => {
//   if (!dateStr) return "";
//   const cleanDate = dateStr.includes(" ")
//     ? dateStr.split(" ")[0]
//     : dateStr.split("T")[0];
//   return cleanDate;
// };

// export const EditNotePage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   const { data, isLoading, isError } = useGetNoteByIdQuery(id!, {
//     skip: !id,
//   });
//   const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();
//   const [submitError, setSubmitError] = React.useState<string | null>(null);
//   const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>(
//     {}
//   );

//   const [form, setForm] = React.useState<NoteFormState>({
//     title: "",
//     description: "",
//     priority: "",
//     assignee: "",
//     category: "",
//     task: "",
//     startDate: "",
//     endDate: "",
//   });

//   React.useEffect(() => {
//     if (data) {
//       setForm({
//         title: data.title || "",
//         description: data.description || data.content || "",
//         priority: data.priority || "",
//         assignee: data.assignee || "",
//         category: data.category || "",
//         task: data.task || "",
//         startDate: formatDateForInput(data.startDate),
//         endDate: formatDateForInput(data.endDate),
//       });
//     }
//   }, [data]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
//   };

//   const validate = () => {
//     const errors: Record<string, string> = {};
//     if (!form.title.trim()) errors.title = "Title is required";
//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent): Promise<void> => {
//     e.preventDefault();
//     if (!id) return;
//     setSubmitError(null);
//     if (!validate()) return;

//     try {
//       await updateNote({
//         id,
//         body: {
//           ...form,
//           content: form.description,
//         },
//       }).unwrap();
//       navigate("/note-form");
//     } catch (err: any) {
//       setSubmitError(
//         err?.data?.message || err?.message || "Update failed. Please try again."
//       );
//     }
//   };

//   if (isLoading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
//         <CircularProgress color="primary" />
//       </Box>
//     );
//   }

//   if (isError) {
//     return (
//       <Alert severity="error" sx={{ maxWidth: 640, mx: "auto", mt: 4 }}>
//         Error loading note data.
//       </Alert>
//     );
//   }

//   return (
//     <Box sx={{ maxWidth: 640, mx: "auto", width: "100%", py: 1 }}>
//       <Paper
//         elevation={0}
//         sx={{
//           p: { xs: 2.5, sm: 4 },
//           borderRadius: 3,
//           border: "1px solid",
//           borderColor: "divider",
//           bgcolor: "background.paper",
//         }}
//       >
//         <Stack direction="row" spacing={1.5} sx={{ mb: 1 ,alignItems:'center'}}>
//           <EditNoteIcon color="primary" />
//           <Typography variant="h5" sx={{ fontWeight: 700 }}>
//             Edit note
//           </Typography>
//         </Stack>
//         <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//           Update content, status, and schedule for this note.
//         </Typography>

//         <Box component="form" onSubmit={handleSubmit} noValidate>
//           <Stack spacing={2.5}>
//             <TextField
//               label="Title"
//               name="title"
//               value={form.title}
//               onChange={handleChange}
//               error={!!fieldErrors.title}
//               helperText={fieldErrors.title}
//               required
//               disabled={isUpdating}
//             />

//             <TextField
//               label="Description"
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//               multiline
//               rows={4}
//               disabled={isUpdating}
//             />

//             <Divider />

//             <Typography variant="subtitle2" color="text.secondary">
//               Details
//             </Typography>

//             <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//               <TextField
//                 select
//                 label="Category"
//                 name="category"
//                 value={form.category}
//                 onChange={handleChange}
//                 disabled={isUpdating}
//               >
//                 {CATEGORIES.map((cat) => (
//                   <MenuItem key={cat} value={cat}>
//                     {cat}
//                   </MenuItem>
//                 ))}
//               </TextField>

//               <TextField
//                 select
//                 label="Priority"
//                 name="priority"
//                 value={form.priority}
//                 onChange={handleChange}
//                 disabled={isUpdating}
//               >
//                 {PRIORITIES.map((p) => (
//                   <MenuItem key={p} value={p}>
//                     {p}
//                   </MenuItem>
//                 ))}
//               </TextField>

//               <TextField
//                 select
//                 label="Status"
//                 name="task"
//                 value={form.task}
//                 onChange={handleChange}
//                 disabled={isUpdating}
//               >
//                 {STATUSES.map((s) => (
//                   <MenuItem key={s} value={s}>
//                     {s}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Stack>

//             <TextField
//               label="Assignee"
//               name="assignee"
//               value={form.assignee}
//               onChange={handleChange}
//               disabled={isUpdating}
//             />

//             <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//               <TextField
//                 label="Start date"
//                 name="startDate"
//                 type="date"
//                 value={form.startDate}
//                 onChange={handleChange}
//                 disabled={isUpdating}
//                 slotProps={{ inputLabel: { shrink: true } }}
//               />
//               <TextField
//                 label="End date"
//                 name="endDate"
//                 type="date"
//                 value={form.endDate}
//                 onChange={handleChange}
//                 disabled={isUpdating}
//                 slotProps={{ inputLabel: { shrink: true } }}
//               />
//             </Stack>

//             {submitError && <Alert severity="error">{submitError}</Alert>}

//             <Divider />

//             <Stack direction="row" spacing={1.5} sx={{justifyContent:'flex-start'}}>
//               <Button
//                 color="inherit"
//                 onClick={() => navigate("/note-form")}
//                 disabled={isUpdating}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 disabled={isUpdating}
//                 startIcon={
//                   isUpdating ? (
//                     <CircularProgress size={18} color="inherit" />
//                   ) : undefined
//                 }
//                 sx={{ px: 3 }}
//               >
//                 {isUpdating ? "Saving..." : "Save changes"}
//               </Button>
//             </Stack>
//           </Stack>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

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
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetNoteByIdQuery,
  useUpdateNoteMutation,
  useGetNotesQuery,
} from "../services/noteApi";

// Reuse constants from NewNotePage
const STATUS_OPTIONS = ["Todo", "In Progress", "Complete", "Not Started"] as const;
const PRIORITY_OPTIONS = ["Low", "Medium", "High"] as const;
const DEFAULT_CATEGORIES = [
  "Family & Friends",
  "Fitness & Health",
  "Study",
  "My Note",
  "Company Note",
  "General",
];

type StatusType = (typeof STATUS_OPTIONS)[number];
type PriorityType = (typeof PRIORITY_OPTIONS)[number];

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

  // Fetch existing note
  const { data, isLoading, isError } = useGetNoteByIdQuery(id!, { skip: !id });
  // Fetch all notes to build category dropdown
  const { data: existingNotes = [] } = useGetNotesQuery();
  const [updateNote, { isLoading: isUpdating, error: updateError }] =
    useUpdateNoteMutation();

  const [form, setForm] = React.useState<{
    title: string;
    description: string;
    category: string;
    status: StatusType;
    priority: PriorityType;
    assignee: string;
    startDate: string;
    endDate: string;
  }>({
    title: "",
    description: "",
    category: "",
    status: "Todo",
    priority: "Medium",
    assignee: "",
    startDate: "",
    endDate: "",
  });

  const [fieldErrors, setFieldErrors] = React.useState<{ title?: string }>({});

  // Build category options (defaults + existing categories)
  const categoryOptions = React.useMemo(() => {
    return Array.from(
      new Set([
        ...DEFAULT_CATEGORIES,
        ...existingNotes
          .map((note) => note.category)
          .filter((category): category is string => Boolean(category?.trim())),
      ]),
    ).sort((a, b) => a.localeCompare(b));
  }, [existingNotes]);

  // Populate form when note data loads
  React.useEffect(() => {
    if (data) {
      setForm({
        title: data.title || "",
        description: data.description || data.content || "",
        category: data.category || "",
        status: (data.task as StatusType) || "Todo",
        priority: (data.priority as PriorityType) || "Medium",
        assignee: data.assignee || "",
        startDate: formatDateForInput(data.startDate),
        endDate: formatDateForInput(data.endDate),
      });
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "title") {
      setFieldErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name as string]: value }));
  };

  const validate = (): boolean => {
    const errors: { title?: string } = {};
    if (!form.title.trim()) {
      errors.title = "Note title is required";
    } else if (form.title.length < 3) {
      errors.title = "Title must be at least 3 characters";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!validate()) return;

    try {
      await updateNote({
        id,
        body: {
          title: form.title.trim(),
          content: form.description.trim() || " ",
          description: form.description.trim(),
          category: form.category.trim() || "General",
          priority: form.priority,
          task: form.status,
          assignee: form.assignee.trim() || "Unassigned",
          startDate: form.startDate || undefined,
          endDate: form.endDate || undefined,
        },
      }).unwrap();
      navigate(-1);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const getErrorMessage = (): string => {
    if (!updateError) return "";
    if ("data" in updateError && updateError.data) {
      const data = updateError.data as Record<string, any>;
      return data?.error || data?.message || "Something went wrong";
    }
    if ("message" in updateError && updateError.message) {
      return updateError.message;
    }
    return "Something went wrong. Please try again.";
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (isError || !data) {
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
        <Stack direction="row" spacing={1.5} sx={{ mb: 1, alignItems: "center" }}>
          <EditNoteIcon color="primary" />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Edit note
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Update content, status, and schedule for this note.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              required
              label="Note title"
              name="title"
              value={form.title}
              onChange={handleChange}
              error={!!fieldErrors.title}
              helperText={fieldErrors.title || "A short, descriptive title."}
              placeholder="Meeting notes"
              disabled={isUpdating}
            />

            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              multiline
              rows={2}
              placeholder="Write your notes here..."
              disabled={isUpdating}
            />

            {/* Category dropdown */}
            <FormControl fullWidth required disabled={isUpdating}>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                label="Category"
                name="category"
                value={form.category}
                onChange={handleSelectChange}
              >
                {categoryOptions.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Select a category for this note.</FormHelperText>
            </FormControl>

            <TextField
              label="Assignee"
              name="assignee"
              value={form.assignee}
              onChange={handleChange}
              placeholder="Username or email"
              helperText="Who is responsible for this note?"
              disabled={isUpdating}
            />

            {/* Status & Priority */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl fullWidth disabled={isUpdating}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={form.status}
                  label="Status"
                  onChange={handleSelectChange}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth disabled={isUpdating}>
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  name="priority"
                  value={form.priority}
                  label="Priority"
                  onChange={handleSelectChange}
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            {/* Start & End Dates */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Start date"
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
                disabled={isUpdating}
              />
              <TextField
                label="End date (Due date)"
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
                disabled={isUpdating}
              />
            </Stack>

            {/* Server error */}
            {updateError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {getErrorMessage()}
              </Alert>
            )}

            <Divider />

            {/* Buttons */}
            <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
              <Button
                color="inherit"
                onClick={() => navigate(-1)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isUpdating || !form.title.trim()}
                startIcon={
                  isUpdating ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : null
                }
                sx={{ px: 3 }}
              >
                {isUpdating ? "Saving..." : "Save changes"}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};