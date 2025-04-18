
import LanIcon from '@mui/icons-material/Lan';
import {
    Avatar,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';

import { ChannelResponse } from '../../api/channel';
import { useNavigate } from 'react-router-dom';

interface ChannelsTableProps {
    channels: ChannelResponse[]
}

const ChannelsTable = ({ channels }: ChannelsTableProps) => {
    const navigate = useNavigate();

    const handleConnect = (channel: ChannelResponse) => {
        navigate("/channels/connected", { state: { channel } });
    };

    return (
        <>
            <TableContainer sx={{ mt: 2 }} component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align='left'></TableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Description</TableCell>
                            <TableCell align="center">Owner</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {channels.map((ch) => (
                            <TableRow
                                key={ch.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" sx={{ width: 56 }}>
                                    <Avatar
                                        alt="Remy Sharp"
                                        src={ch.imageUrl
                                            ? `${import.meta.env.VITE_BASE_URL}${ch.imageUrl}`
                                            : "/images/avatar/2.jpg"} />
                                </TableCell>
                                <TableCell align="left">{ch.name}</TableCell>
                                <TableCell align="left">
                                    {ch.description && ch.description.length > 50
                                        ? ch.description.slice(0, 50) + "..."
                                        : ch.description}
                                </TableCell>
                                <TableCell align="center">{ch.createdByUserName}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<LanIcon />}
                                        onClick={() => handleConnect(ch)}
                                    >
                                        Connect
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default ChannelsTable;