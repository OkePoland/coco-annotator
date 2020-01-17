import React from 'react';
import { ChangeEvent } from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';

interface Props {
    className: string;
    radius: number;
    color: string;
    setRadius: (num: number) => void;
    setColor: (color: string) => void;
}

const Eraser: React.FC<Props> = ({
    className,
    radius,
    color,
    setRadius,
    setColor,
}) => (
    <Box className={className}>
        <TextField
            label="Radius"
            inputProps={{ style: { textAlign: 'center' } }}
            value={radius}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                let val = parseInt(e.target.value);
                if (!val) val = 1;
                setRadius(val);
            }}
        />
        <TextField
            label="Current color"
            inputProps={{ style: { textAlign: 'center' } }}
            value={color}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setColor(e.target.value as string);
            }}
        />
    </Box>
);
export default Eraser;
