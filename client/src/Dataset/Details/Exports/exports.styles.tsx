import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: AugmentedTheme) => ({
    card: {
        padding: theme.spacing(2),
    },
    divider: {
        margin: theme.spacing(1, 0),
    },
    item: {
        display: 'flex',
        padding: theme.spacing(1),
    },
    chip: {
        marginRight: theme.spacing(0.5),
    },
}));
