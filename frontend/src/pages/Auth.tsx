import { Box, Container, Typography } from "@mui/material";
import Login from "../components/Login";
import Register from "../components/RegisterForm/Register";
import { useState } from "react";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Container maxWidth="sm">

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // ✅ Full viewport height for vertical centering
        }}
      >
        <Box
          sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
            bgcolor: "background.paper",
            width: "100%", // ✅ Ensures proper width inside the container
            maxWidth: 400,
            textAlign: "center", // ✅ Prevents it from being too wide
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            {isLogin ? "Login" : "Register"}
          </Typography>

          {isLogin ? <Login /> : <Register />}

          <Typography align="center" sx={{ mt: 2 }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Typography
              component="span"
              sx={{
                cursor: "pointer",
                textDecoration: "underline",
                color: "primary.main",
                "&:hover": { color: "primary.dark" } // Changes color on hover
              }}
              onClick={() => setIsLogin((prev) => !prev)} // ✅ Toggles login/register
            >
              {isLogin ? "Register" : "Login"}
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Auth;