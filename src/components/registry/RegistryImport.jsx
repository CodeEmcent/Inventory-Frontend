import React, { useState } from 'react';
import API from '../../services/api';

const RegistryImport = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

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

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={!file}>
                Upload Registry
            </button>
        </div>
    );
};

export default RegistryImport;
