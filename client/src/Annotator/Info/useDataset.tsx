/*
 * Manage dataset data
 */
import { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';

import { Dataset, Category } from '../../common/types';
import { Maybe, ToolPreferences } from '../annotator.types';

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
    toolPreferences: ToolPreferences;
    isLoading: boolean;
    saveDataset: (obj: Object) => Promise<void>;
}

const useDataset: IUseDataset = imageId => {
    const [, dispatch] = useGlobalContext();
    const { enqueueSnackbar } = useSnackbar();

    const [generation, moveGeneration] = useState(0);

    // datasetdata
    const [dataset, setDataset] = useState<Maybe<Dataset>>(null);
    const [categories, setCategories] = useState<Array<Category>>([]);
    const [isLoading, _setIsLoading] = useState<boolean>(false);

    // image data
    const [filename, setFilename] = useState<string>('');
    const [next, setNext] = useState<Maybe<number>>(null);
    const [previous, setPrevious] = useState<Maybe<number>>(null);
    const [toolPreferences, setToolPreferences] = useState<ToolPreferences>({
        select: null,
        bbox: null,
        polygon: null,
        brush: null,
        eraser: null,
        wand: null,
    });

    const saveDataset = useCallback(
        async (obj: Object) => {
            await AnnotatorApi.saveDataset(obj);
            enqueueSnackbar('Image save', { variant: 'success' });
            moveGeneration(c => c + 1);
        },
        [enqueueSnackbar],
    );

    useEffect(() => {
        const process = 'Loading annotation data';

        const update = async () => {
            const data = await AnnotatorApi.getDataset(imageId);
            console.log('Info: Dataset loaded');

            setDataset(data.dataset);
            setCategories(data.categories);
            setFilename(data.image.file_name);
            setNext(data.image.next !== undefined ? data.image.next : null);
            setPrevious(data.image.previous || null);

            setToolPreferences(data.preferences);
        };

        try {
            _setIsLoading(true);
            addProcess(dispatch, process);
            update();
        } catch (error) {
            enqueueSnackbar('Loading error', { variant: 'error' });
        } finally {
            _setIsLoading(false);
            removeProcess(dispatch, process);
        }
    }, [imageId, generation, dispatch, enqueueSnackbar]);

    return {
        dataset,
        categories,
        filename,
        next,
        previous,
        toolPreferences,
        isLoading,
        saveDataset,
    };
};
export default useDataset;
