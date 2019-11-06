import React, { useState } from 'react';

import { getServerInfo } from './auth.api';

interface AuthState {
    activeTab: number;
    showLoginForm: boolean;
    handleChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

const useAuth = (): AuthState => {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [users, setUsers] = useState<number | undefined>(0);

    const showLoginForm = users !== 0;

    const fetchUsersInfo = async () => {
        const usersInfo = await getServerInfo();
        setUsers(usersInfo);
    };
    fetchUsersInfo();

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setActiveTab(newValue);
    };
    return {
        activeTab,
        showLoginForm,
        handleChange,
    };
};

export default useAuth;
