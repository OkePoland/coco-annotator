import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: AugmentedTheme) => ({
    container: {
        padding: theme.spacing(4),
        textAlign: 'center',
    },
    undoAllButton: {
        '&.MuiButton-contained.Mui-disabled': {
            background: theme.success,
            color: theme.palette.common.white,
        },
    },
    deleteAllButton: {
        '&.MuiButton-contained.Mui-disabled': {
            background: theme.error,
            color: theme.palette.common.white,
        },
    },
    limit: {
        margin: theme.spacing(1.5, 0),
    },
    select: {
        width: 80,
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
    deleteIcon: {
        '&.MuiIconButton-root': {
            color: theme.palette.common.black,
            cursor: 'default',
            '&:hover': {
                color: theme.error,
            },
        },
    },
    undoIcon: {
        '&.MuiIconButton-root': {
            color: theme.palette.common.black,
            cursor: 'default',
            '&:hover': {
                color: theme.success,
            },
        },
    },
}));
