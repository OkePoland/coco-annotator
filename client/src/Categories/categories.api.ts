import { AxiosRequestConfig } from 'axios';

import Api from '../common/api';

const baseURL = '/category';

export interface Category {
    id: number;
    name: string;
    supercategory: string;
    color: string;
    metadata: {};
    creator: string;
    deleted: boolean;
    keypoint_edges: [];
    keypoint_labels: [];
    numberAnnotations: number;
}
interface IGetAllResponse {
    pagination: {
        start: number;
        end: number;
        pages: number;
        page: number;
        total: number;
        showing: number;
    };
    page: number;
    categories: Category[];
}
interface IUpdateResponse {
    success?: boolean;
    message?: string;
}
interface IUpdateCategory {
    name: string;
    id: number | null;
}

export const getAll = async (
    page: number,
    limit: number,
): Promise<IGetAllResponse> => {
    const url = `${baseURL}/data`;
    const params = {
        page,
        limit,
    };
    const { data: response } = await Api.get<IGetAllResponse>(url, { params });
    return response;
};

export const create = async (name: string) => {
    const url = `${baseURL}/`;
    const { data: response } = await Api.post(url, { name });
    return response;
};

export const update = async (
    data: IUpdateCategory,
): Promise<IUpdateResponse> => {
    const requestConfig: AxiosRequestConfig = {
        method: 'put',
        url: `${baseURL}/${data.id}`,
        data,
    };
    const { data: response } = await Api.request<IUpdateResponse>(
        requestConfig,
    );
    return response;
};

export const deleteCategory = async (id: number) => {
    const url = `${baseURL}/${id}`;
    const response = await Api.delete(url);
    return response;
};
