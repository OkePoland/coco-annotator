/**
 * Calculate style for canvas cursor
 */
import { makeStyles } from '@material-ui/core/styles';
import { useMemo } from 'react';

import { Maybe, Tool, Cursor } from '../app.types';

interface IUseCursor {
    (activeTool: Maybe<Tool>, selectedAnnotationId: Maybe<number>): string;
}

const useCursor: IUseCursor = (activeTool, selectedAnnotationId) => {
    const cursorObj = useMemo(() => {
        let cursor: Cursor = Cursor.DEFAULT;
        if (!selectedAnnotationId) return { cursor };

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
            case Tool.KEYPOINT:
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
    }, [activeTool, selectedAnnotationId]);

    const { cursor } = useStyles(cursorObj);
    return cursor;
};

const useStyles = makeStyles(() => ({
    cursor: {
        cursor: (props: { cursor: string }) => props.cursor,
    },
}));

export default useCursor;
