import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

interface Props {
    baseURL?: string;
    withCredentials?: boolean;
    deleteCurrentUser?: () => void;
}

class AxiosHandler {
    private axiosInstance!: AxiosInstance;

    public async init(props: Props) {
        const { baseURL, withCredentials, deleteCurrentUser } = props;

        const config: AxiosRequestConfig = {
            baseURL,
            withCredentials: withCredentials || false,
        };

        this.axiosInstance = axios.create(config);

        if (deleteCurrentUser) {
            this.addApiInterceptors(deleteCurrentUser);
        }
    }

    private addApiInterceptors(deleteCurrentUser: () => void) {
        this.axiosInstance.interceptors.response.use(
            response => response,
            error => {
                const status = error.response.status;
                if (status === 401 || status === 403) {
                    deleteCurrentUser();
                }
                return Promise.reject(error.response);
            },
        );
    }

    public get<T>(url: string, config?: AxiosRequestConfig) {
        return this.axiosInstance.get<T>(url, config).catch(err => err);
    }

    public post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.axiosInstance.post<T>(url, data, config).catch(err => err);
    }

    public request<T>(config: AxiosRequestConfig) {
        return this.axiosInstance.request<T>(config).catch(err => err);
    }

    public delete<T>(url: string, config?: AxiosRequestConfig) {
        return this.axiosInstance.delete<T>(url, config).catch(err => err);
    }

    public put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.axiosInstance.put<T>(url, data, config).catch(err => err);
    }
}

export default AxiosHandler;
