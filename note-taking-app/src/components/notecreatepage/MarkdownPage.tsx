
// // import { Box,  Grid, TextField, Paper } from '@mui/material';

// // interface MarkdownPageProps{
// //   description: string;
// //   setText: (value: string) => void;
// // }

// // export function MarkdownPage({description,setText}:MarkdownPageProps) {

// //   return (
// //     <Box sx={{ p: 3 }}>
// //       <Grid container spacing={2}>
// //         {/* Editor Side */}
// //         <Grid  size={{xs:12}} sx={{md:6}}>
// //           <TextField
// //             label="Markdown Input"
// //             multiline
// //             rows={15}
// //             fullWidth
// //             value={description}
// //             onChange={(e) => setText(e.target.value)}
// //             placeholder="Add new text here.."
// //           />
// //         </Grid>
      
// //         <Grid size={{xs:12}} sx={{md:6}}>
// //           <Paper variant="outlined" sx={{ p: 2, minHeight: 340, backgroundColor: '#f9f9f9' }}>
// //             <div style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>
             
// //               {description || "Note Content"}
// //             </div>
// //           </Paper>
// //         </Grid>
// //       </Grid>
// //     </Box>
// //   );
// // }

// import React, { useState } from 'react';
// import { Box, IconButton,  Typography } from '@mui/material';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

// interface MarkdownPageProps {
//   description: string;
//   setText: (value: string) => void;
// }

// export function MarkdownPage({ description, setText }: MarkdownPageProps) {
//   const [isFolded, setIsFolded] = useState<boolean>(false);


//   const lines = description.split('\n');

//   const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setText(e.target.value);
//   };

//   return (
//     <Box 
//       sx={{ 
//         display: 'flex', 
//         fontFamily: 'Consolas, Monaco, "Courier New", monospace',
//         fontSize: '14px',
//         minHeight: '400px',
//         width: '100%',
//         border: '1px solid #f0f0f0',
//         p: 1,
//         bgcolor:'background.default',
//         color:'text.primary'
//       }}
//     >
//     {/* linenumber area  */}
//       <Box 
//         sx={{ 
//           display: 'flex', 
//           flexDirection: 'column', 
//           alignItems: 'flex-end', 
//           userSelect: 'none',
//           color: 'text.primary',
//           pr: 1,
//           borderRight: '1px solid #f0f0f0',
//           minWidth: '35px',
//           backgroundColor: 'background.default',
//           pt: '4px'
//         }}
//       >
//         {isFolded ? (
//          //if fold show multi lines
//           <Box sx={{ display: 'flex', alignItems: 'center', height: '24px', width: '100%', justifyContent: 'flex-end',bgcolor:'background.default',color:'text.primary'}}>
//             <Typography variant="caption" sx={{ fontFamily: 'inherit', mr: 0.5, }}>1</Typography>
//             <IconButton 
//               size="small" 
//               onClick={() => setIsFolded(false)}
//               sx={{ p: 0,  }}
//             >
//               <KeyboardArrowRightIcon sx={{ fontSize: 16 ,color:'text.primary'}} />
//             </IconButton>
//           </Box>
//         ) : (
//        // when unfload show all lines
//           lines.map((_, index) => (
//             <Box 
//               key={index} 
//               sx={{ 
//                 display: 'flex', 
//                 alignItems: 'center', 
//                 height: '24px', 
//                 width: '100%', 
//                 justifyContent: 'flex-end', 
//                 bgcolor:'background.default',
//                 color:'text.primary'
            
