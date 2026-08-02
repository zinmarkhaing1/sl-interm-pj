// import { useState } from "react";
// import {
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   IconButton,
//   CircularProgress,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   TextField,
//   Tooltip,
//   Snackbar,
//   Stack,
// } from "@mui/material";
// import { Add, Edit, Delete, Category as CategoryIcon } from "@mui/icons-material";
// import {
//   useGetCategoriesQuery,
//   useCreateCategoryMutation,
//   useUpdateCategoryMutation,
//   useDeleteCategoryMutation,
// } from "../services/categoryApi";
// import type { Category } from "../types/Category";

// export const PageCategory = () => {
//   // -------- Queries & Mutations --------
//   const {
//     data: categories = [],
//     isLoading,
//     isError,
//     error,
//   } = useGetCategoriesQuery();

//   const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
//   const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
//   const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

//   // -------- Local UI State --------
//   const [createDialogOpen, setCreateDialogOpen] = useState(false);
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

//   const [formName, setFormName] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

//   // Snackbar state
//   const [snackbar, setSnackbar] = useState<{
//     open: boolean;
//     message: string;
//     severity: "success" | "error";
//   }>({ open: false, message: "", severity: "success" });

//   // -------- Handlers (Create) --------
//   const handleOpenCreate = () => {
//     setFormName("");
//     setCreateDialogOpen(true);
//   };
//   const handleCloseCreate = () => {
//     if (!isCreating) setCreateDialogOpen(false);
//   };
//   const handleCreate = async () => {
//     if (!formName.trim()) return;
//     try {
//       await createCategory({ name: formName.trim() }).unwrap();
//       setSnackbar({ open: true, message: "Category created successfully!", severity: "success" });
//       setCreateDialogOpen(false);
//     } catch (err: any) {
//       setSnackbar({
//         open: true,
//         message: err?.data?.message || "Failed to create category.",
//         severity: "error",
//       });
//     }
//   };

//   // -------- Handlers (Edit) --------
//   const handleOpenEdit = (category: Category) => {
//     setSelectedCategory(category);
//     setFormName(category.name);
//     setEditDialogOpen(true);
//   };
//   const handleCloseEdit = () => {
//     if (!isUpdating) setEditDialogOpen(false);
//   };
//   const handleUpdate = async () => {
//     if (!selectedCategory || !formName.trim()) return;
//     try {
//       await updateCategory({ id: selectedCategory._id, name: formName.trim() }).unwrap();
//       setSnackbar({ open: true, message: "Category updated successfully!", severity: "success" });
//       setEditDialogOpen(false);
//     } catch (err: any) {
//       setSnackbar({
//         open: true,
//         message: err?.data?.message || "Failed to update category.",
//         severity: "error",
//       });
//     }
//   };

//   // -------- Handlers (Delete) --------
//   const handleOpenDelete = (category: Category) => {
//     setSelectedCategory(category);
//     setDeleteDialogOpen(true);
//   };
//   const handleCloseDelete = () => {
//     if (!isDeleting) setDeleteDialogOpen(false);
//   };
//   const handleDelete = async () => {
//     if (!selectedCategory) return;
//     try {
//       await deleteCategory(selectedCategory._id).unwrap();
//       setSnackbar({ open: true, message: "Category deleted successfully!", severity: "success" });
//       setDeleteDialogOpen(false);
//     } catch (err: any) {
//       setSnackbar({
//         open: true,
//         message: err?.data?.message || "Failed to delete category.",
//         severity: "error",
//       });
//     }
//   };

//   // -------- Loading / Error States --------
//   if (isLoading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (isError) {
//     return (
//       <Alert severity="error" sx={{ mt: 5 }}>
//         Failed to load categories. {(error as any)?.data?.message || "Please try again later."}
//       </Alert>
//     );
//   }

//   // -------- Render --------
//   return (
//     <Box sx={{ maxWidth: 1200, mx: "auto", p: 4 }}>
//       {/* Header */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
//         <Typography variant="h5" sx={{ fontSize: "20px" }}>
//           My Categories
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<Add />}
//           onClick={handleOpenCreate}
//           sx={{ textTransform: "none", borderRadius: 2 }}
//         >
//           New Category
//         </Button>
//       </Box>

