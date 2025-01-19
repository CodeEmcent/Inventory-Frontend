import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const role = localStorage.getItem("role");

        if (token && role) {
            setUser({ token, role });
        }
    }, []);

    const login = (token, role) => {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("role", role);
        setUser({ token, role });
        if (role === "super_admin") {
            navigate("/admin-dashboard");
        } else if (role === "staff") {
            navigate("/staff-dashboard");
        }
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
