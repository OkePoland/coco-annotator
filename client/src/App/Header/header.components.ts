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
    navList: {
        textAlign: 'center',
    },
    connectionDot: {
        display: 'block',
        height: '9px',
        width: '9px',
        borderRadius: '50%',
    },
    connectedDot: {
        backgroundColor: theme.success,
    },
    disconnectedDot: {
        backgroundColor: theme.error,
    },
    unknownDot: {
        backgroundColor: theme.palette.background.paper,
    },
    mobileMenuButton: {
        float: 'right',
    },
    userSelect: {
        '&.MuiButton-root': {
            color: theme.palette.common.white,
            backgroundColor: theme.header,
            boxShadow: 'none',
            padding: theme.spacing(0.25, 0.5),
            borderRadius: 3,
            '&:hover': {
                backgroundColor: theme.palette.common.white,
                color: theme.palette.common.black,
            },
            '&:focus': {
                backgroundColor: theme.palette.common.white,
                color: theme.palette.common.black,
            },
        },
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
    loadingText: {
        color: theme.error,
    },
}));
