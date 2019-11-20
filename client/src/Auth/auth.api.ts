import { AxiosRequestConfig } from 'axios';

import { UserInfo, AppInfo } from '../common/types';
import Api from '../common/api';

const loginURL = '/user/login';
const registerURL = '/user/register';
const serverInfoURL = '/info/';

interface Credentials {
    username: string;
    password: string;
}

interface ApiResponse {
    user?: UserInfo;
    success: boolean;
    error?: string;
}

export const onRegister = async (data: Credentials): Promise<ApiResponse> => {
    const requestConfig: AxiosRequestConfig = {
        method: 'post',
        url: registerURL,
        data,
    };
    const { data: response } = await Api.request<ApiResponse>(requestConfig);
    if (response && response.user) {
        return { user: response.user, success: response.success };
    }
    return { error: response.message, success: response.success };
};

export const onLogin = async (data: Credentials): Promise<ApiResponse> => {
    const requestConfig: AxiosRequestConfig = {
        method: 'post',
        url: loginURL,
        data,
    };
    const { data: response } = await Api.request<ApiResponse>(requestConfig);
    if (response && response.user) {
        return { user: response.user, success: response.success };
    }
    return { error: response.message, success: response.success };
};

export const getServerInfo = async () => {
    const {
        data: { total_users },
    } = await Api.get<AppInfo>(serverInfoURL);
    return total_users;
};