//       {/* Category Grid */}
//       <Grid container spacing={3}>
//         {categories.map((category) => (
//           <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category._id}>
//             <Card
//               sx={{
//                borderRadius: 0.5,
//                 boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
//                 '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.1)' },
//                 height: "100%",
//                 display: "flex",
//                 flexDirection: "column",
//                 p: 1,
//               }}
//             >
//               <CardContent sx={{ flex: 1 , width:'100%'}}>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     mb: 1,
//                   }}
//                 >
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                     <CategoryIcon color="primary" />
//                     <Typography variant="h6" noWrap>
//                       {category.name}
//                     </Typography>
//                   </Box>
//                   <Box>
//                     <Stack sx={{display:'flex',position:'relative', flexDirection:'column'}}>
//                        <Tooltip title="Edit">
//                       <IconButton size="small" onClick={() => handleOpenEdit(category)} sx={{ mr: 0.5 }}>
//                         <Edit fontSize="small" />
//                       </IconButton>
//                     </Tooltip>
//                     <Tooltip title="Delete">
//                       <IconButton size="small" color="error" onClick={() => handleOpenDelete(category)}>
//                         <Delete fontSize="small" />
//                       </IconButton>
//                     </Tooltip>
//                     </Stack>
                   
//                   </Box>
//                 </Box>
//                 <Typography variant="caption" color="text.secondary">
//                   Created: {new Date(category.createdAt).toLocaleDateString()}
//                 </Typography>
//                 <br />
//                 <Typography variant="caption" color="text.secondary">
//                   Updated: {new Date(category.updatedAt).toLocaleDateString()}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* -------------------- Create Dialog -------------------- */}
//       <Dialog
//         open={createDialogOpen}
//         onClose={handleCloseCreate}
//         maxWidth="xs"
//         fullWidth
//         slotProps={{ paper: { sx: { borderRadius: 2 } } }}
//       >
//         <DialogTitle>Create New Category</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Category Name"
//             fullWidth
//             variant="outlined"
//             value={formName}
//             onChange={(e) => setFormName(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleCreate()}
//             disabled={isCreating}
//           />
//         </DialogContent>
//         <DialogActions sx={{ px: 3, pb: 2.5 }}>
//           <Button onClick={handleCloseCreate} disabled={isCreating} sx={{ flex: 1, textTransform: "none" }}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleCreate}
//             variant="contained"
//             disabled={isCreating || !formName.trim()}
//             startIcon={isCreating ? <CircularProgress size={16} color="inherit" /> : undefined}
//             sx={{ flex: 1, textTransform: "none" }}
//           >
//             {isCreating ? "Creating..." : "Create"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* -------------------- Edit Dialog -------------------- */}
//       <Dialog
//         open={editDialogOpen}
//         onClose={handleCloseEdit}
//         maxWidth="xs"
//         fullWidth
//         slotProps={{ paper: { sx: { borderRadius: 2 } } }}
//       >
//         <DialogTitle>Edit Category</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Category Name"
//             fullWidth
//             variant="outlined"
//             value={formName}
//             onChange={(e) => setFormName(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
//             disabled={isUpdating}
//           />
//         </DialogContent>
//         <DialogActions sx={{ px: 3, pb: 2.5 }}>
//           <Button onClick={handleCloseEdit} disabled={isUpdating} sx={{ flex: 1, textTransform: "none" }}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleUpdate}
//             variant="contained"
//             disabled={isUpdating || !formName.trim()}
//             startIcon={isUpdating ? <CircularProgress size={16} color="inherit" /> : undefined}
//             sx={{ flex: 1, textTransform: "none" }}
//           >
//             {isUpdating ? "Updating..." : "Update"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* -------------------- Delete Dialog -------------------- */}
//       <Dialog
//         open={deleteDialogOpen}
//         onClose={handleCloseDelete}
//         maxWidth="xs"
//         fullWidth
//         slotProps={{ paper: { sx: { borderRadius: 2 } } }}
//       >
//         <DialogTitle>Delete Category?</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             {selectedCategory
//               ? `Are you sure you want to permanently delete "${selectedCategory.name}"? This action cannot be undone.`
//               : ""}
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions sx={{ px: 3, pb: 2.5 }}>
//           <Button onClick={handleCloseDelete} disabled={isDeleting} sx={{ flex: 1, textTransform: "none" }}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleDelete}
//             color="error"
//             variant="contained"
//             disabled={isDeleting}
//             startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : undefined}
//             sx={{ flex: 1, textTransform: "none" }}
//           >
//             {isDeleting ? "Deleting..." : "Delete"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* -------------------- Snackbar -------------------- */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Tooltip,
  Snackbar,
  Stack,
} from "@mui/material";
import { Add, Edit, Delete, Category as CategoryIcon } from "@mui/icons-material";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../services/categoryApi";
import type { Category } from "../types/Category";

