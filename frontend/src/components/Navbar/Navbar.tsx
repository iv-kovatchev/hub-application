import { AppBar, Box, Button, IconButton, Toolbar } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import { Link } from "react-router-dom";
import Settings from "./Settings";
import { useAuth } from "../../context/AuthContext";

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const pages = ['Dashboard'];
const settings = ['Settings', 'Logout'];

const Navbar = ({ darkMode, toggleDarkMode }: NavbarProps) => {
  const { user, userRole } = useAuth();

  return (
    <AppBar position="fixed" sx={{ width: "100%", zIndex: 1100 }}>
      <Toolbar>
        <Logo />

        {/*Mobile menu */}
        {user && <MobileMenu pages={pages} />}

        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {user && pages.map((page) => (
            <Button
              key={page}
              component={Link as any}
              to={page.toLowerCase()}
              sx={{
                fontSize: 16,
                fontWeight: 700,
                my: 2,
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
              component={Link}
              to="/admin"
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
