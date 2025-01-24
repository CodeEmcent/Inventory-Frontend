import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber'; // For the warning icon


const LogoutDialog = ({ open, onClose, onConfirm }) => (
    <Dialog
        open={open}
        onClose={onClose}
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
            <Button onClick={onClose} variant="outlined" color="primary" sx={{ cursor: "pointer" }}>
                Cancel
            </Button>
            <Button onClick={onConfirm} variant="contained" color="error" sx={{ cursor: "pointer" }}>
                Logout
            </Button>
        </DialogActions>
    </Dialog>
);

export default LogoutDialog;