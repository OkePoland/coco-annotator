import React, { Suspense, useState, useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { Router, View } from 'react-navi';

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
                                <View />
                            </Suspense>
                        </GlobalProvider>
                    </SocketProvider>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
