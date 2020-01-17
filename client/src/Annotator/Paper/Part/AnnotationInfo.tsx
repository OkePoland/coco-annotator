/**
 * Fake component which observe changes in info layer
 * and react for them in a form of changes in paper.js scope object
 */
import React from 'react';
import { useEffect } from 'react';
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
    useEffect(() => {
        const group = groupsRef.current.find(
            o => o.data.categoryId === categoryId,
        );

        if (group != null) {
            const path = group.children.find(o => o.data.annotationId === id);

            if (path != null) {
                if (enabled) {
                    console.log(`Annotation display (id: ${id})`);
                    path.visible = true;
                } else {
                    console.log(`Annotation hide (id: ${id})`);
                    path.visible = false;
                }
            }
        }
    }, [id, categoryId, enabled, groupsRef]);

    useEffect(() => {
        const group = groupsRef.current.find(
            o => o.data.categoryId === categoryId,
        );

        if (group != null) {
            const path = group.children.find(o => o.data.annotationId === id);

            if (path != null) {
                if (color) {
                    console.log(`Annotation set color (id: ${id})`);
                    group.fillColor = new paper.Color(color);
                }
            }
        }
    }, [id, categoryId, color, groupsRef]);

    useEffect(() => {
        const group = groupsRef.current.find(
            o => o.data.categoryId === categoryId,
        );

        if (group != null) {
            const path = group.children.find(o => o.data.annotationId === id);

            if (path != null) {
                if (isSelected) {
                    console.log(`Annotation set selected (id: ${id})`);
                }
                path.selected = isSelected;
            }
        }
    }, [id, categoryId, isSelected, groupsRef]);

    return null;
};
export default AnnotationInfo;
