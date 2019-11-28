import { Dataset } from '../common/types';
import Api from '../common/api';

const baseURL = '/dataset';

export const getAll = async (page: number, limit: number) => {
    const url = `${baseURL}/data`;
    const params = {
        page: page,
        limit: limit,
    };
    const response = await Api.get<Array<Dataset>>(url, { params: params });
    return response;
};

export const create = async (name: string, categories?: Array<string>) => {
    const url = `${baseURL}/`;
    const params = {
        name: name,
    };
    const body = { categories: categories != null ? categories : [] };
    const response = await Api.post(url, body, { params: params });
    return response;
};
