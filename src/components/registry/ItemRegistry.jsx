import React, { useState, useEffect } from 'react';
import { Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Stack } from '@mui/material';
import API from '../../services/api';
import { useNavigate } from "react-router-dom";
import ImportExportButtons from './ImportExportButtons';  // Make sure this is correctly imported
import RegistryImport from './RegistryImport';
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ItemRegistry = () => {
    const [items, setItems] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState({ name: '', description: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sortColumn, setSortColumn] = useState('name'); // Added sort column state
    const [sortDirection, setSortDirection] = useState('asc');  // Default to ascending
    const navigate = useNavigate();

    // Define logoutUser function
    const logoutUser = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        navigate("/login"); // Redirect to the login page
    };

    // Fetch the item registry
    const fetchItems = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            logoutUser();  // If no token, log out user
            return;
        }

        setLoading(true);  // Set loading to true while fetching
        try {
            const response = await API.get('/api/registry/view', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            console.log('API Response Status:', response.status);  // Log the response status for debugging

            // Sort the items based on the direction
            const sortedItems = response.data.item_registry.sort((a, b) => {
                if (a.name < b.name) return sortDirection === 'asc' ? -1 : 1;
                if (a.name > b.name) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });

            setItems(sortedItems); // Set the sorted items to state
        } catch (error) {
            console.error('Error fetching items:', error.response ? error.response.data : error.message);
            setMessage('Error fetching items');
        } finally {
            setLoading(false);  // Set loading to false after fetching
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    // Handle sorting by column
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


    // Handle opening the dialog (edit mode or add mode)
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

    // Rename handleOpenModal to handleOpenDialog (or use handleOpenModal as a wrapper for handleOpenDialog)
    const handleOpenModal = (item) => {
        handleOpenDialog(item);
    };

    // Handle closing the dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            if (isEditing) {
                await API.put(`/api/registry/${currentItem.id}/`, currentItem);
                setMessage('Item updated successfully');
            } else {
                await API.post('/api/registry/', currentItem);
                setMessage('Item created successfully');
            }
            fetchItems();  // Refresh the items list
            handleCloseDialog();
        } catch (error) {
            setMessage('Error submitting item');
            console.error(error);
        }
    };

    // Handle item deletion
    const handleDelete = async (id) => {
        try {
            await API.delete(`/api/registry/${id}/`);
            setMessage('Item deleted successfully');
            fetchItems();  // Refresh the items list
        } catch (error) {
            console.error('Error deleting item', error);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Item Registry</Typography>

            {/* Align the buttons and import/export section */}
            <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
                <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} sx={{ textTransform: 'capitalize' }}>Add New Item</Button>
                <ImportExportButtons /> {/* This component will be placed here */}
                <RegistryImport />
            </Stack>

            {message && <Typography color="primary">{message}</Typography>}
            {loading && <Typography>Loading...</Typography>}

            <TableContainer sx={{ border: '1px solid #ccc' }}>
                <Table sx={{ borderCollapse: 'collapse', width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ccc', padding: '4px 8px' }}>
                                Stock ID
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontWeight: 'bold',
                                    border: '1px solid #ccc',
                                    padding: '4px 8px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleSort('name')} // Sort by name
                            >
                                Name
                                {sortColumn === 'name' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontWeight: 'bold',
                                    border: '1px solid #ccc',
                                    padding: '4px 8px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleSort('description')} // Sort by description
                            >
                                Description
                                {sortColumn === 'description' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ccc', padding: '4px 8px' }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.stock_id}>
                                <TableCell sx={{ border: '1px solid #ccc', padding: '0 8px' }}>{item.stock_id}</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc', padding: '0 8px' }}>{item.name}</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc', padding: '0 8px' }}>{item.description || 'N/A'}</TableCell>
                                <TableCell sx={{ border: '1px solid #ccc', padding: '0 8px' }}>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenModal(item)}
                                        aria-label="edit item"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="secondary"
                                        onClick={() => handleDelete(item.id)}
                                        aria-label="delete item"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{isEditing ? 'Edit Item' : 'Add Item'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        value={currentItem.name}
                        onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Description"
                        value={currentItem.description}
                        onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">{isEditing ? 'Update' : 'Create'}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ItemRegistry;
