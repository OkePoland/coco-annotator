import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

interface TitleBarProps {
    version: string;
}

const TitleBar: React.FC<TitleBarProps> = ({ version }) => {
    return (
        <Box textAlign="center">
            <Box display="inline" mr={1}>
                <Typography display="inline" variant="h6" component="strong">
                    COCO Annotator
                </Typography>
            </Box>
            <Typography display="inline" variant="caption" component="small">
                {version}
            </Typography>
        </Box>
    );
};
export default TitleBar;
