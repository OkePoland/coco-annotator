import React, { useState } from 'react';
import { useNavigation } from 'react-navi';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { useStyles } from './header.components';
import { UserInfo } from '../../common/types';

interface UserSelectProps {
    currentUser: UserInfo | null;
    onLogoutCb: () => Promise<void>;
}

const UserSelect: React.FC<UserSelectProps> = ({ currentUser, onLogoutCb }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    let navigation = useNavigation();

    const open = Boolean(anchorEl);
    const userName = currentUser && currentUser.username;
    const isAdmin = currentUser && currentUser.is_admin;

    return (
        <Grid container>
            <Grid item xs={12}>
                <Button
                    classes={{ root: classes.userSelect }}
                    variant="contained"
                    endIcon={<ArrowDropDownIcon />}
                    onClick={event => setAnchorEl(event.currentTarget)}
                >
                    {userName}
                </Button>
                <Menu
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    getContentAnchorEl={null}
                    onClose={() => setAnchorEl(null)}
                >
                    {isAdmin && (
                        <MenuItem
                            onClick={() => {
                                setAnchorEl(null);
                                navigation.navigate('/admin');
                            }}
                        >
                            Admin Panel
                        </MenuItem>
                    )}
                    <MenuItem
                        onClick={() => {
                            setAnchorEl(null);
                            navigation.navigate('/user');
                        }}
                    >
                        User Settings
                    </MenuItem>
                    <MenuItem
                        onClick={async () => {
                            setAnchorEl(null);
                            await onLogoutCb();
                        }}
                    >
                        Logout
                    </MenuItem>
                </Menu>
            </Grid>
        </Grid>
    );
};
export default UserSelect;
