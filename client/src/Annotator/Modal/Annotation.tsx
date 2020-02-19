import React, { ChangeEvent } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import ColorPicker from 'material-ui-color-picker';

interface Props {
    className: string;
    name: string;
    color: string;
    setName: (name: string) => void;
    setColor: (color: string) => void;
}

const AnnotationModal: React.FC<Props> = ({
    className,
    name,
    color,
    setName,
    setColor,
}) => (
    <Box className={className}>
        <Grid container justify="center" alignItems="center" spacing={3}>
            <Grid item xs={6}>
                <Typography display="inline">Name: </Typography>
                <TextField
                    placeholder="Name"
                    inputProps={{ style: { textAlign: 'center' } }}
                    value={name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setName(e.target.value);
                    }}
                />
            </Grid>
            <Grid item xs={6}>
                <Typography display="inline">Color: </Typography>
                <ColorPicker
                    defaultValue={color}
                    value={color}
                    onChange={setColor}
                />
            </Grid>
        </Grid>
    </Box>
);

export default AnnotationModal;
