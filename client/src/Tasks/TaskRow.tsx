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
import { FILTER, dictionary } from './tasks.config';
import { Logs, useTaskRow } from './taskRow.hooks';

interface Props {
    task: Task;
    routeId: number;
    deleteTask: (id: number) => void;
}

const TaskRow: React.FC<Props> = ({ task, routeId, deleteTask }) => {
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
                                {task.id}. {task.name}
                            </Typography>
                        </Grid>
                        <Grid item>
                            {task.errors > 0 && (
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
                                    label={`${task.errors} ${
                                        task.errors > 1 ? 'errors' : 'error'
                                    }`}
                                    size="small"
                                />
                            )}
                            {task.warnings > 0 && (
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
                                    label={`${task.warnings} ${
                                        task.warnings > 1
                                            ? 'warnings'
                                            : 'warning'
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
                            {filteredLogs.map((l: Logs) => (
                                <Typography
                                    variant="body2"
                                    color={dictionary[l.type]}
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
                                onClick={() => deleteTask(task.id)}
                            >
                                Delete
                            </Button>
                        )}
                    </Grid>
                </PanelDetails>
            </Panel>
            <LinearProgress
                variant="determinate"
                value={task.progress}
                classes={{
                    colorPrimary: classes.colorPrimary,
                    barColorPrimary: classes.barColorPrimary,
                }}
            />
        </div>
    );
};

export default TaskRow;
