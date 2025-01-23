import React, { useState, useEffect } from 'react';
import { Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Stack } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import API from '../../services/api';
import { useNavigate } from "react-router-dom";
import ImportExportButtons from './ImportExportButtons';
import RegisterImport from './RegisterImport';  // Import RegisterImport component
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ItemRegister = () => {
    const [items, setItems] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState({ name: '', description: '' });
    const [itemToDelete, setItemToDelete] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sortColumn, setSortColumn] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const navigate = useNavigate();

    const logoutUser = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        navigate("/login");
    };

    const fetchItems = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            logoutUser();
            return;
        }

        setLoading(true);
        try {
            const response = await API.get('/api/item-register/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const items = Array.isArray(response.data.item_register) ? response.data.item_register : [];
            const sortedItems = items.sort((a, b) => {
                if (a.name < b.name) return sortDirection === 'asc' ? -1 : 1;
                if (a.name > b.name) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });

            setItems(sortedItems);
        } catch (error) {
            console.error('Error fetching items:', error.response ? error.response.data : error.message);
            setMessage('Error fetching items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleSort = (column) => {
        const newSortDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(newSortDirection);

        const sortedItems = [...items].sort((a, b) => {
            if (a[column] < b[column]) return newSortDirection === 'asc' ? -1 : 1;
            if (a[column] > b[column]) return newSortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        setItems(sortedItems);
    };

    const handleOpenDialog = (item = null) => {
        if (item) {
            setIsEditing(true);
            setCurrentItem({ ...item });
        } else {
            setIsEditing(false);
            setCurrentItem({ name: '', description: '' });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSubmit = async () => {
        try {
            if (isEditing) {
                await API.put(`/api/item-register/${currentItem.item_id}/`, {
                    name: currentItem.name,
                    description: currentItem.description,
                });
                toast.success("Item updated successfully.");
            } else {
                await API.post('/api/item-register/', {
                    name: currentItem.name,
                    description: currentItem.description,
                });
                toast.success("Item added successfully.");
            }
            fetchItems();
            handleCloseDialog();
        } catch (error) {
            console.error('Error submitting item:', error);
            toast.error("Unable to save item. Please try again.");
        }
    };

    const handleDeleteDialogOpen = (item) => {
        setItemToDelete(item);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            if (itemToDelete) {
                await API.delete(`/api/item-register/${itemToDelete.item_id}/`);
                toast.success("Item deleted successfully.");
                fetchItems();
                setOpenDeleteDialog(false);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error("Unable to delete item. Please try again.");
        }
    };

    const handleDeleteCancel = () => {
        setOpenDeleteDialog(false);
    };

    return (
        <Box>
            <Typography
                variant="h4"
                gutterBottom
                style={{
                    textAlign: 'center',           
                    textTransform: 'uppercase',    
                    letterSpacing: '3px',          
                    fontSize: '2.5rem',            
                    fontFamily: '"Roboto", sans-serif', 
                    fontWeight: 'bold',
                    color: '#213d77',
                }}
            >
                Item Register
            </Typography>

            <Stack
                direction="row"
                spacing={2}
                sx={{
                    marginBottom: 2,
                    justifyContent: 'center', // Center buttons horizontally
                    alignItems: 'center', // Center buttons vertically (optional)
                    width: '100%',
                }}
            >
                <Button variant="contained" color="success" onClick={() => handleOpenDialog()} sx={{ textTransform: 'capitalize' }}>Add New Item</Button>
                <ImportExportButtons />
                <RegisterImport fetchItems={fetchItems} /> {/* Pass fetchItems as prop */}
            </Stack>

            {message && <Typography color="primary">{message}</Typography>}
            {loading && <Typography>Loading...</Typography>}

            <TableContainer sx={{ border: '1px solid #ccc' }}>
                <Table sx={{ borderCollapse: 'collapse', width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ccc', padding: '4px 8px' }}>Item ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ccc', padding: '4px 8px', cursor: 'pointer' }} onClick={() => handleSort('name')}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ccc', padding: '4px 8px', cursor: 'pointer' }} onClick={() => handleSort('description')}>Description</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ccc', padding: '4px 8px' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.item_id}>
                                <TableCell sx={{ border: '1px solid #ccc', padding: '0 8px' }}>{item.item_id}</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc', padding: '0 8px' }}>{item.name}</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc', padding: '0 8px' }}>{item.description || 'N/A'}</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc', padding: '0 8px' }}>
                                    <IconButton color="primary" onClick={() => handleOpenDialog(item)} aria-label="edit item">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="secondary" onClick={() => handleDeleteDialogOpen(item)} aria-label="delete item">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDeleteDialog} onClose={handleDeleteCancel} sx={{ padding: 2 }}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: '1.25rem', color: 'red' }}>
                    <WarningIcon sx={{ color: 'red', marginRight: 2 }} />
                    Delete Item
                </DialogTitle>
                <DialogContent sx={{ padding: 4 }}>
                    <Typography sx={{ color: '#f44336' }}>
                        Are you sure you want to delete this item? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} variant="outlined" sx={{ fontWeight: 'bold' }}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} sx={{
                        backgroundColor: '#f44336',
                        color: 'white',
                        fontWeight: 'bold',
                        '&:hover': { backgroundColor: '#d32f2f' },
                    }}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>{isEditing ? 'Edit Item' : 'Add Item'}</DialogTitle>
                <DialogContent>
                    <TextField label="Name" value={currentItem.name} onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })} fullWidth required />
                    <TextField label="Description" value={currentItem.description} onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })} fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} variant="outlined" color="secondary">Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!currentItem.name}>
                        {isEditing ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer />
        </Box>
    );
};

export default ItemRegister;
