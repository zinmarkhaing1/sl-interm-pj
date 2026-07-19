


// import React, { useState } from 'react';
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import Image from '@tiptap/extension-image';
// import {Table} from '@tiptap/extension-table';
// import TableRow from '@tiptap/extension-table-row';
// import TableCell from '@tiptap/extension-table-cell';
// import TableHeader from '@tiptap/extension-table-header';
// import {TextStyle} from '@tiptap/extension-text-style';
// import Color from '@tiptap/extension-color';
// import Highlight from '@tiptap/extension-highlight';
// import TextAlign from '@tiptap/extension-text-align';


// // import data from '@emoji-mart/data';
// // import Picker from '@emoji-mart/react';
// import EmojiPicker from "emoji-picker-react";

// import { 
//   Box, ToggleButton, ToggleButtonGroup, Stack, Divider, 
//   Menu, MenuItem,  Tooltip, Popover 
// } from '@mui/material';
// import { 
//   FormatBold, FormatItalic, FormatUnderlined,
//   FormatAlignLeft, FormatAlignCenter, FormatAlignRight,
//   FormatListBulleted, FormatListNumbered,
//   Undo, Redo, GridOn, 
//   FormatColorText, BorderColor, InsertEmoticon,KeyboardArrowDownOutlined,CloseOutlined
// } from '@mui/icons-material';
// import { data } from 'react-router';


// interface RichTextNotePageProps {
//   description: string;
//   setText: (value: string) => void;
// }

// export function RichTextNotePage({ description, setText }: RichTextNotePageProps) {
//   const [colorAnchor, setColorAnchor] = useState<null | HTMLElement>(null);
//   const [bgAnchor, setBgAnchor] = useState<null | HTMLElement>(null);
//   const [tableAnchor, setTableAnchor] = useState<null | HTMLElement>(null);
  

//   const [emojiAnchor, setEmojiAnchor] = useState<null | HTMLElement>(null);

//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({
//         bulletList: { keepMarks: true, keepAttributes: false },
//         orderedList: { keepMarks: true, keepAttributes: false },
//       }),
//       Underline,
//       TextStyle,
//       Color,
//       Highlight.configure({ multicolor: true }),
//       Table.configure({ resizable: true }),
//       TableRow,
//       TableHeader,
//       TableCell,
//       TextAlign.configure({
//         types: ['heading', 'paragraph'],
//       }),
//       Image.configure({
//         allowBase64: true,
//       }),
//     ],
//     content: description,
//     onUpdate: ({ editor }) => {
//       setText(editor.getHTML());
//     },
//   });

//   if (!editor) return null;

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     const files = e.dataTransfer.files;
//     if (files && files[0] && files[0].type.startsWith('image/')) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         if (typeof reader.result === 'string') {
//           editor.chain().focus().setImage({ src: reader.result }).run();
//         }
//       };
//       reader.readAsDataURL(files[0]);
//     }
//   };

  
//   const handleEmojiSelect = (emoji: any) => {
//     editor.chain().focus().insertContent(emoji.native).run();
//     setEmojiAnchor(null);
//   };

//   return (
//     <Box sx={{ width: "100%", maxWidth: 900, border: "1px solid #d0d0d0", borderRadius: 1, overflow: 'hidden' }}>
      
//       <Stack 
//         direction="row" 
//         spacing={0.5} 
//         sx={{alignItems:'center',flexWrap:'wrap', p: 0.5, borderBottom: "1px solid #d0d0d0", bgcolor: "background.default" }}
//       >
//         <ToggleButtonGroup size="small" >
//           <ToggleButton value="undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><Undo sx={{fontSize:'20px'}}/></ToggleButton>
//           <ToggleButton  value="redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><Redo sx={{fontSize:'20px'}}/></ToggleButton>
//         </ToggleButtonGroup>

//         <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

//         <ToggleButtonGroup size="small">
//           <ToggleButton  value="bold" selected={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><FormatBold sx={{fontSize:'20px',}}/></ToggleButton>
//           <ToggleButton  value="italic" selected={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><FormatItalic sx={{fontSize:'20px'}}/></ToggleButton>
//           <ToggleButton  value="underline" selected={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><FormatUnderlined sx={{fontSize:'20px'}}/></ToggleButton>
//         </ToggleButtonGroup>

