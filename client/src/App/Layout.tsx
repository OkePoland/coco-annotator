import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

import Header from './Header/Header';

const Layout: React.FC = ({ children }) => (
    <Box maxWidth="xl">
        <Header />
        <Container>{children}</Container>
    </Box>
);

export default Layout;
