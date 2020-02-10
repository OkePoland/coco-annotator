import paper from 'paper';
import { Category, Annotation } from '../common/types';

export type Maybe<T> = T | null | undefined;

// info types

export enum Tool {
    SELECT = 'SELECT',
    BBOX = 'BBOX',
    POLYGON = 'POLYGON',
    WAND = 'WAND',
    BRUSH = 'BRUSH',
    ERASER = 'ERASER',
    KEYPOINT = 'KEYPOINT',
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

export interface SelectedState {
    categoryId: Maybe<number>;
    annotationId: Maybe<number>;
}

export interface CategoryInfo {
    id: number;
    enabled: boolean;
    expanded: boolean;
    data: Category;
    annotations: AnnotationInfo[];
}

export interface AnnotationInfo {
    id: number;
    enabled: boolean;
    data: Annotation;
}

// paper types
export interface ImageSize {
    width: number;
    height: number;
}

export interface MouseEvent {
    point: paper.Point;
    item: paper.Item;
    modifiers?: {
        shift?: boolean;
    };
}
export enum DataType {
    ANNOTATION_SHAPE = 'ANNOTATION_SHAPE',
    KEYPOINT = 'KEYPOINT',
    INDICATOR = 'INDICATOR',
}

export interface DataAnnotationShape {
    categoryId: number;
    annotationId: number;
}

export interface DataKeypoint {
    categoryId: number;
    annotationId: number;
}

export interface DataIndicator {
    type: DataType.INDICATOR;
}
