import React from 'react';
import { ChangeEvent } from 'react';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';

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
        <TextField
            label="Stroke Color"
            inputProps={{ style: { textAlign: 'center' } }}
            value={strokeColor}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setStrokeColor(e.target.value as string);
            }}
        />
        <TextField
            label="Auto Complete Distance"
            inputProps={{ style: { textAlign: 'center' } }}
            value={completeDistance}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                let val = parseInt(e.target.value);
                if (!val) val = 1;
                setCompleteDistance(val);
            }}
        />
        <TextField
            label="Min Distance"
            inputProps={{ style: { textAlign: 'center' } }}
            value={minDistance}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                let val = parseInt(e.target.value);
                if (!val) val = 1;
                setMinDistance(val);
            }}
        />
    </Box>
);
export default Polygon;
