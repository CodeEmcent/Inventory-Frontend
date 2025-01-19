import { useState, useEffect } from "react";
import {
    Box,
    Grid,
    Typography,
    Container,
} from "@mui/material";
import InventoryList from "../../components/inventory/InventoryList";
import AddInventory from "../../components/inventory/AddInventory";
import UserManagement from "../../components/usermanagement/UserManagement"; // New Component for user management
import OfficeManagement from "../../components/officemanagement/OfficeManagement"; // New Component for office management
import StatsCard from "../../components/stats/StatsCard";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Fix import typo
import Sidebar from "../../pages/dashboards/Sidebar"; // Adjust the import path if necessary
import ItemRegistry from "../../components/registry/ItemRegistry";

const AdminDashboard = () => {
    const [currentSection, setCurrentSection] = useState("inventory");
    const [role, setrole] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            navigate("/login"); // Redirect to login if no token
            return;
        }
    
        try {
            const decodedToken = jwtDecode(token);
            const userRole = decodedToken.role;
    
            // Check for valid roles
            if (!["admin", "super_admin"].includes(userRole)) {
                navigate("/unauthorized");
            }
    
            // Optional: Save role for conditional rendering
            setrole(userRole);
        } catch (error) {
            console.error("Error decoding token:", error);
            navigate("/login");
        }
    }, [navigate]);

    const handleSectionChange = (section) => {
        setCurrentSection(section);
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar */}
            <Sidebar setCurrentSection={handleSectionChange} role={role} />

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, p: 2 }}>
                <Container>
                    <Typography variant="h4" gutterBottom>
                        Admin Dashboard
                    </Typography>
                    <Grid container spacing={2}>
                        {/* Stats Cards */}
                        <Grid item xs={12} sm={4}>
                            <StatsCard title="Total Items" value={120} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <StatsCard title="Total Categories" value={8} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <StatsCard title="Items Sold" value={50} />
                        </Grid>
                    </Grid>

                    {/* Section Rendering */}
                    {currentSection === "inventory" && <InventoryList />}
                    {currentSection === "addInventory" && <AddInventory />}
                    {currentSection === "userManagement" && role === "super_admin" && (
                        <UserManagement />
                    )}
                    {currentSection === "officeManagement" && <OfficeManagement />}
                    {currentSection === "itemRegistry" && <ItemRegistry />}
                    {currentSection === "reports" && role === "super_admin" && (
                        <Typography variant="h6">Reports Section Coming Soon...</Typography>
                    )}
                </Container>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
