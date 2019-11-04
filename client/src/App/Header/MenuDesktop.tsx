import React from 'react';
import Grid from '@material-ui/core/Grid';

import { NavItem } from '../navItems';
import { LoadingState } from './header.hooks';
import NavList from './NavList';
import LoadingBox from './LoadingBox';
import UserSelect from './UserSelect';

interface MenuDesktopProps {
    loadingState: LoadingState;
    items: Array<NavItem>;
}

const MenuDesktop: React.FC<MenuDesktopProps> = ({ loadingState, items }) => (
    <Grid container item md alignItems="center" justify="space-between">
        <Grid container item md>
            <NavList items={items} noWrap />
        </Grid>
        <Grid
            container
            item
            md
            alignItems="center"
            justify="flex-end"
            spacing={2}
            wrap="nowrap"
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
export default MenuDesktop;
