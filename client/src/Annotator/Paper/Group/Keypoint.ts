import paper from 'paper';

class Keypoint extends paper.Path {
    public pointId: number; // id is reserverd for paper.Path object
    private _point: paper.Point;

    constructor(id: number, point: paper.Point) {
        super();
        this.pointId = id;
        this._point = point;
        this.remove();

        // Copy segments from Path.Circle into new paper.Path
        // Keypoint has to inherit from paper.Path
        // because is no such class as paper.Path.Circle... only constructor :-(
        const circle = new paper.Path.Circle(point, 5);
        circle.remove();
        this.addSegments(circle.segments);
        this.closed = true;

        this.fillColor = new paper.Color('red');
    }

    move(point: paper.Point) {
        this._point = point;
        this.position = point;
    }

    get point() {
        return this._point;
    }

    set selected(val: boolean) {
        this.strokeColor = new paper.Color(val ? 'white' : 'red');
        this.bringToFront();
    }
}
export default Keypoint;
