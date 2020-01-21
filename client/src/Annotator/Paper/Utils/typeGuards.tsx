import {
    DataType,
    DataGroup,
    DataAnnotation,
    DataIndicator,
    DataKeypoint,
} from '../../annotator.types';

export function isGroup(obj: Object): obj is DataGroup {
    return (obj as DataGroup).type === DataType.GROUP;
}

export function isAnnotation(obj: Object): obj is DataAnnotation {
    return (obj as DataAnnotation).type === DataType.ANNOTATION;
}

export function isIndicator(obj: Object): obj is DataIndicator {
    return (obj as DataIndicator).type === DataType.INDICATOR;
}

export function isKeypoint(obj: Object): obj is DataKeypoint {
    return (obj as DataKeypoint).type === DataType.KEYPOINT;
}
