import paper from 'paper';
import { Dataset, Category, Annotation, Image } from '../common/types';

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
    name: string;
    enabled: boolean;
    expanded: boolean;
    color: string;
    _data: Category;
    annotations: AnnotationInfo[];
}

export interface AnnotationInfo {
    id: number;
    name: string;
    color: string;
    enabled: boolean;
    metadata: Array<MetadataInfo>;
    _data: Annotation;
}

export interface MetadataInfo {
    key: string;
    value: string;
}

export interface TooltipMetadata {
    [key: number]: MetadataInfo[];
}

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

// Settings Types
export interface Settings {
    shortcuts: ShortcutsSettings;
    tools: ToolSettings;
}

export interface ShortcutsSettings {
    [key: string]: string;
}

export interface ToolSettings {
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

// paper canvas types
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

// paper undo types
export enum ToolEvent {
    POLYGON_ADD_POINT = 'POLYGON_ADD_POINT',
}

export type UndoItem = UndoItemShape | UndoItemTool;

export enum UndoItemType {
    SHAPE_CHANGED = 'SHAPE_CHANGED',
    TOOL_CHANGED = 'TOOL_CHANGED',
}

export interface UndoItemShape {
    type: UndoItemType.SHAPE_CHANGED;
    dispatch: {
        categoryId: number;
        annotationId: number;
        paperItem: paper.Item;
    };
}

export interface UndoItemTool {
    type: UndoItemType.TOOL_CHANGED;
    dispatch: {
        toolEvent: ToolEvent;
    };
}

// Import types
export interface ImportObj {
    categories: Category[];
    dataset: Dataset;
    preferences: Settings;
    image: Image;
}

// Export types
export interface ExportObj {
    mode: string;
    user: Settings;
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
    name: string;
    color: string;
    isbbox: boolean;
    compoundPath: Object; // Paper.Item
    keypoints: ExportObjKeypointGroup;
    metadata?: {
        [key: string]: string;
    };
}

export interface ExportObjKeypointGroup {
    keypoints: {
        pointId: number;
        x: number;
        y: number;
    }[];
    edges: [number, number][];
}
