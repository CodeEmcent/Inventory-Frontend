import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    IconButton,
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Grid,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../../services/api"; // Adjust to your API service path
import InventoryTools from "./InventoryTools"; // Import the InventoryTools component

const InventoryDashboard = () => {
    const [inventory, setInventory] = useState([]);
    const [offices, setOffices] = useState([]);
    const [items, setItems] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        office: "",
        item_id: "",
        quantity: 1,
        remarks: "Perfect",
    });
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    // Logout function
    const logoutUser = useCallback(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
    }, [navigate]);

    // Fetch data for inventory, offices, and items
    const fetchData = useCallback(async () => {
        try {
            const [inventoryResponse, officesResponse, itemsResponse] = await Promise.all([
                API.get("/api/inventory/"),
                API.get("/api/offices/"),
                API.get("/api/item-registry/"),
            ]);

            setInventory(inventoryResponse.data);
            setOffices(officesResponse.data);
            setItems(itemsResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            if (error.response?.status === 401) {
                logoutUser();
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

    // Open modal for adding or editing inventory
    const handleOpenModal = (inventoryItem = null) => {
        if (inventoryItem) {
            setIsEditing(true);
            setFormData({
                id: inventoryItem.id,
                office: inventoryItem.office || "",
                item_id: inventoryItem.item_id || "",
                quantity: inventoryItem.quantity || 1,
                remarks: inventoryItem.remarks || "Perfect",
            });
        } else {
            setIsEditing(false);
            setFormData({
                id: null,
                office: "",
                item_id: "",
                quantity: 1,
                remarks: "Perfect",
            });
        }
        setOpenModal(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Submit form (add or edit inventory)
    const handleSubmit = async () => {
        try {
            if (isEditing) {
                await API.put(`/api/inventory/${formData.id}/`, formData);
            } else {
                await API.post("/api/inventory/", formData);
            }
            fetchData();
            handleCloseModal();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    // Delete inventory item
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this inventory item?")) {
            try {
                await API.delete(`/api/inventory/${id}/`);
                fetchData();
            } catch (error) {
                console.error("Error deleting inventory:", error);
            }
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Inventory Dashboard
            </Typography>

            {/* Top Section: Add Inventory Item and Tools */}
            <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 4 }}>
                <Grid item xs={12} sm={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => handleOpenModal()}
                    >
                        Add Inventory Item
                    </Button>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <InventoryTools />
                </Grid>
            </Grid>

            {/* Inventory Table */}
            <TableContainer sx={{ border: '1px solid #ccc' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ccc' }}>Office</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ccc' }}>Item</TableCell>
                            <TableCell
                                sx={{
                                    fontWeight: 'bold',
                                    border: '1px solid #ccc',
                                    textAlign: 'center',
                                }}
                            >
                                Quantity
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ccc' }}>Remarks</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ccc' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {inventory.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell sx={{ border: '1px solid #ccc', padding: '0 8px' }}>{item.office_name || "N/A"}</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc', padding: '0 8px' }}>{item.item_name || "N/A"}</TableCell>
                                <TableCell
                                    sx={{
                                        border: '1px solid #ccc',
                                        padding: '0 8px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {item.quantity}
                                </TableCell>
                                <TableCell sx={{ border: '1px solid #ccc', padding: '0 8px' }}>{item.remarks}</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc', padding: '0 8px' }}>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenModal(item)}
                                        sx={{ marginRight: 1 }}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="secondary" onClick={() => handleDelete(item.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit Inventory Modal */}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>{isEditing ? "Edit Inventory Item" : "Add Inventory Item"}</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Office</InputLabel>
                        <Select
                            name="office"
                            value={formData.office}
                            onChange={handleChange}
                        >
                            {offices.map((office) => (
                                <MenuItem key={office.id} value={office.id}>
                                    {office.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Item</InputLabel>
                        <Select
                            name="item_id"
                            value={formData.item_id}
                            onChange={handleChange}
                        >
                            {items.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        label="Quantity"
                        name="quantity"
                        type="number"
                        fullWidth
                        value={formData.quantity}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Remarks"
                        name="remarks"
                        fullWidth
                        value={formData.remarks}
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
        </Box>
    );
};

export default InventoryDashboard;
