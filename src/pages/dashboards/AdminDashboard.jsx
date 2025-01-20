import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Fixed import
import { Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../pages/dashboards/Sidebar"; // Adjust the import path if necessary
import DashboardHeader from "./DashboardHeader"; // Header Component
import UserManagement from "../../components/usermanagement/UserManagement";
import OfficeManagement from "../../components/officemanagement/OfficeManagement";
import ItemRegistry from "../../components/registry/ItemRegistry";
import InventoryDashboard from "../../components/inventory/InventoryDashboard";
import Dashboard from "../../components/report/StatsCard";

const AdminDashboard = () => {
    // Set the default section to "reports"
    const [currentSection, setCurrentSection] = useState("reports");
    const [role, setRole] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            navigate("/login"); // Redirect to login if no token
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            const role = decodedToken.role;

            // Check for valid roles
            if (!["admin", "super_admin"].includes(role)) {
                navigate("/unauthorized");
            }

            // Optional: Save role for conditional rendering
            setRole(role);
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
            <Box sx={{ flexGrow: 1 }}>
                {/* Admin Header */}
                <DashboardHeader
                    dashboardName="Admin Dashboard"
                    welcomeMessage="Hello & Welcome to the Admin Dashboard"
                />
                <Container sx={{ paddingTop: 3 }}>
                    {/* Section Rendering */}
                    {currentSection === "userManagement" && role === "super_admin" && (
                        <UserManagement />
                    )}
                    {currentSection === "officeManagement" && role === "super_admin" && (
                        <OfficeManagement />
                    )}
                    {currentSection === "itemRegistry" && role === "super_admin" && (
                        <ItemRegistry />
                    )}
                    {currentSection === "inventory" && role === "super_admin" && (
                        <InventoryDashboard />
                    )}
                    {currentSection === "reports" && role === "super_admin" && (
                        <Dashboard />
                    )}
                </Container>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
