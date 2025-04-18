import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from "@mui/material";

interface DeleteDialogProps {
    title: string,
    description: string,
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    deleting: boolean;
}

const DeleteDialog = ({ title, description, open, onCancel, onConfirm, deleting }: DeleteDialogProps) => {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography>
                    {description}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="inherit">Cancel</Button>
                <Button onClick={onConfirm} color="error" variant="contained" disabled={deleting}>
                    {deleting ? "Deleting..." : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteDialog;