import React from "react";

import "./Sidebar.css";
import { List, ListItem, ListItemIcon, ListItemText, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    { text: "Home", path: "/" },
    { text: "People", path: "/people" },
    { text: "Research", path: "/research" },
    { text: "Publications", path: "/publication" },
    { text: "Achievements By Students", path: "/achievements" },
    { text: "Gallery", path: "/gallery" },
    { text: "Contact", path: "/contact" },

  ];

  return (
    <div className="sidebar position-fixed" style={{ marginTop: "6%" }}>
      <List>
        {navItems.map((item, index) => (
          <ListItem
            button
            key={index}
            component={Link}
            to={item.path}
            aria-label={item.text}
          >
            <ListItemIcon>
               <Box
                component="img"
                src="https://i.ibb.co/my8yDx4/sidebar-icon.png"
                alt={item.text}
                sx={{ width: '20px', height: '20px' }}
              />
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Sidebar;
