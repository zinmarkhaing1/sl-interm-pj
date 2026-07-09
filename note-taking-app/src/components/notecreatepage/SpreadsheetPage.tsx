// import  { useState } from 'react';
// import { Box,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, InputBase } from '@mui/material';

// interface SpreadSheetPage{
//     description: string;
//   setText: (value: string) => void;
// }
// export function SpreadsheetPage({description,setText}:SpreadSheetPage) {
  
//   const NUM_ROWS = 6;
//   const cols = ['A', 'B', 'C', 'D', 'E'];

// const [gridData, setGridData] = useState<string[][]>(
//   Array(NUM_ROWS).fill(null).map(() => Array(cols.length).fill(''))
// );

// const handleCellChange = (rowIndex:number,colIndex: number,value:string) => {
//   const updateGrid = gridData.map((row, rowIdx) =>
//     row .map((cell,cIdx) => (rowIdx === rowIndex && cIdx === colIndex ? value : cell))
// );
// setGridData(updateGrid);
// setText(JSON.stringify(updateGrid));
// }
//   return (
//     <Box sx={{ p: 3 }}>
      
//       <TableContainer component={Paper} variant="outlined">
//         <Table size="small">
//           <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
//             <TableRow>
//               <TableCell style={{ width: 50, textAlign: 'center' }}>#</TableCell>
//               {cols.map((col) => (
//                 <TableCell key={col} align="center">{col}</TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {gridData.map((row,rowIndex) =>(
//               <TableRow key={rowIndex}>
//                 <TableCell align='center' sx={{backgroundColor:"#f5f5f5"}}>
//                   {rowIndex + 1}
//                 </TableCell>
//                  {row.map((cellValue, colIndex) => (
//                   <TableCell key={colIndex} sx={{ p: 0, borderRight: '1px solid #e0e0e0' }}>
//                     <InputBase value={cellValue} 
//                     onChange={(e) => handleCellChange(rowIndex,colIndex,e.target.value)}
//                     sx={{ px: 1, width: '100%', height: '35px' }} />
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
            
               
             
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// }

// import { useState, useEffect } from 'react';
// import { 
//   Box, Table, TableBody, TableCell, TableContainer, TableHead, 
//   TableRow, Paper, InputBase, Typography, Divider, IconButton 
// } from '@mui/material';
// import UndoIcon from '@mui/icons-material/Undo';
// import RedoIcon from '@mui/icons-material/Redo';
// import PrintIcon from '@mui/icons-material/Print';
// import FormatBoldIcon from '@mui/icons-material/FormatBold';
// import FormatItalicIcon from '@mui/icons-material/FormatItalic';
// import BorderAllIcon from '@mui/icons-material/BorderAll';
// import FunctionsIcon from '@mui/icons-material/Functions';

// interface SpreadSheetPageProps {
//   description: string;
//   setText: (value: string) => void;
// }

// export function SpreadsheetPage({ description, setText }: SpreadSheetPageProps) {
  
//   const NUM_ROWS = 35;
//   const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

//   // Grid Data Initialization (with JSON parsing safeguard)
//   const [gridData, setGridData] = useState<string[][]>(() => {
//     try {
//       if (description) {
//         const parsed = JSON.parse(description);
//         if (Array.isArray(parsed) && parsed.length > 0) return parsed;
//       }
//     } catch (err) {
//       console.error(err);
//     }
//     return Array(NUM_ROWS).fill(null).map(() => Array(cols.length).fill(''));
//   });

//   // focus cell location (bolder blue color)
//   const [activeCell, setActiveCell] = useState<{ rowIndex: number; colIndex: number } | null>(null);

//   //update grid data
//   useEffect(() => {
//     try {
//       if (description) {
//         const parsed = JSON.parse(description);
//         if (JSON.stringify(parsed) !== JSON.stringify(gridData)) {
//           setGridData(parsed);
//         }
//       }
//     } catch (e) {
      
//     }
//   }, [description]);

