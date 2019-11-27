import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

import { UserInfo } from '../common/types';
import Header from './Header/Header';

interface LayoutProps {
    children: React.ReactNode;
    currentUser: UserInfo | null;
    onLogoutCb: () => Promise<void>;
}

const Layout: React.FC<LayoutProps> = ({
    children,
    currentUser,
    onLogoutCb,
}) => (
    <Box maxWidth="xl">
        <Header currentUser={currentUser} onLogoutCb={onLogoutCb} />
        <Container>{children}</Container>
    </Box>
);

export default Layout;
