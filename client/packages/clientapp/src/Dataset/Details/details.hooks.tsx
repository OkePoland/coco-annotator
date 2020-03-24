import {
    useState,
    useEffect,
    useCallback,
    useRef,
    useMemo,
    MouseEvent,
    Dispatch,
    SetStateAction,
} from 'react';
import { useNavigation } from 'react-navi';

import { Image, Dataset } from '../../common/types';
import * as DatasetApi from '../datasets.api';
import useGlobalContext from '../../common/hooks/useGlobalContext';
import { addProcess, removeProcess } from '../../common/utils/globalActions';

// interfaces
interface PageState {
    tabs: [number, Dispatch<SetStateAction<number>>];
    filters: FilterState;
    folders: string[];
    setFolders: Dispatch<SetStateAction<string[]>>;
    details: DetailsState;
    sidebar: SidebarState;
    dialogs: DialogsState;
    actions: {
        deleteImageAction(id: number): void;
        annotateImageAction(id: number): void;
        resetMetadataAction(): void;
        removeFolder(folder: string): void;
    };
}
export interface ICategory {
    id: number;
    name: string;
}

export interface FilterState {
    contains: [string, Dispatch<SetStateAction<string>>];
    order: [string, Dispatch<SetStateAction<string>>];
    annotated: boolean | string | null;
    annotatedOn: boolean;
    notAnnotatedOn: boolean;
    setAnnotatedOn: Dispatch<SetStateAction<boolean>>;
    setNotAnnotatedOn: Dispatch<SetStateAction<boolean>>;
}
interface DetailsState {
    dataset: Dataset | null;
    categories: ICategory[];
    categoryTags: string[];
    subdirectories: string[];

    // image related fields
    images: Image[];
    imagesCount: number;
    pagesCount: number;

    offset: [number, Dispatch<SetStateAction<number>>];
    setPage: Dispatch<SetStateAction<number>>;
    refreshPage: () => void;
}
interface NavigationState {
    openAnnotator(id: number): void;
}

interface SidebarState {
    width: number;
    sidebarRef: React.RefObject<HTMLDivElement> | null;
    handleMouseDown: (event: MouseEvent) => void;
}

interface SidebarWidth {
    isResizing: boolean;
    width: number;
}

export interface DialogsState {
    generate: [boolean, Dispatch<SetStateAction<boolean>>];
    exportDialog: [boolean, Dispatch<SetStateAction<boolean>>];
    importDialog: [boolean, Dispatch<SetStateAction<boolean>>];
}

// hooks
export const usePage = (id: number): PageState => {
    const { navigate } = useNavigation();
    const tabs = useState(0);
    const filters = useFilterState();
    const [folders, setFolders] = useState<string[]>([]);

    const details = useDetails(id, filters, folders);
    const sidebar = useSidebar();
    const dialogs = useDialogs();

    // actions
    const annotateImageAction = (id: number) => {
        navigate(`/annotate/${id}`);
    };
    const deleteImageAction = async (id: number) => {
        await DatasetApi.deleteImage(id);
        details.refreshPage();
    };

    const resetMetadataAction = async () => {
        let isConfirmed = window.confirm(
            'You can not undo reseting of all metadata in' +
                'this dataset. This includes metadata of images' +
                'and annotations.',
        );

        if (isConfirmed) {
            await DatasetApi.resetMetadata(id);
        }
    };
    const removeFolder = (folder: string) => {
        const updatedFolders = [...folders];
        const index = updatedFolders.indexOf(folder);
        updatedFolders.splice(index + 1, updatedFolders.length);
        setFolders(updatedFolders);
    };

    return {
        tabs,
        filters,
        folders,
        setFolders,
        details,
        sidebar,
        dialogs,
        actions: {
            deleteImageAction,
            annotateImageAction,
            resetMetadataAction,
            removeFolder,
        },
    };
};

const useFilterState = (): FilterState => {
    const contains = useState<string>('');
    const order = useState<string>('file_name');
    const [annotatedOn, setAnnotatedOn] = useState<boolean>(true);
    const [notAnnotatedOn, setNotAnnotatedOn] = useState<boolean>(true);

    const annotated = useMemo(() => {
        if (annotatedOn && notAnnotatedOn) return null;
        if (!annotatedOn && !notAnnotatedOn) return ' ';

        return annotatedOn;
    }, [annotatedOn, notAnnotatedOn]);

    return {
        contains,
        order,
        annotated,
        annotatedOn,
        notAnnotatedOn,
        setAnnotatedOn,
        setNotAnnotatedOn,
    };
};

const useDetails = (
    id: number,
    filters: FilterState,
    folders: string[],
): DetailsState => {
    const [, dispatch] = useGlobalContext();
    const [generation, moveGeneration] = useState(0);

    const {
        contains: [contains],
        order: [order],
        annotated,
    } = filters;

    const [page, setPage] = useState(1);
    const offset = useState(0);
    const [dataset, setDataset] = useState<Dataset | null>(null);
    const [images, setImages] = useState<Image[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [imagesCount, setImagesCount] = useState<number>(0);
    const [pagesCount, setPagesCount] = useState<number>(1);
    const [subdirectories, setSubdirectories] = useState<string[]>([]);

    const refreshPage = () => {
        moveGeneration(c => c + 1);
    };

    useEffect(() => {
        const update = async () => {
            const process = 'Loading images from dataset';

            addProcess(dispatch, process);

            const data = await DatasetApi.getDetails({
                id,
                page,
                folder: folders.join('/'),
                order,
                file_name__icontains: contains,
                annotated,
            });
            setDataset(data.dataset);
            setImages(data.images);
            setCategories(data.categories);
            setImagesCount(data.total);
            setPagesCount(data.pages);
            setSubdirectories(data.subdirectories);

            removeProcess(dispatch, process);
        };
        update();
    }, [id, page, contains, order, generation, folders, annotated, dispatch]);

    const categoryTags = categories.map(category => category.name);

    return {
        offset,
        dataset,
        images,
        categories,
        categoryTags,
        imagesCount,
        pagesCount,
        subdirectories,
        setPage,
        refreshPage,
    };
};

export const useSidebar = (): SidebarState => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [{ isResizing, width }, setWidth] = useState<SidebarWidth>({
        isResizing: false,
        width: 240,
    });

    const handleMouseDown = useCallback((event: MouseEvent) => {
        setWidth(c => ({ ...c, isResizing: true }));
    }, []);

    const handleMouseMove = useCallback(
        (event: any) => {
            if (!isResizing) {
                return;
            }

            const element = sidebarRef.current;
            if (!element) {
                return;
            }

            if (isResizing) {
                event.preventDefault();
                let max = window.innerWidth * 0.5;
                setWidth(c => ({
                    ...c,
                    width: Math.min(Math.max(event.x, 160), max),
                }));
            }
        },
        [isResizing],
    );

    const handleMouseUp = useCallback((event: any) => {
        setWidth(c => ({ ...c, isResizing: false }));
    }, []);

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    return {
        width,
        sidebarRef,
        handleMouseDown,
    };
};

const useDialogs = () => {
    const generate = useState(false);
    const exportDialog = useState(false);
    const importDialog = useState(false);

    return {
        generate,
        exportDialog,
        importDialog,
    };
};
