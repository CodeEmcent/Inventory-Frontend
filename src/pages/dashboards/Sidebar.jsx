import React from "react";
import { Drawer, List, ListItem, ListItemText } from "@mui/material";

const Sidebar = ({ setCurrentSection, role }) => {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 240,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
            }}
        >
            <List>
                {/* Inventory Management */}
                <ListItem button={true} onClick={() => setCurrentSection("inventory")}>
                    <ListItemText primary="Inventory Management" />
                </ListItem>

                {/* User Management and Reports */}
                {["super_admin", "admin"].includes(role) && (
                    <>
                        <ListItem button onClick={() => setCurrentSection("userManagement")}>
                            <ListItemText primary="User Management" />
                        </ListItem>
                        <ListItem button onClick={() => setCurrentSection("officeManagement")}>
                            <ListItemText primary="Office Management" />
                        </ListItem>
                        <ListItem button onClick={() => setCurrentSection("itemRegistry")}>
                            <ListItemText primary="Item Registry" />
                        </ListItem>
                        <ListItem button onClick={() => setCurrentSection("reports")}>
                            <ListItemText primary="Reports" />
                        </ListItem>
                    </>
                )}
            </List>
        </Drawer>
    );
};

export default Sidebar;
