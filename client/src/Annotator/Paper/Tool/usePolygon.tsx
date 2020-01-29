/**
 * Tool to Draw various continous paths
 * which auto-complete into polygons
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import paper from 'paper';

import { Maybe, MouseEvent } from '../../annotator.types';

import * as CONFIG from '../../annotator.config';

// interfaces
interface IToolPolygon {
    (
        isActive: boolean,
        scale: number,
        update: (a: paper.Path) => void,
    ): ToolPolygonResponse;
}
export interface ToolPolygonResponse {
    guidanceOn: boolean;
    strokeColor: string;
    minDistance: number;
    completeDistance: number;

    setGuidanceOn: (on: boolean) => void;
    setStrokeColor: (color: string) => void;
    setMinDistance: (value: number) => void;
    setCompleteDistance: (value: number) => void;
}
interface Cache {
    polygon: Maybe<paper.Path>;
    circle: Maybe<paper.Path.Circle>;
    actionPoints: number;
}
interface Settings {
    guidanceOn: boolean;
    minDistance: number;
    completeDistance: number;
    colorAuto: boolean;
    colorRadius: number;
    strokeColor: string;
    strokeWidth: number;
}

export const usePolygon: IToolPolygon = (isActive, scale, update) => {
    const toolRef = useRef<Maybe<paper.Tool>>(null);
    const cache = useRef<Cache>({
        polygon: null,
        circle: null,
        actionPoints: 0,
    });
    const [settings, setSettings] = useState<Settings>({
        guidanceOn: CONFIG.TOOLS_POLYGON_INITIAL_GUIDANCE,
        minDistance: CONFIG.TOOLS_POLYGON_INITIAL_MIN_DISTANCE,
        completeDistance: CONFIG.TOOLS_POLYGON_INITIAL_COMPLETE_DISTANCE,
        colorAuto: CONFIG.TOOLS_POLYGON_INITIAL_COLOR_AUTO,
        colorRadius: CONFIG.TOOLS_POLYGON_INITIAL_COLOR_RADIUS,
        strokeColor: CONFIG.TOOLS_POLYGON_INITIAL_STROKE_COLOR,
        strokeWidth: CONFIG.TOOLS_POLYGON_INITIAL_STROKE_WIDTH,
    });

    // private actions
    const _createPolygon = useCallback(() => {
        if (settings.colorAuto) {
            cache.current.circle = new paper.Path.Circle(
                new paper.Point(0, 0),
                settings.colorRadius,
            );
        }
        cache.current.polygon = new paper.Path({
            strokeWidth: settings.strokeWidth,
            strokeColor: settings.strokeColor,
        });
    }, [
        settings.strokeColor,
        settings.strokeWidth,
        settings.colorAuto,
        settings.colorRadius,
    ]);

    const _removeLastPoint = useCallback(() => {
        if (cache.current.polygon != null) {
            cache.current.polygon.removeSegment(
                cache.current.polygon.segments.length - 1,
            );
        }
    }, []);

    const _complete = useCallback(() => {
        if (!cache.current.polygon) return false;

        _removeLastPoint();

        cache.current.polygon.fillColor = new paper.Color('black');
        cache.current.polygon.closePath();

        update(cache.current.polygon);

        cache.current.polygon.remove();
        cache.current.polygon = null;
        if (cache.current.circle) {
            cache.current.circle.remove();
            cache.current.circle = null;
        }
        // TODO add removeUndos action
        //this.removeUndos(this.actionTypes.ADD_POINTS);
        return true;
    }, [update, _removeLastPoint]);

    const _autoComplete = useCallback(
        (minCompleteLength: number) => {
            if (cache.current.polygon == null) return false;
            if (cache.current.polygon.segments.length < minCompleteLength) {
                return false;
            }
            let last = cache.current.polygon.lastSegment.point;
            let first = cache.current.polygon.firstSegment.point;

            let completeDist: number = settings.completeDistance;
            if (last.isClose(first, completeDist)) {
                return _complete();
            }
            return false;
        },
        [_complete, settings],
    );

    const _autoStrokeColor = useCallback(
        (point: paper.Point) => {
            if (!cache.current.polygon) return;
            if (!cache.current.circle) return;

            if (!settings.colorAuto) return;

            cache.current.circle.position = point;

            // TODO parent raster & invert color
            // let raster = this.$parent.image.raster;
            // let color = raster.getAverageColor(cache.current.circle);
            // if (color) {
            //     optionsRef.current.strokeColor = invertColor(
            //         color.toCSS(true),
            //         this.color.blackOrWhite
            //    );
            // },
        },
        [settings.colorAuto],
    );

    // settings methods
    const setGuidanceOn = useCallback((guidanceOn: boolean) => {
        setSettings(oldState => ({ ...oldState, guidanceOn: guidanceOn }));
    }, []);

    const setStrokeColor = useCallback((color: string) => {
        setSettings(oldState => ({
            ...oldState,
            strokeColor: color,
        }));
        if (!cache.current.polygon) return;
        cache.current.polygon.strokeColor = new paper.Color(color);
    }, []);

    const setMinDistance = useCallback((value: number) => {
        setSettings(oldState => ({ ...oldState, minDistance: value }));

        if (toolRef.current) {
            toolRef.current.minDistance = value;
        }
    }, []);

    const setCompleteDistance = useCallback((value: number) => {
        setSettings(oldState => ({ ...oldState, completeDistance: value }));
    }, []);

    // mouse events
    const onMouseDown = useCallback(
        (event: MouseEvent) => {
            let wasNull = false;
            if (!cache.current.polygon) {
                wasNull = true;
                _createPolygon();
            }
            if (!cache.current.polygon) return;

            cache.current.actionPoints = 1;
            cache.current.polygon.add(event.point);
            if (_autoComplete(3)) return;
            if (settings.guidanceOn && wasNull) {
                cache.current.polygon.add(event.point);
            }
        },
        [_createPolygon, _autoComplete, settings],
    );

    const onMouseMove = useCallback(
        (event: MouseEvent) => {
            if (cache.current.polygon == null) return;
            if (cache.current.polygon.segments.length === 0) return;

            _autoStrokeColor(event.point);

            if (!settings.guidanceOn) return;
            _removeLastPoint();
            cache.current.polygon.add(event.point);
        },
        [_autoStrokeColor, _removeLastPoint, settings],
    );

    const onMouseDrag = useCallback(
        (event: MouseEvent) => {
            if (!cache.current.polygon) return;
            cache.current.actionPoints = cache.current.actionPoints + 1;
            _autoStrokeColor(event.point);
            cache.current.polygon.add(event.point);
            _autoComplete(30);
        },
        [_autoComplete, _autoStrokeColor],
    );

    const onMouseUp = useCallback((event: MouseEvent) => {
        if (!cache.current.polygon) return;
        // TODO add undo action
        // let action = new UndoAction({
        //   name: this.name,
        //   action: this.actionTypes.ADD_POINTS,
        //   func: this.undoPoints,
        //   args: {
        //     points: cache.current.actionPoints
        //   }
        // });
        // this.addUndo(action);
    }, []);

    // tool effects
    useEffect(() => {
        if (!toolRef.current) {
            toolRef.current = new paper.Tool();
            toolRef.current.minDistance =
                CONFIG.TOOLS_POLYGON_INITIAL_MIN_DISTANCE;
        }
        toolRef.current.onMouseMove = onMouseMove;
        toolRef.current.onMouseDown = onMouseDown;
        toolRef.current.onMouseDrag = onMouseDrag;
        toolRef.current.onMouseUp = onMouseUp;
    }, [onMouseDown, onMouseDrag, onMouseMove, onMouseUp]);

    useEffect(() => {
        if (toolRef.current != null && isActive) {
            toolRef.current.activate();
        }
    }, [isActive]);

    useEffect(() => {
        const newScale = scale * CONFIG.TOOLS_POLYGON_SCALE;

        setSettings(oldState => ({
            ...oldState,
            strokeWidth: newScale,
        }));
        if (cache.current.polygon != null) {
            cache.current.polygon.strokeWidth = newScale;
        }
    }, [scale]);

    return {
        guidanceOn: settings.guidanceOn,
        strokeColor: settings.strokeColor,
        minDistance: settings.minDistance,
        completeDistance: settings.completeDistance,
        setGuidanceOn,
        setStrokeColor,
        setMinDistance,
        setCompleteDistance,
    };
};