export const PageCategory = () => {
  const navigate = useNavigate();

  const {
    data: categories = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCategoriesQuery({});

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [formName, setFormName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const handleOpenCreate = () => {
    setFormName("");
    setCreateDialogOpen(true);
  };

  const handleCloseCreate = () => {
    if (!isCreating) setCreateDialogOpen(false);
  };

  const handleCreate = async () => {
    if (!formName.trim()) return;
    try {
      await createCategory({
        name: formName.trim(),
      }).unwrap();
      setSnackbar({ open: true, message: "Category created successfully!", severity: "success" });
      setCreateDialogOpen(false);
      refetch();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err?.data?.message || "Failed to create category.",
        severity: "error",
      });
    }
  };

  const handleOpenEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormName(category.name);
    setEditDialogOpen(true);
  };

  const handleCloseEdit = () => {
    if (!isUpdating) setEditDialogOpen(false);
  };

  const handleUpdate = async () => {
    if (!selectedCategory || !formName.trim()) return;
    try {
      await updateCategory({
        id: selectedCategory._id,
        name: formName.trim(),
      }).unwrap();
      setSnackbar({ open: true, message: "Category updated successfully!", severity: "success" });
      setEditDialogOpen(false);
      refetch();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err?.data?.message || "Failed to update category.",
        severity: "error",
      });
    }
  };

  const handleOpenDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    if (!isDeleting) setDeleteDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    try {
      await deleteCategory(selectedCategory._id).unwrap();
      setSnackbar({ open: true, message: "Category deleted successfully!", severity: "success" });
      setDeleteDialogOpen(false);
      refetch();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err?.data?.message || "Failed to delete category.",
        severity: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 5 }}>
        Failed to load categories. {(error as any)?.data?.message || "Please try again later."}
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h5" sx={{ fontSize: "20px" }}>
          My Categories
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenCreate}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          New Category
        </Button>
      </Box>

      {/* Category Grid */}
      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category._id}>
            <Card
              sx={{
                borderRadius: 0.5,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                "&:hover": { boxShadow: "0 8px 24px rgba(0,0,0,0.1)" },
                height: "100%",
                display: "flex",
                flexDirection: "column",
                p: 1,
              }}
            >
              <CardContent sx={{ flex: 1, width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CategoryIcon color="primary" />
                    <Typography variant="h6" noWrap>
                      {category.name}
                    </Typography>
                  </Box>
                  <Box>
                    <Stack sx={{ display: "flex", position: "relative", flexDirection: "column" }}>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleOpenEdit(category)} sx={{ mr: 0.5 }}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleOpenDelete(category)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Created: {new Date(category.createdAt).toLocaleDateString()}
                </Typography>
                <br />
                <Typography variant="caption" color="text.secondary">
                  Updated: {new Date(category.updatedAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {categories.length === 0 && (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <Typography variant="body1" color="text.secondary">
            No categories found. Click "New Category" to create one.
          </Typography>
        </Box>
      )}

      {/* Dialogs */}
      <Dialog
        open={createDialogOpen}
        onClose={handleCloseCreate}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 2 } } }}
      >
        <DialogTitle>Create New Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            variant="outlined"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            disabled={isCreating}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={handleCloseCreate} disabled={isCreating} sx={{ flex: 1, textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={isCreating || !formName.trim()}
            startIcon={isCreating ? <CircularProgress size={16} color="inherit" /> : undefined}
            sx={{ flex: 1, textTransform: "none" }}
          >
            {isCreating ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEdit}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 2 } } }}
      >
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            variant="outlined"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
            disabled={isUpdating}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={handleCloseEdit} disabled={isUpdating} sx={{ flex: 1, textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            disabled={isUpdating || !formName.trim()}
            startIcon={isUpdating ? <CircularProgress size={16} color="inherit" /> : undefined}
            sx={{ flex: 1, textTransform: "none" }}
          >
            {isUpdating ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDelete}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 2 } } }}
      >
        <DialogTitle>Delete Category?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedCategory
              ? `Are you sure you want to permanently delete "${selectedCategory.name}"? This action cannot be undone.`
              : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={handleCloseDelete} disabled={isDeleting} sx={{ flex: 1, textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : undefined}
            sx={{ flex: 1, textTransform: "none" }}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};