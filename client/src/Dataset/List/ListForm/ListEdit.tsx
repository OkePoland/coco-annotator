import React, { Dispatch, SetStateAction } from 'react';
import { Formik, Form } from 'formik';
import Button from '@material-ui/core/Button';

import { DatasetWithCategories } from '../list.hooks';
import CustomDialog from '../../../common/components/CustomDialog';
import TagsInput from '../../../common/components/Formik/TagsInput';
import TextFieldArray from '../../../common/components/Formik/TextFieldArray';
import { useFormikEdit } from '../Formik';

interface Props {
    edited: DatasetWithCategories;
    setEdited: Dispatch<SetStateAction<DatasetWithCategories | null>>;
    tags: string[];
    classes: {
        tagsInput: string;
        tagsList: string;
        tagsGrid: string;
        submitButton: string;
    };
    refreshPage(): void;
}

const ListEdit: React.FC<Props> = ({
    edited,
    setEdited,
    tags,
    classes,
    refreshPage,
}) => {
    const formikEdit = useFormikEdit(refreshPage, edited);

    return (
        <Formik
            enableReinitialize
            initialValues={formikEdit.initialValues}
            validationSchema={formikEdit.validationSchema}
            onSubmit={formikEdit.onSubmit}
        >
            {formik => (
                <CustomDialog
                    title={edited ? edited.dataset.name : ''}
                    open={edited !== null}
                    setClose={() => {
                        setEdited(null);
                        formik.resetForm();
                    }}
                    renderContent={() => (
                        <Form>
                            <TagsInput
                                options={tags}
                                name="updatedCategories"
                                placeholder="Add a category"
                                classes={classes}
                            />
                            <TextFieldArray
                                title="Default Annotation Metadata"
                                name="updatedMetadata"
                                keyTitle="key"
                                valueTitle="value"
                                metadata={formik.values.updatedMetadata}
                            />
                        </Form>
                    )}
                    renderActions={() => (
                        <Button
                            variant="contained"
                            className={classes.submitButton}
                            onClick={async () => {
                                await formik.submitForm();
                                setEdited(null);
                            }}
                        >
                            Save
                        </Button>
                    )}
                />
            )}
        </Formik>
    );
};
export default ListEdit;
