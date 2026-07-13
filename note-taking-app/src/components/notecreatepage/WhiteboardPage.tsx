

import React, { useRef, useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { Box, IconButton, Slider, ToggleButton, ToggleButtonGroup, Paper } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import PanToolIcon from '@mui/icons-material/PanTool';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

interface WhiteboardPageProps {
  description: string;
  setText: (value: string) => void;
}

const COLORS = [
  '#000000', '#9e9e9e', '#ba68c8', '#8e24aa',
  '#2196f3', '#4fc3f7', '#ffb74d', '#f57c00',
  '#4caf50', '#81c784', '#e57373', '#f44336'
];

export function WhiteboardPage({ description, setText }: WhiteboardPageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  
  // Tools & Style States
  const [color, setColor] = useState<string>('#000000');
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [tool, setTool] = useState<string>('pencil'); // pencil, eraser, hand, text

  const [textInputStyle, setTextInputStyle] = useState<{ left: number; top: number; display: 'none' | 'block' }>({ left: 0, top: 0, display: 'none' });
  const [textInputValue, setTextInputValue] = useState<string>('');
  const [textCoords, setTextCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement | null>(null);


  const isUpdatingFromProp = useRef(false);
  const lastLoadedDescription = useRef<string>('');

  const configureContext = (ctx: CanvasRenderingContext2D) => {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? lineWidth * 4 : lineWidth;
  };


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    configureContext(ctx);


    if (description && description !== lastLoadedDescription.current) {
      const img = new Image();
      img.src = description;
      img.onload = () => {
        isUpdatingFromProp.current = true;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        configureContext(ctx);
        lastLoadedDescription.current = description;
      };
    }
  }, [description, color, lineWidth, tool]);

  // Canvas ကို ကလစ်နှိပ်လိုက်ချိန်
  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY, clientX, clientY } = e.nativeEvent;
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (tool === 'text') {
      if (textInputStyle.display === 'block' && textInputValue.trim()) {
        finalizeText();
      }

      setTextInputStyle({
        left: clientX,
        top: clientY,
        display: 'block'
      });
      setTextCoords({ x: offsetX, y: offsetY });
   
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
      return;
    }

    if (tool === 'hand') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool === 'hand' || tool === 'text') return;
    const { offsetX, offsetY } = nativeEvent;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveCanvasData();
  };

  const finalizeText = () => {
    const canvas = canvasRef.current;
    if (!canvas || !textInputValue.trim()) {
      setTextInputStyle(prev => ({ ...prev, display: 'none' }));
      setTextInputValue('');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (ctx) {
      const fontSize = Math.max(14, lineWidth * 4);
      ctx.font = `${fontSize}px Arial, sans-serif`;
      ctx.fillStyle = color;
      ctx.textBaseline = 'top';
      ctx.fillText(textInputValue, textCoords.x, textCoords.y);
      
      saveCanvasData();
    }

    setTextInputStyle(prev => ({ ...prev, display: 'none' }));
    setTextInputValue('');
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      finalizeText();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    lastLoadedDescription.current = '';
    setText('');
    setTextInputStyle(prev => ({ ...prev, display: 'none' }));
  };

  const saveCanvasData = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL();
      lastLoadedDescription.current = dataUrl;
      setText(dataUrl);
    }
  };

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        width: '100%', 
        height: '600px', 
        bgcolor: 'background.default',
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}
    >
   
      <input
        ref={inputRef}
        type="text"
        value={textInputValue}
        onChange={(e) => setTextInputValue(e.target.value)}
        onKeyDown={handleInputKeyDown}
        onBlur={finalizeText}
        style={{
          position: 'fixed',
          left: textInputStyle.left,
          top: textInputStyle.top,
          display: textInputStyle.display,
          zIndex: 100,
          fontFamily: 'Arial, sans-serif',
          fontSize: `${Math.max(14, lineWidth * 4)}px`,
          color: color,
          border: '1px dashed #973aa8',
          outline: 'none',
          padding: '2px 4px',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          borderRadius: '3px'
        }}
      />

      {/* Top Control Bar */}
      <Paper 
        elevation={1} 
        sx={{ 
          position: 'absolute', top: 12, left: 12, zIndex: 10,
          display: 'flex', alignItems: 'center', gap: 0.5, p: 0.5, borderRadius: '6px', color: 'text.primary', bgcolor: 'background.default'
        }}
      >
        <IconButton size="small"><UndoIcon sx={{ fontSize: 18, color: 'text.primary' }} /></IconButton>
        <IconButton size="small"><RedoIcon sx={{ fontSize: 18, color: 'text.primary' }} /></IconButton>
        <IconButton size="small" onClick={clearCanvas} color="error">
          <DeleteSweepIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Paper>

      {/* Style Panel */}
      <Paper 
        elevation={2} 
        sx={{ 
          position: 'absolute', top: 12, right: 12, zIndex: 10,
          width: 150, p: 1.5, display: 'flex', flexDirection: 'column', gap: 2, borderRadius: '8px',
          bgcolor: 'background.default', color: 'text.primary'
        }}
      >
        {/* Color Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
          {COLORS.map((c) => (
            <Box
              key={c}
              onClick={() => { 
                if (tool === 'eraser') setTool('pencil'); 
                setColor(c); 
              }}
              sx={{
                width: 20, height: 20, borderRadius: '50%', backgroundColor: c, cursor: 'pointer',
                border: color === c && tool !== 'eraser' ? '2px solid #1a73e8' : '1px solid rgba(0,0,0,0.1)',
                boxShadow: color === c && tool !== 'eraser' ? '0 0 4px rgba(0,0,0,0.3)' : 'none'
              }}
            />
          ))}
        </Box>

        {/* Thickness Slider */}
        <Box>
          <Slider 
            size="small" value={lineWidth} min={1} max={15} 
            onChange={(_, val) => setLineWidth(val as number)} 
          />
        </Box>

        {/* Sizes Buttons */}
        <ToggleButtonGroup
          size="small" value={lineWidth <= 3 ? 'S' : lineWidth <= 6 ? 'M' : lineWidth <= 10 ? 'L' : 'XL'}
          exclusive onChange={(_, val) => setLineWidth(val === 'S' ? 2 : val === 'M' ? 5 : val === 'L' ? 9 : 14)}
          fullWidth sx={{ bgcolor: 'background.default' }}
        >
          <ToggleButton value="S" sx={{ py: 0, fontSize: '11px', fontWeight: 'bold', color: 'text.primary' }}>S</ToggleButton>
          <ToggleButton value="M" sx={{ py: 0, fontSize: '11px', fontWeight: 'bold', color: 'text.primary' }}>M</ToggleButton>
          <ToggleButton value="L" sx={{ py: 0, fontSize: '11px', fontWeight: 'bold', color: 'text.primary' }}>L</ToggleButton>
          <ToggleButton value="XL" sx={{ py: 0, fontSize: '11px', fontWeight: 'bold', color: 'text.primary' }}>XL</ToggleButton>
        </ToggleButtonGroup>
      </Paper>

      {/* Canvas Area */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        width={1000}
        height={600}
        style={{ 
          backgroundColor: 'background.default', 
          cursor: tool === 'hand' ? 'grab' : tool === 'text' ? 'text' : 'crosshair',
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />

      {/* Bottom Toolbar */}
      <Paper 
        elevation={3} 
        sx={{ 
          position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 10,
          display: 'flex', alignItems: 'center', gap: 1, p: 0.8, borderRadius: '24px', px: 2,
          bgcolor: 'background.default', color: 'text.primary'
        }}
      >
        <IconButton 
          color={tool === 'hand' ? 'primary' : 'default'} 
          onClick={() => setTool('hand')}
          sx={{ backgroundColor: tool === 'hand' ? 'rgba(26, 115, 232, 0.1)' : 'transparent' }}
        >
          <PanToolIcon fontSize="small" />
        </IconButton>

        <IconButton 
          color={tool === 'pencil' ? 'primary' : 'default'} 
          onClick={() => setTool('pencil')}
          sx={{ backgroundColor: tool === 'pencil' ? 'rgba(26, 115, 232, 0.05)' : 'transparent' }}
        >
          <CreateIcon fontSize="small" />
        </IconButton>

        <IconButton 
          color={tool === 'eraser' ? 'primary' : 'default'} 
          onClick={() => setTool('eraser')}
          sx={{ backgroundColor: tool === 'eraser' ? 'rgba(26, 115, 232, 0.05)' : 'transparent' }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>

        <IconButton 
          color={tool === 'text' ? 'primary' : 'default'} 
          onClick={() => setTool('text')}
          sx={{ backgroundColor: tool === 'text' ? 'rgba(26, 115, 232, 0.05)' : 'transparent' }}
        >
          <TextFieldsIcon fontSize="small" />
        </IconButton>
      </Paper>

      {/* Zoom Indicator */}
      <Paper 
        variant="outlined" 
        sx={{ 
          position: 'absolute', bottom: 12, left: 12, fontSize: '12px', px: 1, py: 0.5, 
          color: '#5f6368', backgroundColor: '#f1f3f4', border: 'none' 
        }}
      >
        100%
      </Paper>
    </Box>
  );
}