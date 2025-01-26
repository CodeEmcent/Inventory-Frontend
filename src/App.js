import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import "./App.css";
import Header from "./components/common/header/Header";
import Footer from "./components/common/footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/home/Home";
import About from "./components/about/About";
import Contact from "./components/contact/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./components/services/Services";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import StaffDashboard from "./pages/dashboards/StaffDashboard";
import Unauthorized from "./pages/Unauthorized";
import { useAuth } from "./contexts/AuthContext";

const App = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isLoading } = useAuth(); // Get user and loading state from AuthContext

    // Redirect users to their respective dashboards based on roles after login
    useEffect(() => {
        if (user && ["/login", "/register"].includes(location.pathname)) {
            const dashboardPath = user.role === "super_admin" ? "/admin-dashboard" : "/staff-dashboard";
            navigate(dashboardPath, { replace: true });
        }
    }, [user, location.pathname, navigate]);

    // Paths where header and footer are excluded
    const protectedPaths = [
        "/admin-dashboard",
        "/staff-dashboard",
        "/profile",
        "/register",
        "/offices",
        "/inventory",
        "/reports",
    ];

    const isProtectedRoute = protectedPaths.some((path) => location.pathname.startsWith(path));

    // Show a loading state while authentication is being determined
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {/* Render Header only for public routes */}
            {!isProtectedRoute && <Header />}

            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* Protected Routes */}
                <Route
                    path="/register"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                            <Register />
                        </ProtectedRoute>
                    }
                />
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

                {/* Unauthorized Route */}
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>

            {/* Render Footer only for public routes */}
            {!isProtectedRoute && <Footer />}
        </div>
    );
};

export default App;
