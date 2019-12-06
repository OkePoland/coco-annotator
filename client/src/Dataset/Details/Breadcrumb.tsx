import React from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';

const Breadcrumb: React.FC = () => {
    return (
        <Breadcrumbs>
            <Typography color="textPrimary">Breadcrumb</Typography>
            <Typography color="textPrimary">Breadcrumb</Typography>
        </Breadcrumbs>
    );
};
export default Breadcrumb;