//   const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
//     const updateGrid = gridData.map((row, rowIdx) =>
//       row.map((cell, cIdx) => (rowIdx === rowIndex && cIdx === colIndex ? value : cell))
//     );
//     setGridData(updateGrid);
//     setText(JSON.stringify(updateGrid));
//   };

//   return (
//     <Box sx={{ p: 2, backgroundColor: 'background.default', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
//       {/*excel Toolbar section */}
//       <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pb: 1, flexWrap: 'wrap' }}>
//         <IconButton size="small"><UndoIcon fontSize="small" /></IconButton>
//         <IconButton size="small"><RedoIcon fontSize="small" /></IconButton>
//         <IconButton size="small"><PrintIcon fontSize="small" /></IconButton>
//         <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        
//         <Typography variant="body2" sx={{ px: 1,color:'text.primary', cursor: 'pointer' }}>Normal</Typography>
//         <Typography variant="body2" sx={{ px: 1, color:'text.primary', fontFamily: 'Arial', cursor: 'pointer' }}>Arial</Typography>
//         <Typography variant="body2" sx={{ px: 1 ,color:'text.primary'}}>11</Typography>
        
//         <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
//         <IconButton size="small"><FormatBoldIcon fontSize="small" /></IconButton>
//         <IconButton size="small"><FormatItalicIcon fontSize="small" /></IconButton>
//         <IconButton size="small"><BorderAllIcon fontSize="small" /></IconButton>
//         <IconButton size="small"><FunctionsIcon fontSize="small" /></IconButton>
//       </Box>

//       <Divider sx={{ mb: 1 }} />

//       {/* spreadsheet table */}
//       <TableContainer 
//         component={Paper} 
//         variant="outlined" 
//         sx={{ 
//           maxHeight: 'calc(100vh - 120px)', 
//           overflow: 'auto', 
//           borderRadius: 0,
//           borderColor: '#d0d0d0'
//         }}
//       >
//         <Table size="small" stickyHeader aria-label="spreadsheet table">
//           {/* Header Row (A, B, C, D...) */}
//           <TableHead>
//             <TableRow>
//               <TableCell 
//                 style={{ 
//                   width: 50, 
//                   textAlign: 'center', 
//                   backgroundColor: '#f8f9fa', 
//                   fontWeight: 'bold',
//                   borderRight: '1px solid #e0e0e0',
//                   borderBottom: '1px solid #e0e0e0',
//                   color: '#5f6368',
//                   padding: '4px'
//                 }}
//               >
                
//               </TableCell>
//               {cols.map((col, index) => (
//                 <TableCell 
//                   key={col} 
//                   align="center"
//                   style={{
//                     backgroundColor: '#f8f9fa',
//                     fontWeight: 500,
//                     borderRight: '1px solid #e0e0e0',
//                     borderBottom: '1px solid #e0e0e0',
//                     color: '#5f6368',
//                     padding: '4px',
//                     width: '100px'
//                   }}
//                 >
//                   {col}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
          
//           {/* Table Body (1 to 35 Rows) */}
//           <TableBody>
//             {gridData.map((row, rowIndex) => (
//               <TableRow key={rowIndex} style={{ height: '28px' }}>
//                 {/* Row Number Side Index */}
//                 <TableCell 
//                   align='center' 
//                   sx={{
//                     backgroundColor: '#f8f9fa',
//                     borderRight: '1px solid #e0e0e0',
//                     borderBottom: '1px solid #e0e0e0',
//                     color: '#5f6368',
//                     userSelect: 'none',
//                     p: 0,
//                     fontSize: '13px'
//                   }}
//                 >
//                   {rowIndex + 1}
//                 </TableCell>

//                 {/* Input Cells */}
//                 {row.map((cellValue, colIndex) => {
//                   const isFocused = activeCell?.rowIndex === rowIndex && activeCell?.colIndex === colIndex;

//                   return (
//                     <TableCell 
//                       key={colIndex} 
//                       onFocus={() => setActiveCell({ rowIndex, colIndex })}
//                       onBlur={() => setActiveCell(null)}
//                       sx={{ 
//                         p: 0, 
//                         borderRight: '1px solid #e2e2e2', 
//                         borderBottom: '1px solid #e2e2e2',
//                         position: 'relative',
                        
