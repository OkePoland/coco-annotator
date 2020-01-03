import { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { FormikConfig, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

import { Category } from '../common/types';
import * as CategoriesApi from './categories.api';
import useGlobalContext from '../common/hooks/useGlobalContext';
import { addProcess, removeProcess } from '../common/utils/globalActions';

interface ListState {
    page: number;
    pages: number;
    categoryCount: number;
    categories: Category[];
    setPage: Dispatch<SetStateAction<number>>;
    refreshPage(): void;
}
interface DialogsState {
    help: [boolean, Dispatch<SetStateAction<boolean>>];
    create: [boolean, Dispatch<SetStateAction<boolean>>];
}
interface CategoriesState {
    list: ListState;
    dialogs: DialogsState;
    edit: [Category | null, Dispatch<SetStateAction<Category | null>>];
    onDeleteClick(id: number): Promise<void>;
}
interface FormCreateState {
    categoryName: string;
}
interface FormEditState {
    updatedName: string;
}

export const useCategories = (): CategoriesState => {
    const list = useList(50);
    const dialogs = useDialogs();
    const edit = useState<Category | null>(null);

    const onDeleteClick = async (id: number) => {
        await CategoriesApi.deleteCategory(id);
        list.refreshPage();
    };

    return {
        list,
        dialogs,
        edit,
        onDeleteClick,
    };
};

export const useFormikCreate = (
    refreshPage: () => void,
): FormikConfig<FormCreateState> => {
    const { enqueueSnackbar } = useSnackbar();
    const initialValues = {
        categoryName: '',
    };
    const validationSchema = Yup.object({
        categoryName: Yup.string()
            .min(1)
            .required('Required'),
    });
    const onSubmit = async (
        { categoryName }: FormCreateState,
        { resetForm }: FormikHelpers<FormCreateState>,
    ) => {
        const response = await CategoriesApi.create(categoryName);
        if (response.message) {
            enqueueSnackbar(response.message, { variant: 'error' });
        } else {
            resetForm();
            refreshPage();
        }
    };

    return {
        initialValues,
        validationSchema,
        onSubmit,
    };
};

export const useFormikEdit = (
    refreshPage: () => void,
    category: Category | null,
): FormikConfig<FormEditState> => {
    const { enqueueSnackbar } = useSnackbar();
    const initialValues = {
        updatedName: category ? category.name : '',
    };
    const validationSchema = Yup.object({
        updatedName: Yup.string()
            .min(1)
            .required('Required'),
    });
    const onSubmit = async (
        { updatedName }: FormEditState,
        { resetForm }: FormikHelpers<FormEditState>,
    ) => {
        const response = await CategoriesApi.update({
            name: updatedName,
            id: category && category.id,
        });
        if (response.message) {
            resetForm();
            enqueueSnackbar(response.message, { variant: 'error' });
        } else {
            resetForm();
            refreshPage();
            enqueueSnackbar('Category name has been updated', {
                variant: 'success',
            });
        }
    };

    return {
        initialValues,
        validationSchema,
        onSubmit,
    };
};

const useList = (categoriesPerPage: number): ListState => {
    const [, dispatch] = useGlobalContext();

    const [generation, moveGeneration] = useState(0);
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(0);
    const [categoryCount, setCategoryCount] = useState(0);
    const [categories, setCategories] = useState<Category[]>([]);

    const refreshPage = () => {
        moveGeneration(c => c + 1);
    };

    useEffect(() => {
        const update = async (page: number) => {
            const process = 'Loading categories';

            addProcess(dispatch, process);

            const { categories, pagination } = await CategoriesApi.getAll(
                page,
                categoriesPerPage,
            );
            setCategories(categories);
            setCategoryCount(pagination.total);
            setPages(pagination.pages);

            removeProcess(dispatch, process);
        };
        update(page);
    }, [page, generation, categoriesPerPage, dispatch]);

    return {
        page,
        pages,
        categoryCount,
        categories,
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
