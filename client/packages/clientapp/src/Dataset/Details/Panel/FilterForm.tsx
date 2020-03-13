import React, { ChangeEvent } from 'react';
import clsx from 'clsx';

import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';

import { useStyles } from './panel.styles';
import { FilterState } from '../details.hooks';

interface Props {
    filters: FilterState;
}

const FilterForm: React.FC<Props> = ({ filters }) => {
    const classes = useStyles();
    const {
        contains: [contains, setContains],
        order: [order, setOrder],
        annotatedOn,
        notAnnotatedOn,
        setAnnotatedOn,
        setNotAnnotatedOn,
    } = filters;

    return (
        <Grid container direction="column" alignItems="stretch" spacing={1}>
            <Typography align="center">Filtering Options</Typography>
            <Grid item xs>
                <TextField
                    className={classes.formControl}
                    label="Contains"
                    variant="outlined"
                    value={contains}
                    InputProps={{
                        className: classes.formInput,
                    }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setContains(e.target.value);
                    }}
                />
            </Grid>
            <Grid item xs>
                <InputLabel>Order</InputLabel>
                <FormControl className={classes.formControl}>
                    <Select
                        className={clsx(classes.formControl, classes.formInput)}
                        variant="outlined"
                        value={order}
                        onChange={(e: ChangeEvent<{ value: unknown }>) => {
                            setOrder(e.target.value as string);
                        }}
                    >
                        <MenuItem value="file_name">File Name</MenuItem>
                        <MenuItem value="id">Id</MenuItem>
                        <MenuItem value="path">File Path</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs>
                <FormGroup>
                    <FormControlLabel
                        label="Annotated"
                        control={
                            <Switch
                                size="small"
                                color="primary"
                                checked={annotatedOn}
                                onChange={(
                                    e: ChangeEvent<HTMLInputElement>,
                                ) => {
                                    setAnnotatedOn(e.target.checked);
                                }}
                            />
                        }
                    />
                    <FormControlLabel
                        label="Not annotated"
                        control={
                            <Switch
                                size="small"
                                color="primary"
                                checked={notAnnotatedOn}
                                onChange={(
                                    e: ChangeEvent<HTMLInputElement>,
                                ) => {
                                    setNotAnnotatedOn(e.target.checked);
                                }}
                            />
                        }
                    />
                </FormGroup>
            </Grid>
        </Grid>
    );
};
export default FilterForm;
