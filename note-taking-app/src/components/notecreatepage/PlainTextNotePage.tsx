
import { TextField, Box, Stack, } from '@mui/material';

interface PlainTextNotePageProps {
  description: string;
  setText: (value: string) => void;
}

export function PlainTextNotePage({ description, setText }: PlainTextNotePageProps) {
 

  return (
    <Box sx={{ width:"100%",maxWidth: 800 }}>
      <Stack sx={{border:"1px solid gray", alignItems:"flex-start",borderRadius:2}} >
         <TextField
        placeholder="Note Content"
        multiline
        rows={15}
        fullWidth
        variant="standard"
        value={description}
        onChange={(e) => setText(e.target.value)}
        slotProps={{
            input:{
                disableUnderline:true,
                style:{fontSize:"16px"}
            },
        }}
        sx={{p:2}}
   
      />
      </Stack>
     
    </Box>
  );
}