import Api from '../common/api';
import {
    Dataset,
    Category,
    DatasetPermissions,
    ImagePermissions,
    Preferences,
    Image,
} from '../common/types';

const annotationBaseUrl = `/annotation/`;

interface IGetDataResponse {
    categories: Category[];
    dataset: Dataset;
    preferences?: Preferences | {};
    permissions?: {
        dataset: DatasetPermissions;
        image: ImagePermissions;
    };
    image: Image;
}

export const getData = async (imageId: number): Promise<IGetDataResponse> => {
    const url = `/annotator/data/${imageId}`;
    const { data } = await Api.get<IGetDataResponse>(url);
    return data;
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

export const updateAnnotation = async (id: number, params: any) => {
    //const url = `${annotationBaseUrl}${id}`;
    //const response = await Api.put(url, params);
    //return response;
    return null;
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
