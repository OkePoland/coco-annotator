import Api from '../common/api';
import { Dataset, Category } from '../common/types';

const annotationBaseUrl = `/annotation/`;

// TODO adjust types
interface IGetDataResponse {
    categories: Category[];
    dataset: Dataset;
    preferences?: {};
    permissions?: {};
    image: {
        annotated: boolean;
        annotating: [];
        category_ids: [number];
        dataset_id: number;
        deleted: boolean;
        events: [];
        file_name: string;
        height: number;
        id: number;
        is_modified: boolean;
        metadata: {} | null;
        milliseconds: number;
        next: number;
        num_annotations: number;
        path: string;
        previous: number | null;
        regenerate_thumbnail: boolean;
        width: number;
    };
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
