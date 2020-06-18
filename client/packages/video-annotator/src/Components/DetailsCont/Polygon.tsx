import React from 'react';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';

import ToolFieldNumber from './ToolFieldNumber';
import ToolFieldColor from './ToolFieldColor';

interface Props {
    className: string;

    guidanceOn: boolean;
    strokeColor: string;
    minDistance: number;
    completeDistance: number;

    setGuidanceOn: (on: boolean) => void;
    setStrokeColor: (color: string) => void;
    setMinDistance: (value: number) => void;
    setCompleteDistance: (value: number) => void;
}

const Polygon: React.FC<Props> = ({
    className,

    guidanceOn,
    strokeColor,
    minDistance,
    completeDistance,

    setGuidanceOn,
    setStrokeColor,
    setMinDistance,
    setCompleteDistance,
}) => (
    <Box className={className}>
        <CreateOutlinedIcon />

        <Box>
            <FormControlLabel
                control={
                    <Checkbox
                        color="primary"
                        checked={guidanceOn}
                        onChange={() => {
                            setGuidanceOn(!guidanceOn);
                        }}
                    />
                }
                label="Guidance On"
            />
        </Box>

        <ToolFieldColor value={strokeColor} onChange={setStrokeColor} />

        <ToolFieldNumber
            label="Auto Complete Distance"
            value={completeDistance}
            onChange={setCompleteDistance}
        />

        <ToolFieldNumber
            label="Min Distance"
            value={minDistance}
            onChange={setMinDistance}
        />
    </Box>
);
export default Polygon;
