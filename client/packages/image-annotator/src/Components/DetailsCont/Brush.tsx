import React from 'react';
import Box from '@material-ui/core/Box';
import BrushOutlinedIcon from '@material-ui/icons/BrushOutlined';

import ToolFieldNumber from './ToolFieldNumber';
import ToolFieldColor from './ToolFieldColor';

interface Props {
    className: string;
    radius: number;
    color: string;
    setRadius: (num: number) => void;
    setColor: (color: string) => void;
}

const Brush: React.FC<Props> = ({
    className,
    radius,
    color,
    setRadius,
    setColor,
}) => (
    <Box className={className}>
        <BrushOutlinedIcon />

        <ToolFieldNumber label="Radius" value={radius} onChange={setRadius} />

        <ToolFieldColor value={color} onChange={setColor} />
    </Box>
);
export default Brush;
