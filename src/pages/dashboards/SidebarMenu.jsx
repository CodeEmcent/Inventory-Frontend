import React from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import InventoryIcon from "@mui/icons-material/Inventory";
import AssessmentIcon from "@mui/icons-material/Assessment";

const SidebarMenu = ({ role, setCurrentSection, isSidebarOpen }) => {
    const menuItems = [
        { label: "Dashboard", icon: <DashboardIcon />, section: "reports" },
        { label: "User Management", icon: <PeopleIcon />, section: "userManagement", roles: ["admin", "super_admin"] },
        { label: "Office Management", icon: <BusinessIcon />, section: "officeManagement", roles: ["admin", "super_admin"] },
        { label: "Item Register", icon: <InventoryIcon />, section: "itemRegister", roles: ["admin", "super_admin"] },
        { label: "Inventory Management", icon: <AssessmentIcon />, section: "inventory", roles: ["admin", "super_admin"] },
    ];

    return (
        <List>
            {menuItems.map(
                (item) =>
                    (!item.roles || item.roles.includes(role)) && (
                        <ListItem
                            button
                            onClick={() => setCurrentSection(item.section)}
                            sx={{
                                "&:hover": { backgroundColor: "#FFF", color: "#2151a2" },
                                color: "#FFFFFF",
                                cursor: "pointer",
                            }}
                            key={item.label}
                        >
                            {/* Show icon only when sidebar is collapsed */}
                            <ListItemIcon
                                sx={{
                                    color: "inherit",
                                    "&:hover": { color: "#2151a2" },
                                    minWidth: isSidebarOpen ? undefined : 40, // Adjust minWidth for collapsed state
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>

                            {/* Show label only when sidebar is expanded */}
                            {isSidebarOpen && (
                                <ListItemText primary={item.label} sx={{ "&:hover": { color: "#2151a2" } }} />
                            )}
                        </ListItem>
                    )
            )}
        </List>
    );
};

export default SidebarMenu;
