import React from 'react';
import { Box, Avatar, IconButton, Typography } from '@mui/material';


const ProfileSection = ({ profile, onImageUpload }) => (
    <Box sx={{ padding: 2, textAlign: "center", backgroundColor: "#2151a2", marginBottom: 2 }}>
        <Avatar
            src={profile?.profile_picture || "/path/to/default-image.jpg"}
            sx={{ width: 80, height: 80, margin: "0 auto", cursor: "pointer" }}
            alt="Profile Picture"
        />
        <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
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
);

export default ProfileSection;