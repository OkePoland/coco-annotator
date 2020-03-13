import { AxiosRequestConfig } from 'axios';

import { authService } from '../Auth/authService';

import { AxiosHandler } from '@coco/core';

export default class Api {
    private static apiHandler: AxiosHandler;

    static async init() {
        this.apiHandler = new AxiosHandler();
        await this.apiHandler.init({
            baseURL: process.env.REACT_APP_API_BASE_URL,
            withCredentials: true,
            deleteCurrentUser: authService.deleteCurrentUser,
        });
    }

    static get<T>(url: string, config?: AxiosRequestConfig) {
        return this.apiHandler.get<T>(url, config).catch(err => {
            return err;
        });
    }

    static post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.apiHandler.post<T>(url, data, config).catch(err => {
            return err;
        });
    }

    static request<T>(config: AxiosRequestConfig) {
        return this.apiHandler.request<T>(config).catch(err => {
            return err;
        });
    }

    static delete(url: string, config?: AxiosRequestConfig) {
        return this.apiHandler.delete(url, config);
    }

    static put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.apiHandler.put<T>(url, data, config).catch(err => {
            return err;
        });
    }

    private constructor() {}
}
