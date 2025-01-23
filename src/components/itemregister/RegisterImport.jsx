import React, { useState } from 'react';
import API from '../../services/api';
import { toast } from "react-toastify";

const RegisterImport = ({ fetchItems }) => {
    const [file, setFile] = useState(null);

    // Handle file change
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Handle file upload (submit)
    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await API.post('/api/register/import/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                toast.success("File uploaded successfully!"); // Show success toast
                fetchItems(); // Call fetchItems to refresh the list in the parent component
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error("Error uploading file. Please try again."); // Show error toast
        }
    };

    // Trigger file input when button is clicked
    const handleFileInputClick = () => {
        document.getElementById('fileInput').click(); // Trigger file input click programmatically
    };

    return (
        <div>
            {/* Hidden file input */}
            <input
                id="fileInput"
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }} // Hide the file input
            />
            {/* Upload/Submit Button */}
            <button
                onClick={file ? handleUpload : handleFileInputClick} // If file is selected, submit; otherwise, open file input
                style={{
                    padding: '12px',
                    backgroundColor: file ? 'green' : '#D99B3A', // Soft amber color for the non-selected state
                    border: 'none', // Optional: Remove border for a cleaner look
                    color: 'white', // Text color for contrast
                }}
            >
                {file ? 'Submit' : 'Upload Register'} {/* Change button text */}
            </button>
        </div>
    );
};

export default RegisterImport;
