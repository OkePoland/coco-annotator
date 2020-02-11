/**
 * Utils methods to modify exisitng paper.CompundPath
 */
import paper from 'paper';

import * as CONFIG from '../../annotator.config';

import { AnnotationShape } from '../Shape';

export const unite = (
    item: AnnotationShape,
    toAdd: paper.Path,
    isBBOX: boolean,
) => {
    // create copy of existing paper object ( + make sure that it is not insterted )
    const copy: paper.Item = item.clone({ insert: false, deep: true });

    if (copy instanceof AnnotationShape) {
        // unite old geometry & new geometry
        const pathItem: paper.PathItem = copy.unite(toAdd);

        // use new geometry for new Compound path
        const newItem = new AnnotationShape(pathItem, isBBOX);
        newItem.remove();

        // make sure that new object has the same important properties
        newItem.name = item.name;
        newItem.data = { ...item.data };

        newItem.fillColor = item.fillColor;
        newItem.opacity = CONFIG.ANNOTATION_SHAPE_OPACITY;

        simplify(newItem);
        return newItem;
    }
    return item;
};

export const subtract = (item: AnnotationShape, toRemove: paper.Path) => {
    // create copy of existing paper object ( + make sure that it is not insterted )
    const copy: paper.Item = item.clone({ insert: false, deep: true });

    if (copy instanceof AnnotationShape) {
        // subtract new geometry from old geometry
        const pathItem: paper.PathItem = copy.subtract(toRemove);

        // use new geometry for new Compound path
        const newItem = new AnnotationShape(pathItem);
        newItem.remove();

        // make sure that new object has the same important properties
        newItem.name = item.name;
        newItem.data = { ...item.data };

        newItem.fillColor = item.fillColor;
        newItem.opacity = CONFIG.ANNOTATION_SHAPE_OPACITY;

        return newItem;
    }
    return item;
};

export const simplify = (item: AnnotationShape) => {
    item.flatten(1);

    const newChildren: paper.Path[] = [];
    item.children.forEach(path => {
        if (path instanceof paper.Path) {
            const points: paper.Point[] = [];
            path.segments.forEach(seg => {
                points.push(new paper.Point(seg.point.x, seg.point.y));
            });
            const newPath = new paper.Path(points);
            newPath.closePath();

            newChildren.push(newPath);
        }
    });
    item.removeChildren();
    item.addChildren(newChildren);
};
