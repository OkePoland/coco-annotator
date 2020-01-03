export interface Column {
    id: 'date' | 'instanceType' | 'id' | 'name' | 'rollback' | 'delete';
    label: string;
}

export const columns: Column[] = [
    { id: 'date', label: 'Date' },
    { id: 'instanceType', label: 'Instance Type' },
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name' },
    { id: 'rollback', label: 'Rollback' },
    { id: 'delete', label: 'Delete' },
];
