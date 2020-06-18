import { makeStyles, Theme } from '@material-ui/core/styles';

interface Props {
    text: string;
    leftPanel: string;
    middlePanel: string;
    rightPanel: string;
}

export const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'block',
    },
    leftPanel: {
        float: 'left',
        width: 40,
        height: '100vh',
        paddingTop: theme.spacing(2),
        textAlign: 'center',
        backgroundColor: (props: Props) => props.leftPanel,
        color: (props: Props) => props.text,

        borderWidth: '0px 1px 0px 0px',
        borderColor: 'black',
        borderStyle: 'solid',
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
        backgroundColor: (props: Props) => props.rightPanel,
        color: (props: Props) => props.text,

        borderWidth: '0px 0px 0px 1px',
        borderColor: 'black',
        borderStyle: 'solid',
    },
    fileTitle: {
        marginTop: theme.spacing(1),
    },
    searchInput: {
        width: '100%',
        backgroundColor: (props: Props) => props.middlePanel,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    middlePanel: {
        display: 'block',
        width: 'inherit',
        height: 'inherit',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: (props: Props) => props.middlePanel,
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

        '& label, & input': {
            color: (props: Props) => props.text,
        },
    },
    modal: {
        height: '320px',
    },
}));
