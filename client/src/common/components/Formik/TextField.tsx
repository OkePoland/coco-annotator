import React from 'react';
import MuiTextField from '@material-ui/core/TextField';
import { FormikProps } from 'formik';

const TextField: React.FC<{
    name: string;
    label: string;
    formik: FormikProps<any>;
}> = ({ name, label, formik }) => (
    <MuiTextField
        required
        fullWidth
        variant="outlined"
        margin="normal"
        label={label}
        error={Boolean(formik.touched[name] && formik.errors[name])}
        helperText={formik.touched[name] && formik.errors[name]}
        {...formik.getFieldProps(name)} // onChange, onBlur methods
    />
);
export default TextField;
