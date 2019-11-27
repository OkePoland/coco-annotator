import { createMuiTheme } from '@material-ui/core/styles';

declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme {
        link?: string;
        linkActive?: string;
        success?: string;
        error?: string;
        header?: string;
        indicator?: string;
    }

    // allow configuration using `createMuiTheme`
    interface ThemeOptions {
        link?: string;
        linkActive?: string;
        success?: string;
        error?: string;
        header?: string;
        indicator?: string;
    }
}
export const theme = createMuiTheme({
    link: 'rgba(255,255,255,.5)',
    linkActive: '#FFF',
    success: '#28a745',
    error: '#FF0000',
    header: '#383c4a',
    indicator: '#FFF',
    palette: {
        primary: {
            main: '#007bff',
        },
    },
    typography: {
        button: {
            textTransform: 'none',
        },
    },
});
