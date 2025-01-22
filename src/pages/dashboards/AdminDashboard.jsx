import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Fixed import
import { Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../pages/dashboards/Sidebar"; // Adjust the import path if necessary
import DashboardHeader from "./DashboardHeader"; // Header Component
import UserManagement from "../../components/usermanagement/UserManagement";
import OfficeManagement from "../../components/officemanagement/OfficeManagement";
import ItemRegister from "../../components/itemregister/ItemRegister";
import InventoryDashboard from "../../components/inventory/InventoryDashboard";
import Dashboard from "../../components/report/StatsCard";

const AdminDashboard = () => {
    const [currentSection, setCurrentSection] = useState("reports");
    const [role, setRole] = useState("");
    const [welcomeMessage, setWelcomeMessage] = useState("");
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

    // Generate welcome message with date and time
    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const options = { year: "numeric", month: "long", day: "numeric" };
            const date = now.toLocaleDateString(undefined, options); // e.g., January 21, 2025
            const time = now.toLocaleTimeString(); // e.g., 2:45:30 PM

            setWelcomeMessage(`Hello & Welcome. Today is ${date}, ${time}.`);
        };

        updateDateTime();

        // Optionally, update the time every minute or second
        const timer = setInterval(updateDateTime, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(timer);
    }, []);

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
                    welcomeMessage={welcomeMessage} // Dynamic welcome message
                />
                <Container sx={{ paddingTop: 3 }}>
                    {/* Section Rendering */}
                    {currentSection === "userManagement" && role === "super_admin" && (
                        <UserManagement />
                    )}
                    {currentSection === "officeManagement" && role === "super_admin" && (
                        <OfficeManagement />
                    )}
                    {currentSection === "itemRegister" && role === "super_admin" && (
                        <ItemRegister />
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
