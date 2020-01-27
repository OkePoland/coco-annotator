/**
 * Tool for selecting area around specific point ( based on colors )
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import paper from 'paper';
import * as MagicWand from 'magic-wand-tool';

import { Maybe, MouseEvent, ImageSize } from '../../annotator.types';

import * as CONFIG from '../../annotator.config';

// interfaces
interface IToolWand {
    (
        isActive: boolean,
        imageSize: Maybe<ImageSize>,
        imageData: Maybe<ImageData>,
        unite: (path: paper.Path) => void,
        subtract: (path: paper.Path) => void,
    ): ToolWandResponse;
}
export interface ToolWandResponse {
    threshold: number;
    blur: number;
    setThreshold: (value: number) => void;
    setBlur: (value: number) => void;
}

interface Settings {
    threshold: number;
    blur: number;
}

export const useWand: IToolWand = (
    isActive,
    imageSize,
    imageData,
    unite,
    subtract,
) => {
    const toolRef = useRef<Maybe<paper.Tool>>(null);

    const [settings, _setSettings] = useState<Settings>({
        threshold: CONFIG.TOOLS_WAND_INITIAL_THRESHOLD,
        blur: CONFIG.TOOLS_WAND_INITIAL_BLUR,
    });

    // private actions
    const setThreshold = useCallback((value: number) => {
        _setSettings(oldState => ({ ...oldState, threshold: value }));
    }, []);

    const setBlur = useCallback((value: number) => {
        _setSettings(oldState => ({ ...oldState, blur: value }));
    }, []);

    const _flood = useCallback(
        (
            x: number,
            y: number,
            width: number,
            height: number,
            threshold: number,
            rad: number,
        ) => {
            if (!imageData) return;

            const image = {
                data: imageData.data,
                width: width,
                height: height,
                bytes: 4,
            };

            const newRadius = rad < 1 ? 1 : Math.abs(rad); // TODO check if we should save reference

            let mask = MagicWand.floodFill(image, x, y, threshold);
            mask = MagicWand.gaussBlurOnlyBorder(mask, newRadius);

            const contours = MagicWand.traceContours(mask).filter(
                x => !x.inner,
            );
            if (contours[0]) {
                let centerX = width / 2;
                let centerY = height / 2;
                let points = contours[0].points;
                points = points.map(pt => ({
                    x: pt.x + 0.5 - centerX,
                    y: pt.y + 0.5 - centerY,
                }));
                let polygon = new paper.Path(points);
                polygon.closed = true;
                return polygon;
            }
            return null;
        },
        [imageData],
    );

    // mouse events
    const onMouseDownAndDrag = useCallback(
        (event: MouseEvent) => {
            if (!imageSize) return;

            const { width, height } = imageSize;

            const x = Math.round(width / 2 + event.point.x);
            const y = Math.round(height / 2 + event.point.y);

            // Check if valid coordinates
            if (x > width || y > height || x < 0 || y < 0) return;

            // Create shape
            const path = _flood(
                x,
                y,
                width,
                height,
                settings.threshold,
                settings.blur,
            );

            // apply to current annotation
            if (!path) return; // TODO check

            if (event.modifiers && event.modifiers.shift) {
                subtract(path);
            } else {
                unite(path);
            }
            path.remove();
        },
        [_flood, imageSize, settings.threshold, settings.blur, subtract, unite],
    );

    // tool effects
    useEffect(() => {
        if (!toolRef.current) {
            toolRef.current = new paper.Tool();
        }
        toolRef.current.onMouseDown = onMouseDownAndDrag;
        toolRef.current.onMouseDrag = onMouseDownAndDrag;
    }, [onMouseDownAndDrag]);

    useEffect(() => {
        if (toolRef.current != null && isActive) {
            toolRef.current.activate();
        }
    }, [isActive]);

    return {
        threshold: settings.threshold,
        blur: settings.blur,
        setThreshold,
        setBlur,
    };
};
