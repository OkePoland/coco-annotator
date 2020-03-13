import React, { useState, useEffect } from 'react';

import { getServerInfo } from './auth.api';

interface AuthState {
    activeTab: number;
    showLoginForm: boolean;
    changeTabPanel: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

const useAuth = (): AuthState => {
    const [users, setUsers] = useState<number | undefined>(0);
    const showLoginForm = users !== 0;
    const [activeTab, setActiveTab] = useState<number>(showLoginForm ? 0 : 1);

    useEffect(() => {
        const fetchUsersInfo = async () => {
            const usersInfo = await getServerInfo();
            setUsers(usersInfo);
        };
        fetchUsersInfo();
    }, []);

    const changeTabPanel = (event: React.ChangeEvent<{}>, newValue: number) => {
        setActiveTab(newValue);
    };

    return {
        activeTab,
        showLoginForm,
        changeTabPanel,
    };
};

export default useAuth;
