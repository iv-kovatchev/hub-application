import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import { Link } from "react-router-dom";
import Settings from "./Settings";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const pages = ['Dashboard', 'My channels'];
const settings = ['Settings', 'Logout'];

const Navbar = ({ darkMode, toggleDarkMode }: NavbarProps) => {
  const { user, userRole } = useAuth();

  const [adminAnchorEl, setAdminAnchorEl] = useState<null | HTMLElement>(null);
  const isAdminMenuOpen = Boolean(adminAnchorEl);

  const handleAdminMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAdminAnchorEl(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAdminAnchorEl(null);
  };

  return (
    <AppBar position="fixed" sx={{ width: "100%", zIndex: 1100 }}>
      <Toolbar>
        <Logo />

        {/*Mobile menu */}
        {user && <MobileMenu pages={pages} userRole={userRole} />}

        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {user && pages.map((page) => (
            <Button
              key={page}
              component={Link as any}
              to={page.toLowerCase().replace(/\s+/g, "-")}
              sx={{
                fontSize: 16,
                fontWeight: 700,
                my: 2,
                mr: 2,
                color: "white",
                display: "block",
                "&:hover": { color: "white" }
              }}
            >
              {page}
            </Button>
          ))
          }

          {user && userRole === "Admin" && (
            <Button
              key="Admin"
              onClick={handleAdminMenuOpen}
              sx={{
                fontSize: 16,
                fontWeight: 700,
                my: 2,
                color: "white",
                display: "block",
                "&:hover": { color: "white" },
              }}
            >
              Admin
            </Button>
          )}
        </Box>

        <Menu
          anchorEl={adminAnchorEl}
          open={isAdminMenuOpen}
          onClose={handleAdminMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <MenuItem component={Link} to="/admin/users" onClick={handleAdminMenuClose}>
            Users
          </MenuItem>
          <MenuItem component={Link} to="/admin/channels" onClick={handleAdminMenuClose}>
            Channels
          </MenuItem>
        </Menu>

        {/* Right Side: Profile Image */}
        <Box sx={{ display: "flex", alignItems: "center", ml: "auto", gap: 2 }}>
          <IconButton
            color="inherit"
            onClick={() => toggleDarkMode()}
            disableRipple
            disableFocusRipple
            sx={{
              outline: "none",
              border: "none",
              "&:focus": { outline: "none" },
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>


          {/* Settings */}
          {user && <Settings settings={settings} />}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar;
