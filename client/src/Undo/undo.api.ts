import Api from '../common/api';
import { Undo } from '../common/types';
import { InstanceType } from './undo.config';

const baseURL = '/undo/';

export const getAll = async (limit: number, type: InstanceType) => {
    const url = `${baseURL}list/`;
    const params = { limit, type };
    const { data: response } = await Api.get<Array<Undo>>(url, { params });
    return response;
};

export const undo = async (id: number, instance: InstanceType) => {
    const url = baseURL;
    const params = { id, instance };
    const { data: response } = await Api.post(url, params);
    return response;
};

export const deleteItem = async (id: number, instance: InstanceType) => {
    const url = baseURL;
    const params = { id, instance };
    const { data: response } = await Api.delete(url, { params });
    return response;
};
