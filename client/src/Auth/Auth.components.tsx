import { makeStyles, createMuiTheme, Theme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#007bff',
        },
    },
});

export const useStyles = makeStyles((theme: Theme) => ({
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        padding: 55,
    },
    tab: {
        color: theme.palette.primary.dark,
        '&:hover': {
            color: theme.palette.primary.main,
        },
    },
    label: {
        backgroundColor: theme.palette.background.paper,
    },
    indicator: {
        background: theme.palette.background.paper,
    },
}));
