/**
 * All enabled/ disabled data related
 * with specific categories / annotations
 */
import { useState, useEffect, useCallback } from 'react';

import { Category, Annotation } from '../../common/types';

// interfaces
interface IUseCategories {
    (categories: Category[]): UseCategoriesResponse;
}
interface UseCategoriesResponse {
    data: CategoryInfo[];
    setCategoryEnabled: (catId: number) => void;
    setCategoryExpanded: (catId: number) => void;
    setAnnotationEnabled: (catId: number, annotationId: number) => void;
}

interface CategoryInfo {
    id: number;
    data: Category;
    enabled: boolean;
    expanded: boolean;
    annotations: AnnotationInfo[];
}
interface AnnotationInfo {
    id: number;
    data: Annotation;
    enabled: boolean;
}

const useInfo: IUseCategories = categories => {
    const [data, _setData] = useState<CategoryInfo[]>([]);

    const setCategoryEnabled = useCallback(
        (catId: number) => {
            const idx = data.findIndex(o => o.id === catId);
            if (idx === -1) return;

            const newArr = data.map(item =>
                item.id === catId
                    ? {
                          ...item,
                          enabled: !item.enabled,
                          expanded: item.expanded ? false : item.expanded,
                      }
                    : item,
            );
            _setData(newArr);
        },
        [data],
    );

    const setCategoryExpanded = useCallback(
        (catId: number) => {
            const idx = data.findIndex(o => o.id === catId);
            if (idx === -1) return;
            if (!data[idx].enabled) return;

            const newArr = data.map(item =>
                item.id === catId
                    ? {
                          ...item,
                          expanded: !item.expanded,
                      }
                    : item,
            );
            _setData(newArr);
        },
        [data],
    );

    const setAnnotationEnabled = useCallback(
        (catId: number, annotationId: number) => {
            const idx = data.findIndex(o => o.id === catId);
            if (idx === -1) return;

            const aIdx = data[idx].annotations.findIndex(
                o => o.id === annotationId,
            );
            if (aIdx === -1) return;

            const newArr = [...data];
            data[idx].annotations[aIdx].enabled = !newArr[idx].annotations[aIdx]
                .enabled;

            _setData(newArr);
        },
        [data],
    );

    useEffect(() => {
        const initialData: CategoryInfo[] = categories.map(cat => {
            let annotations: AnnotationInfo[] = [];
            if (cat.annotations != null) {
                annotations = cat.annotations.map(a => ({
                    id: a.id,
                    data: a,
                    enabled: true,
                }));
            }
            return {
                id: cat.id,
                data: cat,
                enabled: cat.annotations != null && cat.annotations.length > 0,
                expanded: false,
                annotations: annotations,
            };
        });
        _setData(initialData);
    }, [categories]);

    return {
        data,
        setCategoryEnabled,
        setCategoryExpanded,
        setAnnotationEnabled,
    };
};
export default useInfo;
