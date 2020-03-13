import React from 'react';
import Box from '@material-ui/core/Box';

interface Props {
    text: string;
}

const CoreComponent: React.FC<Props> = ({ text }) => {
    return (
        <Box>
           Core module - Component with Material UI - OK
           {text}
        </Box>
    );
};

export { CoreComponent };