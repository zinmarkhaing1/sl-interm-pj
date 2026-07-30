
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// import {useGetUsersQuery } from "../../services/authApi";

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

interface SharePopoverComponentProps {
  user: UserProfile | null;
  collaborators: CollaboratorItem[];
  setCollaborators: React.Dispatch<React.SetStateAction<CollaboratorItem[]>>;
  handleOpenPermissionMenu: (event: React.MouseEvent<HTMLButtonElement>, id: string | null, currentRole: string) => void;
  getRoleLabel: (role: string) => string;
}


export const SharePage = ({
  user,
  collaborators,
  setCollaborators,
  handleOpenPermissionMenu,
  getRoleLabel,
}: SharePopoverComponentProps) => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [inviteMessage, setInviteMessage] = useState<string>("");
  const [isInviting, setIsInviting] = useState<boolean>(false);

  // const { data: users = [] } = useGetUsersQuery();
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setInviteMessage("Please enter at least one email address.");
      return;
    }
    const emailList = email.split(",").map((str) => str.trim()).filter((str) => str !== "");
    if (emailList.length === 0) {
      setInviteMessage("Please enter at least one valid email address.");
      return;
    }

    setIsInviting(true);
    setInviteMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/share/multiple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          emails: emailList,
          pageUrl: window.location.href,
        }),
      });

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        setInviteMessage(data.message || `Invite sent to ${emailList.length} email${emailList.length > 1 ? "s" : ""}.`);
        setEmail("");
        const nextCollaborators = (data.invitations || []).map((item: any) => ({
          invitedEmail: item.email,
          status: item.status,
          role: item.role || "full",
          pageUrl: item.pageUrl,
          source: "Shared link",
        }));
        setCollaborators((prev) => [...nextCollaborators, ...prev]);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setInviteMessage(errorData.message || "Unable to send invitations right now.");
      }
    } catch {
      setInviteMessage("Unable to send invitations right now.");
    } finally {
      setIsInviting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  return (
    <Box>
      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        textColor="primary"
        indicatorColor="primary"
        sx={{ minHeight: 32, mb: 2, borderBottom: "1px solid #f0f0f0" }}
      >
        <Tab label="Share" sx={{ textTransform: "none", minHeight: 32, fontWeight: 600 }} />
      </Tabs>

      {tabValue === 0 && (
        <Box>
          <Box component="form" onSubmit={handleInvite} sx={{ display: "flex", gap: 1, mb: 2.5 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Email or group, separated by commas"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { fontSize: "13px" } }}
            />
            <Button
              type="submit"
              variant="contained"
              disableElevation
              disabled={isInviting}
              sx={{ textTransform: "none", bgcolor: "#e9c0f1", "&:hover": { bgcolor: "#973aa8", color: "white" } }}
            >
              {isInviting ? "Sending..." : "Invite"}
            </Button>
          </Box>

          {inviteMessage && (
            <Typography
              variant="body2"
              sx={{
                mb: 1.5,
                color: inviteMessage.includes("Unable") || inviteMessage.includes("Please") ? "error.main" : "success.main",
              }}
            >
              {inviteMessage}
            </Typography>
          )}

          {/* Current User (You) Row */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, color: "text.primary" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar src={user?.photo || ""} sx={{ width: 36, height: 36, bgcolor: "#e3e3e3" }}>
                {!user?.photo && (user?.firstName?.charAt(0) || "U")}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "13.5px" }}>
                  {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : ""} (You)
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: "11px" }}>
                  {user?.email || ""}
                </Typography>
              </Box>
            </Box>
            <Button
              size="small"
              variant="text"
              endIcon={<KeyboardArrowDownIcon />}
              onClick={(e) => handleOpenPermissionMenu(e, null, "full")}
              sx={{ textTransform: "none", color: "text.secondary", fontSize: "13px" }}
            >
              Full access
            </Button>
          </Box>

          {/* Collaborators List */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
            {collaborators.map((person) => (
              <Box key={person._id || person.invitedEmail} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: "#e8f3ff", color: "#1a6cb3", fontSize: "14px", fontWeight: "bold" }}>
                    {person.invitedEmail.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontSize: "13.5px", fontWeight: 500 }}>
                      {person.invitedEmail}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "inline-block", bgcolor: "background.default", px: 0.8, py: 0.1, borderRadius: 1, fontSize: "10px", fontWeight: 600, mt: 0.3 }}
                    >
                      {person.status === "accepted" ? "Active" : "Invited"}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  size="small"
                  variant="text"
                  endIcon={<KeyboardArrowDownIcon />}
                  onClick={(e) => handleOpenPermissionMenu(e, person._id || null, person.role)}
                  sx={{ textTransform: "none", color: "text.primary", fontSize: "13px", bgcolor: "background.default", borderRadius: 3, px: 1 }}
                >
                  {getRoleLabel(person.role)}
                </Button>
              </Box>
            ))}
          </Box>

          <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", display: "block", mb: 1 }}>
            General access
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "#f0f0f0" }}>🔒</Avatar>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "13px" }}>
              Only people invited can open this link
            </Typography>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary", cursor: "pointer" }}>
              <HelpOutlineIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption" sx={{ fontSize: "12px" }}>Learn about sharing</Typography>
            </Box>
            <Button
              size="small"
              variant="outlined"
              startIcon={<ContentCopyIcon sx={{ fontSize: 14 }} />}
              onClick={handleCopyLink}
              sx={{ textTransform: "none", borderRadius: 2, borderColor: "#e0e0e0", color: "text.primary" }}
            >
              Copy link
            </Button>
          </Box>
        </Box>
      )}

      {tabValue === 1 && (
        <Box sx={{ p: 1 }}>
          <Typography variant="body2" color="text.secondary">Publish settings will go here.</Typography>
        </Box>
      )}
    </Box>
  );
};
