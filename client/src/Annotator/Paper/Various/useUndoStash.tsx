/**
 * handle undos stash
 */

import { useState, useCallback } from 'react';

import { Maybe, UndoItem } from '../../annotator.types';

import * as CONFIG from '../../annotator.config';

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
            const arr = [...list];
            arr.push(item);
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
