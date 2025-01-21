import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    Chip,
    CircularProgress,
    Typography,
    Tooltip, // Import Tooltip
    IconButton,
    Snackbar,
    SnackbarContent,
} from "@mui/material";
import API from "../../services/api";
import { Edit, Delete } from "@mui/icons-material"; // Import icons
import "react-toastify/dist/ReactToastify.css";

const AssignOffices = ({ open, onClose }) => {
    const [staffUsers, setStaffUsers] = useState([]);
    const [offices, setOffices] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [assignedOffices, setAssignedOffices] = useState([]);
    const [newOffices, setNewOffices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    // Fetch all staff users
    const fetchStaffUsers = async () => {
        try {
            const response = await API.get("/api/users/all-staff/");
            const users = response.data.users || [];
            setStaffUsers(users);
        } catch (error) {
            console.error("Error fetching staff users:", error);
        }
    };

    // Fetch all offices
    const fetchOffices = async () => {
        try {
            const response = await API.get("/api/offices/");
            setOffices(response.data);
        } catch (error) {
            console.error("Error fetching offices:", error);
        }
    };

    // Fetch assigned offices for the selected user
    const fetchAssignedOffices = async (userId) => {
        try {
            const response = await API.get(`/api/users/assign-offices/${userId}/`);
            setAssignedOffices(response.data.assigned_offices || []);
        } catch (error) {
            console.error("Error fetching assigned offices:", error);
        }
    };

    // Fetch available offices for assignment (only offices not already assigned)
    const getAvailableOffices = () => {
        return offices.filter(
            (office) =>
                !assignedOffices.some((assigned) => assigned.id === office.id) &&
                !staffUsers.some((user) =>
                    user.assigned_offices.some((assigned) => assigned.id === office.id)
                )
        );
    };

    useEffect(() => {
        if (open) {
            fetchStaffUsers();
            fetchOffices();
        }
    }, [open]);

    // Handle user selection
    const handleUserChange = (userId) => {
        setSelectedUser(userId);
        fetchAssignedOffices(userId);
        setNewOffices([]);
    };

    // Handle office selection
    const handleOfficeChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewOffices(typeof value === "string" ? value.split(",") : value);
    };

    // Assign new offices to the user
    const handleAssignOffices = async () => {
        if (!selectedUser || newOffices.length === 0) {
            setSnackbarMessage("Please select a user and at least one office.");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            return;
        }

        setLoading(true);
        try {
            const response = await API.post(`/api/users/assign-offices/${selectedUser}/`, {
                assigned_offices: newOffices,
            });

            setSnackbarMessage("Successfully assigned Office(s).");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);

            fetchAssignedOffices(selectedUser);
            setNewOffices([]);
            onClose();
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || error.message || "Failed to assign offices.";
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleReassignOffice = (officeId) => {
        const newUser = prompt("Enter the new user ID for this office:");

        if (newUser) {
            // Call API to reassign the office to the new user
            console.log(`Reassigning office ID ${officeId} to user ID ${newUser}`);
            setSnackbarMessage("Office reassigned successfully.");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        }
    };

    const handleRemoveAssignment = (officeId) => {
        const confirmRemove = window.confirm(
            "Are you sure you want to remove this office assignment?"
        );

        if (confirmRemove) {
            // Call API to remove office assignment
            console.log(`Removing office assignment for office ID ${officeId}`);
            setSnackbarMessage("Office assignment removed.");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
                <DialogTitle>Assign Offices to Staff</DialogTitle>
                <DialogContent>
                    {/* Select Staff */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Select Staff User</InputLabel>
                        <Select
                            value={selectedUser}
                            onChange={(e) => handleUserChange(e.target.value)}
                        >
                            {staffUsers.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.username} ({user.first_name} {user.last_name})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Select Offices */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Select Offices</InputLabel>
                        <Tooltip
                            title="You can select multiple offices. Add more offices by clicking again."
                            placement="top"
                            arrow
                        >
                            <Select
                                multiple
                                value={newOffices}
                                onChange={handleOfficeChange}
                                input={<OutlinedInput label="Select Offices" />}
                                renderValue={(selected) =>
                                    selected.map((id) => {
                                        const office = offices.find((o) => o.id === id);
                                        return (
                                            <Chip
                                                key={id}
                                                label={office ? office.name : "Unknown"}
                                            />
                                        );
                                    })
                                }
                            >
                                {getAvailableOffices().map((office) => (
                                    <MenuItem key={office.id} value={office.id}>
                                        {office.name} ({office.department})
                                    </MenuItem>
                                ))}
                            </Select>
                        </Tooltip>
                    </FormControl>

                    {/* Currently Assigned Offices */}
                    <Box sx={{ marginTop: 2 }}>
                        <Typography variant="h6">Currently Assigned Offices:</Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1,
                                marginTop: 1,
                                padding: "8px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                minHeight: "50px",
                            }}
                        >
                            {assignedOffices.length > 0 ? (
                                assignedOffices.map((office) => (
                                    <Box key={office.id} sx={{ display: "flex", alignItems: "center" }}>
                                        <Chip
                                            label={`${office.name} (${office.department})`}
                                            color="primary"
                                            sx={{ marginRight: 1 }}
                                        />
                                        {/* Reassign Icon Button with Tooltip */}
                                        <Tooltip title="Reassign Office" placement="top">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleReassignOffice(office.id)}
                                            >
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        {/* Remove Icon Button with Tooltip */}
                                        <Tooltip title="Remove Office Assignment" placement="top">
                                            <IconButton
                                                color="error"
                                                onClick={() => handleRemoveAssignment(office.id)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2" color="textSecondary">
                                    No offices currently assigned.
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAssignOffices}
                        disabled={loading || !selectedUser || newOffices.length === 0}
                    >
                        {loading ? <CircularProgress size={24} /> : "Assign Offices"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
            >
                <SnackbarContent
                    message={snackbarMessage}
                    style={{
                        backgroundColor:
                            snackbarSeverity === "success"
                                ? "green"
                                : snackbarSeverity === "error"
                                ? "red"
                                : snackbarSeverity === "warning"
                                ? "orange"
                                : "blue",
                    }}
                />
            </Snackbar>
        </Box>
    );
};

export default AssignOffices;




// import React, { useState, useEffect } from "react";
// import {
//     Box,
//     Button,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     FormControl,
//     InputLabel,
//     Select,
//     MenuItem,
//     OutlinedInput,
//     Chip,
//     CircularProgress,
//     Typography,
//     Tooltip,
//     Snackbar,
//     SnackbarContent,
// } from "@mui/material";
// import API from "../../services/api";

// const AssignOffices = ({ open, onClose }) => {
//     const [staffUsers, setStaffUsers] = useState([]);
//     const [offices, setOffices] = useState([]);
//     const [selectedUser, setSelectedUser] = useState("");
//     const [assignedOffices, setAssignedOffices] = useState([]);
//     const [newOffices, setNewOffices] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [snackbarOpen, setSnackbarOpen] = useState(false);
//     const [snackbarMessage, setSnackbarMessage] = useState("");
//     const [snackbarSeverity, setSnackbarSeverity] = useState("success");

//     // Normalize office names (convert to lowercase and trim spaces)
//     const normalizeOfficeName = (officeName) => {
//         return officeName.toLowerCase().replace(/\s+/g, " ").trim();
//     };

//     // Fetch all staff users
//     const fetchStaffUsers = async () => {
//         try {
//             const response = await API.get("/api/users/all-staff/");
//             const users = response.data.users || [];
//             setStaffUsers(users);
//         } catch (error) {
//             console.error("Error fetching staff users:", error);
//         }
//     };

//     // Fetch all offices
//     const fetchOffices = async () => {
//         try {
//             const response = await API.get("/api/offices/");
//             setOffices(response.data);
//         } catch (error) {
//             console.error("Error fetching offices:", error);
//         }
//     };

//     // Fetch assigned offices for the selected user
//     const fetchAssignedOffices = async (userId) => {
//         try {
//             const response = await API.get(`/api/users/assign-offices/${userId}/`);
//             setAssignedOffices(response.data.assigned_offices || []);
//         } catch (error) {
//             console.error("Error fetching assigned offices:", error);
//         }
//     };

//     // Fetch available offices for assignment (only offices not already assigned)
//     const getAvailableOffices = () => {
//         return offices.filter(
//             (office) =>
//                 !assignedOffices.some((assigned) => assigned.id === office.id) &&
//                 !staffUsers.some((user) =>
//                     user.assigned_offices.some((assigned) => assigned.id === office.id)
//                 )
//         );
//     };

//     useEffect(() => {
//         if (open) {
//             fetchStaffUsers();
//             fetchOffices();
//         }
//     }, [open]);

//     // Handle user selection
//     const handleUserChange = (userId) => {
//         setSelectedUser(userId);
//         fetchAssignedOffices(userId);
//         setNewOffices([]);
//     };

//     // Handle office selection and prevent duplicates
//     const handleOfficeChange = (event) => {
//         const {
//             target: { value },
//         } = event;

//         // Normalize the selected offices and check for duplicates
//         const normalizedSelectedOffices = value.map((officeId) => {
//             const office = offices.find((o) => o.id === officeId);
//             return office ? normalizeOfficeName(office.name) : null;
//         });

//         // Filter out duplicates
//         const uniqueOffices = [...new Set(normalizedSelectedOffices)];
//         setNewOffices(
//             uniqueOffices
//                 .map((normalizedName) => {
//                     return offices.find((office) =>
//                         normalizeOfficeName(office.name) === normalizedName
//                     )?.id;
//                 })
//                 .filter(Boolean)
//         );
//     };

//     // Handle snackbar close
//     const handleSnackbarClose = () => {
//         setSnackbarOpen(false);
//     };

//     // Assign new offices to the user
//     const handleAssignOffices = async () => {
//         if (!selectedUser || newOffices.length === 0) {
//             setSnackbarMessage("Please select a user and at least one office.");
//             setSnackbarSeverity("warning");
//             setSnackbarOpen(true);
//             return;
//         }

//         setLoading(true);
//         try {
//             const response = await API.post(`/api/users/assign-offices/${selectedUser}/`, {
//                 assigned_offices: newOffices,
//             });

//             setSnackbarMessage("Successfully assigned Office(s)");
//             setSnackbarSeverity("success");
//             setSnackbarOpen(true);

//             fetchAssignedOffices(selectedUser);
//             setNewOffices([]);
//             onClose();
//         } catch (error) {
//             const errorMessage =
//                 error.response?.data?.message || error.message || "Failed to assign offices.";
//             setSnackbarMessage(errorMessage);
//             setSnackbarSeverity("error");
//             setSnackbarOpen(true);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Box>
//             <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
//                 <DialogTitle>Assign Offices to Staff</DialogTitle>
//                 <DialogContent>
//                     {/* Select Staff */}
//                     <FormControl fullWidth margin="normal">
//                         <InputLabel>Select Staff User</InputLabel>
//                         <Select
//                             value={selectedUser}
//                             onChange={(e) => handleUserChange(e.target.value)}
//                         >
//                             {staffUsers.map((user) => (
//                                 <MenuItem key={user.id} value={user.id}>
//                                     {user.username} ({user.first_name} {user.last_name})
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>

//                     {/* Select Offices */}
//                     <FormControl fullWidth margin="normal">
//                         <InputLabel>Select Offices</InputLabel>
//                         <Tooltip
//                             title="You can select multiple offices. Add more offices by clicking again."
//                             placement="top"
//                             arrow
//                         >
//                             <Select
//                                 multiple
//                                 value={newOffices}
//                                 onChange={handleOfficeChange}
//                                 input={<OutlinedInput label="Select Offices" />}
//                                 renderValue={(selected) =>
//                                     selected.map((id) => {
//                                         const office = offices.find((o) => o.id === id);
//                                         return (
//                                             <Chip
//                                                 key={id}
//                                                 label={office ? office.name : "Unknown"}
//                                             />
//                                         );
//                                     })
//                                 }
//                             >
//                                 {getAvailableOffices().map((office) => (
//                                     <MenuItem key={office.id} value={office.id}>
//                                         {office.name} ({office.department})
//                                     </MenuItem>
//                                 ))}
//                             </Select>
//                         </Tooltip>
//                     </FormControl>

//                     {/* Currently Assigned Offices */}
//                     <Box sx={{ marginTop: 2 }}>
//                         <Typography variant="h6">Currently Assigned Offices:</Typography>
//                         <Box
//                             sx={{
//                                 display: "flex",
//                                 flexWrap: "wrap",
//                                 gap: 1,
//                                 marginTop: 1,
//                                 padding: "8px",
//                                 border: "1px solid #ccc",
//                                 borderRadius: "4px",
//                                 minHeight: "50px",
//                             }}
//                         >
//                             {assignedOffices.length > 0 ? (
//                                 assignedOffices.map((office) => (
//                                     <Chip
//                                         key={office.id}
//                                         label={`${office.name} (${office.department})`}
//                                         color="primary"
//                                     />
//                                 ))
//                             ) : (
//                                 <Typography variant="body2" color="textSecondary">
//                                     No offices currently assigned.
//                                 </Typography>
//                             )}
//                         </Box>
//                     </Box>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={onClose} color="secondary">
//                         Cancel
//                     </Button>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={handleAssignOffices}
//                         disabled={loading || !selectedUser || newOffices.length === 0}
//                     >
//                         {loading ? <CircularProgress size={24} /> : "Assign Offices"}
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Snackbar for notifications */}
//             <Snackbar
//                 open={snackbarOpen}
//                 autoHideDuration={5000}
//                 onClose={handleSnackbarClose}
//             >
//                 <SnackbarContent
//                     message={snackbarMessage}
//                     style={{
//                         backgroundColor:
//                             snackbarSeverity === "success"
//                                 ? "green"
//                                 : snackbarSeverity === "error"
//                                 ? "red"
//                                 : snackbarSeverity === "warning"
//                                 ? "orange"
//                                 : "blue",
//                     }}
//                 />
//             </Snackbar>
//         </Box>
//     );
// };

// export default AssignOffices;
