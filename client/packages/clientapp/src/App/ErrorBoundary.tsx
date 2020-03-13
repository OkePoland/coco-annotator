import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const ErrorBoundary: React.FC = () => (
    <Box mt={5} textAlign="center">
        <Typography variant="h4" gutterBottom>
            Sorry! 404 Error
        </Typography>
        <Typography paragraph>
            Could not find the page you are looking for.
        </Typography>
    </Box>
);

export default ErrorBoundary;
