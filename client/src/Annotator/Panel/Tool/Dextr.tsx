import React from 'react';
import { ChangeEvent } from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';

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
        <TextField
            label="Threshold"
            inputProps={{ style: { textAlign: 'center' } }}
            value={padding}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const val = parseInt(e.target.value);
                setPadding(val ? val : 1);
            }}
        />
        <TextField
            label="Blur"
            inputProps={{ style: { textAlign: 'center' } }}
            value={threshold}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const val = parseInt(e.target.value);
                setThreshold(val ? val : 1);
            }}
        />
    </Box>
);
export default Dextr;
