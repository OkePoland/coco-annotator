import React from 'react';

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import HelpIcon from '@material-ui/icons/Help';
import MenuItem from '@material-ui/core/MenuItem';
import Pagination from 'material-ui-flat-pagination';

import { useStyles } from './list.styles';
import { useDatasetsPage } from './list.hooks';
import DatasetCard from './ListCard';
import CustomDialog from '../../common/components/CustomDialog';
import ListCreate from './ListForm/ListCreate';
import ListEdit from './ListForm/ListEdit';
import ListShare from './ListForm/ListShare';
import {
    getImageUrl,
    onDeleteClick,
    onCocoDownloadClick,
} from '../datasets.utils';
import { addProcess, removeProcess } from '../../common/utils/globalActions';
import useGlobalContext from '../../common/hooks/useGlobalContext';

const List: React.FC = () => {
    const classes = useStyles();
    const [, dispatch] = useGlobalContext();
    const {
        list: {
            offset: [offset, setOffset],
            pageCount,
            setPage,
            tags,
            usernames,
            refreshPage,
        },
        dialogs: {
            help: [helpOn, setHelpOn],
            create: [createOn, setCreateOn],
        },
        edit: [edited, setEdited],
        share: [shared, setShared],
        navigation: { openDetails },
        datasetWithCategories,
    } = useDatasetsPage();

    return (
        <Container className={classes.container}>
            <Typography component="div" variant="h4" gutterBottom>
                Datasets
                <HelpIcon
                    color="primary"
                    onClick={() => {
                        setHelpOn(true);
                    }}
                />
            </Typography>
            <Typography paragraph gutterBottom>
                Loaded <b>{datasetWithCategories.length}</b> datasets.
            </Typography>
            <Grid container justify="center" spacing={1}>
                <Grid item>
                    <Button
                        variant="contained"
                        className={classes.submitButton}
                        onClick={() => setCreateOn(true)}
                    >
                        Create
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={refreshPage}>
                        Refresh
                    </Button>
                </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Container>
                {datasetWithCategories.length > 0 ? (
                    <Box>
                        <Pagination
                            reduced
                            size="large"
                            limit={1}
                            offset={offset}
                            total={pageCount}
                            onClick={(_, offset, page) => {
                                setPage(page);
                                setOffset(offset);
                            }}
                        />
                        <Grid container justify="flex-start" spacing={4}>
                            {datasetWithCategories.map(item => {
                                const {
                                    dataset: {
                                        permissions,
                                        id,
                                        name,
                                        first_image_id,
                                    },
                                } = item;
                                const process = 'Generating COCO for ' + name;
                                return (
                                    <Grid key={id} item xs={12} sm={4} md={3}>
                                        <DatasetCard
                                            item={item}
                                            imageUrl={getImageUrl(
                                                first_image_id,
                                            )}
                                            onClick={() => {
                                                openDetails(item);
                                            }}
                                            renderMenuItems={(
                                                closeMenu: () => void,
                                            ) => (
                                                <Box component="span">
                                                    <MenuItem
                                                        onClick={() => {
                                                            setEdited(item);
                                                            closeMenu();
                                                        }}
                                                    >
                                                        Edit
                                                    </MenuItem>
                                                    {permissions &&
                                                        permissions.owner && (
                                                            <MenuItem
                                                                onClick={() => {
                                                                    setShared(
                                                                        item,
                                                                    );
                                                                    closeMenu();
                                                                }}
                                                            >
                                                                Share
                                                            </MenuItem>
                                                        )}
                                                    {permissions &&
                                                        permissions.download && (
                                                            <MenuItem
                                                                onClick={() => {
                                                                    onCocoDownloadClick(
                                                                        {
                                                                            name,
                                                                            id,
                                                                            addCallback: () =>
                                                                                addProcess(
                                                                                    dispatch,
                                                                                    process,
                                                                                ),
                                                                            removeCallback: () =>
                                                                                removeProcess(
                                                                                    dispatch,
                                                                                    process,
                                                                                ),
                                                                        },
                                                                    );
                                                                    closeMenu();
                                                                }}
                                                            >
                                                                Download COCO
                                                            </MenuItem>
                                                        )}
                                                    {permissions &&
                                                        permissions.delete && (
                                                            <>
                                                                <Divider />
                                                                <MenuItem
                                                                    className={
                                                                        classes.deleteButton
                                                                    }
                                                                    onClick={() =>
                                                                        onDeleteClick(
                                                                            id,
                                                                            refreshPage,
                                                                        )
                                                                    }
                                                                >
                                                                    Delete
                                                                </MenuItem>
                                                            </>
                                                        )}
                                                </Box>
                                            )}
                                        />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                ) : (
                    <Box textAlign="center">You need to create a dataset!</Box>
                )}
            </Container>

            {/* Container Dialogs */}
            <CustomDialog
                title="Datasets"
                open={helpOn}
                setClose={() => setHelpOn(false)}
                renderContent={() => (
                    <Box textAlign="center">
                        <Typography gutterBottom>
                            More information can be found in the&nbsp;
                            <Link href="https://github.com/jsbroks/coco-annotator/wiki">
                                help section.
                            </Link>
                        </Typography>
                        <Divider />
                        <Box mt={1}>
                            <Typography gutterBottom>
                                What is a dataset?
                            </Typography>
                            <Typography gutterBottom>
                                A dataset is a collection of images. It provides
                                default category options for all subsequent
                                images. Each dataset has its own folder in the
                                /datasets director
                            </Typography>
                        </Box>
                        <Divider />
                        <Box mt={1}>
                            <Typography gutterBottom>
                                How do I create one?
                            </Typography>
                            <Typography gutterBottom>
                                Click on the "Create" button found on this
                                webpage. A dataset name must be provided
                            </Typography>
                        </Box>
                        <Divider />
                        <Box mt={1}>
                            <Typography gutterBottom>
                                How do I add images?
                            </Typography>
                            <Typography gutterBottom>
                                Once you have created a dataset you can add
                                images by placing them in the create folder
                                (while the server is running).
                            </Typography>
                        </Box>
                    </Box>
                )}
            />
            {createOn && (
                <ListCreate
                    createOn={createOn}
                    setCreateOn={setCreateOn}
                    tags={tags}
                    classes={{
                        tagsInput: classes.tagsInput,
                        tagsList: classes.tagsList,
                        tagsGrid: classes.tagsGrid,
                    }}
                    refreshPage={refreshPage}
                />
            )}
            {edited && (
                <ListEdit
                    edited={edited}
                    setEdited={setEdited}
                    tags={tags}
                    classes={{
                        tagsInput: classes.tagsInput,
                        tagsList: classes.tagsList,
                        tagsGrid: classes.tagsGrid,
                        submitButton: classes.submitButton,
                    }}
                    refreshPage={refreshPage}
                />
            )}
            {shared && (
                <ListShare
                    shared={shared}
                    setShared={setShared}
                    usernames={usernames}
                    classes={{
                        tagsInput: classes.tagsInput,
                        tagsList: classes.tagsList,
                        tagsGrid: classes.tagsGrid,
                        submitButton: classes.submitButton,
                    }}
                    refreshPage={refreshPage}
                />
            )}
        </Container>
    );
};

export default List;
