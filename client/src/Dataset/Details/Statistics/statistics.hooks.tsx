import { useState, useEffect } from 'react';

import * as DatasetApi from '../../datasets.api';

export interface SingleStat {
    [name: string]: number;
}

interface Stats {
    total: SingleStat;
    average: SingleStat;
    categories: SingleStat;
    images_per_category: SingleStat;
}

export const useStatisticsPage = (id: number): Stats | null => {
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        const update = async () => {
            const { data } = await DatasetApi.getStats(id);
            setStats(data);
        };
        update();
    }, [id]);

    return stats;
};
