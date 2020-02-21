import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import ColorPicker from 'material-ui-color-picker';

interface Props {
    className: string;
    name: string;
    color: string;
    setColor: (color: string) => void;
}

const CategoryModal: React.FC<Props> = ({
    className,
    name,
    color,
    setColor,
}) => (
    <Box className={className}>
        <Grid container justify="center" alignItems="center" spacing={3}>
            <Grid item xs={6}>
                <TextField
                    disabled
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    placeholder="Name"
                    inputProps={{ style: { textAlign: 'center' } }}
                    value={name}
                />
            </Grid>
            <Grid item xs={6}>
                <ColorPicker
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    defaultValue={color}
                    value={color}
                    onChange={setColor}
                />
            </Grid>
        </Grid>
    </Box>
);

export default CategoryModal;
