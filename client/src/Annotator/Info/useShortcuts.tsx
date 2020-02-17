import { useState } from 'react';

import { Shortcuts } from '../annotator.types';

import * as CONFIG from '../annotator.config';

const useShortcuts = (preferences?: Object) => {
    const [shortcuts, setShortcuts] = useState<Shortcuts>({
        list_move_up: CONFIG.SHORTCUT_LIST_MOVE_UP,
        list_move_down: CONFIG.SHORTCUT_LIST_MOVE_DOWN,
        list_expand: CONFIG.SHORTCUT_LIST_EXPAND,
        list_collapse: CONFIG.SHORTCUT_LIST_COLLAPSE,
        annotation_add: CONFIG.SHORTCUT_ANNOTATION_ADD,
        annotation_remove: CONFIG.SHORTCUT_ANNOTATION_REMOVE,
        undo: CONFIG.SHORTCUT_UNDO,
        save: CONFIG.SHORTCUT_SAVE,
        image_center: CONFIG.SHORTCUT_IMAGE_CENTER,
        image_next: CONFIG.SHORTCUT_IMAGE_NEXT,
        image_prev: CONFIG.SHORTCUT_IMAGE_PREV,
    });

    return {
        shortcuts,
        setShortcuts,
    };
};
export default useShortcuts;
