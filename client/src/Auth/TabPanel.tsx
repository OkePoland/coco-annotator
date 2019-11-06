import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { useStyles } from './Auth.components';
import useTabPanel, { LOGIN_TAB_INDEX } from './tabPanel.hooks';

interface Props {
    activeTab: number;
    index: number;
}

const TabPanel: React.FC<Props> = ({ activeTab, index }) => {
    const classes = useStyles();
    const {
        error,
        userDetails: { fullName, username, password, confirmPassword },
        isValidUsername,
        isValidPassword,
        isValidConfirmedPassword,
        handleChange,
        handleLogin,
        handleRegister,
    } = useTabPanel();

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
                onSubmit={
                    index === LOGIN_TAB_INDEX ? handleRegister : handleLogin
                }
            >
                {index === LOGIN_TAB_INDEX && (
                    <TextField
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
                {error && <Typography paragraph>{error}</Typography>}
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
