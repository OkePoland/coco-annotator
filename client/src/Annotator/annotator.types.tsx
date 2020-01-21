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
    modifiers?: {
        shift?: boolean;
    };
}

export enum DataType {
    INDICATOR = 'INDICATOR',
    GROUP = 'GROUP',
    ANNOTATION = 'ANNOTATION',
    KEYPOINT = 'KEYPOINT',
}
export type DataGroup = {
    type: DataType.GROUP;
    categoryId: number;
};
export interface DataAnnotation {
    type: DataType.ANNOTATION;
    categoryId: number;
    annotationId: number;
    isBBox?: boolean;
}
export interface DataIndicator {
    type: DataType.INDICATOR;
}
export interface DataKeypoint {
    type: DataType.KEYPOINT;
    indexLabel: number;
    visibility: boolean;
    keypoints: {
        labels: string[];
    };
    labels: string[];
}