//               }}
//             >
//               <Typography variant="caption" sx={{ fontFamily: 'inherit', mr: index === 0 ? 0.5 : 2.2 ,bgcolor:'background.default',color:'text.primary'}}>
//                 {index + 1}
//               </Typography>
//               {index === 0 && (
//                 <IconButton 
//                   size="small" 
//                   onClick={() => setIsFolded(true)}
//                   sx={{ p: 0, color: 'text.primary' }}
//                 >
//                   <KeyboardArrowDownIcon sx={{ fontSize: 16,color:'text.primary' ,bgcolor:'background.default'}} />
//                 </IconButton>
//               )}
//             </Box>
//           ))
//         )}
//       </Box>

     
//       <Box sx={{ flexGrow: 1, pl: 1, pt: '4px', position: 'relative',bgcolor:'background.default',color:'text.primary' }}>
//         {isFolded ? (
        
//           <Box 
//             onClick={() => setIsFolded(false)}
//             sx={{ 
//               height: '24px', 
//               display: 'flex', 
//               alignItems: 'center', 
//               cursor: 'pointer',
//               color: 'text.primary',
//               bgcolor:'background.default',
//             }}
//           >
//             {lines[0]}
//             <Box 
//               component="span" 
//               sx={{ 
//                 bgcolor:'background.default', 
//                 borderRadius: '3px', 
//                 px: 0.5, 
//                 ml: 0.5, 
//                 fontSize: '12px',
//                 color: 'text.primary'
//               }}
//             >
//               ...
//             </Box>
//           </Box>
//         ) : (
      
//           <textarea
//             value={description}
//             onChange={handleTextChange}
//             placeholder="note..."
//             style={{
//               width: '100%',
//               height: '100%',
//               minHeight: '380px',
//               border: 'none',
//               outline: 'none',
//               resize: 'none',
//               fontFamily: 'Consolas, Monaco, "Courier New", monospace',
//               fontSize: '14px',
//               lineHeight: '24px',
//               color: 'text.primary',
//               padding: 0,
//               margin: 0,
//               backgroundColor: 'background.default',
//             }}
//           />
//         )}
//       </Box>
//     </Box>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import { Box, IconButton, Typography, TextField, Button, Paper, Divider } from '@mui/material';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';


// type PermissionLevel = 'full_access' | 'can_edit' | 'can_comment' | 'can_view';

// interface MarkdownPageProps {
//   description: string;
//   setText: (value: string) => void;
 
//   isOwner?: boolean; 
//   userPermission?: PermissionLevel; 
// }

// export function MarkdownPage({ 
//   description, 
//   setText, 
//   isOwner = true, 
//   userPermission = 'full_access' 
// }: MarkdownPageProps) {
  
//   const [isFolded, setIsFolded] = useState<boolean>(false);
//   const [comments, setComments] = useState<string[]>([]);
//   const [newComment, setNewComment] = useState<string>('');
//   const [currentPath, setCurrentPath] = useState<string>('');

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       setCurrentPath(window.location.pathname);
//     }
//   }, []);

//   const lines = description.split('\n');

//   const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setText(e.target.value);
//   };

//   const handleAddComment = () => {
//     if (newComment.trim()) {
//       setComments([...comments, newComment]);
//       setNewComment('');
//     }
//   };

 
//   const canEdit = isOwner || userPermission === 'full_access' || userPermission === 'can_edit';
  
  
//   const shouldShowCommentBox = userPermission === 'can_comment' || userPermission === 'full_access';

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2, p: 2 }}>
      
     
//       <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'grey.50' }}>
//         <Typography variant="body2" color="text.secondary">
//           <strong>Active Document Path:</strong> {currentPath || "Loading path..."}
//         </Typography>
//       </Paper>

