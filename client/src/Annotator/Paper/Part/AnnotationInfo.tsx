/**
 * Fake component which observe changes in info layer
 * and react for them in a form of changes in paper.js scope object
 */
import React from 'react';
import { useEffect, useCallback } from 'react';
import { MutableRefObject } from 'react';
import paper from 'paper';

import { Maybe } from '../../annotator.types';

interface Props {
    id: number;
    categoryId: number;
    enabled: boolean;
    color: Maybe<string>;
    isSelected: boolean;
    groupsRef: MutableRefObject<paper.Group[]>;
}

const AnnotationInfo: React.FC<Props> = ({
    id,
    categoryId,
    enabled,
    color,
    isSelected,
    groupsRef,
}) => {
    const findPath = useCallback(
        (
            groupsRef: MutableRefObject<paper.Group[]>,
            categoryId: number,
            annotationId: number,
        ) => {
            const group = groupsRef.current.find(
                o => o.data.categoryId === categoryId,
            );
            if (!group) return null;

            const path = group.children.find(
                o => o.data.annotationId === annotationId,
            );

            if (!path) return null;

            return path;
        },
        [],
    );

    useEffect(() => {
        const path = findPath(groupsRef, categoryId, id);
        if (path) {
            if (enabled) {
                console.log(`Annotation display (id: ${id})`);
                path.visible = true;
            } else {
                console.log(`Annotation hide (id: ${id})`);
                path.visible = false;
            }
        }
    }, [id, categoryId, enabled, groupsRef, findPath]);

    useEffect(() => {
        const path = findPath(groupsRef, categoryId, id);
        if (path && color) {
            console.log(`Annotation set color (id: ${id})`);
            path.fillColor = new paper.Color(color);
        }
    }, [id, categoryId, color, groupsRef, findPath]);

    useEffect(() => {
        const path = findPath(groupsRef, categoryId, id);
        if (path != null) {
            if (isSelected) {
                console.log(`Annotation set selected (id: ${id})`);
            }
            path.selected = isSelected;
        }
    }, [id, categoryId, isSelected, groupsRef, findPath]);

    return null;
};
export default AnnotationInfo;
