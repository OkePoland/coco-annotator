/**
 * Tool to subtract some specific brush from existing shape
 */
import { useRef, useState, useEffect, useCallback } from 'react';
import paper from 'paper';

import { Maybe, MouseEvent } from '../../annotator.types';

import * as CONFIG from '../../annotator.config';

// interfaces
interface IToolEraser {
    (
        isActive: boolean,
        scale: number,
        update: (o: paper.Path.Circle) => void,
    ): ToolEraserResponse;
}
export interface ToolEraserResponse {
    color: string;
    radius: number;
    setColor: (color: string) => void;
    setRadius: (val: number) => void;
}
interface PathOptions {
    strokeColor: string;
    strokeWidth: number;
    radius: number;
}

export const useEraser: IToolEraser = (isActive, scale, update) => {
    const toolRef = useRef<Maybe<paper.Tool>>(null);
    const brushRef = useRef<Maybe<paper.Path.Circle>>(null);
    const optionsRef = useRef<PathOptions>({
        strokeColor: 'white',
        strokeWidth: 1,
        radius: 30,
    });
    const [radius, _setRadius] = useState(30);
    const [color, _setColor] = useState('white');

    // private actions
    const createBrush = useCallback((center?: paper.Point) => {
        const newCenter = center || new paper.Point(0, 0);

        const brush = new paper.Path.Circle({
            strokeColor: optionsRef.current.strokeColor,
            strokeWidth: optionsRef.current.strokeWidth,
            radius: optionsRef.current.radius,
            center: newCenter,
        });
        return brush;
    }, []);

    const moveBrush = useCallback(
        (point: paper.Point) => {
            if (brushRef.current == null) {
                console.log('---create brush');
                brushRef.current = createBrush(point);
            }
            console.log('---move brush');
            brushRef.current.bringToFront();
            brushRef.current.position = point;
        },
        [createBrush],
    );

    const erase = useCallback(() => {
        // Undo action, will be handled on mouse down
        // Simplify, will be handled on mouse up
        //this.$parent.currentAnnotation.subtract(this.eraser.brush, false, false);
        if (brushRef.current != null) {
            update(brushRef.current);
        }
    }, [update]);

    // pathOptions methods
    const setColor = useCallback((color: string) => {
        if (brushRef.current != null) {
            _setColor(color);
            optionsRef.current.strokeColor = color;
            brushRef.current.strokeColor = new paper.Color(color);
        }
    }, []);

    const setRadius = useCallback(
        (radius: number) => {
            if (brushRef.current != null) {
                _setRadius(radius);
                optionsRef.current.radius = radius;

                const position = brushRef.current.position;
                brushRef.current.remove();
                brushRef.current = createBrush(position);
            }
        },
        [createBrush],
    );

    // mouse Events
    const onMouseMove = useCallback(
        (ev: MouseEvent) => {
            moveBrush(ev.point);
        },
        [moveBrush],
    );

    const onMouseDrag = useCallback(
        (ev: MouseEvent) => {
            moveBrush(ev.point);
            erase();
        },
        [erase, moveBrush],
    );

    const onMouseDown = useCallback(
        (ev: MouseEvent) => {
            // this.$parent.currentAnnotation.createUndoAction("Subtract"); // TODO
            erase();
        },
        [erase],
    );

    const onMouseUp = useCallback((ev: MouseEvent) => {
        // this.$parent.currentAnnotation.simplifyPath(); // TODO
    }, []);

    // tool effects
    useEffect(() => {
        if (toolRef.current === null) {
            toolRef.current = new paper.Tool();
        }
        toolRef.current.onMouseMove = onMouseMove;
        toolRef.current.onMouseDown = onMouseDown;
        toolRef.current.onMouseDrag = onMouseDrag;
        toolRef.current.onMouseUp = onMouseUp;
    }, [onMouseDown, onMouseMove, onMouseDrag, onMouseUp]);

    useEffect(() => {
        //this.eraser.pathOptions.strokeWidth = newScale * this.scaleFactor;
        if (brushRef.current != null) {
            brushRef.current.strokeWidth = scale * CONFIG.TOOL_SCALE_FACTOR;
        }
    }, [scale]);

    useEffect(() => {
        if (brushRef.current != null) {
            brushRef.current.visible = isActive;
        }

        if (toolRef.current != null && isActive) {
            toolRef.current.activate();
        }
    }, [isActive]);

    return {
        color,
        radius,
        setColor,
        setRadius,
    };
};
