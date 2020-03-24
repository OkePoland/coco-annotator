import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';
import Tab from '@material-ui/core/Tab';
import MuiTabs from '@material-ui/core/Tabs';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import GroupIcon from '@material-ui/icons/Group';
import EqualizerIcon from '@material-ui/icons/Equalizer';

interface Props {
    tabId: number;
    setTabId: Dispatch<SetStateAction<number>>;
}

const Tabs: React.FC<Props> = ({ tabId, setTabId }) => {
    return (
        <MuiTabs
            variant="fullWidth"
            indicatorColor="primary"
            value={tabId}
            onChange={(_: ChangeEvent<{}>, newValue: number) => {
                setTabId(newValue);
            }}
        >
            <Tab wrapped label="Images" icon={<PermMediaIcon />} value={0} />
            <Tab wrapped label="Exports" icon={<ScreenShareIcon />} value={1} />
            <Tab wrapped label="Members" icon={<GroupIcon />} value={2} />
            <Tab
                wrapped
                label="Statistics"
                icon={<EqualizerIcon />}
                value={3}
            />
        </MuiTabs>
    );
};
export default Tabs;
