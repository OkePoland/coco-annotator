import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

interface Props {
    color: string;
}

export const useStyles = makeStyles((theme: AugmentedTheme) => ({
    colorIcon: {
        color: (props: Props) => props.color,
        fontSize: 16,
        paddingRight: theme.spacing(1),
    },
    title: {
        fontWeight: 'bold',
    },
}));