//       {/* Editor Main Area */}
//       <Box 
//         sx={{ 
//           display: 'flex', 
//           fontFamily: 'Consolas, Monaco, "Courier New", monospace',
//           fontSize: '14px',
//           minHeight: '400px',
//           width: '100%',
//           border: '1px solid #f0f0f0',
//           p: 1,
//           bgcolor: 'background.default',
//           color: 'text.primary'
//         }}
//       >
//         {/* linenumber area */}
//         <Box 
//           sx={{ 
//             display: 'flex', 
//             flexDirection: 'column', 
//             alignItems: 'flex-end', 
//             userSelect: 'none',
//             color: 'text.primary',
//             pr: 1,
//             borderRight: '1px solid #f0f0f0',
//             minWidth: '35px',
//             backgroundColor: 'background.default',
//             pt: '4px'
//           }}
//         >
//           {isFolded ? (
//             <Box sx={{ display: 'flex', alignItems: 'center', height: '24px', width: '100%', justifyContent: 'flex-end', bgcolor: 'background.default', color: 'text.primary' }}>
//               <Typography variant="caption" sx={{ fontFamily: 'inherit', mr: 0.5 }}>1</Typography>
//               <IconButton 
//                 size="small" 
//                 onClick={() => setIsFolded(false)}
//                 sx={{ p: 0 }}
//               >
//                 <KeyboardArrowRightIcon sx={{ fontSize: 16, color: 'text.primary' }} />
//               </IconButton>
//             </Box>
//           ) : (
//             lines.map((_, index) => (
//               <Box 
//                 key={index} 
//                 sx={{ 
//                   display: 'flex', 
//                   alignItems: 'center', 
//                   height: '24px', 
//                   width: '100%', 
//                   justifyContent: 'flex-end', 
//                   bgcolor: 'background.default',
//                   color: 'text.primary'
//                 }}
//               >
//                 <Typography variant="caption" sx={{ fontFamily: 'inherit', mr: index === 0 ? 0.5 : 2.2, bgcolor: 'background.default', color: 'text.primary' }}>
//                   {index + 1}
//                 </Typography>
//                 {index === 0 && (
//                   <IconButton 
//                     size="small" 
//                     onClick={() => setIsFolded(true)}
//                     sx={{ p: 0, color: 'text.primary' }}
//                   >
//                     <KeyboardArrowDownIcon sx={{ fontSize: 16, color: 'text.primary', bgcolor: 'background.default' }} />
//                   </IconButton>
//                 )}
//               </Box>
//             ))
//           )}
//         </Box>

//         {/* Text Area Content */}
//         <Box sx={{ flexGrow: 1, pl: 1, pt: '4px', position: 'relative', bgcolor: 'background.default', color: 'text.primary' }}>
//           {isFolded ? (
//             <Box 
//               onClick={() => { if (canEdit) setIsFolded(false); }}
//               sx={{ 
//                 height: '24px', 
//                 display: 'flex', 
//                 alignItems: 'center', 
//                 cursor: canEdit ? 'pointer' : 'default',
//                 color: 'text.primary',
//                 bgcolor: 'background.default',
//               }}
//             >
//               {lines[0]}
//               <Box 
//                 component="span" 
//                 sx={{ 
//                   bgcolor: 'background.default', 
//                   borderRadius: '3px', 
//                   px: 0.5, 
//                   ml: 0.5, 
//                   fontSize: '12px',
//                   color: 'text.primary'
//                 }}
//               >
//                 ...
//               </Box>
//             </Box>
//           ) : (
//             <textarea
//               value={description}
//               onChange={handleTextChange}
//               disabled={!canEdit} // can_view သို့မဟုတ် can_comment ဆိုရင် edit လုပ်လို့မရအောင် ပိတ်ထားမည်
//               placeholder={canEdit ? "note..." : "View only mode (Read Only)"}
//               style={{
//                 width: '100%',
//                 height: '100%',
//                 minHeight: '380px',
//                 border: 'none',
//                 outline: 'none',
//                 resize: 'none',
//                 fontFamily: 'Consolas, Monaco, "Courier New", monospace',
//                 fontSize: '14px',
//                 lineHeight: '24px',
//                 color: 'text.primary',
//                 padding: 0,
//                 margin: 0,
//                 backgroundColor: canEdit ? 'transparent' : '#f5f5f5', // Edit လုပ်ခွင့်မရှိရင် နောက်ခံ အရောင်ပြောင်းပေးမည်
//                 cursor: canEdit ? 'text' : 'not-allowed'
//               }}
//             />
//           )}
//         </Box>
//       </Box>

