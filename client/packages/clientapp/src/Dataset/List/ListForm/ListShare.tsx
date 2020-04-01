import React, { Dispatch, SetStateAction } from 'react';
import { Formik, Form } from 'formik';
import Button from '@material-ui/core/Button';

import { DatasetWithCategories } from '../list.hooks';
import CustomDialog from '../../../common/components/CustomDialog';
import TagsInput from '../../../common/components/Formik/TagsInput';
import { useFormikShare } from '../Formik';

interface Props {
    shared: DatasetWithCategories;
    setShared: Dispatch<SetStateAction<DatasetWithCategories | null>>;
    usernames: string[];
    classes: {
        tagsInput: string;
        tagsList: string;
        tagsGrid: string;
        submitButton: string;
    };
    refreshPage(): void;
}

const ListShare: React.FC<Props> = ({
    shared,
    setShared,
    usernames,
    classes,
    refreshPage,
}) => {
    const formikShare = useFormikShare(refreshPage, shared);

    return (
        <Formik
            enableReinitialize
            initialValues={formikShare.initialValues}
            onSubmit={formikShare.onSubmit}
        >
            {formik => (
                <CustomDialog
                    title={shared ? shared.dataset.name : ''}
                    open={shared !== null}
                    setClose={() => {
                        setShared(null);
                        formik.resetForm();
                    }}
                    renderContent={() => (
                        <Form>
                            <TagsInput
                                options={usernames}
                                name="sharedUsers"
                                placeholder="Add usernames"
                                classes={{
                                    tagsInput: classes.tagsInput,
                                    tagsList: classes.tagsList,
                                    tagsGrid: classes.tagsGrid,
                                }}
                            />
                        </Form>
                    )}
                    renderActions={() => (
                        <Button
                            variant="contained"
                            className={classes.submitButton}
                            onClick={async () => {
                                await formik.submitForm();
                                setShared(null);
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
export default ListShare;
