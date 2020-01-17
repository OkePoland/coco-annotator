import { useState, useRef, useEffect, useCallback } from 'react';
import { RefObject, WheelEvent } from 'react';
import paper from 'paper';

import { Maybe, RasterSize } from '../annotator.types';

import * as CONFIG from '../annotator.config';

interface CanvasState {
    paperRef: React.MutableRefObject<Maybe<paper.PaperScope>>;
    canvasRef: RefObject<HTMLCanvasElement>;
    imageData: {
        scale: number;
        data: Maybe<ImageData>;
        rasterSize: Maybe<RasterSize>;
    };
    centerImageAction: () => void;
    onWheelAction: (e: WheelEvent<HTMLDivElement>) => void;
}

// Initialize Paper.js and Canvas with image
const useCanvas = (imageUrl: string): CanvasState => {
    const paperRef = useRef<Maybe<paper.PaperScope>>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rasterRef = useRef<Maybe<paper.Raster>>(null);

    const [imgScale, setImgScale] = useState<number>(0); // TODO
    const [imgData, setImgData] = useState<Maybe<ImageData>>(null); // TODO
    const [rasterSize, setRasterSize] = useState<Maybe<RasterSize>>(null);

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

        setImgScale(1 / paperRef.current.view.zoom);
        paperRef.current.view.center = new paper.Point(0, 0);
    }, [canvasRef, rasterRef]);

    const onWheelAction = useCallback((e: WheelEvent<HTMLDivElement>) => {
        if (!paperRef.current || !paperRef.current.view) return;

        const view = paperRef.current.view;

        if (!view.center) return;

        const centerPt = view.center;

        if (e.altKey) {
            // pan up and down
            const delta = new paper.Point(0, CONFIG.PAN_FACTOR * e.deltaY);
            const newCenterP = centerPt.add(delta);
            paperRef.current.view.center = newCenterP;
        } else if (e.shiftKey) {
            // pan left and right
            const delta = new paper.Point(CONFIG.PAN_FACTOR * e.deltaY, 0);
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
                    ? oldZoom * CONFIG.ZOOM_FACTOR
                    : oldZoom / CONFIG.ZOOM_FACTOR;
            const beta = oldZoom / newZoom;
            const pc = viewPosition.subtract(centerPt);
            const newOffset = viewPosition
                .subtract(pc.multiply(beta))
                .subtract(centerPt);

            if (newZoom < CONFIG.ZOOM_MAX && newZoom > CONFIG.ZOOM_MIN) {
                setImgScale(1 / newZoom);
                paperRef.current.view.zoom = newZoom;
                paperRef.current.view.center = view.center.add(newOffset);
            }
        }
    }, []);

    // init Canvas
    useEffect(() => {
        if (canvasRef.current != null) {
            console.log('Canvas: Init');

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
            window.paper = paperRef.current; // TODO remove ( for debugging purpose )

            // init Raster
            rasterRef.current = new paper.Raster(imageUrl);
            rasterRef.current.locked = false; // disable interactions with the mouse
            rasterRef.current.onLoad = () => {
                if (rasterRef.current === null) return;

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
                    setImgData(data); // pass imgData for magicWand tool
                }

                // pass raster to update title
                setRasterSize({ width, height });
            };
        }

        return () => {
            console.log('Canvas: Clean');
            document.body.style.overflow = 'visible';
        };
    }, [centerImageAction, imageUrl]);

    return {
        paperRef,
        canvasRef,
        imageData: {
            scale: imgScale,
            data: imgData,
            rasterSize,
        },
        centerImageAction,
        onWheelAction,
    };
};

export default useCanvas;
