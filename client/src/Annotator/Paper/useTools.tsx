import { useState, useMemo, MutableRefObject } from 'react';
import paper from 'paper';

import { Maybe, Tool } from '../annotator.types';

import useEmpty from './Tool/useEmpty';
import { useSelect, ToolSelectResponse } from './Tool/useSelect';
import { useBBox, ToolBBoxResponse } from './Tool/useBBox';
import { usePolygon, ToolPolygonResponse } from './Tool/usePolygon';
import { useBrush, ToolBrushResponse } from './Tool/useBrush';

interface IUseTools {
    (
        paperRef: MutableRefObject<Maybe<paper.PaperScope>>,
        activeTool: Maybe<Tool>,
        selectedAnnotation: Maybe<number>,
        unite: (toAdd: paper.Path) => void,
        subtract: (toRemove: paper.Path) => void,
        simplify: () => void,
    ): {
        empty: null;
        select: ToolSelectResponse;
        bbox: ToolBBoxResponse;
        polygon: ToolPolygonResponse;
        brush: ToolBrushResponse;
        eraser: ToolBrushResponse;
    };
}

const useTools: IUseTools = (
    paperRef,
    activeTool,
    selectedAnnotation,
    unite,
    subtract,
    simplify,
) => {
    const [scale] = useState<number>(1);

    const isDisabled: boolean = useMemo(() => {
        return activeTool === null || selectedAnnotation === null;
    }, [activeTool, selectedAnnotation]);

    // Various Tools
    const empty = useEmpty(isDisabled);

    const select = useSelect(
        paperRef,
        activeTool === Tool.SELECT && selectedAnnotation != null,
        scale, // TODO implement scale mechanism
    );

    const bbox = useBBox(
        activeTool === Tool.BBOX && selectedAnnotation != null,
        scale, // TODO implement scale mechanism
        unite,
    );
    const polygon = usePolygon(
        activeTool === Tool.POLYGON && selectedAnnotation != null,
        scale, // TODO implement scale mechanism
        unite,
    );
    const brush = useBrush(
        activeTool === Tool.BRUSH && selectedAnnotation != null,
        scale, // TODO implement scale mechanism
        unite,
        simplify,
    );
    const eraser = useBrush(
        activeTool === Tool.ERASER && selectedAnnotation != null,
        scale, // TODO implement scale mechanism
        subtract,
        simplify,
    );

    return {
        empty,
        select,
        bbox,
        polygon,
        brush,
        eraser,
    };
};
export default useTools;
