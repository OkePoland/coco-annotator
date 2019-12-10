import { useState, Dispatch, SetStateAction, useEffect } from 'react';
import { FormikHelpers, FormikConfig } from 'formik';
import * as Yup from 'yup';

import { UserInfo } from '../common/types';
import * as AdminPanelApi from './adminPanel.api';
import useGlobalContext from '../common/hooks/useGlobalContext';
import { addProcess, removeProcess } from '../common/utils/globalActions';

interface ListState {
    users: UserInfo[];
    total: number;
    refreshPage(): void;
}
interface TableState {
    rows: TableData[];
    deleteUser: (user: TableData) => Promise<void>;
}
interface AdminPanelState {
    list: ListState;
    create: [boolean, Dispatch<SetStateAction<boolean>>];
    usersLimit: [number, Dispatch<SetStateAction<number>>];
    table: TableState;
}
interface FormCreateState {
    username: string;
    password: string;
    name: string;
    isAdmin: boolean;
}
export interface TableData {
    username: string;
    name: string;
    isAdmin: boolean;
    deleteUsers: boolean;
}

export const useAdminPanel = (): AdminPanelState => {
    const create = useState(false);
    const usersLimit = useState<number>(50);
    const list = useList(usersLimit[0]);
    const table = useTable(list.users, list.refreshPage);

    return {
        list,
        create,
        usersLimit,
        table,
    };
};

export const useFormikCreate = (
    refreshPage: () => void,
): FormikConfig<FormCreateState> => {
    const initialValues = {
        username: '',
        password: '',
        name: '',
        isAdmin: false,
    };
    const validationSchema = Yup.object({
        username: Yup.string()
            .max(10, 'Must be 10 characters or less')
            .required('Required'),
        password: Yup.string()
            .min(5, 'Minimum length of 5 characters')
            .required('Required'),
        name: Yup.string()
            .max(10, 'Must be 10 characters or less')
            .required('Required'),
        isAdmin: Yup.boolean(),
    });
    const onSubmit = async (
        values: FormCreateState,
        { resetForm, setStatus }: FormikHelpers<FormCreateState>,
    ) => {
        const response = await AdminPanelApi.createUser(values);
        if (response.message) {
            setStatus(response.message);
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

const useList = (usersPerPage: number): ListState => {
    const [, dispatch] = useGlobalContext();

    const [generation, moveGeneration] = useState(0);
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [total, setTotal] = useState<number>(0);

    const refreshPage = () => {
        moveGeneration(c => c + 1);
    };

    useEffect(() => {
        const update = async () => {
            const process = 'Loading users';

            addProcess(dispatch, process);

            const { data } = await AdminPanelApi.getUsers(usersPerPage);
            setUsers(data.users);
            setTotal(data.total);

            removeProcess(dispatch, process);
        };
        update();
    }, [generation, usersPerPage, dispatch]);

    return {
        users,
        total,
        refreshPage,
    };
};

export const useTable = (users: UserInfo[], refreshPage: () => void) => {
    const [rows, setRows] = useState<TableData[]>([]);

    useEffect(() => {
        setRows(
            users.map(user => ({
                username: user.username,
                name: user.name,
                isAdmin: user.is_admin,
                deleteUsers: false,
            })),
        );
    }, [users]);

    const deleteUser = async (user: TableData) => {
        const isConfirmed = window.confirm(
            `Are you sure you want to delete ${user.username}. This action cannot be undone.`,
        );
        if (isConfirmed) {
            await AdminPanelApi.deleteUser(user.username);
            refreshPage();
        }
    };

    return {
        rows,
        deleteUser,
    };
};
