import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material"
import HubIcon from "@mui/icons-material/Hub";
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import { Link } from "react-router-dom";

interface MobileMenuProps {
    pages: string[],
    userRole: string | null
}

const MobileMenu = ({ pages, userRole }: MobileMenuProps) => {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [adminAnchorEl, setAdminAnchorEl] = useState<null | HTMLElement>(null);

    const isAdminMenuOpen = Boolean(adminAnchorEl);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleAdminMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAdminAnchorEl(event.currentTarget);
    };

    const handleAdminMenuClose = () => {
        setAdminAnchorEl(null);
        setAnchorElNav(null);
    };

    return (
        <>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                    sx={{
                        outline: "none",
                        "&:focus": { outline: "none" },
                        "&:focus-visible": { outline: "none" }
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{ display: { xs: 'block', md: 'none' } }}
                >
                    {pages.map((page) => (
                        <MenuItem key={page} onClick={handleCloseNavMenu} component={Link} to={page.toLowerCase().replace(/\s+/g, "-")} >
                            <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                        </MenuItem>
                    ))}

                    {userRole === "Admin" && (
                        <MenuItem onClick={handleAdminMenuOpen}>
                            <Typography textAlign="center">Admin</Typography>
                        </MenuItem>
                    )}
                </Menu>

                <Menu
                    anchorEl={adminAnchorEl}
                    open={isAdminMenuOpen}
                    onClose={handleAdminMenuClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                >
                    <MenuItem component={Link} to="/admin/users" onClick={handleAdminMenuClose}>
                        Users
                    </MenuItem>
                    <MenuItem component={Link} to="/admin/channels" onClick={handleAdminMenuClose}>
                        Channels
                    </MenuItem>
                </Menu>
            </Box>
            <HubIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
                variant="h6"
                noWrap
                component={Link}
                to="/dashboard"
                sx={{
                    mr: 2,
                    display: { xs: 'flex', md: 'none' },
                    flexGrow: 1,
                    fontWeight: 700,
                    color: 'inherit',
                    letterSpacing: '.3rem',
                    "&:hover": {
                        color: "white"
                    }
                }}
            >
                TRINITY
            </Typography>
        </>
    )
}

export default MobileMenu;
