import React from 'react';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import DeleteIcon from '@material-ui/icons/Delete';

import { useStyles } from './annotationCard.styles';

interface Props {
    id: number;
    name: string;
    color: string;
    isSelected: boolean;
    isEnabled: boolean;
    edit: () => void;
    remove: () => void;
    setSelected: () => void;
    setEnabled: () => void;
}

const AnnotationCard: React.FC<Props> = ({
    id,
    name,
    color,
    isSelected,
    isEnabled,
    edit,
    remove,
    setSelected,
    setEnabled,
}) => {
    const classes = useStyles({ color });

    return (
        <Grid
            container
            justify="center"
            alignItems="center"
            className={clsx(classes.root, isSelected && classes.selected)}
        >
            <Grid item xs>
                <IconButton
                    size="small"
                    className={clsx(
                        isEnabled ? classes.colorEye : classes.disabledEye,
                    )}
                    color="inherit"
                    onClick={setEnabled}
                >
                    {isEnabled ? (
                        <VisibilityOutlinedIcon className={classes.icon} />
                    ) : (
                        <VisibilityOffOutlinedIcon className={classes.icon} />
                    )}
                </IconButton>
            </Grid>
            <Grid item xs={7}>
                <Typography align="left" onClick={setSelected}>
                    <small>
                        <span>[{id}] </span>
                        <span>{name || 'No Name'}</span>
                    </small>
                </Typography>
            </Grid>
            <Grid item xs className={classes.iconCell}>
                <IconButton
                    size="small"
                    color="inherit"
                    onKeyPress={e => {
                        e.preventDefault();
                    }}
                    onClick={remove}
                >
                    <DeleteIcon className={classes.icon} />
                </IconButton>
            </Grid>
            <Grid item xs className={classes.iconCell}>
                <IconButton
                    size="small"
                    color="inherit"
                    onKeyPress={e => {
                        e.preventDefault();
                    }}
                    onClick={edit}
                >
                    <SettingsOutlinedIcon className={classes.icon} />
                </IconButton>
            </Grid>
        </Grid>
    );
};
export default AnnotationCard;
