export interface Column {
    id: 'username' | 'name' | 'isAdmin' | 'deleteUsers';
    label: string;
}

export const columns: Column[] = [
    { id: 'username', label: 'Username' },
    { id: 'name', label: 'Name' },
    { id: 'isAdmin', label: 'Admin' },
    { id: 'deleteUsers', label: 'Delete' },
];
