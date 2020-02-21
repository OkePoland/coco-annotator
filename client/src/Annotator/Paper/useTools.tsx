import { useCallback, useMemo, MutableRefObject } from 'react';
import paper from 'paper';

import {
    Maybe,
    Tool,
    ToolEvent,
    ImageSize,
    ToolSettings,
    TooltipMetadata,
} from '../annotator.types';

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
        preferences: ToolSettings,
        activeTool: Maybe<Tool>,
        selectedAnnotation: Maybe<number>,
        imageId: number,
        imageScale: number,
        imageSize: Maybe<ImageSize>,
        imageData: Maybe<ImageData>,
        tooltipMetadata: TooltipMetadata,
        unite: (toAdd: paper.Path, isUndoable?: boolean) => void,
        subtract: (toRemove: paper.Path, isUndoable?: boolean) => void,
        uniteBBOX: (toAdd: paper.Path, isUndoable?: boolean) => void,
        simplify: () => void,
        addKeypoint: (point: paper.Point) => void,
        stashToolEvent: (toolEvent: ToolEvent) => void,
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
        exportData: () => ToolSettings;
    };
}

const useTools: IUseTools = (
    paperRef,
    preferences,
    activeTool,
    selectedAnnotation,
    imageId,
    imageScale,
    imageSize,
    imageData,
    tooltipMetadata,
    unite,
    subtract,
    uniteBBOX,
    simplify,
    addKeypoint,
    stashToolEvent,
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
        tooltipMetadata,
        preferences.select,
    );
    const bbox = useBBox(
        activeTool === Tool.BBOX && selectedAnnotation != null,
        imageScale,
        preferences.bbox,
        uniteBBOX,
    );
    const polygon = usePolygon(
        activeTool === Tool.POLYGON && selectedAnnotation != null,
        imageScale,
        preferences.polygon,
        unite,
        stashToolEvent,
    );
    const wand = useWand(
        activeTool === Tool.WAND && selectedAnnotation != null,
        imageSize,
        imageData,
        preferences.wand,
        unite,
        subtract,
    );
    const brush = useBrush(
        activeTool === Tool.BRUSH && selectedAnnotation != null,
        imageScale,
        preferences.brush,
        unite,
        simplify,
    );
    const eraser = useBrush(
        activeTool === Tool.ERASER && selectedAnnotation != null,
        imageScale,
        preferences.eraser,
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

    const exportData = useCallback(() => {
        const obj: ToolSettings = {
            select: select.settings,
            bbox: bbox.settings,
            polygon: polygon.settings,
            brush: brush.settings,
            eraser: eraser.settings,
            wand: wand.settings,
        };
        return obj;
    }, [
        select.settings,
        bbox.settings,
        polygon.settings,
        brush.settings,
        eraser.settings,
        wand.settings,
    ]);

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
        exportData,
    };
};
export default useTools;
