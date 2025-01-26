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
    CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete, Sort, ArrowBack, ArrowForward } from "@mui/icons-material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { DialogContentText } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../services/api";
import InventoryTools from "./InventoryTools";

const InventoryDashboard = ({ role }) => {
    const [inventory, setInventory] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [offices, setOffices] = useState([]);
    const [items, setItems] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        office_id: "",
        office_name: "",
        item_id: "",
        quantity: 1,
        remarks: "Perfect",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [filterCriteria, setFilterCriteria] = useState({ office: "", item: "" });
    const [sortOrder, setSortOrder] = useState({ column: "", direction: "asc" });
    const navigate = useNavigate();
    const [pagination, setPagination] = useState({
        next: null,
        previous: null,
        count: 0,
        currentPage: 1,
    });

    const logoutUser = useCallback(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
    }, [navigate]);

    const fetchData = useCallback(async (page = 1) => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            logoutUser();
            return;
        }

        try {
            // Fetch user profile to get assigned offices
            const staffProfileResponse = await API.get("/api/users/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const assignedOffices = staffProfileResponse.data.assigned_offices || [];

            // If the user is a staff member, filter inventory and items by assigned offices
            // const officeFilter = assignedOffices.length > 0 ? `&office_id=${assignedOffices.join(",")}` : "";
            const officeFilter = role === "staff" && assignedOffices.length
                ? `&office_id=${assignedOffices.join(",")}`
                : "";

            // Fetch inventory, offices, and items
            const [inventoryResponse, officesResponse, itemsResponse] = await Promise.all([
                API.get(`/api/inventory/?page=${page}${officeFilter}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                API.get("/api/offices/", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                API.get("/api/item-register/", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            console.log("Fetched Inventory:", inventoryResponse.data);

            // Filter offices based on assigned offices if user is staff
            const filteredOffices = assignedOffices.length
                ? officesResponse.data.filter((office) => assignedOffices.includes(office.id))
                : officesResponse.data;

            setInventory(inventoryResponse.data.results || []);
            setFilteredInventory(inventoryResponse.data.results || []);
            setOffices(filteredOffices); // Set filtered offices
            setItems(itemsResponse.data.item_register || []); // Set items for all users

            setPagination({
                next: inventoryResponse.data.next,
                previous: inventoryResponse.data.previous,
                count: inventoryResponse.data.count,
                currentPage: page,
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Error fetching data. Please try again.");
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

    const handleOpenModal = async (inventoryItem = null) => {
        if (items.length === 0) {
            setIsModalLoading(true);
            try {
                const response = await API.get("/api/item-register/");
                const fetchedItems = Array.isArray(response.data.item_register)
                    ? response.data.item_register
                    : [];
                setItems(fetchedItems);
            } catch (error) {
                console.error("Error fetching items in modal:", error);
                toast.error("Failed to fetch items. Please try again.");
            } finally {
                setIsModalLoading(false);
            }
        }

        if (inventoryItem) {
            setIsEditing(true);
            setFormData({
                id: inventoryItem.id,
                office_id: inventoryItem.office_id || "",
                office_name: inventoryItem.office_name || "N/A",
                item_id: inventoryItem.item_id || "",
                quantity: inventoryItem.quantity || 1,
                remarks: inventoryItem.remarks || "Perfect",
            });
        } else {
            setIsEditing(false);
            setFormData({
                id: null,
                office_id: "",
                office_name: "",
                item_id: "",
                quantity: 1,
                remarks: "Perfect",
            });
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => setOpenModal(false);

    const confirmDelete = (id) => {
        setDeleteId(id);
        setOpenConfirmDialog(true);
    };

    const handleDelete = async () => {
        if (!deleteId) {
            toast.error("Unable to delete item. Please try again.");
            return;
        }

        try {
            const response = await API.delete(`/api/inventory/${deleteId}/`);
            toast.success(response.data.message || "Inventory item deleted successfully.");
            setInventory((prev) => prev.filter((item) => item.id !== deleteId));
            setFilteredInventory((prev) => prev.filter((item) => item.id !== deleteId));
        } catch (error) {
            console.error("Error deleting inventory item:", error.response?.data || error.message);
            toast.error(error.response?.data?.error || "An error occurred while deleting the item.");
        } finally {
            setOpenConfirmDialog(false);
            setDeleteId(null);
        }
    };

    const handleCancelDelete = () => {
        setOpenConfirmDialog(false);
        setDeleteId(null);
    };

    // const handleSubmit = async () => {
    //     const { office_id, item_id, quantity, remarks, id } = formData;
    //     try {
    //         if (isEditing) {
    //             await API.put(`/api/inventory/${id}/`, { office_id, item_id, quantity, remarks });
    //             toast.success("Inventory item updated successfully.");
    //         } else {
    //             await API.post("/api/inventory/", { office_id, item_id, quantity, remarks });
    //             toast.success("Inventory item created successfully.");
    //         }
    //         fetchData(); // Re-fetch the filtered data
    //         handleCloseModal();
    //     } catch (error) {
    //         console.error("Error submitting inventory item:", error.response?.data || error.message);
    //         toast.error(error.response?.data?.message || "An error occurred while submitting the item.");
    //     }
    // };

    const handleSubmit = async () => {
        const { office_id, item_id, quantity, remarks, id } = formData;

        // Make sure item_id is the string identifier from the item register
        const selectedItem = items.find(item => item.id === item_id);
        const payload = {
            office_id,
            item_id: selectedItem ? selectedItem.item_id : item_id,  // Ensure item_id is the string (like "OLASS-97F14205")
            quantity,
            remarks,
        };

        console.log("Submitting Data:", payload); // Debug log to check the payload

        try {
            if (isEditing) {
                await API.put(`/api/inventory/${id}/`, payload);
                toast.success("Inventory item updated successfully.");
            } else {
                await API.post("/api/inventory/", payload);
                toast.success("Inventory item created successfully.");
            }
            fetchData(); // Re-fetch the filtered data
            handleCloseModal();
        } catch (error) {
            console.error("Error submitting inventory item:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "An error occurred while submitting the item.");
        }
    };

    useEffect(() => {
        let data = [...inventory];
        if (filterCriteria.office) {
            data = data.filter((item) => item.office === filterCriteria.office); // Change `item.office_id` to `item.office`
        }
        if (filterCriteria.item) {
            data = data.filter((item) => item.item_id === filterCriteria.item);
        }
        setFilteredInventory(data);
    }, [filterCriteria, inventory]);



    return (
        <Box>
            <ToastContainer />
            <Typography
                variant="h4"
                gutterBottom
                style={{
                    textAlign: "center",
                    textTransform: "uppercase",
                    letterSpacing: "3px",
                    fontSize: "2.5rem",
                    fontFamily: '"Roboto", sans-serif',
                    fontWeight: "bold",
                    color: "#213d77",
                }}
            >
                Inventory Dashboard
            </Typography>

            <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 4 }}>
                <InventoryTools role={role} fetchData={fetchData} />
            </Grid>

            <Grid container
                alignItems="center"
                justifyContent="space-between" // Spread items: Add button on the left, filters on the right
                spacing={2}
                sx={{ marginBottom: 2 }}>
                {/* Add Button */}
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        size="small" // Reduce button size
                        sx={{
                            height: "40px", // Uniform height for buttons
                            textTransform: "uppercase",
                            fontWeight: "bold",
                            paddingX: 2,
                        }}
                        onClick={() => handleOpenModal()}
                    >
                        Add Item
                    </Button>
                </Grid>

                {/* Filters */}
                <Grid item sx={{ display: "flex", gap: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Filter by Office</InputLabel>
                        <Select
                            name="office"
                            value={filterCriteria.office}
                            onChange={(e) => {
                                console.log("Selected Office ID:", e.target.value);
                                setFilterCriteria({ ...filterCriteria, office: e.target.value })
                            }
                            }
                        >
                            <MenuItem value="">All Offices</MenuItem>
                            {offices.map((office) => (
                                <MenuItem key={office.id} value={office.id}>
                                    {office.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Filter by Item</InputLabel>
                        <Select
                            name="item"
                            value={filterCriteria.item}
                            onChange={(e) =>
                                setFilterCriteria({ ...filterCriteria, item: e.target.value })
                            }
                        >
                            <MenuItem value="">All Items</MenuItem>
                            {items.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <TableContainer sx={{ border: '1px solid #ccc' }}>
                <Table sx={{
                    borderCollapse: 'collapse',
                    width: '100%',
                }}>
                    <TableHead>
                        <TableRow sx={{
                            backgroundColor: '#e0e0e0',
                        }}>
                            <TableCell onClick={() => handleSort("office_name")} sx={{ cursor: 'pointer', padding: '8px 12px', width: '20%', textAlign: 'left', border: '1px solid #ddd', fontWeight: 'bold', }}>
                                Office <Sort fontSize="small" />
                            </TableCell>
                            <TableCell onClick={() => handleSort("item_name")} sx={{ cursor: 'pointer', padding: '8px 12px', width: '20%', textAlign: 'left', border: '1px solid #ddd', fontWeight: 'bold', }}>
                                Item <Sort fontSize="small" />
                            </TableCell>
                            <TableCell onClick={() => handleSort("quantity")} align="center" sx={{ cursor: 'pointer', padding: '8px 12px', width: '20%', border: '1px solid #ddd', fontWeight: 'bold', }}>
                                Quantity <Sort fontSize="small" />
                            </TableCell>
                            <TableCell sx={{
                                padding: '8px 12px', width: '20%', fontWeight: 'bold',
                                border: '1px solid #ddd',  // Add border to each header cell
                            }}>Remarks</TableCell>
                            <TableCell align="center"
                                sx={{ padding: '8px 12px', width: '20%', border: '1px solid #ddd', fontWeight: 'bold', }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredInventory.map((row) => (
                            <TableRow key={row.id} sx={{
                                borderBottom: '1px solid #ddd',  // Add a light border between rows
                                '&:hover': {
                                    backgroundColor: '#f5f5f5',  // Highlight row on hover
                                },
                            }}>
                                <TableCell sx={{ padding: '0 12px', width: '10%', border: '1px solid #ddd', }}>{row.office_name}</TableCell>
                                <TableCell sx={{ padding: '0 12px', width: '10%', border: '1px solid #ddd', }}>{row.item_name}</TableCell>
                                <TableCell align="center" sx={{ padding: '0 12px', width: '10%', border: '1px solid #ddd', }}>{row.quantity}</TableCell>
                                <TableCell sx={{ padding: '0 12px', width: '10%', border: '1px solid #ddd', }}>{row.remarks}</TableCell>
                                <TableCell align="center" sx={{ padding: '0 12px', width: '10%', border: '1px solid #ddd', }}>
                                    <Tooltip title="Edit">
                                        <IconButton onClick={() => handleOpenModal(row)}>
                                            <Edit color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton onClick={() => confirmDelete(row.id)}>
                                            <Delete color="error" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit/Add Modal */}
            <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
                <DialogTitle>{isEditing ? "Edit Inventory" : "Add Inventory"}</DialogTitle>
                <DialogContent>
                    {isModalLoading ? (
                        <Box textAlign="center" my={2}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {isEditing && (
                                <TextField
                                    label="Office"
                                    value={formData.office_name}
                                    fullWidth
                                    margin="dense"
                                    disabled
                                />
                            )}
                            {!isEditing && (
                                <FormControl fullWidth margin="dense">
                                    <InputLabel>Office</InputLabel>
                                    <Select
                                        name="office_id"
                                        value={formData.office_id}
                                        onChange={(e) =>
                                            setFormData({ ...formData, office_id: e.target.value })
                                        }
                                    >
                                        {offices.map((office) => (
                                            <MenuItem key={office.id} value={office.id}>
                                                {office.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Item</InputLabel>
                                <Select
                                    name="item_id"
                                    value={formData.item_id}
                                    onChange={(e) =>
                                        setFormData({ ...formData, item_id: e.target.value }) // Ensure you're using the correct item_id (string)
                                    }
                                >
                                    {items.map((item) => (
                                        <MenuItem key={item.id} value={item.item_id}> {/* Use item.item_id as the value */}
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                name="quantity"
                                label="Quantity"
                                type="number"
                                fullWidth
                                margin="dense"
                                value={formData.quantity}
                                onChange={(e) =>
                                    setFormData({ ...formData, quantity: e.target.value })
                                }
                                InputProps={{ inputProps: { min: 1 } }}
                            />
                            <TextField
                                name="remarks"
                                label="Remarks"
                                fullWidth
                                margin="dense"
                                value={formData.remarks}
                                onChange={(e) =>
                                    setFormData({ ...formData, remarks: e.target.value })
                                }
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        {isEditing ? "Update" : "Submit"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog 
                open={openConfirmDialog} 
                onClose={handleCancelDelete} 
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
                }}>
                <DialogTitle id="delete-dialog-title" sx={{ fontWeight: "bold", color: "red" }}>
                    <Box display="flex" alignItems="center" justifyContent="center">
                        <WarningAmberIcon fontSize="large" sx={{ color: "orange", marginRight: 1 }} />
                        Confirm Deletion
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description" sx={{ fontSize: "1rem" }}>
                        Are you sure you want to delete this item? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button onClick={handleCancelDelete} variant="outlined" color="primary" sx={{ cursor: "pointer" }}>
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} variant="contained" color="error" sx={{ cursor: "pointer" }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Pagination Controls */}
            <Box display="flex" justifyContent="space-between" mt={2}>
                <Button
                    onClick={() => fetchData(pagination.currentPage - 1)}
                    disabled={!pagination.previous}
                    variant="contained"
                    color="primary"
                >
                    <ArrowBack /> Previous
                </Button>
                <Typography>
                    Page {pagination.currentPage} of {Math.ceil(pagination.count / 10)}
                </Typography>
                <Button
                    onClick={() => fetchData(pagination.currentPage + 1)}
                    disabled={!pagination.next}
                    variant="contained"
                    color="primary"
                >
                    Next <ArrowForward />
                </Button>
            </Box>
        </Box>
    );
};

export default InventoryDashboard;
