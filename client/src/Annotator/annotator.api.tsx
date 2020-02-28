import Api from '../common/api';
import { ImportObj } from './annotator.types';

const annotationBaseUrl = `/annotation/`;

export const getDataset = async (imageId: number): Promise<ImportObj> => {
    const url = `/annotator/data/${imageId}`;
    const { data } = await Api.get<ImportObj>(url);
    return data;
};

export const saveDataset = async (obj: Object) => {
    const url = `/annotator/data`;
    await Api.post(url, JSON.stringify(obj));
};

export const createAnnotation = async (imageId: number, categoryId: number) => {
    const { data: response } = await Api.post(annotationBaseUrl, {
        image_id: imageId,
        category_id: categoryId,
    });
    return response;
};

export const deleteAnnotation = async (id: number) => {
    const url = `${annotationBaseUrl}${id}`;
    const response = await Api.delete(url);
    return response;
};

export const downloadCoco = async (imageId: number) => {
    const url = `/image/${imageId}/coco`;
    const { data } = await Api.get(url);
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
    imageId: number,
    pointsList: Array<[number, number]>,
    settings: Object,
) => {
    const url = `/model/dextr/${imageId}`;
    const { data: response } = await Api.post(url, { ...settings });
    return response;
};

export const copyAnnotations = async (
    imageId: number,
    imageIdToCopyFrom: number,
    categoriesIds: number[],
) => {
    const url = `/image/copy/${imageIdToCopyFrom}/${imageId}/annotations`;
    const body = { category_ids: categoriesIds };
    const { data } = await Api.post(url, body);
    return data;
};
