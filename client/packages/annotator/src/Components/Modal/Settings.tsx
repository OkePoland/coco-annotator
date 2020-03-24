import React, { Dispatch, SetStateAction } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import KeyboardOutlinedIcon from '@material-ui/icons/KeyboardOutlined';
import Button from '@material-ui/core/Button';

import { ShortcutsSettings } from '../../app.types';

interface Props {
    shortcuts: ShortcutsSettings;
    setShortcuts: Dispatch<SetStateAction<ShortcutsSettings>>;
    restoreDefaultShortcuts: () => void;
}

const SettingsModal: React.FC<Props> = ({
    shortcuts,
    setShortcuts,
    restoreDefaultShortcuts,
}) => (
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
                        variant="outlined"
                        inputProps={{ style: { textAlign: 'center' } }}
                        margin="dense"
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
        <Box mt={1}>
            <Button
                variant="contained"
                color="primary"
                onClick={restoreDefaultShortcuts}
            >
                Restore Default Shortcuts
            </Button>
        </Box>
    </Box>
);

export default SettingsModal;
