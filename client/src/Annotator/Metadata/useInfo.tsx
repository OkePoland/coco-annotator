/**
 * All enabled/ disabled data related
 * with specific categories / annotations
 */
import { useReducer, useEffect, useCallback } from 'react';
import { Dispatch } from 'react';

import { Category, Annotation } from '../annotator.common';
import {
    CategoryInfo,
    AnnotationInfo,
    MetadataInfo,
    Maybe,
} from '../annotator.types';

import * as CONFIG from '../annotator.config';

import * as AnnotatorApi from '../annotator.api';

interface IUseInfo {
    (categories: Category[]): UseInfoResponse;
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
    (dispatch: Dispatch<Action>): T;
}
enum Type {
    CATEGORIES_INIT,
    CATEGORIES_SET_ENABLED,
    CATEGORY_SET_ENABLED,
    CATEGORY_SET_EXPANDED,
    CATEGORY_SET_COLOR,
    ANNOTATION_ADD,
    ANNOTATION_REMOVE,
    ANNOTATION_SET_ENABLED,
    ANNOTATION_SET_NAME,
    ANNOTATION_SET_COLOR,
    ANNOTATION_ADD_METADATA,
    ANNOTATION_EDIT_METADATA,
}
type Action =
    | { type: Type.CATEGORIES_INIT; payload: { categories: Category[] } }
    | { type: Type.CATEGORIES_SET_ENABLED; payload: { isOn: boolean } }
    | { type: Type.CATEGORY_SET_ENABLED; payload: { categoryId: number } }
    | {
          type: Type.CATEGORY_SET_EXPANDED;
          payload: { categoryId: number; isOn?: boolean };
      }
    | {
          type: Type.ANNOTATION_ADD;
          payload: { categoryId: number; obj: AnnotationInfo };
      }
    | {
          type: Type.ANNOTATION_REMOVE;
          payload: { categoryId: number; annotationId: number };
      }
    | {
          type: Type.CATEGORY_SET_COLOR;
          payload: { categoryId: number; color: string };
      }
    | {
          type: Type.ANNOTATION_SET_ENABLED;
          payload: { categoryId: number; annotationId: number };
      }
    | {
          type: Type.ANNOTATION_SET_NAME;
          payload: { categoryId: number; annotationId: number; name: string };
      }
    | {
          type: Type.ANNOTATION_SET_COLOR;
          payload: { categoryId: number; annotationId: number; color: string };
      }
    | {
          type: Type.ANNOTATION_ADD_METADATA;
          payload: { categoryId: number; annotationId: number };
      }
    | {
          type: Type.ANNOTATION_EDIT_METADATA;
          payload: {
              categoryId: number;
              annotationId: number;
              index: number;
              obj: MetadataInfo;
          };
      };

