import { DataIndicator, DataType } from '../../annotator.types';

import { AnnotationShape, KeypointsGroup, Keypoint } from '../Group';

export function isAnnotationShape(obj: Object): obj is AnnotationShape {
    return obj instanceof AnnotationShape;
}

export function isKeypointGroup(obj: Object): obj is KeypointsGroup {
    return obj instanceof KeypointsGroup;
}

export function isKeypoint(obj: Object): obj is Keypoint {
    return obj instanceof Keypoint;
}

export function isIndicator(obj: Object): obj is DataIndicator {
    return (obj as DataIndicator).type === DataType.INDICATOR;
}
