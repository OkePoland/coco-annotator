import * as Yup from 'yup';
import { FormikConfig, FormikHelpers } from 'formik';

import * as DatasetApi from '../../../datasets.api';

interface FormGenerateState {
    keyword: string;
    limit: string;
}

const useFormikGenerate = (id: number): FormikConfig<FormGenerateState> => {
    const initialValues = {
        keyword: '',
        limit: '100',
    };
    const validationSchema = Yup.object({
        keyword: Yup.string().required(),
        limit: Yup.string()
            .min(1)
            .required(),
    });
    const onSubmit = async (
        { keyword, limit }: FormGenerateState,
        { resetForm }: FormikHelpers<FormGenerateState>,
    ) => {
        if (keyword.length === 0) return;
        await DatasetApi.generate({ id, keyword, limit });
        resetForm();
    };
    return {
        initialValues,
        validationSchema,
        onSubmit,
    };
};
export default useFormikGenerate;
