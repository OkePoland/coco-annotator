import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: AugmentedTheme) => ({
    generateButton: {
        background: theme.success,
        color: theme.palette.common.white,
    },
    scanButton: {
        color: theme.palette.common.black,
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
    },
}));
