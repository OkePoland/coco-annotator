import { makeStyles, Theme } from '@material-ui/core/styles';

interface Props {
    color: string;
}

export const useStyles = makeStyles((theme: Theme) => ({
    root: {
        color: 'inherit',
        border: '1px solid',
        borderColor: 'rgba(0,0,0,.125)',
        marginBottom: 5,
        backgroundColor: 'inherit',
    },
    row: {
        // backgroundColor: theme.palette.primary.main,
    },
    iconCell: {
        textAlign: 'center',
    },
    selected: {
        border: '1px solid',
        borderColor: theme.palette.primary.main,
    },
    expanededEye: {
        color: theme.palette.common.white,
        opacity: 0.1,
    },
    disabledEye: {
        color: 'grey',
    },
    colorEye: {
        color: (props: Props) => props.color,
    },
    title: {
        fontWeight: 'bold',
    },
}));
