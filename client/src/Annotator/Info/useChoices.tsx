/*
 * All user decisions
 */
import { useState, useCallback } from 'react';
import { Dispatch, SetStateAction } from 'react';

import { Maybe, Tool, SelectedState } from '../annotator.types';

import * as CONFIG from '../annotator.config';

// interfaces
interface IUseChoices {
    (): UseChoicesResponse;
}
interface UseChoicesResponse {
    segmentMode: [boolean, Dispatch<SetStateAction<boolean>>];
    toolState: [Maybe<Tool>, (name: Tool) => void];
    selected: SelectedState;
    setSelected: (catId: number, annotationId?: number) => void;
}

const useChoices: IUseChoices = () => {
    const segmentMode = useState<boolean>(true);
    const [tool, _setTool] = useState<Maybe<Tool>>(null);
    const [selected, _setSelected] = useState<SelectedState>({
        categoryId: CONFIG.INITIAL_CATEGORY_ID,
        annotationId: CONFIG.INITIAL_ANNOTATION_ID,
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
        segmentMode,
        toolState: [tool, toggleTool],
        selected,
        setSelected,
    };
};
export default useChoices;
