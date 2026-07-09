// import React, { useState } from 'react';
// import { Box, Typography, Paper, TextField, Button, List, ListItem, ListItemText } from '@mui/material';

// interface GroupChatPageProps{
//     description:string,
//      setText: (value: string) => void;

// }

// export function GroupChatPage({description,setText}:GroupChatPageProps) {
//   const [messages, setMessages] = useState([
//     { user: 'Thura', text: 'ဒီဇိုင်းအသစ်အတွက် ဘာတွေလိုမလဲ?' },
//     { user: 'Su Su', text: 'ဇယားကွက်ထဲမှာ စာရင်းတွေ အရင်ထည့်ထားရမယ်။' }
//   ]);
//   const [input, setInput] = useState('');

//   const sendMessage = () => {
//     if (!input.trim()) return;
//     setMessages([...messages, { user: 'You', text: input }]);
//     setInput('');
//   };

//   return (
//     <Box sx={{ p: 3, maxWidth: 600, margin: '0 auto', height: '80vh', display: 'flex', flexDirection: 'column' }}>
      
//       <Paper variant="outlined" sx={{ flexGrow: 1, p: 2, mb: 2, overflowY: 'auto', backgroundColor: '#fafafa' }}>
//         <List>
//           {messages.map((m, i) => (
//             <ListItem key={i} sx={{ flexDirection: 'column', alignItems: m.user === 'You' ? 'flex-end' : 'flex-start' }}>
//               <Typography variant="caption" color="textSecondary">{m.user}</Typography>
//               <Paper sx={{ p: 1.5, bgcolor: m.user === 'You' ? '#1976d2' : '#e0e0e0', color: m.user === 'You' ? 'white' : 'black', borderRadius: 2 }}>
//                 <ListItemText primary={m.text} />
//               </Paper>
//             </ListItem>
//           ))}
//         </List>
//       </Paper>

//       <Box sx={{ display: 'flex', gap: 1 }}>
//         <TextField fullWidth size="small" value={input} onChange={(e) => setInput(e.target.value)} placeholder="စာရိုက်ရန်..." />
//         <Button variant="contained" onClick={sendMessage}>Send</Button>
//       </Box>
//     </Box>
//   );
// }

import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
} from "@mui/material";

interface Message {
  user: string;
  text: string;
}

interface GroupChatPageProps {
  description: string;
  setText: (value: string) => void;
}

export function GroupChatPage({
  description,
  setText,
}: GroupChatPageProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      return description
        ? JSON.parse(description)
        : [
            {
              user: "Thura",
              text: "ဒီဇိုင်းအသစ်အတွက် ဘာတွေလိုမလဲ?",
            },
            {
              user: "Su Su",
              text: "ဇယားကွက်ထဲမှာ စာရင်းတွေ အရင်ထည့်ထားရမယ်။",
            },
          ];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState("");

  const updateMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
    setText(JSON.stringify(newMessages));
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    updateMessages([
      ...messages,
      {
        user: "You",
        text: input.trim(),
      },
    ]);

    setInput("");
  };

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: 650,
        mx: "auto",
        height: "80vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          flex: 1,
          p: 2,
          overflowY: "auto",
          bgcolor: "#fafafa",
          borderRadius: 3,
          mb: 2,
        }}
      >
        <List>
          {messages.map((message, index) => (
            <ListItem
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems:
                  message.user === "You"
                    ? "flex-end"
                    : "flex-start",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                {message.user}
              </Typography>

              <Paper
                sx={{
                  px: 2,
                  py: 1.2,
                  mt: 0.5,
                  maxWidth: "80%",
                  bgcolor:
                    message.user === "You"
                      ? "primary.main"
                      : "grey.300",
                  color:
                    message.user === "You"
                      ? "white"
                      : "black",
                  borderRadius: 3,
                }}
              >
                <Typography>{message.text}</Typography>
              </Paper>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Box sx={{gap:1,display:'flex'}}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <Button
          variant="contained"
          onClick={sendMessage}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}