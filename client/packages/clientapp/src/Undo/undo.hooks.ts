import { useState, useEffect, SetStateAction, Dispatch } from 'react';

import { Undo, UndoType } from '../common/types';
import { LimitOptions } from './undo.config';
import * as UndoApi from './undo.api';
import useGlobalContext from '../common/hooks/useGlobalContext';
import { addProcess, removeProcess } from '../common/utils/globalActions';

export interface RowData {
    date: string;
    instanceType: UndoType;
    id: number;
    name: string;
}
interface TableState {
    rows: RowData[];
    deleteItem: (id: number, instance: UndoType) => Promise<void>;
    undoItem: (id: number, instance: UndoType) => Promise<void>;
}
interface ListState {
    undos: Undo[];
    refreshPage(): void;
}

interface UndoState {
    undosLimit: [number, Dispatch<SetStateAction<number>>];
    undosType: [UndoType, Dispatch<SetStateAction<UndoType>>];
    list: ListState;
    table: TableState;
}

export const useUndoPage = (): UndoState => {
    const undosLimit = useState<LimitOptions>(LimitOptions.OPTION_ONE);
    const undosType = useState<UndoType>(UndoType.ALL);
    const list = useList(undosLimit[0], undosType[0]);
    const table = useTable(list.undos, list.refreshPage);

    return {
        undosLimit,
        undosType,
        list,
        table,
    };
};

const useList = (undosPerPage: number, type: UndoType): ListState => {
    const [, dispatch] = useGlobalContext();

    const [generation, moveGeneration] = useState(0);
    const [undos, setUndos] = useState<Undo[]>([]);

    const refreshPage = () => {
        moveGeneration(c => c + 1);
    };

    useEffect(() => {
        const update = async () => {
            const process = `Loading undo for ${type} instance type`;

            addProcess(dispatch, process);

            const response = await UndoApi.getAll(undosPerPage, type);
            setUndos(response);

            removeProcess(dispatch, process);
        };
        update();
    }, [generation, undosPerPage, type, dispatch]);

    return {
        undos,
        refreshPage,
    };
};

export const useTable = (
    undos: Undo[],
    refreshPage: () => void,
): TableState => {
    const [rows, setRows] = useState<RowData[]>([]);

    useEffect(() => {
        setRows(
            undos.map(undo => ({
                date: `${undo.ago.length > 0 ? undo.ago : 0 + 'seconds'} ago`,
                instanceType: undo.instance,
                id: undo.id,
                name: undo.name,
            })),
        );
    }, [undos]);

    const deleteItem = async (id: number, instance: UndoType) => {
        await UndoApi.deleteItem(id, instance);
        refreshPage();
    };

    const undoItem = async (id: number, instance: UndoType) => {
        await UndoApi.undo(id, instance);
        refreshPage();
    };

    return {
        rows,
        deleteItem,
        undoItem,
    };
};
