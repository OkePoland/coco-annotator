import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { SingleStat } from './statistics.hooks';

interface Props {
    title: string;
    data: SingleStat;
}

const StatsCard: React.FC<Props> = ({ title, data }) => (
    <Paper>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell component="th">
                        <b>{title}</b>
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {Object.entries(data).map(([key, value]) => (
                    <TableRow key={key}>
                        <TableCell component="th" scope="row">
                            {key}
                        </TableCell>
                        <TableCell>{value.toFixed(0)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </Paper>
);
export default StatsCard;
