// import * as React from 'react';
// import { Box, Typography, Stack, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
// import { PeopleAltOutlined } from '@mui/icons-material';
// import { useNavigate } from "react-router-dom";
// import { useGetNotesQuery } from "../../services/noteApi";
// import type { Note } from "../../types/Note";

// export const SharedTaskPage = () => {
//   const navigate = useNavigate();
//   const { data: notes = [], isLoading, isError } = useGetNotesQuery();

//   const sharedNotes = React.useMemo(() => {
//     if (!Array.isArray(notes)) return [];
//     return notes.filter((note: Note) => note.isOwned !== true);
//   }, [notes]);

//   if (isLoading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
//         <CircularProgress size={40} />
//       </Box>
//     );
//   }

//   if (isError) {
//     return (
//       <Typography color="error" sx={{ textAlign: 'center', mt: 5 }}>
//         Unable to load shared notes.
//       </Typography>
//     );
//   }

//   return (
//     <Box sx={{ width: "100%", minHeight: "100vh", backgroundColor: "#ffffff", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
//       <Box sx={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 54px' }}>
//         <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 4 }}>
//           <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
//             <PeopleAltOutlined sx={{ color: '#37352f', fontSize: '20px' }} />
//             <Typography variant="h5" sx={{ fontSize: "18px", color: '#37352f', letterSpacing: '-0.5px' }}>
//               Shared Notes
//             </Typography>
//           </Stack>
//         </Stack>

