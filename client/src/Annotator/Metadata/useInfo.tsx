/**
 * All enabled/ disabled data related
 * with specific categories / annotations
 */
import { useState, useEffect, useCallback } from 'react';
import { Dispatch, SetStateAction } from 'react';

import { Category, Annotation } from '../annotator.common';
import {
    CategoryInfo,
    AnnotationInfo,
    MetadataInfo,
    Maybe,
} from '../annotator.types';

import * as CONFIG from '../annotator.config';

import AxiosHandler from '../../common/AxiosHandler';
import * as AnnotatorApi from '../annotator.api';

interface IUseInfo {
    (api: AxiosHandler, categories: Category[]): UseInfoResponse;
}
interface UseInfoResponse {
    data: CategoryInfo[];
    creator: UseCreatorResponse;
    editor: UseEditorResponse;
}
interface UseCreatorResponse {
    create: (imageId: number, categoryId: number) => Promise<Maybe<Annotation>>;
    remove: (categoryId: number, annotationId: number) => Promise<void>;
}
interface UseEditorResponse {
    setCategoriesEnabled: (isOn: boolean) => void;
    setCategoryEnabled: (categoryId: number) => void;
    setCategoryExpanded: (categoryId: number, isOn?: boolean) => void;
    setCategoryColor: (categoryId: number, color: string) => void;
    setAnnotationEnabled: (categoryId: number, annotationId: number) => void;
    setAnnotationName: (
        categoryId: number,
        annotationId: number,
        name: string,
    ) => void;
    setAnnotationColor: (
        categoryId: number,
        annotationId: number,
        color: string,
    ) => void;
    addAnnotationMetadata: (categoryId: number, annotationId: number) => void;
    editAnnotationMetadata: (params: {
        categoryId: number;
        annotationId: number;
        index: number;
        obj: { key: string; value: string };
    }) => void;
}
interface ISubHook<T> {
    (
        api: AxiosHandler,
        data: CategoryInfo[],
        setData: Dispatch<SetStateAction<CategoryInfo[]>>,
    ): T;
}

const useInfo: IUseInfo = (api, categories) => {
    const [data, _setData] = useState<CategoryInfo[]>([]);

    const creator = useCreator(api, data, _setData);
    const editor = useEditor(api, data, _setData);

    useEffect(() => {
        const initialData: CategoryInfo[] = categories.map(cat => {
            let annotations: AnnotationInfo[] = [];
            if (cat.annotations != null) {
                annotations = cat.annotations.map(a => ({
                    id: a.id,
                    name: a.metadata && a.metadata.name ? a.metadata.name : '',
                    color: a.color,
                    enabled: true,
                    metadata: Object.entries(a.metadata || []).reduce(
                        (
                            prevArr: MetadataInfo[],
                            [key, value]: [string, string],
                        ) => {
                            if (key !== 'name') prevArr.push({ key, value });
                            return prevArr;
                        },
                        [],
                    ),
                    _data: a,
                }));
            }
            return {
                id: cat.id,
                name: cat.name,
                enabled: cat.annotations != null && cat.annotations.length > 0,
                expanded: CONFIG.ANNOTATION_EXPANDED,
                color: cat.color,
                _data: cat,
                annotations,
            };
        });
        _setData(initialData);
    }, [categories]);

    return {
        data,
        creator,
        editor,
    };
};

// Helper sub-Hook to extract add / remove / edit methods on annotations
const useCreator: ISubHook<UseCreatorResponse> = (api, data, setData) => {
    const create = useCallback(
        async (imageId: number, categoryId: number) => {
            const idx = data.findIndex(o => o.id === categoryId);
            if (idx === -1) return null;

            console.log('Info: Create new AnnotationInfo');

            const item = await AnnotatorApi.createAnnotation(
                api,
                imageId,
                categoryId,
            );

            const newInfo = {
                id: item.id,
                name: '',
                color: item.color,
                enabled: true,
                metadata: [],
                _data: item,
            };

            const newArr = [...data];
            if (newArr[idx].annotations.length === 0)
                newArr[idx].enabled = true;
            newArr[idx].annotations.push(newInfo);
            setData(newArr);

            return item;
        },
        [api, data, setData],
    );

    const remove = useCallback(
        async (categoryId: number, annotationId: number) => {
            const idx = data.findIndex(o => o.id === categoryId);
            if (idx === -1) return;

            const aIdx = data[idx].annotations.findIndex(
                o => o.id === annotationId,
            );
            if (aIdx === -1) return;

            await AnnotatorApi.deleteAnnotation(api, annotationId);

            const newArr = [...data];
            newArr[idx].annotations.splice(aIdx, 1);
            if (newArr[idx].annotations.length === 0)
                newArr[idx].enabled = false;
            setData(newArr);
        },
        [api, data, setData],
    );

    return {
        create,
        remove,
    };
};

