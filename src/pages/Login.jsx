import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Correct import
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Alert,
} from "@mui/material";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setError(""); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/token/", {
                username: email,
                password,
            });

            // Save tokens to localStorage
            const accessToken = response.data.access;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", response.data.refresh);

            // Decode the JWT token to extract the role
            const decodedToken = jwtDecode(accessToken);
            console.log("Decoded Role:", decodedToken.role);
            const role = decodedToken.role;
            // Save the user role in localStorage
            localStorage.setItem("role", role);

            // Redirect based on the user role
            if (role === "super_admin") {
                navigate("/admin-dashboard");
                console.log("User is a super admin");
            } else if (role === "staff") {
                navigate("/staff-dashboard");
                console.log("User is a staff member");
            } else {
                setError("Unauthorized role.");
                console.error("Unknown role:", role);
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError("Invalid email or password.");
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <Container maxWidth="xs" sx={{ height: { xs: "60vh", sm: "54vh", md: "50vh" } }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    mt: 10,
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
                    Login
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={handleInputChange(setEmail)}
                    fullWidth
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={handleInputChange(setPassword)}
                    fullWidth
                    required
                />
                <Button variant="contained" type="submit" fullWidth>
                    Login
                </Button>
                <Link
                    to="/register"
                    style={{ fontStyle: "italic", fontSize: "12px" }}
                >
                    Don't have an account? Register
                </Link>
            </Box>
        </Container>
    );
};

export default Login;