//         <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

//         <ToggleButtonGroup size="small">
//           <ToggleButton value="bulletList" selected={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><FormatListBulleted sx={{fontSize:'20px'}}/></ToggleButton>
//           <ToggleButton value="orderedList" selected={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><FormatListNumbered sx={{fontSize:'20px'}}/></ToggleButton>
//         </ToggleButtonGroup>

//         <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

//         <ToggleButtonGroup size="small">
//           <ToggleButton value="left" selected={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}><FormatAlignLeft sx={{fontSize:'20px'}}/></ToggleButton>
//           <ToggleButton value="center" selected={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}><FormatAlignCenter sx={{fontSize:'20px'}}/></ToggleButton>
//           <ToggleButton value="right" selected={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}><FormatAlignRight sx={{fontSize:'20px'}}/></ToggleButton>
//         </ToggleButtonGroup>

//         <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

//         <Tooltip title="Text Color">
//           <Box  onClick={(e) => setColorAnchor(e.currentTarget)} sx={{borderRadius:2, '&hover':{border:'1px solid #010101'}}}>
//             <FormatColorText sx={{ color: editor.getAttributes('textStyle').color || 'inherit' ,fontSize:'20px'}} />
//             <KeyboardArrowDownOutlined sx={{fontSize:'16px'}}/>
//           </Box>
//         </Tooltip>
        
//         <Menu 
//   anchorEl={colorAnchor} 
//   open={Boolean(colorAnchor)} 
//   onClose={() => setColorAnchor(null)}
  
//   slotProps={{
//     list:{
//       sx:{
//         display:'grid',
//         gridTemplateColumns: 'repeat(8,1fr)',
//         gap:'4px',
//         padding:'8px',
//       }
//     }
    
//   }}
// >
  
//   {[
//     '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffaa00', '#9c27b0', '#3498db', '#e74c3c',
//     '#9b59b6', '#ffff00', '#ff40d6', '#e67e22', '#2ecc71', '#76ff03', '#1abc9c', '#0c3866',
//     '#ff9f43', '#008080', '#e5a93b', '#6c5ce7', '#ffffff', '#a4a4a4', '#1b5e20', '#546e7a',
//     '#2e118c', '#558b2f', '#ffc107', '#ffb3a7', '#800000', '' 
//   ].map((c, index) => {
//     const isNoColor = c === '';

//     return (
//       <MenuItem 
//         key={index} 
//         onClick={() => { 
//           if (isNoColor) {
//             editor.chain().focus().unsetColor().run();
//           } else {
//             editor.chain().focus().setColor(c).run(); 
//           }
//           setColorAnchor(null); 
//         }}
//         sx={{
//           padding: 0,
//           minWidth: 'auto',
//           borderRadius: '2px',
//           '&:hover': { backgroundColor: 'transparent' } // MenuItem hover default background 
//         }}
//       >
//         <Box 
//           sx={{ 
//             width: 24, 
//             height: 24, 
//             bgcolor: isNoColor ? '#ffffff' : c, 
//             borderRadius: '2px', 
//             border: '1px solid #ccc',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             cursor: 'pointer',
//             '&:hover': {
//               borderColor: '#666',
//             }
//           }}
//         >
       
//           {isNoColor && <CloseOutlined sx={{ fontSize: 16, color: '#777' }} />}
//         </Box>
//       </MenuItem>
//     );
//   })}
// </Menu>

//         <Tooltip title="Background Color">
//           <Box  onClick={(e) => setBgAnchor(e.currentTarget)} sx={{borderRadius:2, '&hover':{border:'1px solid #010101'}}}>
//             <BorderColor sx={{fontSize:'20px'}}/>
//             <KeyboardArrowDownOutlined sx={{fontSize:'16px'}}/>
//           </Box>
//         </Tooltip>
       

// <Menu 
//   anchorEl={bgAnchor} 
//   open={Boolean(bgAnchor)} 
//   onClose={() => setBgAnchor(null)}

