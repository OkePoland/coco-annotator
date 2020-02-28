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

import { findCategoryGroup } from '../Utils/groupUtils';

interface Props {
    categoryId: number;
    enabled: boolean;
    color: Maybe<string>;
    groupsRef: MutableRefObject<CategoryGroup[]>;
}

const CategoryGroupComponent: React.FC<Props> = ({
    categoryId,
    enabled,
    color,
    groupsRef,
}) => {
    useEffect(() => {
        const categoryGroup = findCategoryGroup(groupsRef.current, categoryId);
        if (categoryGroup != null) {
            if (enabled) {
                console.log(`Category display (id: ${categoryId})`);
                categoryGroup.visible = true;
            } else {
                console.log(`Category hide (id: ${categoryId})`);
                categoryGroup.visible = false;
            }
        }
    }, [categoryId, enabled, groupsRef]);

    useEffect(() => {
        const categoryGroup = findCategoryGroup(groupsRef.current, categoryId);
        if (categoryGroup != null) {
            if (color) {
                console.log(`Category set color (id: ${categoryId})`);
                categoryGroup.fillColor = new paper.Color(color);
            }
        }
    }, [categoryId, color, groupsRef]);

    return null;
};
export default CategoryGroupComponent;
