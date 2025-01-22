import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import API from "../../services/api";

const Dashboard = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [officeStats, setOfficeStats] = useState([]);
    const [inventoryStats, setInventoryStats] = useState({
        largestItem: null,
        smallestItem: null,
        totalItems: 0,
    });

    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        // Fetch user profile
        const fetchUserProfile = async () => {
            try {
                const response = await API.get("/api/users/profile/");
                setUserProfile(response.data);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        // Fetch office stats
        const fetchOfficeStats = async () => {
            try {
                const response = await API.get("/api/offices/");
                setOfficeStats(response.data);
            } catch (error) {
                console.error("Error fetching office stats:", error);
            }
        };

        // Fetch inventory stats
        const fetchInventoryStats = async () => {
            try {
                const response = await API.get("/api/inventory/stats/");
                setInventoryStats(response.data);
            } catch (error) {
                console.error("Error fetching inventory stats:", error);
            }
        };

        fetchUserProfile();
        fetchOfficeStats();
        fetchInventoryStats();
    }, []);

    return (
        <Box sx={{ flexGrow: 1, padding: 3 }}>
            <Typography
                variant="h4"
                gutterBottom
                style={{
                    textAlign: "center",
                    textTransform: "uppercase",
                    letterSpacing: "3px",
                    fontSize: "2.5rem",
                    fontFamily: '"Roboto", sans-serif',
                    fontWeight: "bold",
                    color: "#213d77",
                }}
            >
                Inventory Summary
            </Typography>

            <Grid container spacing={3}>
                {/* User Profile Card */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                                {userProfile?.username?.charAt(0).toUpperCase() || "U"}
                            </Avatar>
                            <Typography variant="h6" gutterBottom>
                                {userProfile?.username || "User"}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {userProfile?.email || "user@example.com"}
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{ mt: 2 }}
                                onClick={() => navigate("/api/users/profile")}
                            >
                                View Profile
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Office Stats Card */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Offices
                            </Typography>
                            <Typography variant="h4">{officeStats.length}</Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{ mt: 2 }}
                                onClick={() => navigate("/api/offices/")}
                            >
                                View All
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Inventory Stats: Largest Item */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Largest Item
                            </Typography>
                            <Typography variant="body2">
                                {inventoryStats.largestItem?.name || "N/A"}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Quantity: {inventoryStats.largestItem?.quantity || "N/A"}
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{ mt: 2 }}
                                onClick={() =>
                                    navigate(`/inventory/item/${inventoryStats.largestItem?.id}`)
                                }
                            >
                                View Details
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Inventory Stats: Smallest Item */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Smallest Item
                            </Typography>
                            <Typography variant="body2">
                                {inventoryStats.smallestItem?.name || "N/A"}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Quantity: {inventoryStats.smallestItem?.quantity || "N/A"}
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{ mt: 2 }}
                                onClick={() =>
                                    navigate(`/inventory/item/${inventoryStats.smallestItem?.id}`)
                                }
                            >
                                View Details
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Total Items Card */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Total Items
                            </Typography>
                            <Typography variant="h4">{inventoryStats.totalItems}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
