import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: AugmentedTheme) => ({
    createButton: {
        background: theme.success,
        color: theme.palette.common.white,
    },
}));
