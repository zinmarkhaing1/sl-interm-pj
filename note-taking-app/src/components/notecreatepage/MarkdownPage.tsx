
import React, { useState, useEffect,  } from 'react';
import { Box, IconButton, Typography, } from '@mui/material';
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
  
  
  const [localText, setLocalText] = useState<string>(description);
  const [isFolded, setIsFolded] = useState<boolean>(false);

  const [currentPath, setCurrentPath] = useState<string>('');

 
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

  
  const lines = localText.split('\n');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLocalText(value); 
    setText(value);      
  };



  const canEdit = isOwner || userPermission === 'full_access' || userPermission === 'can_edit';


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2, p: 2 }}>
      
     

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

    
     

    </Box>
  );
}