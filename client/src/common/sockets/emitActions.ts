import { socket } from './sockets';
import { SocketEvent } from './events';

/**
 * Definitions of all socket emit actions
 * which can be triggered by user
 * (to use in components)
 */

export const emitAnnotationCreate: (
    annotation: null,
    category_id: string,
) => void = (annotation, category_id) => {
    const objToDispatch = {
        action: 'create',
        annotation: annotation,
        category_id: category_id,
    };
    socket.emit(SocketEvent.ANNOTATION, objToDispatch);
};

export const emitAnnotationModify: (annotation: null, uuid: string) => void = (
    annotation,
    uuid,
) => {
    const objToDispatch = {
        action: 'modify',
        annotation: annotation,
        uuid: uuid,
    };
    socket.emit(SocketEvent.ANNOTATION, objToDispatch);
};

export const emitAnnotationDelete: (annotation: null) => void = annotation => {
    const objToDispatch = {
        action: 'delete',
        annotation: annotation,
    };
    socket.emit(SocketEvent.ANNOTATION, objToDispatch);
};

export const emitAnnotating: (active: boolean, image_id: string) => void = (
    active,
    image_id,
) => {
    const objToDispatch = { active: active, image_id };
    socket.emit(SocketEvent.ANNOTATING, objToDispatch);
};
