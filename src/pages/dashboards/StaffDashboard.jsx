import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Drawer, Divider, Button, Grid, Card, CardContent, Avatar } from "@mui/material";
import { Assessment, Inventory, Business } from "@mui/icons-material";
import Sidebar from "../../pages/dashboards/Sidebar";
import API from "../../services/api";
import logoutUser from "../../utils/logout";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import InventoryDashboard from "../../components/inventory/InventoryDashboard";
import ProfileSection from "./ProfileSection";

const StaffDashboard = () => {
    const [currentSection, setCurrentSection] = useState("overview"); // Track the active section
    const [assignedOffices, setAssignedOffices] = useState([]);
    const [inventoryCount, setInventoryCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch assigned offices
                const officesResponse = await API.get("/api/offices/");
                setAssignedOffices(officesResponse.data);

                // Fetch inventory summary
                const inventoryResponse = await API.get("/api/staff/inventory-summary/");
                setInventoryCount(inventoryResponse.data.count || 0);
            } catch (error) {
                console.error("Error fetching staff dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    // Example function placeholders for button actions
    const handleAccessInventory = () => {
        // Navigate to inventory page or trigger inventory logic
        console.log("Access Inventory");
        navigate("/staff-dashboard");  // Example route for inventory
    };
    
    const handleGenerateReports = () => {
        // Trigger report generation logic (API call, etc.)
        console.log("Generate Reports");
        navigate("/staff-dashboard");  // Example route for inventory
        // You can replace this with your logic for generating reports
    };

    // Render the active section/component
    const renderSection = () => {
        switch (currentSection) {
            case "profile":
                return <ProfileSection />;
            case "inventory":
                return <InventoryDashboard />;
            default:
                return (
                    <Grid container spacing={3}>
                        {/* Assigned Offices */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ textAlign: "center" }}>
                                <CardContent>
                                    <Avatar sx={{ bgcolor: "#3f51b5", margin: "0 auto", mb: 2 }}>
                                        <Business />
                                    </Avatar>
                                    <Typography variant="h6">Assigned Offices</Typography>
                                    <Typography>{assignedOffices.length || 0} Offices</Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Inventory Overview */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ textAlign: "center" }}>
                                <CardContent>
                                    <Avatar sx={{ bgcolor: "#4caf50", margin: "0 auto", mb: 2 }}>
                                        <Inventory />
                                    </Avatar>
                                    <Typography variant="h6">Inventory Items</Typography>
                                    <Typography>{inventoryCount} Items</Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Reports or Summary */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ textAlign: "center" }}>
                                <CardContent>
                                    <Avatar sx={{ bgcolor: "#f44336", margin: "0 auto", mb: 2 }}>
                                        <Assessment />
                                    </Avatar>
                                    <Typography variant="h6">Reports</Typography>
                                    <Typography>View Detailed Reports</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                );
        }
    };

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            {/* Sidebar */}
            <Sidebar role="staff" setCurrentSection={setCurrentSection} />

            {/* Main Content */}
            <Box sx={{ flexGrow: 1 }}>
                {/* Dashboard Header */}
                <DashboardHeader
                    dashboardName="Staff Dashboard"
                />

                {/* Render Active Section */}
                <Container sx={{ paddingTop: 3 }}>
                    {renderSection()} {/* Render the current section */}
                </Container>

                {/* Quick Actions */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "50vh", // Full viewport height to center vertically
                        textAlign: "center", // Center the text
                    }}
                >
                    <Typography variant="subtitle1" sx={{ fontSize: "1rem", mb: 2 }}>
                        Quick Actions
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2, // Space between buttons
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                height: 40, // Reduced height
                                fontSize: "0.9rem", // Smaller text size
                                minWidth: 140, // Ensure the buttons are consistently sized
                            }}
                            onClick={handleAccessInventory}
                        >
                            Access Inventory
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{
                                height: 40, // Reduced height
                                fontSize: "0.9rem", // Smaller text size
                                minWidth: 140, // Ensure the buttons are consistently sized
                            }}
                            onClick={handleGenerateReports}
                        >
                            Generate Reports
                        </Button>
                    </Box>
                </Box>


            </Box>
        </Box>
    );
};

export default StaffDashboard;
