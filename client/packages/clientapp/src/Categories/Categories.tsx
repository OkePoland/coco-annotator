import React from 'react';
import { Form, Formik } from 'formik';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import HelpIcon from '@material-ui/icons/Help';
import Pagination from 'material-ui-flat-pagination';
import MenuItem from '@material-ui/core/MenuItem';

import { useStyles } from './categories.styles';
import CustomDialog from '../common/components/CustomDialog';
import TextField from '../common/components/Formik/TextField';
import CategoryCard from './CategoryCard';
import {
    useFormikCreate,
    useFormikEdit,
    useCategories,
} from './categories.hooks';

const Categories: React.FC = () => {
    const classes = useStyles();
    const {
        list: { categories, page, pages, categoryCount, setPage, refreshPage },
        dialogs: {
            help: [helpOn, setHelpOn],
            create: [createOn, setCreateOn],
        },
        edit: [edited, setEdited],
        onDeleteClick,
    } = useCategories();
    const formikCreate = useFormikCreate(refreshPage);
    const formikEdit = useFormikEdit(refreshPage, edited);

    return (
        <Container className={classes.container}>
            <Typography component="div" variant="h4" gutterBottom>
                Categories
                <HelpIcon
                    color="primary"
                    onClick={() => {
                        setHelpOn(true);
                    }}
                />
            </Typography>
            <Typography paragraph gutterBottom>
                Loaded <b>{categoryCount}</b> categories.
            </Typography>
            <Grid container justify="center" spacing={1}>
                <Grid item>
                    <Button
                        variant="contained"
                        className={classes.button}
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
                {categories.length > 0 ? (
                    <Box>
                        <Pagination
                            reduced
                            size="large"
                            limit={1}
                            offset={page}
                            total={pages}
                            onClick={(_, offset) => {
                                setPage(offset);
                            }}
                        />
                        <Grid container justify="flex-start" spacing={4}>
                            {categories.map(category => {
                                return (
                                    <Grid
                                        key={category.id}
                                        item
                                        xs={12}
                                        sm={4}
                                        md={3}
                                    >
                                        <CategoryCard
                                            item={category}
                                            renderMenuItems={(
                                                closeMenu: () => void,
                                            ) => (
                                                <Box component="span">
                                                    <MenuItem
                                                        onClick={() =>
                                                            onDeleteClick(
                                                                category.id,
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={() => {
                                                            setEdited(category);
                                                            closeMenu();
                                                        }}
                                                    >
                                                        Edit
                                                    </MenuItem>
                                                </Box>
                                            )}
                                        />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                ) : (
                    <Box textAlign="center">You need to create a category!</Box>
                )}
            </Container>
            <CustomDialog
                title="Categories"
                open={helpOn}
                setClose={() => setHelpOn(false)}
                renderContent={() => (
                    <Box textAlign="center">
                        <Typography gutterBottom>
                            More information can be found in the&nbsp;
                            <Link href="https://github.com/jsbroks/coco-annotator/wiki/Usage#creating-categories">
                                getting started section
                            </Link>
                        </Typography>
                        <Divider />
                        <Box mt={1}>
                            <Typography gutterBottom>
                                What is a category?
                            </Typography>
                        </Box>
                        <Divider />
                        <Box mt={1}>
                            <Typography gutterBottom>
                                How do I create one?
                            </Typography>
                            <Typography gutterBottom>
                                Click on the "Create" button found on this
                                webpage. You must provided a name for the
                                category.
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
                        title="Creating a Category"
                        open={createOn}
                        setClose={() => {
                            setCreateOn(false);
                            formik.resetForm();
                        }}
                        renderContent={() => (
                            <Form>
                                <TextField
                                    name="categoryName"
                                    label="Category Name"
                                />
                            </Form>
                        )}
                        renderActions={() => (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={formik.submitForm}
                            >
                                Create Category
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
                        title={edited ? `Current Name: ${edited.name}` : ''}
                        open={edited !== null}
                        setClose={() => {
                            setEdited(null);
                            formik.resetForm();
                        }}
                        renderContent={() => (
                            <Form>
                                <TextField
                                    name="updatedName"
                                    label="Edit name"
                                />
                            </Form>
                        )}
                        renderActions={() => (
                            <Button
                                className={classes.button}
                                variant="contained"
                                onClick={async () => {
                                    await formik.submitForm();
                                    setEdited(null);
                                }}
                            >
                                Update
                            </Button>
                        )}
                    />
                )}
            </Formik>
        </Container>
    );
};

export default Categories;
