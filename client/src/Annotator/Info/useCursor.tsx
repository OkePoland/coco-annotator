/**
 * Calculate style for canvas cursor
 */
import { makeStyles } from '@material-ui/core/styles';
import { useMemo } from 'react';

import { Maybe, Tool } from '../annotator.types';

interface IUseCursor {
    (activeTool: Maybe<Tool>): string;
}

const useCursor: IUseCursor = activeTool => {
    const cursorObj = useMemo(() => {
        let cursor: string = 'default';
        switch (activeTool) {
            case Tool.SELECT:
                cursor = 'pointer';
                break;
            case Tool.BBOX:
            case Tool.POLYGON:
                cursor = 'copy';
                break;
            case Tool.WAND:
            case Tool.DEXTR:
                cursor = 'crosshair';
                break;
            case Tool.KEYPOINTS:
                cursor = 'cell';
                break;
            case Tool.BRUSH:
            case Tool.ERASER:
                cursor = 'none';
                break;
            default:
                cursor = 'default';
                break;
        }
        return { cursor };
    }, [activeTool]);

    const { cursor } = useStyles(cursorObj);
    return cursor;
};

const useStyles = makeStyles(() => ({
    cursor: {
        cursor: (props: { cursor: string }) => props.cursor,
    },
}));

export default useCursor;
