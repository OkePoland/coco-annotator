import { useMemo, MutableRefObject } from 'react';
import paper from 'paper';

import { Maybe, Tool, ImageSize } from '../annotator.types';

import useEmpty from './Tool/useEmpty';
import { useSelect, ToolSelectResponse } from './Tool/useSelect';
import { useBBox, ToolBBoxResponse } from './Tool/useBBox';
import { usePolygon, ToolPolygonResponse } from './Tool/usePolygon';
import { useBrush, ToolBrushResponse } from './Tool/useBrush';
import { useWand, ToolWandResponse } from './Tool/useWand';
import { useKeypoint, ToolKeypointResponse } from './Tool/useKeypoint';
import { useDextr, ToolDextrResponse } from './Tool/useDextr';

interface IUseTools {
    (
        paperRef: MutableRefObject<Maybe<paper.PaperScope>>,
        activeTool: Maybe<Tool>,
        selectedAnnotation: Maybe<number>,
        imageId: number,
        imageScale: number,
        imageSize: Maybe<ImageSize>,
        imageData: Maybe<ImageData>,
        unite: (toAdd: paper.Path) => void,
        subtract: (toRemove: paper.Path) => void,
        simplify: () => void,
        addKeypoint: () => void,
    ): {
        empty: null;
        select: ToolSelectResponse;
        bbox: ToolBBoxResponse;
        polygon: ToolPolygonResponse;
        brush: ToolBrushResponse;
        wand: ToolWandResponse;
        eraser: ToolBrushResponse;
        keypoint: ToolKeypointResponse;
        dextr: ToolDextrResponse;
    };
}

const useTools: IUseTools = (
    paperRef,
    activeTool,
    selectedAnnotation,
    imageId,
    imageScale,
    imageSize,
    imageData,
    unite,
    subtract,
    simplify,
    addKeypoint,
) => {
    const isDisabled: boolean = useMemo(() => {
        return activeTool === null || selectedAnnotation === null;
    }, [activeTool, selectedAnnotation]);

    // Various Tools
    const empty = useEmpty(isDisabled);

    const select = useSelect(
        paperRef,
        activeTool === Tool.SELECT && selectedAnnotation != null,
        imageScale,
    );

    const bbox = useBBox(
        activeTool === Tool.BBOX && selectedAnnotation != null,
        imageScale,
        unite,
    );
    const polygon = usePolygon(
        activeTool === Tool.POLYGON && selectedAnnotation != null,
        imageScale,
        unite,
    );
    const wand = useWand(
        activeTool === Tool.WAND && selectedAnnotation != null,
        imageSize,
        imageData,
        unite,
        subtract,
    );
    const brush = useBrush(
        activeTool === Tool.BRUSH && selectedAnnotation != null,
        imageScale,
        unite,
        simplify,
    );
    const eraser = useBrush(
        activeTool === Tool.ERASER && selectedAnnotation != null,
        imageScale,
        subtract,
        simplify,
    );
    const keypoint = useKeypoint(
        activeTool === Tool.KEYPOINT && selectedAnnotation != null,
        addKeypoint,
    );
    const dextr = useDextr(
        activeTool === Tool.DEXTR && selectedAnnotation != null,
        imageId,
        imageSize,
        unite,
    );

    return {
        empty,
        select,
        bbox,
        polygon,
        brush,
        wand,
        eraser,
        keypoint,
        dextr,
    };
};
export default useTools;
