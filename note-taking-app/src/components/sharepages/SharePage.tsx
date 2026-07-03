// import React from 'react'
// import { useGetNotesQuery } from "../../services/noteApi";
// import type {Note} from "../../types/Note";
// export const SharePage = () => {
//     const [showSharedWorkspace, setShowSharedWorkspace] = React.useState<boolean>(false);
//       const [watchLaterEnabled, setWatchLaterEnabled] = React.useState<boolean>(false);
//       const sharedNotes = React.useMemo(() => {
//           return Array.isArray(notes)
//             ? notes.filter((note: any) => note.isOwned !== true)
//             : [];
//         }, [notes]);

//         React.useEffect(() => {
//             const shouldShowShared = location.search.includes("view=shared") || localStorage.getItem("sharedNotesRequested") === "true";
//             const shouldWatchLater = localStorage.getItem("watchLaterSharedNotes") === "true";
//             setShowSharedWorkspace(shouldShowShared);
//             setWatchLaterEnabled(shouldWatchLater);
//           }, [location.search]);

//           const filteredNotes = React.useMemo(() => {
//               if(!Array.isArray(notes)) return [];
          
//               return notes.filter((note:Note)=>{
//                 if(showSharedWorkspace && note.isOwned === true) return false;
          
                
          
//                 return true;
//               });
//             },[notes,showSharedWorkspace,]);
//   return (
//     <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 54px' }}>
//         {showSharedWorkspace ? (
//                   <Box sx={{ mt: 2 }}>
//                     <Box sx={{ mb: 3, p: 2.5, border: '1px solid #e0e0e0', borderRadius: '12px', bgcolor: '#f9fbff' }}>
//                       <Typography sx={{ fontWeight: 700, color: '#1f3a5f', mb: 0.5 }}>
//                         Shared workspace
//                       </Typography>
//                       <Typography sx={{ color: '#5f6b7a', fontSize: '14px' }}>
//                         These are the notes shared with you from the owner’s workspace. Edits made here update the same note for the owner too.
//                       </Typography>
//                     </Box>
        
//                     {watchLaterEnabled && (
//                       <Box onClick={handleWatchLaterClick} sx={{ mb: 3, p: 2, border: '1px solid #f3d9a3', borderRadius: '10px', bgcolor: '#fff7e6' }}>
//                         <Typography sx={{ fontWeight: 600, color: '#7a4b00' }}>
//                           Watch later
//                         </Typography>
//                         {/* <Typography sx={{ color: '#8a5a10', fontSize: '13px', mt: 0.5 }}>
//                           You marked this shared workspace to review later. Open a note and edit it to sync changes instantly.
//                         </Typography> */}
//                       </Box>
//                     )}
        
