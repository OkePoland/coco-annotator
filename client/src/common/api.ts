import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

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
                const message = error.response.data.message;
                if (status) {
                    switch (status) {
                        case 400:
                            return Promise.reject(message);
                        case 401:
                            return Promise.reject(message);
                        case 403:
                            return Promise.reject(message);
                        case 404:
                            return Promise.reject(message);
                    }
                    return Promise.reject(message);
                }
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

    private constructor() {}
}
