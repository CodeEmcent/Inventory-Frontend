import React from "react";
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, Box } from "@mui/material";
import { Link } from "react-router-dom";

const drawerWidth = 240;

const DashboardLayout = ({ children }) => {
    return (
        <Box sx={{ display: "flex" }}>
            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: "auto" }}>
                    <List>
                        {["Offices", "Inventory", "Reports"].map((text) => (
                            <ListItem button key={text} component={Link} to={`/${text.toLowerCase()}`}>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: "background.default", p: 3, ml: `${drawerWidth}px` }}
            >
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            Dashboard
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default DashboardLayout;
