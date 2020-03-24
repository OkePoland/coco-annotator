import { useState, useEffect, Dispatch, SetStateAction } from 'react';

import * as DatasetApi from '../../datasets.api';
import useSocketEvent from '../../../common/hooks/useSocketEvent';
import { SocketEvent } from '../../../common/sockets/events';

export interface TaskInfo {
    id: number | null;
    progress: number;
}
export interface TaskProgressState {
    scanInfo: TaskInfo;
    setScanInfo: Dispatch<SetStateAction<TaskInfo>>;
    generateInfo: TaskInfo;
    setGenerateInfo: Dispatch<SetStateAction<TaskInfo>>;
    exportInfo: TaskInfo;
    setExportInfo: Dispatch<SetStateAction<TaskInfo>>;
    importInfo: TaskInfo;
    setImportInfo: Dispatch<SetStateAction<TaskInfo>>;
    scanAction(): Promise<void>;
}

export const useTaskProgressState = (id: number): TaskProgressState => {
    const [scanInfo, setScanInfo] = useState<TaskInfo>({
        id: null,
        progress: 0,
    });
    const [generateInfo, setGenerateInfo] = useState<TaskInfo>({
        id: null,
        progress: 0,
    });
    const [exportInfo, setExportInfo] = useState<TaskInfo>({
        id: null,
        progress: 0,
    });
    const [importInfo, setImportInfo] = useState<TaskInfo>({
        id: null,
        progress: 0,
    });

    const scanAction = async () => {
        const response = await DatasetApi.scan(id);
        setScanInfo(c => ({ ...c, id: response.data.id }));
    };

    useSocketEvent(SocketEvent.TASKPROGRESS, data => {
        console.log('Socket: event: taskProgress', data);
        if (data.id === scanInfo.id) {
            setScanInfo(c => ({ ...c, progress: data.progress }));
        } else if (data.id === generateInfo.id) {
            setGenerateInfo(c => ({ ...c, progress: data.progress }));
        } else if (data.id === importInfo.id) {
            setImportInfo(c => ({ ...c, progress: data.progress }));
        } else if (data.id === exportInfo.id) {
            setExportInfo(c => ({ ...c, progress: data.progress }));
        }
    });

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (scanInfo.progress >= 100) {
                setScanInfo({ id: null, progress: 0 });
            }
            if (generateInfo.progress >= 100) {
                setGenerateInfo({ id: null, progress: 0 });
            }
            if (exportInfo.progress >= 100) {
                setExportInfo({ id: null, progress: 0 });

                await DatasetApi.getExports(id);
            }
            if (importInfo.progress >= 100) {
                setImportInfo({ id: null, progress: 0 });
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [
        id,
        scanInfo.progress,
        generateInfo.progress,
        exportInfo.progress,
        importInfo.progress,
    ]);

    return {
        scanInfo,
        setScanInfo,
        generateInfo,
        setGenerateInfo,
        exportInfo,
        setExportInfo,
        importInfo,
        setImportInfo,
        scanAction,
    };
};
