import React from 'react';
import MuiTextField from '@material-ui/core/TextField';
import { FormikProps } from 'formik';

interface Props<T> {
    name: string;
    label: string;
    formik: FormikProps<T>;
    touched?: boolean;
    error?: string;
}

function TextField<T>(props: Props<T>) {
    const { name, label, formik, touched, error } = props;

    return (
        <MuiTextField
            required
            fullWidth
            variant="outlined"
            margin="normal"
            label={label}
            error={Boolean(touched && error)}
            helperText={touched && error}
            {...formik.getFieldProps(name)} // onChange, onBlur methods
        />
    );
}
export default TextField;
