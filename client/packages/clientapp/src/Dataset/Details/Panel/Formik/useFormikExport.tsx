import { Dispatch, SetStateAction } from 'react';
import { FormikConfig, FormikHelpers } from 'formik';

import { ICategory } from '../../details.hooks';
import { TaskInfo } from '../buttonBar.hooks';
import * as DatasetApi from '../../../datasets.api';

interface FormExportState {
    categories: string[];
}

export const useFormikExport = (
    id: number,
    allCategories: ICategory[],
    setExportInfo: Dispatch<SetStateAction<TaskInfo>>,
): FormikConfig<FormExportState> => {
    const initialValues = {
        categories: [],
    };
    const onSubmit = async (
        { categories }: FormExportState,
        { resetForm }: FormikHelpers<FormExportState>,
    ) => {
        const categoryIds = allCategories
            .filter(item => categories.includes(item.name))
            .map(category => category.id);

        const response = await DatasetApi.exportingCOCO(
            id,
            categoryIds.join(','),
        );
        setExportInfo(c => ({ ...c, id: response.data.id }));
        resetForm();
    };
    return {
        initialValues,
        onSubmit,
    };
};

export default useFormikExport;
