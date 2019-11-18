import React, { Suspense, useState, useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { Router, View, NotFoundBoundary } from 'react-navi';

import { IUser } from '../Auth/auth.api';
import { theme } from '../common/theme';
import routes from './routes';
import { authService } from '../Auth/authService';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<IUser | null>(() =>
        authService.getCurrentUser(),
    );
    useEffect(() => authService.subscribe(setCurrentUser), []);

    return (
        <ThemeProvider theme={theme}>
            <Router routes={routes} context={{ currentUser, authService }}>
                <Suspense fallback={null}>
                    <NotFoundBoundary render={renderNotFound}>
                        <View />
                    </NotFoundBoundary>
                </Suspense>
            </Router>
        </ThemeProvider>
    );
};

const renderNotFound = () => (
    <div>
        <h1>404 - Not Found</h1>
    </div>
);

export default App;
