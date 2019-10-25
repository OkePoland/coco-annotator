import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';

import { useStyles } from './Auth.components';
import TabPanel from './TabPanel';

const Auth: React.FC = () => {
    const classes = useStyles();
    const [activeTab, setActiveTab] = useState<number>(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <Container className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                    <h1>COCO Annotator</h1>
                    <hr />
                    <div>
                        <h3>You have successfully installed COCO Annotator!</h3>
                        <p>
                            Use the registration form to create an admin
                            account.
                        </p>
                        <p>
                            If you have any questions please checkout the
                            <Link href="https://github.com/jsbroks/coco-annotator/wiki">
                                <span> wiki </span>
                            </Link>
                            before posting
                            <Link href="https://github.com/jsbroks/coco-annotator/issues">
                                <span> issues</span>
                            </Link>
                            .
                        </p>
                    </div>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Tabs
                        classes={{ indicator: classes.indicator }}
                        value={activeTab}
                        onChange={handleChange}
                    >
                        <Tab className={classes.tab} label="Login" />
                        <Tab className={classes.tab} label="Register" />
                    </Tabs>
                    <TabPanel activeTab={activeTab} index={0}></TabPanel>
                    <TabPanel activeTab={activeTab} index={1}></TabPanel>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Auth;