//   slotProps={{
//     list: {
//       sx: {
//         display: 'grid',
//         gridTemplateColumns: 'repeat(8, 1fr)', 
//         gap: '4px',
//         padding: '8px',
//       },
//     },
//   }}
// >
//   {[
//     '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffaa00', '#9c27b0', '#3498db', '#e74c3c',
//     '#9b59b6', '#ffff00', '#ff40d6', '#e67e22', '#2ecc71', '#76ff03', '#1abc9c', '#0c3866',
//     '#ff9f43', '#008080', '#e5a93b', '#6c5ce7', '#ffffff', '#a4a4a4', '#1b5e20', '#546e7a',
//     '#2e118c', '#558b2f', '#ffc107', '#ffb3a7', '#800000', '' 
//   ].map((c, index) => {
//     const isNoColor = c === '';

//     return (
//       <MenuItem 
//         key={index} 
//         onClick={() => { 
//           if (isNoColor) {
//             editor.chain().focus().unsetHighlight().run(); 
//           } else {
//             editor.chain().focus().setHighlight({ color: c }).run();
//           }
//           setBgAnchor(null);
//         }}
//         sx={{
//           padding: 0,
//           minWidth: 'auto',
//           borderRadius: '2px',
//           '&:hover': { backgroundColor: 'transparent' }
//         }}
//       >
//         <Box 
//           sx={{ 
//             width: 24, 
//             height: 24, 
//             bgcolor: isNoColor ? '#ffffff' : c, 
//             borderRadius: '2px', 
//             border: '1px solid #ccc',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             cursor: 'pointer',
//             '&:hover': {
//               borderColor: '#666',
//             }
//           }}
//         >
//           {isNoColor && <CloseOutlined sx={{ fontSize: 16, color: '#777' }} />}
//         </Box>
//       </MenuItem>
//     );
//   })}
// </Menu>

//         <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

//         <Tooltip title="Table Menu">
//           <Box onClick={(e) => setTableAnchor(e.currentTarget)} sx={{}}>
//             <GridOn sx={{fontSize:'20px'}}/>
//           </Box>
//         </Tooltip>
//         <Menu anchorEl={tableAnchor} open={Boolean(tableAnchor)} onClose={() => setTableAnchor(null)}>
//           <MenuItem onClick={() => { editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(); setTableAnchor(null); }}>Insert Table (3x3)</MenuItem>
//           <MenuItem onClick={() => { editor.chain().focus().addColumnAfter().run(); setTableAnchor(null); }}>Add Column After</MenuItem>
//           <MenuItem onClick={() => { editor.chain().focus().addRowAfter().run(); setTableAnchor(null); }}>Add Row After</MenuItem>
//           <MenuItem onClick={() => { editor.chain().focus().deleteColumn().run(); setTableAnchor(null); }} sx={{ color: 'red' }}>Delete Column</MenuItem>
//           <MenuItem onClick={() => { editor.chain().focus().deleteRow().run(); setTableAnchor(null); }} sx={{ color: 'red' }}>Delete Row</MenuItem>
//           <MenuItem onClick={() => { editor.chain().focus().deleteTable().run(); setTableAnchor(null); }} sx={{ color: 'red' }}>Delete Entire Table</MenuItem>
//         </Menu>

 
//         <Tooltip title="Insert Emoji">
//           <Box  onClick={(e) => setEmojiAnchor(e.currentTarget)}>
//             <InsertEmoticon sx={{fontSize:'20px'}}/>
//           </Box>
//         </Tooltip>
        
//         <Popover
//           open={Boolean(emojiAnchor)}
//           anchorEl={emojiAnchor}
//           onClose={() => setEmojiAnchor(null)}
//           anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//         >
//           {/* Emoji Mart Picker Window */}
//           <EmojiPicker 
//           emojiData={data}
//             onEmojiSelect={handleEmojiSelect} 
//             theme="light"
//             navPosition="bottom" 
//             previewPosition="none"
//           />
//         </Popover>

//       </Stack>

