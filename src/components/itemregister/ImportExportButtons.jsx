import React, { useState } from 'react';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';  // Import react-toastify for toast messages
import API from '../../services/api';  // Assume API is a utility for handling API requests

const ImportExportButtons = () => {
    const [showFileInput, setShowFileInput] = useState(false);  // State to control file input visibility
    const [fileSelected, setFileSelected] = useState(false);  // State to track file selection

    // Handle file download
    const handleDownload = async (type) => {
        try {
            const response = await API.get(`/api/register/${type}`, {
                responseType: "blob",  // Ensure the response is treated as a binary blob
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", type === 'download' ? 'item_Register.xlsx' : 'item_Register_template.xlsx');  // Set the appropriate filename
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            toast.success(`${type === 'download' ? 'Item Register' : 'Template'} downloaded successfully!`);
        } catch (error) {
            console.error("Error downloading the file:", error);
            toast.error("Error downloading the file.");
        }
    };

    // Handle file upload (import)
    const handleImport = async (event) => {
        const formData = new FormData();
        formData.append('file', event.target.files[0]);

        try {
            await API.post('/api/register/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Import successful');
            setFileSelected(false);  // Reset file selection
            // Trigger an automatic refresh or state update to show the new data if needed
            // Example: updateItemsState(); or fetchItemsData();
        } catch (error) {
            toast.error('Error during import');
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
                sx={{
                    marginRight: 2,
                    textTransform: 'capitalize',
                    backgroundColor: '#f57c00',  // Custom blue
                    '&:hover': { backgroundColor: '#1565c0' }
                }}
            >
                Download Item Register
            </Button>

            <Button
                variant="contained"
                onClick={() => handleDownload('template')}
                sx={{
                    marginRight: 2,
                    textTransform: 'capitalize',
                    backgroundColor: '#1976d2',  // Custom orange
                    '&:hover': { backgroundColor: '#e65100' }
                }}
            >
                Download Template
            </Button>

            {/* Show the file input and upload button only if a file is selected */}
            {showFileInput && (
                <>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={(e) => {
                            setFileSelected(true);
                            handleImport(e); // Trigger import automatically for this example
                        }}
                        style={{ display: 'none' }}
                    />
                    <Button
                        variant="contained"
                        component="label"
                        sx={{
                            backgroundColor: '#4caf50',  // Green color for the submit button
                            '&:hover': { backgroundColor: '#388e3c' },
                            display: fileSelected ? 'block' : 'none',  // Show only when a file is selected
                        }}
                    >
                        Submit
                        <input
                            type="file"
                            hidden
                            onChange={(e) => handleImport(e)}
                        />
                    </Button>
                </>
            )}
        </div>
    );
};

export default ImportExportButtons;
