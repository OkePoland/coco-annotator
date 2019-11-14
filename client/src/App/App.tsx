import React, { Suspense } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { Router, View, NotFoundBoundary } from 'react-navi';

import { theme } from '../common/theme';
import routes from './routes';
import { GlobalProvider } from '../common/contexts/GlobalContext';
import { SocketProvider } from '../common/contexts/SocketContext';

const App: React.FC = () => (
    <SocketProvider>
        <GlobalProvider>
            <ThemeProvider theme={theme}>
                <Router routes={routes}>
                    <Suspense fallback={null}>
                        <NotFoundBoundary render={renderNotFound}>
                            <View />
                        </NotFoundBoundary>
                    </Suspense>
                </Router>
            </ThemeProvider>
        </GlobalProvider>
    </SocketProvider>
);

const renderNotFound = () => (
    <div>
        <h1>404 - Not Found</h1>
    </div>
);

export default App;
