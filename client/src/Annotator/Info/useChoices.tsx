/*
 * All user decisions
 */
import { useState, useCallback } from 'react';
import { Dispatch, SetStateAction } from 'react';

import { Maybe, Tool, SelectedState } from '../annotator.types';

// interfaces
interface IUseChoices {
    (): UseChoicesResponse;
}
interface UseChoicesResponse {
    annotateMode: [boolean, Dispatch<SetStateAction<boolean>>];
    segmentMode: [boolean, Dispatch<SetStateAction<boolean>>];
    toolState: [Maybe<Tool>, (name: Tool) => void];
    selected: SelectedState;
    setSelected: (catId: number, annotationId?: number) => void;
}

const useChoices: IUseChoices = () => {
    const annotateMode = useState<boolean>(true);
    const segmentMode = useState<boolean>(true);
    const [tool, _setTool] = useState<Maybe<Tool>>(Tool.BBOX);
    const [selected, _setSelected] = useState<SelectedState>({
        categoryId: null,
        annotationId: null,
    });

    const toggleTool = useCallback((name: Tool) => {
        _setTool(oldState => (oldState === name ? null : name));
    }, []);

    const setSelected = useCallback((catId: number, annotationId?: number) => {
        _setSelected({
            categoryId: catId,
            annotationId: annotationId || null,
        });
    }, []);

    return {
        annotateMode,
        segmentMode,
        toolState: [tool, toggleTool],
        selected,
        setSelected,
    };
};
export default useChoices;
