import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: AugmentedTheme) => ({
    appbar: {
        height: 56,
        backgroundColor: theme.header,
    },
    toolbar: {
        height: 56,
    },
    drawer: {
        backgroundColor: theme.header,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    version: {
        fontSize: 10,
    },
    navBar: {
        textAlign: 'center',
    },
    connectionDot: {
        display: 'block',
        height: '9px',
        width: '9px',
        borderRadius: '50%',
    },
    successDot: {
        backgroundColor: theme.success,
    },
    errorDot: {
        backgroundColor: theme.error,
    },
    mobileMenuButton: {
        float: 'right',
    },
    userSelect: {
        color: 'white',
        borderRadius: 3,
    },
    link: {
        color: theme.link,
        textDecoration: 'none',
    },
    linkActive: {
        color: theme.linkActive,
    },
    loadingMessage: {
        fontSize: 14,
    },
    successText: {
        color: theme.success,
    },
    errorText: {
        color: theme.error,
    },
}));
