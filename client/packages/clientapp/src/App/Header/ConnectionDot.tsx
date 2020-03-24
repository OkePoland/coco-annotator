import React from 'react';
import clsx from 'clsx';
import Tooltip from '@material-ui/core/Tooltip';

import { useStyles } from './header.components';

interface ConnectionDotProps {
    connected: boolean | null;
}

const ConnectionDot: React.FC<ConnectionDotProps> = ({ connected }) => {
    const classes = useStyles();
    const cn = clsx(
        classes.connectionDot,
        connected != null
            ? connected
                ? classes.connectedDot
                : classes.disconnectedDot
            : classes.unknownDot,
    );
    const message =
        connected != null
            ? connected
                ? 'Connected to backend'
                : 'Could not connect to backend'
            : 'Connection unknown';

    return (
        <Tooltip title={message}>
            <i className={cn} />
        </Tooltip>
    );
};
export default ConnectionDot;
