import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Stack,
  Button,
  Badge,
  Divider,
  Tabs,
  Tab, 
  TextField,
  Popover,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
// import Brightness7Icon from "@mui/icons-material/Brightness7";
// import Brightness2OutlinedIcon from '@mui/icons-material/Brightness2Outlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
// import Brightness4Icon from "@mui/icons-material/Brightness4";
// import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import notebook from "../../navicons/34864fc706609d92a131368af91c1e8b-removebg-preview.png";
// import ShareIcon from "@mui/icons-material/Share";
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import KeyboardArrowDownIcon  from "@mui/icons-material/KeyboardArrowDown";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlined";
import NotificationsIcon from '@mui/icons-material/NotificationsNone';
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetNotificationsQuery, useMarkNotificationReadMutation } from "../../services/noteApi";

interface CollaboratorItem {
  _id?: string;
  invitedEmail: string;
  status: string;
  role: string;
  pageUrl?: string;
}

interface InvitationNotice {
  _id?: string;
  invitedEmail: string;
  role: string;
  status: string;
  invitedBy?: string;
}

interface UserProfile {
  firstName?: string;
  photo?: string;
  email?: string;
}

interface HeaderBarProps {
  onMenuClick: () => void;
}

export const HeaderBar = ({ onMenuClick }: HeaderBarProps) => {
  
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [tabValue, setTabValue] = useState<number>(0);
  const [email, setEmail] = useState<string>('');
  const [inviteMessage, setInviteMessage] = useState<string>('');
  const [isInviting, setIsInviting] = useState<boolean>(false);
  const [collaborators, setCollaborators] = useState<CollaboratorItem[]>([]);
  const [invitations, setInvitations] = useState<InvitationNotice[]>([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [activeCollaboratorId, setActiveCollaboratorId] = useState<string | null>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<HTMLElement | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [markNotificationRead] = useMarkNotificationReadMutation();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setUser(null);
        return;
      }

      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
        localStorage.removeItem("user");
      }
    };

    const handleProfileUpdated = (event: Event) => {
      const updatedUser = (event as CustomEvent<UserProfile>).detail;
      if (updatedUser) {
        setUser(updatedUser);
        return;
      }

      loadUser();
    };

    const loadCollaborators = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:5000/api/share/collaborators", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCollaborators(data.collaborators || []);
        }
      } catch {
        setCollaborators([]);
      }
    };

    const loadInvitations = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      if (localStorage.getItem("invitationDismissed") === "true") {
    setInvitations([]);
    return;
  }

      try {
        const response = await fetch("http://localhost:5000/api/share/invitations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setInvitations(data.invitations || []);
        }
      } catch {
        setInvitations([]);
      }
    };

    const refreshInvitationData = () => {
      loadUser();
      loadCollaborators();
      loadInvitations();
    };

    refreshInvitationData();
    window.addEventListener("profileUpdated", handleProfileUpdated);
    window.addEventListener("storage", refreshInvitationData);
    window.addEventListener("focus", refreshInvitationData);
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdated);
      window.removeEventListener("storage", refreshInvitationData);
      window.removeEventListener("focus", refreshInvitationData);
    };
  }, [token]);

  const { data: notificationData } = useGetNotificationsQuery(undefined, { skip: !token });

  useEffect(() => {
    if (notificationData?.notifications) {
      setUnreadCount(notificationData.notifications.filter((item) => !item.isRead).length);
    }
  }, [notificationData]);

  const handleNotificationToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNotificationAnchor(notificationAnchor ? null : event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleMarkRead = async (notificationId: string) => {
    await markNotificationRead(notificationId).unwrap().catch(() => null);
    setNotificationAnchor(null);
  };

  const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setAnchorEl(null);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setInviteMessage("Please enter at least one email address.");
      return;
    }

    const emailList = email
      .split(',')
      .map((str) => str.trim())
      .filter((str) => str !== '');

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
        setEmail('');
        const nextCollaborators = (data.invitations || []).map((item: { email: string; status: string; role: string; pageUrl?: string }) => ({
          invitedEmail: item.email,
          status: item.status,
          role: item.role,
          pageUrl: item.pageUrl,
        }));
        setCollaborators((prev) => [...nextCollaborators, ...prev]);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setInviteMessage(errorData.message || "Unable to send invitations right now.");
      }
    } catch (error) {
      setInviteMessage("Unable to send invitations right now.");
    } finally {
      setIsInviting(false);
    }
  };
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const dismissInvitationNotice = () => {
    setInvitations([]);
    handleShareClose();
  };

  const handleOpenSharedNotes = () => {
    localStorage.setItem("sharedNotesRequested", "true");
    localStorage.removeItem("watchLaterSharedNotes");
    localStorage.setItem("invitationDismissed", "true");
    dismissInvitationNotice();
    navigate("/my-tasks?view=shared");
  };

  const handleWatchLater = () => {
    localStorage.setItem("watchLaterSharedNotes", "true");
    localStorage.setItem("sharedNotesRequested", "true");
    localStorage.setItem("invitationDismissed", "true");
    dismissInvitationNotice();
    navigate("/my-tasks?view=shared");
  };

  const handleOpenPermissionMenu = (event: React.MouseEvent<HTMLButtonElement>, collaboratorId?: string) => {
    setMenuAnchorEl(event.currentTarget);
    setActiveCollaboratorId(collaboratorId || null);
  };

  const handleClosePermissionMenu = () => {
    setMenuAnchorEl(null);
    setActiveCollaboratorId(null);
  };

  const handlePermissionChange = async (role: string) => {
    if (!activeCollaboratorId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/share/${activeCollaboratorId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        setCollaborators((prev) => prev.map((person) => person._id === activeCollaboratorId ? { ...person, role } : person));
      }
    } catch {
      // Ignore for now
    } finally {
      handleClosePermissionMenu();
    }
  };

  const handleRemoveCollaborator = async () => {
    if (!activeCollaboratorId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/share/${activeCollaboratorId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (response.ok) {
        setCollaborators((prev) => prev.filter((person) => person._id !== activeCollaboratorId));
      }
    } catch {
      // Ignore for now
    } finally {
      handleClosePermissionMenu();
    }
  };

  const isShareOpen = Boolean(anchorEl);
  const shareId = isShareOpen ? 'share-popover' : undefined;


  //to close box 
//   const handleDismissInvitation = () => {
//   setInvitations([]);
// };
  return (
    <AppBar
      position="fixed"
  elevation={0}
  sx={{
    top: 0,
    left: 0,
    right: 0,
    zIndex: (theme) => theme.zIndex.drawer + 1,
    boxShadow: "none",
    bgcolor: darkMode ? "#cdb4db" : "#f4f6f8",
       
      }}
    >
      <Toolbar
        sx={{
  
          height: 64,
          px: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          {/* Hamburger Menu Button */}
          <IconButton
            onClick={onMenuClick}
            sx={{
              color: "black",
              p: 1,
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            <Box
              component="img"
              src={notebook}
              alt="notebook"
              sx={{
                fontSize:"32px",
                fontWeight:"bold",
                width: 35,
                height: 35,
              }}
            />

            <Typography
              sx={{
                color: "black",
                fontSize: { xs: "1rem", sm: "1.2rem" },
                whiteSpace: "nowrap",
                lineHeight: 1,
                letterSpacing: "0.5px",
              }}
            >
              Note Book
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton
          sx={{ color: "gray" }}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <NightlightIcon /> : <LightModeOutlinedIcon />}
        </IconButton>
        <IconButton sx={{ color: "gray" }} onClick={handleNotificationToggle}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
       <Button
          aria-describedby={shareId}
          onClick={handleShareClick}
          sx={{
            border: "1px solid #d0d0d0",
            textTransform: "none",
            color: "#37352f",
            bgcolor: "f4f6f8",
            gap: 0.5,
            px: 1,
            mr: 2,
            borderRadius:2,
            "&:hover": {
              bgcolor: "#e6e4e4",
              
            },
          }}
          
        >
          <SendIcon sx={{ fontSize: 12 }} />
          Share
          <KeyboardArrowDownIcon sx={{ fontSize: 12}} />
        </Button>

        <Popover
          id={notificationAnchor ? "notification-popover" : undefined}
          open={Boolean(notificationAnchor)}
          anchorEl={notificationAnchor}
          onClose={handleNotificationClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{ paper: { sx: { width: 320, p: 2, mt: 1, borderRadius: 2 } } }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
            Notifications
          </Typography>
          {notificationData?.notifications?.length ? (
            notificationData.notifications.map((notification) => (
              <Box key={notification._id} sx={{ mb: 1, p: 1, borderRadius: 2, bgcolor: notification.isRead ? "#fafafa" : "#f2f7ff" }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(notification.createdAt || "").toLocaleString()}
                </Typography>
                {!notification.isRead && (
                  <Button size="small" onClick={() => handleMarkRead(notification._id || "")} sx={{ textTransform: "none", mt: 1 }}>
                    Mark as read
                  </Button>
                )}
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No notifications yet.
            </Typography>
          )}
        </Popover>
        <Popover
          id={shareId}
          open={isShareOpen}
          anchorEl={anchorEl}
          onClose={handleShareClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          slotProps={{
            paper: {
              sx: {
                width: 380,
                p: 2,
                mt: 1,
                borderRadius: 2,
                boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.12)",
              },
            },
          }}
        >
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            textColor="primary"
            indicatorColor="primary"
            sx={{ minHeight: 32, mb: 2, borderBottom: "1px solid #f0f0f0" }}
          >
            <Tab label="Share" sx={{ textTransform: "none", minHeight: 32, fontWeight: 600 }} />
            <Tab label="Publish" sx={{ textTransform: "none", minHeight: 32 }} />
          </Tabs>

          {tabValue === 0 && (
            <Box>
              {/* Form Input Section */}
              <Box component="form" onSubmit={handleInvite} sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Email or group, separated by commas"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "13px",
                      backgroundColor: "#fafafa",
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disableElevation
                  disabled={isInviting}
                  sx={{ textTransform: "none", bgcolor: "#2383e2", "&:hover": { bgcolor: "#1a6cb3" } }}
                >
                  {isInviting ? "Sending..." : "Invite"}
                </Button>
              </Box>

              {inviteMessage && (
                <Typography variant="body2" sx={{ mb: 1.5, color: inviteMessage.includes("Unable") || inviteMessage.includes("Please") ? "error.main" : "success.main" }}>
                  {inviteMessage}
                </Typography>
              )}

              {/* Current User Info Section */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar 
                    src={user?.photo || ""} 
                    sx={{ width: 32, height: 32, bgcolor: "#e3e3e3", color: "#555", fontSize: "14px", fontWeight: "bold" }}
                  >
                    {!user?.photo && (user?.firstName?.charAt(0) || "Z")}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "13px", color: "black" }}>
                      {user?.firstName ? `${user.firstName} (You)` : "Zin Mar Khaing (You)"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: "11px" }}>
                      {user?.email || "your@email.com"}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "12px" }}>
                  Full access
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, mb: 2 }}>
                {collaborators.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No collaborators yet.
                  </Typography>
                ) : (
                  collaborators.map((person) => (
                    <Box key={`${person.invitedEmail}-${person.status}`} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 0.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: "#e8f3ff", color: "#1a6cb3", fontSize: "12px" }}>
                          {person.invitedEmail.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontSize: "13px", fontWeight: 500 }}>
                            {person.invitedEmail}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: "11px" }}>
                            {person.status === "accepted" ? "Active collaborator" : "Pending invite"}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={(event) => handleOpenPermissionMenu(event, person._id)}
                        sx={{
                          textTransform: "none",
                          borderColor: "#e0e0e0",
                          color: person.role === "editor" ? "#2383e2" : person.role === "commenter" ? "#6b7280" : "#37352f",
                          fontSize: "12px",
                          py: 0.2,
                          px: 1,
                        }}
                      >
                        {person.role === "editor" ? "Can edit" : person.role === "commenter" ? "Can comment" : "Can view"}
                      </Button>
                    </Box>
                  ))
                )}
              </Box>

              <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleClosePermissionMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={() => handlePermissionChange("editor")}>Can edit</MenuItem>
                <MenuItem onClick={() => handlePermissionChange("commenter")}>Can comment</MenuItem>
                <MenuItem onClick={() => handlePermissionChange("viewer")}>Can view</MenuItem>
                <MenuItem onClick={handleRemoveCollaborator} sx={{ color: "error.main" }}>Remove</MenuItem>
              </Menu>

              <Divider sx={{ my: 1.5 }} />

              {/* Footer Links */}
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
                  sx={{
                    textTransform: "none",
                    color: "#37352f",
                    borderColor: "#e0e0e0",
                    fontSize: "12px",
                    py: 0.5,
                    "&:hover": { borderColor: "gray" }
                  }}
                >
                  Copy link
                </Button>
              </Box>
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ p: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Publish settings will go here.
              </Typography>
            </Box>
          )}
        </Popover>

        {token ? (
          <Stack direction="row" spacing={1} sx={{ my: { xs: 0, sm: 2 } }}>
            <IconButton component={Link} to="/profile">
              <Avatar
                alt={user?.firstName || "User"}
                src={user?.photo || ""}
                key={user?.photo || "default-avatar"}
              />
            </IconButton>
          </Stack>
        ) : (
          <Stack spacing={1} direction="row" sx={{ my: { xs: 0, sm: 2 } }}>
            <Button
              size="small"
              variant="contained"
              component={Link}
              to="/login"
            >
              Login
            </Button>
            <Button
              size="small"
              variant="contained"
              component={Link}
              to="/signup"
            >
              Sign Up
            </Button>
          </Stack>
        )}
      </Toolbar>

      {invitations.length > 0 && (
        <Box
          sx={{
            px: 2,
            py: 1,
            bgcolor: "#fff7e6",
            borderTop: "1px solid #f3d9a3",
            color: "#7a4b00",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            You have been invited to collaborate with access: {invitations[0].role === "editor" ? "Can edit" : invitations[0].role === "commenter" ? "Can comment" : "Can view"}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              onClick={handleOpenSharedNotes}
              sx={{
                textTransform: "none",
                bgcolor: "#2383e2",
                color: "white",
                borderRadius: 999,
                "&:hover": { bgcolor: "#1a6cb3" },
              }}
            >
              Open shared notes
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={handleWatchLater}
              sx={{
                textTransform: "none",
                borderColor: "#f3d9a3",
                color: "#7a4b00",
                borderRadius: 999,
                bgcolor: "#fff7e6",
                "&:hover": { bgcolor: "#fff1cf", borderColor: "#f3d9a3" },
              }}
            >
              Watch later
            </Button>
          </Stack>
        </Box>
      )}
    </AppBar>
  );
};
