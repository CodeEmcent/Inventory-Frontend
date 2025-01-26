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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles
import { red } from "@mui/material/colors";

const InventoryTools = ({ fetchData, role }) => {
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
                if (response.data.length === 0) {
                    toast.info("No offices assigned to you.");
                }
                setOffices(response.data);
            } catch (error) {
                console.error("Error fetching offices:", error);
                toast.error("Failed to fetch offices.");
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
            toast.error("Please select an office and a file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            setIsLoading(true);
            await API.post(`/api/import/?office_id=${selectedOffice}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Inventory imported successfully!");
            if (fetchData) fetchData();
        } catch (error) {
            console.error("Error importing inventory:", error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "An error occurred while importing the inventory.";
            toast.error(errorMessage);
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
            <ToastContainer position="top-right" autoClose={3000} />
            <Typography
                variant="subtitle2"
                gutterBottom
                style={{
                    textAlign: "center",
                    textTransform: "capitalize",
                    fontSize: "1rem",
                    fontFamily: '"Roboto", sans-serif',
                    fontWeight: "bold",
                    fontStyle: "italic",
                    marginBottom: "16px",
                    marginTop: "50px",
                    color: '#d32f2f',
                }}
            >
                Manage Your Office Inventory
            </Typography>

            {/* Flex Container */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >
                <FormControl size="small" sx={{ minWidth: 120 }}>
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
                <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<FileDownload />}
                    onClick={handleTemplateDownload}
                    disabled={isLoading}
                    // sx={{
                    //     textTransform: "uppercase",
                    //     fontWeight: "bold",
                    //     borderRadius: "8px",
                    //     height: "40px",
                    // }}
                >
                    Template
                </Button>
                <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    startIcon={<CloudUpload />}
                    component="label"
                    disabled={isLoading}
                    // sx={{
                    //     textTransform: "uppercase",
                    //     fontWeight: "bold",
                    //     borderRadius: "8px",
                    //     height: "40px",
                    // }}
                >
                    Import
                    <input type="file" hidden onChange={handleFileChange} />
                </Button>
                <Button
                    size="small"
                    variant="contained"
                    color="success"
                    startIcon={<UploadFile />}
                    onClick={handleImport}
                    disabled={!selectedFile || isLoading}
                    // sx={{
                    //     textTransform: "uppercase",
                    //     fontWeight: "bold",
                    //     borderRadius: "8px",
                    //     height: "40px",
                    // }}
                >
                    {isLoading ? <CircularProgress size={20} color="inherit" /> : "Upload"}
                </Button>
                <Button
                    size="small"
                    variant="contained"
                    color="info"
                    startIcon={<FileUpload />}
                    onClick={handleExport}
                    disabled={isLoading}
                    // sx={{
                    //     textTransform: "uppercase",
                    //     fontWeight: "bold",
                    //     borderRadius: "8px",
                    //     height: "40px",
                    // }}
                >
                    Export
                </Button>
            </Box>
            {/* Broadsheet Button (Only for Super Admin) */}
            {role === "super_admin" && (
                <Box sx={{ marginTop: 4, display: "flex", alignItems: "center", gap: 2 }}>
                    <TextField
                        size="small"
                        label="Year for Broadsheet"
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        margin="dense"
                        sx={{ flex: 1 }}
                    />
                    <Button
                        size="small"
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
            )}
        </Box>
    );
};

export default InventoryTools;
