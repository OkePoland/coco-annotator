import React from 'react';
import Box from '@material-ui/core/Box';

interface Props {
    // TODO
}

const Panel: React.FC<Props> = () => {
    return (
        <Box textAlign="center">
            <Box>File Title</Box>
            <Box>Category Search</Box>
            <Box>
                <Box>SELECT</Box>
                <Box>BBOX</Box>
                <Box>POLYGON</Box>
                <Box>WAND</Box>
                <Box>BRUSH</Box>
                <Box>ERASER</Box>
                <Box>KEYPOINTS</Box>
                <Box>DEXTR</Box>
            </Box>
        </Box>
    );
};
export default Panel;
