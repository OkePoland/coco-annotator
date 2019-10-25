import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';

import Auth from './Auth/Auth';
import { theme } from './Auth/Auth.components';

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <Auth />
        </ThemeProvider>
    );
};

export default App;
