import { makeStyles, Theme } from '@material-ui/core/styles';

interface Props {
    color: string;
}

export const useStyles = makeStyles((theme: Theme) => ({
    root: {
        paddingLeft: theme.spacing(1),
        fontSize: '10px',
    },
    iconCell: {
        textAlign: 'center',
    },
    icon: {
        fontSize: 18,
    },
    selected: {
        backgroundColor: theme.palette.primary.main + '4f', // add opcatity channel for color
    },
    disabledEye: {
        color: 'grey',
        opacity: 0.5,
    },
    colorEye: {
        color: (props: Props) => props.color,
    },
}));
