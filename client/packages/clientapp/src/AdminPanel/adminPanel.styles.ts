import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: AugmentedTheme) => ({
    container: {
        padding: theme.spacing(4),
        textAlign: 'center',
    },
    createButton: {
        background: theme.success,
        color: theme.palette.common.white,
    },
    limit: {
        margin: theme.spacing(1.5, 0),
    },
    select: {
        width: 56,
        padding: theme.spacing(1),
        textAlign: 'left',
        fontSize: 14,
    },
    tableHead: {
        '&.MuiTableCell-head': {
            fontWeight: 650,
            lineHeight: '2.5rem',
            fontSize: 16,
        },
    },
    iconButton: {
        '&.MuiIconButton-root.Mui-disabled': {
            color: theme.palette.common.black,
        },
        '&.MuiIconButton-root': {
            color: theme.palette.common.black,
            cursor: 'default',
            '&:hover': {
                color: theme.error,
            },
        },
    },
    form: {
        textAlign: 'center',
    },
}));
