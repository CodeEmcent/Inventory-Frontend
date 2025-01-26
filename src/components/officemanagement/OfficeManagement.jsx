import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import AssignOffices from "./AssignOffices";
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
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import API from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OfficeManagement = () => {
    const [offices, setOffices] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openAssignModal, setOpenAssignModal] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: "", department: "" });
    const [assignData, setAssignData] = useState({ staffId: "", officeId: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [officeToDelete, setOfficeToDelete] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' }); // Sorting state
    const navigate = useNavigate();

    // Logout function
    const logoutUser = useCallback(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        navigate("/login");
    }, [navigate]);

    const fetchOffices = useCallback(async () => {
        try {
            const response = await API.get("/api/offices/");
            setOffices(response.data);
        } catch (error) {
            console.error("Error fetching offices:", error);
            if (error.response?.status === 401) logoutUser();
            else toast.error("Failed to fetch offices.");
        }
    });

    useEffect(() => {
        const fetchOffices = async () => {
            try {
                const response = await API.get("/api/offices/");
                setOffices(response.data);
            } catch (error) {
                console.error("Error fetching offices:", error);
                if (error.response?.status === 401) logoutUser();
                else toast.error("Failed to fetch offices.");
            }
        };

        console.log("OfficeManagement Component Mounted");
        fetchOffices();
    }, [logoutUser]);


    // Sorting function
    const sortOffices = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        const sortedOffices = [...offices].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setOffices(sortedOffices);
        setSortConfig({ key, direction });
    };

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
                toast.success("Office updated successfully.");
            } else {
                await API.post("/api/offices/", {
                    name: formData.name,
                    department: formData.department,
                });
                toast.success("Office added successfully.");
            }
            fetchOffices(); // Refresh the office list
            handleCloseModal();
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Office already exists. Please, create a new office.");
        }
    };

    // Open delete confirmation dialog
    const handleDeleteDialogOpen = (office) => {
        setOfficeToDelete(office);
        setDeleteDialogOpen(true);
    };

    // Close delete confirmation dialog
    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setOfficeToDelete(null);
    };

    // Confirm delete
    const handleConfirmDelete = async () => {
        try {
            await API.delete(`/api/offices/${officeToDelete.id}/`);
            toast.success("Office deleted successfully.");
            fetchOffices();
            handleDeleteDialogClose();
        } catch (error) {
            console.error("Error deleting office:", error);
            toast.error("Failed to delete office.");
        }
    };

    return (
        <Box>
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
                    color: '#213d77',
                    marginBottom: '30px',
                }}
            >
                Office Management
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>


                {/* Left-aligned Button */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal()}
                    sx={{
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        paddingX: 3,
                        height: "36px", // Consistent button height
                    }}
                >
                    Add New Office
                </Button>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setOpenAssignModal(true)} // Open AssignOffices modal
                    sx={{
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        paddingX: 3,
                        height: "36px", // Consistent button height
                    }}
                >
                    Assign Office to Staff< AssignOffices />
                </Button>
            </Box>

            <TableContainer sx={{ border: '1px solid #ccc' }}>
                <Table sx={{ border: 1, borderColor: 'grey.300' }}>
                    <TableHead>
                        <TableRow
                            sx={{
                                borderBottom: 1,
                                borderColor: 'grey.300',
                                height: '40px',
                                backgroundColor: '#e0e0e0',
                            }}
                        >
                            <TableCell
                                sx={{ fontWeight: 'bold', border: '1px solid #ccc', padding: '8px 12px', border: '1px solid #ccc' }}
                                onClick={() => sortOffices('name')}
                            >
                                Name
                                {sortConfig.key === 'name' && (
                                    sortConfig.direction === 'asc' ?
                                        <ArrowUpwardIcon fontSize="small" sx={{ marginLeft: 1 }} /> :
                                        <ArrowDownwardIcon fontSize="small" sx={{ marginLeft: 1 }} />
                                )}
                            </TableCell>
                            <TableCell
                                sx={{ fontWeight: 'bold', border: '1px solid #ccc', padding: '8px 12px', border: '1px solid #ccc' }}
                                onClick={() => sortOffices('department')}
                            >
                                Department
                                {sortConfig.key === 'department' && (
                                    sortConfig.direction === 'asc' ?
                                        <ArrowUpwardIcon fontSize="small" sx={{ marginLeft: 1 }} /> :
                                        <ArrowDownwardIcon fontSize="small" sx={{ marginLeft: 1 }} />
                                )}
                            </TableCell>
                            <TableCell
                                sx={{ fontWeight: 'bold', border: '1px solid #ccc', padding: '8px 12px', border: '1px solid #ccc' }}
                            >
                                Created At
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ccc', padding: '8px 12px', border: '1px solid #ccc' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {offices.map((office) => (
                            <TableRow
                                key={office.id}
                                sx={{
                                    borderBottom: 1,
                                    borderColor: 'grey.300',
                                    height: '36px', // Reduce body row height
                                }}
                            >
                                <TableCell
                                    sx={{
                                        borderRight: 1,
                                        borderColor: 'grey.300',
                                        padding: '6px', // Compact padding
                                    }}
                                >
                                    {office.name}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        borderRight: 1,
                                        borderColor: 'grey.300',
                                        padding: '6px',
                                    }}
                                >
                                    {office.department || "N/A"}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        borderRight: 1,
                                        borderColor: 'grey.300',
                                        padding: '6px',
                                    }}
                                >
                                    {new Date(office.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        padding: '0 8px',
                                    }}
                                >
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenModal(office)}
                                        aria-label="edit office"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="secondary"
                                        onClick={() => handleDeleteDialogOpen(office)}
                                        aria-label="delete office"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
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

            {/* AssignOffices Modal */}
            <AssignOffices open={openAssignModal} onClose={() => setOpenAssignModal(false)} />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteDialogClose}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title" sx={{ fontWeight: "bold", color: "red" }}>
                    <Box display="flex" alignItems="center" justifyContent="center">
                        <WarningAmberIcon fontSize="large" sx={{ color: "orange", marginRight: 1 }} />
                        Confirm Deletion
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete the office{" "}
                        <strong>{officeToDelete?.name}</strong>? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose} variant="outlined" color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} variant="contained" color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Toast Notifications */}
            <ToastContainer position="top-center" autoClose={3000} />
        </Box>
    );
};

export default OfficeManagement;
