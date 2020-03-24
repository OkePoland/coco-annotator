/**
 * Utils methods which will be ONLY used in Annotator.tsx
 * In most cases there are methods which affect/ get data
 * AnnotationInfo & AnnotationGroups simultaneously
 */
import { CoreType } from '@multi-annotator/core';
import {
    Maybe,
    ExportObj,
    CategoryInfo,
    AnnotationInfo,
    MetadataInfo,
    TooltipMetadata,
    Tool,
    ToolSettings,
    SelectedState,
    ShortcutsSettings,
    ExportObjCategory,
    ExportObjAnnotation,
    UndoItemType,
    UndoItemShape,
    UndoItemTool,
} from './app.types';

import { CategoryGroup, AnnotationGroup } from './Paper/Shape';

/*
 * Export helpers
 */
export const createExportObj = (
    imageId: number,
    dataset: Maybe<CoreType.Dataset>,
    segmentOn: boolean,
    activeTool: Maybe<Tool>,
    selected: SelectedState,
    shortcuts: ShortcutsSettings,
    exportTools: () => ToolSettings,
    infoArr: CategoryInfo[],
    groupsArr: CategoryGroup[],
) => {
    const toolsData = exportTools();
    const categoriesData = exportCategories(infoArr, groupsArr);

    const obj: ExportObj = {
        mode: segmentOn ? 'segment' : 'label',
        user: {
            tools: toolsData,
            shortcuts: shortcuts,
        },
        dataset,
        image: {
            id: imageId,
            settings: selected,
        },
        category_ids: infoArr.map(cat => cat.id),
        settings: {
            activeTool,
            zoom: 0,
        },
        categories: categoriesData,
    };
    return obj;
};

const exportCategories = (
    infoArr: CategoryInfo[],
    groupsArr: CategoryGroup[],
) => {
    if (infoArr.length === 0) return [];

    const categories: ExportObjCategory[] = infoArr.reduce(
        (prevArr: ExportObjCategory[], categoryInfo) => {
            const categoryGroup = groupsArr.find(
                o => o.data.categoryId === categoryInfo.id,
            );
            if (categoryGroup) {
                const item = parseCategory(categoryInfo, categoryGroup);
                prevArr.push(item);
            }
            return prevArr;
        },
        [],
    );
    return categories;
};

const parseCategory = (
    categoryInfo: CategoryInfo,
    categoryGroup: CategoryGroup,
) => {
    const annotations = createAnnotationsArray(
        categoryInfo.annotations,
        categoryGroup.children,
    );
    const obj: ExportObjCategory = {
        id: categoryInfo.id,
        name: categoryInfo.name,
        show: true,
        visualize: categoryInfo.enabled,
        color: categoryInfo.color,
        annotations,
    };
    return obj;
};

const createAnnotationsArray = (
    infoArr: AnnotationInfo[],
    groupsArr: paper.Item[],
) => {
    if (infoArr.length === 0) return [];

    const annotations: ExportObjAnnotation[] = infoArr.reduce(
        (prevArr: ExportObjAnnotation[], annotationInfo) => {
            const annotationGroup = groupsArr.find(
                o => o.data.annotationId === annotationInfo.id,
            );
            if (annotationGroup && annotationGroup instanceof AnnotationGroup) {
                const item = parseAnnotation(annotationInfo, annotationGroup);
                prevArr.push(item);
            }
            return prevArr;
        },
        [],
    );
    return annotations;
};

const parseAnnotation = (
    annotationInfo: AnnotationInfo,
    annotationGroup: AnnotationGroup,
) => {
    const isBBOX = annotationGroup.shape.isBBOX;
    const { shape, keypoints } = annotationGroup.exportData();

    const metadata = annotationInfo.metadata.reduce(
        (prevObj: { [key: string]: string }, item: MetadataInfo) => {
            prevObj[item.key] = item.value;
            return prevObj;
        },
        {},
    );
    metadata['name'] = annotationInfo.name || '';

    const obj: ExportObjAnnotation = {
        id: annotationInfo.id,
        name: annotationInfo.name,
        color: annotationInfo.color,
        isbbox: isBBOX,
        compoundPath: shape,
        keypoints,
        metadata,
    };
    return obj;
};

// Find Next Selected State
export const findNextSelected = (
    data: CategoryInfo[],
    selected: SelectedState,
    delta: -1 | 1,
) => {
    const newState: SelectedState = {
        categoryId: null,
        annotationId: null,
    };

    const { categoryId, annotationId } = selected;

    if (categoryId === null) {
        // in case there are items -> take first one
        // in case there are no items -> set Selected to null/null
        if (data.length > 0) {
            newState.categoryId =
                delta === -1 ? data[data.length - 1].id : data[0].id;
        }
        return newState;
    }

    const cIdx = data.findIndex(o => o.id === categoryId);
    const currentCategory = data[cIdx];

    // this case shouldn`t happen -> but to be 100% sure -> return null/null
    if (!currentCategory) return newState;

    // in case we are still in the same category
    const newAnnotationId = findNextAnnotationId(
        currentCategory,
        annotationId,
        delta,
    );
    if (newAnnotationId != null) {
        newState.categoryId = currentCategory.id;
        newState.annotationId = newAnnotationId;
        return newState;
    }

    // in case we are in different category
    const newCategoryIdx = cIdx + delta;
    if (-1 < newCategoryIdx && newCategoryIdx < data.length) {
        newState.categoryId = data[newCategoryIdx].id;
        newState.annotationId = findNextAnnotationId(
            data[newCategoryIdx],
            null,
            delta,
        );
        return newState;
    }

    return newState;
};

// return annotationId if still the same category
// return null if moved out of category
const findNextAnnotationId = (
    categoryInfo: CategoryInfo,
    annotationId: Maybe<number>,
    delta: -1 | 1,
) => {
    const { annotations: data, expanded } = categoryInfo;
    const count = categoryInfo.annotations.length;

    if (count === 0) return null;

    if (expanded === false) return null;

    if (annotationId === null) {
        return delta === -1 ? data[count - 1].id : data[0].id;
    }

    const aIdx = data.findIndex(a => a.id === annotationId);

    const newIdx = aIdx + delta;

    if (-1 < newIdx && newIdx <= data.length - 1) {
        return data[newIdx].id;
    }
    return null;
};

/**
 * Undo Helpers
 */
export function isUndoItemShape(object: any): object is UndoItemShape {
    return object.type === UndoItemType.SHAPE_CHANGED;
}

export function isUndoItemTool(object: any): object is UndoItemTool {
    return object.type === UndoItemType.TOOL_CHANGED;
}

export const getTooltipMetadata = (infoArr: CategoryInfo[]) => {
    const metadata: TooltipMetadata = infoArr.reduce(
        (prevObj: TooltipMetadata, categoryInfo: CategoryInfo) => {
            categoryInfo.annotations.forEach(annotationInfo => {
                prevObj[annotationInfo.id] = annotationInfo.metadata;
            });
            return prevObj;
        },
        {},
    );
    return metadata;
};
