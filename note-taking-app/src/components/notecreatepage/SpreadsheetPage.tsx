
import { useState, useEffect, useRef } from 'react';
import { 
  Box, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, InputBase, Divider, IconButton, Select, MenuItem,
  Tooltip, TextField, Popover,Typography
} from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
// import PrintIcon from '@mui/icons-material/Print';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import BorderAllIcon from '@mui/icons-material/BorderAll';
import BorderClearIcon from '@mui/icons-material/BorderClear';
// import MergeIcon from '@mui/icons-material/BlurOn';
// import FunctionsIcon from '@mui/icons-material/Functions';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';

interface CellObject {
  value: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  align?: 'left' | 'center' | 'right';
  fontFamily?: string;
  fontSize?: string;
  color?: string;
  bgColor?: string;
  border?: boolean;
  format?: 'general' | 'number' | 'percent' | 'currency' | 'text';
}

interface SpreadSheetPageProps {
  description: string;
  setText: (value: string) => void;
}

// color with configuration
const DEFAULT_COL_WIDTH = 120;
const MIN_COL_WIDTH = 40;
const MAX_COL_WIDTH = 400;

export function SpreadsheetPage({ description, setText }: SpreadSheetPageProps) {
  const NUM_ROWS = 50;
  const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];

  const isUpdatingFromProp = useRef(false);
  const isInitialMount = useRef(true);
  const tableRef = useRef<HTMLDivElement>(null);

  // ============ Column Width State ============
  const [colWidths, setColWidths] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('spreadsheet_col_widths');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return cols.reduce((acc, col) => ({ ...acc, [col]: DEFAULT_COL_WIDTH }), {});
  });

  // ============ Row Height State ============
  const [rowHeights, setRowHeights] = useState<Record<number, number>>(() => {
    const saved = localStorage.getItem('spreadsheet_row_heights');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {};
  });

  // ============ Selection State ============
  const [selection, setSelection] = useState<{
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
  } | null>(null);

  // ============ Resize State ============
  const [resizing, setResizing] = useState<{
    type: 'col' | 'row';
    index: string | number;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

  // ============ Grid Data ============
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

  // ============ History ============
  const [history, setHistory] = useState<CellObject[][][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // ============ Popover States ============
  const [colorPickerAnchor, setColorPickerAnchor] = useState<HTMLElement | null>(null);
  const [colorPickerType, setColorPickerType] = useState<'text' | 'bg'>('text');
  const [tempColor, setTempColor] = useState('#000000');

  // ============ Save/Load Column Width ============
  useEffect(() => {
    localStorage.setItem('spreadsheet_col_widths', JSON.stringify(colWidths));
  }, [colWidths]);

  useEffect(() => {
    localStorage.setItem('spreadsheet_row_heights', JSON.stringify(rowHeights));
  }, [rowHeights]);

  // ============ Sync with parent ============
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

  // ============ Grid Update ============
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

 
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setActiveCell({ rowIndex, colIndex });
    setSelection({
      startRow: rowIndex,
      startCol: colIndex,
      endRow: rowIndex,
      endCol: colIndex,
    });
  };

  const handleCellMouseDown = (rowIndex: number, colIndex: number) => {
    setActiveCell({ rowIndex, colIndex });
    setSelection({
      startRow: rowIndex,
      startCol: colIndex,
      endRow: rowIndex,
      endCol: colIndex,
    });
  };

  const handleCellMouseOver = (rowIndex: number, colIndex: number) => {
    if (selection) {
      setSelection({
        ...selection,
        endRow: rowIndex,
        endCol: colIndex,
      });
    }
  };

  const isCellSelected = (rowIndex: number, colIndex: number) => {
    if (!selection) return false;
    const minRow = Math.min(selection.startRow, selection.endRow);
    const maxRow = Math.max(selection.startRow, selection.endRow);
    const minCol = Math.min(selection.startCol, selection.endCol);
    const maxCol = Math.max(selection.startCol, selection.endCol);
    return rowIndex >= minRow && rowIndex <= maxRow && 
           colIndex >= minCol && colIndex <= maxCol;
  };

  const applyStyleToSelection = (key: keyof CellObject, value: any) => {
    if (!selection) return;

    const minRow = Math.min(selection.startRow, selection.endRow);
    const maxRow = Math.max(selection.startRow, selection.endRow);
    const minCol = Math.min(selection.startCol, selection.endCol);
    const maxCol = Math.max(selection.startCol, selection.endCol);

    const updated = gridData.map((row, rIdx) =>
      row.map((cell, cIdx) => {
        if (rIdx >= minRow && rIdx <= maxRow && cIdx >= minCol && cIdx <= maxCol) {
          const currentVal = cell[key];
          return { ...cell, [key]: currentVal === value ? undefined : value };
        }
        return cell;
      })
    );
    updateGridState(updated);
  };

  const applyToolbarStyle = (key: keyof CellObject, value: any) => {
    applyStyleToSelection(key, value);
  };

  // ============ Color Handlers ============
  const handleColorChange = (color: string) => {
    const key = colorPickerType === 'text' ? 'color' : 'bgColor';
    applyStyleToSelection(key, color);
    setColorPickerAnchor(null);
  };

  // ============ Undo/Redo ============
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

  // ============ Column Resize ============
  const startColumnResize = (col: string, e: React.MouseEvent) => {
    e.preventDefault();
    const currentWidth = colWidths[col] || DEFAULT_COL_WIDTH;
    setResizing({
      type: 'col',
      index: col,
      startX: e.clientX,
      startY: 0,
      startWidth: currentWidth,
      startHeight: 0,
    });
  };

  const startRowResize = (rowIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    const currentHeight = rowHeights[rowIndex] || 26;
    setResizing({
      type: 'row',
      index: rowIndex,
      startX: 0,
      startY: e.clientY,
      startWidth: 0,
      startHeight: currentHeight,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizing) return;

      if (resizing.type === 'col') {
        const diff = e.clientX - resizing.startX;
        const newWidth = Math.min(MAX_COL_WIDTH, Math.max(MIN_COL_WIDTH, resizing.startWidth + diff));
        setColWidths(prev => ({
          ...prev,
          [resizing.index as string]: newWidth,
        }));
      } else {
        const diff = e.clientY - resizing.startY;
        const newHeight = Math.min(100, Math.max(20, resizing.startHeight + diff));
        setRowHeights(prev => ({
          ...prev,
          [resizing.index as number]: newHeight,
        }));
      }
    };

    const handleMouseUp = () => {
      setResizing(null);
    };

    if (resizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing]);

  // ============ Keyboard Shortcuts ============
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        applyToolbarStyle('bold', true);
      }
      if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        applyToolbarStyle('italic', true);
      }
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        applyToolbarStyle('underline', true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [gridData, selection]);

  // ============ Current Cell Info ============
  const currentCell = activeCell ? gridData[activeCell.rowIndex]?.[activeCell.colIndex] : null;
  const currentFont = currentCell?.fontFamily || 'Arial';
  const currentSize = currentCell?.fontSize || '11';
  const selectedCount = selection ? 
    (Math.abs(selection.endRow - selection.startRow) + 1) * 
    (Math.abs(selection.endCol - selection.startCol) + 1) : 1;

  // ============ Cell Address ============
  const getCellAddress = (rowIndex: number, colIndex: number) => {
    return `${cols[colIndex]}${rowIndex + 1}`;
  };

  return (
    <Box sx={{ 
      p: 2, 
      backgroundColor: '#f8f9fa', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      userSelect: 'none'
    }}>
      
      {/* ============ Toolbar ============ */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 0.5, 
        pb: 1, 
        flexWrap: 'wrap', 
        backgroundColor: '#fff', 
        p: 1, 
        borderRadius: 1, 
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        border: '1px solid #e0e0e0'
      }}>
        {/* Undo/Redo */}
        <Tooltip title="Undo (Ctrl+Z)">
          <IconButton size="small" onClick={handleUndo} disabled={historyIndex < 0}>
            <UndoIcon fontSize="small" sx={{color:"#212529"}}/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Redo (Ctrl+Y)">
          <IconButton size="small" onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
            <RedoIcon fontSize="small" sx={{color:"#212529"}}/>
          </IconButton>
        </Tooltip>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        {/* Cell Address */}
        <TextField
          size="small"
          value={activeCell ? getCellAddress(activeCell.rowIndex, activeCell.colIndex) : ''}
          sx={{ width: 70, '& .MuiInputBase-root': { height: 26, fontSize: '12px' },color:activeCell ? "#212529" : "black" }}
          // inputProps={{ readOnly: true }}
          slotProps={{
            input : { readOnly:true}
          }}
        />

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Font Family */}
        <Select
          size="small"
          value={currentFont}
          onChange={(e) => applyToolbarStyle('fontFamily', e.target.value)}
          sx={{ height: 26, fontSize: '13px', minWidth: 120, fontFamily: currentFont ,color:'#212529'}}
        >
          <MenuItem value="Arial" style={{ fontFamily: 'Arial' }} color='#122529'>Arial</MenuItem>
          <MenuItem value="Times New Roman" style={{ fontFamily: 'Times New Roman' }} color='#122529'>Times New Roman</MenuItem>
          <MenuItem value="Georgia" style={{ fontFamily: 'Georgia' }} color='#122529'>Georgia</MenuItem>
          <MenuItem value="Courier New" style={{ fontFamily: 'Courier New' }} color='#122529'>Courier New</MenuItem>
          <MenuItem value="Verdana" style={{ fontFamily: 'Verdana' }} color='#122529'>Verdana</MenuItem>
        </Select>

        {/* Font Size */}
        <Select
          size="small"
          value={currentSize}
          onChange={(e) => applyToolbarStyle('fontSize', e.target.value)}
          sx={{ height: 26, fontSize: '13px', minWidth: 60 ,}}
        >
          {[8,9,10,11,12,14,16,18,20,24,28,32,36,48,72].map(size => (
            <MenuItem key={size} value={String(size)} color='#122529'>{size}</MenuItem>
          ))}
        </Select>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Text Styles */}
        <Tooltip title="Bold (Ctrl+B)">
          <IconButton size="small" color={currentCell?.bold ? 'primary' : 'default'} onClick={() => applyToolbarStyle('bold', true)}>
            <FormatBoldIcon fontSize="small" sx={{color:'#122529'}} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Italic (Ctrl+I)">
          <IconButton size="small" color={currentCell?.italic ? 'primary' : 'default'} onClick={() => applyToolbarStyle('italic', true)}>
            <FormatItalicIcon fontSize="small" sx={{color:'#122529'}}/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Underline (Ctrl+U)">
          <IconButton size="small" color={currentCell?.underline ? 'primary' : 'default'} onClick={() => applyToolbarStyle('underline', true)}>
            <FormatUnderlinedIcon fontSize="small" sx={{color:'#122529'}}/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Strikethrough">
          <IconButton size="small" color={currentCell?.strike ? 'primary' : 'default'} onClick={() => applyToolbarStyle('strike', true)}>
            <StrikethroughSIcon fontSize="small" sx={{color:'#122529'}}/>
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Alignment */}
        <Tooltip title="Align Left">
          <IconButton size="small" onClick={() => applyToolbarStyle('align', 'left')}>
            <FormatAlignLeftIcon fontSize="small" sx={{color:'#122529'}}/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Align Center">
          <IconButton size="small" onClick={() => applyToolbarStyle('align', 'center')}>
            <FormatAlignCenterIcon fontSize="small" sx={{color:'#122529'}}/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Align Right">
          <IconButton size="small" onClick={() => applyToolbarStyle('align', 'right')}>
            <FormatAlignRightIcon fontSize="small" sx={{color:'#122529'}}/>
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Colors */}
        <Tooltip title="Text Color">
          <IconButton 
            size="small" 
            onClick={(e) => {
              setColorPickerAnchor(e.currentTarget);
              setColorPickerType('text');
              setTempColor(currentCell?.color || '#000000');
            }}
          >
            <FormatColorTextIcon fontSize="small" style={{ color: currentCell?.color || '#212529' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Background Color">
          <IconButton 
            size="small" 
            onClick={(e) => {
              setColorPickerAnchor(e.currentTarget);
              setColorPickerType('bg');
              setTempColor(currentCell?.bgColor || '#ffffff');
            }}
          >
            <FormatColorFillIcon fontSize="small" style={{ color: currentCell?.bgColor || '#212529' }} />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Borders */}
        <Tooltip title="Add Border">
          <IconButton size="small" onClick={() => applyToolbarStyle('border', true)}>
            <BorderAllIcon fontSize="small" sx={{color:'#122529'}} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Clear Border">
          <IconButton size="small" onClick={() => applyToolbarStyle('border', false)}>
            <BorderClearIcon fontSize="small" sx={{color:"122529"}}/>
          </IconButton>
        </Tooltip>

        {/* Formula Input */}
        <Box sx={{ flex: 1, ml: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter formula (e.g., =SUM(A1:A10))"
            value={currentCell?.value || ''}
            onChange={(e) => {
              if (activeCell) {
                handleCellChange(activeCell.rowIndex, activeCell.colIndex, e.target.value);
              }
            }}
            sx={{ '& .MuiInputBase-root': { height: 26, fontSize: '13px' } }}
          />
        </Box>
      </Box>

      <Divider sx={{ mb: 1 }} />

      {/* ============ Selection Info ============ */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, mb: 0.5 }}>
        <Typography variant="caption" color="textSecondary">
          {selection ? `${selectedCount} cell${selectedCount > 1 ? 's' : ''} selected` : 'No selection'}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {activeCell ? `${gridData[activeCell.rowIndex]?.[activeCell.colIndex]?.value || ''}` : ''}
        </Typography>
      </Box>

      {/* ============ Spreadsheet Table ============ */}
      <TableContainer 
        ref={tableRef}
        component={Paper} 
        variant="outlined" 
        sx={{ 
          flex: 1,
          overflow: 'auto', 
          borderRadius: 0,
          borderColor: '#d0d0d0',
          backgroundColor: '#fff',
          position: 'relative',
          '&::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c1c1c1',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#a8a8a8',
          },
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell 
                style={{ 
                  width: 45, 
                  minWidth: 45,
                  maxWidth: 45,
                  textAlign: 'center', 
                  backgroundColor: '#f8f9fa', 
                  fontWeight: 'bold',
                  borderRight: '1px solid #c0c0c0',
                  borderBottom: '1px solid #c0c0c0',
                  color: '#5f6368',
                  padding: '4px',
                  position: 'sticky',
                  left: 0,
                  zIndex: 3,
                }}
              />
              {cols.map((col) => (
                <TableCell 
                  key={col} 
                  align="center"
                  style={{
                    backgroundColor: '#f8f9fa',
                    fontWeight: 'bold',
                    borderRight: '1px solid #d0d0d0',
                    borderBottom: '1px solid #c0c0c0',
                    color: '#3c4043',
                    padding: '4px',
                    width: colWidths[col] || DEFAULT_COL_WIDTH,
                    minWidth: colWidths[col] || DEFAULT_COL_WIDTH,
                    maxWidth: colWidths[col] || DEFAULT_COL_WIDTH,
                    fontSize: '12px',
                    position: 'relative',
                  }}
                >
                  {col}
                  {/* Column Resize Handle */}
                  <Box
                    onMouseDown={(e) => startColumnResize(col, e)}
                    sx={{
                      position: 'absolute',
                      right: -3,
                      top: 0,
                      width: 6,
                      height: '100%',
                      cursor: 'col-resize',
                      '&:hover': {
                        backgroundColor: 'rgba(26, 115, 232, 0.3)',
                      },
                      zIndex: 10,
                    }}
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {gridData.map((row, rowIndex) => (
              <TableRow key={rowIndex} style={{ 
                height: rowHeights[rowIndex] || 26,
                minHeight: rowHeights[rowIndex] || 26,
              }}>
                <TableCell 
                  align='center' 
                  sx={{
                    backgroundColor: '#f8f9fa',
                    borderRight: '1px solid #c0c0c0',
                    borderBottom: '1px solid #d0d0d0',
                    color: '#5f6368',
                    userSelect: 'none',
                    fontWeight: 'bold',
                    p: 0,
                    fontSize: '12px',
                    width: 45,
                    minWidth: 45,
                    maxWidth: 45,
                    position: 'sticky',
                    left: 0,
                    zIndex: 2,
                    
                  }}
                >
                  {rowIndex + 1}
                  {/* Row Resize Handle */}
                  <Box
                    onMouseDown={(e) => startRowResize(rowIndex, e)}
                    sx={{
                      position: 'absolute',
                      bottom: -3,
                      left: 0,
                      width: '100%',
                      height: 6,
                      cursor: 'row-resize',
                      '&:hover': {
                        backgroundColor: 'rgba(26, 115, 232, 0.3)',
                      },
                      zIndex: 10,
                    }}
                  />
                </TableCell>

                {row.map((cell, colIndex) => {
                  const isFocused = activeCell?.rowIndex === rowIndex && activeCell?.colIndex === colIndex;
                  const isSelected = isCellSelected(rowIndex, colIndex);

                  const textDecorations = [
                    cell.underline ? 'underline' : '',
                    cell.strike ? 'line-through' : ''
                  ].filter(Boolean).join(' ');

                  return (
                    <TableCell 
                      key={colIndex} 
                      onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                      onMouseOver={() => handleCellMouseOver(rowIndex, colIndex)}
                      onFocus={() => setActiveCell({ rowIndex, colIndex })}
                      sx={{ 
                        p: 0, 
                        borderRight: '1px solid #e0e0e0', 
                        borderBottom: '1px solid #e0e0e0',
                        backgroundColor: cell.bgColor || (isSelected ? '#e8f0fe' : 'white'),
                        position: 'relative',
                        outline: isFocused ? '2px solid #1a73e8' : (isSelected ? '1px solid #1a73e8' : 'none'),
                        outlineOffset: '-1px',
                        zIndex: isFocused ? 2 : 1,
                        cursor: 'cell',
                        width: colWidths[cols[colIndex]] || DEFAULT_COL_WIDTH,
                        minWidth: colWidths[cols[colIndex]] || DEFAULT_COL_WIDTH,
                        maxWidth: colWidths[cols[colIndex]] || DEFAULT_COL_WIDTH,
                        height: rowHeights[rowIndex] || 26,
                        minHeight: rowHeights[rowIndex] || 26,
                        maxHeight: rowHeights[rowIndex] || 26,
                        border: cell.border ? '1px solid #000' : 'none',
                      }}
                    >
                      <InputBase 
                        value={cell.value} 
                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                        onFocus={() => handleCellClick(rowIndex, colIndex)}
                        sx={{ 
                          px: 1, 
                          width: '100%', 
                          height: '100%',
                          fontSize: cell.fontSize ? `${cell.fontSize}pt` : '11pt',
                          fontFamily: cell.fontFamily || 'Arial, sans-serif',
                          color: cell.color || 'inherit',
                          input: {
                            padding: '4px 0',
                            fontWeight: cell.bold ? 'bold' : 'normal',
                            fontStyle: cell.italic ? 'italic' : 'normal',
                            textDecoration: textDecorations || 'none',
                            textAlign: cell.align || 'left',
                            backgroundColor: 'transparent',
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

      {/* ============ Color Picker Popover ============ */}
      <Popover
        open={Boolean(colorPickerAnchor)}
        anchorEl={colorPickerAnchor}
        onClose={() => setColorPickerAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, width: 200 }}>
          <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
            {colorPickerType === 'text' ? 'Text Color' : 'Background Color'}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff',
              '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#2c3e50',
              '#ecf0f1', '#95a5a6', '#d35400', '#c0392b', '#2980b9', '#27ae60', '#f1c40f', '#8e44ad'
            ].map(color => (
              <Box
                key={color}
                onClick={() => handleColorChange(color)}
                sx={{
                  width: 24,
                  height: 24,
                  backgroundColor: color,
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': { border: '2px solid #000' },
                }}
              />
            ))}
          </Box>
          <TextField
            fullWidth
            size="small"
            type="color"
            value={tempColor}
            onChange={(e) => setTempColor(e.target.value)}
            onBlur={() => handleColorChange(tempColor)}
            sx={{ mt: 1 }}
          />
        </Box>
      </Popover>
    </Box>
  );
}