import React from "react";
import { Container, Typography } from "@mui/material";

const Unauthorized = () => {
    return (
        <Container>
            <Typography variant="h4">Unauthorized</Typography>
            <Typography variant="body1">You do not have permission to access this page.</Typography>
        </Container>
    );
};

export default Unauthorized;
