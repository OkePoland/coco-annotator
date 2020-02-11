import paper from 'paper';
import { Dataset, Category, Annotation } from '../common/types';

export type Maybe<T> = T | null | undefined;

// info types
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

// Tool Types
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

export interface ToolPreferences {
    select: Maybe<ToolSettingsSelect>;
    bbox: Maybe<ToolSettingsBBOX>;
    polygon: Maybe<ToolSettingsPolygon>;
    brush: Maybe<ToolSettingsBrush>;
    eraser: Maybe<ToolSettingsBrush>;
    wand: Maybe<ToolSettingsWand>;
}

export interface ToolSettingsSelect {
    tooltipOn: boolean;
}

export interface ToolSettingsBBOX {
    color: string;
}

export interface ToolSettingsPolygon {
    guidanceOn: boolean;
    minDistance: number;
    completeDistance: number;
    colorAuto: boolean;
    colorRadius: number;
    strokeColor: string;
    strokeWidth: number;
}

export interface ToolSettingsBrush {
    color: string;
    radius: number;
}

export interface ToolSettingsWand {
    threshold: number;
    blur: number;
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
    INDICATOR = 'INDICATOR',
}

export interface DataIndicator {
    type: DataType.INDICATOR;
}

// Export types
export interface ExportObj {
    mode: string;
    user: ToolPreferences;
    dataset: Maybe<Dataset>;
    image: {
        id: number;
        settings: SelectedState;
    };
    category_ids: number[];
    settings: {
        activeTool: Maybe<Tool>;
        zoom: number;
    };
    categories: ExportObjCategory[];
}

export interface ExportObjCategory {
    id: number;
    name: string;
    show: boolean;
    visualize: boolean;
    color: string;
    annotations: ExportObjAnnotation[];
}

export interface ExportObjAnnotation {
    id: number;
    color: string;
    isbbox: boolean;
    compoundPath: Object; // Paper.Item
    keypoints: ExportObjKeypointGroup;
}

export interface ExportObjKeypointGroup {
    keypoints: {
        pointId: number;
        x: number;
        y: number;
    }[];
    edges: [number, number][];
}
