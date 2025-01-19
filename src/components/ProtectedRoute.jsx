import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const accessToken = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');

    if (!accessToken) {
        return <Navigate to="/login" />;
    }

    // You can add role-based checks if needed
    if (children.props.path === '/admin-dashboard' && role !== 'super_admin') {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;
