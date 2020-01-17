import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

interface Props {
    color: string;
}

export const useStyles = makeStyles((theme: AugmentedTheme) => ({
    root: {
        color: 'inherit',
        backgroundColor: 'rgba(0,0,0,.03)',
        borderBottom: '1px solid rgba(0,0,0,.125)',
        marginBottom: 2,
    },
    selected: {
        borderColor: theme.palette.primary.main,
        border: '1px solid',
    },
    expanededEye: {
        color: theme.palette.common.white,
    },
    disabledEye: {
        color: 'grey',
    },
    colorEye: {
        color: (props: Props) => props.color,
    },
}));
