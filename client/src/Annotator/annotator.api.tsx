import { ImportObj } from './annotator.types';

import AxiosHandler from '../common/AxiosHandler';

export const getDataset = async (
    api: AxiosHandler,
    imageId: number,
): Promise<ImportObj> => {
    const url = `/annotator/data/${imageId}`;
    const { data } = await api.get<ImportObj>(url);
    return data;
};

export const saveDataset = async (api: AxiosHandler, obj: Object) => {
    const url = `/annotator/data`;
    await api.post(url, JSON.stringify(obj));
};

export const createAnnotation = async (
    api: AxiosHandler,
    imageId: number,
    categoryId: number,
) => {
    const { data: response } = await api.post(`/annotation/`, {
        image_id: imageId,
        category_id: categoryId,
    });
    return response;
};

export const deleteAnnotation = async (api: AxiosHandler, id: number) => {
    const url = `/annotation/${id}`;
    const response = await api.delete(url);
    return response;
};

export const downloadCoco = async (api: AxiosHandler, imageId: number) => {
    const url = `/image/${imageId}/coco`;
    const { data } = await api.get(url);
    return data;
};

export const downloadURI = (uri: string, exportName: string) => {
    const link = document.createElement('a');
    link.href = uri;
    link.download = exportName;
    document.body.appendChild(link);
    link.click();
    link.remove();
};

export const dextr = async (
    api: AxiosHandler,
    imageId: number,
    pointsList: Array<[number, number]>,
    settings: Object,
) => {
    const url = `/model/dextr/${imageId}`;
    const { data: response } = await api.post(url, { ...settings });
    return response;
};

export const copyAnnotations = async (
    api: AxiosHandler,
    imageId: number,
    imageIdToCopyFrom: number,
    categoriesIds: number[],
) => {
    const url = `/image/copy/${imageIdToCopyFrom}/${imageId}/annotations`;
    const body = { category_ids: categoriesIds };
    const { data } = await api.post(url, body);
    return data;
};
