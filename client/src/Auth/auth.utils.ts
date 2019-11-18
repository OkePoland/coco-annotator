import { UserInfo } from '../common/types';
import StorageService from '../common/utils/StorageService';

export const USER_DATA_KEY = 'user-data-key';

export const getUserData = async (): Promise<UserInfo> => {
    const userData = await StorageService.get<UserInfo>(USER_DATA_KEY);
    return userData;
};

export const setUserData = async (userData: UserInfo) => {
    await StorageService.set<UserInfo>(USER_DATA_KEY, userData);
};

export const removeUserData = async () => {
    await StorageService.remove(USER_DATA_KEY);
};
