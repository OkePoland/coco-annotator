/**
 * Fake component which observes changes in info layer
 * and reacts to them in a form of changes in paper.js scope object
 */
import React from 'react';
import { useEffect } from 'react';
import { MutableRefObject } from 'react';
import paper from 'paper';

import { Maybe } from '../../annotator.types';

import { CategoryGroup } from '../Shape';

import { findAnnotationGroup } from '../Utils/groupUtils';

interface Props {
    categoryId: number;
    annotationId: number;
    enabled: boolean;
    color: Maybe<string>;
    isSelected: boolean;
    groupsRef: MutableRefObject<CategoryGroup[]>;
}

const AnnotationGroupComponent: React.FC<Props> = ({
    categoryId,
    annotationId,
    enabled,
    color,
    isSelected,
    groupsRef,
}) => {
    useEffect(() => {
        const annotationGroup = findAnnotationGroup(
            groupsRef.current,
            categoryId,
            annotationId,
        );
        if (annotationGroup) {
            if (enabled) {
                console.log(`Annotation display (id: ${annotationId})`);
                annotationGroup.visible = true;
            } else {
                console.log(
                    `Annotation hide (id: ${annotationGroup.data.annotationId})`,
                );
                annotationGroup.visible = false;
            }
        }
    }, [categoryId, annotationId, enabled, groupsRef]);

    useEffect(() => {
        const annotationGroup = findAnnotationGroup(
            groupsRef.current,
            categoryId,
            annotationId,
        );
        if (annotationGroup && color) {
            console.log(`Annotation set color (id: ${annotationId})`);
            annotationGroup.fillColor = new paper.Color(color);
        }
    }, [categoryId, annotationId, color, groupsRef]);

    useEffect(() => {
        const annotationGroup = findAnnotationGroup(
            groupsRef.current,
            categoryId,
            annotationId,
        );
        if (annotationGroup) {
            if (isSelected) {
                console.log(`Annotation set selected (id: ${annotationId})`);
                annotationGroup.selected = isSelected;
                annotationGroup.bringToFront();
            } else {
                annotationGroup.selected = false;
            }
        }
    }, [categoryId, annotationId, isSelected, groupsRef]);

    return null;
};
export default AnnotationGroupComponent;
