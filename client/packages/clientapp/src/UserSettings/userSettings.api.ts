import Api from '../common/api';

const baseURL = '/user/password';

interface IPassword {
    password: string;
    new_password: string;
    confirm_password: string;
}

export const changeUserPassword = async (password: IPassword) => {
    const url = baseURL;
    const { data: response } = await Api.post(url, { ...password });
    return response;
};
