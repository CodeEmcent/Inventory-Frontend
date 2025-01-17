import React from "react";
import { Routes, Route, useLocation } from "react-router-dom"; // Correct import
import "./App.css";
import Header from "./components/common/header/Header";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Home from "./components/home/Home";
import Footer from "./components/common/footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Offices from "./pages/Offices";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import About from "./components/about/About";
import Services from "./components/services/Services";
import Contact from "./components/contact/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
    const location = useLocation(); // Now this works correctly, as App is within a Router

    // Condition to exclude protected routes from footer display
    const isProtectedRoute =
        location.pathname.includes("/dashboard") ||
        location.pathname.includes("/api/offices") ||
        location.pathname.includes("/inventory") ||
        location.pathname.includes("/reports");

    return (
        <>
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
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <Dashboard />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/api/offices"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <Offices />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/inventory"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <Inventory />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/reports"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <Reports />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
            </Routes>

            {/* Render Footer only for public routes */}
            {!isProtectedRoute && <Footer />}
        </>
    );
}

export default App;
