import React, { ChangeEvent, useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';

import { CategoryInfo } from '../../app.types';

interface Props {
    infoData: CategoryInfo[];
    onSave: (id: number, categoriesIds: number[]) => void;
}

const CopyModal: React.FC<Props> = ({ infoData, onSave }) => {
    const [id, setId] = useState<string>('');
    const [enabledIds, setEnabledIds] = useState<number[]>([]);

    return (
        <Box>
            <Grid container justify="center" spacing={2}>
                <Grid item xs>
                    <TextField
                        fullWidth
                        margin="dense"
                        variant="outlined"
                        label="ImageId to Copy From"
                        placeholder="ImageId"
                        inputProps={{ style: { textAlign: 'center' } }}
                        value={id}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setId(e.target.value);
                        }}
                    />
                </Grid>
                <Grid item xs>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">
                            Select Categories
                        </FormLabel>
                        <FormGroup>
                            {infoData.map(categoryInfo => (
                                <FormControlLabel
                                    key={categoryInfo.id}
                                    label={categoryInfo.name}
                                    control={
                                        <Checkbox
                                            color="primary"
                                            checked={
                                                enabledIds.indexOf(
                                                    categoryInfo.id,
                                                ) > -1
                                            }
                                            onChange={() => {
                                                setEnabledIds(prevArr => {
                                                    const idx = prevArr.indexOf(
                                                        categoryInfo.id,
                                                    );

                                                    const newArr = [...prevArr];

                                                    if (idx === -1) {
                                                        newArr.push(
                                                            categoryInfo.id,
                                                        );
                                                    } else {
                                                        newArr.splice(idx, 1);
                                                    }
                                                    return newArr;
                                                });
                                            }}
                                        />
                                    }
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
                </Grid>
            </Grid>

            <Button
                disabled={id === ''}
                variant="contained"
                color="primary"
                onClick={() => {
                    const imageId = parseInt(id);
                    if (imageId != null && enabledIds.length > 0) {
                        onSave(imageId, enabledIds);
                    }
                }}
            >
                Copy Annotations
            </Button>
        </Box>
    );
};
export default CopyModal;
