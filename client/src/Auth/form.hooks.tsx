import React, { useState, useEffect } from 'react';
import { useNavigation } from 'react-navi';

import { onRegister, onLogin } from './auth.api';
import useAuthContext from '../common/hooks/useAuthContext';

export interface UserDetails {
    fullName: string;
    username: string;
    password: string;
    confirmPassword: string;
}

interface FormState {
    userDetails: UserDetails;
    error: string;
    isValidUsername: boolean;
    isValidPassword: boolean;
    isValidConfirmedPassword: boolean;
    handleChange: (target: React.ChangeEvent<HTMLInputElement>) => void;
    handleLogin: (event: React.FormEvent<Element>) => Promise<void>;
    handleRegister: (event: React.FormEvent<Element>) => Promise<void>;
}

export const PASSWORD_LENGTH_LIMIT = 4;

const useForm = (activeTab: number): FormState => {
    let navigation = useNavigation();
    const { login } = useAuthContext();
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

    useEffect(() => {
        setCredentials({
            fullName: '',
            username: '',
            password: '',
            confirmPassword: '',
        });
    }, [activeTab]);

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
            } else if (response.user) {
                await login(response.user);
                navigation.navigate('/');
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
            } else if (response.user) {
                await login(response.user);
                navigation.navigate('/');
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

export default useForm;
