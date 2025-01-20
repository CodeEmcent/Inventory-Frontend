import React, { useState, useEffect } from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Box,
    Typography,
    Avatar,
    IconButton,
} from "@mui/material";
import {
    Logout as LogoutIcon,
    People as PeopleIcon,
    Business as BusinessIcon,
    Inventory as InventoryIcon,
    Assessment as AssessmentIcon,
    Dashboard as DashboardIcon,
} from "@mui/icons-material"; // Material-UI icons
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import logoutUser from "../../utils/logout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS
import API from "../../services/api";

const Sidebar = ({ setCurrentSection, role }) => {
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [profile, setProfile] = useState(null); // Profile state
    const [profileImage, setProfileImage] = useState(null); // Profile image state

    // Fetch profile data from the database
    const fetchProfileData = async () => {
        try {
            const response = await API.get("/api/users/profile");
            setProfile(response.data);
        } catch (error) {
            console.error("Error fetching profile data", error);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    // Open the confirmation dialog for logout
    const handleLogoutClick = () => {
        setLogoutDialogOpen(true);
    };

    // Close the logout confirmation dialog
    const handleDialogClose = () => {
        setLogoutDialogOpen(false);
    };

    // Confirm logout and execute logout logic
    const handleConfirmLogout = () => {
        try {
            logoutUser(); // Execute logout logic
            setLogoutDialogOpen(false); // Close the dialog
            toast.success("You have been logged out successfully!"); // Show success toast
        } catch (error) {
            setLogoutDialogOpen(false); // Close the dialog
            toast.error("Failed to log out. Please try again."); // Show error toast
        }
    };

    // Handle profile image upload
    const handleProfileImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <Drawer
                variant="permanent"
                sx={{
                    width: 240,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: 240,
                        boxSizing: "border-box",
                        backgroundColor: "#213d77", // Dark theme color
                        color: "#FFFFFF",
                    },
                }}
            >
                {/* Profile Section */}
                <Box sx={{ padding: 2, textAlign: "center", backgroundColor: "#2151a2", marginBottom: 2 }}>
                    <Avatar
                        src={profileImage || (profile?.profile_picture || "/path/to/default-image.jpg")}
                        sx={{ width: 80, height: 80, margin: "0 auto", cursor: "pointer" }}
                        alt="Profile Picture"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageUpload}
                        style={{ display: "none" }}
                        id="profileImageInput"
                    />
                    <label htmlFor="profileImageInput">
                        <IconButton component="span">
                            <Typography variant="caption" sx={{ color: "#FFFFFF", mt: 1 }}>
                                Change Photo
                            </Typography>
                        </IconButton>
                    </label>

                    {/* Check if profile is loaded */}
                    {profile ? (
                        <>
                            <Typography variant="body1" sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
                                {profile.username || "No username available"}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#B0B0B0" }}>
                                {profile.organization?.name || "No organization assigned"}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#B0B0B0" }}>
                                {profile.assigned_offices?.[0]?.name || "No office assigned"}
                            </Typography>
                        </>
                    ) : (
                        <Typography variant="body2" sx={{ color: "#B0B0B0" }}>
                            Loading profile data...
                        </Typography>
                    )}
                </Box>


                <List>
                    <ListItem
                        button
                        onClick={() => setCurrentSection("reports")}
                        sx={{
                            "&:hover": { backgroundColor: "#FFF", color: "#2151a2" },
                            color: "#FFFFFF",
                            cursor: "pointer",
                            "& .MuiListItemIcon-root": {
                                color: "#FFFFFF", // Set the icon color initially
                                "&:hover": {
                                    color: "#2151a2 !important", // Change icon color on hover
                                },
                            },
                        }}
                    >
                        <ListItemIcon>
                            <DashboardIcon sx={{ color: "#FFFFFF" }} />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>

                    {["super_admin", "admin"].includes(role) && (
                        <>
                            <ListItem
                                button
                                onClick={() => setCurrentSection("userManagement")}
                                sx={{
                                    "&:hover": { backgroundColor: "#FFF", color: "#2151a2" },
                                    color: "#FFFFFF",
                                    cursor: "pointer"
                                }}
                            >
                                <ListItemIcon>
                                    <PeopleIcon sx={{ color: "#FFFFFF" }} />
                                </ListItemIcon>
                                <ListItemText primary="User Management" />
                            </ListItem>

                            <ListItem
                                button
                                onClick={() => setCurrentSection("officeManagement")}
                                sx={{
                                    "&:hover": { backgroundColor: "#FFF", color: "#2151a2" },
                                    color: "#FFFFFF",
                                    cursor: "pointer"
                                }}
                            >
                                <ListItemIcon>
                                    <BusinessIcon sx={{ color: "#FFFFFF" }} />
                                </ListItemIcon>
                                <ListItemText primary="Office Management" />
                            </ListItem>

                            <ListItem
                                button
                                onClick={() => setCurrentSection("itemRegistry")}
                                sx={{
                                    "&:hover": { backgroundColor: "#FFF", color: "#2151a2" },
                                    color: "#FFFFFF",
                                    cursor: "pointer"
                                }}
                            >
                                <ListItemIcon>
                                    <InventoryIcon sx={{ color: "#FFFFFF" }} />
                                </ListItemIcon>
                                <ListItemText primary="Item Registry" />
                            </ListItem>

                            <ListItem
                                button
                                onClick={() => setCurrentSection("inventory")}
                                sx={{
                                    "&:hover": { backgroundColor: "#FFF", color: "#2151a2" },
                                    color: "#FFFFFF",
                                    cursor: "pointer"
                                }}
                            >
                                <ListItemIcon>
                                    <AssessmentIcon sx={{ color: "#FFFFFF" }} />
                                </ListItemIcon>
                                <ListItemText primary="Inventory Management" />
                            </ListItem>
                        </>
                    )}

                    {/* Divider */}
                    <Divider sx={{ backgroundColor: "#374151", my: 2 }} />

                    {/* Logout Button */}
                    <ListItem
                        button
                        onClick={handleLogoutClick}
                        sx={{
                            "&:hover": { backgroundColor: "#FFF", color: "#2151a2" },
                            color: "#FFFFFF",
                            cursor: "pointer"
                        }}
                    >
                        <ListItemIcon>
                            <LogoutIcon sx={{ color: "#FFFFFF" }} />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>

            </Drawer>

            {/* Logout Confirmation Dialog */}
            <Dialog
                open={logoutDialogOpen}
                onClose={handleDialogClose}
                aria-labelledby="logout-dialog-title"
                aria-describedby="logout-dialog-description"
                sx={{
                    "& .MuiDialog-paper": {
                        borderRadius: 2,
                        padding: 2,
                        maxWidth: "400px",
                        margin: "auto",
                        textAlign: "center",
                    },
                }}
            >
                <DialogTitle id="logout-dialog-title" sx={{ fontWeight: "bold", color: "red" }}>
                    <Box display="flex" alignItems="center" justifyContent="center">
                        <WarningAmberIcon fontSize="large" sx={{ color: "orange", marginRight: 1 }} />
                        Confirm Logout
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="logout-dialog-description" sx={{ fontSize: "1rem" }}>
                        Are you sure you want to log out? You will need to log back in to access the system.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button onClick={handleDialogClose} variant="outlined" color="primary" sx={{ cursor: "pointer" }}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmLogout} variant="contained" color="error" sx={{ cursor: "pointer" }}>
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Toast Notifications */}
            <ToastContainer position="top-center" autoClose={3000} />
        </>
    );
};

export default Sidebar;
