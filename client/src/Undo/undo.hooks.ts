import { useState, useEffect, SetStateAction, Dispatch } from 'react';

import { Undo } from '../common/types';
import { InstanceType, LimitOptions } from './undo.config';
import * as UndoApi from './undo.api';
import useGlobalContext from '../common/hooks/useGlobalContext';
import { addProcess, removeProcess } from '../common/utils/globalActions';

export interface TableData {
    date: string;
    instanceType: InstanceType;
    id: number;
    name: string;
    rollback: boolean;
    delete: boolean;
}
interface TableState {
    rows: TableData[];
    deleteItem: (id: number, instance: InstanceType) => Promise<void>;
    undoItem: (id: number, instance: InstanceType) => Promise<void>;
}
interface ListState {
    undos: Undo[];
    refreshPage(): void;
}

interface UndoState {
    undosLimit: [number, Dispatch<SetStateAction<number>>];
    undosType: [InstanceType, Dispatch<SetStateAction<InstanceType>>];
    list: ListState;
    table: TableState;
}

export const useUndoPage = (): UndoState => {
    const undosLimit = useState<LimitOptions>(LimitOptions.OPTION_ONE);
    const undosType = useState<InstanceType>(InstanceType.ALL);
    const list = useList(undosLimit[0], undosType[0]);
    const table = useTable(list.undos, list.refreshPage);

    return {
        undosLimit,
        undosType,
        list,
        table,
    };
};

const useList = (undosPerPage: number, type: InstanceType): ListState => {
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
    const [rows, setRows] = useState<TableData[]>([]);

    useEffect(() => {
        setRows(
            undos.map(undo => ({
                date: `${undo.ago.length > 0 ? undo.ago : 0 + 'seconds'} ago`,
                instanceType: undo.instance,
                id: undo.id,
                name: undo.name,
                rollback: false,
                delete: false,
            })),
        );
    }, [undos]);

    const deleteItem = async (id: number, instance: InstanceType) => {
        await UndoApi.deleteItem(id, instance);
        refreshPage();
    };

    const undoItem = async (id: number, instance: InstanceType) => {
        await UndoApi.undo(id, instance);
        refreshPage();
    };

    return {
        rows,
        deleteItem,
        undoItem,
    };
};
