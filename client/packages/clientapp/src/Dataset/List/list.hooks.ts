import { useState, useEffect, Dispatch, SetStateAction, useMemo } from 'react';
import { useNavigation } from 'react-navi';

import { Dataset, Category, UserInfo } from '../../common/types';
import * as DatasetApi from '../datasets.api';
import * as AdminPanelApi from '../../AdminPanel/adminPanel.api';
import useGlobalContext from '../../common/hooks/useGlobalContext';
import useAuthContext from '../../common/hooks/useAuthContext';
import { addProcess, removeProcess } from '../../common/utils/globalActions';

// interfaces
interface DatasetsState {
    list: ListState;
    dialogs: DialogsState;
    edit: [
        DatasetWithCategories | null,
        Dispatch<SetStateAction<DatasetWithCategories | null>>,
    ];
    share: [
        DatasetWithCategories | null,
        Dispatch<SetStateAction<DatasetWithCategories | null>>,
    ];
    navigation: NavigationState;
    datasetWithCategories: DatasetWithCategories[];
}
interface NavigationState {
    openDetails(dataset: DatasetWithCategories): void;
}
interface ListState {
    offset: [number, Dispatch<SetStateAction<number>>];
    pageCount: number;
    datasets: Dataset[];
    categories: Category[];
    tags: string[];
    usernames: string[];
    setPage: Dispatch<SetStateAction<number>>;
    refreshPage(): void;
}
interface DialogsState {
    help: [boolean, Dispatch<SetStateAction<boolean>>];
    create: [boolean, Dispatch<SetStateAction<boolean>>];
}
export interface DatasetWithCategories {
    dataset: Dataset;
    categories: Category[];
}

// hooks
export const useDatasetsPage = (): DatasetsState => {
    const { getCurrentUser } = useAuthContext();
    const currentUser: UserInfo | null = useMemo(getCurrentUser, [
        getCurrentUser,
    ]);

    const navigation = usePageNavigation();
    const list = useList(52, currentUser);
    const dialogs = useDialogs();
    const edit = useState<DatasetWithCategories | null>(null);
    const share = useState<DatasetWithCategories | null>(null);

    const categoriesDictionary = useMemo(
        () =>
            list.categories.reduce(
                (result: { [key: string]: Category }, category: Category) => {
                    result[category.id] = category;
                    return result;
                },
                {},
            ),
        [list.categories],
    );

    const datasetWithCategories: DatasetWithCategories[] = list.datasets.map(
        dataset => {
            const categories = dataset.categories
                .map(categoryId => ({ ...categoriesDictionary[categoryId] }))
                .filter(datasetCategory => Object.keys(datasetCategory).length);

            return { dataset: dataset, categories: categories };
        },
    );

    return {
        list,
        dialogs,
        edit,
        share,
        navigation,
        datasetWithCategories,
    };
};

const usePageNavigation = (): NavigationState => {
    const { navigate } = useNavigation();
    const openDetails = ({ dataset }: DatasetWithCategories) => {
        navigate(`/dataset/${dataset.id}`);
    };
    return {
        openDetails,
    };
};

const useList = (
    itemsPerPage: number,
    currentUser: UserInfo | null,
): ListState => {
    const [, dispatch] = useGlobalContext();

    const [page, setPage] = useState(1);
    const offset = useState(0);
    const [generation, moveGeneration] = useState(0);
    const [pageCount, setPageCount] = useState(1);
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [users, setUsers] = useState<UserInfo[]>([]);

    const refreshPage = () => {
        moveGeneration(c => c + 1);
    };

    useEffect(() => {
        const update = async (page: number) => {
            const process = 'Loading datasets';

            addProcess(dispatch, process);

            const { data } = await DatasetApi.getAll(page, itemsPerPage);
            setDatasets(data.datasets);
            setCategories(data.categories);
            setPageCount(data.pagination.pages);
            if (currentUser && currentUser.is_admin) {
                const {
                    data: { users },
                } = await AdminPanelApi.getUsers(itemsPerPage);
                setUsers(users);
            }
            removeProcess(dispatch, process);
        };
        update(page);
    }, [page, generation, itemsPerPage, dispatch, currentUser]);

    const tags = categories.map(category => category.name);
    const usernames = users.map(user => user.username);

    return {
        offset,
        pageCount,
        datasets,
        categories,
        tags,
        usernames,
        setPage,
        refreshPage,
    };
};

const useDialogs = () => {
    const help = useState(false);
    const create = useState(false);

    return {
        help,
        create,
    };
};
