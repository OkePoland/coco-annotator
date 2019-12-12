import * as Yup from 'yup';
import { FormikConfig, FormikHelpers } from 'formik';
import { useSnackbar } from 'notistack';

import * as UserSettingsApi from './userSettings.api';
import useAuthContext from '../common/hooks/useAuthContext';

interface FormCreateState {
    password: string;
    new_password: string;
    confirm_password: string;
}

export const useUserSettings = () => {
    const { getCurrentUser } = useAuthContext();
    const currentUser = getCurrentUser();

    if (!currentUser) {
        throw new Error('Expected current user to not be null');
    }

    const { name, username } = currentUser;
    const displayName = name ? name : username;

    return displayName;
};

export const useFormikCreate = (): FormikConfig<FormCreateState> => {
    const { enqueueSnackbar } = useSnackbar();
    const initialValues = {
        password: '',
        new_password: '',
        confirm_password: '',
    };
    const validationSchema = Yup.object({
        password: Yup.string()
            .min(5, 'Minimum length of 5 characters')
            .required('Required'),
        new_password: Yup.string()
            .min(5, 'Minimum length of 5 characters')
            .required('Required'),
        confirm_password: Yup.string()
            .min(5, 'Minimum length of 5 characters')
            .oneOf([Yup.ref('new_password'), null], 'Passwords must match')
            .required('Required'),
    });
    const onSubmit = async (
        values: FormCreateState,
        { resetForm }: FormikHelpers<FormCreateState>,
    ) => {
        const response = await UserSettingsApi.changeUserPassword(values);
        if (response.message) {
            enqueueSnackbar(response.message, { variant: 'error' });
        } else {
            enqueueSnackbar('Password has been changed', {
                variant: 'success',
            });
            resetForm();
        }
    };

    return {
        initialValues,
        validationSchema,
        onSubmit,
    };
};
