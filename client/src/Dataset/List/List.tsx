import React from 'react';
import { Formik, Form } from 'formik';

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import HelpIcon from '@material-ui/icons/Help';
import MenuItem from '@material-ui/core/MenuItem';
import Pagination from 'material-ui-flat-pagination';
import MuiTextField from '@material-ui/core/TextField';

import { useStyles } from './list.styles';
import { useDatasetsPage, useFormikCreate } from './list.hooks';
import DatasetCard from './ListCard';
import CustomDialog from '../../common/components/CustomDialog';
import TextField from '../../common/components/Formik/TextField';

const List: React.FC = () => {
    const classes = useStyles();
    const {
        list: { datasets, page, pageCount, setPage, refreshPage },
        dialogs: {
            help: [helpOn, setHelpOn],
            create: [createOn, setCreateOn],
            edit: [editOn, setEditOn],
            share: [shareOn, setShareOn],
        },
        navigation: { openDetails },
    } = useDatasetsPage();
    const formikCreate = useFormikCreate(refreshPage);

    return (
        <Box>
            <Box textAlign="center" mt={5}>
                <Box mb={2}>
                    <Typography component="div" variant="h4">
                        Datasets
                        <HelpIcon
                            color="primary"
                            onClick={() => {
                                setHelpOn(true);
                            }}
                        />
                    </Typography>
                    <Typography>
                        Loaded <b>{datasets.length}</b> datasets.
                    </Typography>
                </Box>

                <Grid container justify="center" spacing={1}>
                    <Grid item>
                        <Button
                            variant="contained"
                            className={classes.createButton}
                            onClick={() => setCreateOn(true)}
                        >
                            Create
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                // TODO add import action
                            }}
                        >
                            Import
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={refreshPage}>
                            Refresh
                        </Button>
                    </Grid>
                </Grid>

                <Box mt={2}>
                    <Divider />
                </Box>
            </Box>

            <Container>
                {datasets.length > 0 ? (
                    <Box>
                        <Box textAlign="center" mb={1}>
                            <Pagination
                                reduced
                                size="large"
                                limit={1}
                                offset={page}
                                total={pageCount}
                                onClick={(e, offset) => {
                                    setPage(offset);
                                }}
                            />
                        </Box>

                        <Grid container justify="flex-start" spacing={4}>
                            {datasets.map(o => (
                                <Grid key={o.id} item xs={12} sm={4} md={3}>
                                    <DatasetCard
                                        item={o}
                                        onClick={() => {
                                            openDetails(o);
                                        }}
                                        renderMenuItems={() => (
                                            <Box component="span">
                                                <MenuItem>Edit</MenuItem>
                                                <MenuItem>Share</MenuItem>
                                                <MenuItem>
                                                    Download COCO
                                                </MenuItem>
                                                <Divider />
                                                <MenuItem>Delete</MenuItem>
                                            </Box>
                                        )}
                                    />
                                </Grid>
                            ))}
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
                            More information can be found in the help section.
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
            <CustomDialog
                title="Edit Dataset"
                open={editOn}
                setClose={() => setEditOn(false)}
                renderContent={() => <Box textAlign="center">TODO</Box>}
            />
            <CustomDialog
                title="Share Dataset"
                open={shareOn}
                setClose={() => setShareOn(false)}
                renderContent={() => <Box textAlign="center">TODO</Box>}
            />
        </Box>
    );
};

export default List;
