import { createMuiTheme } from '@material-ui/core/styles';

declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme {
        link?: string;
        linkActive?: string;
        success?: string;
        error?: string;
        warning?: string;
        header?: string;
        indicator?: string;
        annotator: {
            panel: string;
            panelIcon: string;
            canvas: string;
            card: string;
            cardSelected: string;
        };
    }

    // allow configuration using `createMuiTheme`
    interface ThemeOptions {
        link?: string;
        linkActive?: string;
        success?: string;
        error?: string;
        warning?: string;
        header?: string;
        indicator?: string;
        annotator: {
            panel: string;
            panelIcon: string;
            canvas: string;
            card: string;
            cardSelected: string;
        };
    }
}
export const theme = createMuiTheme({
    link: 'rgba(255,255,255,.5)',
    linkActive: '#FFF',
    success: '#28a745',
    error: '#FF0000',
    warning: '#ffc107',
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
    annotator: {
        panel: '#4b5162',
        panelIcon: '#fff',
        canvas: '#7c818c',
        card: '#4b5162',
        cardSelected: '#4b624c',
    },
});
