import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

interface Props {
    color: string;
}

export const useStyles = makeStyles((theme: AugmentedTheme) => ({
    container: {
        padding: theme.spacing(1),
    },
    colorIcon: {
        color: (props: Props) => props.color,
        fontSize: 16,
        paddingRight: theme.spacing(1),
    },
    title: {
        fontWeight: 'bold',
    },
}));
