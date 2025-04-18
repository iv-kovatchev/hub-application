import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useState } from 'react';

import AppRoutes from "./Routes";
import Navbar from "./components/Navbar/Navbar";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },

    typography: {
      fontFamily: `"Fira Code", "Courier New", monospace`,
    },
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Box sx={{ width: "100vw", display: "flex", flexDirection: "column", mt: "72px", mb: "48px" }}>
        <AppRoutes />
      </Box>
    </ThemeProvider>

  )
}

export default App
