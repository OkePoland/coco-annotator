import React from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { ChangeEvent } from 'react';

interface Props {
    label: string;
    value: number;
    onChange: (num: number) => void;
}

const ToolFieldNumber: React.FC<Props> = ({ label, value, onChange }) => (
    <Box mt={1}>
        <TextField
            variant="outlined"
            inputProps={{ style: { textAlign: 'center' } }}
            label={label}
            margin="dense"
            type="number"
            value={value}
            onKeyPress={e => {
                e.preventDefault();
            }}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                let val = parseInt(e.target.value);
                if (!val) val = 1;
                onChange(val);
            }}
        />
    </Box>
);
export default ToolFieldNumber;
