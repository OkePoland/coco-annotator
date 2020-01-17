import paper from 'paper';

export type Maybe<T> = T | null;

export enum Tool {
    SELECT = 'SELECT',
    BBOX = 'BBOX',
    POLYGON = 'POLYGON',
    WAND = 'WAND',
    BRUSH = 'BRUSH',
    ERASER = 'ERASER',
    KEYPOINTS = 'KEYPOINTS',
    DEXTR = 'DEXTR',
}

export interface RasterSize {
    width: number;
    height: number;
}

export interface MouseEvent {
    point: paper.Point;
    item: paper.Item;
}
