/**
 * Tool to subtract some specific brush from existing shape
 */
import { useRef, useState, useEffect, useCallback } from 'react';
import paper from 'paper';

import { Maybe, MouseEvent, ToolSettingsBrush } from '../../annotator.types';

import * as CONFIG from '../../annotator.config';

// interfaces
interface IToolBrush {
    (
        isActive: boolean,
        scale: number,
        preferences: Maybe<ToolSettingsBrush>,
        unite: (o: paper.Path.Circle, isUndoable?: boolean) => void,
        simplifyPath: () => void,
    ): ToolBrushResponse;
}
export interface ToolBrushResponse {
    settings: ToolSettingsBrush;
    setColor: (color: string) => void;
    setRadius: (val: number) => void;
}
interface Cache {
    brush: Maybe<paper.Path.Circle>;
    path: {
        strokeColor: string;
        strokeWidth: number;
        radius: number;
    };
}

export const useBrush: IToolBrush = (
    isActive,
    scale,
    preferences,
    unite,
    simplifyPath,
) => {
    const toolRef = useRef<Maybe<paper.Tool>>(null);
    const cache = useRef<Cache>({
        brush: null,
        path: {
            strokeColor: 'white',
            strokeWidth: CONFIG.TOOLS_BRUSH_INITIAL_STROKE_WIDTH,
            radius: CONFIG.TOOLS_BRUSH_INITIAL_RADIUS,
        },
    });
    const [settings, _setSettings] = useState<ToolSettingsBrush>({
        color: CONFIG.TOOLS_BRUSH_INITIAL_COLOR,
        radius: CONFIG.TOOLS_BRUSH_INITIAL_RADIUS,
    });

    // private actions
    const _createBrush = useCallback((center?: paper.Point) => {
        const newCenter = center || new paper.Point(0, 0);

        const brush = new paper.Path.Circle({
            strokeColor: cache.current.path.strokeColor,
            strokeWidth: cache.current.path.strokeWidth,
            radius: cache.current.path.radius,
            center: newCenter,
        });
        return brush;
    }, []);

    const _moveBrush = useCallback(
        (point: paper.Point) => {
            if (cache.current.brush == null) {
                cache.current.brush = _createBrush(point);
            }
            cache.current.brush.bringToFront();
            cache.current.brush.position = point;
        },
        [_createBrush],
    );

    const _update = useCallback(
        (isUndoable?: boolean) => {
            if (cache.current.brush != null) {
                unite(cache.current.brush, isUndoable || false);
            }
        },
        [unite],
    );

    // settings methods
    const setColor = useCallback((color: string) => {
        if (cache.current.brush != null) {
            _setSettings(oldState => ({ ...oldState, color }));
            cache.current.path.strokeColor = color;
            cache.current.brush.strokeColor = new paper.Color(color);
        }
    }, []);

    const setRadius = useCallback(
        (radius: number) => {
            if (cache.current.brush != null) {
                _setSettings(oldState => ({ ...oldState, radius }));
                cache.current.path.radius = radius;

                const position = cache.current.brush.position;
                cache.current.brush.remove();
                cache.current.brush = _createBrush(position);
            }
        },
        [_createBrush],
    );

    // mouse Events
    const onMouseDown = useCallback(
        (ev: MouseEvent) => {
            _update(true); // mark that action is undoable
        },
        [_update],
    );

    const onMouseMove = useCallback(
        (ev: MouseEvent) => {
            _moveBrush(ev.point);
        },
        [_moveBrush],
    );

    const onMouseDrag = useCallback(
        (ev: MouseEvent) => {
            _moveBrush(ev.point);
            _update();
        },
        [_update, _moveBrush],
    );

    const onMouseUp = useCallback(
        (ev: MouseEvent) => {
            simplifyPath();
        },
        [simplifyPath],
    );

    // adjust preferences
    useEffect(() => {
        _setSettings(oldState => {
            const newState = { ...oldState };
            if (preferences) {
                if (preferences.color) newState.color = preferences.color;
                if (preferences.radius) newState.radius = preferences.radius;
            }
            return newState;
        });
    }, [preferences]);

    // tool effects
    useEffect(() => {
        if (!toolRef.current) {
            toolRef.current = new paper.Tool();
        }
        toolRef.current.onMouseMove = onMouseMove;
        toolRef.current.onMouseDown = onMouseDown;
        toolRef.current.onMouseDrag = onMouseDrag;
        toolRef.current.onMouseUp = onMouseUp;
    }, [onMouseDown, onMouseMove, onMouseDrag, onMouseUp]);

    useEffect(() => {
        //this.eraser.pathOptions.strokeWidth = newScale * this.scaleFactor;
        if (cache.current.brush != null) {
            cache.current.brush.strokeWidth =
                scale * CONFIG.TOOLS_BRUSH_SCALE_FACTOR;
        }
    }, [scale]);

    useEffect(() => {
        if (cache.current.brush != null) {
            cache.current.brush.visible = isActive;
        }

        if (toolRef.current != null && isActive) {
            toolRef.current.activate();
        }
    }, [isActive]);

    return {
        settings,
        setColor,
        setRadius,
    };
};
