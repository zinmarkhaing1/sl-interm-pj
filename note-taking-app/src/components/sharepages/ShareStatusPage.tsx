import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Snackbar,
  Alert
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LinkIcon from "@mui/icons-material/Link";

interface CollaboratorItem {
  _id?: string;
  invitedEmail: string;
  status: string;
  role: string;
  pageUrl?: string;
  source?: string;
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  photo?: string;
}

interface ShareStatusPageProps {
  user: UserProfile | null;
  collaborators: CollaboratorItem[];
  setCollaborators: React.Dispatch<React.SetStateAction<CollaboratorItem[]>>;
  handleOpenPermissionMenu: (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string | null,
    currentRole: string
  ) => void;
  getRoleLabel: (role: string) => string;
  boardName: string;
  pageUrl?: string;
  redirectUrl?:string;
}

export const ShareStatusPage: React.FC<ShareStatusPageProps> = ({
  user,
  collaborators,
  setCollaborators,
  handleOpenPermissionMenu,
  getRoleLabel,
  boardName,
  pageUrl,
  redirectUrl="/board", 
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
      setError("You must be logged in to invite collaborators");
      setLoading(false);
      return;
    }

     let boardNameToUse = boardName;
    if (!boardNameToUse) {
      const url = window.location.href;
      const match = url.match(/\/category\/([^\/?#]+)/);
      if (match) {
        boardNameToUse = decodeURIComponent(match[1]);
      }
    }
    if (!boardNameToUse) {
      boardNameToUse = "Todo";
    }
    const requestBody = {
        email: inviteEmail.trim(),
          invitedEmail: inviteEmail.trim(),
          role: "viewer",
          pageUrl: pageUrl || window.location.href,
          pageName: boardName,
          source: "board_page",
          pageType: "board",  
          redirectUrl: redirectUrl || "/board", 
    };

    console.log("📨 Sending invite request:", requestBody);
      const response = await fetch("http://localhost:5000/api/share/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log(" Response status:", response.status);

  
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      setError(`Server error: ${response.status} - ${errorText.substring(0, 100)}`);
      setLoading(false);
      return;
    }

      if (response.ok) {
        const data = await response.json();

        if (data && data.collaborator) {
          setCollaborators((prev) => [...prev, data.collaborator]);
        } else if (data && data.data) {
          setCollaborators((prev) => [...prev, data.data]);
        } else {
          const fallbackNewCollaborator: CollaboratorItem = {
            _id: data._id || String(Date.now()),
            invitedEmail: inviteEmail.trim(),
            status: data.status || "pending",
            role: "viewer",
          };
          setCollaborators((prev) => [...prev, fallbackNewCollaborator]);
        }

        setInviteEmail("");
      } else {
        console.error("Failed to invite collaborator");
      }
    } catch (error) {
      console.error("Error inviting collaborator:", error);
    }
  };

  return (
    <Box>

      <Snackbar
              open={!!error}
              autoHideDuration={5000}
              onClose={() => setError(null)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            </Snackbar>

            <Snackbar
                    open={!!success}
                    autoHideDuration={3000}
                    onClose={() => setSuccess(null)}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                  >
                    <Alert severity="success" onClose={() => setSuccess(null)}>
                      {success}
                    </Alert>
                  </Snackbar>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
        Share Status Page
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 2.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Add people by email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              fontSize: "0.875rem",
            },
          }}
        />
        <Button
          variant="contained"
          size="small"
          onClick={handleInvite}
          sx={{
            bgcolor: "#973aa8",
            textTransform: "none",
            borderRadius: 2,
            px: 2.5,
            "&]:hover": { bgcolor: "#7b2c8a" },
          }}
        >
          {loading ? "Sending..." : "Invite"}
        </Button>
      </Box>

      <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary", mb: 1 }}>
        People with access
      </Typography>

      <List disablePadding sx={{ maxHeight: 180, overflowY: "auto", mb: 2 }}>
        {user && (
          <ListItem disableGutters sx={{ py: 0.75 }}>
            <ListItemAvatar sx={{ minWidth: 40 }}>
              <Avatar
                src={user.photo}
                alt={user.firstName}
                sx={{ width: 32, height: 32, bgcolor: "#973aa8", fontSize: "14px" }}
              >
                {user.firstName?.charAt(0).toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {user.firstName} {user.lastName} (You)
                </Typography>
              }
              secondary={
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              }
            />
            <Typography variant="caption" sx={{ color: "text.secondary", pr: 1 }}>
              Owner
            </Typography>
          </ListItem>
        )}

        {collaborators &&
          collaborators
            .filter((person) => person.invitedEmail !== user?.email)
            .map((person, index) => (
              <ListItem
                disableGutters
                key={person._id || person.invitedEmail || index}
                sx={{ py: 0.75 }}
              >
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar
                    sx={{ width: 32, height: 32, bgcolor: "action.focus", fontSize: "14px" }}
                  >
                    {person.invitedEmail ? person.invitedEmail.charAt(0).toUpperCase() : "U"}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="body2">{person.invitedEmail}</Typography>}
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {person.status}
                    </Typography>
                  }
                />

                <Button
                  size="small"
                  endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14 }} />}
                  onClick={(e) => handleOpenPermissionMenu(e, person._id || null, person.role)}
                  sx={{
                    textTransform: "none",
                    color: "text.secondary",
                    fontSize: "0.75rem",
                    py: 0.5,
                  }}
                >
                  {getRoleLabel(person.role)}
                </Button>
              </ListItem>
            ))}
      </List>

      <Box
        sx={{
          pt: 1.5,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          startIcon={<LinkIcon sx={{ transform: "rotate(-45deg)" }} />}
          onClick={handleCopyLink}
          sx={{
            textTransform: "none",
            color: "#973aa8",
            fontSize: "0.85rem",
            fontWeight: 500,
            "&:hover": { bgcolor: "transparent", opacity: 0.8 },
          }}
        >
          {copySuccess ? "Copied link!" : "Copy link"}
        </Button>
      </Box>
    </Box>
  );
};
