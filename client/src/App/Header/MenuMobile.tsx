import React from 'react';
import Grid from '@material-ui/core/Grid';
import NavList from './NavList';
import LoadingBox from './LoadingBox';
import UserSelect from './UserSelect';

import { NavItem } from '../navItems';
import { LoadingState } from './header.hooks';

interface MenuMobileProps {
    loadingState: LoadingState;
    items: Array<NavItem>;
}

const MenuMobile: React.FC<MenuMobileProps> = ({ loadingState, items }) => (
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
export default MenuMobile;
