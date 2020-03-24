export interface NavItem {
    title: string;
    href: string;
}

export const Datasets: NavItem = {
    title: 'Datasets',
    href: '/datasets',
};

export const Categories: NavItem = {
    title: 'Categories',
    href: '/categories',
};

export const Undo: NavItem = {
    title: 'Undo',
    href: '/undo',
};

export const Tasks: NavItem = {
    title: 'Tasks',
    href: '/tasks',
};

export const Admin: NavItem = {
    title: 'Admin',
    href: '/admin',
};

export const API: NavItem = {
    title: 'API',
    href: process.env.REACT_APP_API_BASE_URL!,
};

export const Help: NavItem = {
    title: 'Help',
    href: 'https://github.com/jsbroks/coco-annotator/wiki',
};
