import { useState, useMemo } from 'react';
import paper from 'paper';

import { Maybe, Tool } from '../annotator.types';

import useEmpty from './Tool/useEmpty';
import { useBBox, ToolBBoxResponse } from './Tool/useBBox';
import { useEraser, ToolEraserResponse } from './Tool/useEraser';

interface IUseTools {
    (
        activeTool: Maybe<Tool>,
        selectedAnnotation: Maybe<number>,
        unite: (toAdd: paper.Path) => void,
        subtract: (toRemove: paper.Path) => void,
    ): {
        empty: null;
        bbox: ToolBBoxResponse;
        eraser: ToolEraserResponse;
    };
}

const useTools: IUseTools = (
    activeTool,
    selectedAnnotation,
    unite,
    subtract,
) => {
    const [scale] = useState<number>(1);

    const isDisabled: boolean = useMemo(() => {
        return activeTool === null || selectedAnnotation === null;
    }, [activeTool, selectedAnnotation]);

    // Various Tools
    const empty = useEmpty(isDisabled);

    const bbox = useBBox(
        activeTool === Tool.BBOX && selectedAnnotation != null,
        scale, // TODO implement scale mechanism
        unite,
    );
    const eraser = useEraser(
        activeTool === Tool.ERASER && selectedAnnotation != null,
        scale, // TODO implement scale mechanism
        subtract,
    );

    return {
        empty,
        bbox,
        eraser,
    };
};
export default useTools;
