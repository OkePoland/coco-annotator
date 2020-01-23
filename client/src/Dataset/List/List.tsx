import React from 'react';
import { Formik, Form } from 'formik';

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import HelpIcon from '@material-ui/icons/Help';
import MenuItem from '@material-ui/core/MenuItem';
import MuiTextField from '@material-ui/core/TextField';
import Pagination from 'material-ui-flat-pagination';

import { useStyles } from './list.styles';
import { useDatasetsPage } from './list.hooks';
import { useFormikCreate, useFormikEdit, useFormikShare } from './Formik';
import DatasetCard from './ListCard';
import CustomDialog from '../../common/components/CustomDialog';
import TextField from '../../common/components/Formik/TextField';
import TagsInput from '../../common/components/Formik/TagsInput';
import TextFieldArray from '../../common/components/Formik/TextFieldArray';

const List: React.FC = () => {
    const classes = useStyles();
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
        onDeleteClick,
        onCocoDownloadClick,
    } = useDatasetsPage();
    const formikCreate = useFormikCreate(refreshPage);
    const formikEdit = useFormikEdit(refreshPage, edited);
    const formikShare = useFormikShare(refreshPage, shared);

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
                            {datasetWithCategories.map(dataset => {
                                const { permissions, id, name } = dataset;
                                return (
                                    <Grid key={id} item xs={12} sm={4} md={3}>
                                        <DatasetCard
                                            item={dataset}
                                            onClick={() => {
                                                openDetails(dataset);
                                            }}
                                            renderMenuItems={(
                                                closeMenu: () => void,
                                            ) => (
                                                <Box component="span">
                                                    <MenuItem
                                                        onClick={() => {
                                                            setEdited(dataset);
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
                                                                        dataset,
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
                                                                        name,
                                                                        id,
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
            <Formik
                initialValues={formikCreate.initialValues}
                validationSchema={formikCreate.validationSchema}
                onSubmit={formikCreate.onSubmit}
            >
                {formik => (
                    <CustomDialog
                        title="Creating a Dataset"
                        open={createOn}
                        setClose={() => {
                            setCreateOn(false);
                            formik.resetForm();
                        }}
                        renderContent={() => (
                            <Form>
                                <TextField name="name" label="Dataset name" />
                                <TagsInput
                                    options={tags}
                                    name="categories"
                                    placeholder="Add a category"
                                    classes={{
                                        tagsInput: classes.tagsInput,
                                        tagsList: classes.tagsList,
                                        tagsGrid: classes.tagsGrid,
                                    }}
                                />
                                <MuiTextField
                                    disabled
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    label="Folder Directory"
                                    value={`/datasets/${formik.values.name}`}
                                />
                            </Form>
                        )}
                        renderActions={() => (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={formik.submitForm}
                            >
                                Create Dataset
                            </Button>
                        )}
                    />
                )}
            </Formik>
            <Formik
                enableReinitialize
                initialValues={formikEdit.initialValues}
                validationSchema={formikEdit.validationSchema}
                onSubmit={formikEdit.onSubmit}
            >
                {formik => (
                    <CustomDialog
                        title={edited ? edited.name : ''}
                        open={edited !== null}
                        setClose={() => {
                            setEdited(null);
                            formik.resetForm();
                        }}
                        renderContent={() => (
                            <Form>
                                <TagsInput
                                    options={tags}
                                    name="updatedCategories"
                                    placeholder="Add a category"
                                    classes={{
                                        tagsInput: classes.tagsInput,
                                        tagsList: classes.tagsList,
                                        tagsGrid: classes.tagsGrid,
                                    }}
                                />
                                <TextFieldArray
                                    title="Default Annotation Metadata"
                                    name="updatedMetadata"
                                    keyTitle="key"
                                    valueTitle="value"
                                    metadata={
                                        formik.values.updatedMetadata &&
                                        formik.values.updatedMetadata
                                    }
                                />
                            </Form>
                        )}
                        renderActions={() => (
                            <Button
                                variant="contained"
                                className={classes.submitButton}
                                onClick={async () => {
                                    await formik.submitForm();
                                    setEdited(null);
                                }}
                            >
                                Save
                            </Button>
                        )}
                    />
                )}
            </Formik>
            <Formik
                enableReinitialize
                initialValues={formikShare.initialValues}
                onSubmit={formikShare.onSubmit}
            >
                {formik => (
                    <CustomDialog
                        title={shared ? shared.name : ''}
                        open={shared !== null}
                        setClose={() => {
                            setShared(null);
                            formik.resetForm();
                        }}
                        renderContent={() => (
                            <Form>
                                <TagsInput
                                    options={usernames}
                                    name="sharedUsers"
                                    placeholder="Add usernames"
                                    classes={{
                                        tagsInput: classes.tagsInput,
                                        tagsList: classes.tagsList,
                                        tagsGrid: classes.tagsGrid,
                                    }}
                                />
                            </Form>
                        )}
                        renderActions={() => (
                            <Button
                                variant="contained"
                                className={classes.submitButton}
                                onClick={async () => {
                                    await formik.submitForm();
                                    setShared(null);
                                }}
                            >
                                Save
                            </Button>
                        )}
                    />
                )}
            </Formik>
        </Container>
    );
};

export default List;
