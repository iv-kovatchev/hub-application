import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from "@mui/material";

interface BanDialogProps {
    title: string,
    description: string,
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    banning: boolean;
}

const BanDialog = ({ title, description, open, onCancel, onConfirm, banning }: BanDialogProps) => {
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
                <Button onClick={onConfirm} color="error" variant="contained" disabled={banning}>
                    {banning ? "Banning..." : "Ban"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default BanDialog;