import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { useStyles } from './panel.styles';

interface Props {
    generateAction(): void;
    scanAction(): void;
    importAction(): void;
    exportAction(): void;
    resetMetadataAction(): void;
}

const SubdirForm: React.FC<Props> = ({
    generateAction,
    scanAction,
    importAction,
    exportAction,
    resetMetadataAction,
}) => {
    const classes = useStyles();

    return (
        <Grid container direction="column" spacing={1}>
            <Grid item>
                <Button
                    fullWidth
                    variant="contained"
                    className={classes.generateButton}
                    onClick={generateAction}
                >
                    Generate
                </Button>
            </Grid>
            <Grid item>
                <Button
                    fullWidth
                    variant="contained"
                    className={classes.scanButton}
                    onClick={scanAction}
                >
                    Scan
                </Button>
            </Grid>
            <Grid item>
                <Button
                    fullWidth
                    color="primary"
                    variant="contained"
                    onClick={importAction}
                >
                    Import COCO
                </Button>
            </Grid>
            <Grid item>
                <Button
                    fullWidth
                    color="secondary"
                    variant="contained"
                    onClick={exportAction}
                >
                    Export COCO
                </Button>
            </Grid>
            <Grid item>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={resetMetadataAction}
                >
                    Reset Metadata
                </Button>
            </Grid>
        </Grid>
    );
};
export default SubdirForm;
