import paper from 'paper';

import { ExportObjKeypointGroup } from '../../annotator.types';

import * as CONFIG from '../../annotator.config';

import * as shapeUtils from '../Utils/shapeUtils';

import AnnotationShape from './AnnotationShape';
import KeypointsGroup from './KeypointsGroup';

class AnnotationGroup extends paper.Group {
    public shape: AnnotationShape;
    public keypoints: KeypointsGroup;

    constructor(categoryId: number, annotationId: number) {
        super();
        this.name = CONFIG.ANNOTATION_GROUP_PREFIX + annotationId;
        this.data = { categoryId, annotationId };

        // create keypoints
        this.keypoints = new KeypointsGroup();
        this.keypoints.name = CONFIG.ANNOTATION_KEYPOINTS_PREFIX + annotationId;

        // create shape
        const shape = new AnnotationShape({});
        shape.name = CONFIG.ANNOTATION_SHAPE_PREFIX + annotationId;
        shape.data = { categoryId, annotationId };

        shape.opacity = CONFIG.ANNOTATION_SHAPE_OPACITY;
        shape.locked = false;

        this.shape = shape;

        this.addChildren([this.shape, this.keypoints]);
    }

    set fillColor(color: paper.Color | null) {
        this.shape.fillColor = color;
        this.keypoints.color = color;
    }

    // shape methods
    public uniteShape(toAdd: paper.Path) {
        if (this.shape.isBBOX) this.shape.disableBBOX();

        const newPath = shapeUtils.unite(this.shape, toAdd, false);
        const isReplaced = this.shape.replaceWith(newPath);
        if (isReplaced) this.shape = newPath;
    }

    public subtractShape(toRemove: paper.Path) {
        if (this.shape.isBBOX) this.shape.disableBBOX();

        const newPath = shapeUtils.subtract(this.shape, toRemove);
        const isReplaced = this.shape.replaceWith(newPath);
        if (isReplaced) this.shape = newPath;
    }

    public simplifyShape() {
        if (this.shape.isBBOX) this.shape.disableBBOX();

        shapeUtils.simplify(this.shape);
    }

    public uniteBBOX(toAdd: paper.Path) {
        if (!this.shape.isBBOX) {
            this.shape.activateBBOX();

            const newPath = shapeUtils.unite(this.shape, toAdd, true);
            const isReplaced = this.shape.replaceWith(newPath);
            if (isReplaced) this.shape = newPath;
        } else {
            console.log('Info: Cannot add new BBOX to existing one');
        }
    }

    public getPaperItem() {
        const item: paper.Item = this.shape.clone({
            insert: false,
            deep: true,
        });
        return item;
    }

    public replacePaperItem(itemToReplace: paper.Item) {
        const newPath = shapeUtils.replace(this.shape, itemToReplace);
        const isReplaced = this.shape.replaceWith(newPath);
        if (isReplaced) this.shape = newPath;
    }

    public importData(
        isBBOX: boolean = false,
        paper_object: Object = {},
        segmentation: number[][] = [],
        width: number,
        height: number,
        keypoints: ExportObjKeypointGroup,
    ) {
        if (isBBOX) this.shape.activateBBOX();

        this.shape.importData(paper_object, segmentation, width, height);

        this.keypoints.importData(keypoints);
    }

    public exportData() {
        const obj = {
            shape: this.shape.exportData(),
            keypoints: this.keypoints.exportData(),
        };
        return obj;
    }
}
export default AnnotationGroup;
