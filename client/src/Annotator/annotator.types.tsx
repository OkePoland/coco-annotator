import paper from 'paper';

export type Maybe<T> = T | null | undefined;

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

export enum Cursor {
    POINTER = 'pointer',
    COPY = 'copy',
    CROSSHAIR = 'crosshair',
    CELL = 'cell',
    NONE = 'none',
    DEFAULT = 'default',
}

export interface RasterSize {
    width: number;
    height: number;
}

export interface SelectedState {
    categoryId: Maybe<number>;
    annotationId: Maybe<number>;
}

export interface MouseEvent {
    point: paper.Point;
    item: paper.Item;
}
