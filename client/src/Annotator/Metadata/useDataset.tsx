/*
 * Manage dataset data
 */
import { useState, useEffect, useCallback } from 'react';

import { Dataset, Category } from '../annotator.common';
import { Maybe, ImportObj, Settings } from '../annotator.types';

import * as AnnotatorApi from '../annotator.api';

interface IUseDataset {
    (
        imageId: number,
        showDialogMsg?: (msg: string, isError?: boolean) => void,
    ): IUseDatasetResponse;
}
interface IUseDatasetResponse {
    dataset: Maybe<Dataset>;
    categories: Category[];
    filename: string;
    next: Maybe<number>;
    previous: Maybe<number>;
    initSettings: Settings;
    saveDataset: (obj: Object) => Promise<void>;
    copyAnnotations: (params: {
        imageId: number;
        id: number;
        categoriesIds: number[];
    }) => void;
}

const useDataset: IUseDataset = (imageId, showDialogMsg) => {
    const [generation, moveGeneration] = useState(0);

    // datasetdata
    const [dataset, setDataset] = useState<Maybe<Dataset>>(null);
    const [categories, setCategories] = useState<Array<Category>>([]);

    // image data
    const [filename, setFilename] = useState<string>('');
    const [next, setNext] = useState<Maybe<number>>(null);
    const [previous, setPrevious] = useState<Maybe<number>>(null);
    const [initSettings, setInitSettings] = useState<Settings>({
        tools: {
            select: null,
            bbox: null,
            polygon: null,
            brush: null,
            eraser: null,
            wand: null,
        },
        shortcuts: {},
    });

    const saveDataset = useCallback(
        async (obj: Object) => {
            await AnnotatorApi.saveDataset(obj);
            if (showDialogMsg) showDialogMsg('Image save');
            moveGeneration(c => c + 1);
        },
        [showDialogMsg],
    );

    const copyAnnotations = useCallback(
        async (params: {
            imageId: number;
            id: number;
            categoriesIds: number[];
        }) => {
            const { imageId, id, categoriesIds } = params;

            const { success, message } = await AnnotatorApi.copyAnnotations(
                imageId,
                id,
                categoriesIds,
            );
            if (success) {
                if (showDialogMsg) showDialogMsg('Copy success');
                moveGeneration(c => c + 1);
            } else if (showDialogMsg) {
                showDialogMsg(`Copy error (${message || ''})`, true);
            }
        },
        [showDialogMsg],
    );

    useEffect(() => {
        const update = async () => {
            const data: ImportObj = await AnnotatorApi.getDataset(imageId);
            console.log('Info: Dataset loaded');

            setDataset(data.dataset);
            setCategories(data.categories);
            setFilename(data.image.file_name);
            setNext(data.image.next !== undefined ? data.image.next : null);
            setPrevious(data.image.previous || null);

            if (data.preferences) {
                setInitSettings(data.preferences);
            }
        };

        try {
            update();
        } catch (error) {
            if (showDialogMsg) showDialogMsg('Loading error', true);
        }
    }, [showDialogMsg, imageId, generation]);

    return {
        dataset,
        categories,
        filename,
        next,
        previous,
        initSettings,
        saveDataset,
        copyAnnotations,
    };
};
export default useDataset;
