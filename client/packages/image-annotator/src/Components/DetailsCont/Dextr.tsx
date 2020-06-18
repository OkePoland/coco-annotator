import React from 'react';
import Box from '@material-ui/core/Box';
import LocationSearchingOutlinedIcon from '@material-ui/icons/LocationSearchingOutlined';

import ToolFieldNumber from './ToolFieldNumber';

interface Props {
    className: string;
    padding: number;
    threshold: number;
    setPadding: (value: number) => void;
    setThreshold: (value: number) => void;
}
const Dextr: React.FC<Props> = ({
    className,
    padding,
    threshold,
    setPadding,
    setThreshold,
}) => (
    <Box className={className}>
        <LocationSearchingOutlinedIcon />

        <ToolFieldNumber
            label="Padding"
            value={padding}
            onChange={setPadding}
        />

        <ToolFieldNumber
            label="Threshold (Blur)"
            value={threshold}
            onChange={setThreshold}
        />
    </Box>
);
export default Dextr;
