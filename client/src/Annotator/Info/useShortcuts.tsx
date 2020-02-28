import { useState, useEffect, useCallback } from 'react';

import { Maybe, ShortcutsSettings } from '../annotator.types';

import * as CONFIG from '../annotator.config';

const defaultConfiguration = {
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

    tool_select: CONFIG.SHORTCUT_TOOL_SELECT,
    tool_bbox: CONFIG.SHORTCUT_TOOL_BBOX,
    tool_polygon: CONFIG.SHORTCUT_TOOL_POLYGON,
    tool_wand: CONFIG.SHORTCUT_TOOL_WAND,
    tool_brush: CONFIG.SHORTCUT_TOOL_BRUSH,
    tool_eraser: CONFIG.SHORTCUT_TOOL_ERASER,
    tool_keypoint: CONFIG.SHORTCUT_TOOL_KEYPOINT,
    tool_dextr: CONFIG.SHORTCUT_TOOL_DEXTR,

    brush_decrease: CONFIG.SHORTCUT_BRUSH_DECREASE,
    brush_increase: CONFIG.SHORTCUT_BRUSH_INCREASE,

    polygon_close: CONFIG.SHORTCUT_POLYGON_CLOSE,
};

const useShortcuts = (initSettings: Maybe<ShortcutsSettings>) => {
    const [shortcuts, setShortcuts] = useState<ShortcutsSettings>(
        defaultConfiguration,
    );

    const restoreDefaultShortcuts = useCallback(() => {
        setShortcuts(defaultConfiguration);
    }, []);

    useEffect(() => {
        if (initSettings != null) {
            setShortcuts(initSettings);
        }
    }, [initSettings]);

    return {
        shortcuts,
        setShortcuts,
        restoreDefaultShortcuts,
    };
};
export default useShortcuts;
