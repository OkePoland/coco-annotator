/*
 * Manage dataset data
 */
import { useState, useEffect } from 'react';

import { Dataset, Category } from '../../common/types';
import { Maybe } from '../annotator.types';

import * as AnnotatorApi from '../annotator.api';
import useGlobalContext from '../../common/hooks/useGlobalContext';
import { addProcess, removeProcess } from '../../common/utils/globalActions';

interface IUseDataset {
    (imageId: number): IUseDatasetResponse;
}
interface IUseDatasetResponse {
    dataset: Maybe<Dataset>;
    categories: Category[];
    filename: string;
    next: Maybe<number>;
    previous: Maybe<number>;
    isLoading: boolean;
}

const useDataset: IUseDataset = imageId => {
    const [, dispatch] = useGlobalContext();

    // datasetdata
    const [dataset, setDataset] = useState<Maybe<Dataset>>(null);
    const [categories, setCategories] = useState<Array<Category>>([]);
    const [isLoading, _setIsLoading] = useState<boolean>(false);

    // image data
    const [, setMetadata] = useState<Maybe<{}>>(null);
    const [filename, setFilename] = useState<string>('');
    const [next, setNext] = useState<Maybe<number>>(null);
    const [previous, setPrevious] = useState<Maybe<number>>(null);
    const [, setCategoriesIds] = useState<Array<number>>([]);
    const [, setAnnotating] = useState<[]>([]);

    // others
    const [, setPreferences] = useState<{}>({}); // TODO adjust type

    useEffect(() => {
        const process = 'Loading annotation data';

        const update = async () => {
            const data = await AnnotatorApi.getData(imageId);
            setDataset(data.dataset);
            setCategories(data.categories);
            setMetadata(data.image.metadata || {});
            setFilename(data.image.file_name);
            setNext(data.image.next !== undefined ? data.image.next : null);
            setPrevious(data.image.previous || null);
            setCategoriesIds(data.image.category_ids || []);
            setAnnotating(data.image.annotating || []);

            setPreferences(data.preferences || {});

            setDataset(data.dataset);
        };

        try {
            _setIsLoading(true);
            addProcess(dispatch, process);
            update();
        } catch (error) {
            // TODO display toast
        } finally {
            _setIsLoading(false);
            removeProcess(dispatch, process);
        }
    }, [imageId, dispatch]);

    return {
        dataset,
        categories,
        filename,
        next,
        previous,
        isLoading,
    };
};
export default useDataset;
