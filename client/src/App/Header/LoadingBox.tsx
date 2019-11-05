import React from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import DoneIcon from '@material-ui/icons/Done';
import CircularProgress from '@material-ui/core/CircularProgress';

import { LoadingState } from './header.hooks';
import { useStyles } from './header.components';

interface LoadingBoxProps {
    state: LoadingState;
}

const LoadingBox: React.FC<LoadingBoxProps> = ({ state }) => {
    const classes = useStyles();
    const cn = clsx(
        state.isError || state.isLoading
            ? classes.errorText
            : classes.successText,
    );
    return (
        <Box className={cn} fontSize={14}>
            <Box display="inline" mr={1}>
                {state.isLoading ? (
                    <CircularProgress size={14} className={cn} />
                ) : (
                    <DoneIcon fontSize="inherit" />
                )}
            </Box>
            <Box display="inline" className={classes.loadingMessage}>
                {state.message}
            </Box>
        </Box>
    );
};
export default LoadingBox;
