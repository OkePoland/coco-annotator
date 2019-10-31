import { createMuiTheme } from '@material-ui/core/styles';

declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme {
        link?: string;
        linkActive?: string;
        success?: string;
        error?: string;
        header?: string;
    }

    // allow configuration using `createMuiTheme`
    interface ThemeOptions {
        link?: string;
        linkActive?: string;
        success?: string;
        error?: string;
        header?: string;
    }
}
export const theme = createMuiTheme({
    link: 'rgba(255,255,255,.5)',
    linkActive: 'white',
    success: '#28a745',
    error: 'red',
    header: '#383c4a',
});
