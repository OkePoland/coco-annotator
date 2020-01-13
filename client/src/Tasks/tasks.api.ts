import Api from '../common/api';
import { Task } from '../common/types';

const baseURL = '/tasks';

interface IGetLogsResponse {
    logs: string[];
}

export const getAll = async () => {
    const url = `${baseURL}/`;
    const response = await Api.get<Array<Task>>(url);
    return response;
};

export const deleteTask = async (id: number) => {
    const url = `${baseURL}/${id}`;
    const { data: response } = await Api.delete(url);
    return response;
};

export const getLogs = async (id: number) => {
    const url = `${baseURL}/${id}/logs`;
    const { data: response } = await Api.get<IGetLogsResponse>(url);
    return response;
};
