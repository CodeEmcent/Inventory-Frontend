import React, { useState } from 'react';
import API from '../../services/api';

const RegistryImport = () => {
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
            const response = await API.post('/api/registry/import/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('File uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
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
                style={{ padding: '12px' }} // Adjust padding here
            >
                {file ? 'Submit' : 'Upload Registry'} {/* Change button text */}
            </button>
        </div>
    );
};

export default RegistryImport;
