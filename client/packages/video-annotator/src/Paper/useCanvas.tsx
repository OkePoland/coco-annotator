import { useState, useRef, useEffect, useCallback } from 'react';
import { RefObject, WheelEvent } from 'react';
import paper from 'paper';

import { Maybe, ImageSize } from '../app.types';

import * as CONFIG from '../app.config';

interface CanvasState {
    paperRef: React.MutableRefObject<Maybe<paper.PaperScope>>;
    canvasRef: RefObject<HTMLCanvasElement>;
    imageInfo: {
        scale: number;
        data: Maybe<ImageData>;
        size: Maybe<ImageSize>;
    };
    centerImageAction: () => void;
    onWheelAction: (e: WheelEvent<HTMLDivElement>) => void;
}

// Initialize Paper.js and Canvas with image
const useCanvas = (imageUrl: string): CanvasState => {
    const paperRef = useRef<Maybe<paper.PaperScope>>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rasterRef = useRef<Maybe<paper.Raster>>(null);

    const [imageScale, _setImgScale] = useState<number>(1);
    const [imageData, _setImgData] = useState<Maybe<ImageData>>(null);
    const [imageSize, _setImageSize] = useState<Maybe<ImageSize>>(null);

    const centerImageAction = useCallback(() => {
        if (!paperRef.current || !canvasRef.current || !rasterRef.current) {
            return;
        }

        const parentX = rasterRef.current.width || 0;
        const parentY = rasterRef.current.height || 0;

        paperRef.current.view.zoom = Math.min(
            (canvasRef.current.width / parentX) * 0.95,
            (canvasRef.current.height / parentY) * 0.8,
        );

        _setImgScale(1 / paperRef.current.view.zoom);
        paperRef.current.view.center = new paper.Point(0, 0);
    }, [canvasRef, rasterRef]);

    const onWheelAction = useCallback((e: WheelEvent<HTMLDivElement>) => {
        if (!paperRef.current || !paperRef.current.view) return;

        const view = paperRef.current.view;

        if (!view.center) return;

        const centerPt = view.center;

        if (e.altKey) {
            // pan up and down
            const delta = new paper.Point(
                0,
                CONFIG.CANVAS_PAN_FACTOR * e.deltaY,
            );
            const newCenterP = centerPt.add(delta);
            paperRef.current.view.center = newCenterP;
        } else if (e.shiftKey) {
            // pan left and right
            const delta = new paper.Point(
                CONFIG.CANVAS_PAN_FACTOR * e.deltaY,
                0,
            );
            const newCenterP = centerPt.add(delta);
            paperRef.current.view.center = newCenterP;
        } else {
            // changeZoom
            const viewPosition = view.viewToProject(
                new paper.Point(e.nativeEvent.offsetX, e.nativeEvent.offsetY),
            );

            const oldZoom = view.zoom || 0;
            const newZoom =
                e.deltaY < 0
                    ? oldZoom * CONFIG.CANVAS_ZOOM_FACTOR
                    : oldZoom / CONFIG.CANVAS_ZOOM_FACTOR;
            const beta = oldZoom / newZoom;
            const pc = viewPosition.subtract(centerPt);
            const newOffset = viewPosition
                .subtract(pc.multiply(beta))
                .subtract(centerPt);

            if (
                newZoom < CONFIG.CANVAS_ZOOM_MAX &&
                newZoom > CONFIG.CANVAS_ZOOM_MIN
            ) {
                _setImgScale(1 / newZoom);
                paperRef.current.view.zoom = newZoom;
                paperRef.current.view.center = view.center.add(newOffset);
            }
        }
    }, []);

    // init Canvas
    useEffect(() => {
        if (canvasRef.current != null) {
            console.log('Info: Canvas Init');

            // in order to prevent forest fires (remove scrollbar when page is active)
            document.body.style.overflow = 'hidden';

            // init Paper
            paperRef.current = new paper.PaperScope();
            paperRef.current.setup(canvasRef.current);
            paperRef.current.view.viewSize = new paper.Size(
                paperRef.current.view.size.width || 0,
                window.innerHeight,
            );
            paperRef.current.activate();
            if (CONFIG.DEBUGGING_ON) window.paper = paperRef.current; // ( for debugging purpose )

            // init Raster
            rasterRef.current = new paper.Raster(imageUrl);
            rasterRef.current.name = CONFIG.CANVAS_RASTER_PREFIX;
            rasterRef.current.locked = true; // disable interactions with the mouse
            rasterRef.current.onLoad = () => {
                if (!rasterRef.current) return;

                rasterRef.current.sendToBack();
                centerImageAction();

                const width = rasterRef.current.width || 0;
                const height = rasterRef.current.height || 0;

                // collect some fancy data for magicWand tool
                const tempCtx = document
                    .createElement('canvas')
                    .getContext('2d');
                if (tempCtx != null && rasterRef.current.image != null) {
                    tempCtx.canvas.width = width;
                    tempCtx.canvas.height = height;
                    tempCtx.drawImage(rasterRef.current.image, 0, 0);
                    const data = tempCtx.getImageData(0, 0, width, height);
                    _setImgData(data); // pass imgData for magicWand tool
                }

                // pass raster to update title
                _setImageSize({ width, height });
            };
        }

        return () => {
            console.log('Info: Canvas Clean');
            document.body.style.overflow = 'visible';
        };
    }, [centerImageAction, imageUrl]);

    return {
        paperRef,
        canvasRef,
        imageInfo: {
            scale: imageScale,
            data: imageData,
            size: imageSize,
        },
        centerImageAction,
        onWheelAction,
    };
};

export default useCanvas;
