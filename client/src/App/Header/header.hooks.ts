import { useState } from 'react';

import { NavItem, staticNavItems } from '../navItems';

interface HeaderState {
    backendState: BackendState;
    loadingState: LoadingState;
    drawerOn: boolean;
    menuItems: Array<NavItem>;
    setDrawerOn: (active: boolean) => void;
}

export const useHeaderState = (): HeaderState => {
    const [drawerOn, setDrawerOn] = useState(false);
    const backendState = useBackendState();
    const loadingState = useLoadingState();
    const menuItems = useMenuItems();

    return {
        backendState: backendState,
        loadingState: loadingState,
        drawerOn: drawerOn,
        menuItems: menuItems,
        setDrawerOn: setDrawerOn,
    };
};

// TODO implement socket for obtaining Backend state (#)
export enum BackendStatus {
    SUCCESS,
    ERROR,
    UNKNOWN,
}

export interface BackendState {
    status: BackendStatus;
    message: string;
}

const useBackendState = (): BackendState => {
    const status = BackendStatus.SUCCESS;
    const message = 'Connected to backend';

    return {
        status: status,
        message: message,
    };
};

// TODO implement global context to get status
// of most recent loading action (#)
export interface LoadingState {
    isLoading: boolean;
    isError: boolean;
    message: string;
}

const useLoadingState = (): LoadingState => {
    const isLoading = false;
    const isError = false;
    const message = 'Done loading datasets...';

    return {
        isLoading: isLoading,
        isError: isError,
        message: message,
    };
};

// TODO implement extra page calculation (#)
const useMenuItems = (): Array<NavItem> => {
    const extraPage = false;

    let menuItems: Array<NavItem> = [];
    if (extraPage) {
        const extraItem: NavItem = { title: 'dataset1', href: '#' };
        const items = [...staticNavItems];
        items.splice(1, 0, extraItem);
        menuItems = items;
    } else {
        menuItems = staticNavItems;
    }
    return menuItems;
};
