import { useRef, useEffect, useCallback } from 'react';
import { MutableRefObject } from 'react';
import paper from 'paper';

import { Category, Annotation } from '../../common/types';
import { Maybe, SelectedState } from '../annotator.types';

import { CategoryGroup, AnnotationGroup } from './Shape';
import { findCategoryGroup, findAnnotationGroup } from './Utils/groupUtils';

// interfaces
interface IUseGroups {
    (categories: Category[], selected: SelectedState): UseGroupsResponse;
}
interface UseGroupsResponse {
    groupsRef: MutableRefObject<CategoryGroup[]>;
    creator: UseCreatorResponse;
    shapeEditor: UseShapeEditorResponse;
    keypointsEditor: UseKeypointsEditorResponse;
}
interface UseCreatorResponse {
    add: (categoryId: number, annotation: Annotation) => void;
    remove: (categoryId: number, annotationId: number) => void;
}
interface UseShapeEditorResponse {
    unite: (toAdd: paper.Path) => void;
    subtract: (toRemove: paper.Path) => void;
    simplify: () => void;
    uniteBBOX: (toAdd: paper.Path) => void;
    getPaperItem: (
        categoryId: number,
        annotationId: number,
    ) => Maybe<paper.Item>;
    replacePaperItem: (
        categoryId: number,
        annotationId: number,
        paperItem: paper.Item,
    ) => void;
}
interface UseKeypointsEditorResponse {
    add: (point: paper.Point) => void;
    remove: (id: number) => void;
}

const useGroups: IUseGroups = (categories, selected) => {
    const groupsRef = useRef<CategoryGroup[]>([]);
    const creator = useCreator(groupsRef);
    const shapeEditor = useShapeEditor(groupsRef, selected);
    const keypointsEditor = useKeypointsEditor(groupsRef, selected);

    // refresh Group
    useEffect(() => {
        console.log('Info: Refresh Groups');
        groupsRef.current.forEach(group => {
            group.remove();
        });
        groupsRef.current = [];

        const initialGroups = categories.map(category => {
            const group = new CategoryGroup(category.id);
            if (category.annotations != null) {
                const arr: AnnotationGroup[] = category.annotations.map(
                    annotation => {
                        const annotationGroup = new AnnotationGroup(
                            category.id,
                            annotation.id,
                        );
                        annotationGroup.fillColor = new paper.Color(
                            annotation.color,
                        );
                        annotationGroup.importData(
                            annotation.isbbox,
                            annotation.paper_object,
                            annotation.segmentation,
                            annotation.width,
                            annotation.height,
                            annotation.keypoints,
                        );
                        return annotationGroup;
                    },
                );
                group.addChildren(arr);
            }
            return group;
        });
        groupsRef.current = initialGroups;
    }, [categories]);

    return {
        groupsRef,
        creator,
        shapeEditor,
        keypointsEditor,
    };
};

// add/remove Annotations Groups
const useCreator = (groupsRef: MutableRefObject<CategoryGroup[]>) => {
    const add = useCallback(
        (categoryId: number, annotation: Annotation) => {
            const categoryGroup = findCategoryGroup(
                groupsRef.current,
                categoryId,
            );
            if (!categoryGroup) return;

            const newItem = new AnnotationGroup(categoryId, annotation.id);
            newItem.fillColor = new paper.Color(annotation.color);
            categoryGroup.addChild(newItem);

            console.log('Info: Create new AnnotationGroup');
        },
        [groupsRef],
    );

    const remove = useCallback(
        (categoryId: number, annotationId: number) => {
            const categoryGroup = findCategoryGroup(
                groupsRef.current,
                categoryId,
            );
            if (!categoryGroup) return;

            const aIdx = categoryGroup.children.findIndex(
                o => o.data.annotationId === annotationId,
            );
            if (aIdx === -1) return;

            categoryGroup.removeChildren(aIdx);
        },
        [groupsRef],
    );
    return { add, remove };
};

// adjust Annotations Shapes
const useShapeEditor = (
    groups: MutableRefObject<CategoryGroup[]>,
    selected: SelectedState,
) => {
    const unite = useCallback(
        (toAdd: paper.Path) => {
            const group = findAnnotationGroup(
                groups.current,
                selected.categoryId,
                selected.annotationId,
            );
            if (!group) return;

            group.uniteShape(toAdd);
        },
        [groups, selected.annotationId, selected.categoryId],
    );

    const subtract = useCallback(
        (toRemove: paper.Path) => {
            const group = findAnnotationGroup(
                groups.current,
                selected.categoryId,
                selected.annotationId,
            );
            if (!group) return;

            group.subtractShape(toRemove);
        },
        [groups, selected.annotationId, selected.categoryId],
    );

    const simplify = useCallback(() => {
        const group = findAnnotationGroup(
            groups.current,
            selected.categoryId,
            selected.annotationId,
        );
        if (!group) return;

        group.simplifyShape();
    }, [groups, selected.annotationId, selected.categoryId]);

    const uniteBBOX = useCallback(
        (toAdd: paper.Path) => {
            const group = findAnnotationGroup(
                groups.current,
                selected.categoryId,
                selected.annotationId,
            );
            if (!group) return;

            group.uniteBBOX(toAdd);
        },
        [groups, selected.annotationId, selected.categoryId],
    );

    const getPaperItem = useCallback(
        (categoryId: number, annotationId: number) => {
            const group = findAnnotationGroup(
                groups.current,
                categoryId,
                annotationId,
            );
            if (!group) return null;

            return group.getPaperItem();
        },
        [groups],
    );
    const replacePaperItem = useCallback(
        (categoryId: number, annotationId: number, path: paper.Item) => {
            const group = findAnnotationGroup(
                groups.current,
                categoryId,
                annotationId,
            );
            if (!group) return;

            group.replacePaperItem(path);
        },
        [groups],
    );

    return {
        unite,
        subtract,
        simplify,
        uniteBBOX,
        getPaperItem,
        replacePaperItem,
    };
};

// adjust Annotations Keypoints
const useKeypointsEditor = (
    groups: MutableRefObject<CategoryGroup[]>,
    selected: SelectedState,
) => {
    const add = useCallback(
        (point: paper.Point) => {
            const group = findAnnotationGroup(
                groups.current,
                selected.categoryId,
                selected.annotationId,
            );
            if (!group) return;

            group.keypoints.addKeypoint(point);
        },
        [groups, selected.annotationId, selected.categoryId],
    );

    const remove = useCallback(
        (id: number) => {
            const group = findAnnotationGroup(
                groups.current,
                selected.categoryId,
                selected.annotationId,
            );
            if (group) {
                // group.keypoints.deleteKeypoint();    // TODO
            }
        },
        [groups, selected.annotationId, selected.categoryId],
    );

    return { add, remove };
};

export default useGroups;
