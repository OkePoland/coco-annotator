import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useNavigation } from 'react-navi';
import { useFormik, FormikProps } from 'formik';
import * as Yup from 'yup';

import { Dataset } from '../common/types';
import * as DatasetApi from './datasets.api';
import useGlobalContext from '../common/hooks/useGlobalContext';
import { addProcess, removeProcess } from '../common/utils/globalActions';

// interfaces
interface DatasetsState {
    list: ListState;
    dialogs: DialogsState;
    navigation: NavigationState;
}
interface NavigationState {
    openDetails(dataset: Dataset): void;
}
interface ListState {
    page: number;
    pageCount: number;
    datasets: Dataset[];
    categories: string[];
    setPage: Dispatch<SetStateAction<number>>;
    refreshPage(): void;
}
interface DialogsState {
    help: [boolean, Dispatch<SetStateAction<boolean>>];
    create: [boolean, Dispatch<SetStateAction<boolean>>];
    share: [boolean, Dispatch<SetStateAction<boolean>>];
    edit: [boolean, Dispatch<SetStateAction<boolean>>];
}
interface FormCreateState {
    name: string;
    categories: Array<string>;
}

// hooks
export const useDatasetsPage = (): DatasetsState => {
    const navigation = usePageNavigation();
    const list = useList(52);
    const dialogs = useDialogs();

    return {
        list: list,
        dialogs: dialogs,
        navigation: navigation,
    };
};

const usePageNavigation = (): NavigationState => {
    const navigation = useNavigation();
    const openDetails = (dataset: Dataset) => {
        navigation.navigate(`/dataset/${dataset.id}`);
    };
    return {
        openDetails: openDetails,
    };
};

const useList = (itemsPerPage: number): ListState => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_globalState, dispatch] = useGlobalContext();

    const [page, setPage] = useState(0);
    const [generation, moveGeneration] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [categories, setCategories] = useState<string[]>([]); // TODO

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

            removeProcess(dispatch, process);
        };
        update(page);
    }, [page, generation, itemsPerPage, dispatch]);

    return {
        page: page,
        pageCount: pageCount,
        datasets: datasets,
        categories: categories,
        setPage: setPage,
        refreshPage: refreshPage,
    };
};

const useDialogs = () => {
    const help = useState(false);
    const create = useState(false);
    const edit = useState(false);
    const share = useState(false);
    return {
        help: help,
        create: create,
        edit: edit,
        share: share,
    };
};

export const useFormikCreate = (
    refeshPage: () => void,
): FormikProps<FormCreateState> => {
    const formik = useFormik<FormCreateState>({
        initialValues: {
            name: '',
            categories: [],
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .max(10, 'Must be 10 characters or less')
                .required('Required'),
            categories: Yup.array()
                .of(Yup.string())
                .max(2, 'Must be Max 2 categories'),
        }),
        onSubmit: async (values, { resetForm }) => {
            await DatasetApi.create(values.name);

            resetForm();
            refeshPage();
        },
    });
    return formik;
};

export const useFormikImport = () => {
    // TODO
};

export const useFormikEdit = () => {
    // TODO
};

export const useFormikShare = () => {
    // TODO
};
