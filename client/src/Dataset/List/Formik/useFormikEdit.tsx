import { useMemo } from 'react';
import { FormikConfig, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

import { DatasetWithCategories } from '../list.hooks';
import * as DatasetApi from '../../datasets.api';

interface FormEditState {
    updatedCategories: string[];
    updatedMetadata: MetadataList[];
}
type Metadata = string | number | boolean;

interface MetadataList {
    [key: string]: string;
}

const validationSchema = Yup.object({
    updatedCategories: Yup.array().of(Yup.string()),
    updatedMetadata: Yup.array().of(
        Yup.object().shape({
            key: Yup.string().max(10, 'Must be 10 characters or less'),
            value: Yup.string().max(10, 'Must be 10 characters or less'),
        }),
    ),
});

const useFormikEdit = (
    refeshPage: () => void,
    { dataset, categories }: DatasetWithCategories,
): FormikConfig<FormEditState> => {
    const { enqueueSnackbar } = useSnackbar();
    const selectedCategories: string[] = categories.map(
        category => category.name,
    );
    const defaultMetadata = dataset.default_annotation_metadata;

    const metadataList: MetadataList[] = useMemo(
        () =>
            Object.entries(defaultMetadata).map(([key, value]) => {
                if (value == null) {
                    value = '';
                } else {
                    value = value.toString();
                }
                return {
                    key: key,
                    value: value,
                };
            }),
        [defaultMetadata],
    );

    const initialValues = useMemo(
        () => ({
            updatedCategories: selectedCategories,
            updatedMetadata: metadataList,
        }),
        [selectedCategories, metadataList],
    );

    const onSubmit = async (
        { updatedCategories, updatedMetadata }: FormEditState,
        { resetForm }: FormikHelpers<FormEditState>,
    ) => {
        const metadata: {
            [key: string]: Metadata;
        } = updatedMetadata.reduce(
            (result: { [key: string]: Metadata }, item) => {
                if (item.key.length > 0) {
                    if (!isNaN(Number(item.value))) {
                        result[item.key] = parseInt(item.value);
                    } else if (
                        item.value.toLowerCase() === 'true' ||
                        item.value.toLowerCase() === 'false'
                    ) {
                        result[item.key] = item.value.toLowerCase() === 'true';
                    } else {
                        result[item.key] = item.value;
                    }
                }
                return result;
            },
            {},
        );
        const { data: response } = await DatasetApi.edit(
            dataset.id,
            updatedCategories,
            metadata,
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

export default useFormikEdit;
