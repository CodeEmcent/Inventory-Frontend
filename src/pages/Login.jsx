import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";  // Import the useAuth hook
import { jwtDecode } from 'jwt-decode';  // Correct import for jwt-decode
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
    const { login } = useAuth(); // Access the login function from AuthContext

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/token/", {
                username: email,  // Send email as the username
                email: email,     // Send email explicitly as email
                password,
            });

            // Save tokens to localStorage
            const accessToken = response.data.access;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", response.data.refresh);

            // Decode the JWT token to extract the role
            const decodedToken = jwtDecode(accessToken);  // Use the correct function name
            console.log("Decoded Token:", decodedToken);
            const role = decodedToken.role;

            // Save the user role in localStorage
            localStorage.setItem("role", role);

            // Redirect based on the user role
            if (role === "super_admin") {
                navigate("/admin-dashboard");
            } else if (role === "staff") {
                navigate("/staff-dashboard");
            } else {
                setError("Unauthorized role.");
            }

        } catch (err) {
            console.error("Login error: ", err);
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <Container maxWidth="xs" sx={{ height: { xs: "60vh", sm: "54vh", md: "50vh" } }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    mt: 11.2,
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
                    Login
                </Button>
                <Link
                    to="/register"
                    style={{ fontStyle: 'italic', fontSize: '12px' }} // Apply italic and reduce font size
                >
                    Don't have an account? Register
                </Link>
            </Box>
        </Container>
    );
};

export default Login;
