import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "./components/common/header/Header";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./components/home/Home";
import Footer from "./components/common/footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./components/about/About";
import Services from "./components/services/Services";
import Contact from "./components/contact/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./contexts/AuthContext";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import StaffDashboard from "./pages/dashboards/StaffDashboard";
import Unauthorized from "./pages/Unauthorized";

function App() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();  // Get the current user from context

    // Redirect based on user role
    useEffect(() => {
        if (user) {
            // If user is logged in, direct to their dashboard based on their role
            if (user.role === "super_admin") {
                navigate("/admin-dashboard");
            } else if (user.role === "staff") {
                navigate("/staff-dashboard");
            }
        }
    }, [user, navigate]);

    // Condition to exclude protected routes from footer display
    const isProtectedRoute =
        location.pathname.includes("/dashboard") ||
        location.pathname.includes("/api/offices") ||
        location.pathname.includes("/inventory") ||
        location.pathname.includes("/reports");

    return (
        <div>
            <Header />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />

                {/* Protected Routes */}
                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/staff-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["staff", "admin", "super_admin"]}>
                            <StaffDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
            {/* Render Footer only for public routes */}
            {!isProtectedRoute && <Footer />}
        </div>
    );
}

export default App;
