import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { uploadImage } from "../../api/uploadImage";
import { useEffect, useState } from "react";
import { ChannelResponse } from "../../api/channel";

export interface ChannelFormData {
    name: string,
    description?: string | null
    imageUrl?: string | null
}

interface ChannelDialogProps {
    open: boolean;
    onClose: () => void;
    onCreate: (data: ChannelFormData) => void;
    channel?: ChannelResponse | null,
    title: string
}

export const createChannelSchema = yup.object({
    name: yup.string().required("Name is required").max(100),
    description: yup.string().max(255).nullable(),
    imageUrl: yup.string().url("Must be a valid URL").nullable(),
});

const ChannelDialog = ({ open, onClose, onCreate, channel, title }: ChannelDialogProps) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(createChannelSchema)
    });

    useEffect(() => {
        reset({
            name: channel?.name || "",
            description: channel?.description || "",
            //imageUrl: channel?.imageUrl || "",
        });
        setSelectedFile(null);
    }, [channel, reset]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setSelectedFile(file);
        }
    }

    const onSubmit = async (data: ChannelFormData) => {
        setErrorMessage(null);
        setUploading(true);

        try {
            let imageUrl = data.imageUrl;

            if (selectedFile) {
                const uploadedUrl = await uploadImage(selectedFile, "channels");
                if (!uploadedUrl) throw new Error("Image upload failed.");
                imageUrl = uploadedUrl;
            }

            await onCreate({ ...data, imageUrl });
            reset();
            setSelectedFile(null);
        } catch (error: any) {
            const message = error?.message || "Something went wrong";
            setErrorMessage(message);
        }
        finally {
            setUploading(false);
        }
    };

    const closeDialog = () => {
        reset();
        onClose();
        setSelectedFile(null);
        setErrorMessage(null);
    }


    return (
        <Dialog open={open} onClose={onClose} fullWidth>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>{title} Channel</DialogTitle>

                <DialogContent>
                    {errorMessage && <Alert severity="error" sx={{ mb: 4 }}>{errorMessage}</Alert>}

                    {uploading && (
                        <Box display="flex" justifyContent="center" alignItems="center" my={2}>
                            <Typography variant="body2" color="text.secondary" mr={1}>
                                Uploading image...
                            </Typography>
                            <CircularProgress size={20} />
                        </Box>
                    )}

                    <Box display="flex" flexDirection="column" gap={2} mt={1}>
                        <TextField
                            label="Name"
                            {...register("name")}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            fullWidth
                        />
                        <TextField
                            label="Description"
                            {...register("description")}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            fullWidth
                            multiline
                            rows={2}
                        />

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ marginTop: 16 }}
                        />
                        {selectedFile ? (
                            <Box mt={2}>
                                <img
                                    src={URL.createObjectURL(selectedFile)}
                                    alt="Preview"
                                    style={{ maxWidth: "100%", height: "auto", borderRadius: 8 }}
                                />
                            </Box>
                        ) : channel?.imageUrl ? (
                            <Box mt={2}>
                                <img
                                    src={`${import.meta.env.VITE_BASE_URL}${channel.imageUrl}`}
                                    alt="Channel"
                                    style={{ maxWidth: "100%", height: "auto", borderRadius: 8 }}
                                />

                            </Box>
                        ) : null}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="inherit" type="button">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained">
                        {title}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default ChannelDialog;