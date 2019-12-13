import Api from '../common/api';
import { Dataset } from '../common/types';

// TODO adjust types
interface IGetDataResponse {
    categories: [string];
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
