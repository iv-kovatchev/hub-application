import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Container, TextField, Button, CircularProgress, Alert } from "@mui/material";
import { schemaValidation } from "./schemaValidation";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { UserRegister } from "../../api/auth";

const Register = () => {
    const { register: registerUser } = useAuth(); // ✅ Use register function from AuthContext
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<UserRegister>({
        resolver: yupResolver(schemaValidation),
    });

    const onSubmit = async (data: UserRegister) => {
        setLoading(true);
        setErrorMessage(null); // Reset error message on new attempt

        try {
            await registerUser(data);
            console.log("Registration successful!");
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    label="Username"
                    fullWidth
                    margin="normal"
                    {...register("username")}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                />

                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />

                <TextField
                    label="First Name"
                    fullWidth
                    margin="normal"
                    {...register("firstname")}
                    error={!!errors.firstname}
                    helperText={errors.firstname?.message}
                />

                <TextField
                    label="Last Name"
                    fullWidth
                    margin="normal"
                    {...register("lastname")}
                    error={!!errors.lastname}
                    helperText={errors.lastname?.message}
                />

                <TextField
                    label="Location"
                    fullWidth
                    margin="normal"
                    {...register("location")}
                    error={!!errors.location}
                    helperText={errors.location?.message}
                />

                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
                </Button>
            </form>
        </Container>
    );
};

export default Register;