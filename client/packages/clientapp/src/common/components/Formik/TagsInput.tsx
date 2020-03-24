import React from 'react';
import { useField } from 'formik';

import useAutocomplete from '@material-ui/lab/useAutocomplete';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';

interface Props {
    options: Array<string>;
    name: string;
    placeholder: string;
    classes: {
        tagsInput: string;
        tagsList: string;
        tagsGrid: string;
    };
}

const TagsInput: React.FC<Props> = ({
    options,
    name,
    placeholder,
    classes: { tagsInput, tagsGrid, tagsList },
}) => {
    const [field, , { setValue }] = useField(name);

    const {
        getRootProps,
        getInputProps,
        getTagProps,
        getListboxProps,
        getOptionProps,
        groupedOptions,
        value,
        setAnchorEl,
    } = useAutocomplete({
        multiple: true,
        filterSelectedOptions: true,
        options: options,
        value: field.value,
        getOptionLabel: option => option,
        onChange: (_, value: string[]) => setValue(value),
    });
    return (
        <Grid container>
            <Grid
                component="div"
                item
                ref={setAnchorEl}
                className={tagsGrid}
                xs={12}
                {...getRootProps()}
            >
                {value.map((option: string, index: number) => (
                    <Chip
                        size="small"
                        label={option}
                        {...getTagProps({ index })}
                    />
                ))}
                <Input
                    className={tagsInput}
                    fullWidth
                    disableUnderline
                    placeholder={placeholder}
                    {...getInputProps()}
                />
            </Grid>
            {groupedOptions.length > 0 ? (
                <Grid
                    {...getListboxProps()}
                    container
                    item
                    spacing={1}
                    justify="center"
                    className={tagsList}
                >
                    {groupedOptions.map((option, index) => (
                        <Grid key={index} item>
                            <Chip
                                clickable
                                component="li"
                                size="small"
                                label={option}
                                {...getOptionProps({ option, index })}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : null}
        </Grid>
    );
};

export default TagsInput;
