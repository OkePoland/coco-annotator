import React from 'react';
import Box from '@material-ui/core/Box';

import ColorPicker from 'material-ui-color-picker';

interface Props {
    value: string;
    onChange: (color: string) => void;
}

const ToolFieldNumber: React.FC<Props> = ({ value, onChange }) => (
    <Box mt={1}>
        <ColorPicker
            fullWidth
            inputProps={{ style: { textAlign: 'center', color: value }}}
            variant="outlined"
            margin="dense"
            label="Color"
            defaultValue="Color"
            value={value}
            onChange={onChange}
        />
    </Box>
);
export default ToolFieldNumber;
