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
    enabled: boolean;
    color: Maybe<string>;
    groupsRef: MutableRefObject<paper.Group[]>;
}

const CategoryInfo: React.FC<Props> = ({ id, enabled, color, groupsRef }) => {
    useEffect(() => {
        const arr = groupsRef.current;
        const group = arr.find(o => o.data.categoryId === id);

        if (group != null) {
            if (enabled) {
                console.log(`Category display (id: ${id})`);
                group.visible = true;
            } else {
                console.log(`Category hide (id: ${id})`);
                group.visible = false;
            }
        }
    }, [groupsRef, id, enabled]);

    useEffect(() => {
        const arr = groupsRef.current;
        const group = arr.find(o => o.data.categoryId === id);

        if (group != null) {
            if (color) {
                console.log(`Category set color (id: ${id})`);
                group.fillColor = new paper.Color(color);
            }
        }
    }, [groupsRef, id, color]);

    return null;
};
export default CategoryInfo;
