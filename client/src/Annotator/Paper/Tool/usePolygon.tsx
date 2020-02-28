/**
 * Tool to Draw various continous paths
 * which auto-complete into polygons
 */
import { useRef, useState, useEffect, useCallback } from 'react';
import paper from 'paper';

import {
    Maybe,
    MouseEvent,
    ToolSettingsPolygon,
    ToolEvent,
} from '../../annotator.types';

import * as CONFIG from '../../annotator.config';

// interfaces
interface IToolPolygon {
    (
        isActive: boolean,
        scale: number,
        preferences: Maybe<ToolSettingsPolygon>,
        unite: (path: paper.Path, isUndoable?: boolean) => void,
        stashToolEvent: (toolEvent: ToolEvent) => void,
    ): ToolPolygonResponse;
}
export interface ToolPolygonResponse {
    settings: ToolSettingsPolygon;
    setGuidanceOn: (on: boolean) => void;
    setStrokeColor: (color: string) => void;
    setMinDistance: (value: number) => void;
    setCompleteDistance: (value: number) => void;
    undoLastPoint: () => void;
    closePath: () => void;
}
interface Cache {
    polygon: Maybe<paper.Path>;
    circle: Maybe<paper.Path.Circle>;
    actionPoints: number;
}

export const usePolygon: IToolPolygon = (
    isActive,
    scale,
    preferences,
    unite,
    stashToolEvent,
) => {
    const toolRef = useRef<Maybe<paper.Tool>>(null);
    const cache = useRef<Cache>({
        polygon: null,
        circle: null,
        actionPoints: 0,
    });
    const [settings, _setSettings] = useState<ToolSettingsPolygon>({
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

    const closePath = useCallback(() => {
        if (!cache.current.polygon) return false;

        _removeLastPoint();

        cache.current.polygon.closePath();

        unite(cache.current.polygon, true); // mark that action is undoable

        cache.current.polygon.remove();
        cache.current.polygon = null;
        if (cache.current.circle) {
            cache.current.circle.remove();
            cache.current.circle = null;
        }
        return true;
    }, [_removeLastPoint, unite]);

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
                return closePath();
            }
            return false;
        },
        [closePath, settings],
    );

    const _autoStrokeColor = useCallback(
        (point: paper.Point) => {
            if (!cache.current.polygon) return;
            if (!cache.current.circle) return;

            if (!settings.colorAuto) return;

            cache.current.circle.position = point;
        },
        [settings.colorAuto],
    );

    // settings methods
    const setGuidanceOn = useCallback((guidanceOn: boolean) => {
        _setSettings(oldState => ({ ...oldState, guidanceOn: guidanceOn }));
    }, []);

    const setStrokeColor = useCallback((color: string) => {
        _setSettings(oldState => ({
            ...oldState,
            strokeColor: color,
        }));
        if (!cache.current.polygon) return;
        cache.current.polygon.strokeColor = new paper.Color(color);
    }, []);

    const setMinDistance = useCallback((value: number) => {
        _setSettings(oldState => ({ ...oldState, minDistance: value }));

        if (toolRef.current) {
            toolRef.current.minDistance = value;
        }
    }, []);

    const setCompleteDistance = useCallback((value: number) => {
        _setSettings(oldState => ({ ...oldState, completeDistance: value }));
    }, []);

    const undoLastPoint = useCallback(() => {
        if (!cache.current.polygon) return;

        const length = cache.current.polygon.segments.length;
        if (length === 0) return;

        cache.current.polygon.removeSegments(length - 1, length);
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

    const onMouseUp = useCallback(() => {
        if (!cache.current.polygon) return;

        stashToolEvent(ToolEvent.POLYGON_ADD_POINT);
    }, [stashToolEvent]);

    // adjust preferences
    useEffect(() => {
        // setSetting + update cache variables
        if (preferences) {
            if (preferences.guidanceOn) {
                setGuidanceOn(preferences.guidanceOn);
            }
            if (preferences.strokeColor)
                setStrokeColor(preferences.strokeColor);
            if (preferences.minDistance)
                setMinDistance(preferences.minDistance);
            if (preferences.completeDistance)
                setCompleteDistance(preferences.completeDistance);
        }
    }, [
        preferences,
        setCompleteDistance,
        setGuidanceOn,
        setMinDistance,
        setStrokeColor,
    ]);

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
        } else {
            // clear cache
            if (cache.current.polygon) {
                cache.current.polygon.remove();
                cache.current.polygon = null;
            }
            if (cache.current.circle) {
                cache.current.circle.remove();
                cache.current.circle = null;
            }
            cache.current.actionPoints = 0;
        }
    }, [isActive]);

    useEffect(() => {
        const newScale = scale * CONFIG.TOOLS_POLYGON_SCALE;

        _setSettings(oldState => ({
            ...oldState,
            strokeWidth: newScale,
        }));
        if (cache.current.polygon != null) {
            cache.current.polygon.strokeWidth = newScale;
        }
    }, [scale]);

    return {
        settings,
        setGuidanceOn,
        setStrokeColor,
        setMinDistance,
        setCompleteDistance,
        undoLastPoint,
        closePath,
    };
};
