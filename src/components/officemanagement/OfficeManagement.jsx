import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
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
} from "@mui/material";
import API from "../../services/api"; // Assuming your API service is set up here

const OfficeManagement = () => {
    const [offices, setOffices] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: "", department: "" });
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate(); // Use navigate hook for redirection

    // Logout function
    const logoutUser = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        navigate("/login"); // Redirect to the login page
    };

    // Fetch offices from the API
    const fetchOffices = async () => {
        try {
            // Retrieve the access token from localStorage
            const token = localStorage.getItem("accessToken");

            // If no token is found, log out the user
            if (!token) {
                logoutUser();
                return;
            }

            // If a token exists, proceed to fetch offices
            const response = await API.get("/api/offices/", {
                headers: {
                    Authorization: `Bearer ${token}`,  // Include token in the Authorization header
                }
            });

            // Set the response data to the state
            setOffices(response.data);
        } catch (error) {
            console.error("Error fetching offices:", error);

            // If the error is a 401 Unauthorized, log the user out
            if (error.response?.status === 401) {
                logoutUser();  // Token is likely expired or invalid
            }
        }
    };

    useEffect(() => {
        console.log("OfficeManagement Component Mounted");
        fetchOffices();  // Fetch offices when the component is mounted
    }, []);

    // Handle opening the modal
    const handleOpenModal = (office = null) => {
        if (office) {
            setIsEditing(true);
            setFormData(office); // Pre-fill the form for editing
        } else {
            setIsEditing(false);
            setFormData({ id: null, name: "", department: "" }); // Clear form for new office
        }
        setOpenModal(true);
    };

    // Handle closing the modal
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    // Handle form submission (add or update)
    const handleSubmit = async () => {
        try {
            if (isEditing) {
                await API.put(`/api/offices/${formData.id}/`, {
                    name: formData.name,
                    department: formData.department,
                });
            } else {
                await API.post("/api/offices/", {
                    name: formData.name,
                    department: formData.department,
                });
            }
            fetchOffices(); // Refresh the office list
            handleCloseModal();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    // Handle office deletion
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this office?")) {
            try {
                await API.delete(`/api/offices/${id}/`);
                fetchOffices(); // Refresh the office list
            } catch (error) {
                console.error("Error deleting office:", error);
            }
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Office Management
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenModal()}
                sx={{ marginBottom: 2 }}
            >
                Add New Office
            </Button>
            <TableContainer>
                <Table sx={{ border: 1, borderColor: 'grey.300' }}>
                    <TableHead>
                        <TableRow sx={{ borderBottom: 1, borderColor: 'grey.300' }}>
                            <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: 'grey.300' }}>
                                Name
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: 'grey.300' }}>
                                Department
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: 'grey.300' }}>
                                Created At
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {offices.map((office) => (
                            <TableRow key={office.id} sx={{ borderBottom: 1, borderColor: 'grey.300' }}>
                                <TableCell sx={{ borderRight: 1, borderColor: 'grey.300' }}>{office.name}</TableCell>
                                <TableCell sx={{ borderRight: 1, borderColor: 'grey.300' }}>
                                    {office.department || "N/A"}
                                </TableCell>
                                <TableCell sx={{ borderRight: 1, borderColor: 'grey.300' }}>
                                    {new Date(office.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleOpenModal(office)}
                                        sx={{ marginRight: 1 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleDelete(office.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit Modal */}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>{isEditing ? "Edit Office" : "Add Office"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Office Name"
                        type="text"
                        fullWidth
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Department"
                        type="text"
                        fullWidth
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
        </Box>
    );
};

export default OfficeManagement;
