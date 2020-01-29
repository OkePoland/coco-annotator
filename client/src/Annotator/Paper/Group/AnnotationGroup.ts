import paper from 'paper';

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

        this.shape = shapeUtils.create(categoryId, annotationId);

        this.keypoints = new KeypointsGroup();
        this.keypoints.name = CONFIG.ANNOTATION_KEYPOINTS_PREFIX + annotationId;

        this.addChildren([this.shape, this.keypoints]);
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

    public exportData() {
        return ''; // TODO
    }
}
export default AnnotationGroup;
