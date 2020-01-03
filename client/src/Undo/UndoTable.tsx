import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import MuiTableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { useStyles } from './undo.styles';
import { columns } from './undoTable.config';
import { InstanceType } from './undo.config';
import { TableData } from './undo.hooks';
import TableCell from './TableCell';

interface UndoTableProps {
    rows: TableData[];
    deleteItem: (id: number, instance: InstanceType) => Promise<void>;
    undoItem: (id: number, instance: InstanceType) => Promise<void>;
}

const UndoTable: React.FC<UndoTableProps> = ({
    rows,
    deleteItem,
    undoItem,
}) => {
    const classes = useStyles();

    return (
        <Table stickyHeader padding="none">
            <TableHead>
                <TableRow>
                    {columns.map(column => (
                        <MuiTableCell
                            key={column.id}
                            className={classes.tableHead}
                            align="center"
                        >
                            {column.label}
                        </MuiTableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map(row => (
                    <TableRow hover key={row.id}>
                        {columns.map(column => (
                            <TableCell
                                key={`${row.name}${column.id}`}
                                column={column}
                                row={row}
                                classes={
                                    column.id === 'delete'
                                        ? classes.deleteIcon
                                        : classes.undoIcon
                                }
                                deleteItem={deleteItem}
                                undoItem={undoItem}
                            />
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default UndoTable;
