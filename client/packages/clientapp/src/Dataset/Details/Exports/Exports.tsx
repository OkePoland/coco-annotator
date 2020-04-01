import React, { Fragment } from 'react';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';

import { useStyles } from './exports.styles';
import { useExportsPage } from './exports.hooks';
import { downloadExport } from '../../datasets.utils';

interface Props {
    id: number;
    name: string;
}

const Exports: React.FC<Props> = ({ id, name }) => {
    const classes = useStyles();
    const { exports } = useExportsPage(id);
    return (
        <Card className={classes.card}>
            <Box fontWeight="bold">Exports</Box>
            <Divider className={classes.divider} />
            {exports.map(o => (
                <Fragment key={o.id}>
                    <Grid
                        container
                        className={classes.item}
                        justify="space-between"
                        alignItems="center"
                    >
                        <Grid item xs={10}>
                            {`${o.id}. Exported ${
                                o.ago.length > 0 ? o.ago : 0 + ' seconds'
                            } ago`}
                            {o.tags.map(t => (
                                <Chip
                                    key={t}
                                    className={classes.chip}
                                    label={t}
                                    size="small"
                                />
                            ))}
                        </Grid>
                        <Grid item xs={2}>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => downloadExport(id, name)}
                            >
                                Download
                            </Button>
                        </Grid>
                    </Grid>
                    <Divider className={classes.divider} />
                </Fragment>
            ))}
        </Card>
    );
};
export default Exports;
