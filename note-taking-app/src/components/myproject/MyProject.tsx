// import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Chip, Typography, Box, CircularProgress, styled } from '@mui/material';
// import { ChatBubbleOutlineOutlined, Add } from '@mui/icons-material';
// import { useGetNotesQuery } from '../../services/noteApi';
// import type { Note } from '../../types/Note';
// import { useNavigate } from 'react-router-dom';


// interface MyProjectProps {
//   filteredNotes: Note[]; 
// }


// // const VisuallyHiddenInput = styled('input')({
// //     clip: 'rect(0 0 0 0)',
// //   clipPath: 'inset(50%)',
// //   height: 1,
// //   overflow: 'hidden',
// //   position: 'absolute',
// //   bottom: 0,
// //   left: 0,
// //   whiteSpace: 'nowrap',
// //   width: 1,
// //   });

// export const MyProject = ({ filteredNotes }: MyProjectProps) => {
//   const {  isLoading, isError } = useGetNotesQuery();
//   const navigate = useNavigate();
//   if (isLoading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (isError) {
//     return (
//       <Typography color="error" sx={{ textAlign: 'center', mt: 5 }}>
//         Unable to load projects.
//       </Typography>
//     );
//   }

  

//   return (
//     <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
//       <Table size="small">
//         <TableHead sx={{ bgcolor: '#f4f6f8' }}>
//           <TableRow>
//             <TableCell sx={{ fontWeight: 600 ,color:"#403d39" }}>Project name</TableCell>
//             <TableCell sx={{ fontWeight: 600 ,color:"#403d39"}}>Assignee</TableCell>
//             <TableCell sx={{ fontWeight: 600 ,color:"#403d39"}}>Priority</TableCell>
//             <TableCell sx={{ fontWeight: 600 ,color:"#403d39"}}>Status</TableCell>
//             <TableCell sx={{ fontWeight: 600 ,color:"#403d39"}}>Start date</TableCell>
//             <TableCell sx={{ fontWeight: 600 ,color:"#403d39"}}>End date</TableCell>
//             <TableCell sx={{ fontWeight: 600, color: '#6b6a65' }}>Team</TableCell>
//             {/* <TableCell sx={{ fontWeight: 600, color: '#6b6a65' }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
               
//                 <AttachFile sx={{ fontSize: 16 }} /> Attach file
//               </Box>
//             </TableCell> */}
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {filteredNotes.map((note: Note) => (
//             <TableRow key={note._id || note.id} sx={{ '&:hover': { bgcolor: '#f4f5f6' } }}>
//               <TableCell sx={{ fontWeight: 500 ,color:"#403d39"}}>
//                 {note.title || 'Untitled'}
//                 <Box component="span" sx={{ fontSize: 11, color:"#403d39", ml: 1, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
//                   <ChatBubbleOutlineOutlined sx={{ fontSize: 11 }} />
//                   {note.category || 'No category'}
//                 </Box>
//               </TableCell>
//               <TableCell sx={{color:"#403d39"}}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <Avatar sx={{ width: 18, height: 18, fontSize: '0.65rem' }}>
//                     {note.assignee ? note.assignee.charAt(0).toUpperCase() : 'U'}
//                   </Avatar>
//                   <Typography variant="body2" sx={{color:"#403d39"}}>{note.assignee || 'Unassigned'}</Typography>
//                 </Box>
//               </TableCell>
//               <TableCell sx={{color:"#403d39"}}>
//                 <Chip label={note.priority || '-'} size="small" sx={{ borderRadius: '4px' ,color:"#403d39"}} />
//               </TableCell>
//               <TableCell sx={{color:"#403d39"}}>
//                 <Chip label={note.task || 'Todo'} size="small" sx={{color:"#403d39"}}/>
//               </TableCell>
//               <TableCell sx={{color:"#403d39"}}>{note.startDate || '-'}</TableCell>
//               <TableCell sx={{color:"#403d39"}}>{note.endDate || '-'}</TableCell>
//             <TableCell sx={{color:"#403d39"}}>{note.category || '-'}</TableCell>
//               <TableCell>
//                 {/* <Button
//                   size="small"
//                   startIcon={<Add sx={{ fontSize: 14 }} />}
//                   sx={{
//                     textTransform: 'none',
//                     color: '#878682',
//                     fontSize: '0.8rem',
//                     p: '2px 8px',
//                     border: '1px dashed #e0e0e0',
//                     borderRadius: '4px',
//                     '&:hover': { bgcolor: '#efeee9', borderColor: '#878682' },
//                   }}
//                 >
//                   Add file
//                 </Button> */}
//                  {/* <Button  
//                 component="label"
//                 role={undefined}
//                 variant='contained'
//                 tabIndex={-1}
//                 size='small'
//                 startIcon={<Add sx={{ fontSize: 14 }}/>}
//                 sx={{
//                     textTransform: 'none',
//                     color: '#878682',
//                     fontSize: '14px',
//                     bgcolor:"#f5ecfb",
//                     p: '1.5px 5px',
//                     border: '1px dashed #e0e0e0',
//                     borderRadius: '4px',
//                     '&:hover': { bgcolor: '#f7f6f8', borderColor: '#878682' },
//                   }}
//                 >
//                   Add File 
//                   <VisuallyHiddenInput
//         type="file"
//         onChange={(event) => console.log(event.target.files)}
//         multiple
//       />

//                 </Button> */}
//               </TableCell>
//             </TableRow>
//           ))}

//           <TableRow>
//             <TableCell colSpan={8}>
              
//               <Button startIcon={<Add />} sx={{ color: '#878682', textTransform: 'none', p: 0, fontSize: '0.85rem' }} onClick={() => navigate('/my-project/new-project')}>
//                 New project
//               </Button>
//             </TableCell>
//           </TableRow>
//         </TableBody>
//       </Table>
//     </TableContainer>
//   )
// }
