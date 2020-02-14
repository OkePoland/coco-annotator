/**
 * Utils methods which will be ONLY used in Annotator.tsx
 * In most cases there are methods which affect/ get data
 * AnnotationInfo & AnnotationGroups simultaneously
 */
import { Dataset } from '../common/types';
import {
    Maybe,
    ExportObj,
    CategoryInfo,
    AnnotationInfo,
    Tool,
    ToolPreferences,
    SelectedState,
    ExportObjCategory,
} from './annotator.types';

import { CategoryGroup, AnnotationGroup } from './Paper/Shape';

// Export
export const createExportObj = (
    imageId: number,
    dataset: Maybe<Dataset>,
    segmentOn: boolean,
    activeTool: Maybe<Tool>,
    selected: SelectedState,
    exportTools: () => ToolPreferences,
    infoArr: CategoryInfo[],
    groupsArr: CategoryGroup[],
) => {
    const toolsData = exportTools();
    const categoriesData = exportCategories(infoArr, groupsArr);

    const obj: ExportObj = {
        mode: segmentOn ? 'segment' : 'label',
        user: toolsData,
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

    const categories = infoArr.reduce(
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
    const obj = {
        id: categoryInfo.id,
        name: categoryInfo.data.name, // TODO
        show: true,
        visualize: categoryInfo.enabled, // TODO
        color: categoryInfo.data.color, // TODO
        annotations: annotations,
        keypoint_labels: [], // TODO
        keypoint_edges: [], // TODO
    };
    return obj;
};

const createAnnotationsArray = (
    infoArr: AnnotationInfo[],
    groupsArr: paper.Item[],
) => {
    if (infoArr.length === 0) return [];

    const annotations = infoArr.reduce((prevArr: any[], annotationInfo) => {
        const annotationGroup = groupsArr.find(
            o => o.data.annotationId === annotationInfo.id,
        );
        if (annotationGroup && annotationGroup instanceof AnnotationGroup) {
            const item = parseAnnotation(annotationInfo, annotationGroup);
            prevArr.push(item); // TODO any
        }
        return prevArr;
    }, []);
    return annotations;
};

const parseAnnotation = (
    annotationInfo: AnnotationInfo,
    annotationGroup: AnnotationGroup,
) => {
    const isBBOX = annotationGroup.shape.isBBOX;
    const { shape, keypoints } = annotationGroup.exportData();

    const obj = {
        id: annotationInfo.id,
        color: annotationInfo.data.color, // TODO
        isbbox: isBBOX,
        compoundPath: shape,
        keypoints,
    };
    return obj;
};
