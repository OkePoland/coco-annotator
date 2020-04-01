/**
 * Test component just to check if it will works
 */
import React from 'react';
import Box from '@material-ui/core/Box';

interface Props {
    text: string;
}
const SharedComponent: React.FC<Props> = ({ text }) => {
    return (
        <Box>
           <Box>Simple Material-ui component say `hi!` from `core`</Box>
           <Box>{text}</Box>
        </Box>
    );
};

export default SharedComponent;
