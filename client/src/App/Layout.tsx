import React from 'react';
import Box from '@material-ui/core/Box';

import Header from './Header/Header';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
    <Box maxWidth="xl">
        <Header />
        <Box>{children}</Box>
    </Box>
);

export default Layout;
