import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-navi';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import DoneIcon from '@material-ui/icons/Done';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import { NavItem } from '../navItems';
import { useStyles } from './header.components';
import {
    useHeaderState,
    BackendStatus,
    BackendState,
    LoadingState,
} from './header.hooks';

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
                        {renderDesktopMenu(loadingState, menuItems)}
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
                    {renderMobileMenu(loadingState, menuItems)}
                </Drawer>
            </Hidden>
        </AppBar>
    );
};

const renderDesktopMenu: (
    loadingState: LoadingState,
    items: Array<NavItem>,
) => JSX.Element = (loadingState, items) => (
    <Grid container item md alignItems="center" justify="space-between">
        <Grid item md>
            <NavList items={items} />
        </Grid>
        <Grid
            container
            item
            md
            alignItems="center"
            justify="flex-end"
            spacing={2}
        >
            <Grid item>
                <LoadingBox state={loadingState} />
            </Grid>
            <Grid item>
                <UserSelect />
            </Grid>
        </Grid>
    </Grid>
);

const renderMobileMenu: (
    loadingState: LoadingState,
    items: Array<NavItem>,
) => JSX.Element = (loadingState, items) => (
    <Grid container item xs direction="column" alignItems="center">
        <Grid item xs>
            <NavList items={items} />
        </Grid>
        <Grid item xs>
            <LoadingBox state={loadingState} />
        </Grid>
        <Grid item xs>
            <UserSelect />
        </Grid>
    </Grid>
);

const TitleBar: React.FC<{ version: string }> = ({ version }) => {
    const classes = useStyles();
    return (
        <Box>
            <Typography display="inline" className={classes.title}>
                COCO Annotator
            </Typography>
            <Typography display="inline" className={classes.version}>
                {version}
            </Typography>
        </Box>
    );
};

const NavList: React.FC<{ items: Array<NavItem> }> = ({ items }) => {
    const classes = useStyles();
    return (
        <Grid container item xs spacing={2} className={classes.navBar}>
            {items.map(o => (
                <Grid key={o.title} item md="auto" sm={12}>
                    <NavLink item={o} />
                </Grid>
            ))}
        </Grid>
    );
};

const NavLink: React.FC<{ item: NavItem }> = ({ item }) => {
    const classes = useStyles();
    return (
        <Link
            href={item.href}
            className={classes.link}
            activeClassName={classes.linkActive}
        >
            <Typography>{item.title}</Typography>
        </Link>
    );
};

const UserSelect: React.FC = () => {
    const classes = useStyles();
    const onChangeCb = () => {};

    // TODO add select actions (#)
    return (
        <Select value={0} className={classes.userSelect} onChange={onChangeCb}>
            <MenuItem value={0}>Admin Panel</MenuItem>
            <MenuItem value={1}>User Settings</MenuItem>
            <MenuItem value={2}>Logout</MenuItem>
        </Select>
    );
};

const ConnectionDot: React.FC<{ state: BackendState }> = ({ state }) => {
    const classes = useStyles();
    const cn = clsx(
        classes.connectionDot,
        state.status === BackendStatus.SUCCESS && classes.successDot,
        state.status === BackendStatus.ERROR && classes.errorDot,
    );
    return (
        <Tooltip title={state.message}>
            <i className={cn} />
        </Tooltip>
    );
};

const LoadingBox: React.FC<{ state: LoadingState }> = ({ state }) => {
    const classes = useStyles();
    const cn = clsx(
        state.isError || state.isLoading
            ? classes.errorText
            : classes.successText,
    );

    return (
        <Box className={cn} fontSize={14}>
            <Box display="inline" mr={1}>
                {state.isLoading ? (
                    <CircularProgress size={14} className={cn} />
                ) : (
                    <DoneIcon fontSize="inherit" />
                )}
            </Box>
            <Typography display="inline" className={classes.loadingMessage}>
                {state.message}
            </Typography>
        </Box>
    );
};

export default Header;
