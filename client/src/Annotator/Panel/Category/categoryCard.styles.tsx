import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

interface Props {
    color: string;
}

export const useStyles = makeStyles((theme: AugmentedTheme) => ({
    root: {
        backgroundColor: 'inherit',
        color: 'inherit',
    },
    active: {
        borderColor: theme.palette.primary.main,
        borderWidth: '1px',
        borderStyle: 'solid',
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
