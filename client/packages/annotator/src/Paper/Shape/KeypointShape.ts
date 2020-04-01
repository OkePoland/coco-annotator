import paper from 'paper';

import * as CONFIG from '../../app.config';

class KeypointShape extends paper.Path {
    public pointId: number; // id is reserverd for paper.Path object
    private _point: paper.Point;

    constructor(id: number, point: paper.Point) {
        super();
        this.pointId = id;
        this._point = point;
        this.remove();

        // Copy segments from Path.Circle into new paper.Path
        // Keypoint has to inherit from paper.Path
        // because there is no such class as paper.Path.Circle... only constructor :-(
        const circle = new paper.Path.Circle(point, CONFIG.KEYPOINT_SHAPE_SIZE);
        circle.remove();
        this.addSegments(circle.segments);
        this.closed = true;
    }

    move(point: paper.Point) {
        this._point = point;
        this.position = point;
    }

    get point(): paper.Point {
        return this._point;
    }

    set selected(val: boolean) {
        this.strokeColor = val ? new paper.Color('white') : this.fillColor;
        this.bringToFront();
    }
}
export default KeypointShape;
