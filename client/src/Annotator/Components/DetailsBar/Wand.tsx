import React from 'react';
import Box from '@material-ui/core/Box';
import BorderColorIcon from '@material-ui/icons/BorderColor';

import ToolFieldNumber from './ToolFieldNumber';

interface Props {
    className: string;
    threshold: number;
    blur: number;
    setThreshold: (value: number) => void;
    setBlur: (value: number) => void;
}
const Wand: React.FC<Props> = ({
    className,
    threshold,
    blur,
    setThreshold,
    setBlur,
}) => (
    <Box className={className}>
        <BorderColorIcon />

        <ToolFieldNumber
            label="Threshold"
            value={threshold}
            onChange={setThreshold}
        />

        <ToolFieldNumber label="Blur" value={blur} onChange={setBlur} />
    </Box>
);
export default Wand;
