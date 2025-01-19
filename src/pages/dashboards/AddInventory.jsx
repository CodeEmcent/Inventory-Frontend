import React, { useState } from "react";
import { TextField, Button, Grid, Card, CardContent, Typography } from "@mui/material";

const AddInventory = () => {
    const [item, setItem] = useState({
        name: "",
        category: "",
        stock: 0,
    });

    const handleChange = (e) => {
        setItem({ ...item, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission (e.g., send data to API)
        console.log("Inventory Item Added", item);
    };

    return (
        <Grid container justifyContent="center">
            <Grid item xs={12} sm={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Add New Inventory Item
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Item Name"
                                name="name"
                                value={item.name}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                            <TextField
                                label="Category"
                                name="category"
                                value={item.category}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                            <TextField
                                label="Stock"
                                name="stock"
                                type="number"
                                value={item.stock}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                            <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
                                Add Item
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default AddInventory;
