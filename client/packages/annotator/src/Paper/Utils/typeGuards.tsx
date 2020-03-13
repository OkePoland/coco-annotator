import { DataIndicator, DataType } from '../../annotator.types';

import { AnnotationShape, KeypointsGroup, KeypointShape } from '../Shape';

export function isAnnotationShape(obj: Object): obj is AnnotationShape {
    return obj instanceof AnnotationShape;
}

export function isKeypointGroup(obj: Object): obj is KeypointsGroup {
    return obj instanceof KeypointsGroup;
}

export function isKeypointShape(obj: Object): obj is KeypointShape {
    return obj instanceof KeypointShape;
}

export function isIndicator(obj: Object): obj is DataIndicator {
    return (obj as DataIndicator).type === DataType.INDICATOR;
}

export function createIndicator() {
    const obj: DataIndicator = { type: DataType.INDICATOR };
    return obj;
}
