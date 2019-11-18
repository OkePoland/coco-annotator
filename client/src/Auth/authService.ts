import { Dispatch, SetStateAction } from 'react';

import { IUser } from './auth.api';
import { setUserData, USER_DATA_KEY, removeUserData } from './auth.utils';

export interface AuthService {
    login: (data: IUser) => Promise<void>;
    getCurrentUser: () => IUser | null;
    deleteCurrentUser: () => void;
    logout: () => void;
    subscribe: (cb: Dispatch<SetStateAction<IUser | null>>) => void;
}

const authFactory = (): AuthService => {
    let callback:
        | Dispatch<SetStateAction<IUser | null>>
        | undefined = undefined;
    let currentUser: IUser | null = null;

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
        logout() {
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