//                         outline: isFocused ? '2px solid #973aa8' : 'none',
//                         zIndex: isFocused ? 2 : 1
//                       }}
//                     >
//                       <InputBase 
//                         value={cellValue} 
//                         onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
//                         sx={{ 
//                           px: 1, 
//                           width: '100%', 
//                           height: '26px',
//                           fontSize: '13px',
//                           fontFamily: 'Arial, sans-serif'
//                         }} 
//                       />
//                     </TableCell>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// }

import { useState, useEffect, useRef } from 'react';
import { 
  Box, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, InputBase, Divider, IconButton, Select, MenuItem 
} from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import PrintIcon from '@mui/icons-material/Print';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import BorderAllIcon from '@mui/icons-material/BorderAll';
import FunctionsIcon from '@mui/icons-material/Functions';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

// Cell တစ်ခုချင်းစီရဲ့ value ရော style ပါ သိမ်းဆည်းရန် Interface
interface CellObject {
  value: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  align?: 'left' | 'center' | 'right';
  fontFamily?: string;
  fontSize?: string;
}

interface SpreadSheetPageProps {
  description: string;
  setText: (value: string) => void;
}

export function SpreadsheetPage({ description, setText }: SpreadSheetPageProps) {
  const NUM_ROWS = 35;
  const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

  const isUpdatingFromProp = useRef(false);
  const isInitialMount = useRef(true);

  // Default structure initialization
  const createEmptyGrid = () => 
    Array(NUM_ROWS).fill(null).map(() => 
      Array(cols.length).fill(null).map(() => ({ value: '' }))
    );

  const [gridData, setGridData] = useState<CellObject[][]>(() => {
    try {
      if (description && description.trim() !== '') {
        const parsed = JSON.parse(description);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.error(err);
    }
    return createEmptyGrid();
  });

  const [activeCell, setActiveCell] = useState<{ rowIndex: number; colIndex: number } | null>(null);

  // History tracking arrays for Undo/Redo operations
  const [history, setHistory] = useState<CellObject[][][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    try {
      if (description && description.trim() !== '') {
        const parsed = JSON.parse(description);
        if (JSON.stringify(parsed) !== JSON.stringify(gridData)) {
          isUpdatingFromProp.current = true; 
          setGridData(parsed);
        }
      }
    } catch (e) {}
    isInitialMount.current = false;
  }, [description]);

  useEffect(() => {
    if (isUpdatingFromProp.current) {
      isUpdatingFromProp.current = false;
      return; 
    }
    if (!isInitialMount.current) {
      setText(JSON.stringify(gridData));
    }
  }, [gridData, setText]);

  // State update mechanism that logs historical records
  const updateGridState = (newGrid: CellObject[][]) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    setHistory([...nextHistory, gridData]);
    setHistoryIndex(nextHistory.length);
    setGridData(newGrid);
  };

  const handleCellChange = (rowIndex: number, colIndex: number, val: string) => {
    const updated = gridData.map((row, rIdx) =>
      row.map((cell, cIdx) => (rIdx === rowIndex && cIdx === colIndex ? { ...cell, value: val } : cell))
    );
    updateGridState(updated);
  };

  // --- Toolbar Commands Logic ---
  const applyToolbarStyle = (key: keyof CellObject, value: any) => {
    if (!activeCell) return;
    const { rowIndex, colIndex } = activeCell;

    const updated = gridData.map((row, rIdx) =>
      row.map((cell, cIdx) => {
        if (rIdx === rowIndex && cIdx === colIndex) {
          const currentVal = cell[key];
          return { ...cell, [key]: currentVal === value ? undefined : value };
        }
        return cell;
      })
    );
    updateGridState(updated);
  };

  const handleUndo = () => {
    if (historyIndex >= 0) {
      const previous = history[historyIndex];
      setHistoryIndex(historyIndex - 1);
      setGridData(previous);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextState = history[nextIndex];
      setHistoryIndex(nextIndex);
      setGridData(nextState);
    }
  };

  // Dropdown states for current selected active cell representation
  const currentCell = activeCell ? gridData[activeCell.rowIndex][activeCell.colIndex] : null;
  const currentFont = currentCell?.fontFamily || 'Arial';
  const currentSize = currentCell?.fontSize || '11';

  return (
    <Box sx={{ p: 2, backgroundColor: '#f8f9fa', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* aNotepad Styled Interactive Toolbar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pb: 1, flexWrap: 'wrap', backgroundColor: '#fff', p: 1, borderRadius: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <IconButton size="small" onClick={handleUndo} disabled={historyIndex < 0} title="Undo">
          <UndoIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={handleRedo} disabled={historyIndex >= history.length - 1} title="Redo">
          <RedoIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => window.print()} title="Print">
          <PrintIcon fontSize="small" />
        </IconButton>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        {/* Normal / Number / Percentage Formatter Select */}
        <Select
          size="small"
          defaultValue="Normal"
          sx={{ height: 26, fontSize: '13px', minWidth: 90, '.MuiSelect-select': { py: 0.5 } }}
        >
          <MenuItem value="Normal">Normal</MenuItem>
          <MenuItem value="Plain Text">Plain Text</MenuItem>
          <MenuItem value="Number">Number (1,000.12)</MenuItem>
          <MenuItem value="Percent">Percent (10.12%)</MenuItem>
        </Select>

        {/* Font Family Select */}
        <Select
          size="small"
          value={currentFont}
          onChange={(e) => applyToolbarStyle('fontFamily', e.target.value)}
          sx={{ height: 26, fontSize: '13px', minWidth: 120, fontFamily: currentFont }}
        >
          <MenuItem value="Arial" style={{ fontFamily: 'Arial' }}>Arial</MenuItem>
          <MenuItem value="Times New Roman" style={{ fontFamily: 'Times New Roman' }}>Times New Roman</MenuItem>
          <MenuItem value="Georgia" style={{ fontFamily: 'Georgia' }}>Georgia</MenuItem>
          <MenuItem value="Courier New" style={{ fontFamily: 'Courier New' }}>Courier New</MenuItem>
          <MenuItem value="Verdana" style={{ fontFamily: 'Verdana' }}>Verdana</MenuItem>
        </Select>

        {/* Font Size Select */}
        <Select
          size="small"
          value={currentSize}
          onChange={(e) => applyToolbarStyle('fontSize', e.target.value)}
          sx={{ height: 26, fontSize: '13px', minWidth: 60 }}
        >
          <MenuItem value="9">9</MenuItem>
          <MenuItem value="10">10</MenuItem>
          <MenuItem value="11">11</MenuItem>
          <MenuItem value="12">12</MenuItem>
          <MenuItem value="14">14</MenuItem>
        </Select>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Text Style Modifiers */}
        <IconButton size="small" color={currentCell?.bold ? 'primary' : 'default'} onClick={() => applyToolbarStyle('bold', true)}>
          <FormatBoldIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" color={currentCell?.italic ? 'primary' : 'default'} onClick={() => applyToolbarStyle('italic', true)}>
          <FormatItalicIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" color={currentCell?.underline ? 'primary' : 'default'} onClick={() => applyToolbarStyle('underline', true)}>
          <FormatUnderlinedIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" color={currentCell?.strike ? 'primary' : 'default'} onClick={() => applyToolbarStyle('strike', true)}>
          <StrikethroughSIcon fontSize="small" />
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Text Alignments */}
        <IconButton size="small" onClick={() => applyToolbarStyle('align', 'left')}>
          <FormatAlignLeftIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => applyToolbarStyle('align', 'center')}>
          <FormatAlignCenterIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => applyToolbarStyle('align', 'right')}>
          <FormatAlignRightIcon fontSize="small" />
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Action Feature Icons */}
        {/* <IconButton size="small"><BorderAllIcon fontSize="small" /></IconButton> */}
        {/* <IconButton size="small"><FilterAltIcon fontSize="small" /></IconButton> */}
        
        {/* Math Formulas Selector */}
        {/* <Select
          size="small"
          displayEmpty
          renderValue={() => <FunctionsIcon fontSize="small" style={{ marginTop: 4 }} />}
          sx={{ height: 26, width: 45, '.MuiOutlinedInput-notchedOutline': { border: 'none' } }}
        > */}
          {/* <MenuItem value="ABS">ABS</MenuItem>
          <MenuItem value="ACCRINT">ACCRINT</MenuItem>
          <MenuItem value="ACOS">ACOS</MenuItem>
          <MenuItem value="ADD">ADD</MenuItem>
          <MenuItem value="AVERAGE">AVERAGE</MenuItem>
          <MenuItem value="SUM">SUM</MenuItem>
        </Select> */}
      </Box>

      <Divider sx={{ mb: 1 }} />

      {/* Spreadsheet Table Sheet */}
      <TableContainer 
        component={Paper} 
        variant="outlined" 
        sx={{ 
          maxHeight: 'calc(100vh - 120px)', 
          overflow: 'auto', 
          borderRadius: 0,
          borderColor: '#d0d0d0',
          backgroundColor: '#fff'
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell 
                style={{ 
                  width: 45, 
                  textAlign: 'center', 
                  backgroundColor: '#f1f3f4', 
                  fontWeight: 'bold',
                  borderRight: '1px solid #chchch',
                  borderBottom: '1px solid #c0c0c0',
                  color: '#5f6368',
                  padding: '4px'
                }}
              />
              {cols.map((col) => (
                <TableCell 
                  key={col} 
                  align="center"
                  style={{
                    backgroundColor: '#f1f3f4',
                    fontWeight: 'bold',
                    borderRight: '1px solid #d0d0d0',
                    borderBottom: '1px solid #c0c0c0',
                    color: '#3c4043',
                    padding: '4px',
                    width: '110px',
                    fontSize: '12px'
                  }}
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {gridData.map((row, rowIndex) => (
              <TableRow key={rowIndex} style={{ height: '26px' }}>
                <TableCell 
                  align='center' 
                  sx={{
                    backgroundColor: '#f1f3f4',
                    borderRight: '1px solid #c0c0c0',
                    borderBottom: '1px solid #d0d0d0',
                    color: '#5f6368',
                    userSelect: 'none',
                    fontWeight: 'bold',
                    p: 0,
                    fontSize: '12px',
                    width: 45
                  }}
                >
                  {rowIndex + 1}
                </TableCell>

                {row.map((cell, colIndex) => {
                  const isFocused = activeCell?.rowIndex === rowIndex && activeCell?.colIndex === colIndex;

                  // Dynamic Style Mapping rules applied here
                  const textDecorations = [
                    cell.underline ? 'underline' : '',
                    cell.strike ? 'line-through' : ''
                  ].filter(Boolean).join(' ');

                  return (
                    <TableCell 
                      key={colIndex} 
                      onFocus={() => setActiveCell({ rowIndex, colIndex })}
                      sx={{ 
                        p: 0, 
                        borderRight: '1px solid #e0e0e0', 
                        borderBottom: '1px solid #e0e0e0',
                        position: 'relative',
                        // Active Blue Box Selector Outline effect like Google Sheets / aNotepad
                        outline: isFocused ? '2px solid #1a73e8' : 'none',
                        zIndex: isFocused ? 2 : 1
                      }}
                    >
                      <InputBase 
                        value={cell.value} 
                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                        sx={{ 
                          px: 1, 
                          width: '100%', 
                          height: '25px',
                          fontSize: cell.fontSize ? `${cell.fontSize}pt` : '11pt',
                          fontFamily: cell.fontFamily || 'Arial, sans-serif',
                          input: {
                            padding: '4px 0',
                            fontWeight: cell.bold ? 'bold' : 'normal',
                            fontStyle: cell.italic ? 'italic' : 'normal',
                            textDecoration: textDecorations || 'none',
                            textAlign: cell.align || 'left'
                          }
                        }} 
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
