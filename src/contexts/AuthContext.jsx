import React, { createContext, useContext, useState } from 'react';

// Create a context to hold the authentication state
const AuthContext = createContext();

// Custom hook to use authentication context
export const useAuth = () => {
    return useContext(AuthContext);
};

// Provider component to wrap the application and provide the auth state
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = () => {
        setIsLoggedIn(true);
        // You can also store this info in localStorage or sessionStorage
        localStorage.setItem('isLoggedIn', 'true');
    };

    const logout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
    };

    // Check the localStorage on initial load
    React.useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
