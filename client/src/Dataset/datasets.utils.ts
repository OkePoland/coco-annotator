import { AxiosRequestConfig } from 'axios';

import * as DatasetApi from './datasets.api';
import Api from '../common/api';

interface IDownloadCoco {
    name: string;
    id: number;
    addCallback: () => void;
    removeCallback: () => void;
}

interface IDownloadImage {
    id: number;
    name: string;
}

export const downloadURI = (uri: string, exportName: string) => {
    let link = document.createElement('a');
    link.href = uri;
    link.download = exportName;
    document.body.appendChild(link);
    link.click();
    link.remove();
};

export const getImageUrl = (imageId: number | undefined) => {
    if (imageId != null) {
        return `/api/image/${imageId}?width=250`;
    } else {
        return 'img/no-image.png';
    }
};

export const onCocoDownloadClick = async ({
    name,
    id,
    addCallback,
    removeCallback,
}: IDownloadCoco) => {
    addCallback();

    const response = await DatasetApi.getCoco(id);
    const dataStr =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(response.data));
    downloadURI(dataStr, name + '.json');

    removeCallback();
};

const getDownloadImageURL = () =>
    process.env.NODE_ENV === 'production'
        ? process.env.PROD_REACT_APP_API_BASE_URL
        : process.env.REACT_APP_API_BASE_URL;

export const downloadImageAction = async ({ id, name }: IDownloadImage) => {
    const uri = `${getDownloadImageURL()}/image/${id}?asAttachment=true`;
    downloadURI(uri, name);

    const response = await DatasetApi.downloadImage(id);
    const dataStr =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(response.data));
    downloadURI(dataStr, name.replace(/\.[^/.]+$/, '') + '.json');
};

export const onDeleteClick = async (
    id: number,
    afterDeleteCallback: () => void,
) => {
    await DatasetApi.deleteDataset(id);
    afterDeleteCallback();
};

export const downloadExport = async (id: number, dataset: string) => {
    const requestConfig: AxiosRequestConfig = {
        url: `/export/${id}/download`,
        method: 'GET',
        responseType: 'blob',
    };
    const response = await Api.request(requestConfig);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${dataset}-${id}.json`);
    document.body.appendChild(link);
    link.click();
};
