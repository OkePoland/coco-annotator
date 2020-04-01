import React from 'react';
import clsx from 'clsx';

import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';

import { useStyles } from './panel.styles';

interface Props {
    folders: string[];
    setFolders: React.Dispatch<React.SetStateAction<string[]>>;
    subdirectories: string[];
}

const SubdirForm: React.FC<Props> = ({
    folders,
    setFolders,
    subdirectories,
}) => {
    const classes = useStyles();

    return (
        <FormControl className={clsx(classes.subdirForm, classes.formControl)}>
            <Typography gutterBottom>Subdirectories</Typography>
            <Grid
                container
                item
                spacing={1}
                justify="center"
                className={classes.subdirectories}
            >
                {subdirectories.length > 0 ? (
                    subdirectories.map(subdirectory => (
                        <Grid key={subdirectory} item>
                            <Chip
                                clickable
                                component="li"
                                size="small"
                                label={subdirectory}
                                onClick={() =>
                                    setFolders([...folders, subdirectory])
                                }
                            />
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body2">
                        No subdirectory found.
                    </Typography>
                )}
            </Grid>
        </FormControl>
    );
};
export default SubdirForm;