//       {/* 2. Comment Box ကြီးကို 'can_comment' သို့မဟုတ် 'full_access' ဖြစ်မှသာ အောက်တွင် ဖော်ပြပေးမည် */}
//       {shouldShowCommentBox && (
//         <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: 'background.paper' }}>
//           <Typography variant="subtitle2" sx={{ mb: 1 }}>Comments Section</Typography>
//           <Divider sx={{ mb: 1.5 }} />
          
//           {/* List of comments */}
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2, maxHeight: '150px', overflowY: 'auto' }}>
//             {comments.length === 0 ? (
//               <Typography variant="body2" color="text.secondary">No comments yet.</Typography>
//             ) : (
//               comments.map((comment, index) => (
//                 <Box key={index} sx={{ bgcolor: 'action.hover', p: 1, borderRadius: 1 }}>
//                   <Typography variant="body2">{comment}</Typography>
//                 </Box>
//               ))
//             )}
//           </Box>

//           {/* Comment Input */}
//           <Box sx={{ display: 'flex', gap: 1 }}>
//             <TextField
//               size="small"
//               fullWidth
//               placeholder="Write a comment..."
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//             />
//             <Button variant="contained" onClick={handleAddComment} size="small">
//               Comment
//             </Button>
//           </Box>
//         </Paper>
//       )}

//     </Box>
//   );
// }

import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Typography, TextField, Button, Paper, Divider } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

type PermissionLevel = 'full_access' | 'can_edit' | 'can_comment' | 'can_view';

interface MarkdownPageProps {
  description: string;
  setText: (value: string) => void;
  isOwner?: boolean; 
  userPermission?: PermissionLevel; 
}

