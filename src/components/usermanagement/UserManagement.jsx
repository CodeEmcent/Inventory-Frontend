import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import API from "../../services/api";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserManagement = () => {
    const [users, setUsers] = useState([]); // Initialize users as an empty array
    const [offices, setOffices] = useState([]); // No longer need organizations
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null); // Store the user to delete
    const navigate = useNavigate();

    // Logout function
    const logoutUser = useCallback(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        navigate("/login");
    }, [navigate]);

    const fetchData = useCallback(async () => {
        try {
            const response = await API.get("/api/users/all-staff/");
            const { users, offices } = response.data;

            // Filter out users with the 'admin' role
            const filteredUsers = users.filter(user => user.role !== "super_admin");

            // Sort the users array by username in ascending order
            const sortedUsers = filteredUsers.sort((a, b) => {
                if (a.username < b.username) return -1;
                if (a.username > b.username) return 1;
                return 0;
            });

            // Set state for sorted and filtered users and offices
            setUsers(Array.isArray(sortedUsers) ? sortedUsers : []);
            setOffices(Array.isArray(offices) ? offices : []);
        } catch (error) {
            if (error.response?.status === 401) {
                logoutUser();
            } else {
                console.error("Error fetching data:", error);
                toast.error("Failed to fetch user data.");
            }
        }
    }, [logoutUser]);


    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            logoutUser();
        } else {
            fetchData();
        }
    }, [fetchData, logoutUser]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle office selection
    const handleOfficeChange = (e) => {
        const {
            target: { value },
        } = e;
        setFormData((prevData) => ({
            ...prevData,
            assigned_offices: typeof value === "string" ? value.split(",") : value,
        }));
    };

    // Open modal for adding or editing a user
    const handleOpenModal = (user = null) => {
        if (user) {
            setIsEditing(true);
            setFormData({
                id: user.id,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: user.password,
            });
        } else {
            setIsEditing(false);
            setFormData({
                id: null,
                username: "",
                first_name: "",
                last_name: "",
                email: "",
                password: "",
            });
        }
        setOpenModal(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    // Submit form (Add or Edit)
    const handleSubmit = async () => {
        try {
            if (isEditing) {
                await API.put(`/api/users/update/${formData.id}/`, formData);
                toast.success("User updated successfully.");
            } else {
                await API.post("/api/users/register/", formData);
                toast.success("User created successfully.");
            }
            await fetchData();
            handleCloseModal();
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Failed to submit user data.");
        }
    };
    

    // Open delete confirmation dialog
    const handleDeleteDialogOpen = (user) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    // Close delete confirmation dialog
    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setUserToDelete(null);
    };

    // Confirm delete user
    const handleConfirmDelete = async () => {
        try {
            await API.delete(`/api/users/delete/${userToDelete.id}/`);
            toast.success("User deleted successfully.");
            await fetchData();
            handleDeleteDialogClose();
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user.");
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                User Management
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenModal()}
                sx={{ marginBottom: 2 }}
            >
                Add New User
            </Button>

            <TableContainer>
                <Table sx={{ border: 1, borderColor: 'grey.300' }}>
                    <TableHead>
                        <TableRow sx={{ borderBottom: 1, borderColor: 'grey.300' }}>
                            <TableCell sx={{ borderRight: 1, borderColor: 'grey.300', fontWeight: 'bold' }}>
                                Username
                            </TableCell>
                            <TableCell sx={{ borderRight: 1, borderColor: 'grey.300', fontWeight: 'bold' }}>
                                First Name
                            </TableCell>
                            <TableCell sx={{ borderRight: 1, borderColor: 'grey.300', fontWeight: 'bold' }}>
                                Last Name
                            </TableCell>
                            <TableCell sx={{ borderRight: 1, borderColor: 'grey.300', fontWeight: 'bold' }}>
                                Email
                            </TableCell>
                            <TableCell sx={{ borderRight: 1, borderColor: 'grey.300', fontWeight: 'bold' }}>
                                Role
                            </TableCell>
                            <TableCell sx={{ borderRight: 1, borderColor: 'grey.300', fontWeight: 'bold' }}>
                                Assigned Offices
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {Array.isArray(users) &&
                            users.map((user) => (
                                <TableRow
                                    key={user.id}
                                    sx={{
                                        borderBottom: 1,
                                        borderColor: 'grey.300',
                                        height: '40px', // Reduce the row height
                                    }}
                                >
                                    <TableCell
                                        sx={{
                                            borderRight: 1,
                                            borderColor: 'grey.300',
                                            padding: '0 8px', // Reduce padding for compact layout
                                        }}
                                    >
                                        {user.username}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            borderRight: 1,
                                            borderColor: 'grey.300',
                                            padding: '0 8px', // Reduce padding for compact layout
                                        }}
                                    >
                                        {user.first_name}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            borderRight: 1,
                                            borderColor: 'grey.300',
                                            padding: '0 8px', // Reduce padding for compact layout
                                        }}
                                    >
                                        {user.last_name}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            borderRight: 1,
                                            borderColor: 'grey.300',
                                            padding: '0 8px',
                                        }}
                                    >
                                        {user.email}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            borderRight: 1,
                                            borderColor: 'grey.300',
                                            padding: '0 8px',
                                        }}
                                    >
                                        {user.role}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            borderRight: 1,
                                            borderColor: 'grey.300',
                                            padding: '0 8px',
                                        }}
                                    >
                                        {user.assigned_offices
                                            .map((office) => office.name)
                                            .join(", ") || "N/A"}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            padding: '0 8px',
                                        }}
                                    >
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleOpenModal(user)}
                                            aria-label="edit user"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="secondary"
                                            onClick={() => handleDeleteDialogOpen(user)}
                                            aria-label="delete user"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>

                </Table>
            </TableContainer>

            {/* Add/Edit User Modal */}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>{isEditing ? "Edit User" : "Add User"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Username"
                        name="username"
                        fullWidth
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="First Name"
                        name="first_name"
                        fullWidth
                        value={formData.first_name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Last Name"
                        name="last_name"
                        fullWidth
                        value={formData.last_name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        name="email"
                        fullWidth
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Password"
                        name="password"
                        type="password"
                        fullWidth
                        value={formData.password}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        {isEditing ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteDialogClose}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
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
                <DialogTitle id="delete-dialog-title" sx={{ fontWeight: "bold", color: "red" }}>
                    <Box display="flex" alignItems="center" justifyContent="center">
                        <WarningAmberIcon fontSize="large" sx={{ color: "orange", marginRight: 1 }} />
                        Confirm Deletion
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description" sx={{ fontSize: "1rem" }}>
                    Are you sure you want to delete user{" "}
                    <strong>{userToDelete?.username}</strong>? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button onClick={handleDeleteDialogClose} variant="outlined" color="primary" sx={{ cursor: "pointer" }}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} variant="contained" color="error" sx={{ cursor: "pointer" }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Toast Notifications */}
            <ToastContainer position="top-center" autoClose={3000} />
        </Box>
    );
};

export default UserManagement;
