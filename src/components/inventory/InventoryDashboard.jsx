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
    Tooltip,
} from "@mui/material";
import {
    Add,
    Edit,
    Delete,
    Sort,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import InventoryTools from "./InventoryTools";

const InventoryDashboard = () => {
    const [inventory, setInventory] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);
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
    const [filterCriteria, setFilterCriteria] = useState({ office: "", item: "" });
    const [sortOrder, setSortOrder] = useState({ column: "", direction: "asc" });
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
                API.get("/api/item-register/"),
            ]);

            setInventory(inventoryResponse.data);
            setFilteredInventory(inventoryResponse.data);
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

    // Handle filter change
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterCriteria((prev) => ({ ...prev, [name]: value }));
    };

    // Apply filters
    useEffect(() => {
        let data = [...inventory];
        if (filterCriteria.office) {
            data = data.filter((item) => item.office_name === filterCriteria.office);
        }
        if (filterCriteria.item) {
            data = data.filter((item) => item.item_name === filterCriteria.item);
        }
        setFilteredInventory(data);
    }, [filterCriteria, inventory]);

    // Handle sorting
    const handleSort = (column) => {
        const isAscending = sortOrder.column === column && sortOrder.direction === "asc";
        const direction = isAscending ? "desc" : "asc";
        const sortedData = [...filteredInventory].sort((a, b) => {
            if (a[column] < b[column]) return direction === "asc" ? -1 : 1;
            if (a[column] > b[column]) return direction === "asc" ? 1 : -1;
            return 0;
        });
        setFilteredInventory(sortedData);
        setSortOrder({ column, direction });
    };

    // Handle delete item
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            API.delete(`/api/inventory/${id}/`)  // Make sure this matches the API endpoint for deletion
                .then(() => {
                    // After successful deletion, remove the item from the state
                    setInventory((prevInventory) => prevInventory.filter(item => item.id !== id));
                    setFilteredInventory((prevInventory) => prevInventory.filter(item => item.id !== id));
                })
                .catch((error) => {
                    console.error("Error deleting inventory item:", error);
                });
        }
    };

    // Handle submit (for adding or updating inventory item)
    const handleSubmit = async () => {
        const { office, item_id, quantity, remarks, id } = formData;
        try {
            if (isEditing) {
                // Update the inventory item if in editing mode
                await API.put(`/api/inventory/${id}/`, { office, item_id, quantity, remarks });
            } else {
                // Add a new inventory item if not editing
                await API.post("/api/inventory/", { office, item_id, quantity, remarks });
            }

            // Refresh the inventory data
            fetchData();

            // Close the modal
            handleCloseModal();
        } catch (error) {
            console.error("Error submitting inventory item:", error);
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
                    fontWeight: 'bold',            // Bold font weight
                }}
            >
                Inventory Dashboard
            </Typography>

            {/* Top Section: Add Inventory Item and Tools */}
            <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ marginBottom: 4 }}>
                <InventoryTools />
            </Grid>

            {/* Filters */}
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                {/* Top Section: Filters and Add Button */}

                <Grid item xs={12} sm={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<Add />}
                        sx={{
                            textTransform: "uppercase",
                            fontWeight: "bold",
                            borderRadius: "8px",
                        }}
                        onClick={() => handleOpenModal()}
                    >
                        Add Item
                    </Button>
                </Grid>

                <Grid item xs={6} sm={3}>
                    {/* <FormControl fullWidth>
                        <InputLabel>Filter by Office</InputLabel>
                        <Select
                            name="office"
                            value={filterCriteria.office}
                            onChange={handleFilterChange}
                        >
                            <MenuItem value="">All Offices</MenuItem>
                            {offices.map((office) => (
                                <MenuItem key={office.id} value={office.name}>
                                    {office.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl> */}
                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                        <InputLabel
                            sx={{
                                paddingBottom: 1, // Adjust padding
                                paddingLeft: '20px',
                                fontSize: '16px', // Font size for label
                                top: '60%', // Position label vertically
                                transform: 'translateY(-50%)', // Adjust the label vertically to be in the center
                            }}
                        >
                            Filter by Office
                        </InputLabel>

                        <Select
                            name="office"
                            value={filterCriteria.office}
                            onChange={handleFilterChange}
                            sx={{
                                height: '40px',         // Height of the select dropdown
                                padding: '8px',         // Padding inside the select box
                                fontSize: '14px',       // Font size for the select
                                borderRadius: '4px',    // Border radius for the select
                                display: 'flex',        // Ensure the select is a flex container
                                alignItems: 'center',   // Vertically align the text in the center
                            }}
                        >
                            <MenuItem value="">All Offices</MenuItem>
                            {offices.map((office) => (
                                <MenuItem key={office.id} value={office.name}>
                                    {office.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                </Grid>
                <Grid item xs={6} sm={3}>
                    <FormControl fullWidth>
                        <InputLabel
                            sx={{
                                paddingBottom: 1, // Adjust padding
                                paddingLeft: '20px',
                                fontSize: '16px', // Font size for label
                                top: '60%', // Position label vertically
                                transform: 'translateY(-50%)', // Adjust the label vertically to be in the center
                            }}>Filter by Item</InputLabel>
                        <Select
                            name="item"
                            value={filterCriteria.item}
                            onChange={handleFilterChange}
                            sx={{
                                height: '40px',         // Height of the select dropdown
                                padding: '8px',         // Padding inside the select box
                                fontSize: '14px',       // Font size for the select
                                borderRadius: '4px',    // Border radius for the select
                                display: 'flex',        // Ensure the select is a flex container
                                alignItems: 'center',   // Vertically align the text in the center
                            }}
                        >
                            <MenuItem value="">All Items</MenuItem>
                            {items.map((item) => (
                                <MenuItem key={item.id} value={item.name}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Inventory Table */}
            <TableContainer sx={{ border: "1px solid #ccc" }}>
                <Table sx={{
                    "& .MuiTableCell-root": {
                        border: "1px solid #ccc", // Show borders for all cells
                        padding: " 0 8px", // Adjust padding for smaller row height
                    },
                    "& .MuiTableRow-root": {
                        height: "40px", // Reduce the row height
                    },
                }}>
                    <TableHead>
                        <TableRow sx={{
                            backgroundColor: "#f5f5f5", // Add a subtle background color for header
                        }}>
                            <TableCell onClick={() => handleSort("office_name")} sx={{ cursor: "pointer", fontWeight: "bold", }}>
                                Office <Sort fontSize="small" />
                            </TableCell>
                            <TableCell onClick={() => handleSort("item_name")} sx={{ cursor: "pointer", fontWeight: "bold", }}>
                                Item <Sort fontSize="small" />
                            </TableCell>
                            <TableCell
                                onClick={() => handleSort("quantity")}
                                sx={{ cursor: "pointer", textAlign: "center", fontWeight: "bold", }}
                            >
                                Quantity <Sort fontSize="small" />
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold", }}>Remarks</TableCell>
                            <TableCell sx={{ fontWeight: "bold", }} l>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredInventory.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.office_name || "N/A"}</TableCell>
                                <TableCell>{item.item_name || "N/A"}</TableCell>
                                <TableCell align="center">{item.quantity}</TableCell>
                                <TableCell>{item.remarks}</TableCell>
                                <TableCell>
                                    <Tooltip title="Edit">
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleOpenModal(item)}
                                        >
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton color="secondary" onClick={() => handleDelete(item.id)}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
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
