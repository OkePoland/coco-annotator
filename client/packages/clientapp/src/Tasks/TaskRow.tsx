import React from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import LinearProgress from '@material-ui/core/LinearProgress';
import Panel from '@material-ui/core/ExpansionPanel';
import PanelSummary from '@material-ui/core/ExpansionPanelSummary';
import PanelDetails from '@material-ui/core/ExpansionPanelDetails';

import { useStyles } from './task.styles';
import { Task } from '../common/types';
import { FILTER, LOG_COLOR } from './tasks.config';
import { Log, useTaskRow } from './taskRow.hooks';

interface Props {
    task: Task;
    routeId: number;
    deleteTask: (id: number) => void;
}

const TaskRow: React.FC<Props> = ({ task, routeId, deleteTask }) => {
    const { name, id, progress, warnings, errors } = task;
    const {
        isVisible,
        filteredLogs,
        setLogFilter,
        completed,
        expanded,
        setExpanded,
        taskRef,
    } = useTaskRow(task, routeId);

    const classes = useStyles({ isVisible });

    return (
        <div className={classes.taskContainer} ref={taskRef}>
            <Panel className={classes.panel} expanded={expanded}>
                <PanelSummary
                    classes={{
                        root: classes.panelSummary,
                        content: classes.panelSummaryContent,
                    }}
                >
                    <Grid container justify="space-between" alignItems="center">
                        <Grid
                            item
                            xs
                            zeroMinWidth
                            onClick={() => {
                                setExpanded(!expanded);
                            }}
                        >
                            <Typography noWrap align="left">
                                {id}. {name}
                            </Typography>
                        </Grid>
                        <Grid item>
                            {errors > 0 && (
                                <Chip
                                    component="button"
                                    onClick={() => {
                                        if (expanded) {
                                            setLogFilter(oldState =>
                                                oldState === FILTER.ERRORS
                                                    ? FILTER.ALL
                                                    : FILTER.ERRORS,
                                            );
                                        }
                                    }}
                                    className={classes.error}
                                    label={`${errors} ${
                                        errors > 1 ? 'errors' : 'error'
                                    }`}
                                    size="small"
                                />
                            )}
                            {warnings > 0 && (
                                <Chip
                                    component="button"
                                    onClick={() => {
                                        if (expanded) {
                                            setLogFilter(oldState =>
                                                oldState === FILTER.WARNINGS
                                                    ? FILTER.ALL
                                                    : FILTER.WARNINGS,
                                            );
                                        }
                                    }}
                                    className={classes.warning}
                                    label={`${warnings} ${
                                        warnings > 1 ? 'warnings' : 'warning'
                                    }`}
                                    size="small"
                                />
                            )}
                        </Grid>
                    </Grid>
                </PanelSummary>
                <PanelDetails className={classes.panelDetails}>
                    <Grid
                        container
                        direction="column"
                        className={classes.panelDetails}
                    >
                        <Grid className={classes.logs}>
                            {filteredLogs.map((l: Log) => (
                                <Typography
                                    variant="body2"
                                    color={
                                        {
                                            error: LOG_COLOR.ERROR,
                                            warning: LOG_COLOR.WARNING,
                                            default: LOG_COLOR.DEFAULT,
                                        }[l.type]
                                    }
                                    classes={{
                                        colorSecondary: classes.warningColor,
                                    }}
                                    align="left"
                                    key={l.log}
                                >
                                    {l.log}
                                </Typography>
                            ))}
                        </Grid>
                        {completed && (
                            <Button
                                fullWidth
                                className={classes.deleteButton}
                                onClick={() => deleteTask(id)}
                            >
                                Delete
                            </Button>
                        )}
                    </Grid>
                </PanelDetails>
            </Panel>
            <LinearProgress
                variant="determinate"
                value={progress}
                classes={{
                    colorPrimary: classes.colorPrimary,
                    barColorPrimary: classes.barColorPrimary,
                }}
            />
        </div>
    );
};

export default TaskRow;
