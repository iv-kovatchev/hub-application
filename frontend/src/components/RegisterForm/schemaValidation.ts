import * as yup from "yup";

// ✅ Validation Schema using Yup
export const schemaValidation = yup.object().shape({
    username: yup.string()
        .required("Username is required")
        .matches(/^[a-zA-Z0-9]+$/, "Only letters and numbers allowed")
        .min(4, "Username must be at least 4 characters")
        .max(100, "Username cannot exceed 100 characters"),
    password: yup.string()    
     .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(50, "Password cannot exceed 50 characters")
        .matches(/[A-Z]/, "Must include at least one uppercase letter")
        .matches(/[a-z]/, "Must include at least one lowercase letter")
        .matches(/\d/, "Must include at least one number")
        .matches(/[\W_]/, "Must include at least one symbol"),
    firstname: yup.string()
        .max(100, "First name cannot exceed 100 characters")
        .optional(),
    lastname: yup.string()
        .max(100, "Last name cannot exceed 100 characters")
        .optional(),
    location: yup.string()
        .max(100, "Location cannot exceed 100 characters")
        .optional(),
});