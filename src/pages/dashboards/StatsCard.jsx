import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const StatsCard = ({ title, value }) => {
    return (
        <Card sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
            <CardContent>
                <Typography variant="h6">{title}</Typography>
                <Typography variant="h4">{value}</Typography>
            </CardContent>
        </Card>
    );
};

export default StatsCard;
