import React, { Dispatch, SetStateAction } from 'react';
import { Formik, Form } from 'formik';
import Button from '@material-ui/core/Button';
import MuiTextField from '@material-ui/core/TextField';

import CustomDialog from '../../../common/components/CustomDialog';
import TextField from '../../../common/components/Formik/TextField';
import TagsInput from '../../../common/components/Formik/TagsInput';
import { useFormikCreate } from '../Formik';

interface Props {
    createOn: boolean;
    setCreateOn: Dispatch<SetStateAction<boolean>>;
    tags: string[];
    classes: {
        tagsInput: string;
        tagsList: string;
        tagsGrid: string;
    };
    refreshPage(): void;
}

const ListCreate: React.FC<Props> = ({
    createOn,
    setCreateOn,
    tags,
    classes,
    refreshPage,
}) => {
    const formikCreate = useFormikCreate(refreshPage);

    return (
        <Formik
            initialValues={formikCreate.initialValues}
            validationSchema={formikCreate.validationSchema}
            onSubmit={formikCreate.onSubmit}
        >
            {formik => (
                <CustomDialog
                    title="Creating a Dataset"
                    open={createOn}
                    setClose={() => {
                        setCreateOn(false);
                        formik.resetForm();
                    }}
                    renderContent={() => (
                        <Form>
                            <TextField name="name" label="Dataset name" />
                            <TagsInput
                                options={tags}
                                name="categories"
                                placeholder="Add a category"
                                classes={classes}
                            />
                            <MuiTextField
                                disabled
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                label="Folder Directory"
                                value={`/datasets/${formik.values.name}`}
                            />
                        </Form>
                    )}
                    renderActions={() => (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={formik.submitForm}
                        >
                            Create Dataset
                        </Button>
                    )}
                />
            )}
        </Formik>
    );
};

export default ListCreate;
