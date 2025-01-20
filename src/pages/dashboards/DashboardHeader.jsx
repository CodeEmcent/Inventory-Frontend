// src/components/Header.jsx
import React from "react";
import { Box, Typography, AppBar, Toolbar } from "@mui/material";

const Header = ({ dashboardName, welcomeMessage }) => {
    return (
        <AppBar position="static" sx={{ backgroundColor: "#1E293B", color: "#FFFFFF" }}>
            <Toolbar>
                {/* Welcome Note */}
                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "left" }}>
                    {welcomeMessage}
                </Typography>

                {/* Dashboard Name */}
                <Typography variant="h5" sx={{ textAlign: "center", flexGrow: 1 }}>
                    {dashboardName}
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
