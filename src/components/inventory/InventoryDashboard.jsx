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
import { Add, Edit, Delete, Sort } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import InventoryTools from "./InventoryTools";

const InventoryDashboard = () => {
    const [inventory, setInventory] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [offices, setOffices] = useState([]);
    const [items, setItems] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        office_id: "",
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

            const items = Array.isArray(itemsResponse.data.item_register)
                ? itemsResponse.data.item_register
                : [];
            setItems(items);
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
            } finally {
                setIsModalLoading(false);
            }
        }

        if (inventoryItem) {
            setIsEditing(true);
            setFormData({
                id: inventoryItem.id,
                office_id: inventoryItem.office_id || "",
                item_id: inventoryItem.item_id || "",
                quantity: inventoryItem.quantity || 1,
                remarks: inventoryItem.remarks || "Perfect",
            });
        } else {
            setIsEditing(false);
            setFormData({
                id: null,
                office_id: "",
                item_id: "",
                quantity: 1,
                remarks: "Perfect",
            });
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => setOpenModal(false);

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
            data = data.filter((item) => item.office_id === filterCriteria.office);
        }
        if (filterCriteria.item) {
            data = data.filter((item) => item.item_id === filterCriteria.item);
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
    const handleDelete = async (id) => {
        try {
            const response = await API.delete(`/api/inventory/${id}/`);
            alert("Inventory item deleted successfully.");
            setInventory((prevInventory) =>
                prevInventory.filter((item) => item.id !== id)
            );
        } catch (error) {
            console.error("Error deleting inventory item:", error.response?.data || error.message);
            alert(error.response?.data?.error || "An error occurred while deleting the item.");
        }
    };

    // Handle submit (add or update inventory item)
    const handleSubmit = async () => {
        const { office_id, item_id, quantity, remarks, id } = formData;
        try {
            if (isEditing) {
                await API.put(`/api/inventory/${id}/`, { office_id, item_id, quantity, remarks });
                alert("Inventory item updated successfully.");
            } else {
                await API.post("/api/inventory/", { office_id, item_id, quantity, remarks });
                alert("Inventory item created successfully.");
            }
            fetchData();
            handleCloseModal();
        } catch (error) {
            console.error("Error submitting inventory item:", error.response?.data || error.message);
            alert(error.response?.data?.message || "An error occurred while submitting the item.");
        }
    };

    return (
        <Box>
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
                }}
            >
                Inventory Dashboard
            </Typography>

            <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 4 }}>
                <InventoryTools />
            </Grid>

            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                <Grid item xs={12} sm={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<Add />}
                        onClick={() => handleOpenModal()}
                    >
                        Add Item
                    </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <FormControl fullWidth>
                        <InputLabel>Filter by Office</InputLabel>
                        <Select
                            name="office"
                            value={filterCriteria.office}
                            onChange={handleFilterChange}
                        >
                            <MenuItem value="">All Offices</MenuItem>
                            {offices.map((office) => (
                                <MenuItem key={office.id} value={office.id}>
                                    {office.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <FormControl fullWidth>
                        <InputLabel>Filter by Item</InputLabel>
                        <Select
                            name="item"
                            value={filterCriteria.item}
                            onChange={handleFilterChange}
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

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell onClick={() => handleSort("office_name")}>
                                Office <Sort fontSize="small" />
                            </TableCell>
                            <TableCell onClick={() => handleSort("item_name")}>
                                Item <Sort fontSize="small" />
                            </TableCell>
                            <TableCell onClick={() => handleSort("quantity")} align="center">
                                Quantity <Sort fontSize="small" />
                            </TableCell>
                            <TableCell>Remarks</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredInventory.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.office_name}</TableCell>
                                <TableCell>{item.item_name}</TableCell>
                                <TableCell align="center">{item.quantity}</TableCell>
                                <TableCell>{item.remarks}</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Edit">
                                        <IconButton onClick={() => handleOpenModal(item)}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton onClick={() => handleDelete(item.id)}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>
                    {isEditing ? "Edit Inventory Item" : "Add Inventory Item"}
                </DialogTitle>
                <DialogContent>
                    {isModalLoading ? (
                        <CircularProgress />
                    ) : (
                        <>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Office</InputLabel>
                                <Select
                                    name="office_id"
                                    value={formData.office_id}
                                    onChange={handleChange}
                                >
                                    {offices.map((office) => (
                                        <MenuItem key={office.id} value={office.id}>
                                            {office.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth sx={{ mb: 2 }}>
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
                                label="Quantity"
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Remarks"
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        {isEditing ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default InventoryDashboard;
















// import React, { useState, useEffect, useCallback } from "react";
// import {
//     Box,
//     IconButton,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     TextField,
//     Typography,
//     FormControl,
//     InputLabel,
//     Select,
//     MenuItem,
//     Button,
//     Grid,
//     Tooltip,
//     CircularProgress,
// } from "@mui/material";
// import { Add, Edit, Delete, Sort } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css"; // Toastify styles
// import API from "../../services/api";
// import InventoryTools from "./InventoryTools";

// const InventoryDashboard = () => {
//     const [inventory, setInventory] = useState([]);
//     const [filteredInventory, setFilteredInventory] = useState([]);
//     const [offices, setOffices] = useState([]);
//     const [items, setItems] = useState([]);
//     const [openModal, setOpenModal] = useState(false);
//     const [isModalLoading, setIsModalLoading] = useState(false);
//     const [formData, setFormData] = useState({
//         id: null,
//         office_id: "",
//         item_id: "",
//         quantity: 1,
//         remarks: "Perfect",
//     });
//     const [isEditing, setIsEditing] = useState(false);
//     const [filterCriteria, setFilterCriteria] = useState({ office: "", item: "" });
//     const [sortOrder, setSortOrder] = useState({ column: "", direction: "asc" });
//     const navigate = useNavigate();

//     // Logout function
//     const logoutUser = useCallback(() => {
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken");
//         navigate("/login");
//     }, [navigate]);

//     // Fetch data for inventory, offices, and items
//     const fetchData = useCallback(async () => {
//         try {
//             const [inventoryResponse, officesResponse, itemsResponse] = await Promise.all([
//                 API.get("/api/inventory/"),
//                 API.get("/api/offices/"),
//                 API.get("/api/item-register/"),
//             ]);

//             setInventory(inventoryResponse.data);
//             setFilteredInventory(inventoryResponse.data);
//             setOffices(officesResponse.data);

//             const items = Array.isArray(itemsResponse.data.item_register)
//                 ? itemsResponse.data.item_register
//                 : [];
//             setItems(items);
//         } catch (error) {
//             console.error("Error fetching data:", error);
//             toast.error("Error fetching data. Please try again later.");
//             if (error.response?.status === 401) {
//                 logoutUser();
//             }
//         }
//     }, [logoutUser]);

//     useEffect(() => {
//         const token = localStorage.getItem("accessToken");
//         if (!token) {
//             logoutUser();
//         } else {
//             fetchData();
//         }
//     }, [fetchData, logoutUser]);

//     // Handle sorting
//     const handleSort = (column) => {
//         const isAscending = sortOrder.column === column && sortOrder.direction === "asc";
//         const direction = isAscending ? "desc" : "asc";
//         const sortedData = [...filteredInventory].sort((a, b) => {
//             if (a[column] < b[column]) return direction === "asc" ? -1 : 1;
//             if (a[column] > b[column]) return direction === "asc" ? 1 : -1;
//             return 0;
//         });
//         setFilteredInventory(sortedData);
//         setSortOrder({ column, direction });
//     };

//     // Open modal for adding or editing inventory
//     const handleOpenModal = async (inventoryItem = null) => {
//         if (items.length === 0) {
//             setIsModalLoading(true);
//             try {
//                 const response = await API.get("/api/item-register/");
//                 const fetchedItems = Array.isArray(response.data.item_register)
//                     ? response.data.item_register
//                     : [];
//                 setItems(fetchedItems);
//             } catch (error) {
//                 console.error("Error fetching items in modal:", error);
//                 toast.error("Failed to fetch items. Please try again.");
//             } finally {
//                 setIsModalLoading(false);
//             }
//         }

//         if (inventoryItem) {
//             setIsEditing(true);
//             setFormData({
//                 id: inventoryItem.id,
//                 office_id: inventoryItem.office_id || "",
//                 item_id: inventoryItem.item_id || "",
//                 quantity: inventoryItem.quantity || 1,
//                 remarks: inventoryItem.remarks || "Perfect",
//             });
//         } else {
//             setIsEditing(false);
//             setFormData({
//                 id: null,
//                 office_id: "",
//                 item_id: "",
//                 quantity: 1,
//                 remarks: "Perfect",
//             });
//         }
//         setOpenModal(true);
//     };

//     const handleCloseModal = () => setOpenModal(false);

//     // Handle form changes
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({ ...prevData, [name]: value }));
//     };

//     // Handle delete item
//     const handleDelete = async (id) => {
//         if (!id) {
//             console.error("Invalid ID: The ID is null or undefined.");
//             toast.error("Unable to delete item. Please try again.");
//             return;
//         }

//         if (window.confirm("Are you sure you want to delete this item?")) {
//             try {
//                 const response = await API.delete(`/api/inventory/${id}/`);
//                 toast.success(response.data.message || "Inventory item deleted successfully.");

//                 setInventory((prevInventory) =>
//                     prevInventory.filter((item) => item.id !== id)
//                 );
//                 setFilteredInventory((prevInventory) =>
//                     prevInventory.filter((item) => item.id !== id)
//                 );
//             } catch (error) {
//                 console.error("Error deleting inventory item:", error.response?.data || error.message);
//                 toast.error(error.response?.data?.error || "An error occurred while deleting the item.");
//             }
//         }
//     };

//     // Handle submit (add or update inventory item)
//     const handleSubmit = async () => {
//         const { office_id, item_id, quantity, remarks, id } = formData;
//         try {
//             if (isEditing) {
//                 await API.put(`/api/inventory/${id}/`, { office_id, item_id, quantity, remarks });
//                 toast.success("Inventory item updated successfully.");
//             } else {
//                 await API.post("/api/inventory/", { office_id, item_id, quantity, remarks });
//                 toast.success("Inventory item created successfully.");
//             }
//             fetchData();
//             handleCloseModal();
//         } catch (error) {
//             console.error("Error submitting inventory item:", error.response?.data || error.message);
//             toast.error(error.response?.data?.message || "An error occurred while submitting the item.");
//         }
//     };

//     return (
//         <Box>
//             <ToastContainer />
//             <Typography
//                 variant="h4"
//                 gutterBottom
//                 style={{
//                     textAlign: "center",
//                     textTransform: "uppercase",
//                     letterSpacing: "3px",
//                     fontSize: "2.5rem",
//                     fontFamily: '"Roboto", sans-serif',
//                     fontWeight: "bold",
//                 }}
//             >
//                 Inventory Dashboard
//             </Typography>

//             <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 4 }}>
//                 <InventoryTools />
//             </Grid>

//             <Grid container spacing={2} sx={{ marginBottom: 2 }}>
//                 <Grid item xs={12} sm={4}>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         fullWidth
//                         startIcon={<Add />}
//                         onClick={() => handleOpenModal()}
//                     >
//                         Add Item
//                     </Button>
//                 </Grid>
//                 <Grid item xs={6} sm={3}>
//                     <FormControl fullWidth>
//                         <InputLabel>Filter by Office</InputLabel>
//                         <Select
//                             name="office"
//                             value={filterCriteria.office}
//                             onChange={(e) => setFilterCriteria({ ...filterCriteria, office: e.target.value })}
//                         >
//                             <MenuItem value="">All Offices</MenuItem>
//                             {offices.map((office) => (
//                                 <MenuItem key={office.id} value={office.id}>
//                                     {office.name}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Grid>
//                 <Grid item xs={6} sm={3}>
//                     <FormControl fullWidth>
//                         <InputLabel>Filter by Item</InputLabel>
//                         <Select
//                             name="item"
//                             value={filterCriteria.item}
//                             onChange={(e) => setFilterCriteria({ ...filterCriteria, item: e.target.value })}
//                         >
//                             <MenuItem value="">All Items</MenuItem>
//                             {items.map((item) => (
//                                 <MenuItem key={item.id} value={item.id}>
//                                     {item.name}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Grid>
//             </Grid>

//             <TableContainer>
//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             <TableCell onClick={() => handleSort("office_name")}>
//                                 Office <Sort fontSize="small" />
//                             </TableCell>
//                             <TableCell onClick={() => handleSort("item_name")}>
//                                 Item <Sort fontSize="small" />
//                             </TableCell>
//                             <TableCell onClick={() => handleSort("quantity")} align="center">
//                                 Quantity <Sort fontSize="small" />
//                             </TableCell>
//                             <TableCell>Remarks</TableCell>
//                             <TableCell align="center">Actions</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {filteredInventory.map((row) => (
//                             <TableRow key={row.id}>
//                                 <TableCell>{row.office_name}</TableCell>
//                                 <TableCell>{row.item_name}</TableCell>
//                                 <TableCell align="center">{row.quantity}</TableCell>
//                                 <TableCell>{row.remarks}</TableCell>
//                                 <TableCell align="center">
//                                     <Tooltip title="Edit">
//                                         <IconButton onClick={() => handleOpenModal(row)}>
//                                             <Edit color="primary" />
//                                         </IconButton>
//                                     </Tooltip>
//                                     <Tooltip title="Delete">
//                                         <IconButton onClick={() => handleDelete(row.id)}>
//                                             <Delete color="error" />
//                                         </IconButton>
//                                     </Tooltip>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>

//             <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
//                 <DialogTitle>{isEditing ? "Edit Inventory" : "Add Inventory"}</DialogTitle>
//                 <DialogContent>
//                     {isModalLoading ? (
//                         <Box textAlign="center" my={2}>
//                             <CircularProgress />
//                         </Box>
//                     ) : (
//                         <>
//                             <FormControl fullWidth margin="dense">
//                                 <InputLabel>Office</InputLabel>
//                                 <Select
//                                     name="office_id"
//                                     value={formData.office_id}
//                                     onChange={handleChange}
//                                 >
//                                     {offices.map((office) => (
//                                         <MenuItem key={office.id} value={office.id}>
//                                             {office.name}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                             <FormControl fullWidth margin="dense">
//                                 <InputLabel>Item</InputLabel>
//                                 <Select
//                                     name="item_id"
//                                     value={formData.item_id}
//                                     onChange={handleChange}
//                                 >
//                                     {items.map((item) => (
//                                         <MenuItem key={item.id} value={item.id}>
//                                             {item.name}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                             <TextField
//                                 name="quantity"
//                                 label="Quantity"
//                                 type="number"
//                                 fullWidth
//                                 margin="dense"
//                                 value={formData.quantity}
//                                 onChange={handleChange}
//                                 InputProps={{ inputProps: { min: 1 } }}
//                             />
//                             <TextField
//                                 name="remarks"
//                                 label="Remarks"
//                                 fullWidth
//                                 margin="dense"
//                                 value={formData.remarks}
//                                 onChange={handleChange}
//                             />
//                         </>
//                     )}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleCloseModal} color="secondary">
//                         Cancel
//                     </Button>
//                     <Button onClick={handleSubmit} color="primary">
//                         {isEditing ? "Update" : "Submit"}
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// export default InventoryDashboard;











// import React, { useState, useEffect, useCallback } from "react";
// import {
//     Box,
//     IconButton,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     TextField,
//     Typography,
//     FormControl,
//     InputLabel,
//     Select,
//     MenuItem,
//     Button,
//     Grid,
//     Tooltip,
//     CircularProgress,
// } from "@mui/material";
// import { Add, Edit, Delete, Sort } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import API from "../../services/api";
// import InventoryTools from "./InventoryTools";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css"; // Toastify styles

// const InventoryDashboard = () => {
//     const [inventory, setInventory] = useState([]);
//     const [filteredInventory, setFilteredInventory] = useState([]);
//     const [offices, setOffices] = useState([]);
//     const [items, setItems] = useState([]);
//     const [openModal, setOpenModal] = useState(false);
//     const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // For delete confirmation dialog
//     const [isModalLoading, setIsModalLoading] = useState(false);
//     const [formData, setFormData] = useState({
//         id: null,
//         office_id: "",
//         item_id: "",
//         quantity: 1,
//         remarks: "Perfect",
//     });
//     const [isEditing, setIsEditing] = useState(false);
//     const [deleteId, setDeleteId] = useState(null); // ID of the item to delete
//     const [filterCriteria, setFilterCriteria] = useState({ office: "", item: "" });
//     const [sortOrder, setSortOrder] = useState({ column: "", direction: "asc" });
//     const navigate = useNavigate();

//     // Logout function
//     const logoutUser = useCallback(() => {
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken");
//         navigate("/login");
//     }, [navigate]);

//     // Fetch data for inventory, offices, and items
//     const fetchData = useCallback(async () => {
//         try {
//             const [inventoryResponse, officesResponse, itemsResponse] = await Promise.all([
//                 API.get("/api/inventory/"),
//                 API.get("/api/offices/"),
//                 API.get("/api/item-register/"),
//             ]);

//             setInventory(inventoryResponse.data);
//             setFilteredInventory(inventoryResponse.data);
//             setOffices(officesResponse.data);

//             const items = Array.isArray(itemsResponse.data.item_register)
//                 ? itemsResponse.data.item_register
//                 : [];
//             setItems(items);
//         } catch (error) {
//             console.error("Error fetching data:", error);
//             if (error.response?.status === 401) {
//                 logoutUser();
//             }
//         }
//     }, [logoutUser]);

//     useEffect(() => {
//         const token = localStorage.getItem("accessToken");
//         if (!token) {
//             logoutUser();
//         } else {
//             fetchData();
//         }
//     }, [fetchData, logoutUser]);

//     // Open modal for adding or editing inventory
//     const handleOpenModal = async (inventoryItem = null) => {
//         if (items.length === 0) {
//             setIsModalLoading(true);
//             try {
//                 const response = await API.get("/api/item-register/");
//                 const fetchedItems = Array.isArray(response.data.item_register)
//                     ? response.data.item_register
//                     : [];
//                 setItems(fetchedItems);
//             } catch (error) {
//                 console.error("Error fetching items in modal:", error);
//             } finally {
//                 setIsModalLoading(false);
//             }
//         }

//         if (inventoryItem) {
//             setIsEditing(true);
//             setFormData({
//                 id: inventoryItem.id,
//                 office_id: inventoryItem.office_id || "",
//                 item_id: inventoryItem.item_id || "",
//                 quantity: inventoryItem.quantity || 1,
//                 remarks: inventoryItem.remarks || "Perfect",
//             });
//         } else {
//             setIsEditing(false);
//             setFormData({
//                 id: null,
//                 office_id: "",
//                 item_id: "",
//                 quantity: 1,
//                 remarks: "Perfect",
//             });
//         }
//         setOpenModal(true);
//     };

//     const handleCloseModal = () => setOpenModal(false);

//     // Handle form changes
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({ ...prevData, [name]: value }));
//     };

//     // Handle filter change
//     const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         setFilterCriteria((prev) => ({ ...prev, [name]: value }));
//     };

//     // Apply filters
//     useEffect(() => {
//         let data = [...inventory];
//         if (filterCriteria.office) {
//             data = data.filter((item) => item.office_id === filterCriteria.office);
//         }
//         if (filterCriteria.item) {
//             data = data.filter((item) => item.item_id === filterCriteria.item);
//         }
//         setFilteredInventory(data);
//     }, [filterCriteria, inventory]);

//     // Handle sorting
//     const handleSort = (column) => {
//         const isAscending = sortOrder.column === column && sortOrder.direction === "asc";
//         const direction = isAscending ? "desc" : "asc";
//         const sortedData = [...filteredInventory].sort((a, b) => {
//             if (a[column] < b[column]) return direction === "asc" ? -1 : 1;
//             if (a[column] > b[column]) return direction === "asc" ? 1 : -1;
//             return 0;
//         });
//         setFilteredInventory(sortedData);
//         setSortOrder({ column, direction });
//     };

// const handleDelete = async (id) => {
//     if (!id) {
//         console.error("Invalid ID: The ID is null or undefined.");
//         toast.error("Unable to delete item. Please try again."); // Replace alert with toast
//         return;
//     }

//     if (window.confirm("Are you sure you want to delete this item?")) {
//         try {
//             const response = await API.delete(`/api/inventory/${id}/`);
//             console.log(response.data.message);

//             // Show a success toast
//             toast.success(response.data.message || "Inventory item deleted successfully.");

//             // Update the inventory list by filtering out the deleted item
//             setInventory((prevInventory) =>
//                 prevInventory.filter((item) => item.id !== id)
//             );
//         } catch (error) {
//             console.error("Error deleting inventory item:", error.response?.data || error.message);

//             // Show an error toast
//             toast.error(error.response?.data?.error || "An error occurred while deleting the item.");
//         }
//     }
// };

//     // Handle submit (add or update inventory item)
//     const handleSubmit = async () => {
//         const { office_id, item_id, quantity, remarks, id } = formData;
//         try {
//             if (isEditing) {
//                 await API.put(`/api/inventory/${id}/`, { office_id, item_id, quantity, remarks });
//                 toast.success("Inventory item updated successfully.");
//             } else {
//                 await API.post("/api/inventory/", { office_id, item_id, quantity, remarks });
//                 toast.success("Inventory item created successfully.");
//             }
//             fetchData();
//             handleCloseModal();
//         } catch (error) {
//             console.error("Error submitting inventory item:", error.response?.data || error.message);
//             toast.error(error.response?.data?.message || "An error occurred while submitting the item.");
//         }
//     };

//     return (
//         <Box>
//             <Typography
//                 variant="h4"
//                 gutterBottom
//                 style={{
//                     textAlign: "center",
//                     textTransform: "uppercase",
//                     letterSpacing: "3px",
//                     fontSize: "2.5rem",
//                     fontFamily: '"Roboto", sans-serif',
//                     fontWeight: "bold",
//                 }}
//             >
//                 Inventory Dashboard
//             </Typography>

//             <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 4 }}>
//                 <InventoryTools />
//             </Grid>

//             <Grid container spacing={2} sx={{ marginBottom: 2 }}>
//                 <Grid item xs={12} sm={4}>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         fullWidth
//                         startIcon={<Add />}
//                         onClick={() => handleOpenModal()}
//                     >
//                         Add Item
//                     </Button>
//                 </Grid>
//                 <Grid item xs={6} sm={3}>
//                     <FormControl fullWidth>
//                         <InputLabel>Filter by Office</InputLabel>
//                         <Select
//                             name="office"
//                             value={filterCriteria.office}
//                             onChange={handleFilterChange}
//                         >
//                             <MenuItem value="">All Offices</MenuItem>
//                             {offices.map((office) => (
//                                 <MenuItem key={office.id} value={office.id}>
//                                     {office.name}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Grid>
//                 <Grid item xs={6} sm={3}>
//                     <FormControl fullWidth>
//                         <InputLabel>Filter by Item</InputLabel>
//                         <Select
//                             name="item"
//                             value={filterCriteria.item}
//                             onChange={handleFilterChange}
//                         >
//                             <MenuItem value="">All Items</MenuItem>
//                             {items.map((item) => (
//                                 <MenuItem key={item.id} value={item.id}>
//                                     {item.name}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Grid>
//             </Grid>

//             <TableContainer>
//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             <TableCell onClick={() => handleSort("office_name")}>
//                                 Office <Sort fontSize="small" />
//                             </TableCell>
//                             <TableCell onClick={() => handleSort("item_name")}>
//                                 Item <Sort fontSize="small" />
//                             </TableCell>
//                             <TableCell onClick={() => handleSort("quantity")} align="center">
//                                 Quantity <Sort fontSize="small" />
//                             </TableCell>
//                             <TableCell>Remarks</TableCell>
//                             <TableCell align="center">Actions</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {filteredInventory.map((row) => (
//                             <TableRow key={row.id}>
//                                 <TableCell>{row.office_name}</TableCell>
//                                 <TableCell>{row.item_name}</TableCell>
//                                 <TableCell align="center">{row.quantity}</TableCell>
//                                 <TableCell>{row.remarks}</TableCell>
//                                 <TableCell align="center">
//                                     <Tooltip title="Edit">
//                                         <IconButton onClick={() => handleOpenModal(row)}>
//                                             <Edit color="primary" />
//                                         </IconButton>
//                                     </Tooltip>
//                                     <Tooltip title="Delete">
//                                         <IconButton onClick={() => handleDelete(row.id)}>
//                                             <Delete color="error" />
//                                         </IconButton>
//                                     </Tooltip>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>

//             {/* Modal */}
//             <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
//                 <DialogTitle>{isEditing ? "Edit Inventory" : "Add Inventory"}</DialogTitle>
//                 <DialogContent>
//                     {isModalLoading ? (
//                         <Box textAlign="center" my={2}>
//                             <CircularProgress />
//                         </Box>
//                     ) : (
//                         <>
//                             <FormControl fullWidth margin="dense">
//                                 <InputLabel>Office</InputLabel>
//                                 <Select
//                                     name="office_id"
//                                     value={formData.office_id}
//                                     onChange={handleChange}
//                                 >
//                                     {offices.map((office) => (
//                                         <MenuItem key={office.id} value={office.id}>
//                                             {office.name}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                             <FormControl fullWidth margin="dense">
//                                 <InputLabel>Item</InputLabel>
//                                 <Select
//                                     name="item_id"
//                                     value={formData.item_id}
//                                     onChange={handleChange}
//                                 >
//                                     {items.map((item) => (
//                                         <MenuItem key={item.id} value={item.id}>
//                                             {item.name}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                             <TextField
//                                 name="quantity"
//                                 label="Quantity"
//                                 type="number"
//                                 fullWidth
//                                 margin="dense"
//                                 value={formData.quantity}
//                                 onChange={handleChange}
//                                 InputProps={{ inputProps: { min: 1 } }}
//                             />
//                             <TextField
//                                 name="remarks"
//                                 label="Remarks"
//                                 fullWidth
//                                 margin="dense"
//                                 value={formData.remarks}
//                                 onChange={handleChange}
//                             />
//                         </>
//                     )}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleCloseModal} color="secondary">
//                         Cancel
//                     </Button>
//                     <Button onClick={handleSubmit} color="primary">
//                         {isEditing ? "Update" : "Submit"}
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// export default InventoryDashboard;
