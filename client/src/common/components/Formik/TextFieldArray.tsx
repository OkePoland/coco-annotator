import React from 'react';
import { FieldArray } from 'formik';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';

import TextField from './TextField';

interface Props {
    title: string;
    metadata?: Array<{
        [key: string]: string;
    }> | null;
    name: string;
    keyTitle: string;
    valueTitle: string;
}

const Metadata: React.FC<Props> = ({
    title,
    metadata,
    name,
    keyTitle,
    valueTitle,
}) => (
    <FieldArray
        name={name}
        render={arrayHelpers => (
            <Box mt={2}>
                <Grid container justify="center">
                    <Grid item xs={11}>
                        <Typography align="center">{title}</Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                                arrayHelpers.push({ key: '', value: '' })
                            }
                        >
                            <Add />
                        </IconButton>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography align="center" variant="body2">
                            Keys
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography align="center" variant="body2">
                            Values
                        </Typography>
                    </Grid>
                    {metadata && metadata.length > 0 ? (
                        metadata.map((_, index: number) => (
                            <React.Fragment key={index}>
                                <Grid item xs={6}>
                                    <TextField
                                        name={`${name}.${index}.${keyTitle}`}
                                        label={keyTitle}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        name={`${name}.${index}.${valueTitle}`}
                                        label={valueTitle}
                                    />
                                </Grid>
                            </React.Fragment>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Typography align="center" variant="body2">
                                No items in metadata.
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>
        )}
    />
);
export default Metadata;
