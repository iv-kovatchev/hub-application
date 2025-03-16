import { Box, Typography } from "@mui/material";
import HubIcon from "@mui/icons-material/Hub";
import { Link } from "react-router-dom";

const Logo: React.FC = () => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
      <HubIcon sx={{ color: "white", display: { xs: 'none', md: 'flex' }, mr: 1 }} />
      <Typography
        variant="h6"
        noWrap
        component={Link}
        to="/dashboard"
        sx={{
          display: { xs: 'none', md: 'flex' },
          mr: 2,
          fontWeight: 700,
          color: 'inherit',
          letterSpacing: '.3rem',
          "&:hover": {
            color: "white"
          }
        }}>
        TRINITY
      </Typography>
    </Box>
  );
};

export default Logo;