//                     {filteredNotes.length === 0 ? (
//                       <Typography sx={{ color: '#9b9a97', fontSize: '14px', textAlign: 'center', mt: 4 }}>
//                         No tasks match your filter criteria.
//                       </Typography>
//                     ) : (
//                       <Stack spacing={1.5}>
//                         {filteredNotes.map((note: any) => (
//                           <Box key={note._id || note.id} sx={{ p: 2, border: '1px solid #e8ecef', borderRadius: '10px', bgcolor: 'white' }}>
//                             <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}>
//                               <Box>
//                                 <Typography sx={{ fontWeight: 600, color: '#37352f' }}>{note.title || 'Untitled note'}</Typography>
//                                 <Typography sx={{ color: '#6b7280', fontSize: '13px', mt: 0.5 }}>
//                                   {note.content || note.description || 'No content yet'}
//                                 </Typography>
//                               </Box>
//                               <Button
//                                 variant="contained"
//                                 disableElevation
//                                 onClick={() => {
//                                   if (note.accessPermission === 'edit' || note.accessPermission === 'owner') {
//                                     navigate(`/note-form/edit/${note._id}`);
//                                     return;
//                                   }
//                                   navigate(`/note-form/detail/${note._id}`);
//                                 }}
//                                 sx={{ textTransform: 'none', bgcolor: '#dec9e9', width: 150, height: 40, borderRadius: 3, '&:hover': { bgcolor: '#973aa8', color: "#ffe5ec" } }}
//                               >
//                                 {note.accessPermission === 'edit' || note.accessPermission === 'owner' ? 'Open / Edit' : 'Open / View'}
//                               </Button>
//                             </Stack>
//                           </Box>
//                         ))}
//                       </Stack>
//                     )}
//                   </Box>
//                 ) : (
//                   //standard non-shred layout
//                   <Box sx={{ mt: 2 }}>
//                     {filteredNotes.length === 0 ? (
//                       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pt: 10, pb: 10 }}>
//                         <IconButton disabled sx={{ p: 1.5, bgcolor: '#f1f1ef', borderRadius: '8px', mb: 2, '& .MuiSvgIcon-root': { color: '#acaba9', fontSize: 32 } }}>
//                           <TaskAltIcon />
//                         </IconButton>
//                         <Typography sx={{ color: '#9b9a97', fontSize: '14px', mb: 1.5 }}>
//                           No matching tasks found.
//                         </Typography>
//                         <Typography onClick={() => navigate("/note-form/create")} sx={{ color: '#2383e2', fontSize: '14px', cursor: 'pointer', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}>
//                           + New task
//                         </Typography>
//                       </Box>
//                     ) : (
//                       <Stack spacing={1.5}>
//                         {filteredNotes.map((note: Note) => (
//                           <Box key={note._id || note.id} sx={{ p: 2, border: '1px solid #ededed', borderRadius: '8px', '&:hover': { bgcolor: '#f7f7f5' } }}>
//                             <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{note.title || 'Untitled'}</Typography>
//                             <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
//                               <Typography variant="caption" sx={{ color: '#6b6a65' }}>Assignee: {note.assignee || 'Unassigned'}</Typography>
//                               <Typography variant="caption" sx={{ color: '#6b6a65' }}>Status: {note.task || 'Todo'}</Typography>
//                             </Stack>
//                           </Box>
//                         ))}
//                       </Stack>
//                     )}
//                     </Box>
//                 )}
//                       {/* for shared notes  */}
//                     <Box sx={{ mt: 4, pt: 4, borderTop: '1px dashed #ededed' }}>
//                     <Typography variant="h6" sx={{ fontWeight: 600, color: '#37352f', mb: 2 }}>
//                       Shared Notes Directory Summary
//                     </Typography>
//                     {sharedNotes.length === 0 ? (
//                       <Typography sx={{ color: '#9b9a97', fontSize: '14px' }}>
//                         No shared notes available yet.
//                       </Typography>
//                     ) : (
//                       <Stack spacing={1.5}>
//                         {sharedNotes.map((note: any) => (
//                           <Box key={note._id} sx={{ p: 2, border: '1px solid #e8ecef', borderRadius: '10px', bgcolor: 'white' }}>
//                             <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}>
//                               <Box>
//                                 <Typography sx={{ fontWeight: 600, color: '#37352f' }}>{note.title || 'Untitled note'}</Typography>
//                                 <Typography sx={{ color: '#6b7280', fontSize: '13px', mt: 0.5, mr: 2 }}>
//                                   {note.content || note.description || 'No content yet'}
//                                 </Typography>
//                               </Box>
//                               <Button
//                                 variant="contained"
//                                 disableElevation
//                                 onClick={() => {
//                                   if (note.accessPermission === 'edit' || note.accessPermission === 'owner') {
//                                     navigate(`/note-form/edit/${note._id}`);
//                                     return;
//                                   }
//                                   navigate(`/note-form/detail/${note._id}`);
//                                 }}
//                                 sx={{ textTransform: 'none', bgcolor: '#dec9e9', width: 150, height: 40, borderRadius: 3, '&:hover': { bgcolor: '#973aa8', color: "#ffe5ec" } }}
//                               >
//                                 {note.accessPermission === 'edit' || note.accessPermission === 'owner'
//                                   ? 'Open / Edit'
//                                   : note.accessPermission === 'comment'
//                                     ? 'Open / Comment'
//                                     : 'Open / View'}
//                               </Button>
//                             </Stack>
//                           </Box>
//                         ))}
//                       </Stack>
//                     )}
//                   </Box>
//         </Box>
//   )
// }


import React from 'react';
// Assuming you are using react-router-dom for navigation and URL parsing
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, Stack, IconButton } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt'; 
import { useGetNotesQuery } from "../../services/noteApi";
import type { Note } from "../../types/Note";

