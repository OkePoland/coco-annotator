import React from 'react';
import { Formik, Form } from 'formik';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { useStyles } from './adminPanel.styles';
import CustomDialog from '../common/components/CustomDialog';
import {
    useAdminPanel,
    useFormikCreate,
    LimitOptions,
} from './adminPanel.hooks';
import TextField from '../common/components/Formik/TextField';
import Checkbox from '../common/components/Formik/Checkbox';
import AdminTable from './AdminTable';

const AdminPanel = () => {
    const classes = useStyles();
    const {
        list: { total, refreshPage },
        create: [createOn, setCreateOn],
        usersLimit: [limit, setLimit],
        table: { rows, deleteUser },
    } = useAdminPanel();
    const formikCreate = useFormikCreate(refreshPage);

    return (
        <Container className={classes.container}>
            <Typography component="div" variant="h4" gutterBottom>
                Users
            </Typography>
            <Typography paragraph gutterBottom>
                Total of <b>{total}</b> user accounts.
            </Typography>
            <Grid container justify="center" spacing={1}>
                <Grid item>
                    <Button
                        variant="contained"
                        className={classes.createButton}
                        onClick={() => setCreateOn(true)}
                    >
                        Create User
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={refreshPage}>
                        Refresh
                    </Button>
                </Grid>
            </Grid>
            <Grid
                className={classes.limit}
                container
                justify="center"
                alignItems="center"
                spacing={2}
            >
                <Grid item>
                    <Typography>Limit</Typography>
                </Grid>
                <Grid item>
                    <Select
                        variant="outlined"
                        value={limit}
                        onChange={event =>
                            setLimit(event.target.value as number)
                        }
                        classes={{ select: classes.select }}
                    >
                        <MenuItem value={LimitOptions.OPTION_ONE}>
                            {LimitOptions.OPTION_ONE}
                        </MenuItem>
                        <MenuItem value={LimitOptions.OPTION_TWO}>
                            {LimitOptions.OPTION_TWO}
                        </MenuItem>
                        <MenuItem value={LimitOptions.OPTION_THREE}>
                            {LimitOptions.OPTION_THREE}
                        </MenuItem>
                        <MenuItem value={LimitOptions.OPTION_FOUR}>
                            {LimitOptions.OPTION_FOUR}
                        </MenuItem>
                    </Select>
                </Grid>
            </Grid>
            <Divider />
            <AdminTable rows={rows} deleteUser={deleteUser} />
            <Formik
                initialValues={formikCreate.initialValues}
                validationSchema={formikCreate.validationSchema}
                onSubmit={formikCreate.onSubmit}
            >
                {formik => (
                    <CustomDialog
                        title="Create a User"
                        open={createOn}
                        setClose={() => {
                            setCreateOn(false);
                            formik.resetForm();
                        }}
                        renderContent={() => (
                            <Form className={classes.form}>
                                <TextField name="username" label="Username" />
                                <TextField
                                    name="password"
                                    label="Password"
                                    type="password"
                                />
                                <TextField name="name" label="Name" />
                                <Checkbox name="isAdmin" label="Admin" />
                                {formik.errors && (
                                    <Typography color="error" paragraph>
                                        {formik.status}
                                    </Typography>
                                )}
                            </Form>
                        )}
                        renderActions={() => (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={formik.submitForm}
                            >
                                Create User
                            </Button>
                        )}
                    />
                )}
            </Formik>
        </Container>
    );
};

export default AdminPanel;
