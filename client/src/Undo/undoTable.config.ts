export enum ColumnOptions {
    DATE = 'date',
    INSTANCE_TYPE = 'instanceType',
    ID = 'id',
    NAME = 'name',
    ROLLBACK = 'rollback',
    DELETE = 'delete',
}

export interface Column {
    id: ColumnOptions;
    label: string;
}

export const columns: Column[] = [
    { id: ColumnOptions.DATE, label: 'Date' },
    { id: ColumnOptions.INSTANCE_TYPE, label: 'Instance Type' },
    { id: ColumnOptions.ID, label: 'ID' },
    { id: ColumnOptions.NAME, label: 'Name' },
    { id: ColumnOptions.ROLLBACK, label: 'Rollback' },
    { id: ColumnOptions.DELETE, label: 'Delete' },
];
