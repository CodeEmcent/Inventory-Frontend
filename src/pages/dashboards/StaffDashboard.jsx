// src/pages/StaffDashboard.js
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import logoutUser from "../../utils/logout"; // Adjust the import path if needed

const StaffDashboard = () => {
    return (
        <Box sx={{ padding: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4">Staff Dashboard</Typography>
                <Button variant="outlined" color="secondary" onClick={logoutUser}>
                    Logout
                </Button>
            </Box>
            <p>Welcome, Staff! You have limited access to the system.</p>
            {/* Additional staff features */}
        </Box>
    );
};

export default StaffDashboard;
