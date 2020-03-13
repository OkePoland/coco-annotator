/**
 * Tool for adding keypoints
 */
import { useRef, useEffect, useCallback } from 'react';
import paper from 'paper';

import { Maybe, MouseEvent } from '../../annotator.types';

// interfaces
interface IToolKeypoint {
    (
        isActive: boolean,
        addKeypoint: (a: paper.Point) => void,
    ): ToolKeypointResponse;
}
export interface ToolKeypointResponse {}

export const useKeypoint: IToolKeypoint = (isActive, addKeypoint) => {
    const toolRef = useRef<Maybe<paper.Tool>>(null);

    // mouse events
    const onMouseDown = useCallback(
        (event: MouseEvent) => {
            addKeypoint(event.point);
        },
        [addKeypoint],
    );

    // tool effects
    useEffect(() => {
        if (!toolRef.current) {
            toolRef.current = new paper.Tool();
        }
        toolRef.current.onMouseDown = onMouseDown;
    }, [onMouseDown]);

    useEffect(() => {
        if (toolRef.current != null && isActive) {
            toolRef.current.activate();
        }
    }, [isActive]);

    return {};
};
