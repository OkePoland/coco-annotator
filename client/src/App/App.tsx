import React, { Suspense, useState, useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { Router, View, NotFoundBoundary } from 'react-navi';

import { UserInfo } from '../common/types';
import { theme } from '../common/theme';
import routes from './routes';
import { authService } from '../Auth/authService';
import { GlobalProvider } from '../common/contexts/GlobalContext';
import { SocketProvider } from '../common/contexts/SocketContext';
import { AuthProvider } from '../common/contexts/AuthContext';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<UserInfo | null>(() =>
        authService.getCurrentUser(),
    );
    useEffect(() => authService.subscribe(setCurrentUser), []);

    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <Router routes={routes} context={{ currentUser }}>
                    <SocketProvider>
                        <GlobalProvider>
                            <Suspense fallback={null}>
                                <NotFoundBoundary render={renderNotFound}>
                                    <View />
                                </NotFoundBoundary>
                            </Suspense>
                        </GlobalProvider>
                    </SocketProvider>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

const renderNotFound = () => (
    <div>
        <h1>404 - Not Found</h1>
    </div>
);

export default App;
