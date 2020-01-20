/**
 * Utils methods to modify exisitng paper.shapes
 */
import paper from 'paper';

import { Annotation } from '../../../common/types';

export const create = (annotation: Annotation, color?: string) => {
    const item = new paper.CompoundPath({});
    item.name = 'Annotation_' + annotation.id;
    item.remove(); // newly created item is removed from project
    item.visible = false; // and not visible

    let center = new paper.Point(annotation.width / 2, annotation.height / 2);
    let children: Array<paper.Path> = [];
    annotation.segmentation.forEach(polygon => {
        let path = new paper.Path();
        for (let j = 0; j < polygon.length; j += 2) {
            let point = new paper.Point(polygon[j], polygon[j + 1]);
            path.add(point.subtract(center));
        }
        path.closePath();

        children.push(path);
    });
    item.children = children;
    item.fillColor = new paper.Color(color ? color : 'black');

    return item;
};

export const unite = (item: paper.CompoundPath, toAdd: paper.Path) => {
    // create copy of existing paper object ( + make sure that it is not insterted )
    const copy: paper.Item = item.clone({ insert: false, deep: true });

    if (copy instanceof paper.CompoundPath) {
        // unite old geometry & new geometry
        const pathItem: paper.PathItem = copy.unite(toAdd);

        // use new geometry for new Compound path
        const newItem = new paper.CompoundPath(pathItem);
        newItem.remove();

        // make sure that new object has the same important properties
        newItem.name = item.name;
        newItem.data = { ...item.data };
        newItem.fillColor = item.fillColor;

        simplifyPath(newItem);
        return newItem;
    }
    return item;
};

export const subtract = (item: paper.CompoundPath, toRemove: paper.Path) => {
    // create copy of existing paper object ( + make sure that it is not insterted )
    const copy: paper.Item = item.clone({ insert: false, deep: true });

    if (copy instanceof paper.CompoundPath) {
        // subtract new geometry from old geometry
        const pathItem: paper.PathItem = copy.subtract(toRemove);

        // use new geometry for new Compound path
        const newItem = new paper.CompoundPath(pathItem);
        newItem.remove();

        // make sure that new object has the same important properties
        newItem.name = item.name;
        newItem.data = { ...item.data };
        newItem.fillColor = item.fillColor;

        return newItem;
    }
    return item;
};

export const simplifyPath = (item: paper.CompoundPath) => {
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
