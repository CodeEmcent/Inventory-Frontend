import React, { useState, useEffect } from "react";
import { Box, Avatar, IconButton, Typography, CircularProgress, Alert } from "@mui/material";
import { Pencil } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../services/api";

const ProfileSection = ({ role }) => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    // Fetch profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    throw new Error("Token not found. Please log in again.");
                }

                const response = await API.get("/api/users/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setProfile(response.data.data); // Ensure this matches your API response structure
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("Failed to fetch profile. Please try again later.");
            }
        };

        fetchProfile();
    }, []);

    // Handle image upload
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];

        if (!file) {
            setError("No file selected.");
            return;
        }

        const formData = new FormData();
        formData.append("profile_picture", file);

        try {
            setIsUploading(true); // Show loading indicator
            const token = localStorage.getItem("accessToken");

            await API.post("/api/users/profile-picture/", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            // Re-fetch the profile data to reflect the updated profile picture
            const profileResponse = await API.get("/api/users/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setProfile(profileResponse.data.data); // Update profile with the latest data
            toast.success("Profile picture updated successfully!");
            setError(""); // Clear any previous errors
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            setError("Failed to upload profile picture. Please try again.");
        } finally {
            setIsUploading(false); // Hide loading indicator
        }
    };

    return (
        <Box sx={{ padding: 2, textAlign: "center", backgroundColor: "#2151a2", marginBottom: 2 }}>
            {isUploading && <CircularProgress sx={{ marginBottom: 2 }} />}
            {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}

            <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar
                    src={`${profile?.profile_picture || "/path/to/default-image.jpg"}?t=${new Date().getTime()}`}
                    sx={{ width: 80, height: 80, margin: "0 auto", cursor: "pointer" }}
                    alt="Profile Picture"
                />
                <label htmlFor="profileImageInput">
                    <IconButton
                        component="span"
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            bgcolor: "white",
                            borderRadius: "50%",
                            boxShadow: 2,
                            padding: "2px",
                        }}
                    >
                        <Pencil size={16} color="#2151a2" />
                    </IconButton>
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                    id="profileImageInput"
                />
            </Box>

            {profile ? (
                <>
                    <Typography variant="body1" sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
                        {profile.username || "No username available"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#B0B0B0" }}>
                        {profile.organization || "No organization assigned"}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#FFFFFF", // White color for text
                            fontStyle: "italic", // Italic text
                        }}
                    >
                        {profile?.assigned_offices && profile.assigned_offices.length > 0 ? (
                            profile.assigned_offices.map((office, index) => (
                                <span key={index}>
                                    {office}
                                    {index < profile.assigned_offices.length - 1 && (
                                        <span style={{ margin: "0 8px", color: "#FFFFFF" }}>|</span>
                                    )}
                                </span>
                            ))
                        ) : profile ? (
                            <span>No offices assigned</span>
                        ) : (
                            <span>Loading assigned offices...</span>
                        )}
                    </Typography>

                    {role === "staff" && (
                        <Typography variant="body2" sx={{ color: "#B0B0B0", marginTop: 2 }}>
                            Your Role: Staff Member
                        </Typography>
                    )}

                    {(role === "admin" || role === "super_admin") && (
                        <>
                            <Typography variant="body2" sx={{ color: "#B0B0B0", marginTop: 2 }}>
                                Admin Panel Access
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#B0B0B0" }}>
                                Full access to user management, organization settings, and more.
                            </Typography>
                        </>
                    )}
                </>
            ) : (
                <Typography variant="body2" sx={{ color: "#B0B0B0" }}>
                    Loading profile data...
                </Typography>
            )}
        </Box>
    );
};

export default ProfileSection;
