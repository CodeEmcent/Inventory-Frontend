import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router> {/* Wrap Router around AuthProvider */}
      <AuthProvider> {/* Wrap AuthProvider around the entire app */}
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
