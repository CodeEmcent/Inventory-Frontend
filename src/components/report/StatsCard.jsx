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
import API from "../../services/api";

const Dashboard = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [officeStats, setOfficeStats] = useState([]);
    const [inventoryStats, setInventoryStats] = useState({
        largestItem: null,
        smallestItem: null,
        totalItems: 0,
    });

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
                    textAlign: 'center',           // Center alignment
                    textTransform: 'uppercase',    // Uppercase text
                    letterSpacing: '3px',          // Spaced out characters
                    fontSize: '2.5rem',            // Adjusted font size (you can tweak this value as needed)
                    fontFamily: '"Roboto", sans-serif', // Custom font (Roboto is just an example)
                    fontWeight: 'bold',
                    color: '#213d77',           // Bold font weight
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
                                onClick={() => console.log("View Profile")}
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
                                onClick={() => console.log("View Offices")}
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
                                onClick={() => console.log("View Item Details")}
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
                                onClick={() => console.log("View Item Details")}
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
