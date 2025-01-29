import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../utils/axiosInstance";
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    CircularProgress,
    Snackbar,
    Alert,
    Backdrop, // Full-Screen Loader
} from "@mui/material";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setError(""); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loader

        try {
            const response = await axiosInstance.post("/api/token/", {
                username: email,
                password,
            });

            const accessToken = response.data.access;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", response.data.refresh);

            const decodedToken = jwtDecode(accessToken);
            const role = decodedToken.role;
            localStorage.setItem("role", role);

            // Redirect based on role
            if (role === "super_admin") {
                navigate("/admin-dashboard");
            } else if (role === "staff") {
                navigate("/staff-dashboard");
            } else {
                setError("Unauthorized role.");
                setOpenSnackbar(true); // Show snackbar
            }
        } catch (err) {
            setError(err.response?.status === 401 ? "Invalid email or password." : "An unexpected error occurred.");
            setOpenSnackbar(true); // Show snackbar on error
        } finally {
            setIsLoading(false); // Stop loader
        }
    };

    return (
        <Container maxWidth="xs">
            {/* Full-Screen Loader */}
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
                <CircularProgress color="inherit" size={50} />
            </Backdrop>

            {/* Snackbar for Error Messages */}
            <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
                <Alert severity="error" variant="filled" onClose={() => setOpenSnackbar(false)}>
                    {error}
                </Alert>
            </Snackbar>

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
                <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    disabled={isLoading} // Disable button while loading
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        backgroundColor: isLoading ? "#ccc" : "#007bff",
                        "&:hover": { backgroundColor: isLoading ? "#ccc" : "#0056b3" },
                    }}
                >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : "Login"}
                </Button>
                <Link to="/register" style={{ fontStyle: "italic", fontSize: "12px" }}>
                    Don't have an account? Register
                </Link>
            </Box>
        </Container>
    );
};

export default Login;
