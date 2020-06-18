import React, { ChangeEvent } from 'react';
import TextField from '@material-ui/core/TextField';

interface Props {
    className: string;
    value: string;
    setValue: (val: string) => void;
}

const SearchInput: React.FC<Props> = ({ className, value, setValue }) => (
    <TextField
        className={className}
        placeholder="Category Search"
        inputProps={{ style: { textAlign: 'center' } }}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setValue(e.target.value);
        }}
    />
);
export default SearchInput;
