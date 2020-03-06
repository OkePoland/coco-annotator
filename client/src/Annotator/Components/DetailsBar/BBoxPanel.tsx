import React from 'react';
import Box from '@material-ui/core/Box';
import WallpaperOutlinedIcon from '@material-ui/icons/WallpaperOutlined';

import ToolFieldColor from './ToolFieldColor';

interface Props {
    className: string;
    color: string;
    setColor: (color: string) => void;
}

const BBoxPanel: React.FC<Props> = ({ className, color, setColor }) => (
    <Box className={className}>
        <WallpaperOutlinedIcon />

        <ToolFieldColor value={color} onChange={setColor} />
    </Box>
);
export default BBoxPanel;
