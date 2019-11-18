import { IUser } from './auth.api';
import StorageService from '../common/utils/StorageService';

export const USER_DATA_KEY = 'user-data-key';

export const getUserData = async (): Promise<IUser> => {
    const userData = await StorageService.get<IUser>(USER_DATA_KEY);
    return userData;
};

export const setUserData = async (userData: IUser) => {
    await StorageService.set<IUser>(USER_DATA_KEY, userData);
};

export const removeUserData = async () => {
    await StorageService.remove(USER_DATA_KEY);
};
