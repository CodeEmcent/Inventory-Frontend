import React, { useState, useEffect } from "react";
import { Drawer, Divider, Box, Typography, IconButton, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileSection from "./ProfileSection";
import LogoutDialog from "../../utils/LogoutDialog";
import SidebarMenu from "./SidebarMenu";
import API from "../../services/api";
import logoutUser from "../../utils/logout";
import MenuIcon from "@mui/icons-material/Menu"; // Hamburger icon
import ExitToAppIcon from "@mui/icons-material/ExitToApp"; // Logout icon

const Sidebar = ({ setCurrentSection, role }) => {
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [profile, setProfile] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Track if the sidebar is collapsed or expanded

    // Fetch profile data
    const fetchProfileData = async () => {
        try {
            const response = await API.get("/api/users/profile");
            setProfile(response.data);
        } catch (error) {
            console.error("Error fetching profile data:", error);
            toast.error("Failed to load profile data.");
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const handleLogoutClick = () => {
        setLogoutDialogOpen(true);
    };

    const handleDialogClose = () => {
        setLogoutDialogOpen(false);
    };

    const handleConfirmLogout = () => {
        try {
            logoutUser(); // Perform logout
            setLogoutDialogOpen(false); // Close the dialog
            toast.success("You have been logged out successfully!");
        } catch (error) {
            setLogoutDialogOpen(false); // Close the dialog
            toast.error("Failed to log out. Please try again.");
        }
    };

    const handleSidebarToggle = () => {
        setIsSidebarOpen((prev) => !prev); // Toggle the sidebar open/close state
    };

    return (
        <>
            <Drawer
                variant="permanent"
                sx={{
                    width: isSidebarOpen ? 240 : 60, // Change width based on state
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: isSidebarOpen ? 240 : 60, // Same width change here
                        boxSizing: "border-box",
                        backgroundColor: "#213d77",
                        color: "#FFFFFF",
                    },
                }}
            >
                {/* Hamburger Icon to toggle sidebar */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        padding: "10px",
                    }}
                >
                    <IconButton onClick={handleSidebarToggle}>
                        <MenuIcon sx={{ color: "#FFFFFF" }} />
                    </IconButton>
                </Box>

                {/* Conditionally render ProfileSection */}
                {isSidebarOpen && <ProfileSection profile={profile} />}

                {/* Sidebar Menu */}
                <SidebarMenu role={role} setCurrentSection={setCurrentSection} isSidebarOpen={isSidebarOpen} />

                <Divider sx={{ backgroundColor: "#2151a2", height: 30, }} />

                {/* Logout Button with Icon and Hover Effect */}
                <ListItem
                    button
                    onClick={handleLogoutClick}
                    sx={{
                        "&:hover": {
                            backgroundColor: "#2151a2", // Background color on hover
                            color: "#FFFFFF", // Text color on hover (this affects both text and icon)
                        },
                        color: "#FFFFFF", // Default color for text and icon
                        cursor: "pointer",
                        paddingLeft: isSidebarOpen ? undefined : 2, // Adjust padding for collapsed state
                        textAlign: isSidebarOpen ? "flex-start" : "center", // Center label for collapsed state
                        display: "flex", // Align the icon and label horizontally
                        alignItems: "center", // Center vertically
                    }}
                >
                    {/* Icon */}
                    <ListItemIcon
                        sx={{
                            color: "inherit", // Inherit color from parent (will be updated on hover)
                            "&:hover": {
                                color: "#FFFFFF", // Icon color change on hover
                            },
                        }}
                    >
                        <ExitToAppIcon />
                    </ListItemIcon>

                    {/* Label */}
                    {isSidebarOpen && (
                        <ListItemText
                            primary="Logout"
                            sx={{
                                color: "inherit", // Inherit color from parent (will be updated on hover)
                                fontWeight: "bold",
                                "&:hover": {
                                    color: "#FFFFFF", // Label color change on hover
                                },
                            }}
                        />
                    )}
                </ListItem>
            </Drawer>

            {/* Logout Confirmation Dialog */}
            <LogoutDialog open={logoutDialogOpen} onClose={handleDialogClose} onConfirm={handleConfirmLogout} />

            {/* Toast Notifications */}
            <ToastContainer position="top-center" autoClose={3000} />
        </>
    );
};

export default Sidebar;
