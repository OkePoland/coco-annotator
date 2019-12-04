import { useState, useEffect } from 'react';

import * as DatasetApi from '../../datasets.api';

interface User {
    name: string;
    username: string;
    group: string;
    last_seen: Date;
}

interface MembersPageState {
    users: User[];
}

export const useMembersPage = (id: number): MembersPageState => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const update = async () => {
            const { data } = await DatasetApi.getUsers(id);
            setUsers(data);
        };
        update();
    }, [id]);

    return { users: users };
};
