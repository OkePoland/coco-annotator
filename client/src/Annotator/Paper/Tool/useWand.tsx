/**
 * Tool for selecting area around specific point ( based on colors )
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import paper from 'paper';

import { Maybe, MouseEvent, ImageSize } from '../../annotator.types';

import * as CONFIG from '../../annotator.config';

import { getPath } from '../Utils/wandUtils';

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

    // mouse events
    const onMouseDownAndDrag = useCallback(
        (event: MouseEvent) => {
            if (!imageSize) return;
            if (!imageData) return;

            const { width, height } = imageSize;

            const x = Math.round(width / 2 + event.point.x);
            const y = Math.round(height / 2 + event.point.y);

            // Check if valid coordinates
            if (x > width || y > height || x < 0 || y < 0) return;

            // Create shape
            const path = getPath({
                data: imageData.data,
                x,
                y,
                width,
                height,
                threshold: settings.threshold,
                blurRadius: settings.blur,
            });

            // apply to current annotation
            if (!path) return;

            if (event.modifiers && event.modifiers.shift) {
                subtract(path);
            } else {
                unite(path);
            }
            path.remove();
        },
        [
            imageData,
            imageSize,
            settings.threshold,
            settings.blur,
            subtract,
            unite,
        ],
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
