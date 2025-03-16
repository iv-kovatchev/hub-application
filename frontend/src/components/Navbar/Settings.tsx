import { Avatar, Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

interface SettingsProps {
    settings: string[]
}

const Settings = ({ settings }: SettingsProps) => {
  const { logout } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

    return (
        <>
            <Box sx={{ flexGrow: 0 }}>
                <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{
                        p: 0,
                        outline: "none",
                        border: "none",
                        "&:focus": { outline: "none" },
                        "&:hover": { backgroundColor: "transparent" },
                    }}
                >
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
                <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                >
                    {settings.map((setting) => (
                        <MenuItem key={setting} onClick={handleCloseUserMenu}>
                            <Typography
                                sx={{
                                    textAlign: 'center',
                                    color: "black",
                                    "&:hover": { color: "black" }
                                }}
                                onClick={() => {
                                    setting == 'Logout' ? logout() : '/'
                                }}
                            >
                                {setting}
                            </Typography>
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
        </>
    )
}

export default Settings;