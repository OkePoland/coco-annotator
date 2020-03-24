import React, { ChangeEvent } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import ColorPicker from 'material-ui-color-picker';

interface Props {
    className: string;
    name: string;
    color: string;
    metadata: Array<{ key: string; value: string }>;
    setName: (name: string) => void;
    setColor: (color: string) => void;
    addMetadata: () => void;
    editMetdata: (index: number, obj: { key: string; value: string }) => void;
}

const AnnotationModal: React.FC<Props> = ({
    className,
    name,
    color,
    metadata,
    setName,
    setColor,
    addMetadata,
    editMetdata,
}) => (
    <Box className={className}>
        <Grid container justify="center" alignItems="center" spacing={3}>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    label="Name"
                    placeholder="Name"
                    inputProps={{ style: { textAlign: 'center' } }}
                    value={name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setName(e.target.value || '');
                    }}
                />
            </Grid>
            <Grid item xs={6}>
                <ColorPicker
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    label="Color"
                    defaultValue={color}
                    value={color}
                    onChange={setColor}
                />
            </Grid>
        </Grid>

        <Box mt={2} mb={3}>
            <Divider />
        </Box>

        <Grid container justify="center" alignItems="center">
            <Grid item xs={12}>
                <Typography align="center" variant="body2">
                    Metadata
                </Typography>
            </Grid>
            {metadata && metadata.length > 0 ? (
                metadata.map((item, index) => (
                    <React.Fragment key={index}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="outlined"
                                label="Key"
                                inputProps={{ style: { textAlign: 'center' } }}
                                value={item.key}
                                onChange={(
                                    e: ChangeEvent<HTMLInputElement>,
                                ) => {
                                    editMetdata(index, {
                                        ...item,
                                        key: e.target.value,
                                    });
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                margin="dense"
                                variant="outlined"
                                label="Value"
                                inputProps={{ style: { textAlign: 'center' } }}
                                value={item.value}
                                onChange={(
                                    e: ChangeEvent<HTMLInputElement>,
                                ) => {
                                    editMetdata(index, {
                                        ...item,
                                        value: e.target.value,
                                    });
                                }}
                            />
                        </Grid>
                    </React.Fragment>
                ))
            ) : (
                <Grid item xs={12}>
                    <Typography align="center" variant="body2">
                        No items
                    </Typography>
                </Grid>
            )}
            <Grid item xs={12}>
                <Box textAlign="center">
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={addMetadata}
                    >
                        <Add />
                    </IconButton>
                </Box>
            </Grid>
        </Grid>
    </Box>
);

export default AnnotationModal;
