import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import { useStatisticsPage } from './statistics.hooks';
import StatsCard from './StatsCard';

interface Props {
    id: number;
}

const Statistics: React.FC<Props> = ({ id }) => {
    const stats = useStatisticsPage(id);

    if (stats == null) {
        return <Box>Crunching numbers...</Box>;
    }

    return (
        <Grid container spacing={3}>
            {stats.total && (
                <Grid item xs={12} sm={6}>
                    <StatsCard title="Total" data={stats.total} />
                </Grid>
            )}
            {stats.average && (
                <Grid item xs={12} sm={6}>
                    <StatsCard title="Average" data={stats.average} />
                </Grid>
            )}
            {stats.categories && (
                <Grid item xs={12} sm={6}>
                    <StatsCard
                        title="Annotations Per Category"
                        data={stats.categories}
                    />
                </Grid>
            )}
            {stats.images_per_category && (
                <Grid item xs={12} sm={6}>
                    <StatsCard
                        title="Annotations Per Category"
                        data={stats.images_per_category}
                    />
                </Grid>
            )}
        </Grid>
    );
};

export default Statistics;
