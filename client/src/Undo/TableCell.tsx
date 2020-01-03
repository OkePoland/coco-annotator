import React from 'react';

import MuiTableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import HighlightOff from '@material-ui/icons/HighlightOff';
import Undo from '@material-ui/icons/Undo';

import { InstanceType } from './undo.config';
import { Column } from './undoTable.config';
import { TableData } from './undo.hooks';

interface Props {
    row: TableData;
    column: Column;
    classes: string;
    deleteItem: (id: number, instance: InstanceType) => Promise<void>;
    undoItem: (id: number, instance: InstanceType) => Promise<void>;
}

const TableCell: React.FC<Props> = ({
    row,
    column,
    classes,
    deleteItem,
    undoItem,
}) => (
    <MuiTableCell align="center">
        {(() => {
            const value = row[column.id];
            switch (column.id) {
                case 'rollback':
                    return (
                        <IconButton
                            size="small"
                            className={classes}
                            onClick={() => undoItem(row.id, row.instanceType)}
                        >
                            <Undo />
                        </IconButton>
                    );
                case 'delete':
                    return (
                        <IconButton
                            size="small"
                            className={classes}
                            onClick={() => deleteItem(row.id, row.instanceType)}
                        >
                            <HighlightOff />
                        </IconButton>
                    );
                default:
                    return value;
            }
        })()}
    </MuiTableCell>
);

export default TableCell;
