import React from 'react';
import API from './apiService';

const TemplateDownload = ({ officeId }) => {
    const downloadTemplate = async () => {
        try {
            const response = await API.get(`/api/template/${officeId}/`, {
                responseType: 'blob', // For file download
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `template_office_${officeId}.xlsx`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading template:', error);
        }
    };

    return <button onClick={downloadTemplate}>Download Template</button>;
};

export default TemplateDownload;
