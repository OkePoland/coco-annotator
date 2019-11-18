import React from 'react';
import Typography from '@material-ui/core/Typography';

interface TabPanelProps {
    index: number;
    activeTab: number;
    children: React.ReactNode;
}

const TabPanel: React.FC<TabPanelProps> = ({ index, activeTab, children }) => (
    <Typography component="div" role="tabpanel" hidden={activeTab !== index}>
        {children}
    </Typography>
);

export default TabPanel;
