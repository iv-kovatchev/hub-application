import { TableContainer, Table, TableHead, TableCell, TableRow, TableBody, Paper, Avatar, Container, Box, CircularProgress, Typography, Alert, Button } from "@mui/material";
import { useAuth } from "../../../context/AuthContext";
import { useUsers } from "./useUsers";
import BanDialog from "../../../components/BanDialog/BanDialog";

const Users = () => {
    const { user } = useAuth();

    const {
        users,
        loading,
        error,
        handleBan
    } = useUsers();

    return (
        <>
            <Container maxWidth="lg">
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Welcome, {user}!
                        </Typography>

                        <Typography variant="h6" sx={{ mt: 2 }}>
                            All Users:
                        </Typography>

                        <TableContainer sx={{ mt: 2 }} component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align='left'></TableCell>
                                        <TableCell align="left">Username</TableCell>
                                        <TableCell align="left">First name</TableCell>
                                        <TableCell align="center">Last name</TableCell>
                                        <TableCell align="center">Location</TableCell>
                                        <TableCell align="right"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((u) => (
                                        <TableRow
                                            key={u.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row" sx={{ width: 56 }}>
                                                <Avatar
                                                    alt="Remy Sharp"
                                                    src="/images/avatar/2.jpg" />
                                            </TableCell>
                                            <TableCell align="left">{u.username}</TableCell>
                                            <TableCell align="left">{u.firstName}</TableCell>
                                            <TableCell align="left">{u.lastName}</TableCell>
                                            <TableCell align="left">{u.location}</TableCell>
                                            <TableCell align="right">
                                                <Box>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleBan(ch)}
                                                    >Ban</Button>

                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </Container>

            <BanDialog
                title="Ban User"
                description="Are you sure you want to ban this user?"
                open={openBanModal}
                onConfirm={confirmBan}
                onCancel={closeBanModal}
                banning={banning}
            />
        </>
    );
};

export default Users;
