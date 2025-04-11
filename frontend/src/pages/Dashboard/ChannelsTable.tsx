
import LanIcon from '@mui/icons-material/Lan';
import {
    Avatar,
    Button,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';

import { ChannelResponse } from '../../api/channel';

interface ChannelsTableProps {
    channels: ChannelResponse[]
}

const ChannelsTable = ({ channels }: ChannelsTableProps) => {
    return (
        <>
            <TableContainer sx={{ mt: 2 }} component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align='left'></TableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Description</TableCell>
                            <TableCell align="center">Created by</TableCell>
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
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                                </TableCell>
                                <TableCell align="left">{ch.name}</TableCell>
                                <TableCell align="left">
                                    {ch.description && ch.description.length > 50
                                        ? ch.description.slice(0, 50) + "..."
                                        : ch.description}
                                </TableCell>
                                <TableCell align="center">{ch.createdByUserName}</TableCell>
                                <TableCell align="right">
                                    <Button variant="outlined" size="small" startIcon={<LanIcon />}>
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