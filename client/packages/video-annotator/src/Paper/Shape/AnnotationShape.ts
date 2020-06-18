import paper from 'paper';

class AnnotationShape extends paper.CompoundPath {
    private _isBBOX: boolean;

    constructor(object: Object, isBBOX?: boolean) {
        super(object); // object might contain segments & curves from copied path
        this._isBBOX = isBBOX || false;
    }

    get isBBOX() {
        return this._isBBOX;
    }

    public activateBBOX() {
        console.log('Info: BBOX Create - All children will be removed');
        this._isBBOX = true;
        this.removeChildren();
    }

    public disableBBOX() {
        console.log('Info: BBOX Edit - BBOX properties will be lost!');
        this._isBBOX = false;
    }

    public importData(
        paper_object: Object,
        segmentation: number[][],
        width: number,
        height: number,
    ) {
        // import via 'paper_object' property
        if (
            paper_object != null &&
            paper_object instanceof Array &&
            paper_object.length === 2
        ) {
            console.log('Info: ImportedData from paper_object');
            const item = this.importJSON(JSON.stringify(paper_object));
            this.addChild(item);
            return;
        }

        // import via 'segmentation' property
        if (
            width != null &&
            height != null &&
            segmentation != null &&
            segmentation.length > 0
        ) {
            console.log('Info: ImportedData from Segmentation');

            const center = new paper.Point(width / 2, height / 2);
            for (let i = 0; i < segmentation.length; i++) {
                const polygon = segmentation[i];
                const path = new paper.Path();
                for (let j = 0; j < polygon.length; j += 2) {
                    const point = new paper.Point(polygon[j], polygon[j + 1]);
                    path.add(point.subtract(center));
                }
                path.closePath();
                this.addChild(path);
            }
            return;
        }

        console.log(
            'Warning: Failed to importData' + JSON.stringify(this.data),
        );
        return;
    }

    public exportData() {
        const json = this.exportJSON({
            asString: false,
            precision: 1,
        });
        return json;
    }
}
export default AnnotationShape;