// Helper sub-Hook to extract enable method on annotation
const useEditor: ISubHook<UseEditorResponse> = (api, data, setData) => {
    const setCategoriesEnabled = useCallback(
        (isOn: boolean) => {
            const newArr = [...data];
            newArr.forEach(c => {
                c.enabled = isOn;
                c.expanded = false;
            });
            setData(newArr);
        },
        [data, setData],
    );

    const setCategoryEnabled = useCallback(
        (categoryId: number) => {
            const idx = data.findIndex(o => o.id === categoryId);
            if (idx === -1) return;

            const newArr = data.map(item =>
                item.id === categoryId
                    ? {
                          ...item,
                          enabled: !item.enabled,
                          expanded: item.expanded ? false : item.expanded,
                      }
                    : item,
            );
            setData(newArr);
        },
        [data, setData],
    );

    const setCategoryExpanded = useCallback(
        (categoryId: number, isOn?: boolean) => {
            const idx = data.findIndex(o => o.id === categoryId);
            if (idx === -1) return;
            if (!data[idx].enabled) return;

            const newArr = data.map(item =>
                item.id === categoryId
                    ? {
                          ...item,
                          expanded: isOn !== undefined ? isOn : !item.expanded,
                      }
                    : item,
            );
            setData(newArr);
        },
        [data, setData],
    );

    const setCategoryColor = useCallback(
        (categoryId: number, color: string) => {
            const idx = data.findIndex(o => o.id === categoryId);
            if (idx === -1) return;
            if (!data[idx].enabled) return;

            const newArr = data.map(item =>
                item.id === categoryId ? { ...item, color } : item,
            );
            setData(newArr);
        },
        [data, setData],
    );

    const setAnnotationEnabled = useCallback(
        (categoryId: number, annotationId: number) => {
            const idx = data.findIndex(o => o.id === categoryId);
            if (idx === -1) return;

            const aIdx = data[idx].annotations.findIndex(
                o => o.id === annotationId,
            );
            if (aIdx === -1) return;

            const newArr = [...data];
            newArr[idx].annotations[aIdx].enabled = !newArr[idx].annotations[
                aIdx
            ].enabled;

            setData(newArr);
        },
        [data, setData],
    );

    const setAnnotationName = useCallback(
        (categoryId: number, annotationId: number, name: string) => {
            const idx = data.findIndex(o => o.id === categoryId);
            if (idx === -1) return;

            const aIdx = data[idx].annotations.findIndex(
                o => o.id === annotationId,
            );
            if (aIdx === -1) return;

            const newArr = [...data];
            newArr[idx].annotations[aIdx].name = name;

            setData(newArr);
        },
        [data, setData],
    );

    const setAnnotationColor = useCallback(
        (categoryId: number, annotationId: number, color: string) => {
            const idx = data.findIndex(o => o.id === categoryId);
            if (idx === -1) return;

            const aIdx = data[idx].annotations.findIndex(
                o => o.id === annotationId,
            );
            if (aIdx === -1) return;

            const newArr = [...data];
            newArr[idx].annotations[aIdx].color = color;

            setData(newArr);
        },
        [data, setData],
    );

    const addAnnotationMetadata = useCallback(
        (categoryId: number, annotationId: number) => {
            const idx = data.findIndex(o => o.id === categoryId);
            if (idx === -1) return;

            const aIdx = data[idx].annotations.findIndex(
                o => o.id === annotationId,
            );
            if (aIdx === -1) return;

            const newArr = [...data];
            newArr[idx].annotations[aIdx].metadata.push({ key: '', value: '' });
            setData(newArr);
        },
        [data, setData],
    );

    const editAnnotationMetadata = useCallback(
        (params: {
            categoryId: number;
            annotationId: number;
            index: number;
            obj: MetadataInfo;
        }) => {
            const { categoryId, annotationId, index, obj } = params;

            const idx = data.findIndex(o => o.id === categoryId);
            if (idx === -1) return;

            const aIdx = data[idx].annotations.findIndex(
                o => o.id === annotationId,
            );
            if (aIdx === -1) return;

            const newArr = [...data];
            newArr[idx].annotations[aIdx].metadata[index] = obj;

            setData(newArr);
        },
        [data, setData],
    );

    return {
        setCategoriesEnabled,
        setCategoryEnabled,
        setCategoryExpanded,
        setCategoryColor,
        setAnnotationEnabled,
        setAnnotationName,
        setAnnotationColor,
        addAnnotationMetadata,
        editAnnotationMetadata,
    };
};

export default useInfo;
