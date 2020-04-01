import Api from '../common/api';
import { UserInfo } from '../common/types';

const baseURL = '/admin/';

interface IUser {
    username: string;
    password: string;
    name: string;
    isAdmin: boolean;
}

export const getUsers = async (limit: number) => {
    const url = `${baseURL}users`;
    const params = { limit };
    const response = await Api.get<Array<UserInfo>>(url, { params });
    return response;
};

export const createUser = async (user: IUser) => {
    const url = `${baseURL}user/`;
    const { data: response } = await Api.post(url, { ...user });
    return response;
};

export const deleteUser = async (username: string) => {
    const url = `${baseURL}user/${username}`;
    const response = await Api.delete(url);
    return response;
};
