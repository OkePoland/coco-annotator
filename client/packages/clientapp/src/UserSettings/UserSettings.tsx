import React from 'react';
import { Formik, Form } from 'formik';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { useStyles } from './userSettings.styles';
import TextField from '../common/components/Formik/TextField';
import { useUserSettings, useFormikCreate } from './userSettings.hooks';

const UserSettings = () => {
    const classes = useStyles();
    const displayName = useUserSettings();
    const formikCreate = useFormikCreate();

    return (
        <Container className={classes.container}>
            <Typography component="div" variant="h4" gutterBottom>
                Hello, {displayName}
            </Typography>
            <Grid container justify="center" className={classes.form}>
                <Grid item>
                    <Typography variant="h5" align="left" gutterBottom>
                        Change Password
                    </Typography>
                    <Formik
                        initialValues={formikCreate.initialValues}
                        validationSchema={formikCreate.validationSchema}
                        onSubmit={formikCreate.onSubmit}
                    >
                        <Form>
                            <TextField
                                label="Current Password"
                                name="password"
                                type="password"
                            />
                            <TextField
                                label="New Password"
                                name="new_password"
                                type="password"
                            />
                            <TextField
                                label="Confirm Password"
                                name="confirm_password"
                                type="password"
                            />
                            <Button
                                className={classes.button}
                                variant="contained"
                                fullWidth
                                color="primary"
                                type="submit"
                            >
                                Submit
                            </Button>
                        </Form>
                    </Formik>
                </Grid>
            </Grid>
        </Container>
    );
};

export default UserSettings;
