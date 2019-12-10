import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Radio from '@material-ui/core/Radio';
import IconButton from '@material-ui/core/IconButton';
import HighlightOff from '@material-ui/icons/HighlightOff';
import TableRow from '@material-ui/core/TableRow';

import { useStyles } from './adminPanel.styles';
import { columns } from './adminTable.config';
import { TableData } from './adminPanel.hooks';

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
                        <TableCell
                            className={classes.tableHead}
                            key={column.id}
                            align="center"
                        >
                            {column.label}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map(row => (
                    <TableRow hover key={row.username}>
                        {columns.map(column => (
                            <TableCell
                                align="center"
                                key={`${row.username}${column.id}`}
                            >
                                {(() => {
                                    const value = row[column.id];
                                    switch (column.id) {
                                        case 'isAdmin':
                                            return (
                                                <Radio
                                                    size="small"
                                                    className={
                                                        classes.iconButton
                                                    }
                                                    disabled
                                                    checked={row.isAdmin}
                                                />
                                            );
                                        case 'deleteUsers':
                                            return (
                                                <IconButton
                                                    size="small"
                                                    className={
                                                        classes.iconButton
                                                    }
                                                    onClick={() =>
                                                        deleteUser(row)
                                                    }
                                                >
                                                    <HighlightOff />
                                                </IconButton>
                                            );
                                        default:
                                            return value;
                                    }
                                })()}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default AdminTable;
