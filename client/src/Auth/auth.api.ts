import { AxiosRequestConfig } from 'axios';

import Api from '../common/api';

const loginURL = '/user/login';
const registerURL = '/user/register';
const serverInfoURL = '/info/';

interface Credentials {
    username: string;
    password: string;
}

export interface IUser {
    id: {
        $oid: string;
    };
    is_admin: boolean;
    last_seen?: {
        $date: Date;
    };
    online: boolean;
    username: string;
}

interface ApiResponse {
    user?: IUser;
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

interface ServerInfo {
    allow_registration: boolean;
    login_enabled: boolean;
    git: {
        tag: string;
    };
    total_users: number;
    name: string;
}

export const getServerInfo = async () => {
    const {
        data: { total_users },
    } = await Api.get<ServerInfo>(serverInfoURL);
    return total_users;
};
