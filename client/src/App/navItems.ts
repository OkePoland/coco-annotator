export interface NavItem {
    title: string;
    href: string;
}

export const staticNavItems: Array<NavItem> = [
    {
        title: 'Datasets',
        href: '/datasets',
    },
    {
        title: 'Categories',
        href: '/categories',
    },
    {
        title: 'Undo',
        href: '/undo',
    },
    {
        title: 'Tasks',
        href: '/tasks',
    },
    {
        title: 'Admin',
        href: '/admin',
    },
    {
        title: 'API',
        href: '/api',
    },
    {
        title: 'Help',
        href: 'https://github.com/jsbroks/coco-annotator/wiki',
    },
];
