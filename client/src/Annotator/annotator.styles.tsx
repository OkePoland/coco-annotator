import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: AugmentedTheme) => ({
    root: {
        display: 'block',
        color: theme.palette.common.white,
    },
    leftPanel: {
        float: 'left',
        width: 40,
        height: '100vh',
        paddingTop: theme.spacing(2),
        textAlign: 'center',
        backgroundColor: '#4b5162',
    },
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    rightPanel: {
        width: 250,
        height: '100vh',
        float: 'right',
        padding: theme.spacing(1),
        backgroundColor: '#4b5162',
    },
    middlePanel: {
        display: 'block',
        width: 'inherit',
        height: 'inherit',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#7c818c',
    },
    frame: {
        margin: '0',
        width: '100%',
        height: '100%',
    },
    canvas: {
        display: 'block',
        width: '100%',
        height: '100vh',

        '& image': {
            position: 'absolute',
        },
    },
}));
