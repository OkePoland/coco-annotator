import paper from 'paper';

class AnnotationShape extends paper.CompoundPath {
    private _isBBOX: boolean;

    constructor(object: object, isBBOX?: boolean) {
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

    public exportData() {
        return ''; // TODO
    }
}
export default AnnotationShape;
