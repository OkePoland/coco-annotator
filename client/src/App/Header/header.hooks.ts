import { useState, useEffect, useRef } from 'react';

import { NavItem, staticNavItems } from '../navItems';
import { SocketEvent } from '../../common/sockets/events';
import { Dataset } from '../../common/types';

import useSocketEvent from '../../common/hooks/useSocketEvent';
import useGlobalContext from '../../common/hooks/useGlobalContext';

interface HeaderState {
    version: string;
    connected: boolean | null;
    loadingState: LoadingState;
    drawerOn: boolean;
    menuItems: Array<NavItem>;
    setDrawerOn: (active: boolean) => void;
}

export interface LoadingState {
    isLoading: boolean;
    message: string;
}

export const useHeaderState = (): HeaderState => {
    const [state] = useGlobalContext();
    const connected = useConnectionState();
    const [drawerOn, setDrawerOn] = useState(false);
    const loadingState = useLoadingState(state.processList);
    const menuItems = useMenuItems(state.dataset);

    return {
        version: state.appInfo.git.tag,
        connected: connected,
        loadingState: loadingState,
        drawerOn: drawerOn,
        menuItems: menuItems,
        setDrawerOn: setDrawerOn,
    };
};

const useLoadingState = (processList: Array<string>): LoadingState => {
    const [message, setMessage] = useState('');
    const lastProcess = useRef(message);

    useEffect(() => {
        let msg: string;
        if (processList.length > 1) {
            msg = 'Multiple tasks running ...';
        } else if (processList.length === 1) {
            lastProcess.current = processList[0];
            msg = processList[0];
        } else if (lastProcess.current === '') {
            msg = 'Done';
        } else {
            msg =
                'Done ' +
                lastProcess.current.charAt(0).toLowerCase() +
                lastProcess.current.slice(1);
        }
        setMessage(msg);
    }, [processList]);

    return {
        isLoading: processList.length > 0,
        message: message,
    };
};

const useConnectionState = (): boolean | null => {
    const [connected, setConnected] = useState<boolean | null>(null);

    useSocketEvent(SocketEvent.CONNECT, () => {
        console.log('Socket: event: connect');
        setConnected(true);
    });
    useSocketEvent(SocketEvent.DISCONNECT, () => {
        console.log('Socket: event: disconnect');
        setConnected(false);
    });
    return connected;
};

const useMenuItems = (dataset: Dataset | null): Array<NavItem> => {
    // Calculate extra page for menu
    let menuItems: Array<NavItem> = [];
    if (dataset) {
        const extraItem: NavItem = {
            title: dataset.name,
            href: `/dataset/${dataset.id}`,
        };
        const items = [...staticNavItems];
        items.splice(1, 0, extraItem);
        menuItems = items;
    } else {
        menuItems = staticNavItems;
    }
    return menuItems;
};
