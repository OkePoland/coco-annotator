import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: AugmentedTheme) => ({
    container: {
        padding: theme.spacing(5),
        textAlign: 'center',
    },
    divider: {
        margin: theme.spacing(2),
    },
    taskContainer: {
        padding: theme.spacing(0),
    },
    panelSummary: {
        backgroundColor: theme.header,
        color: theme.palette.common.white,
        borderRadius: 2,
        '&.MuiExpansionPanelSummary-root.Mui-expanded': {
            minHeight: 48,
        },

        '&.MuiExpansionPanelSummary-root': {
            height: 48,
        },
    },
    panelDetails: {
        '&.MuiExpansionPanelDetails-root': {
            padding: theme.spacing(0),
        },
    },
}));