const reducer = (state: CategoryInfo[], action: Action): CategoryInfo[] => {
    switch (action.type) {
        // INIT
        case Type.CATEGORIES_INIT: {
            const { categories } = action.payload;
            const initialData: CategoryInfo[] = categories.map(cat => {
                let annotations: AnnotationInfo[] = [];
                if (cat.annotations != null) {
                    annotations = cat.annotations.map(a => ({
                        id: a.id,
                        name:
                            a.metadata && a.metadata.name
                                ? a.metadata.name
                                : '',
                        color: a.color,
                        enabled: true,
                        metadata: Object.entries(a.metadata || []).reduce(
                            (
                                prevArr: MetadataInfo[],
                                [key, value]: [string, string],
                            ) => {
                                if (key !== 'name')
                                    prevArr.push({ key, value });
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
                    enabled:
                        cat.annotations != null && cat.annotations.length > 0,
                    expanded: CONFIG.ANNOTATION_EXPANDED,
                    color: cat.color,
                    _data: cat,
                    annotations,
                };
            });
            return initialData;
        }
        //
        // Category actions
        //
        case Type.CATEGORIES_SET_ENABLED:
            const { isOn } = action.payload;
            return state.map(item => ({
                ...item,
                expanded: false,
                enabled: isOn,
            }));
        case Type.CATEGORY_SET_ENABLED: {
            const { categoryId } = action.payload;
            const idx = state.findIndex(o => o.id === categoryId);
            if (idx === -1) return state;

            return state.map(item =>
                item.id === categoryId
                    ? {
                          ...item,
                          enabled: !item.enabled,
                          expanded: item.expanded ? false : item.expanded,
                      }
                    : item,
            );
        }
        case Type.CATEGORY_SET_EXPANDED: {
            const { categoryId, isOn } = action.payload;
            const idx = state.findIndex(o => o.id === categoryId);
            if (idx === -1) return state;
            if (!state[idx].enabled) return state;

            return state.map(item =>
                item.id === categoryId
                    ? {
                          ...item,
                          expanded: isOn !== undefined ? isOn : !item.expanded,
                      }
                    : item,
            );
        }
        case Type.CATEGORY_SET_COLOR: {
            const { categoryId, color } = action.payload;
            const idx = state.findIndex(o => o.id === categoryId);
            if (idx === -1) return state;
            if (!state[idx].enabled) return state;

            return state.map(item =>
                item.id === categoryId ? { ...item, color } : item,
            );
        }
        //
        // Annotation add/remove
        //
        case Type.ANNOTATION_ADD: {
            const { categoryId, obj } = action.payload;
            const idx = state.findIndex(o => o.id === categoryId);
            if (idx === -1) return state;

            const arr = [...state];
            if (arr[idx].annotations.length === 0) arr[idx].enabled = true;
            arr[idx].annotations.push(obj);

            return arr;
        }
        case Type.ANNOTATION_REMOVE: {
            const { categoryId, annotationId } = action.payload;

            const idx = state.findIndex(o => o.id === categoryId);
            if (idx === -1) return state;

            const aIdx = state[idx].annotations.findIndex(
                o => o.id === annotationId,
            );
            if (aIdx === -1) return state;

            const arr = [...state];
            arr[idx].annotations.splice(aIdx, 1);
            if (arr[idx].annotations.length === 0) arr[idx].enabled = false;
            return arr;
        }
        //
        // Annotation edit
        //
        case Type.ANNOTATION_SET_ENABLED: {
            const { categoryId, annotationId } = action.payload;
            const idx = state.findIndex(o => o.id === categoryId);
            if (idx === -1) return state;

            const aIdx = state[idx].annotations.findIndex(
                o => o.id === annotationId,
            );
            if (aIdx === -1) return state;

            const arr = [...state];
            arr[idx].annotations[aIdx].enabled = !arr[idx].annotations[aIdx]
                .enabled;
            return arr;
        }
        case Type.ANNOTATION_SET_NAME: {
            const { categoryId, annotationId, name } = action.payload;
            const idx = state.findIndex(o => o.id === categoryId);
            if (idx === -1) return state;

            const aIdx = state[idx].annotations.findIndex(
                o => o.id === annotationId,
            );
            if (aIdx === -1) return state;

            const arr = [...state];
            arr[idx].annotations[aIdx].name = name;
            return arr;
        }
        case Type.ANNOTATION_SET_COLOR: {
            const { categoryId, annotationId, color } = action.payload;
            const idx = state.findIndex(o => o.id === categoryId);
            if (idx === -1) return state;

            const aIdx = state[idx].annotations.findIndex(
                o => o.id === annotationId,
            );
            if (aIdx === -1) return state;

            const arr = [...state];
            arr[idx].annotations[aIdx].color = color;
            return arr;
        }
        case Type.ANNOTATION_ADD_METADATA: {
            const { categoryId, annotationId } = action.payload;
            const idx = state.findIndex(o => o.id === categoryId);
            if (idx === -1) return state;

            const aIdx = state[idx].annotations.findIndex(
                o => o.id === annotationId,
            );
            if (aIdx === -1) return state;

            const arr = [...state];
            arr[idx].annotations[aIdx].metadata.push({ key: '', value: '' });
            return arr;
        }
        case Type.ANNOTATION_EDIT_METADATA: {
            const { categoryId, annotationId, index, obj } = action.payload;
            const idx = state.findIndex(o => o.id === categoryId);
            if (idx === -1) return state;

            const aIdx = state[idx].annotations.findIndex(
                o => o.id === annotationId,
            );
            if (aIdx === -1) return state;

            const arr = [...state];
            arr[idx].annotations[aIdx].metadata[index] = obj;
            return arr;
        }
        default:
            return state;
    }
};

const useInfo: IUseInfo = categories => {
    const [data, dispatch] = useReducer(reducer, []);
    const creator = useCreator(dispatch);
    const editor = useEditor(dispatch);

    useEffect(() => {
        dispatch({
            type: Type.CATEGORIES_INIT,
            payload: { categories },
        });
    }, [categories]);

    return {
        data,
        creator,
        editor,
    };
};

const useCreator: ISubHook<UseCreatorResponse> = dispatch => {
    const create = useCallback(
        async (imageId: number, categoryId: number) => {
            console.log('Info: Create new AnnotationInfo');

            const item = await AnnotatorApi.createAnnotation(
                imageId,
                categoryId,
            );
            const obj = {
                id: item.id,
                name: '',
                color: item.color,
                enabled: true,
                metadata: [],
                _data: item,
            };

            dispatch({
                type: Type.ANNOTATION_ADD,
                payload: { categoryId, obj },
            });

            return item;
        },
        [dispatch],
    );

    const remove = useCallback(
        async (categoryId: number, annotationId: number) => {
            await AnnotatorApi.deleteAnnotation(annotationId);
            dispatch({
                type: Type.ANNOTATION_REMOVE,
                payload: { categoryId, annotationId },
            });
        },
        [dispatch],
    );

    return {
        create,
        remove,
    };
};

const useEditor: ISubHook<UseEditorResponse> = dispatch => {
    const setCategoriesEnabled = useCallback(
        (isOn: boolean) => {
            dispatch({ type: Type.CATEGORIES_SET_ENABLED, payload: { isOn } });
        },
        [dispatch],
    );

    const setCategoryEnabled = useCallback(
        (categoryId: number) => {
            dispatch({
                type: Type.CATEGORY_SET_ENABLED,
                payload: { categoryId },
            });
        },
        [dispatch],
    );

    const setCategoryExpanded = useCallback(
        (categoryId: number, isOn?: boolean) => {
            dispatch({
                type: Type.CATEGORY_SET_EXPANDED,
                payload: { categoryId, isOn },
            });
        },
        [dispatch],
    );

    const setCategoryColor = useCallback(
        (categoryId: number, color: string) => {
            dispatch({
                type: Type.CATEGORY_SET_COLOR,
                payload: { categoryId, color },
            });
        },
        [dispatch],
    );

    const setAnnotationEnabled = useCallback(
        (categoryId: number, annotationId: number) => {
            dispatch({
                type: Type.ANNOTATION_SET_ENABLED,
                payload: { categoryId, annotationId },
            });
        },
        [dispatch],
    );

    const setAnnotationName = useCallback(
        (categoryId: number, annotationId: number, name: string) => {
            dispatch({
                type: Type.ANNOTATION_SET_NAME,
                payload: { categoryId, annotationId, name },
            });
        },
        [dispatch],
    );

    const setAnnotationColor = useCallback(
        (categoryId: number, annotationId: number, color: string) => {
            dispatch({
                type: Type.ANNOTATION_SET_COLOR,
                payload: { categoryId, annotationId, color },
            });
        },
        [dispatch],
    );

    const addAnnotationMetadata = useCallback(
        (categoryId: number, annotationId: number) => {
            dispatch({
                type: Type.ANNOTATION_ADD_METADATA,
                payload: { categoryId, annotationId },
            });
        },
        [dispatch],
    );

    const editAnnotationMetadata = useCallback(
        (params: {
            categoryId: number;
            annotationId: number;
            index: number;
            obj: MetadataInfo;
        }) => {
            dispatch({
                type: Type.ANNOTATION_EDIT_METADATA,
                payload: params,
            });
        },
        [dispatch],
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
