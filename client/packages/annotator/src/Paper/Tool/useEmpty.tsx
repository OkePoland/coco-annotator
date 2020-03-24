/**
 * Paper.js doesn`t implement method like: 'tool.disable()'
 * so this tool will act as guard
 * to catch all mouse & keyboard events
 * in case there should be no tool active
 * (eg. no annotations or no activeTool selected)
 */
import { useRef, useEffect } from 'react';
import paper from 'paper';

import { Maybe } from '../../app.types';

const useEmpty = (isActive: boolean) => {
    const toolRef = useRef<Maybe<paper.Tool>>(null);

    useEffect(() => {
        if (toolRef.current === null) {
            toolRef.current = new paper.Tool();
        }
    }, []);

    useEffect(() => {
        if (toolRef.current != null && isActive) {
            toolRef.current.activate();
        }
    }, [isActive]);

    return null;
};
export default useEmpty;
