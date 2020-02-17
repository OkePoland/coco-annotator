import React, { Dispatch, SetStateAction } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import KeyboardOutlinedIcon from '@material-ui/icons/KeyboardOutlined';

import { Shortcuts } from '../annotator.types';

interface Props {
    shortcuts: Shortcuts;
    setShortcuts: Dispatch<SetStateAction<Shortcuts>>;
}

const SettingsModal: React.FC<Props> = ({ shortcuts, setShortcuts }) => (
    <Box p={2}>
        <Box mb={1}>
            <KeyboardOutlinedIcon color="primary" />
            <Typography
                variant="subtitle1"
                display="inline"
                component="div"
                style={{ verticalAlign: 'top' }}
            >
                Keyboard
            </Typography>
        </Box>

        <Grid container spacing={2}>
            {Object.entries(shortcuts).map(([key, value]) => (
                <Grid key={key} item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label={key.replace(/_/g, ' ').toUpperCase()}
                        inputProps={{ style: { textAlign: 'center' } }}
                        value={value}
                        onKeyDown={event => {
                            // prevent from catching ArrowUp, ArrowDown, Enter etc...
                            event.preventDefault(); 
                            const keyName: string = event.key;
                            setShortcuts(oldState => ({
                                ...oldState,
                                [key]: keyName,
                            }));
                        }}
                    />
                </Grid>
            ))}
        </Grid>
    </Box>
);

export default SettingsModal;
