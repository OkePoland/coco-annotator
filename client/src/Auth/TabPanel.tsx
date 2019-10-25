import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { useStyles } from './Auth.components';

interface Props {
    activeTab: number;
    index: number;
}

const TabPanel: React.FC<Props> = ({ activeTab, index }) => {
    const classes = useStyles();

    const [
        { fullName, username, password, confirmPassword },
        setCredentials,
    ] = useState({
        fullName: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');

    const LOGIN_TAB_INDEX = 1;
    const PASSWORD_LENGTH_LIMIT = 4;

    const isValidUsername = /^[0-9a-zA-Z_.-]+$/.test(username);
    const isValidPassword = password.length > PASSWORD_LENGTH_LIMIT;
    const isValidConfirmedPassword = confirmPassword === password;

    const handleChange = ({
        target: { name, value },
    }: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials(c => ({ ...c, [name]: value }));
    };

    const register = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!isValidUsername) {
            setError('Username is invalid');
        } else if (!isValidPassword) {
            setError('Password is invalid');
        } else if (!isValidConfirmedPassword) {
            setError("Passwords don't match");
        } else {
            return null;
        }
    };

    const login = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!isValidUsername) {
            setError('Username is invalid');
        } else if (!isValidPassword) {
            setError('Password is invalid');
        } else {
            return null;
        }
    };

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={activeTab !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
        >
            <form
                className={classes.form}
                noValidate
                onSubmit={index === LOGIN_TAB_INDEX ? register : login}
            >
                {index === LOGIN_TAB_INDEX && (
                    <TextField
                        InputLabelProps={{ classes: { root: classes.label } }}
                        variant="outlined"
                        value={fullName}
                        margin="normal"
                        fullWidth
                        id="full-name"
                        label="Full Name"
                        name="fullName"
                        onChange={handleChange}
                    />
                )}
                <TextField
                    InputLabelProps={{ classes: { root: classes.label } }}
                    variant="outlined"
                    margin="normal"
                    value={username}
                    required
                    fullWidth
                    error={!!username && !isValidUsername}
                    helperText={
                        !!username && !isValidUsername
                            ? 'Invalid username format'
                            : null
                    }
                    name="username"
                    label="Username"
                    id="username"
                    onChange={handleChange}
                />
                <TextField
                    InputLabelProps={{ classes: { root: classes.label } }}
                    variant="outlined"
                    margin="normal"
                    value={password}
                    required
                    fullWidth
                    error={!!password && !isValidPassword}
                    helperText={
                        !!password && !isValidPassword
                            ? 'Minimum length of 5 characters'
                            : null
                    }
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    onChange={handleChange}
                />
                {index === LOGIN_TAB_INDEX && (
                    <TextField
                        InputLabelProps={{ classes: { root: classes.label } }}
                        variant="outlined"
                        margin="normal"
                        value={confirmPassword}
                        required
                        fullWidth
                        error={!!confirmPassword && !isValidConfirmedPassword}
                        helperText={
                            !!confirmPassword && !isValidConfirmedPassword
                                ? "Passwords don't match"
                                : null
                        }
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirm-password"
                        onChange={handleChange}
                    />
                )}
                {error && <p>{error}</p>}
                <Button
                    color="primary"
                    type="submit"
                    fullWidth
                    variant="contained"
                    className={classes.submit}
                >
                    {index === LOGIN_TAB_INDEX ? 'Register' : 'Login'}
                </Button>
            </form>
        </Typography>
    );
};

export default TabPanel;
