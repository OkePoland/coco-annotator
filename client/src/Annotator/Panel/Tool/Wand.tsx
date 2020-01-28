import React from 'react';
import { ChangeEvent } from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';

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
        <TextField
            label="Threshold"
            inputProps={{ style: { textAlign: 'center' } }}
            value={threshold}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const val = parseInt(e.target.value);
                setThreshold(val ? val : 1);
            }}
        />
        <TextField
            label="Blur"
            inputProps={{ style: { textAlign: 'center' } }}
            value={blur}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const val = parseInt(e.target.value);
                setBlur(val ? val : 1);
            }}
        />
    </Box>
);
export default Wand;
