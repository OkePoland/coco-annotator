import React, { FormEvent, ChangeEvent } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { useStyles } from './Auth.components';
import { UserDetails } from './form.hooks';

interface Props {
    buttonText: string;
    registerMode: boolean;
    error: string;
    userDetails: UserDetails;
    isValidUsername: boolean;
    isValidPassword: boolean;
    isValidConfirmedPassword: boolean;
    handleChange: (target: ChangeEvent<HTMLInputElement>) => void;
    submitCb: (event: FormEvent<Element>) => Promise<void>;
}

const Form: React.FC<Props> = ({
    buttonText,
    registerMode,
    error,
    userDetails: { fullName, username, password, confirmPassword },
    isValidUsername,
    isValidPassword,
    isValidConfirmedPassword,
    handleChange,
    submitCb,
}) => {
    const classes = useStyles();

    return (
        <form className={classes.form} noValidate onSubmit={submitCb}>
            {registerMode && (
                <TextField
                    InputLabelProps={{ classes: { root: classes.label } }}
                    variant="outlined"
                    value={fullName}
                    margin="normal"
                    fullWidth
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
                onChange={handleChange}
            />
            {registerMode && (
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
                {buttonText}
            </Button>
        </form>
    );
};

export default Form;
