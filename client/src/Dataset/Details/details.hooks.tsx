import { useState, useEffect } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { useNavigation } from 'react-navi';

import { Image, Dataset } from '../../common/types';
import * as DatasetApi from '../datasets.api';
import useGlobalContext from '../../common/hooks/useGlobalContext';
import { addProcess, removeProcess } from '../../common/utils/globalActions';

// interfaces
interface PageState {
    tabs: [number, Dispatch<SetStateAction<number>>];
    filters: FilterState;
    folder: [string, Dispatch<SetStateAction<string>>];
    details: DetailsState;
    actions: {
        generateAction(): void;
        scanAction(): void;
        importAction(): void;
        exportAction(): void;
        deleteImageAction(id: number): void;
        annotateImageAction(id: number): void;
        downloadImageAction(id: number): void;
        resetMetadataAction(): void;
    };
}
export interface FilterState {
    contains: [string, Dispatch<SetStateAction<string>>];
    order: [string, Dispatch<SetStateAction<string>>];
    annotatedOn: [boolean, Dispatch<SetStateAction<boolean>>];
    notAnnotatedOn: [boolean, Dispatch<SetStateAction<boolean>>];
}
interface DetailsState {
    dataset: Dataset | null;
    categories: string[];
    subdirectories: string[];

    // image related fields
    images: Image[];
    imagesCount: number;
    pagesCount: number;

    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    refreshPage: () => void;
}
interface NavigationState {
    openAnnotator(id: number): void;
}

// hooks
export const usePage = (id: number): PageState => {
    const { openAnnotator } = usePageNavigation();
    const tabs = useState(0);
    const filters = useFilterState();
    const folder = useState<string>('');

    const details = useDetails(id);

    // actions
    const generateAction = async () => {
        // TODO
    };
    const scanAction = async () => {
        // TODO
    };
    const importAction = async () => {
        // TODO
    };
    const exportAction = async () => {
        // TODO
    };
    const deleteImageAction = async (id: number) => {
        await DatasetApi.deleteImage(id);
        details.refreshPage();
    };
    const downloadImageAction = (id: number) => {
        // TODO
        details.refreshPage();
    };
    const resetMetadataAction = () => {
        // TODO
    };

    return {
        tabs,
        filters,
        folder,
        details,
        actions: {
            generateAction,
            scanAction,
            importAction,
            exportAction,
            deleteImageAction,
            annotateImageAction: openAnnotator,
            downloadImageAction,
            resetMetadataAction,
        },
    };
};

const useFilterState = (): FilterState => {
    const contains = useState<string>('');
    const order = useState<string>('File Name');
    const annotatedOn = useState<boolean>(false);
    const notAnnotatedOn = useState<boolean>(false);

    return {
        contains,
        order,
        annotatedOn,
        notAnnotatedOn,
    };
};

const useDetails = (id: number): DetailsState => {
    const [, dispatch] = useGlobalContext();
    const [page, setPage] = useState(0);
    const [generation, moveGeneration] = useState(0);

    const [dataset, setDataset] = useState<Dataset | null>(null);
    const [images, setImages] = useState<Image[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [imagesCount, setImagesCount] = useState<number>(0);
    const [pagesCount, setPagesCount] = useState<number>(0);
    const [subdirectories, setSubdirectories] = useState<string[]>([]);

    const refreshPage = () => {
        moveGeneration(c => c + 1);
    };

    useEffect(() => {
        const update = async () => {
            const process = 'Loading images from dataset';

            addProcess(dispatch, process);

            // TODO add folder order param
            const { data } = await DatasetApi.getDetails(id);
            setDataset(data.dataset);
            setImages(data.images);
            setCategories(data.categories);
            setImagesCount(data.total);
            setPagesCount(data.pages);
            setSubdirectories(data.subdirectories);

            removeProcess(dispatch, process);
        };
        update();
    }, [id, page, generation, dispatch]);

    return {
        dataset,
        images,
        categories,
        imagesCount,
        pagesCount,
        subdirectories,
        page,
        setPage,
        refreshPage,
    };
};

const usePageNavigation = (): NavigationState => {
    const navigation = useNavigation();
    const openAnnotator = (id: number) => {
        navigation.navigate(`/annotate/${id}`);
    };
    return {
        openAnnotator: openAnnotator,
    };
};
