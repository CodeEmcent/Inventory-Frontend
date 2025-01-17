import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Alert,
} from "@mui/material";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://127.0.0.1:8000/api/register/", {
                username,
                email,
                password,
            });
            navigate("/login");
        } catch (err) {
            setError("Failed to register. Please try again.");
        }
    };

    return (
        <Container maxWidth="xs">
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    mt: 8,
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    backgroundColor: "#f9f9f9",
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <Typography variant="h5" align="center" gutterBottom>
                    Register
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    required
                />
                <Button variant="contained" type="submit" fullWidth>
                    Register
                </Button>
            </Box>
        </Container>
    );
};

export default Register;
