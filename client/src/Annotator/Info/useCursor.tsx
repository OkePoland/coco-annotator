/**
 * Calculate style for canvas cursor
 */
import { makeStyles } from '@material-ui/core/styles';
import { useMemo } from 'react';

import { Maybe, Tool, Cursor } from '../annotator.types';

interface IUseCursor {
    (activeTool: Maybe<Tool>): string;
}

const useCursor: IUseCursor = activeTool => {
    const cursorObj = useMemo(() => {
        let cursor: Cursor = Cursor.DEFAULT;
        switch (activeTool) {
            case Tool.SELECT:
                cursor = Cursor.POINTER;
                break;
            case Tool.BBOX:
            case Tool.POLYGON:
                cursor = Cursor.COPY;
                break;
            case Tool.WAND:
            case Tool.DEXTR:
                cursor = Cursor.CROSSHAIR;
                break;
            case Tool.KEYPOINTS:
                cursor = Cursor.CELL;
                break;
            case Tool.BRUSH:
            case Tool.ERASER:
                cursor = Cursor.NONE;
                break;
            default:
                cursor = Cursor.DEFAULT;
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
