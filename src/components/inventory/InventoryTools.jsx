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
import {
    Edit,
    Add,
    FileDownload,
    CloudUpload,
    UploadFile,
    FileUpload,
    TableChart,
} from "@mui/icons-material";
import API from "../../services/api";

const InventoryTools = () => {
    const [offices, setOffices] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [year, setYear] = useState(new Date().getFullYear());
    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        office: "",
        item_id: "",
        quantity: 1,
        remarks: "Perfect",
    });

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

    // Open modal for adding or editing inventory
    const handleOpenModal = (inventoryItem = null) => {
        if (inventoryItem) {
            setIsEditing(true);
            setFormData({
                id: inventoryItem.id,
                office: inventoryItem.office || "",
                item_id: inventoryItem.item_id || "",
                quantity: inventoryItem.quantity || 1,
                remarks: inventoryItem.remarks || "Perfect",
            });
        } else {
            setIsEditing(false);
            setFormData({
                id: null,
                office: "",
                item_id: "",
                quantity: 1,
                remarks: "Perfect",
            });
        }
        setOpenModal(true);
    };

    const handleTemplateDownload = async () => {
        if (!selectedOffice) {
            alert("Please select an office.");
            return;
        }

        try {
            setIsLoading(true);
            const response = await API.get(`/api/template/${selectedOffice}/`, {
                responseType: "blob",
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

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

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

    const handleExport = async () => {
        if (!selectedOffice) {
            alert("Please select an office.");
            return;
        }

        try {
            setIsLoading(true);
            const response = await API.get(`/api/export/?office_id=${selectedOffice}`, {
                responseType: "blob",
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

    const handleBroadsheet = async () => {
        if (!year) {
            alert("Please specify a year.");
            return;
        }

        try {
            setIsLoading(true);
            const response = await API.get(`/api/broadsheet/?year=${year}`, {
                responseType: "blob",
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
            <Typography
                variant="subtitle2"
                gutterBottom
                style={{
                    textAlign: 'center',           // Center alignment
                    textTransform: 'capitalize',    // Uppercase text
                    letterSpacing: '3px',          // Spaced out characters
                    fontSize: '1rem',            // Adjusted font size (you can tweak this value as needed)
                    fontFamily: '"Roboto", sans-serif', // Custom font (Roboto is just an example)
                    fontWeight: 'bold',
                    fontStyle: 'italic',           // Bold font weight
                    marginTop: '50px',
                }}
            >
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
            <Box sx={{ marginTop: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FileDownload />}
                    onClick={handleTemplateDownload}
                    disabled={isLoading}
                    sx={{
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        borderRadius: "8px",
                        height: "40px",
                    }}
                >
                    Template
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<CloudUpload />}
                    component="label"
                    disabled={isLoading}
                    sx={{
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        borderRadius: "8px",
                        height: "40px",
                    }}
                >
                    Import
                    <input
                        type="file"
                        hidden
                        onChange={handleFileChange}
                    />
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<UploadFile />}
                    onClick={handleImport}
                    disabled={!selectedFile || isLoading}
                    sx={{
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        borderRadius: "8px",
                        height: "40px",
                    }}
                >
                    Upload
                </Button>
                <Button
                    variant="contained"
                    color="info"
                    startIcon={<FileUpload />}
                    onClick={handleExport}
                    disabled={isLoading}
                    sx={{
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        borderRadius: "8px",
                        height: "40px",
                    }}
                >
                    Export
                </Button>
            </Box>
            <Box sx={{ marginTop: 4, display: "flex", alignItems: "center", gap: 2 }}>
                <TextField
                    label="Year for Broadsheet"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    margin="dense"
                    sx={{ flex: 1 }}
                />
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<TableChart />}
                    onClick={handleBroadsheet}
                    disabled={isLoading}
                    sx={{
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        borderRadius: "8px",
                        height: "40px",
                    }}
                >
                    Broadsheet
                </Button>
                {isLoading && <CircularProgress />}
            </Box>
        </Box>
    );
};

export default InventoryTools;