export function MarkdownPage({ 
  description, 
  setText, 
  isOwner = true, 
  userPermission = 'full_access' 
}: MarkdownPageProps) {
  
  // Local State သုံးပြီး စာရိုက်ရတာ ထစ်ထစ်မနေအောင် ထိန်းသိမ်းခြင်း
  const [localText, setLocalText] = useState<string>(description);
  const [isFolded, setIsFolded] = useState<boolean>(false);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [currentPath, setCurrentPath] = useState<string>('');

  // Parent Prop ကနေ description အသစ်ဝင်လာရင် Local State ကို လိုက်ပြောင်းပေးခြင်း
  useEffect(() => {
    if (description !== localText) {
      setLocalText(description);
    }
  }, [description]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  // Line counter အတွက် လက်ရှိ local text ကို သုံးပြီး split လုပ်ခြင်း
  const lines = localText.split('\n');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLocalText(value); // Local State ကို အရင်ချောမွေ့စွာ ပြောင်းလဲစေမည်
    setText(value);      // Parent State ဆီ တစ်ပါတည်း ပို့ပေးမည်
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment('');
    }
  };

  const canEdit = isOwner || userPermission === 'full_access' || userPermission === 'can_edit';
  const shouldShowCommentBox = userPermission === 'can_comment' || userPermission === 'full_access';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2, p: 2 }}>
      
      {/* Document Path Area */}
      {/* <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'action.hover', borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Active Document Path:</strong> {currentPath || "Loading path..."}
        </Typography>
      </Paper> */}

      {/* Editor Main Area */}
      <Box 
        sx={{ 
          display: 'flex', 
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
          fontSize: '14px',
          minHeight: '400px',
          width: '100%',
          border: '1px solid #f0f0f0',
          p: 1,
          bgcolor: 'background.default',
          color: 'text.primary'
        }}
      >
        {/* linenumber area */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-end', 
            userSelect: 'none',
            color: 'text.secondary',
            pr: 1,
            borderRight: '1px solid #f0f0f0',
            minWidth: '35px',
            backgroundColor: 'background.default',
            pt: '4px'
          }}
        >
          {isFolded ? (
            <Box sx={{ display: 'flex', alignItems: 'center', height: '24px', width: '100%', justifyContent: 'flex-end', bgcolor: 'background.default', color: 'text.primary' }}>
              <Typography variant="caption" sx={{ fontFamily: 'inherit', mr: 0.5 }}>1</Typography>
              <IconButton 
                size="small" 
                onClick={() => setIsFolded(false)}
                sx={{ p: 0 }}
              >
                <KeyboardArrowRightIcon sx={{ fontSize: 16, color: 'text.primary' }} />
              </IconButton>
            </Box>
          ) : (
            lines.map((_, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  height: '24px', 
                  width: '100%', 
                  justifyContent: 'flex-end', 
                  bgcolor: 'background.default',
                  color: 'text.primary'
                }}
              >
                <Typography variant="caption" sx={{ fontFamily: 'inherit', mr: index === 0 ? 0.5 : 2.2, bgcolor: 'background.default', color: 'text.secondary' }}>
                  {index + 1}
                </Typography>
                {index === 0 && (
                  <IconButton 
                    size="small" 
                    onClick={() => setIsFolded(true)}
                    sx={{ p: 0, color: 'text.primary' }}
                  >
                    <KeyboardArrowDownIcon sx={{ fontSize: 16, color: 'text.primary', bgcolor: 'background.default' }} />
                  </IconButton>
                )}
              </Box>
            ))
          )}
        </Box>

        {/* Text Area Content */}
        <Box sx={{ flexGrow: 1, pl: 1, pt: '4px', position: 'relative', bgcolor: 'background.default', color: 'text.primary' }}>
          {isFolded ? (
            <Box 
              onClick={() => { if (canEdit) setIsFolded(false); }}
              sx={{ 
                height: '24px', 
                display: 'flex', 
                alignItems: 'center', 
                cursor: canEdit ? 'pointer' : 'default',
                color: 'text.primary',
                bgcolor: 'background.default',
              }}
            >
              {lines[0]}
              <Box 
                component="span" 
                sx={{ 
                  bgcolor: 'action.selected', 
                  borderRadius: '3px', 
                  px: 0.5, 
                  ml: 0.5, 
                  fontSize: '12px',
                  color: 'text.secondary'
                }}
              >
                ...
              </Box>
            </Box>
          ) : (
            <textarea
              value={localText}
              onChange={handleTextChange}
              disabled={!canEdit}
              placeholder={canEdit ? "note..." : "View only mode (Read Only)"}
              style={{
                width: '100%',
                height: '100%',
                minHeight: '380px',
                border: 'none',
                outline: 'none',
                resize: 'none',
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                fontSize: '14px',
                lineHeight: '24px',
                color: canEdit ? 'inherit' : '#888888',
                padding: 0,
                margin: 0,
                backgroundColor: 'transparent', 
                cursor: canEdit ? 'text' : 'not-allowed'
              }}
            />
          )}
        </Box>
      </Box>

    
      {/* {shouldShowCommentBox && (
        <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: 'background.paper' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Comments Section</Typography>
          <Divider sx={{ mb: 1.5 }} />
          
         
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2, maxHeight: '150px', overflowY: 'auto' }}>
            {comments.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No comments yet.</Typography>
            ) : (
              comments.map((comment, index) => (
                <Box key={index} sx={{ bgcolor: 'action.hover', p: 1, borderRadius: 1 }}>
                  <Typography variant="body2">{comment}</Typography>
                </Box>
              ))
            )}
          </Box>

        
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button variant="contained" onClick={handleAddComment} size="small" sx={{ textTransform: 'none' }}>
              Comment
            </Button>
          </Box>
        </Paper>
      )} */}

    </Box>
  );
}