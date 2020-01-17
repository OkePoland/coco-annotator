/*
 * All user decisions
 */
import { useState, useCallback } from 'react';
import { Dispatch, SetStateAction } from 'react';

import { Maybe, Tool } from '../annotator.types';

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
interface SelectedState {
    category: Maybe<number>;
    annotation: Maybe<number>;
}

const useChoices: IUseChoices = () => {
    const annotateMode = useState<boolean>(true);
    const segmentMode = useState<boolean>(true);
    const [tool, _setTool] = useState<Maybe<Tool>>(Tool.BBOX);
    const [selected, _setSelected] = useState<SelectedState>({
        category: null,
        annotation: null,
    });

    const toggleTool = useCallback((name: Tool) => {
        _setTool(oldState => (oldState === name ? null : name));
    }, []);

    const setSelected = useCallback((catId: number, annotationId?: number) => {
        _setSelected({
            category: catId,
            annotation: annotationId ? annotationId : null,
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
