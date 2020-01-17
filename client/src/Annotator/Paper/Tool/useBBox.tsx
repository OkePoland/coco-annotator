/**
 * Tool to Draw Rectangles & unite it with existing shapes
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import paper from 'paper';

import { Maybe, MouseEvent } from '../../annotator.types';

// interfaces
interface IToolBBox {
    (
        enabled: boolean,
        scale: number,
        updateAnnotation: (a: paper.Path) => void,
    ): ToolBBoxResponse;
}
export interface ToolBBoxResponse {
    color: string;
    setColor: (color: string) => void;
}
interface PointCache {
    p1: Maybe<paper.Point>;
    p2: Maybe<paper.Point>;
}
interface PathOptions {
    strokeColor: string;
    strokeWidth: number;
}

export const useBBox: IToolBBox = (isActive, scale, updateAnnotation) => {
    const toolRef = useRef<Maybe<paper.Tool>>(null);
    const polygonRef = useRef<Maybe<paper.Path>>(null);
    const pointRef = useRef<PointCache>({
        p1: null,
        p2: null,
    });
    const optionsRef = useRef<PathOptions>({
        strokeColor: 'black',
        strokeWidth: 1,
    });
    const [color, _setColor] = useState<string>('black');

    // private actions
    const updatePolygon = useCallback(() => {
        if (polygonRef.current === null) return;
        const { p1, p2 } = pointRef.current;

        let arr: Array<paper.Point> = [];
        if (p1 && p2) {
            arr = [
                p1,
                new paper.Point(p1.x, p2.y),
                p2,
                new paper.Point(p2.x, p1.y),
                p1,
            ];
        } else if (p1) {
            arr = [p1];
        }

        for (let i = 0; i < arr.length; i++) {
            polygonRef.current.add(arr[i]);
        }
    }, []);

    const createBBox = useCallback(
        (p1: paper.Point) => {
            polygonRef.current = new paper.Path(optionsRef.current);
            pointRef.current.p1 = new paper.Point(p1.x, p1.y);
            updatePolygon();
        },
        [updatePolygon],
    );

    const modifyBBox = useCallback(
        (p2: paper.Point) => {
            pointRef.current.p2 = new paper.Point(p2.x, p2.y);
            updatePolygon();
        },
        [updatePolygon],
    );

    const completeBBox = useCallback(() => {
        if (polygonRef.current === null) return;

        polygonRef.current.fillColor = new paper.Color('black');
        polygonRef.current.closePath();

        updateAnnotation(polygonRef.current); // TODO probably more parameters

        polygonRef.current.remove();
        polygonRef.current = null;

        pointRef.current.p1 = null;
        pointRef.current.p2 = null;

        //removeUndos(this.actionTypes.ADD_POINTS); // TODO implement undo mechanism
        return true;
    }, [updateAnnotation]);

    const removeLastBBox = useCallback(() => {
        if (polygonRef.current != null) {
            polygonRef.current.removeSegments();
        }
    }, []);

    // pathOptions methods
    const setColor = useCallback((color: string) => {
        _setColor(color);
        optionsRef.current.strokeColor = color;
        if (polygonRef.current != null) {
            polygonRef.current.strokeColor = new paper.Color(color);
        }
    }, []);

    // mouse Events
    const onMouseDown = useCallback(
        (event: MouseEvent) => {
            // if (polygonRef.current == null && checkAnnotationExist()) {  // TODO check if annotation exist in parent
            //     this.$parent.currentCategory.createAnnotation();
            // }

            if (polygonRef.current === null) {
                createBBox(event.point);
                return;
            }
            removeLastBBox();
            modifyBBox(event.point);

            if (completeBBox()) return;
        },
        [completeBBox, createBBox, modifyBBox, removeLastBBox],
    );

    const onMouseMove = useCallback(
        (event: MouseEvent) => {
            if (polygonRef.current === null) return;
            if (polygonRef.current.segments.length === 0) return;
            //this.autoStrokeColor(event.point);    // TODO implement

            removeLastBBox();
            modifyBBox(event.point);
        },
        [modifyBBox, removeLastBBox],
    );

    // tool effects
    useEffect(() => {
        if (toolRef.current === null) {
            toolRef.current = new paper.Tool();
        }
        toolRef.current.onMouseMove = onMouseMove;
        toolRef.current.onMouseDown = onMouseDown;
    }, [onMouseDown, onMouseMove]);

    useEffect(() => {
        if (toolRef.current != null && isActive) {
            toolRef.current.activate();
        }
    }, [isActive]);

    useEffect(() => {
        const newScale = scale * 3;

        optionsRef.current.strokeWidth = newScale;
        if (polygonRef.current != null) {
            polygonRef.current.strokeWidth = newScale;
        }
    }, [scale]);

    return {
        color,
        setColor,
    };
};
