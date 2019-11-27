import { Dataset } from '../common/types';
import Api from '../common/api';

const baseURL = '/dataset';

export const getAll = async (page: number, limit: number) => {
    const url = `${baseURL}/data?page=${page}&limit=${limit}`;
    const response = await Api.get<Array<Dataset>>(url);
    return response;
};

export const create = async (name: string, categories?: Array<string>) => {
    const url = `${baseURL}/?name=${name}`;
    const body = { categories: categories != null ? categories : [] };
    const response = await Api.post(url, body);
    return response;
};
