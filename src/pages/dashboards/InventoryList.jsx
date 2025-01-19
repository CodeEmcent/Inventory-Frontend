import React from "react";
import { Grid, Card, CardContent, Typography, Button } from "@mui/material";

const InventoryList = () => {
    // Simulating some inventory data (this would come from an API or database)
    const inventoryItems = [
        { id: 1, name: "Item 1", category: "Category A", stock: 25 },
        { id: 2, name: "Item 2", category: "Category B", stock: 10 },
        { id: 3, name: "Item 3", category: "Category A", stock: 50 },
    ];

    return (
        <Grid container spacing={2}>
            {inventoryItems.map((item) => (
                <Grid item xs={12} sm={4} key={item.id}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">{item.name}</Typography>
                            <Typography variant="body2">Category: {item.category}</Typography>
                            <Typography variant="body2">Stock: {item.stock}</Typography>
                            <Button variant="outlined" sx={{ mt: 1 }}>Edit</Button>
                            <Button variant="contained" color="error" sx={{ mt: 1, ml: 1 }}>Delete</Button>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default InventoryList;
