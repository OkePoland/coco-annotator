import React, { useState, useEffect, useRef, useMemo } from 'react';

import { Task } from '../common/types';
import { FILTER, TASK_COMPLETED } from './tasks.config';
import * as TasksApi from './tasks.api';

interface TaskRowState {
    isVisible: boolean;
    filteredLogs: Logs[];
    setLogFilter: React.Dispatch<React.SetStateAction<FILTER>>;
    completed: boolean;
    expanded: boolean;
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    taskRef: React.RefObject<HTMLDivElement>;
}

export interface Logs {
    log: string;
    type: string;
}

export const useTaskRow = (task: Task, routeId: number): TaskRowState => {
    const showLogs = task.id === routeId;
    const [expanded, setExpanded] = useState<boolean>(
        routeId ? showLogs : false,
    );
    const [isVisible, setVisible] = useState<boolean>(false);

    const [logs, setLogs] = useState<Logs[]>([]);
    const [logFilter, setLogFilter] = useState<FILTER>(FILTER.ALL);

    const completed = task.completed || task.progress >= TASK_COMPLETED;

    const taskRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        if (taskRef.current !== null) {
            taskRef.current.scrollIntoView({ behavior: 'smooth' });
        } else return;
    };

    useEffect(() => {
        const getLogs = async () => {
            const { logs: response } = await TasksApi.getLogs(task.id);
            setLogs(
                response.map((t: string) => ({
                    log: t,
                    type:
                        (t.includes(FILTER.ERRORS) && 'error') ||
                        (t.includes(FILTER.WARNINGS) && 'warning') ||
                        'default',
                })),
            );
        };
        if (expanded && logs.length === 0) {
            if (showLogs) {
                setVisible(true);
                setTimeout(() => {
                    scrollToBottom();
                    setTimeout(() => setVisible(false), 1000);
                }, 200);
            }
            getLogs();
        }
    }, [expanded, logs, task, showLogs]);

    const filteredLogs = useMemo(() => {
        switch (logFilter) {
            case FILTER.ERRORS:
            case FILTER.WARNINGS:
                return logs.filter((t: Logs) => t.log.includes(logFilter));
            default:
                return logs;
        }
    }, [logs, logFilter]);

    return {
        isVisible,
        setLogFilter,
        filteredLogs,
        completed,
        expanded,
        setExpanded,
        taskRef,
    };
};
