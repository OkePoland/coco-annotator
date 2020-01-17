import React from 'react';
import { ChangeEvent } from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';

interface Props {
    className: string;
    color: string;
    setColor: (color: string) => void;
}

const BBox: React.FC<Props> = ({ className, color, setColor }) => (
    <Box className={className}>
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
export default BBox;
