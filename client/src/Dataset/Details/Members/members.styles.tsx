import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: AugmentedTheme) => ({
    card: {
        padding: theme.spacing(2),
    },
    divider: {
        margin: theme.spacing(1, 0),
    },
    icon: {
        display: 'flex',
        justifyContent: 'center',
    },
}));
