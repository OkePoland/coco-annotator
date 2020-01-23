import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: AugmentedTheme) => ({
    image: {
        height: 150,
    },
    categoryChip: {
        color: theme.palette.primary.contrastText,
        fontWeight: 700,
        margin: theme.spacing(0.25),
    },
}));
