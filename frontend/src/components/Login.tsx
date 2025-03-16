import { useState } from "react";
import { TextField, Button, Container, Alert, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../context/AuthContext";

interface LoginFormInputs {
  username: string;
  password: string;
}

const loginSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: { username: string; password: string }) => {
    setLoading(true);
    setErrorMessage(null); // Reset error message on new attempt

    try {
      await login(data.username, data.password);
    } catch (error) {
      setErrorMessage("Invalid username or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </form>
    </Container>
  );
};

export default LoginForm;
