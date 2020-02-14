import paper from 'paper';

import { ExportObjKeypointGroup } from '../../annotator.types';

import KeypointShape from './KeypointShape';
import { createIndicator } from '../Utils/typeGuards';

type Edge = [number, number]; // edge between two keypoints

interface KeypointData {
    pointId: number;
    x: number;
    y: number;
}

class KeypointsGroup extends paper.Group {
    private _usedIds: number[]; // array of used ids ( sorted ) - ids start from 1
    private _keypoints: KeypointShape[];

    private _edges: Edge[]; // [ [1,2], [1,3] ] - represent pairs of connected keypoints [id1, id2] - first elem is always smaller
    private _keypointsEdges: { [pointId: number]: number[] }; // keypoint.pointId -> edgeHash[]
    private _lines: { [hash: number]: paper.Path.Line }; // edgeHash -> paper.Path.Line

    private _color: paper.Color | null;
    private _lineWidth: number;

    constructor() {
        super();
        this._usedIds = [];
        this._keypoints = [];

        this._edges = [];
        this._keypointsEdges = {};

        this._lines = {};

        this._color = null;
        this._lineWidth = 4;
    }

    set color(color: paper.Color | null) {
        this._color = color;
        this._keypoints.forEach(child => {
            child.fillColor = color;
        });
        Object.values(this._lines).forEach(line => {
            line.strokeColor = color;
        });
    }

    // public
    public addKeypoint(point: paper.Point, id?: number) {
        const newId = this._getNextId(id);

        const keypoint: KeypointShape = new KeypointShape(newId, point);

        this._keypoints.push(keypoint);

        this.addChild(keypoint);
        keypoint.bringToFront();
    }

    public removeKeypoint(keypoint: KeypointShape) {
        // remove all connected lines to keypoint
        this._removeEdge(keypoint);

        // remove keypoint from group
        const idx = this._keypoints.findIndex(o => o === keypoint);
        if (idx > -1) this._keypoints.splice(idx, 1);
        keypoint.remove();
    }

    public moveKeypoint(keypoint: KeypointShape, point: paper.Point) {
        const id = keypoint.pointId;

        // move all connected lines accordingly
        const hashes = this._keypointsEdges[id];
        if (hashes) {
            hashes.forEach(edgeHash => {
                const line = this._lines[edgeHash];
                if (line) {
                    for (let i = 0; i < line.segments.length; i++) {
                        const segment = line.segments[i];
                        if (segment.point.isClose(keypoint.point, 0)) {
                            segment.point = point;
                            break;
                        }
                    }
                }
            });
        }
        keypoint.move(point);
        keypoint.bringToFront();
    }

    public linkKeypoints(k1: KeypointShape, k2: KeypointShape) {
        const pointId1 = k1.pointId;
        const pointId2 = k2.pointId;

        const edge: Edge =
            pointId1 < pointId2 ? [pointId1, pointId2] : [pointId2, pointId1];
        const edgeHash = this._hashEdge(edge);

        // remove line between two keypoints
        if (this._lines[edgeHash]) {
            this._removeEdge(k1, edgeHash);
            this._removeEdge(k2, edgeHash);
        }
        // connect two keypoint with line
        else {
            this._addEdge(edge, k1, k2);
        }
    }

    public importData(data: ExportObjKeypointGroup) {
        if (!data || !data.keypoints || data.keypoints.length === 0) return;

        const { keypoints, edges } = data;

        this._usedIds = keypoints.map(k => k.pointId).sort();

        // add keypoints
        keypoints.forEach(k => {
            this.addKeypoint(new paper.Point(k.x, k.y), k.pointId);
        });

        // link keypoints with lines
        edges.forEach(edge => {
            const [id1, id2] = edge;

            const k1 = this._keypoints.find(o => o.pointId === id1);
            const k2 = this._keypoints.find(o => o.pointId === id2);

            if (k1 && k2) {
                this._addEdge(edge, k1, k2);
            }
        });
    }

    public exportData() {
        const obj: ExportObjKeypointGroup = {
            keypoints: this._keypoints.map(k => ({
                pointId: k.pointId,
                x: k.point.x,
                y: k.point.y,
            })),
            edges: this._edges,
        };
        return obj;
    }

    // private
    private _addEdge(edge: Edge, k1: KeypointShape, k2: KeypointShape) {
        const edgeHash = this._hashEdge(edge);

        this._edges.push(edge);

        if (!this._keypointsEdges[k1.pointId])
            this._keypointsEdges[k1.pointId] = [];
        if (!this._keypointsEdges[k2.pointId])
            this._keypointsEdges[k2.pointId] = [];

        this._keypointsEdges[k1.pointId].push(edgeHash);
        this._keypointsEdges[k2.pointId].push(edgeHash);

        const line = this._createLine(k1.point, k2.point);
        this._lines[edgeHash] = line;
        line.insertAbove(k2);
    }

    private _removeEdge(keypoint: KeypointShape, edgeHashToRemove?: number) {
        const pointId = keypoint.pointId;

        if (!this._keypointsEdges[pointId]) return;

        const hashes = this._keypointsEdges[pointId];

        // remove only one edge
        if (edgeHashToRemove != null) {
            if (this._lines[edgeHashToRemove]) {
                const line = this._lines[edgeHashToRemove];
                line.remove();
                delete this._lines[edgeHashToRemove];
            }
            const idx = this._keypointsEdges[pointId].findIndex(
                o => o === edgeHashToRemove,
            );
            this._keypointsEdges[pointId].splice(idx, 1);
        }
        // blow up all edges
        else {
            hashes.forEach(edgeHash => {
                if (this._lines[edgeHash]) {
                    const line = this._lines[edgeHash];
                    line.remove();
                    delete this._lines[edgeHash];
                }
            });
            delete this._keypointsEdges[pointId];
        }

        this._edges = this._edges.filter(
            edge => edge[0] !== pointId && edge[1] !== pointId,
        );
    }

    private _hashEdge(edge: Edge) {
        // Order doesn't matter so can sort first
        const min = Math.min(edge[0], edge[1]);
        const max = Math.max(edge[0], edge[1]);
        // Cantor pairing function
        const add = min + max;
        return (1 / 2) * add * (add - 1) - max;
    }

    private _createLine(p1: paper.Point, p2: paper.Point) {
        const line = new paper.Path.Line(p1, p2);
        line.strokeColor = this._color;
        line.strokeWidth = this._lineWidth;
        line.data = createIndicator();
        line.remove();

        return line;
    }

    private _getNextId(id?: number) {
        const count = this._usedIds.length;

        let newId; // ids start from 1

        if (id) newId = id;
        else if (count === 0) newId = 1;
        else newId = this._usedIds[count - 1] + 1; // highestId + 1

        this._usedIds.push(newId);
        this._usedIds.sort();

        return newId;
    }
}
export default KeypointsGroup;
