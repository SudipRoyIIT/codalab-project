// Sidebar.jsx - Clean version without bottom actions
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Article as NewsIcon,
  Event as EventIcon,
  People as PeopleIcon,
  PhotoLibrary as GalleryIcon,
  Science as ResearchIcon,
  MenuBook as PublicationsIcon,
  EmojiEvents as AchievementsIcon,
  Campaign as AnnouncementIcon,
  WorkspacePremium as AwardsIcon,
  School as TeachingIcon,
  Construction as ProjectIcon,
  SportsSoccer as ActivitiesIcon,
  ExpandMore,
  ExpandLess,
  LibraryBooks as JournalsIcon,
  Business as ConferenceIcon,
  Description as PatentIcon,
  Groups as WorkshopIcon,
  Book as BookIcon,
  School as PhDIcon,
  Engineering as MTechIcon,
  Work as InternIcon,
  Computer as BtechIcon,
} from "@mui/icons-material";
import { useAuth } from "./AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { userRole } = useAuth();
  const isMobile = useMediaQuery("(max-width: 900px)");
  
  const [openDropdowns, setOpenDropdowns] = useState({
    publications: false,
    people: false,
  });

  const navItems = [
    { 
      text: "Dashboard", 
      icon: <DashboardIcon />, 
      path: "/",
    },
    { 
      text: "News", 
      icon: <NewsIcon />, 
      path: "/news",
      adminOnly: true
    },
    { 
      text: "Events", 
      icon: <EventIcon />, 
      path: "/event",
      adminOnly: true
    },
    { 
      text: "People", 
      icon: <PeopleIcon />, 
      path: "/people",
      hasDropdown: true,
      dropdownItems: [
        { text: "PhD Students", icon: <PhDIcon />, path: "/current/phd" },
        { text: "PhD Graduated", icon: <PhDIcon />, path: "/graduated/phd" },
        { text: "MTech Students", icon: <MTechIcon />, path: "/current/mtech" },
        { text: "MTech Graduated", icon: <MTechIcon />, path: "/graduated/mtech" },
        { text: "Interns", icon: <InternIcon />, path: "/interns" },
        { text: "BTech Graduated", icon: <BtechIcon />, path: "/graduated/btech" },
      ]
    },
    { 
      text: "Gallery", 
      icon: <GalleryIcon />, 
      path: "/gallery",
      adminOnly: true
    },
    { 
      text: "Research", 
      icon: <ResearchIcon />, 
      path: "/research",
      adminOnly: true
    },
    { 
      text: "Activities", 
      icon: <ActivitiesIcon />, 
      path: "/activities",
      adminOnly: true
    },
    { 
      text: "Projects", 
      icon: <ProjectIcon />, 
      path: "/project",
      adminOnly: true
    },
    { 
      text: "Teaching", 
      icon: <TeachingIcon />, 
      path: "/teaching",
      adminOnly: true
    },
    { 
      text: "Publications", 
      icon: <PublicationsIcon />, 
      path: null,
      hasDropdown: true,
      dropdownItems: [
        { text: "Journals", icon: <JournalsIcon />, path: "/publications/journals" },
        { text: "Conferences", icon: <ConferenceIcon />, path: "/publications/conference" },
        { text: "Patents", icon: <PatentIcon />, path: "/publications/patents" },
        { text: "Workshops", icon: <WorkshopIcon />, path: "/publications/workshops" },
        { text: "Books", icon: <BookIcon />, path: "/publications/books" },
      ]
    },
    { 
      text: "Achievements", 
      icon: <AchievementsIcon />, 
      path: "/achievements",
      adminOnly: true
    },
    { 
      text: "Announcements", 
      icon: <AnnouncementIcon />, 
      path: "/announcement",
      adminOnly: true
    },
    { 
      text: "Awards", 
      icon: <AwardsIcon />, 
      path: "/awards",
      adminOnly: true
    },
  ];

  const filteredNavItems = navItems.filter(item => 
    !item.adminOnly || userRole === "admin"
  );

  const toggleDropdown = (dropdownName) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdownName]: !prev[dropdownName]
    }));
  };

  const isActive = (path) => {
    if (!path) return false;
    return location.pathname === path || 
           location.pathname.startsWith(path + "/");
  };

  const sidebarContent = (
    <Box sx={{ 
      height: "100%", 
      display: "flex", 
      flexDirection: "column",
      backgroundColor: "var(--sidebar-bg)",
      color: "white",
    }}>
      {/* Profile Section - Made Compact */}
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Avatar
          src="https://faculty.iitr.ac.in/~sudiproy.fcs/web_files/SudipRoy2022.jpg"
          alt="Dr. Sudip Roy"
          sx={{
            width: 60,
            height: 60,
            mx: "auto",
            mb: 1,
            border: "2px solid var(--primary-color)",
          }}
        />
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, fontSize: "0.9rem" }}>
          Dr. Sudip Roy
        </Typography>
        <Typography variant="caption" sx={{ 
          color: "rgba(255,255,255,0.7)", 
          mb: 1,
          fontSize: "0.7rem"
        }}>
          Professor, CoDa Lab
        </Typography>
        <Typography variant="caption" sx={{
          backgroundColor: userRole === "admin" ? "#10b981" : "#3b82f6",
          color: "white",
          px: 1.5,
          py: 0.3,
          borderRadius: "10px",
          fontWeight: 600,
          fontSize: "0.65rem",
        }}>
          {userRole === "admin" ? "Admin" : "Sub-Admin"}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 1 }} />

      {/* Navigation - Full height for scrolling */}
      <Box sx={{ flex: 1, overflowY: "auto", py: 1 }}>
        <List component="nav" sx={{ px: 1 }}>
          {filteredNavItems.map((item) => (
            <React.Fragment key={item.text}>
              {item.hasDropdown ? (
                <>
                  <ListItem
                    button
                    onClick={() => toggleDropdown(item.text.toLowerCase())}
                    sx={{
                      mb: 0.5,
                      borderRadius: "6px",
                      minHeight: "44px",
                      backgroundColor: openDropdowns[item.text.toLowerCase()] 
                        ? "rgba(255,255,255,0.1)" 
                        : "transparent",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ 
                      minWidth: 36, 
                      color: openDropdowns[item.text.toLowerCase()] 
                        ? "var(--primary-color)" 
                        : "rgba(255,255,255,0.7)",
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography variant="body2" sx={{ 
                          fontWeight: 500,
                          fontSize: "0.85rem"
                        }}>
                          {item.text}
                        </Typography>
                      }
                    />
                    {openDropdowns[item.text.toLowerCase()] ? (
                      <ExpandLess sx={{ 
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "18px"
                      }} />
                    ) : (
                      <ExpandMore sx={{ 
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "18px"
                      }} />
                    )}
                  </ListItem>
                  <Collapse in={openDropdowns[item.text.toLowerCase()]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.dropdownItems.map((subItem) => (
                        <ListItem
                          key={subItem.text}
                          button
                          component={Link}
                          to={subItem.path}
                          sx={{
                            pl: 5,
                            mb: 0.5,
                            borderRadius: "6px",
                            minHeight: "40px",
                            backgroundColor: isActive(subItem.path) 
                              ? "rgba(67, 97, 238, 0.2)" 
                              : "transparent",
                            "&:hover": {
                              backgroundColor: "rgba(255,255,255,0.05)",
                            },
                          }}
                        >
                          <ListItemIcon sx={{ 
                            minWidth: 28, 
                            color: isActive(subItem.path) 
                              ? "var(--primary-color)" 
                              : "rgba(255,255,255,0.5)",
                          }}>
                            {subItem.icon}
                          </ListItemIcon>
                          <ListItemText 
                            primary={
                              <Typography variant="body2" sx={{ 
                                color: isActive(subItem.path) ? "white" : "rgba(255,255,255,0.7)",
                                fontSize: "0.8rem"
                              }}>
                                {subItem.text}
                              </Typography>
                            } 
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <ListItem
                  button
                  component={Link}
                  to={item.path}
                  sx={{
                    mb: 0.5,
                    borderRadius: "6px",
                    minHeight: "44px",
                    backgroundColor: isActive(item.path) 
                      ? "rgba(67, 97, 238, 0.2)" 
                      : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: 36, 
                    color: isActive(item.path) 
                      ? "var(--primary-color)" 
                      : "rgba(255,255,255,0.7)",
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body2" sx={{ 
                        color: isActive(item.path) ? "white" : "rgba(255,255,255,0.7)",
                        fontSize: "0.85rem"
                      }}>
                        {item.text}
                      </Typography>
                    } 
                  />
                </ListItem>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Removed bottom actions section - more space for navigation */}
    </Box>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box 
          className="sidebar-container"
          sx={{
            width: "250px", // Slightly narrower for more content space
          }}
        >
          {sidebarContent}
        </Box>
      )}
      
      {/* Mobile Sidebar - if needed */}
      {isMobile && (
        <Box 
          className="sidebar-container"
          sx={{
            width: "250px",
            display: "none", // Hide on mobile if not using
          }}
        >
          {sidebarContent}
        </Box>
      )}
    </>
  );
};

export default Sidebar;