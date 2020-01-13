import { useState, useEffect, useCallback } from 'react';
import { useCurrentRoute } from 'react-navi';

import { Task } from '../common/types';
import * as TasksApi from './tasks.api';
import { TASK_COMPLETED } from './tasks.config';
import useGlobalContext from '../common/hooks/useGlobalContext';
import { addProcess, removeProcess } from '../common/utils/globalActions';
import useSocketEvent from '../common/hooks/useSocketEvent';
import { SocketEvent } from '../common/sockets/events';

interface ListState {
    total: number;
    tasks: Task[];
    refreshPage: () => void;
}
interface TasksList {
    title: string;
    tasks: Task[];
}
interface TasksState {
    list: ListState;
    taskId: number;
    tasksList: TasksList[];
    deleteTask: (id: number) => void;
}
interface TaskProgress {
    id: number;
    progress: number;
    errors: number;
    warnings: number;
}

export const useTasks = (): TasksState => {
    const { url } = useCurrentRoute();
    const taskId = parseInt(url.query.id);
    const list = useList();

    const taskKeys = Array.from(new Set(list.tasks.map(item => item.group)));
    const tasksList = taskKeys.map(key => ({
        title: key,
        tasks: list.tasks.filter(task => task.group === key),
    }));

    const deleteTask = async (id: number) => {
        await TasksApi.deleteTask(id);
        list.refreshPage();
    };

    return { list, taskId, tasksList, deleteTask };
};

const useList = (): ListState => {
    const [, dispatch] = useGlobalContext();
    const [generation, moveGeneration] = useState(0);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [scheduler, setScheduler] = useState<any>([]);

    const refreshPage = () => {
        moveGeneration(c => c + 1);
    };

    const getTasks = useCallback(async () => {
        const process = 'Loading tasks';

        addProcess(dispatch, process);

        const { data } = await TasksApi.getAll();
        setTasks(data);
        setTotal(data.filter((t: Task) => t.progress < TASK_COMPLETED).length);

        removeProcess(dispatch, process);
    }, [dispatch]);

    const updateTasks = useCallback(
        (data: TaskProgress) => {
            const idx = tasks.findIndex((t: Task) => t.id === data.id);
            if (idx === -1) return;

            let newArr = [...tasks];
            newArr = newArr.map(o =>
                o.id === data.id ? { ...o, ...data } : o,
            );
            setTasks(newArr);
        },
        [tasks],
    );

    useEffect(() => {
        getTasks();
    }, [getTasks, generation]);

    useEffect(() => {
        if (tasks.length && scheduler.length) {
            const temp = [...scheduler];
            updateTasks(temp.shift());
            setScheduler(temp);
        }
        if (!scheduler.length) {
        }
    }, [tasks, scheduler, updateTasks]);

    useSocketEvent(SocketEvent.TASKPROGRESS, data => {
        setScheduler([...scheduler, data]);
    });

    return {
        total,
        tasks,
        refreshPage,
    };
};