//       <Box 
//         onDrop={handleDrop} 
//         onDragOver={(e) => e.preventDefault()}
//         sx={{
//           p: 2,
//           minHeight: '350px',
//           bgcolor: 'background.default',
//           cursor: 'text',
//           '& .tiptap': {
//             outline: 'none',
//             minHeight: '350px',
//             fontSize: '14px',
//             fontFamily: 'Helvetica, Arial, sans-serif',
//             '& ul': { listStyleType: 'disc', pl: 4 },
//             '& ol': { listStyleType: 'decimal', pl: 4 },
//             '& table': {
//               borderCollapse: 'collapse',
//               tableLayout: 'fixed',
//               width: '100%',
//               margin: '12px 0',
//               overflow: 'hidden',
//               '& td, & th': {
//                 minWidth: '1em',
//                 border: '1px solid #ced4da',
//                 padding: '6px 8px',
//                 verticalAlign: 'top',
//                 boxSizing: 'border-box',
//                 position: 'relative',
//               },
//               '& th': {
//                 fontWeight: 'bold',
//                 backgroundColor: 'background.default',
//                 textAlign: 'left',
//               },
//             },
//           }
//         }}
//       >
//         <EditorContent editor={editor} />
//       </Box>
//     </Box>
//   );
// }

import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import {Table} from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import {TextStyle} from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';

// ============ FIX: Remove emoji-mart import ============
// import data from '@emoji-mart/data';
// import Picker from '@emoji-mart/react';
import EmojiPicker from "emoji-picker-react";

import { 
  Box, ToggleButton, ToggleButtonGroup, Stack, Divider, 
  Menu, MenuItem,  Tooltip, Popover 
} from '@mui/material';
import { 
  FormatBold, FormatItalic, FormatUnderlined,
  FormatAlignLeft, FormatAlignCenter, FormatAlignRight,
  FormatListBulleted, FormatListNumbered,
  Undo, Redo, GridOn, 
  FormatColorText, BorderColor, InsertEmoticon,KeyboardArrowDownOutlined,CloseOutlined
} from '@mui/icons-material';

interface RichTextNotePageProps {
  description: string;
  setText: (value: string) => void;
}

