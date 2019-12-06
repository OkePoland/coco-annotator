import React from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useStyles } from './details.styles';
import { usePage } from './details.hooks';

import TitleBar from './Panel/TitleBar';
import ButtonsBar from './Panel/ButtonsBar';
import SubdirForm from './Panel/SubdirForm';
import FilterForm from './Panel/FilterForm';

import TabPanel from './TabPanel';
import Tabs from './Tabs';
import Breadcrumb from './Breadcrumb';
import Images from './Images/Images';
import Exports from './Exports/Exports';
import Members from './Members/Members';
import Statistics from './Statistics/Statistics';

const Details: React.FC<{ id: number }> = ({ id }) => {
    const classes = useStyles();
    const {
        tabs: [tabId, setTabId],
        filters,
        folder: [folder, setFolder],
        details: {
            dataset,
            subdirectories,
            imagesCount,
            images,
            page,
            pagesCount,
            setPage,
        },
        actions: {
            generateAction,
            scanAction,
            importAction,
            exportAction,
            deleteImageAction,
            annotateImageAction,
            downloadImageAction,
            resetMetadataAction,
        },
    } = usePage(id);

    if (dataset == null) {
        return (
            <Box textAlign="center" mt={2}>
                <CircularProgress />
            </Box>
        );
    }
    return (
        <Grid container>
            <Grid item xs={3} sm={2}>
                <Paper className={classes.panel}>
                    <TitleBar
                        title={dataset.name}
                        imagesCount={imagesCount}
                        pagesCount={pagesCount}
                    />
                    <ButtonsBar
                        generateAction={generateAction}
                        scanAction={scanAction}
                        importAction={importAction}
                        exportAction={exportAction}
                        resetMetadataAction={resetMetadataAction}
                    />

                    <SubdirForm
                        folder={folder}
                        setFolder={setFolder}
                        subdirectories={subdirectories}
                    />

                    <Paper>
                        <Box p={1}>
                            <FilterForm filters={filters} />
                        </Box>
                    </Paper>
                </Paper>
            </Grid>
            <Grid item xs={9} sm={10}>
                <Tabs tabId={tabId} setTabId={setTabId} />

                <Container>
                    <TabPanel activeTab={tabId} index={0}>
                        <Breadcrumb />
                        <Images
                            images={images}
                            page={page}
                            pagesCount={pagesCount}
                            setPage={setPage}
                            deleteImageAction={deleteImageAction}
                            annotateImageAction={annotateImageAction}
                            downloadImageAction={downloadImageAction}
                        />
                    </TabPanel>
                    <TabPanel activeTab={tabId} index={1}>
                        <Exports id={id} />
                    </TabPanel>
                    <TabPanel activeTab={tabId} index={2}>
                        <Members id={id} />
                    </TabPanel>
                    <TabPanel activeTab={tabId} index={3}>
                        <Statistics id={id} />
                    </TabPanel>
                </Container>
            </Grid>
        </Grid>
    );
};
export default Details;
