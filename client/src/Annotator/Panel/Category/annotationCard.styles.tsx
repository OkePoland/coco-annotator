import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

interface Props {
    color: string;
}

export const useStyles = makeStyles((theme: AugmentedTheme) => ({
    root: {
        paddingLeft: theme.spacing(1),
        fontSize: '10px',
    },
    selected: {
        backgroundColor: 'rgb(75, 98, 76)',
    },
    disabledEye: {
        color: 'grey',
        opacity: 0.5,
    },
    colorEye: {
        color: (props: Props) => props.color,
    },
}));
