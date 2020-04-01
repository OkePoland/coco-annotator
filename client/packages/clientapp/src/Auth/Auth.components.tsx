import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: AugmentedTheme) => ({
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    title: {
        paddingTop: 16,
        paddingBottom: 24,
    },
    body: {
        paddingTop: 16,
    },
    container: {
        padding: 80,
    },
    tab: {
        textTransform: 'uppercase',
        color: theme.palette.primary.dark,
        '&:hover': {
            color: theme.palette.primary.main,
        },
    },
    indicator: {
        backgroundColor: theme.indicator,
    },
    label: {
        backgroundColor: theme.palette.background.paper,
    },
}));
