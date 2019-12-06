import React, { Dispatch, SetStateAction, ChangeEvent } from 'react';
import clsx from 'clsx';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { useStyles } from './panel.styles';

interface Props {
    folder: string;
    setFolder: Dispatch<SetStateAction<string>>;
    subdirectories: string[];
}

const SubdirForm: React.FC<Props> = ({ folder, setFolder, subdirectories }) => {
    const classes = useStyles();

    return (
        <FormControl className={clsx(classes.subdirForm, classes.formControl)}>
            <InputLabel>Subdirectories</InputLabel>
            <Select
                className={clsx(classes.formControl)}
                value={folder}
                onChange={(e: ChangeEvent<{ value: unknown }>) => {
                    setFolder(e.target.value as string);
                }}
            >
                {subdirectories.map(name => (
                    <MenuItem key={name} value={name}>
                        {name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
export default SubdirForm;
