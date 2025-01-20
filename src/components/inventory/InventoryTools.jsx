import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    CircularProgress,
} from "@mui/material";
import API from "../../services/api"; // Adjust to your API service path

const InventoryTools = () => {
    const [offices, setOffices] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [year, setYear] = useState(new Date().getFullYear());

    // Fetch offices for dropdown
    useEffect(() => {
        const fetchOffices = async () => {
            try {
                const response = await API.get("/api/offices/");
                setOffices(response.data);
            } catch (error) {
                console.error("Error fetching offices:", error);
            }
        };
        fetchOffices();
    }, []);

    // Handle template download
    const handleTemplateDownload = async () => {
        if (!selectedOffice) {
            alert("Please select an office.");
            return;
        }

        try {
            setIsLoading(true);
            const response = await API.get(`/api/template/${selectedOffice}/`, {
                responseType: "blob", // To handle file downloads
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `office_${selectedOffice}_template.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Error downloading template:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle file selection for import
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // Handle inventory import
    const handleImport = async () => {
        if (!selectedOffice || !selectedFile) {
            alert("Please select an office and a file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            setIsLoading(true);
            await API.post(`/api/import/?office_id=${selectedOffice}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Inventory imported successfully.");
        } catch (error) {
            console.error("Error importing inventory:", error);
            alert("Error importing inventory. Please check the file format.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle inventory export
    const handleExport = async () => {
        if (!selectedOffice) {
            alert("Please select an office.");
            return;
        }

        try {
            setIsLoading(true);
            const response = await API.get(`/api/export/?office_id=${selectedOffice}`, {
                responseType: "blob", // To handle file downloads
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `office_${selectedOffice}_inventory.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Error exporting inventory:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle broadsheet generation
    const handleBroadsheet = async () => {
        if (!year) {
            alert("Please specify a year.");
            return;
        }

        try {
            setIsLoading(true);
            const response = await API.get(`/api/broadsheet/?year=${year}`, {
                responseType: "blob", // To handle file downloads
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `broadsheet_${year}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Error generating broadsheet:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Manage Inventory
            </Typography>
            <FormControl fullWidth margin="dense">
                <InputLabel>Office</InputLabel>
                <Select
                    value={selectedOffice}
                    onChange={(e) => setSelectedOffice(e.target.value)}
                >
                    {offices.map((office) => (
                        <MenuItem key={office.id} value={office.id}>
                            {office.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Box sx={{ marginTop: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleTemplateDownload}
                    disabled={isLoading}
                    sx={{ marginRight: 2 }}
                >
                    Download Template
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    component="label"
                    disabled={isLoading}
                    sx={{ marginRight: 2 }}
                >
                    Import Inventory
                    <input
                        type="file"
                        hidden
                        onChange={handleFileChange}
                    />
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleImport}
                    disabled={!selectedFile || isLoading}
                    sx={{ marginRight: 2 }}
                >
                    Upload File
                </Button>
                <Button
                    variant="contained"
                    color="info"
                    onClick={handleExport}
                    disabled={isLoading}
                >
                    Export Inventory
                </Button>
            </Box>
            <Box sx={{ marginTop: 4 }}>
                <TextField
                    label="Year for Broadsheet"
                    type="number"
                    fullWidth
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    margin="dense"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleBroadsheet}
                    disabled={isLoading}
                    sx={{ marginTop: 2 }}
                >
                    Generate Broadsheet
                </Button>
                {isLoading && <CircularProgress sx={{ marginLeft: 2 }} />}
            </Box>
        </Box>
    );
};

export default InventoryTools;
