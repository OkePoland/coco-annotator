/**
 * All enabled/ disabled data related
 * with specific categories / annotations
 */
import { useState, useEffect, useCallback } from 'react';
import { Dispatch, SetStateAction } from 'react';

import { Category, Annotation } from '../../common/types';
import { CategoryInfo, AnnotationInfo, Maybe } from '../annotator.types';

import * as AnnotatorApi from '../annotator.api';

interface IUseInfo {
    (categories: Category[]): UseInfoResponse;
}
interface UseInfoResponse {
    data: CategoryInfo[];
    creator: UseCreatorResponse;
    enabler: UseEnablerResponse;
}
interface UseCreatorResponse {
    create: (imageId: number, categoryId: number) => Promise<Maybe<Annotation>>;
    remove: (categoryId: number, annotationId: number) => Promise<void>;
}
interface UseEnablerResponse {
    setCategoriesEnabled: (isOn: boolean) => void;
    setCategoryEnabled: (categoryId: number) => void;
    setCategoryExpanded: (categoryId: number) => void;
    setAnnotationEnabled: (categoryId: number, annotationId: number) => void;
}
interface ISubHook<T> {
    (
        data: CategoryInfo[],
        setData: Dispatch<SetStateAction<CategoryInfo[]>>,
    ): T;
}

const useInfo: IUseInfo = categories => {
    const [data, _setData] = useState<CategoryInfo[]>([]);

    const creator = useCreator(data, _setData);
    const enabler = useEnabler(data, _setData);

    useEffect(() => {
        const initialData: CategoryInfo[] = categories.map(cat => {
            let annotations: AnnotationInfo[] = [];
            if (cat.annotations != null) {
                annotations = cat.annotations.map(a => ({
                    id: a.id,
                    enabled: true,
                    data: a,
                }));
            }
            return {
                id: cat.id,
                enabled: cat.annotations != null && cat.annotations.length > 0,
                expanded: true,
                data: cat,
                annotations,
            };
        });
        _setData(initialData);
    }, [categories]);

    return {
        data,
        creator,
        enabler,
    };
};

// Helper sub-Hook to extract add / remove / edit methods on annotations
const useCreator: ISubHook<UseCreatorResponse> = (data, setData) => {
    const create = useCallback(
        async (imageId: number, categoryId: number) => {
            const idx = data.findIndex(o => o.id === categoryId);
            if (idx === -1) return null;

            console.log('Info: Create new AnnotationInfo');

            const item = await AnnotatorApi.createAnnotation(
                imageId,
                categoryId,
            );

            const id = item.id;
            const newInfo = { id, enabled: true, data: item };

            const newArr = [...data];
            newArr[idx].annotations.push(newInfo);
            setData(newArr);

            return item;
        },
        [data, setData],
    );

    const remove = useCallback(
        async (categoryId: number, annotationId: number) => {
            const idx = data.findIndex(o => o.id === categoryId);
            if (idx === -1) return;

            const aIdx = data[idx].annotations.findIndex(
                o => o.id === annotationId,
            );
            if (aIdx === -1) return;

            await AnnotatorApi.deleteAnnotation(annotationId);

            const newArr = [...data];
            newArr[idx].annotations.splice(aIdx, 1);
            setData(newArr);
        },
        [data, setData],
    );

    return {
        create,
        remove,
    };
};

// Helper sub-Hook to extract enable method on annotation
const useEnabler: ISubHook<UseEnablerResponse> = (data, setData) => {
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
        (categoryId: number) => {
            const idx = data.findIndex(o => o.id === categoryId);
            if (idx === -1) return;
            if (!data[idx].enabled) return;

            const newArr = data.map(item =>
                item.id === categoryId
                    ? {
                          ...item,
                          expanded: !item.expanded,
                      }
                    : item,
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

    return {
        setCategoriesEnabled,
        setCategoryEnabled,
        setCategoryExpanded,
        setAnnotationEnabled,
    };
};

export default useInfo;
