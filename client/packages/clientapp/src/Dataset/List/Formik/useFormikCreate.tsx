import { FormikConfig, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

import * as DatasetApi from '../../datasets.api';

interface FormCreateState {
    name: string;
    categories: Array<string>;
}

const useFormikCreate = (
    refeshPage: () => void,
): FormikConfig<FormCreateState> => {
    const { enqueueSnackbar } = useSnackbar();

    const initialValues = {
        name: '',
        categories: [],
    };
    const validationSchema = Yup.object({
        name: Yup.string()
            .max(10, 'Must be 10 characters or less')
            .required('Required'),
        categories: Yup.array().of(Yup.string()),
    });
    const onSubmit = async (
        values: FormCreateState,
        { resetForm }: FormikHelpers<FormCreateState>,
    ) => {
        const { data: response } = await DatasetApi.create(
            values.name,
            values.categories,
        );
        if (response.message) {
            enqueueSnackbar(response.message, { variant: 'error' });
        } else {
            resetForm();
            refeshPage();
        }
    };
    return {
        initialValues,
        validationSchema,
        onSubmit,
    };
};

export default useFormikCreate;