export const SharePage = () => {
  // 1. Fetch data from RTK Query hook
  const { data: notes } = useGetNotesQuery();
  
  const navigate = useNavigate();
  const location = useLocation();

  const [showSharedWorkspace, setShowSharedWorkspace] = React.useState<boolean>(false);
  const [watchLaterEnabled, setWatchLaterEnabled] = React.useState<boolean>(false);

  // Derive shared notes safely using strict typing
  const sharedNotes = React.useMemo(() => {
    return Array.isArray(notes)
      ? notes.filter((note: Note) => note.isOwned !== true)
      : [];
  }, [notes]);

  // Synchronize component state with URL search parameters and localStorage
  React.useEffect(() => {
    const shouldShowShared = location.search.includes("view=shared") || localStorage.getItem("sharedNotesRequested") === "true";
    const shouldWatchLater = localStorage.getItem("watchLaterSharedNotes") === "true";
    
    setShowSharedWorkspace(shouldShowShared);
    setWatchLaterEnabled(shouldWatchLater);
  }, [location.search]);

  // Handle filtering logic for core layout views
  const filteredNotes = React.useMemo(() => {
    if (!Array.isArray(notes)) return [];

    return notes.filter((note: Note) => {
      if (showSharedWorkspace && note.isOwned === true) return false;
      return true;
    });
  }, [notes, showSharedWorkspace]);

  // Placeholder handler for watch later action click
  const handleWatchLaterClick = () => {
    console.log("Watch later region interactive click triggered");
  };

  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 54px' }}>
      {showSharedWorkspace ? (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ mb: 3, p: 2.5, border: '1px solid #e0e0e0', borderRadius: '12px', bgcolor: '#f9fbff' }}>
            <Typography sx={{ fontWeight: 700, color: '#1f3a5f', mb: 0.5 }}>
              Shared workspace
            </Typography>
            <Typography sx={{ color: '#5f6b7a', fontSize: '14px' }}>
              These are the notes shared with you from the owner’s workspace. Edits made here update the same note for the owner too.
            </Typography>
          </Box>

          {watchLaterEnabled && (
            <Box onClick={handleWatchLaterClick} sx={{ mb: 3, p: 2, border: '1px solid #f3d9a3', borderRadius: '10px', bgcolor: '#fff7e6', cursor: 'pointer' }}>
              <Typography sx={{ fontWeight: 600, color: '#7a4b00' }}>
                Watch later
              </Typography>
            </Box>
          )}

          {filteredNotes.length === 0 ? (
            <Typography sx={{ color: '#9b9a97', fontSize: '14px', textAlign: 'center', mt: 4 }}>
              No tasks match your filter criteria.
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {filteredNotes.map((note: Note) => (
                <Box key={note._id || note.id} sx={{ p: 2, border: '1px solid #e8ecef', borderRadius: '10px', bgcolor: 'white' }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}>
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: '#37352f' }}>{note.title || 'Untitled note'}</Typography>
                      <Typography sx={{ color: '#6b7280', fontSize: '13px', mt: 0.5 }}>
                        {note.content || note.description || 'No content yet'}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      disableElevation
                      onClick={() => {
                        if (note.accessPermission === 'edit' || note.accessPermission === 'owner') {
                          navigate(`/note-form/edit/${note._id}`);
                          return;
                        }
                        navigate(`/note-form/detail/${note._id}`);
                      }}
                      sx={{ textTransform: 'none', bgcolor: '#dec9e9', width: 150, height: 40, borderRadius: 3, '&:hover': { bgcolor: '#973aa8', color: "#ffe5ec" } }}
                    >
                      {note.accessPermission === 'edit' || note.accessPermission === 'owner' ? 'Open / Edit' : 'Open / View'}
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      ) : (
        // Standard non-shared layout
        <Box sx={{ mt: 2 }}>
          {filteredNotes.length === 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pt: 10, pb: 10 }}>
              <IconButton disabled sx={{ p: 1.5, bgcolor: '#f1f1ef', borderRadius: '8px', mb: 2, '& .MuiSvgIcon-root': { color: '#acaba9', fontSize: 32 } }}>
                <TaskAltIcon />
              </IconButton>
              <Typography sx={{ color: '#9b9a97', fontSize: '14px', mb: 1.5 }}>
                No matching tasks found.
              </Typography>
              <Typography onClick={() => navigate("/note-form/create")} sx={{ color: '#2383e2', fontSize: '14px', cursor: 'pointer', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}>
                + New task
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {filteredNotes.map((note: Note) => (
                <Box key={note._id || note.id} sx={{ p: 2, border: '1px solid #ededed', borderRadius: '8px', '&:hover': { bgcolor: '#f7f7f5' } }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{note.title || 'Untitled'}</Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    <Typography variant="caption" sx={{ color: '#6b6a65' }}>Assignee: {note.assignee || 'Unassigned'}</Typography>
                    <Typography variant="caption" sx={{ color: '#6b6a65' }}>Status: {note.task || 'Todo'}</Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      )}

      {/* Directory section for shared notes */}
      <Box sx={{ mt: 4, pt: 4, borderTop: '1px dashed #ededed' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#37352f', mb: 2 }}>
          Shared Notes Directory Summary
        </Typography>
        {sharedNotes.length === 0 ? (
          <Typography sx={{ color: '#9b9a97', fontSize: '14px' }}>
            No shared notes available yet.
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {sharedNotes.map((note: Note) => (
              <Box key={note._id} sx={{ p: 2, border: '1px solid #e8ecef', borderRadius: '10px', bgcolor: 'white' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}>
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: '#37352f' }}>{note.title || 'Untitled note'}</Typography>
                    <Typography sx={{ color: '#6b7280', fontSize: '13px', mt: 0.5, mr: 2 }}>
                      {note.content || note.description || 'No content yet'}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    disableElevation
                    onClick={() => {
                      if (note.accessPermission === 'edit' || note.accessPermission === 'owner') {
                        navigate(`/note-form/edit/${note._id}`);
                        return;
                      }
                      navigate(`/note-form/detail/${note._id}`);
                    }}
                    sx={{ textTransform: 'none', bgcolor: '#dec9e9', width: 150, height: 40, borderRadius: 3, '&:hover': { bgcolor: '#973aa8', color: "#ffe5ec" } }}
                  >
                    {note.accessPermission === 'edit' || note.accessPermission === 'owner'
                      ? 'Open / Edit'
                      : note.accessPermission === 'comment'
                        ? 'Open / Comment'
                        : 'Open / View'}
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};