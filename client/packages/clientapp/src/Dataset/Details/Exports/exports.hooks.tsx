import { useState, useEffect } from 'react';

import * as DatasetApi from '../../datasets.api';

interface Export {
    id: number;
    ago: string;
    tags: string[];
}

interface ExportsPageState {
    exports: Export[];
}

export const useExportsPage = (id: number): ExportsPageState => {
    const [exports, setExports] = useState<Export[]>([]);

    useEffect(() => {
        const update = async () => {
            const { data } = await DatasetApi.getExports(id);
            setExports(data);
        };
        update();
    }, [id]);

    return { exports: exports };
};
