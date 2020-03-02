import React from 'react';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';

import { useStyles } from './members.styles';
import { useMembersPage } from './members.hooks';

interface Props {
    id: number;
}

const Members: React.FC<Props> = ({ id }) => {
    const classes = useStyles();
    const { users } = useMembersPage(id);

    return (
        <Box>
            <Card className={classes.card}>
                <Box fontWeight="600">Invite Members</Box>
                <Divider className={classes.divider} />
            </Card>
            <Box mt={5} />
            <Card className={classes.card}>
                <Box fontWeight="600">Invite Members</Box>
                <Divider className={classes.divider} />
                {users.map(o => (
                    <Grid container key={o.username} alignItems="flex-start">
                        <Grid item xs={2} className={classes.icon}>
                            <AccountCircle fontSize="large" />
                        </Grid>
                        <Grid item xs={10}>
                            <Typography gutterBottom>
                                <b>{o.name}</b> @{o.username}
                            </Typography>
                            <Typography gutterBottom>{o.group}</Typography>
                            <Typography gutterBottom>
                                {`Last seen: ${new Date(o.last_seen['$date'])
                                    .toISOString()
                                    .slice(0, 19)
                                    .replace('T', ' ')} UTC`}
                            </Typography>
                            <Divider className={classes.divider} />
                        </Grid>
                    </Grid>
                ))}
            </Card>
        </Box>
    );
};
export default Members;
