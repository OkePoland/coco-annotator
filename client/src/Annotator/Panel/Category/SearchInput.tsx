import React, { ChangeEvent } from 'react';
import TextField from '@material-ui/core/TextField';

import { useStyles } from './searchInput.styles';

interface Props {
    value: string;
    setValue: (val: string) => void;
}

const SearchInput: React.FC<Props> = ({ value, setValue }) => {
    const classes = useStyles();
    return (
        <TextField
            className={classes.root}
            placeholder="Category Search"
            inputProps={{ style: { textAlign: 'center' } }}
            value={value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setValue(e.target.value);
            }}
        />
    );
};
export default SearchInput;
