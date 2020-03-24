import React from 'react';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import { useStyles } from './Auth.components';
import useAuth from './auth.hooks';
import useForm from './form.hooks';
import TabPanel from './TabPanel';
import Form from './Form';

const Auth: React.FC = () => {
    const classes = useStyles();
    const { activeTab, showLoginForm, changeTabPanel } = useAuth();
    const {
        error,
        userDetails,
        isValidUsername,
        isValidPassword,
        isValidConfirmedPassword,
        handleChange,
        handleLogin,
        handleRegister,
    } = useForm(activeTab);

    return (
        <Container className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                    <Typography variant="h3" className={classes.title}>
                        Multi Annotator
                    </Typography>
                    <Divider />
                    {showLoginForm ? (
                        <Typography component="div" className={classes.body}>
                            <Typography paragraph>
                                Multi Annotator is a web-based image annotation
                                tool designed for versatility and efficiently
                                label images to create training data for image
                                localization and object detection.
                            </Typography>
                            <Typography paragraph>
                                Login to create a datasets.
                            </Typography>
                            <Typography paragraph>
                                Find out more&nbsp;
                                <Link href="https://github.com/OKEPL/multi-annotator">
                                    Github.
                                </Link>
                            </Typography>
                        </Typography>
                    ) : (
                        <Typography component="div" className={classes.body}>
                            <Typography variant="h4" gutterBottom>
                                You have successfully installed Multi Annotator!
                            </Typography>
                            <Typography paragraph>
                                Use the registration form to create an admin
                                account.
                            </Typography>
                            <Typography paragraph>
                                If you have any questions please checkout
                                the&nbsp;
                                <Link href="https://github.com/jsbroks/coco-annotator/wiki">
                                    wiki&nbsp;
                                </Link>
                                before posting&nbsp;
                                <Link href="https://github.com/OKEPL/multi-annotator/issues">
                                    issues
                                </Link>
                                .
                            </Typography>
                        </Typography>
                    )}
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Tabs
                        classes={{ indicator: classes.indicator }}
                        value={activeTab}
                        onChange={changeTabPanel}
                    >
                        {showLoginForm && (
                            <Tab
                                className={classes.tab}
                                label="Login"
                                value={1}
                            />
                        )}
                        <Tab
                            className={classes.tab}
                            label="Register"
                            value={0}
                        />
                    </Tabs>
                    <TabPanel activeTab={activeTab} index={1}>
                        <Form
                            buttonText="Login"
                            submitCb={handleLogin}
                            registerMode={false}
                            handleChange={handleChange}
                            error={error}
                            userDetails={userDetails}
                            isValidUsername={isValidUsername}
                            isValidPassword={isValidPassword}
                            isValidConfirmedPassword={isValidConfirmedPassword}
                        />
                    </TabPanel>
                    <TabPanel activeTab={activeTab} index={0}>
                        <Form
                            buttonText="Register"
                            submitCb={handleRegister}
                            registerMode={true}
                            handleChange={handleChange}
                            error={error}
                            userDetails={userDetails}
                            isValidUsername={isValidUsername}
                            isValidPassword={isValidPassword}
                            isValidConfirmedPassword={isValidConfirmedPassword}
                        />
                    </TabPanel>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Auth;
