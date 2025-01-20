import React, { useState } from 'react';
import { Button } from '@mui/material';
import API from '../../services/api';  // Assume API is a utility for handling API requests

const ImportExportButtons = () => {
    const [showFileInput, setShowFileInput] = useState(false);  // State to control file input visibility

    // Handle file download
    const handleDownload = (type) => {
        window.location.href = `/api/registry/${type}`;
    };

    // Handle file upload (import)
    const handleImport = async (event) => {
        const formData = new FormData();
        formData.append('file', event.target.files[0]);

        try {
            await API.post('/api/registry/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Import successful');
        } catch (error) {
            alert('Error during import');
            console.error(error);
        }
    };

    // Toggle the visibility of the file input when clicking 'Download Template'
    const toggleFileInput = () => {
        setShowFileInput(prev => !prev);
    };

    return (
        <div>
            <Button
                variant="contained"
                onClick={() => handleDownload('download')}
                sx={{ marginRight: 2, textTransform: 'capitalize' }}
            >
                Download Registry
            </Button>

            <Button
                variant="contained"
                onClick={() => handleDownload('template')}
                sx={{ marginRight: 2, textTransform: 'capitalize' }}
            >
                Download Template
            </Button>
        </div>
    );
};

export default ImportExportButtons;
