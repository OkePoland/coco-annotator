import React from 'react';
import Box from '@material-ui/core/Box';

import { useMembersPage } from './members.hooks';

interface Props {
    id: number;
}

const Members: React.FC<Props> = ({ id }) => {
    const { users } = useMembersPage(id);

    return (
        <Box>
            <h6>Invite Members</h6>
            <h6>Existing Members</h6>

            {users.map(o => (
                <div key={o.username}>
                    <img src="" alt="" />
                    <div>
                        <strong>{o.name}</strong> {o.username}
                        <span>{o.group}</span>
                        <span>Last seen:</span>
                    </div>
                </div>
            ))}
        </Box>
    );
};
export default Members;
