import React, { Fragment } from 'react';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import UndoIcon from '@material-ui/icons/Undo';

import ToolButton from './ToolButton';

interface Props {
    centerImageAction: () => void;
    undoAction: () => void;
}

export const Settings: React.FC<Props> = ({
    centerImageAction,
    undoAction,
}) => (
    <Fragment>
        <ToolButton
            name="Center Image"
            icon={<FormatAlignCenterIcon />}
            enabled={true}
            active={false}
            onClick={() => {
                centerImageAction();
            }}
        />
        <ToolButton
            name="Undo"
            icon={<UndoIcon />}
            enabled={true}
            active={false}
            onClick={() => {
                undoAction();
            }}
        />
    </Fragment>
);

export default Settings;
