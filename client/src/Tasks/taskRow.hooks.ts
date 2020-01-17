import React, { useState, useEffect, useRef, useMemo } from 'react';

import { Task } from '../common/types';
import { FILTER, TASK_COMPLETED_THRESHOLD_VALUE } from './tasks.config';
import * as TasksApi from './tasks.api';

interface TaskRowState {
    isVisible: boolean;
    filteredLogs: Log[];
    setLogFilter: React.Dispatch<React.SetStateAction<FILTER>>;
    completed: boolean;
    expanded: boolean;
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    taskRef: React.RefObject<HTMLDivElement>;
}

export interface Log {
    log: string;
    type: 'error' | 'warning' | 'default';
}

const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current !== null) {
        ref.current.scrollIntoView({ behavior: 'smooth' });
    } else return;
};

export const useTaskRow = (task: Task, routeId: number): TaskRowState => {
    const shouldShowLogs = task.id === routeId;
    const [expanded, setExpanded] = useState<boolean>(
        routeId ? shouldShowLogs : false,
    );
    const [isVisible, setVisible] = useState<boolean>(false);
    const taskRef = useRef<HTMLDivElement>(null);

    const [logs, setLogs] = useState<Log[]>([]);
    const [logFilter, setLogFilter] = useState<FILTER>(FILTER.ALL);

    const completed =
        task.completed || task.progress >= TASK_COMPLETED_THRESHOLD_VALUE;

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
            if (shouldShowLogs) {
                setVisible(true);
                setTimeout(() => {
                    scrollToBottom(taskRef);
                    setTimeout(() => setVisible(false), 1000);
                }, 200);
            }
            getLogs();
        }
    }, [expanded, logs, task, shouldShowLogs]);

    const filteredLogs = useMemo(() => {
        switch (logFilter) {
            case FILTER.ERRORS:
            case FILTER.WARNINGS:
                return logs.filter((t: Log) => t.log.includes(logFilter));
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
