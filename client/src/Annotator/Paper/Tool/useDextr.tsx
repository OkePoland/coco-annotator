/**
 * Tool for creating segmentations ( similar to Wand tool )
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import paper from 'paper';

import { Maybe, MouseEvent, ImageSize } from '../../annotator.types';

import * as CONFIG from '../../annotator.config';

import * as AnnotatorApi from '../../annotator.api';

// interfaces
interface IToolDextr {
    (
        isActive: boolean,
        imageId: number,
        imageSize: Maybe<ImageSize>,
        unite: (a: paper.Path) => void,
    ): ToolDextrResponse;
}
export interface ToolDextrResponse {
    padding: number;
    threshold: number;
    setPadding: (value: number) => void;
    setThreshold: (value: number) => void;
}
interface Cache {
    points: paper.Path.Circle[];
}
interface Settings {
    padding: number;
    threshold: number;
}

export const useDextr: IToolDextr = (isActive, imageId, imageSize, unite) => {
    const toolRef = useRef<Maybe<paper.Tool>>(null);
    const cache = useRef<Cache>({
        points: [],
    });
    const [settings, _setSettings] = useState<Settings>({
        padding: CONFIG.TOOLS_DEXTR_INITIAL_PADDING,
        threshold: CONFIG.TOOLS_DEXTR_INITIAL_THRESHOLD,
    });

    // private actions
    const _checkPoints = useCallback(async () => {
        if (!imageSize) return;

        const width = imageSize.width / 2;
        const height = imageSize.height / 2;
        const center = new paper.Point(width, height);

        const pointsList: Array<[number, number]> = cache.current.points.map(
            pt => {
                return [
                    Math.round(width + pt.position.x),
                    Math.round(height + pt.position.y),
                ];
            },
        );
        try {
            const data = await AnnotatorApi.dextr(
                imageId,
                pointsList,
                settings,
            );
            if (data.disabled || !data.segmentaiton) return;

            const cPath = new paper.Path({}); // TODO check if compoundPath
            for (let i = 0; i < data.segmentaiton.length; i++) {
                const polygon = data.segmentaiton[i];
                const path = new paper.Path();

                for (let j = 0; j < polygon.length; j += 2) {
                    const point = new paper.Point(polygon[j], polygon[j + 1]);
                    path.add(point.subtract(center));
                }
                path.closePath();
                cPath.addChild(path);
            }
            unite(cPath);
        } finally {
            cache.current.points.forEach(point => point.remove());
            cache.current.points = [];
        }
    }, [imageId, imageSize, settings, unite]);

    const _createPoint = useCallback(
        (point: paper.Point) => {
            const pt = new paper.Path.Circle(point, 5);
            pt.fillColor = new paper.Color('black'); // TODO
            pt.data.point = point;
            cache.current.points.push(pt);
            if (cache.current.points.length >= 4) {
                _checkPoints();
            }
        },
        [_checkPoints],
    );

    const setPadding = useCallback((value: number) => {
        _setSettings(oldState => ({ ...oldState, padding: value }));
    }, []);

    const setThreshold = useCallback((value: number) => {
        _setSettings(oldState => ({ ...oldState, threshold: value }));
    }, []);

    // mouse events
    const onMouseDown = useCallback(
        (event: MouseEvent) => {
            _createPoint(event.point);
        },
        [_createPoint],
    );

    // tool effects
    useEffect(() => {
        if (!toolRef.current) {
            toolRef.current = new paper.Tool();
        }
        toolRef.current.onMouseDown = onMouseDown;
    }, [onMouseDown]);

    useEffect(() => {
        if (toolRef.current != null && isActive) {
            toolRef.current.activate();
        }
    }, [isActive]);

    return {
        padding: settings.padding,
        threshold: settings.threshold,
        setPadding,
        setThreshold,
    };
};
