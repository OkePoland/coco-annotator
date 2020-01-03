import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { authService } from '../Auth/authService';

export default class Api {
    private static axiosInstance: AxiosInstance;

    static async init() {
        this.axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_API_BASE_URL,
            withCredentials: true,
        });
        this.addApiInterceptors();
    }

    private static addApiInterceptors() {
        this.axiosInstance.interceptors.response.use(
            response => response,
            error => {
                const status = error.response.status;
                if (status === 401 || status === 403) {
                    authService.deleteCurrentUser();
                }
                return Promise.reject(error.response);
            },
        );
    }

    static get<T>(url: string, config?: AxiosRequestConfig) {
        return this.axiosInstance.get<T>(url, config).catch(err => {
            return err;
        });
    }

    static post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.axiosInstance.post<T>(url, data, config).catch(err => {
            return err;
        });
    }

    static request<T>(config: AxiosRequestConfig) {
        return this.axiosInstance.request<T>(config).catch(err => {
            return err;
        });
    }

    static delete(url: string, config?: AxiosRequestConfig) {
        return this.axiosInstance.delete(url, config);
    }

    static put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.axiosInstance.put<T>(url, data, config).catch(err => {
            return err;
        });
    }

    private constructor() {}
}
