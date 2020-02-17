import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

interface Props {
    color: string;
}

export const useStyles = makeStyles((theme: AugmentedTheme) => ({
    root: {
        color: 'inherit',
        border: '1px solid rgba(0,0,0,.125)',
        marginBottom: 5,
        backgroundColor: 'inherit',
    },
    row: {
        backgroundColor: 'rgba(0,0,0,.04)',
    },
    iconCell: {
        textAlign: 'center',
    },
    selected: {
        borderColor: theme.palette.primary.main,
        border: '1px solid',
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
