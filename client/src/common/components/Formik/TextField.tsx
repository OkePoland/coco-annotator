import React from 'react';
import { useField } from 'formik';
import MuiTextField from '@material-ui/core/TextField';

interface Props {
    name: string;
    label: string;
    type?: string;
}

const TextField: React.FC<Props> = ({ name, label, type }) => {
    const [field, { touched, error }] = useField(name);

    return (
        <MuiTextField
            required
            type={type}
            fullWidth
            variant="outlined"
            margin="normal"
            label={label}
            error={Boolean(touched && error)}
            helperText={touched && error}
            {...field}
        />
    );
};

export default TextField;
