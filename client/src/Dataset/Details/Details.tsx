import React from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
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
    const {
        tabs: [tabId, setTabId],
        filters,
        folders,
        setFolders,
        details: {
            offset: [offset, setOffset],
            dataset,
            categoryTags,
            categories,
            subdirectories,
            imagesCount,
            images,
            pagesCount,
            setPage,
        },
        sidebar: { width, sidebarRef, handleMouseDown },
        dialogs,
        actions: {
            deleteImageAction,
            annotateImageAction,
            resetMetadataAction,
            removeFolder,
        },
    } = usePage(id);

    const classes = useStyles({ width });

    if (dataset == null) {
        return (
            <Box textAlign="center" mt={2}>
                <CircularProgress />
            </Box>
        );
    }
    return (
        <Grid container className={classes.root}>
            <Grid item lg={2} md={3} sm={5} xs={6}>
                <div ref={sidebarRef}>
                    <Drawer
                        className={classes.drawer}
                        variant="permanent"
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        anchor="left"
                    >
                        <div
                            id="dragger"
                            onMouseDown={(event: React.MouseEvent) => {
                                handleMouseDown(event);
                            }}
                            className={classes.dragger}
                        />
                        <Toolbar />
                        <TitleBar
                            title={dataset.name}
                            imagesCount={imagesCount}
                            pagesCount={pagesCount}
                        />
                        <ButtonsBar
                            id={id}
                            categories={categories}
                            tags={categoryTags}
                            dialogs={dialogs}
                            resetMetadataAction={resetMetadataAction}
                        />
                        <Divider className={classes.divider} />
                        <SubdirForm
                            folders={folders}
                            setFolders={setFolders}
                            subdirectories={subdirectories}
                        />
                        <Divider className={classes.divider} />
                        <Paper>
                            <Box p={1}>
                                <FilterForm filters={filters} />
                            </Box>
                        </Paper>
                        <Box mb={5} />
                    </Drawer>
                </div>
            </Grid>
            <Grid
                item
                className={classes.container}
                lg={10}
                md={9}
                sm={7}
                xs={6}
            >
                <AppBar className={classes.appBar}>
                    <Toolbar />
                    <Tabs tabId={tabId} setTabId={setTabId} />
                </AppBar>
                <Container>
                    <TabPanel activeTab={tabId} index={0}>
                        <Breadcrumb
                            classes={classes.breadcrumbs}
                            name={dataset.name}
                            folders={folders}
                            setFolders={setFolders}
                            removeFolder={removeFolder}
                        />
                        <Images
                            images={images}
                            offset={offset}
                            pagesCount={pagesCount}
                            setOffset={setOffset}
                            setPage={setPage}
                            deleteImageAction={deleteImageAction}
                            annotateImageAction={annotateImageAction}
                        />
                    </TabPanel>
                    <TabPanel activeTab={tabId} index={1}>
                        <Exports id={id} name={dataset.name} />
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
