/*
 * Manage dataset data
 */
import { useState, useEffect } from 'react';

import { Dataset, Category } from '../../common/types';
import { Maybe } from '../annotator.types';

import * as AnnotatorApi from '../annotator.api';
import useGlobalContext from '../../common/hooks/useGlobalContext';
import { addProcess, removeProcess } from '../../common/utils/globalActions';

const useDataset = (imageId: number) => {
    const [, dispatch] = useGlobalContext();

    // datasetdata
    const [dataset, setDataset] = useState<Maybe<Dataset>>(null);
    const [categories, setCategories] = useState<Array<Category>>([]);

    // image data
    const [metadata, setMetadata] = useState<Maybe<{}>>(null);
    const [filename, setFilename] = useState<string>('');
    const [next, setNext] = useState<Maybe<number>>(null);
    const [previous, setPrevious] = useState<Maybe<number>>(null);
    const [categoriesIds, setCategoriesIds] = useState<Array<number>>([]);
    const [annotating, setAnnotating] = useState<[]>([]);

    // others
    const [preferences, setPreferences] = useState<{}>({}); // TODO adjust type

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
            addProcess(dispatch, process);
            update();
        } catch (error) {
            // TODO display toast
        } finally {
            removeProcess(dispatch, process);
        }
    }, [imageId, dispatch]);

    return {
        dataset,
        categories,
        metadata,
        filename,
        next,
        previous,
        categoriesIds,
        annotating,
        preferences,
    };
};
export default useDataset;
