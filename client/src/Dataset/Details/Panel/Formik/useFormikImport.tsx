import { Dispatch, SetStateAction } from 'react';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { FormikConfig, FormikHelpers } from 'formik';

import { TaskInfo } from '../buttonBar.hooks';
import * as DatasetApi from '../../../datasets.api';

interface FormImportState {
    coco: string | null;
}

export const useFormikImport = (
    id: number,
    setImportInfo: Dispatch<SetStateAction<TaskInfo>>,
): FormikConfig<FormImportState> => {
    const { enqueueSnackbar } = useSnackbar();

    const initialValues = {
        coco: null,
    };
    const validationSchema = Yup.object().shape({
        coco: Yup.mixed().required(),
    });
    const onSubmit = async (
        { coco }: FormImportState,
        { resetForm }: FormikHelpers<FormImportState>,
    ) => {
        if (!coco) return;
        const response = await DatasetApi.uploadCoco(id, coco);
        setImportInfo(c => ({ ...c, id: response.id }));
        if (response.message) {
            enqueueSnackbar('Input payload validation failed', {
                variant: 'error',
            });
        } else {
            resetForm();
        }
    };
    return {
        initialValues,
        validationSchema,
        onSubmit,
    };
};
export default useFormikImport;
