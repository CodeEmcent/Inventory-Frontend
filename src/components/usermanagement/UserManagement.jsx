import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import API from "../../services/api";

const UserManagement = () => {
    const [users, setUsers] = useState([]); // Initialize users as an empty array
    const [offices, setOffices] = useState([]); // No longer need organizations
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        username: "",
        email: "",
        role: "staff",
        assigned_offices: [],
    });
    const [isEditing, setIsEditing] = useState(false);
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
                email: user.email,
                role: user.role,
                assigned_offices: user.assigned_offices.map((office) => office.id),
            });
        } else {
            setIsEditing(false);
            setFormData({
                id: null,
                username: "",
                email: "",
                role: "staff",
                assigned_offices: [],
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
                await API.put(`/api/users/${formData.id}/`, formData);
            } else {
                await API.post("/api/users/", formData);
            }
            fetchData();
            handleCloseModal();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    // Delete user
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await API.delete(`/api/users/${id}/`);
                fetchData();
            } catch (error) {
                console.error("Error deleting user:", error);
            }
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
                                            onClick={() => handleDelete(user.id)}
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
                        label="Email"
                        name="email"
                        fullWidth
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Role</InputLabel>
                        <Select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <MenuItem value="super_admin">Super Admin</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="staff">Staff</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Assigned Offices</InputLabel>
                        <Select
                            multiple
                            name="assigned_offices"
                            value={formData.assigned_offices}
                            onChange={handleOfficeChange}
                        >
                            {offices.map((office) => (
                                <MenuItem key={office.id} value={office.id}>
                                    {office.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
        </Box>
    );
};

export default UserManagement;
