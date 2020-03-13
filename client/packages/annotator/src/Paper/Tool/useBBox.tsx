/**
 * Tool to Draw Rectangles & unite it with existing shapes
 */
import { useRef, useState, useEffect, useCallback } from 'react';
import paper from 'paper';

import { Maybe, MouseEvent, ToolSettingsBBOX } from '../../annotator.types';

import * as CONFIG from '../../annotator.config';

// interfaces
interface IToolBBox {
    (
        enabled: boolean,
        scale: number,
        preferences: Maybe<ToolSettingsBBOX>,
        uniteBBox: (a: paper.Path, isUndoable?: boolean) => void,
    ): ToolBBoxResponse;
}
export interface ToolBBoxResponse {
    settings: ToolSettingsBBOX;
    setColor: (color: string) => void;
}
interface Cache {
    polygon: Maybe<paper.Path>;
    point: {
        p1: Maybe<paper.Point>;
        p2: Maybe<paper.Point>;
    };
    path: {
        strokeColor: string;
        strokeWidth: number;
    };
}

export const useBBox: IToolBBox = (isActive, scale, preferences, uniteBBox) => {
    const toolRef = useRef<Maybe<paper.Tool>>(null);
    const cache = useRef<Cache>({
        polygon: null,
        point: {
            p1: null,
            p2: null,
        },
        path: {
            strokeColor: 'black',
            strokeWidth: 1,
        },
    });
    const [settings, _setSettings] = useState<ToolSettingsBBOX>({
        color: CONFIG.TOOLS_BBOX_INITIAL_COLOR,
    });

    // private actions
    const updatePolygon = useCallback(() => {
        if (!cache.current.polygon) return;
        const { p1, p2 } = cache.current.point;

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
            cache.current.polygon.add(arr[i]);
        }
    }, []);

    const createBBox = useCallback(
        (p1: paper.Point) => {
            cache.current.polygon = new paper.Path(cache.current.path);
            cache.current.point.p1 = new paper.Point(p1.x, p1.y);
            updatePolygon();
        },
        [updatePolygon],
    );

    const modifyBBox = useCallback(
        (p2: paper.Point) => {
            cache.current.point.p2 = new paper.Point(p2.x, p2.y);
            updatePolygon();
        },
        [updatePolygon],
    );

    const completeBBox = useCallback(() => {
        if (!cache.current.polygon) return;

        cache.current.polygon.fillColor = new paper.Color('black');
        cache.current.polygon.closePath();

        uniteBBox(cache.current.polygon, true); // mark that action is undoable

        cache.current.polygon.remove();
        cache.current.polygon = null;

        cache.current.point.p1 = null;
        cache.current.point.p2 = null;

        return true;
    }, [uniteBBox]);

    const removeLastBBox = useCallback(() => {
        if (cache.current.polygon != null) {
            cache.current.polygon.removeSegments();
        }
    }, []);

    // settings methods
    const setColor = useCallback((color: string) => {
        _setSettings(oldState => ({ ...oldState, color }));
        cache.current.path.strokeColor = color;
        if (cache.current.polygon) {
            cache.current.polygon.strokeColor = new paper.Color(color);
        }
    }, []);

    // mouse Events
    const onMouseDown = useCallback(
        (event: MouseEvent) => {
            if (cache.current.polygon === null) {
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
            if (!cache.current.polygon) return;
            if (cache.current.polygon.segments.length === 0) return;

            removeLastBBox();
            modifyBBox(event.point);
        },
        [modifyBBox, removeLastBBox],
    );

    // adjust preferences
    useEffect(() => {
        // setSetting + update cache variables
        if (preferences && preferences.color) {
            setColor(preferences.color);
        }
    }, [preferences, setColor]);

    // tool effects
    useEffect(() => {
        if (!toolRef.current) {
            toolRef.current = new paper.Tool();
        }
        toolRef.current.onMouseMove = onMouseMove;
        toolRef.current.onMouseDown = onMouseDown;
    }, [onMouseDown, onMouseMove]);

    useEffect(() => {
        if (toolRef.current != null && isActive) {
            toolRef.current.activate();
        } else {
            // clear cache
            if (cache.current.polygon) {
                cache.current.polygon.remove();
                cache.current.polygon = null;
            }
            cache.current.point.p1 = null;
            cache.current.point.p2 = null;
        }
    }, [isActive]);

    useEffect(() => {
        const newScale = scale * CONFIG.TOOLS_BBOX_SCALE_FACTOR;

        cache.current.path.strokeWidth = newScale;
        if (cache.current.polygon != null) {
            cache.current.polygon.strokeWidth = newScale;
        }
    }, [scale]);

    return {
        settings,
        setColor,
    };
};
