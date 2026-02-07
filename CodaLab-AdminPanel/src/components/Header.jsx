// Header.jsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Badge,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useAuth } from "./AuthContext";

const Header = ({ setCurrentUser, toggleSidebar }) => {
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);

  const getUserInitials = () => {
    if (currentUser?.name) {
      return currentUser.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsClick = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationsAnchor(null);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const handleSettingsClick = () => {
    navigate("/settings");
    handleMenuClose();
  };

  const handleLogoutClick = () => {
    setCurrentUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userRole");
    navigate("/signin");
    handleMenuClose();
  };

  const handleDashboardClick = () => {
    navigate("/");
  };

  const notifications = [
    { id: 1, text: "New publication added", time: "2 min ago", read: false },
    { id: 2, text: "3 new students registered", time: "1 hour ago", read: true },
    { id: 3, text: "System maintenance scheduled", time: "Yesterday", read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="header-container">
      <AppBar
        position="static"
        sx={{
          backgroundColor: "var(--header-bg)",
          color: "var(--dark-color)",
          boxShadow: "var(--shadow-sm)",
          borderBottom: "1px solid var(--border-color)",
          height: "64px",
        }}
      >
        <Toolbar sx={{ minHeight: "64px", paddingX: { xs: 2, md: 3 } }}>
          {/* Left side */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            {isMobile && toggleSidebar && (
              <IconButton
                color="inherit"
                onClick={toggleSidebar}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            {/* Logo */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                "&:hover": { opacity: 0.8 },
              }}
              onClick={() => navigate("/")}
            >
              <Avatar
                src="https://i.ibb.co/378LhGr/Whats-App-Image-2024-06-22-at-23-41-20-cc83bb23.jpg"
                alt="CoDa Lab Logo"
                sx={{
                  width: 40,
                  height: 40,
                  mr: 2,
                  border: "2px solid var(--primary-color)",
                }}
              />
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "var(--primary-color)",
                    lineHeight: 1.2,
                  }}
                >
                  CoDa Lab
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "var(--gray-color)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  }}
                >
                  IIT Roorkee
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 } }}>
            {/* Dashboard Badge */}
            <Box
              onClick={handleDashboardClick}
              sx={{
                backgroundColor: "var(--primary-color)",
                color: "white",
                padding: "6px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "var(--secondary-color)",
                  transform: "translateY(-1px)",
                },
                display: { xs: "none", sm: "block" },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Dashboard
              </Typography>
            </Box>

            {/* Role Badge */}
            <Box
              sx={{
                backgroundColor: userRole === "admin" ? "#dcfce7" : "#f0f9ff",
                color: userRole === "admin" ? "#166534" : "#0369a1",
                padding: "4px 12px",
                borderRadius: "12px",
                border: "1px solid",
                borderColor: userRole === "admin" ? "#bbf7d0" : "#bae6fd",
                fontSize: "0.75rem",
                fontWeight: 600,
                display: { xs: "none", md: "block" },
              }}
            >
              {userRole === "admin" ? "Administrator" : "Sub-Admin"}
            </Box>

            {/* Notifications */}
            <IconButton
              color="inherit"
              onClick={handleNotificationsClick}
              sx={{
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
              }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* User Avatar */}
            <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
              <Avatar
                onClick={handleAvatarClick}
                sx={{
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                  cursor: "pointer",
                  width: 40,
                  height: 40,
                  fontWeight: 600,
                  border: "2px solid white",
                  boxShadow: "var(--shadow-sm)",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "var(--shadow-md)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {getUserInitials()}
              </Avatar>
              
              <Box sx={{ ml: 1, display: { xs: "none", md: "block" } }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {currentUser?.name || "User"}
                </Typography>
                <Typography variant="caption" sx={{ color: "var(--gray-color)" }}>
                  {currentUser?.email || "user@example.com"}
                </Typography>
              </Box>
            </Box>

            {/* User Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: "var(--border-radius-md)",
                  "& .MuiMenuItem-root": {
                    padding: "10px 16px",
                    fontSize: "0.9rem",
                    "&:hover": {
                      backgroundColor: "rgba(67, 97, 238, 0.1)",
                    },
                  },
                },
              }}
            >
              <MenuItem onClick={handleProfileClick}>
                <PersonIcon sx={{ mr: 2, fontSize: 20, color: "var(--gray-color)" }} />
                My Profile
              </MenuItem>
              <MenuItem onClick={handleSettingsClick}>
                <SettingsIcon sx={{ mr: 2, fontSize: 20, color: "var(--gray-color)" }} />
                Settings
              </MenuItem>
              <MenuItem onClick={handleLogoutClick} sx={{ color: "var(--danger-color)" }}>
                <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
                Logout
              </MenuItem>
            </Menu>

            {/* Notifications Menu */}
            <Menu
              anchorEl={notificationsAnchor}
              open={Boolean(notificationsAnchor)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  width: 320,
                  maxHeight: 400,
                  borderRadius: "var(--border-radius-md)",
                },
              }}
            >
              <Box sx={{ p: 2, borderBottom: "1px solid var(--border-color)" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Notifications
                </Typography>
                <Typography variant="caption" sx={{ color: "var(--gray-color)" }}>
                  You have {unreadCount} unread messages
                </Typography>
              </Box>
              {notifications.map((notification) => (
                <MenuItem
                  key={notification.id}
                  sx={{
                    borderLeft: notification.read ? "none" : "3px solid var(--primary-color)",
                    backgroundColor: notification.read ? "transparent" : "rgba(67, 97, 238, 0.05)",
                  }}
                >
                  <Box sx={{ width: "100%" }}>
                    <Typography variant="body2">{notification.text}</Typography>
                    <Typography variant="caption" sx={{ color: "var(--gray-color)" }}>
                      {notification.time}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
              <MenuItem sx={{ justifyContent: "center", color: "var(--primary-color)" }}>
                View All Notifications
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;