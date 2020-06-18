import { Maybe } from '../../app.types';

import { CategoryGroup, AnnotationGroup } from '../Shape';

export const findCategoryGroup = (
    groups: CategoryGroup[],
    categoryId: number,
): Maybe<CategoryGroup> => {
    const idx = groups.findIndex(o => o.data.categoryId === categoryId);

    if (idx === -1) return null;

    return groups[idx];
};

export const findAnnotationGroup = (
    groups: CategoryGroup[],
    categoryId: Maybe<number>,
    annotationId: Maybe<number>,
): Maybe<AnnotationGroup> => {
    const idx = groups.findIndex(o => o.data.categoryId === categoryId);
    if (idx === -1) return null;

    const aIdx = groups[idx].children.findIndex(
        o => o.data.annotationId === annotationId,
    );
    if (aIdx === -1) return null;

    const group = groups[idx].children[aIdx];

    if (group instanceof AnnotationGroup) return group;

    return null;
};
