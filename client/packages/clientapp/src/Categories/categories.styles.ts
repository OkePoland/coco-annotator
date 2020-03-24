import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: AugmentedTheme) => ({
    container: {
        padding: theme.spacing(4),
        textAlign: 'center',
    },
    button: {
        background: theme.success,
        color: theme.palette.common.white,
    },
    divider: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(1),
    },
}));