//         {sharedNotes.length === 0 ? (
//           <Box sx={{ textAlign: 'center', py: 8, border: '1px dashed #ededed', borderRadius: '8px' }}>
//             <Typography variant="body1" color="text.secondary">
//               No notes have been shared with you yet.
//             </Typography>
//           </Box>
//         ) : (
//           <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ededed', borderRadius: '8px', overflow: 'hidden' }}>
//             <Table>
//               <TableHead sx={{ bgcolor: '#f8f9fa' }}>
//                 <TableRow>
//                   <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px', py: 1.5 }}>Title</TableCell>
//                   <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px', py: 1.5 }}>Access</TableCell>
//                   <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px', py: 1.5 }}>Owner</TableCell>
//                   <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px', py: 1.5 }} />
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {sharedNotes.map((note: Note) => {
//                   const permissionLabel = note.accessPermission === 'edit' || note.accessPermission === 'editor'
//                     ? 'Can edit'
//                     : note.accessPermission === 'comment' || note.accessPermission === 'commenter'
//                       ? 'Can comment'
//                       : 'Can view';
//                   const ownerLabel = note.user || note.authId || note.userId || 'Owner';
//                   const noteId = note._id || note.id || '';
//                   const canEdit = note.accessPermission === 'edit' || note.accessPermission === 'editor' || note.accessPermission === 'owner';

//                   return (
//                     <TableRow key={noteId} sx={{ '&:hover': { bgcolor: '#fbfbfa' }, transition: 'background-color 0.2s' }}>
//                       <TableCell sx={{ color: '#37352f', fontWeight: 500, fontSize: '14px' }}>{note.title || 'Untitled note'}</TableCell>
//                       <TableCell sx={{ color: '#5f5e5b', fontSize: '14px' }}>{permissionLabel}</TableCell>
//                       <TableCell sx={{ color: '#5f5e5b', fontSize: '14px' }}>{ownerLabel}</TableCell>
//                       <TableCell align="right">
//                         <Button
//                           size="small"
//                           variant="contained"
//                           disableElevation
//                           onClick={() => navigate(canEdit ? `/note-form/edit/${noteId}` : `/note-form/detail/${noteId}`)}
//                           sx={{ textTransform: 'none', bgcolor: '#dec9e9', '&:hover': { bgcolor: '#973aa8', color: '#fff' } }}
//                         >
//                           {canEdit ? 'Open / Edit' : 'Open / View'}
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Box>
//     </Box>
//   );
// };


// import * as React from 'react';
// import { Box, Typography, Stack, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from "@mui/material";
// import { PeopleAltOutlined } from '@mui/icons-material';
// import { useGetCollaboratorsQuery } from "../../services/noteApi"; // Hook အသစ်ကို သုံးထားပါတယ်

// export const SharedTaskPage = () => {
//   // Backend ရဲ့ GET /collaborators ဆီကနေ Data လှမ်းယူပါတယ်
//   const { data, isLoading, isError } = useGetCollaboratorsQuery();

//   // ကာကွယ်ရုံသက်သက်: အကယ်၍ data မရှိရင် array အလွတ်ထားမယ်
//   const collaborators = data?.collaborators || [];

//   if (isLoading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
//         <CircularProgress size={40} />
//       </Box>
//     );
//   }

//   if (isError) {
//     return (
//       <Typography color="error" sx={{ textAlign: 'center', mt: 5 }}>
//         Unable to load shared collaborators.
//       </Typography>
//     );
//   }

//   return (
//     <Box sx={{ width: "100%", minHeight: "100vh", backgroundColor: "#ffffff", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
//       <Box sx={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 54px' }}>
        
//         <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 4 }}>
//           <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
//             <PeopleAltOutlined sx={{ color: '#37352f', fontSize: '20px' }} />
//             <Typography variant="h5" sx={{ fontSize: "18px", color: '#37352f', letterSpacing: '-0.5px' }}>
//               Shared Users & Collaborators
//             </Typography>
//           </Stack>
//         </Stack>

//         {collaborators.length === 0 ? (
//           <Box sx={{ textAlign: 'center', py: 8, border: '1px dashed #ededed', borderRadius: '8px' }}>
//             <Typography variant="body1" color="text.secondary">
//               No users have been shared with your notes yet.
//             </Typography>
//           </Box>
//         ) : (
//           <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ededed', borderRadius: '8px', overflow: 'hidden' }}>
//             <Table>
//               <TableHead sx={{ bgcolor: '#f8f9fa' }}>
//                 <TableRow>
//                   {/* သင့်လိုအပ်ချက်အရ Shared ခံရတဲ့ user ကို အဓိကထား ဖော်ပြထားပါတယ် */}
//                   <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px', py: 1.5 }}>Shared User (Email)</TableCell>
//                   <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px', py: 1.5 }}>Access Role</TableCell>
//                   <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px', py: 1.5 }}>Invitation Status</TableCell>
//                   <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px', py: 1.5 }}>Shared Page Link</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {collaborators.map((collab: any) => {
//                   const id = collab._id;
//                   const sharedEmail = collab.invitedEmail; // 👈 ဤနေရာတွင် Shared ခံရသူ၏ Email ကို ယူထားပါသည်
//                   const role = collab.role; // editor, viewer, commenter
//                   const status = collab.status; // pending, accepted
//                   const pageUrl = collab.pageUrl;

//                   // Permission စာသားကို ဖတ်ရလွယ်အောင် ပြောင်းလဲခြင်း
//                   const permissionLabel = role === 'editor' 
//                     ? 'Can edit' 
//                     : role === 'commenter' 
//                       ? 'Can comment' 
//                       : 'Can view';

//                   return (
//                     <TableRow key={id} sx={{ '&:hover': { bgcolor: '#fbfbfa' }, transition: 'background-color 0.2s' }}>
                      
//                       {/* ၁။ Shared ခံရသည့် User ၏ Email ကို ပြသခြင်း */}
//                       <TableCell sx={{ color: '#37352f', fontWeight: 500, fontSize: '14px' }}>
//                         {sharedEmail || 'No Email Found'}
//                       </TableCell>
                      
//                       {/* ၂။ ရရှိထားသော Role */}
//                       <TableCell sx={{ color: '#5f5e5b', fontSize: '14px' }}>
//                         {permissionLabel}
//                       </TableCell>
                      
//                       {/* ၃။ ဖိတ်ခေါ်မှု အခြေအနေ (Accepted သို့မဟုတ် Pending) */}
//                       <TableCell sx={{ fontSize: '14px' }}>
//                         <Chip 
//                           label={status} 
//                           size="small" 
//                           color={status === 'accepted' ? 'success' : 'warning'} 
//                           variant="outlined"
//                           sx={{ textTransform: 'capitalize', fontSize: '12px', fontWeight: 500 }}
//                         />
//                       </TableCell>

//                       {/* ၄။ သက်ဆိုင်ရာ Link */}
//                       <TableCell sx={{ color: '#0066cc', fontSize: '13px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                         <a href={pageUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
//                           {pageUrl || '-'}
//                         </a>
//                       </TableCell>

//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Box>
//     </Box>
//   );
// };

// import * as React from 'react';
// import { Box, Typography, Stack, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
// import { PeopleAltOutlined } from '@mui/icons-material';
// import { useNavigate } from "react-router-dom";
// import { useGetNotesQuery } from "../../services/noteApi";
// import type { Note } from "../../types/Note";

// export const SharedTaskPage = () => {
//   const navigate = useNavigate();
//   const { data: notes = [], isLoading, isError } = useGetNotesQuery();

//   // 💡 Filter Logic ပြင်ဆင်ထားသည့်နေရာ -
//   const sharedNotes = React.useMemo(() => {
//     if (!Array.isArray(notes)) return [];
    
//     return notes.filter((note: Note) => {
//       // ၁။ သူများက ကိုယ့်ကို လာပြီး Share ထားတဲ့ Note ဖြစ်ရင် ပြမည်
//       const isSharedWithMe = note.isOwned !== true;
      
//       // ၂။ ကိုယ်က ပိုင်ရှင်ဖြစ်ပြီး သူများကို ပြန်ပြီး Share ထားတဲ့ Note ဖြစ်ရင်လည်း ပြမည်
//       const isSharedToOthers = note.isOwned === true && 
//         (((note as any).isShared === true) || 
//          ((note as any).sharedWith && (note as any).sharedWith.length > 0));

//       return isSharedWithMe || isSharedToOthers;
//     });
//   }, [notes]);

//   if (isLoading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
//         <CircularProgress size={40} />
//       </Box>
//     );
//   }

//   if (isError) {
//     return (
//       <Typography color="error" sx={{ textAlign: 'center', mt: 5 }}>
//         Unable to load shared notes.
//       </Typography>
//     );
//   }

//   return (
//     <Box sx={{ width: "100%", minHeight: "100vh", bgcolor:'background.default', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
//       <Box sx={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 54px' }}>
//         <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 4 }}>
//           <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
//             <PeopleAltOutlined sx={{ color: '#37352f', fontSize: '20px' }} />
//             <Typography variant="h5" sx={{ fontSize: "18px", color: '#37352f', letterSpacing: '-0.5px' }}>
//               Shared Notes
//             </Typography>
//           </Stack>
//         </Stack>

//         {sharedNotes.length === 0 ? (
//           <Box sx={{ textAlign: 'center', py: 8, border: '1px dashed #ededed', borderRadius: '8px' }}>
//             <Typography variant="body1" color="text.secondary">
//               No notes have been shared yet.
//             </Typography>
//           </Box>
//         ) : (
//           <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ededed', borderRadius: '8px', overflow: 'hidden' }}>
//             <Table>
//               <TableHead sx={{ bgcolor: '#f8f9fa' }}>
//                 <TableRow>
//                   <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px', py: 1.5 }}>Title</TableCell>
//                   <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px', py: 1.5 }}>Access</TableCell>
//                   <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px', py: 1.5 }}>Shared By / Owner</TableCell>
//                   <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px', py: 1.5 }} />
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {sharedNotes.map((note: Note) => {
//                   const permissionLabel = note.accessPermission === 'edit' || note.accessPermission === 'editor'
//                     ? 'Can edit'
//                     : note.accessPermission === 'comment' || note.accessPermission === 'commenter'
//                       ? 'Can comment'
//                       : 'Can view';

//                   // Owner / User Object ကို စစ်ဆေးပြီး Name, Email ထုတ်ခြင်း
//                   const rawOwner = note.user || note.authId || note.userId;
//                   let ownerName = 'Unknown User';
//                   let ownerEmail = '';

//                   if (rawOwner && typeof rawOwner === 'object') {
//                     ownerName = (rawOwner as any).name || (rawOwner as any).email || 'Unknown User';
//                     ownerEmail = (rawOwner as any).email || '';
//                   } else if (typeof rawOwner === 'string') {
//                     ownerName = rawOwner;
//                   }

//                   // အကယ်၍ ကိုယ်တိုင်က ပိုင်ရှင် (isOwned === true) ဖြစ်နေလျှင် Name နေရာမှာ 'You' ဟု ပြောင်းပြပါမည်
//                   if (note.isOwned === true) {
//                     ownerName = "You";
//                   }

//                   const noteId = note._id || note.id || '';
//                   const canEdit = note.accessPermission === 'edit' || note.accessPermission === 'editor' || note.accessPermission === "owner" || note.isOwned === true;

//                   return (
//                     <TableRow key={noteId} sx={{ '&:hover': { bgcolor: '#fbfbfa' }, transition: 'background-color 0.2s' }}>
//                       <TableCell sx={{ color: '#37352f', fontWeight: 500, fontSize: '14px' }}>
//                         {note.title || 'Untitled note'}
//                       </TableCell>
                      
//                       <TableCell sx={{ color: '#5f5e5b', fontSize: '14px' }}>
//                         {note.isOwned === true ? 'Full access' : permissionLabel}
//                       </TableCell>
                      
//                       <TableCell sx={{ py: 1.5 }}>
//                         <Stack spacing={0.2}>
//                           <Typography sx={{ color: '#37352f', fontWeight: 500, fontSize: '14px' }}>
//                             {ownerName}
//                           </Typography>
//                           {ownerEmail && note.isOwned !== true && (
//                             <Typography variant="caption" sx={{ color: '#7c7b77', fontSize: '12px' }}>
//                               {ownerEmail}
//                             </Typography>
//                           )}
//                         </Stack>
//                       </TableCell>
                      
//                       <TableCell align="right">
//                         <Button
//                           size="small"
//                           variant="contained"
//                           disableElevation
//                           onClick={() => navigate(canEdit ? `/note-form/edit/${noteId}` : `/note-form/detail/${noteId}`)}
//                           sx={{ textTransform: 'none', bgcolor: '#dec9e9', '&:hover': { bgcolor: '#973aa8', color: '#fff' } }}
//                         >
//                           {canEdit ? 'Open / Edit' : 'Open / View'}
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Box>
//     </Box>
//   );
// };

// import * as React from 'react';
// import { 
//   Box, Typography, Stack, CircularProgress, Table, TableBody, 
//   TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip, IconButton, Tooltip 
// } from "@mui/material";
// import { PeopleAltOutlined, ContentCopyOutlined } from '@mui/icons-material';
// import { useNavigate } from "react-router-dom";
// import { useGetNotesQuery } from "../../services/noteApi";
// import type { Note } from "../../types/Note";

// export const SharedTaskPage = () => {
//   const navigate = useNavigate();
//   const { data: notes = [], isLoading, isError } = useGetNotesQuery();

//   // 💡 Filter Logic
//   const sharedNotes = React.useMemo(() => {
//     if (!Array.isArray(notes)) return [];
    
//     return notes.filter((note: Note) => {
//       // ၁။ သူများက ကိုယ့်ကို လာပြီး Share ထားတဲ့ Note ဖြစ်ရင် ပြမည်
//       const isSharedWithMe = note.isOwned !== true;
      
//       // ၂။ ကိုယ်က ပိုင်ရှင်ဖြစ်ပြီး သူများကို ပြန်ပြီး Share ထားတဲ့ Note ဖြစ်ရင်လည်း ပြမည်
//       const isSharedToOthers = note.isOwned === true && 
//         (((note as any).isShared === true) || 
//          ((note as any).sharedWith && (note as any).sharedWith.length > 0));

//       return isSharedWithMe || isSharedToOthers;
//     });
//   }, [notes]);

//   // URL ကို Clipboard ထဲသို့ Copy ကူးရန် Function
//   const handleCopyLink = (noteId: string, canEdit: boolean) => {
//     const baseUrl = window.location.origin;
//     const pagePath = canEdit ? `/note-form/edit/${noteId}` : `/note-form/detail/${noteId}`;
//     const fullUrl = `${baseUrl}${pagePath}`;
    
//     navigator.clipboard.writeText(fullUrl);
//     alert("Page URL copied to clipboard!"); // လိုအပ်ပါက Snackbar/Toast ဖြင့် အစားထိုးနိုင်ပါသည်
//   };

//   if (isLoading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
//         <CircularProgress size={40} />
//       </Box>
//     );
//   }

//   if (isError) {
//     return (
//       <Typography color="error" sx={{ textAlign: 'center', mt: 5 }}>
//         Unable to load shared notes.
//       </Typography>
//     );
//   }

//   return (
//     <Box sx={{ width: "100%", minHeight: "100vh", bgcolor:'background.default', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
//       <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 54px' }}>
//         <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 4 }}>
//           <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
//             <PeopleAltOutlined sx={{ color: '#37352f', fontSize: '20px' }} />
//             <Typography variant="h5" sx={{ fontSize: "18px", color: '#37352f', letterSpacing: '-0.5px' }}>
//               Shared Notes
//             </Typography>
//           </Stack>
//         </Stack>

//         {sharedNotes.length === 0 ? (
//           <Box sx={{ textAlign: 'center', py: 8, border: '1px dashed #ededed', borderRadius: '8px' }}>
//             <Typography variant="body1" color="text.secondary">
//               No notes have been shared yet.
//             </Typography>
//           </Box>
//         ) : (
//           <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ededed', borderRadius: '8px', overflow: 'hidden' }}>
//             <Table>
//               <TableHead sx={{ bgcolor: '#f8f9fa' }}>
//                 <TableRow>
//                   <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px', py: 1.5 }}>Title</TableCell>
//                   <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px', py: 1.5 }}>Access</TableCell>
//                   <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px', py: 1.5 }}>Owner / Shared By</TableCell>
//                   <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px', py: 1.5 }}>Shared With (Collaborators)</TableCell>
//                   <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px', py: 1.5 }}>Page URL</TableCell>
//                   <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px', py: 1.5 }} />
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {sharedNotes.map((note: Note) => {
//                   const permissionLabel = note.accessPermission === 'edit' || note.accessPermission === 'editor'
//                     ? 'Can edit'
//                     : note.accessPermission === 'comment' || note.accessPermission === 'commenter'
//                       ? 'Can comment'
//                       : 'Can view';

//                   // Owner / User Object ကို စစ်ဆေးခြင်း
//                   const rawOwner = note.user || note.authId || note.userId;
//                   let ownerName = 'Unknown User';
//                   let ownerEmail = '';

//                   if (rawOwner && typeof rawOwner === 'object') {
//                     ownerName = (rawOwner as any).name || (rawOwner as any).email || 'Unknown User';
//                     ownerEmail = (rawOwner as any).email || '';
//                   } else if (typeof rawOwner === 'string') {
//                     ownerName = rawOwner;
//                   }

//                   if (note.isOwned === true) {
//                     ownerName = "You";
//                   }

//                   const noteId = note._id || note.id || '';
//                   const canEdit = note.accessPermission === 'edit' || note.accessPermission === 'editor' || note.accessPermission === "owner" || note.isOwned === true;
                  
//                   // Shared Link URL လမ်းကြောင်းသတ်မှတ်ခြင်း
//                   const pagePath = canEdit ? `/note-form/edit/${noteId}` : `/note-form/detail/${noteId}`;

//                   // HeaderBar ကနေ share ခံရတဲ့ user စာရင်း (sharedWith) ကို ဆွဲထုတ်ခြင်း
//                   const collaborators = (note as any).sharedWith || [];

//                   return (
//                     <TableRow key={noteId} sx={{ '&:hover': { bgcolor: '#fbfbfa' }, transition: 'background-color 0.2s' }}>
//                       {/* Title */}
//                       <TableCell sx={{ color: '#37352f', fontWeight: 500, fontSize: '14px' }}>
//                         {note.title || 'Untitled note'}
//                       </TableCell>
                      
//                       {/* Access Permission */}
//                       <TableCell sx={{ color: '#5f5e5b', fontSize: '14px' }}>
//                         {note.isOwned === true ? 'Full access' : permissionLabel}
//                       </TableCell>
                      
//                       {/* Owner / Shared By */}
//                       <TableCell sx={{ py: 1.5 }}>
//                         <Stack spacing={0.2}>
//                           <Typography sx={{ color: '#37352f', fontWeight: 500, fontSize: '14px' }}>
//                             {ownerName}
//                           </Typography>
//                           {ownerEmail && note.isOwned !== true && (
//                             <Typography variant="caption" sx={{ color: '#7c7b77', fontSize: '12px' }}>
//                               {ownerEmail}
//                             </Typography>
//                           )}
//                         </Stack>
//                       </TableCell>

//                       {/* Shared With (Collaborators Name & Email) */}
//                       <TableCell sx={{ maxWidth: '250px' }}>
//                         {note.isOwned === true ? (
//                           collaborators.length > 0 ? (
//                             <Stack direction="row" spacing={0.5} useFlexGap  sx={{flexWrap:'wrap'}}>
//                               {collaborators.map((user: any, index: number) => (
//                                 <Tooltip key={index} title={user.email || 'No email'}>
//                                   <Chip 
//                                     label={user.name || user.email || 'Guest'} 
//                                     size="small" 
//                                     variant="outlined"
//                                     sx={{ fontSize: '12px', height: '24px', borderColor: '#dec9e9', color: '#621a70' }}
//                                   />
//                                 </Tooltip>
//                               ))}
//                             </Stack>
//                           ) : (
//                             <Typography variant="caption" sx={{ color: '#a1a09d', fontStyle: 'italic' }}>
//                               Not shared to anyone yet
//                             </Typography>
//                           )
//                         ) : (
//                           <Typography variant="caption" sx={{ color: '#7c7b77' }}>
//                             Shared with you and others
//                           </Typography>
//                         )}
//                       </TableCell>

//                       {/* Page URL */}
//                       <TableCell>
//                         <Stack direction="row" spacing={1} sx={{alignItems:'center'}}>
//                           <Typography 
//                             variant="caption" 
//                             sx={{ 
//                               color: '#0066cc', 
//                               maxWidth: '120px', 
//                               overflow: 'hidden', 
//                               textOverflow: 'ellipsis', 
//                               whiteSpace: 'nowrap',
//                               display: 'inline-block'
//                             }}
//                           >
//                             {pagePath}
//                           </Typography>
//                           <Tooltip title="Copy Page Link">
//                             <IconButton size="small" onClick={() => handleCopyLink(noteId, canEdit)}>
//                               <ContentCopyOutlined sx={{ fontSize: '14px', color: '#7c7b77' }} />
//                             </IconButton>
//                           </Tooltip>
//                         </Stack>
//                       </TableCell>
                      
//                       {/* Action Button */}
//                       <TableCell align="right">
//                         <Button
//                           size="small"
//                           variant="contained"
//                           disableElevation
//                           onClick={() => navigate(pagePath)}
//                           sx={{ textTransform: 'none', bgcolor: '#dec9e9', color: '#37352f', '&:hover': { bgcolor: '#973aa8', color: '#fff' } }}
//                         >
//                           {canEdit ? 'Open / Edit' : 'Open / View'}
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Box>
//     </Box>
//   );
// };
 

// import * as React from 'react';
// import { 
//   Box, Typography, Stack, CircularProgress, Table, TableBody, 
//   TableCell, TableContainer, TableHead, TableRow, Paper, Button, Tooltip, IconButton 
// } from "@mui/material";
// import { PeopleAltOutlined, ContentCopyOutlined } from '@mui/icons-material';
// import { useGetNotesQuery } from "../../services/noteApi";
// import type { Note } from "../../types/Note";

// export const SharedTaskPage = () => {
//   const { data: notes = [], isLoading, isError } = useGetNotesQuery();

//   // 💡 Debug လုပ်ရန်အတွက် API က လာသော data ကို Console တွင် ကြည့်ခြင်း
//   React.useEffect(() => {
//     if (notes) {
//       console.log("=== All Notes Data from API ===", notes);
//     }
//   }, [notes]);

//   const sharedUsers = React.useMemo(() => {
//     // notes က array မဟုတ်ရင် သို့မဟုတ် ဗလာဖြစ်ရင် အလုပ်မလုပ်ပါ
//     if (!notes || !Array.isArray(notes)) return [];

//     const userList: Array<{ name: string; email: string; pageUrl: string; noteTitle: string }> = [];

//     notes.forEach((note: any) => {
//       const noteId = note._id || note.id || '';
      
//       // logic စစ်ဆေးမှုကို လျှော့ချပြီး share ထားတဲ့ user ရှိမရှိကို ပိုမိုကျယ်ပြန့်စွာ စစ်ဆေးပါမည်
//       // HeaderBar တွင် သုံးထားသော key name ပေါ်မူတည်၍ sharedWith သို့မဟုတ် sharedUsers ကို ယူပါမည်
//       const collaborators = note.sharedWith || note.sharedUsers || [];

//       // ခွင့်ပြုချက်အလိုက် Page URL သတ်မှတ်ခြင်း
//       const canEdit = note.accessPermission === 'edit' || note.accessPermission === 'editor' || note.isOwned === true;
//       const pagePath = canEdit ? `/note-form/edit/${noteId}` : `/note-form/detail/${noteId}`;
//       const fullUrl = `${window.location.origin}${pagePath}`;

//       // ၁။ ကိုယ်က သူများကို Share ပေးထားသည့် Collaborators များကို ထုတ်ယူခြင်း
//       if (Array.isArray(collaborators) && collaborators.length > 0) {
//         collaborators.forEach((user: any) => {
//           if (user && (user.email || user.name)) {
//             userList.push({
//               name: user.name || 'Unknown User',
//               email: user.email || 'No Email',
//               pageUrl: fullUrl,
//               noteTitle: note.title || 'Untitled Note'
//             });
//           }
//         });
//       } 
      
//       // ၂။ အကယ်၍ ကိုယ်က ပိုင်ရှင်မဟုတ်ဘဲ သူများက ကိုယ့်ကို လာ Share ထားလျှင်လည်း ၎င်း Owner ကို ပြပေးမည်
//       if (note.isOwned !== true) {
//         const rawOwner = note.user || note.authId || note.userId;
//         if (rawOwner) {
//           let ownerName = 'Unknown User';
//           let ownerEmail = '';

//           if (typeof rawOwner === 'object') {
//             ownerName = rawOwner.name || 'Unknown User';
//             ownerEmail = rawOwner.email || '';
//           } else if (typeof rawOwner === 'string') {
//             ownerName = rawOwner;
//           }

//           // လူကြီးမင်း ကိုယ်တိုင် မဟုတ်မှသာ List ထဲ ထည့်မည်
//           if (ownerEmail !== "zinmarkhaing979@gmail.com") { //
//             userList.push({
//               name: ownerName,
//               email: ownerEmail || 'No Email',
//               pageUrl: fullUrl,
//               noteTitle: note.title || 'Untitled Note'
//             });
//           }
//         }
//       }
//     });

//     // ဓာတ်ပုံထဲကလို Duplicate ဖြစ်နေတာမျိုးမရှိအောင် Email အလိုက် Filter ပြန်လုပ်ခြင်း
//     const uniqueUsers = userList.filter((value, index, self) =>
//       index === self.findIndex((t) => t.email === value.email && t.noteTitle === value.noteTitle)
//     );

//     return uniqueUsers;
//   }, [notes]);

//   const handleCopyLink = (url: string) => {
//     navigator.clipboard.writeText(url);
//     alert("Page URL copied to clipboard!");
//   };

//   if (isLoading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
//         <CircularProgress size={40} />
//       </Box>
//     );
//   }

//   if (isError) {
//     return (
//       <Typography color="error" sx={{ textAlign: 'center', mt: 5 }}>
//         Unable to load shared users.
//       </Typography>
//     );
//   }

//   return (
//     <Box sx={{ width: "100%", minHeight: "100vh", bgcolor:'background.default', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
//       <Box sx={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 54px' }}>
        
//         {/* Title Section */}
//         <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 4 }}>
//           <PeopleAltOutlined sx={{ color: '#37352f', fontSize: '20px' }} />
//           <Typography variant="h5" sx={{ fontSize: "18px", color: '#37352f', fontWeight: 600, letterSpacing: '-0.5px' }}>
//             Shared Users & Collaborators
//           </Typography>
//         </Stack>

//         {/* Table Section */}
//         {sharedUsers.length === 0 ? (
//           <Box sx={{ textAlign: 'center', py: 8, border: '1px dashed #ededed', borderRadius: '8px' }}>
//             <Typography variant="body1" color="text.secondary">
//               No shared users found.
//             </Typography>
//           </Box>
//         ) : (
//           <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ededed', borderRadius: '8px', overflow: 'hidden' }}>
//             <Table>
//               <TableHead sx={{ bgcolor: '#f8f9fa' }}>
//                 <TableRow>
//                   <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px', py: 1.5 }}>User Name</TableCell>
//                   <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px', py: 1.5 }}>Email Address</TableCell>
//                   <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px', py: 1.5 }}>Associated Note</TableCell>
//                   <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px', py: 1.5 }}>Page URL</TableCell>
//                   <TableCell sx={{ fontWeight: 600, color: '#7c7b77', fontSize: '13px', py: 1.5 }} />
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {sharedUsers.map((user, index) => (
//                   <TableRow key={index} sx={{ '&:hover': { bgcolor: '#fbfbfa' }, transition: 'background-color 0.2s' }}>
//                     <TableCell sx={{ color: '#37352f', fontWeight: 500, fontSize: '14px' }}>{user.name}</TableCell>
//                     <TableCell sx={{ color: '#5f5e5b', fontSize: '14px' }}>{user.email}</TableCell>
//                     <TableCell sx={{ color: '#7c7b77', fontSize: '14px', fontStyle: 'italic' }}>{user.noteTitle}</TableCell>
//                     <TableCell sx={{ maxWidth: '200px' }}>
//                       <Typography variant="caption" sx={{ color: '#0066cc', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                         {user.pageUrl}
//                       </Typography>
//                     </TableCell>
//                     <TableCell align="right">
//                       <Stack direction="row" spacing={1} >
//                         <Tooltip title="Copy Link">
//                           <IconButton size="small" onClick={() => handleCopyLink(user.pageUrl)}>
//                             <ContentCopyOutlined sx={{ fontSize: '16px', color: '#7c7b77' }} />
//                           </IconButton>
//                         </Tooltip>
//                         <Button
//                           size="small"
//                           variant="contained"
//                           disableElevation
//                           onClick={() => window.location.href = user.pageUrl}
//                           sx={{ textTransform: 'none', bgcolor: '#dec9e9', color: '#37352f', '&:hover': { bgcolor: '#973aa8', color: '#fff' } }}
//                         >
//                           Go to Page
//                         </Button>
//                       </Stack>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Box>
//     </Box>
//   );
// };
 
import * as React from 'react';
import { 
  Box, Typography, Stack, CircularProgress, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper, Button, Tooltip, IconButton 
} from "@mui/material";
import { PeopleAltOutlined, ContentCopyOutlined } from '@mui/icons-material';
import { useEffect } from 'react';

// Collaborator Data Structure အတွက် Type သတ်မှတ်ခြင်း
interface CollaboratorItem {
  _id?: string;
  invitedEmail: string;
  status: string;
  role: string;
  pageUrl?: string;
}

export const SharedTaskPage = () => {
  const [collaborators, setCollaborators] = React.useState<CollaboratorItem[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isError, setIsError] = React.useState<boolean>(false);

  // 💡 HeaderBar ကဲ့သို့ပင် အလုပ်လုပ်နေသော API Endpoint ဆီ တိုက်ရိုက် Fetch လုပ်ခြင်း
  useEffect(() => {
    const loadCollaboratorsData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/api/share/collaborators", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setCollaborators(data.collaborators || []);
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
        
        {/* Title Section */}
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 4 }}>
          <PeopleAltOutlined sx={{ color: '#37352f', fontSize: '20px' }} />
          <Typography variant="h5" sx={{ fontSize: "18px", color: '#37352f', fontWeight: 600 }}>
            Invited Users & Collaborators
          </Typography>
        </Stack>

        {/* Table Section */}
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
                      
                      {/* Invited Email */}
                      <TableCell sx={{ color: '#37352f', fontWeight: 500, fontSize: '14px' }}>
                        {person.invitedEmail}
                      </TableCell>
                      
                      {/* Status */}
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
                      
                      {/* Role */}
                      <TableCell sx={{ color: '#5f5e5b', fontSize: '14px' }}>
                        {getRoleLabel(person.role)}
                      </TableCell>
                      
                      {/* Page URL */}
                      <TableCell sx={{ maxWidth: '200px' }}>
                        <Typography variant="caption" sx={{ color: '#0066cc', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {targetUrl}
                        </Typography>
                      </TableCell>
                      
                      {/* Actions */}
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