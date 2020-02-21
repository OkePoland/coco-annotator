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
        backgroundColor: theme.annotator.panel,
        color: theme.annotator.panelIcon,
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
        backgroundColor: theme.annotator.panel,
    },
    fileTitle: {
        marginTop: theme.spacing(1),
    },
    searchInput: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    middlePanel: {
        display: 'block',
        width: 'inherit',
        height: 'inherit',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: theme.annotator.canvas,
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
    toolPanel: {
        padding: theme.spacing(2),
        border: '1px solid rgba(0,0,0,.125)',
        backgroundColor: 'rgba(0,0,0,.04)',

        '& label': {
            color: theme.palette.common.white,
        },
        '& input': {
            color: theme.palette.common.white,
        },
    },
    modal: {
        height: '320px',
    },
}));
