import React from 'react';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';

import { Annotation } from '../../../common/types';
import { useStyles } from './annotationCard.styles';

interface Props {
    data: Annotation;
    isSelected: boolean;
    isEnabled: boolean;
    edit: (id: number) => void;
    remove: (id: number) => void;
    setSelected: () => void;
    setEnabled: () => void;
}

const AnnotationCard: React.FC<Props> = ({
    data: { id, name, color },
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
                    {isEnabled ? <VisibilityIcon /> : <VisibilityOffIcon />}
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
            <Grid item xs>
                <IconButton
                    size="small"
                    color="inherit"
                    onClick={() => {
                        remove(id);
                    }}
                >
                    <DeleteIcon />
                </IconButton>
            </Grid>
            <Grid item xs>
                <IconButton
                    disabled
                    size="small"
                    color="inherit"
                    onClick={() => {
                        edit(id);
                    }}
                >
                    <SettingsIcon />
                </IconButton>
            </Grid>
        </Grid>
    );
};
export default AnnotationCard;
