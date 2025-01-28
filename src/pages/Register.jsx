import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance"; // Import the configured axiosInstance
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
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [organization, setOrganization] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            // Make the API request using axiosInstance
            const response = await axiosInstance.post("/api/users/register/", {
                username,
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                organization,
            });

            // If successful, redirect to login
            setSuccess("Registration successful! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            // Capture and display specific error messages from the backend
            console.error("Registration error:", err.response?.data);
            setError(
                err.response?.data?.message ||
                    "Failed to register. Please try again."
            );
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
                {success && <Alert severity="success">{success}</Alert>}
                <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
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
                <TextField
                    label="Organization"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    fullWidth
                    placeholder="Optional"
                />
                <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    sx={{
                        backgroundColor: "#007bff",
                        "&:hover": { backgroundColor: "#0056b3" },
                    }}
                >
                    Register
                </Button>
                <Link
                    to="/login"
                    style={{ fontStyle: "italic", fontSize: "12px" }}
                >
                    Already have an account? Login
                </Link>
            </Box>
        </Container>
    );
};

export default Register;



// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import {
//     Box,
//     Button,
//     TextField,
//     Typography,
//     Container,
//     Alert,
// } from "@mui/material";

// const Register = () => {
//     const [username, setUsername] = useState("");
//     const [firstName, setFirstName] = useState(""); // Added first name
//     const [lastName, setLastName] = useState(""); // Added last name
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [organization, setOrganization] = useState(""); // Organization field
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(""); // Clear error messages before submission
//         setSuccess(""); // Clear success messages before submission

//         try {
//             // Make the API request
//             const response = await axios.post(
//                 "http://127.0.0.1:8000/api/users/register/",
//                 {
//                     username,
//                     first_name: firstName, // Add first_name
//                     last_name: lastName, // Add last_name
//                     email,
//                     password,
//                     organization, // Include organization
//                 },
//                 {
//                     headers: {
//                         "Content-Type": "application/json", // Ensure correct headers
//                     },
//                 }
//             );

//             // If successful, redirect to the login page
//             setSuccess("Registration successful! Redirecting to login...");
//             setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
//         } catch (err) {
//             // Capture and display specific error messages from the backend
//             console.error(err.response?.data); // Log the error for debugging
//             setError(
//                 err.response?.data?.message ||
//                     "Failed to register. Please try again."
//             );
//         }
//     };

//     return (
//         <Container maxWidth="xs">
//             <Box
//                 component="form"
//                 onSubmit={handleSubmit}
//                 sx={{
//                     mt: 8,
//                     p: 4,
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: 2,
//                     backgroundColor: "#f9f9f9",
//                     borderRadius: 2,
//                     boxShadow: 3,
//                 }}
//             >
//                 <Typography variant="h5" align="center" gutterBottom>
//                     Register
//                 </Typography>
//                 {error && <Alert severity="error">{error}</Alert>}
//                 {success && <Alert severity="success">{success}</Alert>}
//                 <TextField
//                     label="Username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     fullWidth
//                     required
//                 />
//                 <TextField
//                     label="First Name" // Added First Name field
//                     value={firstName}
//                     onChange={(e) => setFirstName(e.target.value)}
//                     fullWidth
//                     required
//                 />
//                 <TextField
//                     label="Last Name" // Added Last Name field
//                     value={lastName}
//                     onChange={(e) => setLastName(e.target.value)}
//                     fullWidth
//                     required
//                 />
//                 <TextField
//                     label="Email"
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     fullWidth
//                     required
//                 />
//                 <TextField
//                     label="Password"
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     fullWidth
//                     required
//                 />
//                 <TextField
//                     label="Organization" // Added Organization field
//                     value={organization}
//                     onChange={(e) => setOrganization(e.target.value)}
//                     fullWidth
//                     placeholder="Optional"
//                 />
//                 <Button
//                     variant="contained"
//                     type="submit"
//                     fullWidth
//                     sx={{
//                         backgroundColor: "#007bff",
//                         "&:hover": { backgroundColor: "#0056b3" },
//                     }}
//                 >
//                     Register
//                 </Button>
//                 <Link
//                     to="/login"
//                     style={{ fontStyle: "italic", fontSize: "12px" }}
//                 >
//                     Already have an account? Login
//                 </Link>
//             </Box>
//         </Container>
//     );
// };

// export default Register;




// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import {
//     Box,
//     Button,
//     TextField,
//     Typography,
//     Container,
//     Alert,
// } from "@mui/material";

// const Register = () => {
//     const [username, setUsername] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.post("http://127.0.0.1:8000/api/users/register/", {
//                 username,
//                 email,
//                 password,
//             });
//             navigate("/login");
//         } catch (err) {
//             setError("Failed to register. Please try again.");
//         }
//     };

//     return (
//         <Container maxWidth="xs">
//             <Box
//                 component="form"
//                 onSubmit={handleSubmit}
//                 sx={{
//                     mt: 8,
//                     p: 4,
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: 2,
//                     backgroundColor: "#f9f9f9",
//                     borderRadius: 2,
//                     boxShadow: 3,
//                 }}
//             >
//                 <Typography variant="h5" align="center" gutterBottom>
//                     Register
//                 </Typography>
//                 {error && <Alert severity="error">{error}</Alert>}
//                 <TextField
//                     label="Username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     fullWidth
//                     required
//                 />
//                 <TextField
//                     label="Email"
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     fullWidth
//                     required
//                 />
//                 <TextField
//                     label="Password"
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     fullWidth
//                     required
//                 />
//                 <Button variant="contained" type="submit" fullWidth sx={{ backgroundColor: "#007bff" }}>
//                     Register
//                 </Button>
//                 <Link
//                     to="/login"
//                     style={{ fontStyle: 'italic', fontSize: '12px' }} // Apply italic and reduce font size
//                 >
//                     Already have an account? Login
//                 </Link>
//             </Box>
//         </Container>
//     );
// };

// export default Register;
