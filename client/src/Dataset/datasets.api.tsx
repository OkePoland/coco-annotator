import Api from '../common/api';
import { Image, Dataset } from '../common/types';

const baseURL = '/dataset';

export const getAll = async (page: number, limit: number) => {
    const url = `${baseURL}/data`;
    const params = {
        page,
        limit,
    };
    const response = await Api.get(url, { params });
    return response;
};

export const create = async (name: string, categories?: Array<string>) => {
    const url = `${baseURL}/`;
    const params = {
        name,
    };
    const body = { categories: categories || [] };
    const response = await Api.post(url, body, { params });
    return response;
};

export const edit = async (
    id: number,
    categories?: Array<string>,
    default_annotation_metadata?: { [key: string]: string | number | boolean },
) => {
    const url = `${baseURL}/${id}`;
    const body = {
        categories: categories || [],
        default_annotation_metadata: default_annotation_metadata || {},
    };
    const response = await Api.post(url, body);
    return response;
};

export const share = async (id: number, users: Array<string>) => {
    const url = `${baseURL}/${id}/share`;
    const body = { users: users || [] };
    const response = await Api.post(url, body);
    return response;
};

export const deleteDataset = async (id: number) => {
    const url = `${baseURL}/${id}`;
    const response = Api.delete(url);
    return response;
};

interface IGetDetailsParams {
    id: number;
    page?: number;
    folder?: string;
    order?: string;
}
interface IGetDetailsResponse {
    total: number;
    per_page: number;
    pages: number;
    page: number;
    images: Image[];
    folder: string;
    directory: string;
    dataset: Dataset;
    categories: string[];
    subdirectories: string[];
    time_ms: number;
}
export const getDetails = async ({
    id,
    page,
    folder,
    order,
}: IGetDetailsParams): Promise<IGetDetailsResponse> => {
    const url = `${baseURL}/${id}/data`;

    let params = {
        page,
        folder,
        order,
        limit: 52,
    };

    const { data } = await Api.get<IGetDetailsResponse>(url, { params });

    return data;
};

export const generate = async (id: number, keyword: string, limit: number) => {
    const url = `${baseURL}/${id}/generate`;
    const body = {
        keywords: [keyword],
        limit,
    };
    const response = await Api.post(url, body);
    return response;
};

export const scan = async (id: number) => {
    const url = `${baseURL}/${id}/scan`;
    const response = await Api.get(url);
    return response;
};

export const performExport = async (id: number, format: string) => {
    const url = `${baseURL}/${id}/${format}`;
    const response = await Api.get(url);
    return response;
};

export const getUsers = async (id: number) => {
    const url = `${baseURL}/${id}/users`;
    const response = await Api.get(url);
    return response;
};

export const getStats = async (id: number) => {
    const url = `${baseURL}/${id}/stats`;
    const response = await Api.get(url);
    return response;
};

export const getExports = async (id: number) => {
    const url = `${baseURL}/${id}/exports`;
    const response = await Api.get(url);
    return response;
};

export const getMetadata = async (id: number) => {
    const url = `${baseURL}/${id}/reset/metadata`;
    const response = await Api.get(url);
    return response;
};

// TODO
// uploadCoco
// exportingCOCO

export const getCoco = async (id: number) => {
    const url = `${baseURL}/${id}/coco`;
    const response = await Api.get(url);
    return response;
};

// image requests
export const deleteImage = async (id: number) => {
    const url = `/image/${id}`;
    const response = await Api.delete(url);
    return response;
};

export const downloadImage = async () => {
    // TODO
};
