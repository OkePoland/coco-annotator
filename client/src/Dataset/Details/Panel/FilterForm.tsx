import React, { ChangeEvent } from 'react';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';

import { FilterState } from '../details.hooks';
import { useStyles } from './panel.styles';

interface Props {
    filters: FilterState;
}

const FilterForm: React.FC<Props> = ({ filters }) => {
    const classes = useStyles();
    const {
        contains: [contains, setContains],
        order: [order, setOrder],
        annotatedOn: [annotatedOn, setAnnotatedOn],
        notAnnotatedOn: [notAnnotatedOn, setNotAnnotatedOn],
    } = filters;

    return (
        <Grid container direction="column" alignItems="stretch" spacing={1}>
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
                <FormControl className={classes.formControl}>
                    <InputLabel>Order</InputLabel>
                    <Select
                        className={clsx(classes.formControl, classes.formInput)}
                        variant="outlined"
                        value={order}
                        onChange={(e: ChangeEvent<{ value: unknown }>) => {
                            setOrder(e.target.value as string);
                        }}
                    >
                        <MenuItem value="File Name">File Name</MenuItem>
                        <MenuItem value="Id">Id</MenuItem>
                        <MenuItem value="File Path">File Path</MenuItem>
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
