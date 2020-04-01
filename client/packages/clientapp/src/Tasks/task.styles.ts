import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

interface Props {
    isVisible: boolean;
}

export const useStyles = makeStyles((theme: AugmentedTheme) => ({
    taskContainer: {
        margin: theme.spacing(0),
    },
    panelSummaryContent: {
        '&.MuiExpansionPanelSummary-content': {
            margin: theme.spacing(0),
        },
        '&.MuiExpansionPanelSummary-content.Mui-expanded': {
            margin: theme.spacing(0),
        },
    },
    panelSummary: {
        borderRadius: 2,
        '&.MuiExpansionPanelSummary-root.Mui-expanded': {
            minHeight: 32,
            height: 32,
            margin: theme.spacing(0),
        },
        '&.MuiExpansionPanelSummary-root': {
            minHeight: 32,
            margin: theme.spacing(0),
        },
    },
    panelDetails: {
        padding: theme.spacing(0, 0.5, 0.5),
    },
    panel: {
        backgroundColor: (props: Props) =>
            props.isVisible ? '#90ee90' : theme.palette.common.white,
        '&.MuiExpansionPanel-root.Mui-expanded': {
            margin: theme.spacing(0),
        },
    },
    error: {
        '&.MuiChip-root': {
            backgroundColor: theme.error,
            color: theme.palette.common.white,
            borderRadius: 8,
            margin: theme.spacing(0, 1),
            fontWeight: 700,
            '&:hover': {
                backgroundColor: theme.error,
            },
            '&:focus': {
                backgroundColor: theme.error,
            },
        },
    },
    warning: {
        '&.MuiChip-root': {
            backgroundColor: theme.warning,
            borderRadius: 8,
            fontWeight: 700,
            '&:hover': {
                backgroundColor: theme.warning,
            },
            '&:focus': {
                backgroundColor: theme.warning,
            },
        },
    },
    logs: {
        backgroundColor: theme.header,
        color: theme.palette.common.white,
        borderRadius: 5,
        padding: theme.spacing(0, 1),
        marginBottom: theme.spacing(0.5),
        maxHeight: 250,
        overflow: 'auto',
    },
    warningColor: {
        color: theme.warning,
    },
    deleteButton: {
        backgroundColor: theme.error,
        color: theme.palette.common.white,
        '&:hover': {
            backgroundColor: '#dc3545',
        },
    },
    colorPrimary: {
        backgroundColor: theme.palette.common.white,
    },
    barColorPrimary: {
        backgroundColor: theme.success,
    },
}));
