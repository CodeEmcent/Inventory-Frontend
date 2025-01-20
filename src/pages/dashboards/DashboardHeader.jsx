// src/components/Header.jsx
import React from "react";
import { Box, Typography, AppBar, Toolbar } from "@mui/material";

const Header = ({ dashboardName, welcomeMessage }) => {
    return (
        <AppBar position="static" sx={{ backgroundColor: "#213d77", color: "#FFFFFF" }}>
            <Toolbar>
                {/* Welcome Note */}
                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "left" }}>
                    {welcomeMessage}
                </Typography>

                {/* Dashboard Name */}
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                        textTransform: 'uppercase',          // Spaced out characters
                        fontWeight: 'bold',            // Bold font weight                
                    }}>
                    {dashboardName}
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
