import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

interface Props {
    width: number;
}

const margin = 30;

export const useStyles = makeStyles((theme: AugmentedTheme) => ({
    divider: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    root: {
        display: 'flex',
    },
    drawer: {
        flexShrink: 0,
    },
    drawerPaper: {
        width: (props: Props) => props.width,
        backgroundColor: '#4b5162',
        padding: theme.spacing(2),
        borderRight: 'none',
    },
    appBar: {
        backgroundColor: '#4b5162',
        paddingLeft: (props: Props) => props.width + margin,
    },
    container: {
        marginLeft: (props: Props) => props.width + margin,
        paddingTop: '100px',
    },
    dragger: {
        width: '5px',
        cursor: 'ew-resize',
        padding: '4px 0 0',
        borderTop: '1px solid #4b5162',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        backgroundColor: '#4b5162',
    },
    breadcrumbs: {
        '& .MuiLink-root': {
            cursor: 'pointer',
        },
        '& .MuiTypography-body1': {
            cursor: 'default',
        },
    },
}));
