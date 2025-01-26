import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Correct import
import { Box, Container } from "@mui/material";
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import Sidebar from "../../pages/dashboards/Sidebar"; // Adjust the import path
import DashboardHeader from "./DashboardHeader";
import UserManagement from "../../components/usermanagement/UserManagement";
import OfficeManagement from "../../components/officemanagement/OfficeManagement";
import ItemRegister from "../../components/itemregister/ItemRegister";
import InventoryDashboard from "../../components/inventory/InventoryDashboard";
import Dashboard from "../../components/report/StatsCard";
import ProfileSection from "./ProfileSection";


const ROLE_CONSTANTS = {
    SUPER_ADMIN: "super_admin",
    ADMIN: "admin",
    STAFF: "staff",
};

const AdminDashboard = () => {
    const [currentSection, setCurrentSection] = useState("profile");
    const [role, setRole] = useState("");
    const [welcomeMessage, setWelcomeMessage] = useState("");
    const navigate = useNavigate();

    // Decode token and set user role
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            navigate("/login"); // Redirect if no token
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            const userRole = decodedToken.role;

            // Validate role
            if (![ROLE_CONSTANTS.SUPER_ADMIN, ROLE_CONSTANTS.ADMIN, ROLE_CONSTANTS.STAFF].includes(userRole)) {
                navigate("/unauthorized");
                return;
            }

            setRole(userRole); // Set role for conditional rendering
        } catch (error) {
            console.error("Error decoding token:", error);
            navigate("/login"); // Redirect on error
        }
    }, [navigate]);

    // Generate and update welcome message
    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const options = { year: "numeric", month: "long", day: "numeric" };
            const date = now.toLocaleDateString(undefined, options);
            const time = now.toLocaleTimeString();

            // setWelcomeMessage(`Hello & Welcome. Today is ${date}, ${time}.`);
        };

        updateDateTime();
        const timer = setInterval(updateDateTime, 1000);

        return () => clearInterval(timer); // Cleanup
    }, []);

    const handleSectionChange = (section) => {
        setCurrentSection(section);
    };

    // Conditional rendering helper
    const renderSection = () => {
        if (currentSection === "profile" && [ROLE_CONSTANTS.SUPER_ADMIN, ROLE_CONSTANTS.STAFF].includes(role)) {
            return <ProfileSection />;
        }
        if (currentSection === "userManagement" && role === ROLE_CONSTANTS.SUPER_ADMIN) {
            return <UserManagement />;
        }
        if (currentSection === "officeManagement" && role === ROLE_CONSTANTS.SUPER_ADMIN) {
            return <OfficeManagement />;
        }
        if (currentSection === "itemRegister" && role === ROLE_CONSTANTS.SUPER_ADMIN) {
            return <ItemRegister />;
        }
        if (currentSection === "inventory" && [ROLE_CONSTANTS.SUPER_ADMIN, ROLE_CONSTANTS.STAFF].includes(role)) {
            return <InventoryDashboard role={role} />; // Pass role prop
        }                
        if (currentSection === "reports" && [ROLE_CONSTANTS.SUPER_ADMIN, ROLE_CONSTANTS.STAFF].includes(role)) {
            return <Dashboard />;
        }
        return <Typography variant="h6">Section not found.</Typography>;
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar */}
            <Sidebar setCurrentSection={handleSectionChange} role={role} />

            {/* Main Content */}
            <Box sx={{ flexGrow: 1 }}>
                {/* Dashboard Header */}
                <DashboardHeader
                    dashboardName="Admin Dashboard"
                    welcomeMessage={welcomeMessage}
                />

                <Container sx={{ paddingTop: 3 }}>
                    {renderSection()} {/* Render the current section */}
                </Container>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
