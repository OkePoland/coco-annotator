import React from 'react';
import clsx from 'clsx';
import Tooltip from '@material-ui/core/Tooltip';

import { BackendState, BackendStatus } from './header.hooks';
import { useStyles } from './header.components';

interface ConnectionDotProps {
    state: BackendState;
}

const ConnectionDot: React.FC<ConnectionDotProps> = ({ state }) => {
    const classes = useStyles();
    const cn = clsx(
        classes.connectionDot,
        state.status === BackendStatus.SUCCESS && classes.successDot,
        state.status === BackendStatus.ERROR && classes.errorDot,
    );
    return (
        <Tooltip title={state.message}>
            <i className={cn} />
        </Tooltip>
    );
};
export default ConnectionDot;
