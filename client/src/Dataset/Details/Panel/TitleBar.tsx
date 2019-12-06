import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

interface Props {
    title: string;
    imagesCount: number;
    pagesCount: number;
}

const TitleBar: React.FC<Props> = ({ title, imagesCount, pagesCount }) => (
    <Box textAlign="center" mt={2} mb={2}>
        <Typography variant="h5">{title}</Typography>
        <Box>{`Total of ${imagesCount} images displayed on ${pagesCount} pages`}</Box>
    </Box>
);
export default TitleBar;
