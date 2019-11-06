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
import TabPanel from './TabPanel';

const Auth: React.FC = () => {
    const classes = useStyles();
    const { activeTab, showLoginForm, handleChange } = useAuth();

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
                                <Link href="https://github.com/jsbroks/Multi-annotator">
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
                                <Link href="https://github.com/jsbroks/Multi-annotator/wiki">
                                    wiki&nbsp;
                                </Link>
                                before posting&nbsp;
                                <Link href="https://github.com/jsbroks/Multi-annotator/issues">
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
                        onChange={handleChange}
                    >
                        {showLoginForm && (
                            <Tab className={classes.tab} label="Login" />
                        )}
                        <Tab className={classes.tab} label="Register" />
                    </Tabs>
                    {showLoginForm && (
                        <TabPanel activeTab={activeTab} index={0}></TabPanel>
                    )}
                    <TabPanel
                        activeTab={showLoginForm ? activeTab : 1}
                        index={1}
                    ></TabPanel>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Auth;
