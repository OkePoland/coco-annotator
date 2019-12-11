import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import MuiTableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { useStyles } from './adminPanel.styles';
import { columns } from './adminTable.config';
import { TableData } from './adminPanel.hooks';
import TableCell from './TableCell';

interface AdminTableProps {
    rows: TableData[];
    deleteUser: (user: TableData) => Promise<void>;
}

const AdminTable: React.FC<AdminTableProps> = ({ rows, deleteUser }) => {
    const classes = useStyles();

    return (
        <Table stickyHeader padding="none">
            <TableHead>
                <TableRow>
                    {columns.map(column => (
                        <MuiTableCell
                            className={classes.tableHead}
                            key={column.id}
                            align="center"
                        >
                            {column.label}
                        </MuiTableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map(row => (
                    <TableRow hover key={row.username}>
                        {columns.map(column => (
                            <TableCell
                                key={`${row.username}${column.id}`}
                                column={column}
                                row={row}
                                classes={classes.iconButton}
                                deleteUser={deleteUser}
                            />
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default AdminTable;
