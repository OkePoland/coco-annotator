import { useRef, useEffect, useCallback } from 'react';
import { MutableRefObject } from 'react';
import paper from 'paper';

import { Category } from '../../common/types';
import {
    SelectedState,
    DataType,
    DataGroup,
    DataAnnotation,
} from '../annotator.types';

import * as CONFIG from '../annotator.config';

import * as pathUtils from '../Paper/Utils/pathUtils';

// interfaces
interface IUseGroups {
    (categories: Category[], selected: SelectedState): UsGroupResponse;
}
export interface UsGroupResponse {
    groupsRef: MutableRefObject<paper.Group[]>;
    unite: (toAdd: paper.Path) => void;
    subtract: (toRemove: paper.Path) => void;
    simplify: () => void;
}

const useGroups: IUseGroups = (categories, selected) => {
    const groups = useRef<paper.Group[]>([]);

    const unite = useCallback(
        (toAdd: paper.Path) => {
            const idx = groups.current.findIndex(
                o => o.data.categoryId === selected.categoryId,
            );
            if (idx === -1) return;

            const aIdx = groups.current[idx].children.findIndex(
                o => o.data.annotationId === selected.annotationId,
            );
            if (aIdx === -1) return;

            let path = groups.current[idx].children[aIdx];
            if (path instanceof paper.CompoundPath) {
                const newPath = pathUtils.unite(path, toAdd);
                groups.current[idx].children[aIdx].replaceWith(newPath);
                path.remove(); // make sure that old path is removed
            }
        },
        [selected],
    );
    const subtract = useCallback(
        (toRemove: paper.Path) => {
            const idx = groups.current.findIndex(
                o => o.data.categoryId === selected.categoryId,
            );
            if (idx === -1) return;

            const aIdx = groups.current[idx].children.findIndex(
                o => o.data.annotationId === selected.annotationId,
            );
            if (aIdx === -1) return;

            let path = groups.current[idx].children[aIdx];
            if (path instanceof paper.CompoundPath) {
                const newPath = pathUtils.subtract(path, toRemove);
                groups.current[idx].children[aIdx].replaceWith(newPath);
                path.remove(); // make sure that old path is removed
            }
        },
        [selected],
    );

    const simplify = useCallback(() => {
        const idx = groups.current.findIndex(
            o => o.data.categoryId === selected.categoryId,
        );
        if (idx === -1) return;

        const aIdx = groups.current[idx].children.findIndex(
            o => o.data.annotationId === selected.annotationId,
        );
        if (aIdx === -1) return;

        let path = groups.current[idx].children[aIdx];
        if (path instanceof paper.CompoundPath) {
            pathUtils.simplify(path);
        }
    }, [selected]);

    useEffect(() => {
        const initialGroups = categories.map(cat => {
            const group = new paper.Group();
            group.name = CONFIG.CATEGORY_NAME_PREFIX + cat.id;
            const data: DataGroup = {
                type: DataType.GROUP,
                categoryId: cat.id,
            };
            group.data = data;

            if (cat.annotations != null) {
                const arr: paper.CompoundPath[] = cat.annotations.map(a => {
                    const path = pathUtils.create(a, a.color);
                    path.name = CONFIG.ANNOTATION_NAME_PREFIX + a.id;
                    path.locked = false;
                    const data: DataAnnotation = {
                        type: DataType.ANNOTATION,
                        categoryId: cat.id,
                        annotationId: a.id,
                    };
                    path.data = data;
                    return path;
                });
                group.addChildren(arr);
            }
            return group;
        });
        groups.current = initialGroups;
    }, [categories]);

    return {
        groupsRef: groups,
        unite,
        subtract,
        simplify,
    };
};
export default useGroups;
