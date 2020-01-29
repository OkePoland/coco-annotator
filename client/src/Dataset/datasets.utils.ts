import * as DatasetApi from './datasets.api';

interface IDownloadCoco {
    name: string;
    id: number;
    addCallback: () => void;
    removeCallback: () => void;
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

export const onDeleteClick = async (
    id: number,
    afterDeleteCallback: () => void,
) => {
    await DatasetApi.deleteDataset(id);
    afterDeleteCallback();
};
