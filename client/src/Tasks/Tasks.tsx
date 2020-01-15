import React from 'react';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Panel from '@material-ui/core/ExpansionPanel';
import PanelSummary from '@material-ui/core/ExpansionPanelSummary';
import PanelDetails from '@material-ui/core/ExpansionPanelDetails';

import { useStyles } from './tasks.styles';
import { TASK_COMPLETED_THRESHOLD_VALUE } from './tasks.config';
import TaskRow from './TaskRow';
import { useTasks } from './tasks.hooks';

const Tasks: React.FC = () => {
    const classes = useStyles();
    const {
        list: { total },
        taskId,
        tasksList,
        deleteTask,
    } = useTasks();

    return (
        <Container className={classes.container}>
            <Typography component="div" variant="h4" gutterBottom>
                Tasks
            </Typography>
            <Typography paragraph gutterBottom>
                <b>{total}</b> tasks are running
            </Typography>
            <Divider className={classes.divider} />
            {tasksList.map(({ title, tasks }) => {
                const runningTasks = tasks.filter(
                    task => task.progress < TASK_COMPLETED_THRESHOLD_VALUE,
                );
                return (
                    <Panel key={title} defaultExpanded>
                        <PanelSummary className={classes.panelSummary}>
                            <Grid container justify="space-between">
                                <Typography>{title}</Typography>
                                <Typography>
                                    {runningTasks.length} of&nbsp;
                                    {tasks.length} tasks running
                                </Typography>
                            </Grid>
                        </PanelSummary>
                        <PanelDetails className={classes.panelDetails}>
                            <Grid container direction="column">
                                {tasks.map(task => {
                                    return (
                                        <div key={task.id}>
                                            <TaskRow
                                                task={task}
                                                routeId={taskId}
                                                deleteTask={deleteTask}
                                            />
                                        </div>
                                    );
                                })}
                            </Grid>
                        </PanelDetails>
                    </Panel>
                );
            })}
        </Container>
    );
};

export default Tasks;
