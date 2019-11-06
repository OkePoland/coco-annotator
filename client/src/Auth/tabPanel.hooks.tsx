import React, { useState } from 'react';

import { onRegister, onLogin } from './auth.api';

interface UserDetails {
    fullName: string;
    username: string;
    password: string;
    confirmPassword: string;
}

interface TabPanelState {
    userDetails: UserDetails;
    error: string;
    isValidUsername: boolean;
    isValidPassword: boolean;
    isValidConfirmedPassword: boolean;
    handleChange: (target: React.ChangeEvent<HTMLInputElement>) => void;
    handleLogin: (event: React.FormEvent<Element>) => Promise<void>;
    handleRegister: (event: React.FormEvent<Element>) => Promise<void>;
}

export const LOGIN_TAB_INDEX = 1;
export const PASSWORD_LENGTH_LIMIT = 4;

const useTabPanel = (): TabPanelState => {
    const [
        { fullName, username, password, confirmPassword },
        setCredentials,
    ] = useState<UserDetails>({
        fullName: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState<string>('');

    const isValidUsername = /^[0-9a-zA-Z_.-]+$/.test(username);
    const isValidPassword = password.length > PASSWORD_LENGTH_LIMIT;
    const isValidConfirmedPassword = confirmPassword === password;

    const handleChange = ({
        target: { name, value },
    }: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials(c => ({ ...c, [name]: value }));
    };

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!isValidUsername) {
            setError('Username is invalid');
        } else if (!isValidPassword) {
            setError('Password is invalid');
        } else if (!isValidConfirmedPassword) {
            setError("Passwords don't match");
        } else {
            const response = await onRegister({ username, password });

            if (response && response.error) {
                setError(response.error);
            }
        }
    };

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!isValidUsername) {
            setError('Username is invalid');
        } else if (!isValidPassword) {
            setError('Password is invalid');
        } else {
            const response = await onLogin({
                username,
                password,
            });

            if (response && response.error) {
                setError(response.error);
            }
        }
    };
    return {
        error,
        userDetails: { fullName, username, password, confirmPassword },
        isValidUsername,
        isValidPassword,
        isValidConfirmedPassword,
        handleChange,
        handleLogin,
        handleRegister,
    };
};

export default useTabPanel;
