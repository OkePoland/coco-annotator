import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

interface Props {
    color: string;
}

export const useStyles = makeStyles((theme: AugmentedTheme) => ({
    root: {
        paddingLeft: theme.spacing(1),
        fontSize: '10px',
    },
}));
