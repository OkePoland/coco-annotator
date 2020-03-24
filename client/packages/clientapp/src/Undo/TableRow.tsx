import React from 'react';

import MuiTableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import HighlightOff from '@material-ui/icons/HighlightOff';
import Undo from '@material-ui/icons/Undo';

import { useStyles } from './undo.styles';
import { UndoType } from '../common/types';
import { Column, ColumnOptions } from './undoTable.config';
import { RowData } from './undo.hooks';

interface Props {
    row: RowData;
    columns: Column[];
    deleteItem: (id: number, instance: UndoType) => Promise<void>;
    undoItem: (id: number, instance: UndoType) => Promise<void>;
}

const TableRow: React.FC<Props> = ({ row, columns, deleteItem, undoItem }) => {
    const classes = useStyles();

    return (
        <MuiTableRow hover>
            {columns.map(column => (
                <TableCell align="center" key={`${row.name}${column.id}`}>
                    {(() => {
                        switch (column.id) {
                            case ColumnOptions.ROLLBACK:
                                return (
                                    <IconButton
                                        size="small"
                                        className={classes.undoIcon}
                                        onClick={() =>
                                            undoItem(row.id, row.instanceType)
                                        }
                                    >
                                        <Undo />
                                    </IconButton>
                                );
                            case ColumnOptions.DELETE:
                                return (
                                    <IconButton
                                        size="small"
                                        className={classes.deleteIcon}
                                        onClick={() =>
                                            deleteItem(row.id, row.instanceType)
                                        }
                                    >
                                        <HighlightOff />
                                    </IconButton>
                                );
                            default:
                                return row[column.id] ? row[column.id] : null;
                        }
                    })()}
                </TableCell>
            ))}
        </MuiTableRow>
    );
};

export default TableRow;
