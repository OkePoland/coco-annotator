import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import MuiTableRow from '@material-ui/core/TableRow';

import { useStyles } from './undo.styles';
import { UndoType } from './../common/types';
import { columns } from './undoTable.config';
import { RowData } from './undo.hooks';
import TableRow from './TableRow';

interface Props {
    rows: RowData[];
    deleteItem: (id: number, instance: UndoType) => Promise<void>;
    undoItem: (id: number, instance: UndoType) => Promise<void>;
}

const UndoTable: React.FC<Props> = ({ rows, deleteItem, undoItem }) => {
    const classes = useStyles();

    return (
        <Table stickyHeader padding="none">
            <TableHead>
                <MuiTableRow>
                    {columns.map(column => (
                        <TableCell
                            key={column.id}
                            className={classes.tableHead}
                            align="center"
                        >
                            {column.label}
                        </TableCell>
                    ))}
                </MuiTableRow>
            </TableHead>
            <TableBody>
                {rows.map(row => (
                    <TableRow
                        key={row.id}
                        row={row}
                        columns={columns}
                        deleteItem={deleteItem}
                        undoItem={undoItem}
                    />
                ))}
            </TableBody>
        </Table>
    );
};

export default UndoTable;
