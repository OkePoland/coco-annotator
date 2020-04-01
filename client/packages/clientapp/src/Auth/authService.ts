import { Dispatch, SetStateAction } from 'react';

import { UserInfo } from '../common/types';
import { setUserData, USER_DATA_KEY, removeUserData } from './auth.utils';
import { onLogout } from './auth.api';

export interface AuthService {
    login: (data: UserInfo) => Promise<void>;
    getCurrentUser: () => UserInfo | null;
    deleteCurrentUser: () => void;
    logout: () => Promise<void>;
    subscribe: (cb: Dispatch<SetStateAction<UserInfo | null>>) => void;
}

const authFactory = (): AuthService => {
    let callback:
        | Dispatch<SetStateAction<UserInfo | null>>
        | undefined = undefined;
    let currentUser: UserInfo | null = null;

    return {
        async login(data) {
            await setUserData(data);
            currentUser = data;
            if (callback) {
                callback(data);
            }
        },
        getCurrentUser() {
            const value = localStorage.getItem(USER_DATA_KEY);
            if (value) {
                currentUser = JSON.parse(value);
            }
            return currentUser;
        },
        deleteCurrentUser() {
            currentUser = null;
            if (callback) {
                callback(null);
            }
        },
        async logout() {
            await onLogout();
            removeUserData();
            authService.deleteCurrentUser();
        },
        subscribe(cb) {
            callback = cb;
            return () => {
                callback = () => null;
            };
        },
    };
};

export const authService = authFactory();
