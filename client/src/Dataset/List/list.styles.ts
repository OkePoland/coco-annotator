import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: AugmentedTheme) => ({
    container: {
        padding: theme.spacing(4),
        textAlign: 'center',
    },
    divider: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(1),
    },
    submitButton: {
        background: theme.success,
        color: theme.palette.common.white,
    },
    deleteButton: {
        color: theme.error,
    },
    tagsGrid: {
        border: '1px solid rgba(0, 0, 0, 0.23)',
        backgroundColor: '#fff',
        borderRadius: 4,
        padding: 1,
        display: 'flex',
        flexWrap: 'wrap',
    },
    tagsInput: {
        border: 0,
        outline: 0,
        padding: theme.spacing(1),
    },
    tagsList: {
        '& li': {
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.grey[900],
            borderRadius: 8,
            fontWeight: 700,
            '&:hover, &:focus': {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
            },
        },
        '& li[data-focus=true]': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
        },
    },
}));
