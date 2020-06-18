import React, { Fragment } from 'react';
import Badge from '@material-ui/core/Badge';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import UndoIcon from '@material-ui/icons/Undo';

import { UndoItem } from '../../app.types';

import ToolButton from './ToolButton';

import { isUndoItemShape, isUndoItemTool } from '../../app.utils';

interface Props {
    undoList: UndoItem[];
    centerImageAction: () => void;
    undoAction: () => void;
}

const getTooltipText = (item: UndoItem) => {
    if (isUndoItemShape(item)) {
        const { categoryId, annotationId } = item.dispatch;
        return `Undo (${item.type}) Category: ${categoryId} annotationId: ${annotationId}`;
    } else if (isUndoItemTool(item)) {
        const { toolEvent } = item.dispatch;
        return `Undo (${item.type}) ${toolEvent}`;
    } else return '';
};

const Settings: React.FC<Props> = ({
    undoList,
    centerImageAction,
    undoAction,
}) => (
    <Fragment>
        <ToolButton
            name="Center Image"
            icon={<FormatAlignCenterIcon />}
            enabled={true}
            onClick={centerImageAction}
        />
        <Badge
            badgeContent={undoList.length}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            color="secondary"
        >
            <ToolButton
                name="Undo"
                icon={<UndoIcon />}
                enabled={undoList.length > 0}
                tooltipText={
                    undoList.length > 0
                        ? getTooltipText(undoList[undoList.length - 1])
                        : 'Nothing to undo'
                }
                onClick={undoAction}
            />
        </Badge>
    </Fragment>
);

export default Settings;
