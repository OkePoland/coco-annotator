import React from 'react';
import { useField } from 'formik';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import MuiCheckbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

interface Props {
    name: string;
    label: string;
}

const Checkbox: React.FC<Props> = ({ name, label }) => {
    const [field, { touched, error }] = useField({
        name,
        type: 'checkbox',
    });

    return (
        <>
            <FormControlLabel
                label={label}
                control={<MuiCheckbox color="default" {...field} />}
            />
            {touched && error ? (
                <Typography paragraph color="error">
                    {error}
                </Typography>
            ) : null}
        </>
    );
};

export default Checkbox;
