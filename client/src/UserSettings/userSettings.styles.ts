import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: AugmentedTheme) => ({
    container: {
        padding: theme.spacing(5, 2),
        textAlign: 'center',
    },
    form: {
        padding: theme.spacing(2),
    },
    button: {
        marginTop: theme.spacing(1),
    },
}));
