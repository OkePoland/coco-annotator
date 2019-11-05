import React, { Suspense } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { Router, View, NotFoundBoundary } from 'react-navi';

import { theme } from '../common/theme';
import routes from './routes';

const App: React.FC = () => (
    <ThemeProvider theme={theme}>
        <Router routes={routes}>
            <Suspense fallback={null}>
                <NotFoundBoundary render={renderNotFound}>
                    <View />
                </NotFoundBoundary>
            </Suspense>
        </Router>
    </ThemeProvider>
);

const renderNotFound = () => (
    <div>
        <h1>404 - Not Found</h1>
    </div>
);

export default App;
