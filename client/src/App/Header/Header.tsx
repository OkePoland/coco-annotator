import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import { useStyles } from './header.components';
import { useHeaderState } from './header.hooks';
import ConnectionDot from './ConnectionDot';
import TitleBar from './TitleBar';
import MenuDesktop from './MenuDesktop';
import MenuMobile from './MenuMobile';

const VERSION: string = 'v0.10.6';

const Header: React.FC = () => {
    const classes = useStyles();
    const {
        backendState,
        loadingState,
        menuItems,
        drawerOn,
        setDrawerOn,
    } = useHeaderState();

    return (
        <AppBar position="static" className={classes.appbar}>
            <Toolbar variant="dense" className={classes.toolbar}>
                <Grid
                    container
                    alignItems="center"
                    justify="space-between"
                    spacing={2}
                >
                    <Grid item md="auto" sm>
                        <ConnectionDot state={backendState} />
                    </Grid>
                    <Grid item md="auto" sm>
                        <TitleBar version={VERSION} />
                    </Grid>
                    <Hidden only={['sm', 'xs']}>
                        <MenuDesktop
                            loadingState={loadingState}
                            items={menuItems}
                        />
                    </Hidden>
                    <Hidden only={['xl', 'lg', 'md']}>
                        <Grid item sm>
                            <IconButton
                                className={classes.mobileMenuButton}
                                color="primary"
                                onClick={() => {
                                    setDrawerOn(true);
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Grid>
                    </Hidden>
                </Grid>
            </Toolbar>

            <Hidden only={['xl', 'lg', 'md']}>
                <Drawer
                    open={drawerOn}
                    anchor="top"
                    classes={{ paper: classes.drawer }}
                    onClose={() => {
                        setDrawerOn(false);
                    }}
                >
                    <MenuMobile loadingState={loadingState} items={menuItems} />
                </Drawer>
            </Hidden>
        </AppBar>
    );
};

export default Header;
