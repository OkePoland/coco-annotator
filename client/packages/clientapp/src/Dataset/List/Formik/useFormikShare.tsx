import { FormikConfig, FormikHelpers } from 'formik';

import { DatasetWithCategories } from '../list.hooks';
import * as DatasetApi from '../../datasets.api';

interface FormShareState {
    sharedUsers: Array<string>;
}

const useFormikShare = (
    refeshPage: () => void,
    { dataset }: DatasetWithCategories,
): FormikConfig<FormShareState> => {
    const initialValues = {
        sharedUsers: dataset.users,
    };

    const onSubmit = async (
        { sharedUsers }: FormShareState,
        { resetForm }: FormikHelpers<FormShareState>,
    ) => {
        await DatasetApi.share(dataset.id, sharedUsers);
        resetForm();
        refeshPage();
    };
    return {
        initialValues,
        onSubmit,
    };
};

export default useFormikShare;
