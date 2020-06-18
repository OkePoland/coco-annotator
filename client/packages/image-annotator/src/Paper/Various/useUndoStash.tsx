/**
 * handle undos stash
 */

import { useState, useCallback } from 'react';

import { Maybe, UndoItem, UndoItemType } from '../../app.types';

import * as CONFIG from '../../app.config';

interface IUseUndoStashResponse {
    list: UndoItem[];
    add: (item: UndoItem) => void;
    pop: () => Maybe<UndoItem>;
    clear: () => void;
}

export const useUndoStash: () => IUseUndoStashResponse = () => {
    const [list, _setList] = useState<UndoItem[]>([]);

    const add = useCallback(
        (item: UndoItem) => {
            let arr = [...list];
            arr.push(item);
            // In case we unite some change
            // clear stash from all events related to tools ( like 'polygon add line' )
            if (item.type === UndoItemType.SHAPE_CHANGED) {
                arr = arr.filter(o => o.type === UndoItemType.SHAPE_CHANGED);
            }
            if (arr.length > CONFIG.UNDO_MAX_ITEMS) arr.shift();
            _setList(arr);
        },
        [list],
    );

    const pop = useCallback(() => {
        const arr = [...list];
        if (arr.length === 0) return null;

        const item = arr.pop();
        if (!item) return null;

        _setList(arr);
        return item;
    }, [list]);

    const clear = useCallback(() => {
        _setList([]);
    }, []);

    return {
        list,
        add,
        pop,
        clear,
    };
};

export default useUndoStash;