export function RichTextNotePage({ description, setText }: RichTextNotePageProps) {
  const [colorAnchor, setColorAnchor] = useState<null | HTMLElement>(null);
  const [bgAnchor, setBgAnchor] = useState<null | HTMLElement>(null);
  const [tableAnchor, setTableAnchor] = useState<null | HTMLElement>(null);
  const [emojiAnchor, setEmojiAnchor] = useState<null | HTMLElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        allowBase64: true,
      }),
    ],
    content: description,
    onUpdate: ({ editor }) => {
      setText(editor.getHTML());
    },
  });

  if (!editor) return null;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          editor.chain().focus().setImage({ src: reader.result }).run();
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  // ============ FIX: Handle emoji selection for emoji-picker-react ============
  const handleEmojiSelect = (emojiData: any) => {
    // emoji-picker-react returns emoji object with 'emoji' property
    const emoji = emojiData.emoji || emojiData.native || emojiData;
    editor.chain().focus().insertContent(emoji).run();
    setEmojiAnchor(null);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 900, border: "1px solid #d0d0d0", borderRadius: 1, overflow: 'hidden' }}>
      
      <Stack 
        direction="row" 
        spacing={0.5} 
        sx={{alignItems:'center',flexWrap:'wrap', p: 0.5, borderBottom: "1px solid #d0d0d0", bgcolor: "background.default" }}
      >
        <ToggleButtonGroup size="small" >
          <ToggleButton value="undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><Undo sx={{fontSize:'20px'}}/></ToggleButton>
          <ToggleButton value="redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><Redo sx={{fontSize:'20px'}}/></ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <ToggleButtonGroup size="small">
          <ToggleButton value="bold" selected={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><FormatBold sx={{fontSize:'20px',}}/></ToggleButton>
          <ToggleButton value="italic" selected={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><FormatItalic sx={{fontSize:'20px'}}/></ToggleButton>
          <ToggleButton value="underline" selected={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><FormatUnderlined sx={{fontSize:'20px'}}/></ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <ToggleButtonGroup size="small">
          <ToggleButton value="bulletList" selected={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><FormatListBulleted sx={{fontSize:'20px'}}/></ToggleButton>
          <ToggleButton value="orderedList" selected={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><FormatListNumbered sx={{fontSize:'20px'}}/></ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <ToggleButtonGroup size="small">
          <ToggleButton value="left" selected={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}><FormatAlignLeft sx={{fontSize:'20px'}}/></ToggleButton>
          <ToggleButton value="center" selected={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}><FormatAlignCenter sx={{fontSize:'20px'}}/></ToggleButton>
          <ToggleButton value="right" selected={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}><FormatAlignRight sx={{fontSize:'20px'}}/></ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <Tooltip title="Text Color">
          <Box onClick={(e) => setColorAnchor(e.currentTarget)} sx={{borderRadius:2, '&hover':{border:'1px solid #010101'}}}>
            <FormatColorText sx={{ color: editor.getAttributes('textStyle').color || 'inherit' ,fontSize:'20px'}} />
            <KeyboardArrowDownOutlined sx={{fontSize:'16px'}}/>
          </Box>
        </Tooltip>
        
        <Menu 
          anchorEl={colorAnchor} 
          open={Boolean(colorAnchor)} 
          onClose={() => setColorAnchor(null)}
          slotProps={{
            list:{
              sx:{
                display:'grid',
                gridTemplateColumns: 'repeat(8,1fr)',
                gap:'4px',
                padding:'8px',
              }
            }
          }}
        >
          {[
            '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffaa00', '#9c27b0', '#3498db', '#e74c3c',
            '#9b59b6', '#ffff00', '#ff40d6', '#e67e22', '#2ecc71', '#76ff03', '#1abc9c', '#0c3866',
            '#ff9f43', '#008080', '#e5a93b', '#6c5ce7', '#ffffff', '#a4a4a4', '#1b5e20', '#546e7a',
            '#2e118c', '#558b2f', '#ffc107', '#ffb3a7', '#800000', '' 
          ].map((c, index) => {
            const isNoColor = c === '';

            return (
              <MenuItem 
                key={index} 
                onClick={() => { 
                  if (isNoColor) {
                    editor.chain().focus().unsetColor().run();
                  } else {
                    editor.chain().focus().setColor(c).run(); 
                  }
                  setColorAnchor(null); 
                }}
                sx={{
                  padding: 0,
                  minWidth: 'auto',
                  borderRadius: '2px',
                  '&:hover': { backgroundColor: 'transparent' }
                }}
              >
                <Box 
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    bgcolor: isNoColor ? '#ffffff' : c, 
                    borderRadius: '2px', 
                    border: '1px solid #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: '#666',
                    }
                  }}
                >
                  {isNoColor && <CloseOutlined sx={{ fontSize: 16, color: '#777' }} />}
                </Box>
              </MenuItem>
            );
          })}
        </Menu>

        <Tooltip title="Background Color">
          <Box onClick={(e) => setBgAnchor(e.currentTarget)} sx={{borderRadius:2, '&hover':{border:'1px solid #010101'}}}>
            <BorderColor sx={{fontSize:'20px'}}/>
            <KeyboardArrowDownOutlined sx={{fontSize:'16px'}}/>
          </Box>
        </Tooltip>
       
        <Menu 
          anchorEl={bgAnchor} 
          open={Boolean(bgAnchor)} 
          onClose={() => setBgAnchor(null)}
          slotProps={{
            list: {
              sx: {
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)', 
                gap: '4px',
                padding: '8px',
              },
            },
          }}
        >
          {[
            '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffaa00', '#9c27b0', '#3498db', '#e74c3c',
            '#9b59b6', '#ffff00', '#ff40d6', '#e67e22', '#2ecc71', '#76ff03', '#1abc9c', '#0c3866',
            '#ff9f43', '#008080', '#e5a93b', '#6c5ce7', '#ffffff', '#a4a4a4', '#1b5e20', '#546e7a',
            '#2e118c', '#558b2f', '#ffc107', '#ffb3a7', '#800000', '' 
          ].map((c, index) => {
            const isNoColor = c === '';

            return (
              <MenuItem 
                key={index} 
                onClick={() => { 
                  if (isNoColor) {
                    editor.chain().focus().unsetHighlight().run(); 
                  } else {
                    editor.chain().focus().setHighlight({ color: c }).run();
                  }
                  setBgAnchor(null);
                }}
                sx={{
                  padding: 0,
                  minWidth: 'auto',
                  borderRadius: '2px',
                  '&:hover': { backgroundColor: 'transparent' }
                }}
              >
                <Box 
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    bgcolor: isNoColor ? '#ffffff' : c, 
                    borderRadius: '2px', 
                    border: '1px solid #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: '#666',
                    }
                  }}
                >
                  {isNoColor && <CloseOutlined sx={{ fontSize: 16, color: '#777' }} />}
                </Box>
              </MenuItem>
            );
          })}
        </Menu>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <Tooltip title="Table Menu">
          <Box onClick={(e) => setTableAnchor(e.currentTarget)} sx={{}}>
            <GridOn sx={{fontSize:'20px'}}/>
          </Box>
        </Tooltip>
        <Menu anchorEl={tableAnchor} open={Boolean(tableAnchor)} onClose={() => setTableAnchor(null)}>
          <MenuItem onClick={() => { editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(); setTableAnchor(null); }}>Insert Table (3x3)</MenuItem>
          <MenuItem onClick={() => { editor.chain().focus().addColumnAfter().run(); setTableAnchor(null); }}>Add Column After</MenuItem>
          <MenuItem onClick={() => { editor.chain().focus().addRowAfter().run(); setTableAnchor(null); }}>Add Row After</MenuItem>
          <MenuItem onClick={() => { editor.chain().focus().deleteColumn().run(); setTableAnchor(null); }} sx={{ color: 'red' }}>Delete Column</MenuItem>
          <MenuItem onClick={() => { editor.chain().focus().deleteRow().run(); setTableAnchor(null); }} sx={{ color: 'red' }}>Delete Row</MenuItem>
          <MenuItem onClick={() => { editor.chain().focus().deleteTable().run(); setTableAnchor(null); }} sx={{ color: 'red' }}>Delete Entire Table</MenuItem>
        </Menu>

        <Tooltip title="Insert Emoji">
          <Box onClick={(e) => setEmojiAnchor(e.currentTarget)}>
            <InsertEmoticon sx={{fontSize:'20px'}}/>
          </Box>
        </Tooltip>
        
        {/* ============ FIX: emoji-picker-react without emojiData prop ============ */}
        <Popover
          open={Boolean(emojiAnchor)}
          anchorEl={emojiAnchor}
          onClose={() => setEmojiAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          slotProps={{
            paper: {
              sx: {
                width: 350,
                height: 400,
                overflow: 'hidden',
                borderRadius: 2,
              }
            }
          }}
        >
          <EmojiPicker 
            onEmojiClick={handleEmojiSelect}
            width="100%"
            height="100%"
            lazyLoadEmojis={true}
          />
        </Popover>

      </Stack>

      <Box 
        onDrop={handleDrop} 
        onDragOver={(e) => e.preventDefault()}
        sx={{
          p: 2,
          minHeight: '350px',
          bgcolor: 'background.default',
          cursor: 'text',
          '& .tiptap': {
            outline: 'none',
            minHeight: '350px',
            fontSize: '14px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            '& ul': { listStyleType: 'disc', pl: 4 },
            '& ol': { listStyleType: 'decimal', pl: 4 },
            '& table': {
              borderCollapse: 'collapse',
              tableLayout: 'fixed',
              width: '100%',
              margin: '12px 0',
              overflow: 'hidden',
              '& td, & th': {
                minWidth: '1em',
                border: '1px solid #ced4da',
                padding: '6px 8px',
                verticalAlign: 'top',
                boxSizing: 'border-box',
                position: 'relative',
              },
              '& th': {
                fontWeight: 'bold',
                backgroundColor: 'background.default',
                textAlign: 'left',
              },
            },
          }
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}