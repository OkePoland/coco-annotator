import React from 'react';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';

import { useStyles } from './undo.styles';
import { LimitOptions, InstanceType } from './undo.config';
import { useUndoPage } from './undo.hooks';
import UndoTable from './UndoTable';

const Undo: React.FC = () => {
    const classes = useStyles();
    const {
        list: { undos, refreshPage },
        undosLimit: [limit, setLimit],
        undosType: [type, setType],
        table: { rows, deleteItem, undoItem },
    } = useUndoPage();

    return (
        <Container className={classes.container}>
            <Typography component="div" variant="h4" gutterBottom>
                Undo
            </Typography>
            <Typography paragraph gutterBottom>
                Total of <b>{undos.length}</b> items can be undone.
            </Typography>
            <Grid container justify="center" spacing={1}>
                <Grid item>
                    <Button
                        variant="contained"
                        disabled
                        className={classes.undoAllButton}
                    >
                        Undo All
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        disabled
                        className={classes.deleteAllButton}
                    >
                        Delete All
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={refreshPage}>
                        Refresh
                    </Button>
                </Grid>
            </Grid>
            <Grid
                container
                className={classes.limit}
                justify="center"
                alignItems="center"
                spacing={2}
            >
                <Grid item>
                    <Typography>Instance Type</Typography>
                </Grid>
                <Grid item>
                    <Select
                        variant="outlined"
                        value={type}
                        onChange={event =>
                            setType(event.target.value as InstanceType)
                        }
                        classes={{ select: classes.select }}
                    >
                        <MenuItem value={InstanceType.ALL}>All</MenuItem>
                        <MenuItem value={InstanceType.ANNOTATION}>
                            Annotations
                        </MenuItem>
                        <MenuItem value={InstanceType.CATEGORY}>
                            Categories
                        </MenuItem>
                        <MenuItem value={InstanceType.DATASET}>
                            Datasets
                        </MenuItem>
                    </Select>
                </Grid>
                <Grid item>
                    <Typography>Limit</Typography>
                </Grid>
                <Grid item>
                    <Select
                        variant="outlined"
                        value={limit}
                        onChange={event =>
                            setLimit(event.target.value as number)
                        }
                        classes={{ select: classes.select }}
                    >
                        <MenuItem value={LimitOptions.OPTION_ONE}>
                            {LimitOptions.OPTION_ONE}
                        </MenuItem>
                        <MenuItem value={LimitOptions.OPTION_TWO}>
                            {LimitOptions.OPTION_TWO}
                        </MenuItem>
                        <MenuItem value={LimitOptions.OPTION_THREE}>
                            {LimitOptions.OPTION_THREE}
                        </MenuItem>
                        <MenuItem value={LimitOptions.OPTION_FOUR}>
                            {LimitOptions.OPTION_FOUR}
                        </MenuItem>
                    </Select>
                </Grid>
            </Grid>
            <Divider />
            {undos.length > 0 ? (
                <UndoTable
                    rows={rows}
                    deleteItem={deleteItem}
                    undoItem={undoItem}
                />
            ) : (
                <Box textAlign="center" mt={2}>
                    Nothing to undone!
                </Box>
            )}
        </Container>
    );
};

export default Undo;
