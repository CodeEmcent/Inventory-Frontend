import React from "react";
import { Typography, Box } from "@mui/material";

const Dashboard = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Welcome to the Dashboard!
            </Typography>
            <Typography variant="body1">
                Use the sidebar to navigate between Offices, Inventory, and Reports.
            </Typography>
        </Box>
    );
};

export default Dashboard;
