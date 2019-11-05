import React from 'react';
import { Link } from 'react-navi';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { NavItem } from '../navItems';
import { useStyles } from './header.components';

interface NavListProps {
    items: Array<NavItem>;
    noWrap?: boolean;
}

const NavList: React.FC<NavListProps> = ({ items, noWrap }) => {
    const classes = useStyles();
    return (
        <Grid
            container
            item
            xs
            spacing={2}
            className={classes.navList}
            wrap={noWrap != null ? 'nowrap' : 'wrap'}
        >
            {items.map(item => (
                <Grid key={item.title} item md="auto" sm={12}>
                    <Link
                        href={item.href}
                        className={classes.link}
                        activeClassName={classes.linkActive}
                    >
                        <Typography>{item.title}</Typography>
                    </Link>
                </Grid>
            ))}
        </Grid>
    );
};
export default NavList;
