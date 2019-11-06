import { AxiosRequestConfig } from 'axios';

import Api from '../common/api';

const loginURL = '/user/login';
const registerURL = '/user/register';
const serverInfoURL = '/info/';
const userInfoURL = '/user/';

interface Credentials {
    username: string;
    password: string;
}

interface RegisterResponse {
    error: string;
}

export const onRegister = async (
    data: Credentials,
): Promise<RegisterResponse | undefined> => {
    const requestConfig: AxiosRequestConfig = {
        method: 'post',
        url: registerURL,
        data,
    };
    const response = await Api.request<RegisterResponse>(requestConfig);
    if (response && response.data) {
        return response.data;
    }
    return { error: response };
};

interface LoginResponse {
    error?: string;
}

export const onLogin = async (
    data: Credentials,
): Promise<LoginResponse | undefined> => {
    const requestConfig: AxiosRequestConfig = {
        method: 'post',
        url: loginURL,
        data,
    };
    const response = await Api.request<LoginResponse>(requestConfig);
    if (response && response.data) {
        return response.data;
    }
    return { error: response };
};

interface ServerInfoApiResponse {
    allow_registration: boolean;
    login_enabled: boolean;
    git: {
        tag: string;
    };
    total_users: number;
    name: string;
}

export const getServerInfo = async () => {
    const response = await Api.get<ServerInfoApiResponse>(serverInfoURL);
    const totalUsers = response.total_users;
    return totalUsers;
};

interface UserInfoResponse {
    success: boolean;
    message: string;
}

export const getUserInfo = async () => {
    const response = await Api.get<UserInfoResponse>(userInfoURL);
    return response;
};
