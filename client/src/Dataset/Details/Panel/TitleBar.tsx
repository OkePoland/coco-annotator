import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { useStyles } from './panel.styles';

interface Props {
    title: string;
    imagesCount: number;
    pagesCount: number;
}

const TitleBar: React.FC<Props> = ({ title, imagesCount, pagesCount }) => {
    const classes = useStyles();

    return (
        <Box className={classes.titleBar} textAlign="center" mt={2} mb={2}>
            <Typography variant="h5" gutterBottom>
                {title}
            </Typography>
            <Typography paragraph>
                Total of <b>{imagesCount}</b> images displayed on{' '}
                <b>{pagesCount}</b> pages
            </Typography>
        </Box>
    );
};
export default TitleBar;
