import Api from '../common/api';
import { Undo, UndoType } from '../common/types';

const baseURL = '/undo/';

export const getAll = async (limit: number, type: UndoType) => {
    const url = `${baseURL}list/`;
    const params = { limit, type };
    const { data: response } = await Api.get<Array<Undo>>(url, { params });
    return response;
};

export const undo = async (id: number, instance: UndoType) => {
    const url = baseURL;
    const params = { id, instance };
    const { data: response } = await Api.post(url, params);
    return response;
};

export const deleteItem = async (id: number, instance: UndoType) => {
    const url = baseURL;
    const params = { id, instance };
    const { data: response } = await Api.delete(url, { params });
    return response;
};
