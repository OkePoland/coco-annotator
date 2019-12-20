import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';

import { Annotation } from '../../../common/types';
import { useStyles } from './annotationCard.styles';

interface Props {
    data: Annotation;
    edit: (id: number) => void;
    remove: (id: number) => void;
}

const AnnotationCard: React.FC<Props> = ({
    data: { id, name },
    edit,
    remove,
}) => {
    const classes = useStyles();
    const isEmpty = true; // TODO

    return (
        <Grid
            container
            justify="center"
            alignItems="center"
            className={classes.root}
        >
            <Grid item xs>
                <IconButton
                    size="small"
                    color="inherit"
                    onClick={() => {
                        // TODO
                    }}
                >
                    <VisibilityIcon />
                </IconButton>
            </Grid>
            <Grid item xs={7}>
                <Typography
                    align="center"
                    onClick={() => {
                        // TODO
                    }}
                >
                    {`${name != null ? 'No name' : name} (${
                        isEmpty ? 'Empty' : id
                    })`}
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
