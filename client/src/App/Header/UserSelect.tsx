import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { useStyles } from './header.components';

const UserSelect: React.FC = () => {
    const classes = useStyles();
    const onChangeCb = () => {}; // TODO
    return (
        <Select value={0} className={classes.userSelect} onChange={onChangeCb}>
            <MenuItem value={0}>admin</MenuItem>
            <MenuItem value={1}>User Settings</MenuItem>
            <MenuItem value={2}>Logout</MenuItem>
        </Select>
    );
};
export default UserSelect;
