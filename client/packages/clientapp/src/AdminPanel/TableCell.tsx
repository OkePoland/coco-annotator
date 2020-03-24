import React from 'react';

import MuiTableCell from '@material-ui/core/TableCell';
import Radio from '@material-ui/core/Radio';
import IconButton from '@material-ui/core/IconButton';
import HighlightOff from '@material-ui/icons/HighlightOff';

import { TableData } from './adminPanel.hooks';
import { Column } from './adminTable.config';

interface Props {
    row: TableData;
    column: Column;
    classes: string;
    deleteUser: (user: TableData) => Promise<void>;
}

const TableCell: React.FC<Props> = ({ row, column, classes, deleteUser }) => (
    <MuiTableCell align="center">
        {(() => {
            const value = row[column.id];
            switch (column.id) {
                case 'isAdmin':
                    return (
                        <Radio
                            size="small"
                            className={classes}
                            disabled
                            checked={row.isAdmin}
                        />
                    );
                case 'deleteUsers':
                    return (
                        <IconButton
                            size="small"
                            className={classes}
                            onClick={() => deleteUser(row)}
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
