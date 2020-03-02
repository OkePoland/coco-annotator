import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: AugmentedTheme) => ({
    titleBar: {
        color: theme.palette.common.white,
    },
    generateButton: {
        background: theme.success,
        color: theme.palette.common.white,
        '&:hover, &:focus': {
            backgroundColor: theme.palette.success.dark,
        },
    },
    scanButton: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.grey[600],
        '&:hover, &:focus': {
            backgroundColor: theme.palette.grey[700],
        },
    },
    exportButton: {
        backgroundColor: '#343a40',
        color: theme.palette.common.white,
        '&:hover, &:focus': {
            backgroundColor: theme.palette.grey[900],
        },
    },
    resetButton: {
        backgroundColor: theme.error,
        color: theme.palette.common.white,
        '&:hover, &:focus': {
            backgroundColor: theme.palette.error.dark,
        },
    },
    formControl: {
        display: 'flex',
    },
    formInput: {
        backgroundColor: theme.palette.common.white,
    },
    subdirForm: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(2),
        '& .MuiTypography-body1': {
            color: theme.palette.common.white,
            textAlign: 'center',
        },
        '& .MuiTypography-body2': {
            color: theme.palette.grey[600],
            textAlign: 'center',
        },
    },
    subdirectories: {
        backgroundColor: '#343a40',
        borderRadius: 5,
        '& li': {
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.main,
            fontWeight: 700,
            '&:hover, &:focus': {
                backgroundColor: theme.palette.primary.main,
            },
        },
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
    uploadInput: {
        alignSelf: 'flex-start',
        paddingTop: theme.spacing(2),
    },
    importDialog: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
}));
