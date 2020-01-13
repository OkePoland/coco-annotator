export const TASK_COMPLETED = 100;

export enum FILTER {
    ALL = 'ALL',
    ERRORS = 'ERROR',
    WARNINGS = 'WARNING',
}

interface Dictionary {
    [key: string]: 'error' | 'secondary' | 'initial';
}

export const dictionary: Dictionary = {
    error: 'error',
    warning: 'secondary',
    default: 'initial',
};
